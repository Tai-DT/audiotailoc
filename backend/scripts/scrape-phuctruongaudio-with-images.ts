/**
 * Script to scrape products from phuctruongaudio.vn and download images
 * 
 * Usage:
 *   npx ts-node scripts/scrape-phuctruongaudio-with-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

const OUTPUT_DIR = path.join(__dirname, '../data/phuctruongaudio');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images');

// 8 categories from the website
const CATEGORIES = [
  {
    name: 'DÀN KARAOKE',
    slug: 'dan-karaoke',
    url: 'https://phuctruongaudio.vn/dan-karaoke/'
  },
  {
    name: 'MIXER / VANG SỐ',
    slug: 'mixer-vang-so',
    url: 'https://phuctruongaudio.vn/mixer-vang-so/'
  },
  {
    name: 'ĐẦU KARAOKE / CD',
    slug: 'dau-karaoke-cd',
    url: 'https://phuctruongaudio.vn/dau-karaoke-cd/'
  },
  {
    name: 'AMPLY – CỤC ĐẨY',
    slug: 'amply-cuc-day',
    url: 'https://phuctruongaudio.vn/amply-cuc-day/'
  },
  {
    name: 'Loa Soundbar',
    slug: 'loa-soundbar',
    url: 'https://phuctruongaudio.vn/loa-soundbar/'
  },
  {
    name: 'LOA – LOA SUB',
    slug: 'loa-loa-sub',
    url: 'https://phuctruongaudio.vn/loa-loa-sub/'
  },
  {
    name: 'MICRO KARAOKE KHÔNG DÂY',
    slug: 'micro-karaoke-khong-day',
    url: 'https://phuctruongaudio.vn/micro-karaoke-khong-day/'
  },
  {
    name: 'Hàng Thanh Lý – Hàng Cũ',
    slug: 'hang-thanh-ly-hang-cu',
    url: 'https://phuctruongaudio.vn/hang-thanh-ly-hang-cu/'
  }
];

interface Product {
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description?: string;
  imageUrl?: string;
  imagePath?: string; // Local path to downloaded image
  brand?: string;
  category: string;
  categorySlug: string;
  url: string;
  sku?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parsePrice(priceText: string): number {
  const cleaned = priceText.replace(/[^\d.,]/g, '');
  const normalized = cleaned.replace(/,/g, '');
  const price = parseFloat(normalized);
  return isNaN(price) ? 0 : Math.round(price * 100);
}

async function downloadImage(imageUrl: string, productSlug: string): Promise<string | null> {
  try {
    if (!imageUrl || !imageUrl.startsWith('http')) {
      return null;
    }

    // Fix relative URLs
    if (imageUrl.startsWith('//')) {
      imageUrl = 'https:' + imageUrl;
    } else if (imageUrl.startsWith('/')) {
      imageUrl = 'https://phuctruongaudio.vn' + imageUrl;
    }

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Get file extension from URL or Content-Type
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
    console.error(`   ⚠️  Error downloading image ${imageUrl}:`, error.message);
    return null;
  }
}

async function scrapeCategory(category: typeof CATEGORIES[0]): Promise<Product[]> {
  console.log(`\n📦 Scraping category: ${category.name}`);
  console.log(`   URL: ${category.url}`);

  try {
    const response = await axios.get(category.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);
    const products: Product[] = [];

    // Try multiple selectors to find products
    const selectors = [
      '.product',
      '.woocommerce-loop-product__link',
      '.product-item',
      'article.product',
      '.product-card',
      '[class*="product"]'
    ];

    let foundProducts = false;

    for (const selector of selectors) {
      $(selector).each((index, element) => {
        try {
          const $el = $(element);
          
          // Extract product name
          const name = $el.find('.product-title, .woocommerce-loop-product__title, h2, h3, .title, .name').first().text().trim();
          if (!name || name.length < 3) return;

          // Extract price
          const priceText = $el.find('.price, .woocommerce-Price-amount, .product-price, [class*="price"]').first().text().trim();
          const price = parsePrice(priceText);

          // Extract original price (if on sale)
          const originalPriceText = $el.find('.price del, .woocommerce-Price-amount del, .original-price, del').first().text().trim();
          const originalPrice = originalPriceText ? parsePrice(originalPriceText) : undefined;

          // Extract image
          let imageUrl = $el.find('img').first().attr('src') || 
                        $el.find('img').first().attr('data-src') ||
                        $el.find('img').first().attr('data-lazy-src') ||
                        $el.find('img').first().attr('data-original') || '';

          // Extract product URL
          const productUrl = $el.find('a').first().attr('href') || 
                            $el.attr('href') || 
                            category.url;

          // Extract brand
          const brand = $el.find('.brand, .product-brand, [class*="brand"]').first().text().trim() || undefined;

          // Extract SKU
          const sku = $el.find('.sku, [class*="sku"]').first().text().trim() || undefined;

          if (name && price > 0) {
            const slug = slugify(name);
            products.push({
              name,
              slug,
              price,
              originalPrice,
              imageUrl,
              brand,
              category: category.name,
              categorySlug: category.slug,
              url: productUrl.startsWith('http') ? productUrl : `https://phuctruongaudio.vn${productUrl}`,
              sku
            });
            foundProducts = true;
          }
        } catch (error) {
          // Continue to next product
        }
      });

      if (foundProducts) break;
    }

    // If still no products, try to find product links
    if (products.length === 0) {
      console.log('   ⚠️  No products found with standard selectors, trying alternative method...');
      
      $('a[href*="/product"], a[href*="/san-pham"], a[href*="phuctruongaudio.vn"]').each((index, element) => {
        const $el = $(element);
        const name = $el.text().trim() || $el.find('img').attr('alt') || '';
        if (name && name.length > 3 && name.length < 200) {
          const productUrl = $el.attr('href') || '';
          const slug = slugify(name);
          products.push({
            name,
            slug,
            price: 0, // Will need to scrape detail page
            category: category.name,
            categorySlug: category.slug,
            url: productUrl.startsWith('http') ? productUrl : `https://phuctruongaudio.vn${productUrl}`
          });
        }
      });
    }

    console.log(`   ✅ Found ${products.length} products`);

    // Download images for each product
    if (products.length > 0) {
      console.log(`   📥 Downloading images...`);
      for (const product of products) {
        if (product.imageUrl) {
          const imagePath = await downloadImage(product.imageUrl, product.slug);
          if (imagePath) {
            product.imagePath = imagePath;
            process.stdout.write(`\r   📥 Downloaded: ${product.name.substring(0, 40)}...`);
          }
          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      console.log(`\n   ✅ Images downloaded`);
    }

    return products;

  } catch (error: any) {
    console.error(`   ❌ Error scraping category ${category.name}:`, error.message);
    return [];
  }
}

async function scrapeAllCategories(): Promise<Product[]> {
  console.log('🚀 Starting scrape of phuctruongaudio.vn');
  console.log(`📁 Categories to scrape: ${CATEGORIES.length}\n`);

  // Create images directory
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const allProducts: Product[] = [];

  for (const category of CATEGORIES) {
    const products = await scrapeCategory(category);
    allProducts.push(...products);
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return allProducts;
}

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Run the scraper
scrapeAllCategories()
  .then((products) => {
    console.log(`\n✅ Scraping completed!`);
    console.log(`📊 Total products found: ${products.length}`);

    // Save to JSON file
    const outputFile = path.join(OUTPUT_DIR, 'products.json');
    fs.writeFileSync(outputFile, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`💾 Data saved to: ${outputFile}`);

    // Print summary by category
    console.log('\n📊 Products by category:');
    CATEGORIES.forEach(cat => {
      const count = products.filter(p => p.categorySlug === cat.slug).length;
      const withImages = products.filter(p => p.categorySlug === cat.slug && p.imagePath).length;
      console.log(`   ${cat.name}: ${count} products (${withImages} with images)`);
    });

    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Scraping failed:', error.message || error);
    process.exit(1);
  });



