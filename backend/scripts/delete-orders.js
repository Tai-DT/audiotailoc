// Script to delete specific orders by order number
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteOrders(orderNumbers) {
  try {
    console.log(`Deleting orders: ${orderNumbers.join(', ')}...`);

    // Find orders by order number
    const orders = await prisma.order.findMany({
      where: {
        orderNo: {
          in: orderNumbers
        }
      },
      select: {
        id: true,
        orderNo: true
      }
    });

    if (orders.length === 0) {
      console.log('No orders found with the specified order numbers.');
      return;
    }

    console.log('Found orders to delete:');
    orders.forEach(order => {
      console.log(`- ${order.orderNo} (ID: ${order.id})`);
    });

    const orderIds = orders.map(order => order.id);

    // Delete in correct order to handle foreign key constraints
    for (const orderId of orderIds) {
      console.log(`Deleting payment intents for order ${orderId}...`);
      await prisma.paymentIntent.deleteMany({
        where: { orderId: orderId }
      });

      console.log(`Deleting items for order ${orderId}...`);
      await prisma.orderItem.deleteMany({
        where: { orderId: orderId }
      });
    }

    // Delete orders
    const result = await prisma.order.deleteMany({
      where: {
        id: {
          in: orderIds
        }
      }
    });

    console.log(`✅ Successfully deleted ${result.count} orders`);
  } catch (error) {
    console.error('❌ Error deleting orders:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Usage: node delete-orders.js ATL001 ATL002 ATL003
const orderNumbers = process.argv.slice(2);
if (orderNumbers.length === 0) {
  console.log('Usage: node delete-orders.js <order_number1> <order_number2> ...');
  process.exit(1);
}

deleteOrders(orderNumbers);
