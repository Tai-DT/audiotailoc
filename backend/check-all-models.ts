import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAllModels() {
  console.log('📊 Checking all models data counts:');

  try {
    // Core models
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const serviceCount = await prisma.service.count();
    const pageCount = await prisma.page.count();

    console.log('=== CORE MODELS ===');
    console.log(`Users: ${userCount}`);
    console.log(`Categories: ${categoryCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Services: ${serviceCount}`);
    console.log(`Pages: ${pageCount}`);

    // E-commerce models
    const cartCount = await prisma.cart.count();
    const cartItemCount = await prisma.cartItem.count();
    const orderCount = await prisma.order.count();
    const orderItemCount = await prisma.orderItem.count();
    const paymentCount = await prisma.payment.count();
    const paymentIntentCount = await prisma.paymentIntent.count();

    console.log('\n=== E-COMMERCE MODELS ===');
    console.log(`Carts: ${cartCount}`);
    console.log(`Cart Items: ${cartItemCount}`);
    console.log(`Orders: ${orderCount}`);
    console.log(`Order Items: ${orderItemCount}`);
    console.log(`Payments: ${paymentCount}`);
    console.log(`Payment Intents: ${paymentIntentCount}`);

    // User interaction models
    const notificationCount = await prisma.notification.count();
    const inventoryCount = await prisma.inventory.count();
    const wishlistItemCount = await prisma.wishlistItem.count();
    const productReviewCount = await prisma.productReview.count();

    console.log('\n=== USER INTERACTION MODELS ===');
    console.log(`Notifications: ${notificationCount}`);
    console.log(`Inventory: ${inventoryCount}`);
    console.log(`Wishlist Items: ${wishlistItemCount}`);
    console.log(`Product Reviews: ${productReviewCount}`);

    // Chat & communication models
    const chatSessionCount = await prisma.chatSession.count();
    const chatMessageCount = await prisma.chatMessage.count();
    const searchQueryCount = await prisma.searchQuery.count();
    const customerQuestionCount = await prisma.customerQuestion.count();

    console.log('\n=== CHAT & COMMUNICATION MODELS ===');
    console.log(`Chat Sessions: ${chatSessionCount}`);
    console.log(`Chat Messages: ${chatMessageCount}`);
    console.log(`Search Queries: ${searchQueryCount}`);
    console.log(`Customer Questions: ${customerQuestionCount}`);

    // Analytics models
    const productViewCount = await prisma.productView.count();
    const serviceViewCount = await prisma.serviceView.count();

    console.log('\n=== ANALYTICS MODELS ===');
    console.log(`Product Views: ${productViewCount}`);
    console.log(`Service Views: ${serviceViewCount}`);

    // Service management models
    const technicianCount = await prisma.technician.count();
    const serviceItemCount = await prisma.serviceItem.count();
    const serviceBookingCount = await prisma.serviceBooking.count();
    const serviceBookingItemCount = await prisma.serviceBookingItem.count();
    const technicianScheduleCount = await prisma.technicianSchedule.count();

    console.log('\n=== SERVICE MANAGEMENT MODELS ===');
    console.log(`Technicians: ${technicianCount}`);
    console.log(`Service Items: ${serviceItemCount}`);
    console.log(`Service Bookings: ${serviceBookingCount}`);
    console.log(`Service Booking Items: ${serviceBookingItemCount}`);
    console.log(`Technician Schedules: ${technicianScheduleCount}`);

    // Marketing & loyalty models
    const promotionCount = await prisma.promotion.count();
    const systemConfigCount = await prisma.systemConfig.count();
    const loyaltyAccountCount = await prisma.loyaltyAccount.count();
    const pointTransactionCount = await prisma.pointTransaction.count();
    const loyaltyRewardCount = await prisma.loyaltyReward.count();
    const redemptionHistoryCount = await prisma.redemptionHistory.count();

    console.log('\n=== MARKETING & LOYALTY MODELS ===');
    console.log(`Promotions: ${promotionCount}`);
    console.log(`System Configs: ${systemConfigCount}`);
    console.log(`Loyalty Accounts: ${loyaltyAccountCount}`);
    console.log(`Point Transactions: ${pointTransactionCount}`);
    console.log(`Loyalty Rewards: ${loyaltyRewardCount}`);
    console.log(`Redemption History: ${redemptionHistoryCount}`);

    // Other models
    const webhookCount = await prisma.webhook.count();
    const knowledgeBaseEntryCount = await prisma.knowledgeBaseEntry.count();
    const projectCount = await prisma.project.count();

    console.log('\n=== OTHER MODELS ===');
    console.log(`Webhooks: ${webhookCount}`);
    console.log(`Knowledge Base Entries: ${knowledgeBaseEntryCount}`);
    console.log(`Projects: ${projectCount}`);

  } catch (error) {
    console.error('Error checking models:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllModels();
