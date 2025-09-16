import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function finalFixSpecifications() {
  console.log('🔧 Final fix for all specifications...');

  try {
    // Get all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        specifications: true
      }
    });

    console.log(`📊 Found ${products.length} products to check`);

    let fixedCount = 0;

    for (const product of products) {
      if (product.specifications && typeof product.specifications === 'string') {
        try {
          console.log(`🔧 Processing: ${product.name}`);

          // Handle different types of encoding issues
          let specsString = product.specifications;

          // Remove outer quotes if present
          if (specsString.startsWith('"') && specsString.endsWith('"')) {
            specsString = specsString.slice(1, -1);
          }

          // Unescape JSON
          specsString = specsString.replace(/\\"/g, '"').replace(/\\\\/g, '\\');

          // Try to parse
          let parsedSpecs;
          try {
            parsedSpecs = JSON.parse(specsString);
          } catch (parseError) {
            console.log(`⚠️ Could not parse specifications for ${product.name}, setting to null`);
            parsedSpecs = null;
          }

          // Update with properly formatted JSON
          const updateData = parsedSpecs ? JSON.stringify(parsedSpecs) : undefined;

          await prisma.product.update({
            where: { id: product.id },
            data: { specifications: updateData }
          });

          console.log(`✅ Fixed specifications for: ${product.name}`);
          fixedCount++;

        } catch (error) {
          console.error(`❌ Error fixing specifications for ${product.name}:`, error);
        }
      }
    }

    console.log(`\n📊 Fixed ${fixedCount} products specifications`);

    // Final verification
    console.log('\n🔍 Final verification:');
    const finalProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        specifications: true
      },
      take: 5
    });

    finalProducts.forEach(product => {
      const specsType = product.specifications ? typeof product.specifications : 'null';
      console.log(`${product.name}: ${specsType}`);
    });

  } catch (error) {
    console.error('💥 Error in final fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

finalFixSpecifications();
