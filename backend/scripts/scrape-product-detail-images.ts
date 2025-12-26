/**
 * Script to scrape product detail pages to get high-quality images
 * This script visits each product URL and extracts images from the detail page
 * 
 * Usage:
 *   npx ts-node scripts/scrape-product-detail-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

dotenv.config({ path: resolve(__dirname, '../.env') });

const DATA_DIR = path.resolve(__dirname, '../data/phuctruongaudio');
const IMAGES_DIR = path.join(DATA_DIR, 'images');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

interface Product {
  name: string;
  slug: string;
  url: string;
  imageUrl?: string;
  imagePath?: string;
}

async function downloadImage(imageUrl: string, productSlug: string): Promise<string | null> {
  try {
    if (!imageUrl || imageUrl.trim() === '') {
      return null;
    }

    // Fix relative URLs
    if (imageUrl.startsWith('//')) {
      imageUrl = 'https:' + imageUrl;
    } else if (imageUrl.startsWith('/')) {
      imageUrl = 'https://phuctruongaudio.vn' + imageUrl;
    }

    // Validate URL
    try {
      new URL(imageUrl);
    } catch {
      return null;
    }

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.data || response.data.length === 0) {
      return null;
    }

    // Get file extension
    const contentType = response.headers['content-type'] || '';
    let extension = 'jpg';
    if (contentType.includes('png')) extension = 'png';
    else if (contentType.includes('gif')) extension = 'gif';
    else if (contentType.includes('webp')) extension = 'webp';
    else {
      const urlExt = path.extname(new URL(imageUrl).pathname).toLowerCase().replace('.', '');
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(urlExt)) {
        extension = urlExt;
      }
    }

    const filename = `${productSlug}.${extension}`;
    const filepath = path.join(IMAGES_DIR, filename);

    fs.writeFileSync(filepath, response.data);
    return filepath;
  } catch (error: any) {
    return null;
  }
}

async function scrapeProductDetail(product: Product): Promise<string | null> {
  try {
    if (!product.url || product.url === '') {
      return null;
    }

    // Fix URL
    let productUrl = product.url;
    if (productUrl.startsWith('/')) {
      productUrl = 'https://phuctruongaudio.vn' + productUrl;
    }

    console.log(`   📄 Scraping: ${product.name.substring(0, 50)}...`);

    const response = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);

    // Try multiple selectors for product images
    const imageSelectors = [
      '.product-image img',
      '.woocommerce-product-gallery__image img',
      '.product-gallery img',
      '.product-images img',
      '.entry-content img',
      'article img',
      '.product-detail img',
      'img[src*="product"]',
      'img[src*="wp-content"]'
    ];

    let imageUrl = '';
    let imageFound = false;

    for (const selector of imageSelectors) {
      const $img = $(selector).first();
      if ($img.length > 0) {
        imageUrl = $img.attr('src') || 
                   $img.attr('data-src') ||
                   $img.attr('data-lazy-src') ||
                   $img.attr('data-original') ||
                   $img.attr('srcset')?.split(' ')[0] || '';
        
        if (imageUrl && imageUrl.length > 10) {
          // Remove size parameters from WordPress images
          imageUrl = imageUrl.replace(/-\d+x\d+\.(jpg|jpeg|png|gif|webp)$/i, '.$1');
          imageFound = true;
          break;
        }
      }
    }

    // If no image found, try to find any large image
    if (!imageFound) {
      $('img').each((index, element) => {
        const $img = $(element);
        const src = $img.attr('src') || $img.attr('data-src') || '';
        if (src && (src.includes('wp-content') || src.includes('product') || src.includes('uploads'))) {
          // Prefer larger images (check width attribute or class)
          const width = parseInt($img.attr('width') || '0');
          if (width > 200 || !imageUrl) {
            imageUrl = src.replace(/-\d+x\d+\.(jpg|jpeg|png|gif|webp)$/i, '.$1');
            imageFound = true;
          }
        }
      });
    }

    if (!imageUrl || imageUrl.length < 10) {
      return null;
    }

    // Download image
    const imagePath = await downloadImage(imageUrl, product.slug);
    return imagePath;

  } catch (error: any) {
    return null;
  }
}

async function scrapeAllProductDetails() {
  console.log('🖼️  Starting to scrape product detail pages for images...\n');

  try {
    // Read existing products.json
    const productsJsonPath = path.join(DATA_DIR, 'products.json');
    if (!fs.existsSync(productsJsonPath)) {
      console.error('❌ products.json not found! Please run scrape script first.');
      return;
    }

    const products: Product[] = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
    console.log(`📄 Loaded ${products.length} products\n`);

    // Filter products without local images
    const productsWithoutImages = products.filter(p => {
      if (!p.imagePath) return true;
      return !fs.existsSync(p.imagePath);
    });

    console.log(`📦 Found ${productsWithoutImages.length} products without local images\n`);
    console.log('🔄 Starting to scrape detail pages...\n');

    let downloaded = 0;
    let failed = 0;
    const updatedProducts = [...products];

    for (let i = 0; i < productsWithoutImages.length; i++) {
      const product = productsWithoutImages[i];
      
      try {
        process.stdout.write(`\r   Processing: ${i + 1}/${productsWithoutImages.length} | ✅ ${downloaded} | ❌ ${failed} | ${product.name.substring(0, 40)}...`);

        const imagePath = await scrapeProductDetail(product);

        if (imagePath) {
          // Update product in array
          const productIndex = updatedProducts.findIndex(p => p.slug === product.slug);
          if (productIndex !== -1) {
            updatedProducts[productIndex].imagePath = imagePath;
            updatedProducts[productIndex].imageUrl = imagePath; // Will be updated with Cloudinary URL later
          }
          downloaded++;
        } else {
          failed++;
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error: any) {
        failed++;
      }
    }

    // Save updated products
    fs.writeFileSync(productsJsonPath, JSON.stringify(updatedProducts, null, 2));

    console.log('\n\n📊 Scraping Summary:');
    console.log(`   ✅ Images downloaded: ${downloaded}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📦 Total processed: ${productsWithoutImages.length} products`);
    console.log(`\n💾 Updated products.json with new image paths`);

  } catch (error: any) {
    console.error('\n❌ Error during scraping:', error.message || error);
    throw error;
  }
}

// Run the script
scrapeAllProductDetails()
  .then(() => {
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message || error);
    process.exit(1);
  });
