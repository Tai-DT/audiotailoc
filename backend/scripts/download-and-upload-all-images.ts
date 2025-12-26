/**
 * Script to download images from URLs and upload to Cloudinary for products without images
 * 
 * Usage:
 *   npx ts-node scripts/download-and-upload-all-images.ts
 */

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';

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

async function downloadAndUploadImage(imageUrl: string, productSlug: string): Promise<string | null> {
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

    // Download image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      validateStatus: (status) => status < 400
    });

    if (!response.data || response.data.length === 0) {
      return null;
    }

    // Upload to Cloudinary using upload_stream
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'audiotailoc/products',
          public_id: `products/${productSlug}`,
          overwrite: true,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            resolve(null);
          } else {
            resolve(result?.secure_url || result?.url || null);
          }
        }
      );

      uploadStream.end(Buffer.from(response.data));
    });
  } catch (error: any) {
    return null;
  }
}

async function processAllProducts() {
  console.log('🖼️  Starting download and upload of all product images...\n');

  try {
    // Read scraped products
    const productsJsonPath = path.resolve(__dirname, '../data/phuctruongaudio/products.json');
    if (!fs.existsSync(productsJsonPath)) {
      console.error('❌ products.json not found! Please run scrape script first.');
      return;
    }

    const scrapedProducts = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
    console.log(`📄 Loaded ${scrapedProducts.length} products from scraped data\n`);

    // Get all products from database
    const dbProducts = await prisma.products.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true
      }
    });

    console.log(`📦 Found ${dbProducts.length} products in database\n`);

    // Create a map of slug to scraped product data
    const productMap = new Map<string, any>();
    scrapedProducts.forEach((p: any) => {
      // Try multiple slug variations
      const baseSlug = p.slug;
      productMap.set(baseSlug, p);
      
      // Also try with category prefix
      if (p.categorySlug) {
        const fullSlug = `${p.categorySlug}-${baseSlug}`;
        productMap.set(fullSlug, p);
      }
    });

    let processed = 0;
    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const product of dbProducts) {
      try {
        // Skip if already has image
        if (product.imageUrl && product.imageUrl.includes('cloudinary.com')) {
          skipped++;
          continue;
        }

        // Find matching scraped product
        let productData = productMap.get(product.slug);
        
        // Try to extract base slug
        if (!productData) {
          const slugParts = product.slug.split('-');
          for (let i = slugParts.length - 1; i >= 0; i--) {
            const testSlug = slugParts.slice(i).join('-');
            if (productMap.has(testSlug)) {
              productData = productMap.get(testSlug);
              break;
            }
          }
        }

        // Try name matching as fallback
        if (!productData) {
          const nameMatch = scrapedProducts.find((p: any) => 
            p.name.toLowerCase().includes(product.name.toLowerCase().substring(0, 30)) ||
            product.name.toLowerCase().includes(p.name.toLowerCase().substring(0, 30))
          );
          if (nameMatch) {
            productData = nameMatch;
          }
        }

        if (!productData || !productData.imageUrl) {
          failed++;
          process.stdout.write(`\r   Processing: ${processed + 1}/${dbProducts.length} | ✅ ${uploaded} | ⏭️  ${skipped} | ❌ ${failed} | ${product.name.substring(0, 30)}...`);
          processed++;
          continue;
        }

        process.stdout.write(`\r   Processing: ${processed + 1}/${dbProducts.length} | ✅ ${uploaded} | ⏭️  ${skipped} | ❌ ${failed} | ${product.name.substring(0, 30)}...`);

        // Download and upload image
        const cloudinaryImageUrl = await downloadAndUploadImage(productData.imageUrl, product.slug);

        if (cloudinaryImageUrl) {
          // Update product
          await prisma.products.update({
            where: { id: product.id },
            data: {
              imageUrl: cloudinaryImageUrl,
              images: JSON.stringify([cloudinaryImageUrl]),
              updatedAt: new Date()
            }
          });
          uploaded++;
        } else {
          failed++;
        }

        processed++;
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error: any) {
        failed++;
        processed++;
      }
    }

    console.log('\n\n📊 Processing Summary:');
    console.log(`   ✅ Successfully uploaded: ${uploaded} images`);
    console.log(`   ⏭️  Skipped (already have images): ${skipped} products`);
    console.log(`   ❌ Failed: ${failed} images`);
    console.log(`   📦 Total processed: ${processed} products`);

  } catch (error: any) {
    console.error('\n❌ Error during processing:', error.message || error);
    throw error;
  }
}

// Run the script
processAllProducts()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('\n❌ Script failed:', error.message || error);
    await prisma.$disconnect();
    process.exit(1);
  });

