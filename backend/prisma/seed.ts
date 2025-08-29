import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'Audio Equipment',
        description: 'Professional audio equipment and accessories',
        slug: 'audio-equipment'
      },
    }),
    prisma.category.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: 'Audio Services',
        description: 'Professional audio services and consultation',
        slug: 'audio-services'
      },
    }),
  ]);

  // Seed products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'Professional Microphone',
        description: 'High-quality professional microphone for studio recording',
        price: 299.99,
        categoryId: 1,
        slug: 'professional-microphone',
        stock: 10
      },
    }),
    prisma.product.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: 'Audio Mixer',
        description: 'Professional audio mixer for live performances',
        price: 599.99,
        categoryId: 1,
        slug: 'audio-mixer',
        stock: 5
      },
    }),
  ]);

  console.log('Database seeded successfully');
  console.log('Categories:', categories.length);
  console.log('Products:', products.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });