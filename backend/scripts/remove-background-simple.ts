/**
 * Script to remove backgrounds from product images using Cloudinary transformations
 * 
 * This script uses Cloudinary's built-in transformations to remove backgrounds
 * 
 * Usage:
 *   npx ts-node scripts/remove-background-simple.ts
 *   npx ts-node scripts/remove-background-simple.ts --confirm
 */

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
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

async function removeBackgroundFromCloudinary(publicId: string): Promise<string | null> {
  try {
    // Use Cloudinary's background removal transformation
    // Note: This requires the Background Removal add-on
    const transformedUrl = cloudinary.url(publicId, {
      transformation: [
        {
          effect: 'e_background_removal',
          quality: 'auto',
          format: 'png'
        }
      ]
    });

    // Upload the transformed image back to replace the original
    const uploadResult = await cloudinary.uploader.upload(transformedUrl, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      format: 'png',
      folder: 'audiotailoc/products'
    });

    return uploadResult.secure_url || uploadResult.url || null;
  } catch (error: any) {
    // If background removal is not available, try alternative: make background transparent
    try {
      // Alternative: Use cutout or make background white/transparent
      const altUrl = cloudinary.url(publicId, {
        transformation: [
          {
            effect: 'make_transparent',
            threshold: 70,
            color: 'white'
          },
          {
            format: 'png'
          }
        ]
      });

      const uploadResult = await cloudinary.uploader.upload(altUrl, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
        format: 'png'
      });

      return uploadResult.secure_url || uploadResult.url || null;
    } catch (altError: any) {
      console.error(`   ⚠️  Background removal not available: ${altError.message}`);
      return null;
    }
  }
}

function extractPublicId(imageUrl: string, productSlug: string): string {
  // Try to extract from Cloudinary URL
  if (imageUrl.includes('cloudinary.com')) {
    const match = imageUrl.match(/\/v\d+\/(.+?)(?:\.[^.]+)?$/);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Fallback: construct from slug
  return `audiotailoc/products/products/${productSlug}`;
}

async function processAllProducts(confirm: boolean = false) {
  if (!confirm) {
    console.log('⚠️  WARNING: This will process product images to remove backgrounds!');
    console.log('⚠️  This may require Cloudinary Background Removal add-on!');
    console.log('\nTo proceed, run with --confirm flag:');
    console.log('  npx ts-node scripts/remove-background-simple.ts --confirm\n');
    process.exit(0);
  }

  console.log('🖼️  Starting background removal for product images...\n');

  try {
    const products = await prisma.products.findMany({
      where: {
        imageUrl: { not: null },
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true
      }
    });

    console.log(`📦 Found ${products.length} products with images\n`);

    if (products.length === 0) {
      console.log('✅ No products with images found.');
      return;
    }

    let processed = 0;
    let successful = 0;
    let failed = 0;
    const errors: Array<{ name: string; error: string }> = [];

    for (const product of products) {
      if (!product.imageUrl) continue;

      try {
        const publicId = extractPublicId(product.imageUrl, product.slug);
        
        process.stdout.write(`\r   Processing: ${processed + 1}/${products.length} - ${product.name.substring(0, 40)}...`);

        const processedUrl = await removeBackgroundFromCloudinary(publicId);

        if (processedUrl) {
          await prisma.products.update({
            where: { id: product.id },
            data: {
              imageUrl: processedUrl,
              images: JSON.stringify([processedUrl]),
              updatedAt: new Date()
            }
          });
          successful++;
        } else {
          failed++;
          errors.push({
            name: product.name,
            error: 'Background removal not available or failed'
          });
        }

        processed++;
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error: any) {
        failed++;
        errors.push({
          name: product.name,
          error: error.message || String(error)
        });
      }
    }

    console.log('\n\n📊 Processing Summary:');
    console.log(`   ✅ Successfully processed: ${successful} images`);
    console.log(`   ❌ Failed: ${failed} images`);
    console.log(`   📦 Total: ${processed} products`);

    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - ${err.name}: ${err.error}`);
      });
      if (errors.length > 10) {
        console.log(`   ... and ${errors.length - 10} more errors`);
      }
    }

    console.log('\n✅ Background removal completed!');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message || error);
    throw error;
  }
}

// Parse arguments
const args = process.argv.slice(2);
const confirm = args.includes('--confirm') || args.includes('-y') || args.includes('--yes');

// Run
processAllProducts(confirm)
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n🎉 Script completed!');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('\n❌ Script failed:', error.message || error);
    await prisma.$disconnect();
    process.exit(1);
  });



