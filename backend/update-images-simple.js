const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateProductImages() {
  console.log('Starting image update...');

  const productUpdates = [
    { slug: 'cuc-day-cong-suat-e3-pa-612', imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/speaker-1.jpg' },
    { slug: 'dan-karaoke-gia-dinh-caf', imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/soundbar-1.jpg' },
    { slug: 'dan-karaoke-gia-dinh-e3-combo-1', imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/jbl-go3.jpg' },
    { slug: 'loa-e3-ds-12-ii', imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/speaker-1.jpg' },
    { slug: 'dan-karaoke-gia-dinh-vip-2', imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/headphone-1.jpg' },
    { slug: 'dan-karaoke-gia-dinh-e3-combo-vip-1', imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/soundbar-1.jpg' },
    { slug: 'dan-karaoke-gia-dinh-caf-vip-2', imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/jbl-go3.jpg' },
    { slug: 'dan-combo-caf-super-vip-cho-gia-dinh', imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/speaker-1.jpg' },
    { slug: 'dan-karaoke-kinh-doanh-caf-vip-1', imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/headphone-1.jpg' }
  ];

  try {
    let updatedCount = 0;

    for (const update of productUpdates) {
      const product = await prisma.product.findUnique({
        where: { slug: update.slug }
      });

      if (product) {
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl: update.imageUrl }
        });
        console.log(`Updated: ${product.name}`);
        updatedCount++;
      } else {
        console.log(`Not found: ${update.slug}`);
      }
    }

    console.log(`Completed! Updated ${updatedCount} products.`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateProductImages();