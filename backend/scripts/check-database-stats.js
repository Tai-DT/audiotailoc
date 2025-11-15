#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabaseStats() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║     📊 Audio Tài Lộc - Database Statistics Check 📊     ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // Count all tables
    const counts = {
      users: await prisma.users.count(),
      products: await prisma.product.count(),
      categories: await prisma.category.count(),
      orders: await prisma.order.count(),
      services: await prisma.service.count(),
      serviceTypes: await prisma.serviceType.count(),
      banners: await prisma.banner.count(),
      projects: await prisma.project.count(),
      cart: await prisma.cart.count(),
      wishlist: await prisma.wishlistItem.count(),
      reviews: await prisma.productReview.count(),
      inventory: await prisma.inventory.count(),
      serviceBookings: await prisma.serviceBooking.count(),
      promotions: await prisma.promotion.count(),
    };

    console.log('📈 CORE DATA:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👥 Users:              ${counts.users.toString().padStart(6)}`);
    console.log(`📦 Products:           ${counts.products.toString().padStart(6)}`);
    console.log(`🏷️  Categories:         ${counts.categories.toString().padStart(6)}`);
    console.log(`📋 Orders:             ${counts.orders.toString().padStart(6)}`);
    
    console.log('\n🛠️  SERVICES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔧 Service Types:      ${counts.serviceTypes.toString().padStart(6)}`);
    console.log(`🛠️  Services:           ${counts.services.toString().padStart(6)}`);
    console.log(`📅 Service Bookings:   ${counts.serviceBookings.toString().padStart(6)}`);

    console.log('\n🎨 CONTENT:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎨 Banners:            ${counts.banners.toString().padStart(6)}`);
    console.log(`💼 Projects:           ${counts.projects.toString().padStart(6)}`);
    console.log(`🎁 Promotions:         ${counts.promotions.toString().padStart(6)}`);

    console.log('\n🛒 SHOPPING:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🛒 Carts:              ${counts.cart.toString().padStart(6)}`);
    console.log(`❤️  Wishlist Items:     ${counts.wishlist.toString().padStart(6)}`);
    console.log(`⭐ Product Reviews:    ${counts.reviews.toString().padStart(6)}`);
    console.log(`📦 Inventory Records:  ${counts.inventory.toString().padStart(6)}`);

    // Check if data needs seeding
    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 RECOMMENDATIONS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const recommendations = [];
    
    if (counts.users === 0) {
      recommendations.push('❌ No users found - Run: npm run seed:users');
    } else if (counts.users < 5) {
      recommendations.push(`⚠️  Only ${counts.users} user(s) - Consider adding more test users`);
    } else {
      recommendations.push(`✅ Users: ${counts.users} users available`);
    }

    if (counts.categories === 0) {
      recommendations.push('❌ No categories - Run: npm run seed:categories');
    } else {
      recommendations.push(`✅ Categories: ${counts.categories} categories available`);
    }

    if (counts.products === 0) {
      recommendations.push('❌ No products - Run: npm run seed:products');
    } else if (counts.products < 10) {
      recommendations.push(`⚠️  Only ${counts.products} product(s) - Consider adding more`);
    } else {
      recommendations.push(`✅ Products: ${counts.products} products available`);
    }

    if (counts.serviceTypes === 0) {
      recommendations.push('❌ No service types - Run: npm run seed:service-types');
    } else {
      recommendations.push(`✅ Service Types: ${counts.serviceTypes} types available`);
    }

    if (counts.services === 0) {
      recommendations.push('❌ No services - Run: npm run seed:services');
    } else {
      recommendations.push(`✅ Services: ${counts.services} services available`);
    }

    if (counts.banners === 0) {
      recommendations.push('⚠️  No banners - Consider adding promotional banners');
    } else {
      recommendations.push(`✅ Banners: ${counts.banners} banners available`);
    }

    if (counts.projects === 0) {
      recommendations.push('⚠️  No projects - Consider adding showcase projects');
    } else {
      recommendations.push(`✅ Projects: ${counts.projects} projects available`);
    }

    recommendations.forEach(rec => console.log(rec));

    // Overall status
    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const totalRecords = Object.values(counts).reduce((a, b) => a + b, 0);
    const emptyTables = Object.values(counts).filter(count => count === 0).length;
    
    console.log(`📊 TOTAL RECORDS: ${totalRecords}`);
    console.log(`📋 EMPTY TABLES: ${emptyTables}/${Object.keys(counts).length}`);
    
    if (emptyTables === 0) {
      console.log('\n✅ DATABASE STATUS: FULLY POPULATED ✅');
    } else if (emptyTables < Object.keys(counts).length / 2) {
      console.log('\n⚠️  DATABASE STATUS: PARTIALLY POPULATED');
      console.log('   Run: npm run seed:all to populate all tables');
    } else {
      console.log('\n❌ DATABASE STATUS: NEEDS SEEDING');
      console.log('   Run: npm run seed:all to populate database');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Error connecting to database:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. Backend is running (npm run dev)');
    console.error('   2. DATABASE_URL is configured in .env');
    console.error('   3. Database is accessible\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  checkDatabaseStats().catch(console.error);
}

module.exports = { checkDatabaseStats };
