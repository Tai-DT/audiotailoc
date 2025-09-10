import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } });
  console.log('Category product counts:');
  for (const cat of categories) {
    const count = await prisma.product.count({ where: { categoryId: cat.id } });
    console.log(`- ${cat.slug} (${cat.name}): ${count}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
