import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugSpecifications() {
  console.log('🔍 Debugging specifications...');

  try {
    // Get a specific product
    const product = await prisma.product.findUnique({
      where: { id: "cmf9fhcz900016p8yki2akgiu" },
      select: {
        id: true,
        name: true,
        specifications: true
      }
    });

    if (product) {
      console.log('Product:', product.name);
      console.log('Specifications type:', typeof product.specifications);
      console.log('Specifications value:', product.specifications);
      console.log('Is string?', typeof product.specifications === 'string');

      if (typeof product.specifications === 'string') {
        try {
          const parsed = JSON.parse(product.specifications);
          console.log('Parsed successfully:', parsed);
          console.log('Parsed type:', typeof parsed);
        } catch (error) {
          console.log('Parse error:', error);
        }
      }
    }

  } catch (error) {
    console.error('💥 Error debugging:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSpecifications();
