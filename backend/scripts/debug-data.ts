
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const serviceTypes = await prisma.service_types.findMany({
      include: {
        services: true
      }
    });

    console.log('--- SERVICE TYPES AND SERVICES ---');
    serviceTypes.forEach(st => {
      console.log(`Type: ${st.name} (Slug: ${st.slug}, ID: ${st.id})`);
      st.services.forEach(s => {
        console.log(`  - Service: ${s.name} (Slug: ${s.slug})`);
      });
    });

    const categories = await prisma.categories.findMany({
      where: { parentId: null },
      include: {
        other_categories: true
      }
    });

    console.log('\n--- CATEGORIES ---');
    categories.forEach(c => {
      console.log(`Category: ${c.name} (Slug: ${c.slug})`);
      c.other_categories.forEach(child => {
        console.log(`  - Child: ${child.name} (Slug: ${child.slug})`);
      });
    });

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
