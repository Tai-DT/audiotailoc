/**
 * Script to scrape products from phuctruongaudio.vn
 * 
 * Usage:
 *   npx ts-node scripts/scrape-phuctruongaudio.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

const OUTPUT_DIR = path.join(__dirname, '../data/phuctruongaudio');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'products.json');

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
  // Remove all non-digit characters except dots and commas
  const cleaned = priceText.replace(/[^\d.,]/g, '');
  // Replace comma with dot if present
  const normalized = cleaned.replace(/,/g, '');
  const price = parseFloat(normalized);
  return isNaN(price) ? 0 : Math.round(price * 100); // Convert to cents
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

    // Find product elements (adjust selector based on actual HTML structure)
    $('.product, .woocommerce-loop-product__link, .product-item, article.product').each((index, element) => {
      try {
        const $el = $(element);
        
        // Extract product name
        const name = $el.find('.product-title, .woocommerce-loop-product__title, h2, h3, .title').first().text().trim();
        if (!name) return;

        // Extract price
        const priceText = $el.find('.price, .woocommerce-Price-amount, .product-price').first().text().trim();
        const price = parsePrice(priceText);

        // Extract original price (if on sale)
        const originalPriceText = $el.find('.price del, .woocommerce-Price-amount del, .original-price').first().text().trim();
        const originalPrice = originalPriceText ? parsePrice(originalPriceText) : undefined;

        // Extract image
        const imageUrl = $el.find('img').first().attr('src') || 
                        $el.find('img').first().attr('data-src') ||
                        $el.find('img').first().attr('data-lazy-src') || '';

        // Extract product URL
        const productUrl = $el.find('a').first().attr('href') || 
                          $el.attr('href') || 
                          category.url;

        // Extract brand (if available)
        const brand = $el.find('.brand, .product-brand, [class*="brand"]').first().text().trim() || undefined;

        // Extract SKU (if available)
        const sku = $el.find('.sku, [class*="sku"]').first().text().trim() || undefined;

        if (name && price > 0) {
          products.push({
            name,
            slug: slugify(name),
            price,
            originalPrice,
            imageUrl: imageUrl.startsWith('http') ? imageUrl : imageUrl.startsWith('/') ? `https://phuctruongaudio.vn${imageUrl}` : imageUrl,
            brand,
            category: category.name,
            categorySlug: category.slug,
            url: productUrl.startsWith('http') ? productUrl : `https://phuctruongaudio.vn${productUrl}`,
            sku
          });
        }
      } catch (error) {
        console.error(`   ⚠️  Error parsing product ${index}:`, error);
      }
    });

    // If no products found with first selector, try alternative selectors
    if (products.length === 0) {
      console.log('   ⚠️  No products found with primary selector, trying alternatives...');
      
      // Try to find any product links
      $('a[href*="/product"], a[href*="/san-pham"]').each((index, element) => {
        const $el = $(element);
        const name = $el.text().trim() || $el.find('img').attr('alt') || '';
        if (name && name.length > 3) {
          const productUrl = $el.attr('href') || '';
          products.push({
            name,
            slug: slugify(name),
            price: 0, // Will need to scrape detail page
            category: category.name,
            categorySlug: category.slug,
            url: productUrl.startsWith('http') ? productUrl : `https://phuctruongaudio.vn${productUrl}`
          });
        }
      });
    }

    console.log(`   ✅ Found ${products.length} products`);
    return products;

  } catch (error: any) {
    console.error(`   ❌ Error scraping category ${category.name}:`, error.message);
    return [];
  }
}

async function scrapeAllCategories(): Promise<Product[]> {
  console.log('🚀 Starting scrape of phuctruongaudio.vn');
  console.log(`📁 Categories to scrape: ${CATEGORIES.length}\n`);

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
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`💾 Data saved to: ${OUTPUT_FILE}`);

    // Print summary by category
    console.log('\n📊 Products by category:');
    CATEGORIES.forEach(cat => {
      const count = products.filter(p => p.categorySlug === cat.slug).length;
      console.log(`   ${cat.name}: ${count} products`);
    });

    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Scraping failed:', error.message || error);
    process.exit(1);
  });



