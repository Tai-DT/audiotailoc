import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetCategories() {
  console.log('🗑️ Deleting all existing categories...');

  // Delete all categories using raw SQL
  await prisma.$executeRaw`DELETE FROM "Category"`;

  console.log('✅ All categories deleted successfully!');
}

resetCategories()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
