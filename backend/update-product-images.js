/*
  Script đơn giản để cập nhật hình ảnh sản phẩm
  Usage: node update-product-images.js
*/
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Danh sách URLs placeholder hoạt động
const productImages = [
  {
    slug: 'cuc-day-cong-suat-e3-pa-612',
    imageUrl: 'https://picsum.photos/400/400?random=1'
  },
  {
    slug: 'dan-karaoke-gia-dinh-caf',
    imageUrl: 'https://picsum.photos/400/400?random=2'
  },
  {
    slug: 'dan-karaoke-gia-dinh-e3-combo-1',
    imageUrl: 'https://picsum.photos/400/400?random=3'
  },
  {
    slug: 'loa-e3-ds-12-ii',
    imageUrl: 'https://picsum.photos/400/400?random=4'
  },
  {
    slug: 'dan-karaoke-gia-dinh-vip-2',
    imageUrl: 'https://picsum.photos/400/400?random=5'
  },
  {
    slug: 'dan-karaoke-gia-dinh-e3-combo-vip-1',
    imageUrl: 'https://picsum.photos/400/400?random=6'
  },
  {
    slug: 'dan-karaoke-gia-dinh-caf-vip-2',
    imageUrl: 'https://picsum.photos/400/400?random=7'
  },
  {
    slug: 'dan-combo-caf-super-vip-cho-gia-dinh',
    imageUrl: 'https://picsum.photos/400/400?random=8'
  },
  {
    slug: 'dan-karaoke-kinh-doanh-caf-vip-1',
    imageUrl: 'https://picsum.photos/400/400?random=9'
  }
];

async function updateProductImages() {
  console.log('Starting image update...');

  try {
    let updatedCount = 0;

    for (const productImage of productImages) {
      try {
        // Tìm sản phẩm theo slug
        const product = await prisma.product.findUnique({
          where: { slug: productImage.slug }
        });

        if (product) {
          // Cập nhật hình ảnh
          await prisma.product.update({
            where: { id: product.id },
            data: { imageUrl: productImage.imageUrl }
          });

          console.log(`Updated: ${product.name}`);
          console.log(`   URL: ${productImage.imageUrl}`);
          updatedCount++;
        } else {
          console.log(`Not found: ${productImage.slug}`);
        }
      } catch (error) {
        console.error(`Error updating ${productImage.slug}:`, error.message);
      }
    }

    console.log(`\nCompleted! Updated images for ${updatedCount} products.`);

  } catch (error) {
    console.error('Script error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy script
updateProductImages().catch(console.error);