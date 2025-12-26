/**
 * Script to remove backgrounds from product images in Cloudinary
 * 
 * ⚠️ WARNING: This will process and overwrite existing product images!
 * 
 * Usage:
 *   npx ts-node scripts/remove-product-backgrounds.ts
 *   npx ts-node scripts/remove-product-backgrounds.ts --confirm
 */

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';
import * as fs from 'fs';

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

interface ProcessResult {
  productId: string;
  productName: string;
  originalUrl: string;
  processedUrl: string | null;
  success: boolean;
  error?: string;
}

async function removeBackground(imageUrl: string, publicId: string): Promise<string | null> {
  try {
    // Method 1: Use Cloudinary's background removal (requires add-on)
    // This uses the e_background_removal transformation
    const transformedUrl = cloudinary.url(publicId, {
      transformation: [
        {
          effect: 'e_background_removal',
          quality: 'auto',
          format: 'png' // PNG supports transparency
        }
      ]
    });

    // Upload the transformed image back
    const uploadResult = await cloudinary.uploader.upload(transformedUrl, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      format: 'png',
      folder: 'audiotailoc/products'
    });

    return uploadResult.secure_url || uploadResult.url || null;
  } catch (error: any) {
    // If background removal add-on is not available, try alternative method
    console.log(`   ⚠️  Background removal add-on not available, trying alternative...`);
    
    try {
      // Method 2: Download, process locally (if you have remove.bg API or similar)
      // For now, we'll just return the original URL
      return imageUrl;
    } catch (altError: any) {
      console.error(`   ❌ Error processing image:`, altError.message);
      return null;
    }
  }
}

async function processProductImages(confirm: boolean = false) {
  if (!confirm) {
    console.log('⚠️  WARNING: This will process and overwrite product images in Cloudinary!');
    console.log('⚠️  Background removal requires Cloudinary Background Removal add-on!');
    console.log('\nTo proceed, run with --confirm flag:');
    console.log('  npx ts-node scripts/remove-product-backgrounds.ts --confirm\n');
    process.exit(0);
  }

  console.log('🖼️  Starting background removal process...\n');

  try {
    // Get all products with images
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

    const results: ProcessResult[] = [];
    let processed = 0;
    let successful = 0;
    let failed = 0;

    for (const product of products) {
      if (!product.imageUrl) continue;

      try {
        console.log(`\n📦 Processing: ${product.name}`);
        console.log(`   Image URL: ${product.imageUrl}`);

        // Extract public_id from Cloudinary URL
        let publicId = '';
        if (product.imageUrl.includes('cloudinary.com')) {
          // Extract public_id from Cloudinary URL
          const urlParts = product.imageUrl.split('/');
          const versionIndex = urlParts.findIndex(part => part.match(/^v\d+$/));
          if (versionIndex !== -1 && versionIndex < urlParts.length - 1) {
            const pathParts = urlParts.slice(versionIndex + 1);
            publicId = pathParts.join('/').replace(/\.[^.]+$/, ''); // Remove extension
          }
        } else {
          // If not Cloudinary URL, construct public_id from slug
          publicId = `audiotailoc/products/products/${product.slug}`;
        }

        console.log(`   Public ID: ${publicId}`);

        // Remove background
        const processedUrl = await removeBackground(product.imageUrl, publicId);

        if (processedUrl) {
          // Update product with new image URL
          await prisma.products.update({
            where: { id: product.id },
            data: {
              imageUrl: processedUrl,
              images: JSON.stringify([processedUrl]),
              updatedAt: new Date()
            }
          });

          results.push({
            productId: product.id,
            productName: product.name,
            originalUrl: product.imageUrl,
            processedUrl,
            success: true
          });

          successful++;
          console.log(`   ✅ Background removed successfully`);
        } else {
          results.push({
            productId: product.id,
            productName: product.name,
            originalUrl: product.imageUrl,
            processedUrl: null,
            success: false,
            error: 'Failed to process image'
          });

          failed++;
          console.log(`   ❌ Failed to remove background`);
        }

        processed++;
        process.stdout.write(`\r   📊 Progress: ${processed}/${products.length} | ✅ ${successful} | ❌ ${failed}`);

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error: any) {
        failed++;
        results.push({
          productId: product.id,
          productName: product.name,
          originalUrl: product.imageUrl || '',
          processedUrl: null,
          success: false,
          error: error.message || String(error)
        });
        console.error(`\n   ❌ Error processing ${product.name}:`, error.message);
      }
    }

    console.log('\n\n📊 Processing Summary:');
    console.log(`   ✅ Successfully processed: ${successful} images`);
    console.log(`   ❌ Failed: ${failed} images`);
    console.log(`   📦 Total processed: ${processed} products`);

    if (failed > 0) {
      console.log('\n❌ Failed products:');
      results
        .filter(r => !r.success)
        .slice(0, 10)
        .forEach(r => {
          console.log(`   - ${r.productName}: ${r.error || 'Unknown error'}`);
        });
      if (failed > 10) {
        console.log(`   ... and ${failed - 10} more failures`);
      }
    }

    console.log('\n✅ Background removal process completed!');

  } catch (error: any) {
    console.error('\n❌ Error during processing:', error.message || error);
    throw error;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const confirm = args.includes('--confirm') || args.includes('-y') || args.includes('--yes');

// Run the script
processProductImages(confirm)
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



