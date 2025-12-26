/**
 * Script to scrape product detail pages for products that don't have images
 * 
 * Usage:
 *   npx ts-node scripts/scrape-missing-product-images.ts
 */

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

dotenv.config({ path: resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

// Configure Cloudinary
const cloudinaryUrl = process.env.CLOUDINARY_URL;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudinaryUrl) {
  cloudinary.config({ url: cloudinaryUrl, secure: true } as any);
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

const IMAGES_DIR = path.resolve(__dirname, '../data/phuctruongaudio/images');
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
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

async function uploadImageToCloudinary(imagePath: string, productSlug: string): Promise<string | null> {
  try {
    if (!fs.existsSync(imagePath)) {
      return null;
    }

    if (!cloudinaryUrl && !cloudName) {
      return null;
    }

    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'audiotailoc/products',
      public_id: `products/${productSlug}`,
      overwrite: true,
      resource_type: 'image'
    });

    return result.secure_url || result.url || null;
  } catch (error: any) {
    return null;
  }
}

/**
 * Extract product URL from scraped data or generate from slug
 */
function getProductUrl(product: any, scrapedProducts: any[]): string | null {
  // Try to find in scraped data
  const scraped = scrapedProducts.find(sp => {
    const spSlug = sp.slug?.toLowerCase() || '';
    const pSlug = product.slug.toLowerCase();
    return pSlug.includes(spSlug) || spSlug.includes(pSlug.split('-').slice(-3).join('-'));
  });
  
  if (scraped?.url) {
    return scraped.url;
  }
  
  // Try to extract from product name (basic heuristic)
  const nameSlug = product.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .slice(0, 5)
    .join('-');
  
  // Common URL patterns
  const possibleUrls = [
    `https://phuctruongaudio.vn/san-pham/${nameSlug}/`,
    `https://phuctruongaudio.vn/product/${nameSlug}/`,
    `https://phuctruongaudio.vn/${nameSlug}/`
  ];
  
  return possibleUrls[0]; // Return first guess
}

async function scrapeProductDetailImage(product: any, scrapedProducts: any[]): Promise<string | null> {
  try {
    // Get product URL
    const productUrl = getProductUrl(product, scrapedProducts);
    if (!productUrl) {
      return null;
    }

    console.log(`   📄 Scraping: ${product.name.substring(0, 50)}...`);

    const response = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000,
      validateStatus: (status) => status < 500 // Accept 404, etc.
    });

    if (response.status !== 200) {
      return null;
    }

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
      'img[src*="wp-content"]',
      '.wp-post-image'
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
    if (!imagePath) {
      return null;
    }

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadImageToCloudinary(imagePath, product.slug);
    return cloudinaryUrl;

  } catch (error: any) {
    return null;
  }
}

async function scrapeMissingProductImages() {
  console.log('🖼️  Starting to scrape images for products without images...\n');

  // Get products without images, limit to 200 to avoid timeout
  const productsWithoutImages = await prisma.products.findMany({
    where: { 
      isDeleted: false, 
      imageUrl: null 
    },
    select: {
      id: true,
      name: true,
      slug: true,
      categoryId: true
    },
    take: 200 // Limit to 200 products per run
  });

  console.log(`📦 Found ${productsWithoutImages.length} products without images (processing first 200)\n`);

  // Load scraped products data for URL matching
  const productsJsonPath = path.resolve(__dirname, '../data/phuctruongaudio/products.json');
  let scrapedProducts: any[] = [];
  if (fs.existsSync(productsJsonPath)) {
    scrapedProducts = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
    console.log(`📄 Loaded ${scrapedProducts.length} scraped products for reference\n`);
  }

  let downloaded = 0;
  let uploaded = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < productsWithoutImages.length; i++) {
    const product = productsWithoutImages[i];
    
    try {
      process.stdout.write(`\r   Processing: ${i + 1}/${productsWithoutImages.length} | ✅ ${uploaded} | ⏭️  ${skipped} | ❌ ${failed} | ${product.name.substring(0, 40)}...`);

      const cloudinaryImageUrl = await scrapeProductDetailImage(product, scrapedProducts);

      if (cloudinaryImageUrl) {
        // Update product in database
        await prisma.products.update({
          where: { id: product.id },
          data: {
            imageUrl: cloudinaryImageUrl,
            images: JSON.stringify([cloudinaryImageUrl]),
            updatedAt: new Date()
          }
        });
        uploaded++;
        downloaded++;
      } else {
        skipped++;
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (error: any) {
      failed++;
    }
  }

  console.log('\n\n📊 Scraping Summary:');
  console.log(`   ✅ Images downloaded: ${downloaded}`);
  console.log(`   📤 Images uploaded: ${uploaded}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📦 Total processed: ${productsWithoutImages.length} products`);
}

async function main() {
  try {
    await scrapeMissingProductImages();
  } catch (error: any) {
    console.error('\n❌ Script failed:', error.message || error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message || error);
    process.exit(1);
  });
