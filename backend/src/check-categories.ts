import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCategories() {
  console.log('🔍 Checking all categories in database...');

  const allCategories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  });

  console.log(`📋 Found ${allCategories.length} categories:`);
  allCategories.forEach((category, index) => {
    console.log(`${index + 1}. ${category.name} (slug: ${category.slug})`);
  });

  console.log('\n✅ Categories check completed!');
}

checkCategories()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

