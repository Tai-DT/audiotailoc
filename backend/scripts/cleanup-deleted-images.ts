/**
 * Script to cleanup image URLs in database after deleting images from Cloudinary
 * 
 * Usage:
 *   npx ts-node scripts/cleanup-deleted-images.ts
 *   npx ts-node scripts/cleanup-deleted-images.ts --confirm
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function cleanupDeletedImages(confirm: boolean = false) {
  if (!confirm) {
    console.log('⚠️  WARNING: This will remove image URLs from products!');
    console.log('⚠️  Products that had images in Cloudinary will have their imageUrl set to null.');
    console.log('\nTo proceed, run with --confirm flag:');
    console.log('  npx ts-node scripts/cleanup-deleted-images.ts --confirm\n');
    process.exit(0);
  }

  console.log('🧹 Starting cleanup of deleted image URLs...\n');

  try {
    // Find all products with Cloudinary image URLs in the products folder
    const products = await prisma.products.findMany({
      where: {
        imageUrl: {
          contains: 'audiotailoc/products'
        },
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        imageUrl: true
      }
    });

    console.log(`📦 Found ${products.length} products with Cloudinary product images\n`);

    if (products.length === 0) {
      console.log('✅ No products to cleanup.');
      return;
    }

    let cleaned = 0;

    for (const product of products) {
      try {
        await prisma.products.update({
          where: { id: product.id },
          data: {
            imageUrl: null,
            images: null,
            updatedAt: new Date()
          }
        });
        cleaned++;
        process.stdout.write(`\r   ✅ Cleaned: ${cleaned}/${products.length} - ${product.name.substring(0, 40)}...`);
      } catch (error: any) {
        console.error(`\n   ❌ Error cleaning ${product.name}:`, error.message);
      }
    }

    console.log('\n\n📊 Cleanup Summary:');
    console.log(`   ✅ Cleaned: ${cleaned} products`);
    console.log('\n✅ Cleanup completed!');

  } catch (error: any) {
    console.error('\n❌ Error during cleanup:', error.message || error);
    throw error;
  }
}

const args = process.argv.slice(2);
const confirm = args.includes('--confirm') || args.includes('-y') || args.includes('--yes');

cleanupDeletedImages(confirm)
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



