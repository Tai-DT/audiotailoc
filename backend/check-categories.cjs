const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategories() {
  console.log('Checking categories in products...\n');

  try {
    // Get all products with their categories
    const products = await prisma.product.findMany({
      include: {
        category: true,
        inventory: true
      }
    });

    console.log(`Found ${products.length} products:\n`);

    // Group by category
    const categoryMap = new Map();
    const categoryIdMap = new Map();

    products.forEach(product => {
      // Check product.category (should be object)
      const catKey = product.category ? '[object Object]' : 'null';
      if (!categoryMap.has(catKey)) {
        categoryMap.set(catKey, []);
      }
      categoryMap.get(catKey).push(product.name);

      // Check product.categoryId
      const catIdKey = product.categoryId || 'null';
      if (!categoryIdMap.has(catIdKey)) {
        categoryIdMap.set(catIdKey, []);
      }
      categoryIdMap.get(catIdKey).push(product.name);
    });

    console.log('=== Categories (product.category) ===');
    for (const [cat, names] of categoryMap) {
      console.log(`${cat}: ${names.length} products`);
      console.log(`  - ${names.slice(0, 3).join(', ')}${names.length > 3 ? '...' : ''}`);
    }

    console.log('\n=== Category IDs (product.categoryId) ===');
    for (const [catId, names] of categoryIdMap) {
      console.log(`${catId}: ${names.length} products`);
      console.log(`  - ${names.slice(0, 3).join(', ')}${names.length > 3 ? '...' : ''}`);
    }

    // Get all categories
    const categories = await prisma.category.findMany();
    console.log('\n=== Available Categories in DB ===');
    console.log(`Found ${categories.length} categories:`);
    categories.forEach(cat => {
      console.log(`- ${cat.id}: ${cat.name} (${cat.slug})`);
    });

    // Check a sample product to see the full structure
    if (products.length > 0) {
      console.log('\n=== Sample Product Structure ===');
      const sampleProduct = products[0];
      console.log('Product:', {
        id: sampleProduct.id,
        name: sampleProduct.name,
        categoryId: sampleProduct.categoryId,
        category: sampleProduct.category ? {
          id: sampleProduct.category.id,
          name: sampleProduct.category.name,
          slug: sampleProduct.category.slug
        } : null
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();