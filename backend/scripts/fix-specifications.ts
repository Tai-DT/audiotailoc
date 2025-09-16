import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSpecifications() {
  console.log('🔧 Fixing specifications data...');

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
          // Check if it's double-encoded JSON
          if (product.specifications.startsWith('"') && product.specifications.includes('\\"')) {
            console.log(`🔧 Fixing double-encoded specifications for: ${product.name}`);

            // Remove outer quotes and unescape
            let cleanedSpecs = product.specifications;
            if (cleanedSpecs.startsWith('"') && cleanedSpecs.endsWith('"')) {
              cleanedSpecs = cleanedSpecs.slice(1, -1);
            }

            // Unescape the inner JSON
            cleanedSpecs = cleanedSpecs.replace(/\\"/g, '"').replace(/\\\\/g, '\\');

            // Try to parse and re-stringify properly
            const parsedSpecs = JSON.parse(cleanedSpecs);
            const fixedSpecs = JSON.stringify(parsedSpecs);

            // Update the product
            await prisma.product.update({
              where: { id: product.id },
              data: { specifications: fixedSpecs }
            });

            console.log(`✅ Fixed specifications for: ${product.name}`);
            fixedCount++;
          }
        } catch (error) {
          console.error(`❌ Error fixing specifications for ${product.name}:`, error);
        }
      }
    }

    console.log(`\n📊 Fixed ${fixedCount} products with double-encoded specifications`);

    // Verify the fix by checking one product
    if (fixedCount > 0) {
      const testProduct = await prisma.product.findFirst({
        select: {
          id: true,
          name: true,
          specifications: true
        }
      });

      if (testProduct?.specifications) {
        console.log(`\n🔍 Test product specifications:`, testProduct.specifications);
      }
    }

  } catch (error) {
    console.error('💥 Error fixing specifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSpecifications();
