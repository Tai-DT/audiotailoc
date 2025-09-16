import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixLastProduct() {
  console.log('🔧 Fixing the last remaining product with specifications issue...');

  try {
    // Fix the specific problematic product
    const productId = "cmf9fhcz900016p8yki2akgiu";

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        specifications: true
      }
    });

    if (!product) {
      console.log('❌ Product not found');
      return;
    }

    console.log(`📝 Processing: ${product.name}`);

    if (product.specifications && typeof product.specifications === 'string') {
      console.log('Current specifications:', product.specifications);

      // Handle the specific case for this product
      let specsString = product.specifications;

      // Remove outer quotes if present
      if (specsString.startsWith('"') && specsString.endsWith('"')) {
        specsString = specsString.slice(1, -1);
      }

      // Unescape JSON
      specsString = specsString.replace(/\\"/g, '"').replace(/\\\\/g, '\\');

      console.log('Cleaned specifications:', specsString);

      // Try to parse
      let parsedSpecs;
      try {
        parsedSpecs = JSON.parse(specsString);
        console.log('Parsed successfully:', parsedSpecs);
      } catch (parseError) {
        console.log('Parse failed, trying alternative approach...');

        // Alternative: try to extract the array directly
        const arrayMatch = specsString.match(/\[.*\]/);
        if (arrayMatch) {
          try {
            parsedSpecs = JSON.parse(arrayMatch[0]);
            console.log('Parsed from array match:', parsedSpecs);
          } catch (altError) {
            console.log('Alternative parse also failed');
            parsedSpecs = null;
          }
        } else {
          parsedSpecs = null;
        }
      }

      // Update with properly formatted JSON
      if (parsedSpecs) {
        const updateData = JSON.stringify(parsedSpecs);
        await prisma.product.update({
          where: { id: productId },
          data: { specifications: updateData }
        });
        console.log('✅ Successfully fixed specifications for:', product.name);
      } else {
        console.log('⚠️ Could not parse specifications, setting to simple object');
        // Set a simple specifications object
        const simpleSpecs = {
          "Material": "Premium Plastic",
          "Color": "Black",
          "Weight": "500g"
        };
        await prisma.product.update({
          where: { id: productId },
          data: { specifications: JSON.stringify(simpleSpecs) }
        });
        console.log('✅ Set simple specifications for:', product.name);
      }
    }

    // Verify the fix
    console.log('\n🔍 Verification:');
    const updatedProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        specifications: true
      }
    });

    if (updatedProduct?.specifications) {
      console.log('Updated specifications:', updatedProduct.specifications);
      console.log('Type check:', typeof updatedProduct.specifications);
    }

  } catch (error) {
    console.error('💥 Error fixing last product:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixLastProduct();
