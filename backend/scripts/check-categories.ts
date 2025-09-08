import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCategories() {
  console.log('🔍 Checking categories in database...');

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    console.log(`📊 Found ${categories.length} categories:`);
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (slug: ${cat.slug})`);
    });

  } catch (error) {
    console.error('❌ Error checking categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
