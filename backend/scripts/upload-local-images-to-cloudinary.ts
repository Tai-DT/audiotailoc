/**
 * Script to upload local images directly to Cloudinary and update database
 * 
 * Usage:
 *   npx ts-node scripts/upload-local-images-to-cloudinary.ts
 */

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

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
} else {
  console.error('❌ Cloudinary is not configured!');
  process.exit(1);
}

async function uploadImageToCloudinary(imagePath: string, productSlug: string): Promise<string | null> {
  try {
    if (!fs.existsSync(imagePath)) {
      return null;
    }

    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'audiotailoc/products',
      public_id: `products/${productSlug}`,
      overwrite: true,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto'
    });

    return result.secure_url || result.url || null;
  } catch (error: any) {
    console.error(`   ❌ Error uploading ${path.basename(imagePath)}:`, error.message);
    return null;
  }
}

async function uploadAllLocalImages() {
  console.log('🖼️  Starting upload of local images to Cloudinary...\n');

  try {
    // Read scraped products JSON
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
      const baseSlug = p.slug;
      productMap.set(baseSlug, p);
      
      if (p.categorySlug) {
        const fullSlug = `${p.categorySlug}-${baseSlug}`;
        productMap.set(fullSlug, p);
      }
    });

    // Get all local image files
    const imagesDir = path.resolve(__dirname, '../data/phuctruongaudio/images');
    if (!fs.existsSync(imagesDir)) {
      console.error('❌ Images directory not found!');
      return;
    }

    const imageFiles = fs.readdirSync(imagesDir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        path: path.join(imagesDir, file),
        slug: file.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
      }));

    console.log(`📁 Found ${imageFiles.length} local image files\n`);

    let processed = 0;
    let uploaded = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;

    // Process each image file
    for (const imageFile of imageFiles) {
      try {
        // Find matching product in database using improved matching logic
        let product = dbProducts.find(p => {
          const dbSlug = p.slug.toLowerCase();
          const imageSlug = imageFile.slug.toLowerCase();
          
          // 1. Exact match
          if (dbSlug === imageSlug) {
            return true;
          }
          
          // 2. Database slug ends with image slug (e.g., "dan-karaoke-jbl-eon-710" matches "jbl-eon-710")
          if (dbSlug.endsWith(`-${imageSlug}`) || dbSlug.endsWith(imageSlug)) {
            return true;
          }
          
          // 3. Database slug contains image slug (e.g., "dan-karaoke-jbl-eon-710-abc123" contains "jbl-eon-710")
          if (dbSlug.includes(imageSlug)) {
            return true;
          }
          
          // 4. Extract base slug from database (last part after category)
          const slugParts = dbSlug.split('-');
          // Try last 2-5 parts as they might be the product name
          for (let i = Math.max(1, slugParts.length - 5); i < slugParts.length; i++) {
            const testSlug = slugParts.slice(i).join('-');
            if (testSlug === imageSlug || imageSlug.includes(testSlug) || testSlug.includes(imageSlug)) {
              return true;
            }
          }
          
          return false;
        });

        // If not found, try to match with scraped data
        if (!product) {
          const scrapedProduct = productMap.get(imageFile.slug);
          if (scrapedProduct) {
            // Find product by name similarity
            product = dbProducts.find(p => {
              const dbName = p.name.toLowerCase();
              const scrapedName = scrapedProduct.name.toLowerCase();
              
              // Check if names are similar (at least 70% match)
              const minLength = Math.min(dbName.length, scrapedName.length);
              const maxLength = Math.max(dbName.length, scrapedName.length);
              if (minLength < 10) return false; // Too short to match
              
              // Check if one contains the other
              if (dbName.includes(scrapedName.substring(0, Math.min(30, scrapedName.length))) ||
                  scrapedName.includes(dbName.substring(0, Math.min(30, dbName.length)))) {
                return true;
              }
              
              return false;
            });
          }
        }

        if (!product) {
          skipped++;
          process.stdout.write(`\r   Processing: ${processed + 1}/${imageFiles.length} | ✅ ${uploaded} | 🔄 ${updated} | ⏭️  ${skipped} | ❌ ${failed} | ${imageFile.filename}...`);
          processed++;
          continue;
        }

        // Skip if already has Cloudinary image
        if (product.imageUrl && product.imageUrl.includes('cloudinary.com')) {
          skipped++;
          process.stdout.write(`\r   Processing: ${processed + 1}/${imageFiles.length} | ✅ ${uploaded} | 🔄 ${updated} | ⏭️  ${skipped} | ❌ ${failed} | ${product.name.substring(0, 30)}...`);
          processed++;
          continue;
        }

        process.stdout.write(`\r   Processing: ${processed + 1}/${imageFiles.length} | ✅ ${uploaded} | 🔄 ${updated} | ⏭️  ${skipped} | ❌ ${failed} | ${product.name.substring(0, 30)}...`);

        // Upload image to Cloudinary
        const cloudinaryImageUrl = await uploadImageToCloudinary(imageFile.path, product.slug);

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

          if (product.imageUrl) {
            updated++;
          } else {
            uploaded++;
          }
        } else {
          failed++;
        }

        processed++;
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error: any) {
        failed++;
        processed++;
        console.error(`\n   ❌ Error processing ${imageFile.filename}:`, error.message);
      }
    }

    console.log('\n\n📊 Upload Summary:');
    console.log(`   ✅ New images uploaded: ${uploaded}`);
    console.log(`   🔄 Images updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped} (already have images or no matching product)`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📦 Total processed: ${processed} images`);

  } catch (error: any) {
    console.error('\n❌ Error during processing:', error.message || error);
    throw error;
  }
}

// Run the script
uploadAllLocalImages()
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
