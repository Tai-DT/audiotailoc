const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProduct() {
  try {
    const productId = 'cmfcu3lg9004p9zhinjui5de5';

    console.log('Checking product with ID:', productId);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        sku: true,
        isActive: true,
        isDeleted: true
      }
    });

    if (product) {
      console.log('Product found:', product);
    } else {
      console.log('Product NOT found');
    }

    // Check if inventory exists for this product
    const inventory = await prisma.inventory.findUnique({
      where: { productId },
      select: {
        id: true,
        productId: true,
        stock: true,
        reserved: true,
        lowStockThreshold: true
      }
    });

    if (inventory) {
      console.log('Inventory found:', inventory);
    } else {
      console.log('Inventory NOT found');
    }

    // List recent products to see what's available
    console.log('\nRecent products:');
    const recentProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        sku: true,
        isActive: true,
        isDeleted: true
      }
    });

    recentProducts.forEach(p => console.log(`- ${p.id}: ${p.name} (${p.sku})`));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProduct();