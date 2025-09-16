// Script to create sample orders for testing
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleOrders() {
  try {
    console.log('Creating sample orders...');

    // Get existing products
    const products = await prisma.product.findMany({ take: 3 });
    if (products.length === 0) {
      console.log('No products found. Please run seed first.');
      return;
    }

    // Get existing user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    const sampleOrders = [
      {
        userId: user.id,
        items: [
          { productId: products[0].id, quantity: 2, price: products[0].priceCents, unitPrice: products[0].priceCents }
        ],
        shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
        status: 'PENDING'
      },
      {
        userId: user.id,
        items: [
          { productId: products[1].id, quantity: 1, price: products[1].priceCents, unitPrice: products[1].priceCents }
        ],
        shippingAddress: '456 Đường XYZ, Quận 2, TP.HCM',
        status: 'COMPLETED'
      },
      {
        userId: user.id,
        items: [
          { productId: products[0].id, quantity: 1, price: products[0].priceCents, unitPrice: products[0].priceCents },
          { productId: products[1].id, quantity: 1, price: products[1].priceCents, unitPrice: products[1].priceCents }
        ],
        shippingAddress: '789 Đường DEF, Quận 3, TP.HCM',
        status: 'PROCESSING'
      }
    ];

    for (const orderData of sampleOrders) {
      // Generate unique order number
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      const orderNo = `ORD${timestamp}${random}`;

      // Calculate totals with smaller prices for testing
      let subtotalCents = 0;
      for (const item of orderData.items) {
        // Use smaller price for testing (divide by 1000)
        const testPrice = Math.floor(item.unitPrice / 1000);
        subtotalCents += testPrice * item.quantity;
      }

      // Use the first item's price for total calculation
      const firstItem = orderData.items[0];
      const testPrice = Math.floor(firstItem.unitPrice / 1000);
      
      const order = await prisma.order.create({
        data: {
          orderNo,
          userId: orderData.userId,
          status: orderData.status,
          subtotalCents: subtotalCents,
          totalCents: subtotalCents,
          shippingAddress: orderData.shippingAddress,
          items: {
            create: orderData.items.map(item => ({
              productId: item.productId,
              name: 'Sample Product',
              quantity: item.quantity,
              price: testPrice,
              unitPrice: item.unitPrice
            }))
          }
        },
        include: { items: true }
      });

      console.log(`✅ Created order: ${order.orderNo} - Status: ${order.status}`);
    }

    console.log('Sample orders created successfully!');

  } catch (error) {
    console.error('Error creating sample orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleOrders();
