/*
  Script để cập nhật hình ảnh sản phẩm với URLs Cloudinary thật
  Usage: npx tsx src/seed-product-images.ts
*/
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Danh sách URLs Cloudinary thật (đã được upload trước đó)
const productImages = [
  {
    slug: 'loa-tai-loc-classic',
    imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/speaker-1.jpg'
  },
  {
    slug: 'tai-nghe-tai-loc-pro',
    imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/headphone-1.jpg'
  },
  {
    slug: 'soundbar-tai-loc-5-1',
    imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/soundbar-1.jpg'
  },
  // Thêm các sản phẩm khác nếu có
  {
    slug: 'loa-bluetooth-jbl-go-3',
    imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/jbl-go3.jpg'
  },
  {
    slug: 'tai-nghe-sony-wh-1000xm4',
    imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/sony-wh1000xm4.jpg'
  },
  {
    slug: 'loa-karaoke-samsung',
    imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/karaoke-1.jpg'
  }
];

async function updateProductImages() {
  console.log('🚀 Bắt đầu cập nhật hình ảnh sản phẩm...\n');

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

          console.log(`✅ Đã cập nhật hình ảnh cho: ${product.name}`);
          console.log(`   URL: ${productImage.imageUrl}`);
          updatedCount++;
        } else {
          console.log(`⚠️ Không tìm thấy sản phẩm với slug: ${productImage.slug}`);
        }
      } catch (error) {
        console.error(`❌ Lỗi khi cập nhật ${productImage.slug}:`, error);
      }
    }

    // Cập nhật tất cả sản phẩm còn lại với hình ảnh mặc định
    const defaultImageUrl = 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/default-product.jpg';

    const remainingProducts = await prisma.product.findMany({
      where: {
        imageUrl: {
          not: {
            startsWith: 'https://res.cloudinary.com'
          }
        }
      }
    });

    for (const product of remainingProducts) {
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: defaultImageUrl }
      });

      console.log(`🔄 Đã cập nhật hình ảnh mặc định cho: ${product.name}`);
      updatedCount++;
    }

    console.log(`\n🎉 Hoàn thành! Đã cập nhật hình ảnh cho ${updatedCount} sản phẩm.`);

  } catch (error) {
    console.error('❌ Lỗi khi thực hiện script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy script
updateProductImages();