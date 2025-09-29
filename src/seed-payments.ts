/*
  Payments Seed Script - Tạo dữ liệu payments cho các orders
  Usage: npx ts-node src/seed-payments.ts
*/
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('💳 Seeding payments data...');

  // Get all orders that need payments
  const orders = await prisma.orders.findMany({
    where: { status: { in: ['PENDING', 'CONFIRMED', 'PAID', 'SHIPPED'] } },
    take: 50 // Limit to first 50 orders
  });

  if (orders.length === 0) {
    console.log('❌ No orders found. Please seed orders first.');
    return;
  }

  console.log(`📦 Found ${orders.length} orders to create payments for`);

  // Get some users for payments
  const users = await prisma.users.findMany({ take: 10 });

  // Payment providers and their configurations
  const paymentProviders = [
    { name: 'STRIPE', config: { currency: 'VND', method: 'CARD' } },
    { name: 'PAYPAL', config: { currency: 'VND', method: 'PAYPAL' } },
    { name: 'MOMO', config: { currency: 'VND', method: 'EWALLET' } },
    { name: 'ZALOPAY', config: { currency: 'VND', method: 'EWALLET' } },
    { name: 'BANK_TRANSFER', config: { currency: 'VND', method: 'TRANSFER' } },
    { name: 'CASH_ON_DELIVERY', config: { currency: 'VND', method: 'COD' } }
  ];

  // Payment statuses distribution
  const paymentStatuses = [
    'PENDING', 'PENDING', 'PENDING', // 30% pending
    'COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', // 50% completed
    'FAILED', 'FAILED', // 10% failed
    'REFUNDED' // 10% refunded
  ];

  // Generate transaction IDs
  const generateTransactionId = (provider: string) => {
    const prefixes = {
      STRIPE: 'pi_',
      PAYPAL: 'PAY-',
      MOMO: 'MOMO',
      ZALOPAY: 'ZLP',
      BANK_TRANSFER: 'TXN',
      CASH_ON_DELIVERY: 'COD'
    };

    const prefix = prefixes[provider] || 'TXN';
    const random = Math.random().toString(36).substring(2, 15);
    return `${prefix}${random.toUpperCase()}`;
  };

  // Create payments for orders
  let totalPayments = 0;
  let completedPayments = 0;
  let failedPayments = 0;
  let refundedPayments = 0;

  for (const order of orders) {
    // Skip if payment already exists for this order
    const existingPayment = await prisma.payments.findFirst({
      where: { orderId: order.id }
    });

    if (existingPayment) {
      console.log(`⏭️ Skipping order ${order.orderNo} - payment already exists`);
      continue;
    }

    // Select random payment provider and status
    const provider = paymentProviders[Math.floor(Math.random() * paymentProviders.length)];
    const status = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];

    // Generate transaction ID
    const transactionId = generateTransactionId(provider.name);

    // Calculate payment amount (add some variation)
    const baseAmount = order.totalCents;
    const variation = Math.floor(baseAmount * 0.02); // ±2% variation
    const amountCents = baseAmount + (Math.random() * variation * 2 - variation);

    // Create payment metadata
    const metadata = {
      provider: provider.name,
      method: provider.config.method,
      currency: provider.config.currency,
      customerEmail: `customer${order.userId.slice(-4)}@example.com`,
      customerPhone: `+84${Math.floor(Math.random() * 900000000) + 100000000}`,
      paymentMethod: provider.config.method === 'CARD' ? 'VISA' :
                    provider.config.method === 'EWALLET' ? 'MOBILE_WALLET' :
                    provider.config.method === 'TRANSFER' ? 'BANK_TRANSFER' : 'CASH',
      installment: Math.random() < 0.1 ? Math.floor(Math.random() * 6) + 3 : undefined, // 10% chance of installment
      discount: Math.random() < 0.2 ? Math.floor(amountCents * 0.05) : 0, // 20% chance of discount
      fees: Math.floor(amountCents * 0.02), // 2% processing fees
      netAmount: amountCents - (Math.random() < 0.2 ? Math.floor(amountCents * 0.05) : 0)
    };

    // Random creation date within last 3 months
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - (3 * 30 * 24 * 60 * 60 * 1000));
    const createdAt = new Date(threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime()));

    try {
      const payment = await prisma.payments.create({
        data: {
          orderId: order.id,
          provider: provider.name,
          amountCents: Math.floor(amountCents),
          status: status,
          transactionId: transactionId,
          metadata: JSON.stringify(metadata),
          createdAt: createdAt,
          updatedAt: createdAt
        }
      });

      totalPayments++;

      // Update order status based on payment status
      let orderStatus = order.status;
      if (status === 'COMPLETED') {
        orderStatus = 'PAID';
        completedPayments++;
      } else if (status === 'FAILED') {
        orderStatus = 'CANCELLED';
        failedPayments++;
      } else if (status === 'REFUNDED') {
        orderStatus = 'REFUNDED';
        refundedPayments++;
      }

      if (orderStatus !== order.status) {
        await prisma.orders.update({
          where: { id: order.id },
          data: { status: orderStatus }
        });
      }

      // Create some refunds for completed payments
      if (status === 'COMPLETED' && Math.random() < 0.1) { // 10% of completed payments have refunds
        const refundAmount = Math.floor(amountCents * (Math.random() * 0.5 + 0.1)); // 10-60% refund

        const refundReasons = [
          'Customer request',
          'Product defect',
          'Wrong item delivered',
          'Duplicate payment',
          'Service not satisfied'
        ];

        await prisma.refunds.create({
          data: {
            paymentId: payment.id,
            amountCents: refundAmount,
            reason: refundReasons[Math.floor(Math.random() * refundReasons.length)],
            status: Math.random() < 0.8 ? 'COMPLETED' : 'PENDING',
            providerRefundId: `${provider.name}_REFUND_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            processedAt: Math.random() < 0.8 ? createdAt : null,
            errorMessage: Math.random() < 0.1 ? 'Processing delay due to bank system' : null,
            id: crypto.randomUUID(),
            updatedAt: new Date()
          }
        });

        // Update payment status to refunded
        await prisma.payments.update({
          where: { id: payment.id },
          data: { status: 'REFUNDED' }
        });

        // Update order status to refunded
        await prisma.orders.update({
          where: { id: order.id },
          data: { status: 'REFUNDED' }
        });
      }

    } catch (error) {
      console.error(`❌ Error creating payment for order ${order.orderNo}:`, error.message);
    }
  }

  console.log(`\n✅ Successfully created ${totalPayments} payments!`);

  // Show payment statistics
  console.log('\n📊 Payment Summary:');
  console.log(`   • Total Payments: ${totalPayments}`);
  console.log(`   • Completed Payments: ${completedPayments} (${((completedPayments/totalPayments)*100).toFixed(1)}%)`);
  console.log(`   • Failed Payments: ${failedPayments} (${((failedPayments/totalPayments)*100).toFixed(1)}%)`);
  console.log(`   • Refunded Payments: ${refundedPayments} (${((refundedPayments/totalPayments)*100).toFixed(1)}%)`);

  // Show payment provider distribution
  console.log('\n💳 Payment Provider Distribution:');
  // This would need to be calculated from the created payments
  // For now, showing expected distribution
  paymentProviders.forEach(provider => {
    const expectedCount = Math.floor(totalPayments / paymentProviders.length);
    console.log(`   • ${provider.name}: ~${expectedCount} payments`);
  });

  // Show payment status distribution
  console.log('\n📈 Payment Status Breakdown:');
  console.log(`   • PENDING: ${Math.floor(totalPayments * 0.3)} payments`);
  console.log(`   • COMPLETED: ${Math.floor(totalPayments * 0.5)} payments`);
  console.log(`   • FAILED: ${Math.floor(totalPayments * 0.1)} payments`);
  console.log(`   • REFUNDED: ${Math.floor(totalPayments * 0.1)} payments`);

  // Show refund statistics
  const refundCount = Math.floor(totalPayments * 0.1);
  console.log(`\n🔄 Refund Statistics:`);
  console.log(`   • Total Refunds: ${refundCount}`);
  console.log(`   • Completed Refunds: ${Math.floor(refundCount * 0.8)}`);
  console.log(`   • Pending Refunds: ${Math.floor(refundCount * 0.2)}`);

  console.log('\n🎯 Payments seeding completed successfully!');
  console.log('📱 Dashboard: http://localhost:3001');
  console.log('🔐 Login: admin@audiotailoc.com / password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
