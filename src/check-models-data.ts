/*
  Check which models have data and which need seeding
  Usage: npx tsx src/check-models-data.ts
*/
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

interface ModelStatus {
  name: string;
  count: number;
  status: '✅ Has Data' | '⚠️ Empty' | '🔄 Needs More';
  minRequired: number;
}

async function checkModelsData() {
  const models: ModelStatus[] = [];
  
  // Core Models
  models.push({
    name: 'Users',
    count: await prisma.users.count(),
    minRequired: 5,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'Products',
    count: await prisma.products.count(),
    minRequired: 10,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'Categories',
    count: await prisma.categories.count(),
    minRequired: 5,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'Services',
    count: await prisma.services.count(),
    minRequired: 5,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'ServiceTypes',
    count: await prisma.service_types.count(),
    minRequired: 3,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'ServiceTypes',
    count: await prisma.service_types.count(),
    minRequired: 5,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'Projects',
    count: await prisma.projects.count(),
    minRequired: 5,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'Banners',
    count: await prisma.banners.count(),
    minRequired: 3,
    status: '✅ Has Data'
  });
  
  // E-commerce Models
  models.push({
    name: 'Orders',
    count: await prisma.orders.count(),
    minRequired: 10,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'OrderItems',
    count: await prisma.order_items.count(),
    minRequired: 20,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'Cart',
    count: await prisma.carts.count(),
    minRequired: 5,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'CartItems',
    count: await prisma.cart_items.count(),
    minRequired: 10,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'Payments',
    count: await prisma.payments.count(),
    minRequired: 5,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'PaymentIntents',
    count: await prisma.payment_intents.count(),
    minRequired: 5,
    status: '✅ Has Data'
  });
  
  // Customer Engagement Models
  models.push({
    name: 'ProductReviews',
    count: await prisma.product_reviews.count(),
    minRequired: 10,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'WishlistItems',
    count: await prisma.wishlist_items.count(),
    minRequired: 10,
    status: '✅ Has Data'
  });
  models.push({
    name: 'CustomerQuestions',
    count: await prisma.customer_questions.count(),
    minRequired: 10,
    status: '✅ Has Data'
  });
  
  // Service Booking Models
  models.push({
    name: 'ServiceBookings',
    count: await prisma.service_bookings.count(),
    minRequired: 10,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'Technicians',
    count: await prisma.technicians.count(),
    minRequired: 5,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'ServiceItems',
    count: await prisma.service_items.count(),
    minRequired: 10,
    status: '✅ Has Data'
  });
  
  // Marketing Models
  models.push({
    name: 'Campaigns',
    count: await prisma.campaigns.count(),
    minRequired: 5,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'Promotions',
    count: await prisma.promotions.count(),
    minRequired: 5,
    status: '✅ Has Data'
  });
  
  // Loyalty Models
  models.push({
    name: 'LoyaltyAccounts',
    count: await prisma.loyalty_accounts.count(),
    minRequired: 5,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'LoyaltyRewards',
    count: await prisma.loyalty_rewards.count(),
    minRequired: 5,
    status: '✅ Has Data'
  });
  
  // Analytics Models
  models.push({
    name: 'ProductViews',
    count: await prisma.product_views.count(),
    minRequired: 50,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'ServiceViews',
    count: await prisma.service_views.count(),
    minRequired: 20,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'SearchQueries',
    count: await prisma.search_queries.count(),
    minRequired: 20,
    status: '✅ Has Data'
  });
  
  models.push({
    name: 'ActivityLogs',
    count: await prisma.activity_logs.count(),
    minRequired: 50,
    status: '✅ Has Data'
  });
  
  // Inventory
  models.push({
    name: 'Inventory',
    count: await prisma.inventory.count(),
    minRequired: 10,
    status: '✅ Has Data'
  });
  
  // Update status based on count
  models.forEach(model => {
    if (model.count === 0) {
      model.status = '⚠️ Empty';
    } else if (model.count < model.minRequired) {
      model.status = '🔄 Needs More';
    } else {
      model.status = '✅ Has Data';
    }
  });
  
  return models;
}

async function main() {
  console.log('🔍 Checking data status for all models...\n');
  console.log('='.repeat(60));
  
  try {
    const models = await checkModelsData();
    
    // Group by status
    const empty = models.filter(m => m.status === '⚠️ Empty');
    const needsMore = models.filter(m => m.status === '🔄 Needs More');
    const hasData = models.filter(m => m.status === '✅ Has Data');
    
    // Display results
    console.log('\n⚠️  EMPTY MODELS (Need immediate seeding):');
    console.log('─'.repeat(60));
    if (empty.length === 0) {
      console.log('  None - All models have at least some data');
    } else {
      empty.forEach(model => {
        console.log(`  ${model.name}: ${model.count} records (needs ${model.minRequired})`);
      });
    }
    
    console.log('\n🔄 NEEDS MORE DATA (Below minimum):');
    console.log('─'.repeat(60));
    if (needsMore.length === 0) {
      console.log('  None - All models meet minimum requirements');
    } else {
      needsMore.forEach(model => {
        console.log(`  ${model.name}: ${model.count} records (needs ${model.minRequired})`);
      });
    }
    
    console.log('\n✅ HAS SUFFICIENT DATA:');
    console.log('─'.repeat(60));
    hasData.forEach(model => {
      console.log(`  ${model.name}: ${model.count} records`);
    });
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY:');
    console.log(`  Total Models: ${models.length}`);
    console.log(`  Empty: ${empty.length}`);
    console.log(`  Needs More: ${needsMore.length}`);
    console.log(`  Has Data: ${hasData.length}`);
    console.log('='.repeat(60));
    
    if (empty.length > 0 || needsMore.length > 0) {
      console.log('\n🎯 RECOMMENDATION:');
      console.log('Run the comprehensive seed script to populate missing data.');
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
