/**
 * Script to delete old products and categories data
 * 
 * ⚠️ WARNING: This will delete ALL products and categories!
 * 
 * Usage:
 *   npx ts-node scripts/delete-old-data.ts
 *   npx ts-node scripts/delete-old-data.ts --confirm
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function deleteOldData(confirm: boolean = false) {
  if (!confirm) {
    console.log('⚠️  WARNING: This will delete ALL products and categories!');
    console.log('⚠️  This action is IRREVERSIBLE!');
    console.log('\nTo proceed, run with --confirm flag:');
    console.log('  npx ts-node scripts/delete-old-data.ts --confirm\n');
    process.exit(0);
  }

  console.log('🗑️  Starting deletion of old data...\n');

  try {
    // Delete in correct order to avoid foreign key constraints
    
    // 1. Delete order items (references products)
    console.log('📦 Deleting order items...');
    const deletedOrderItems = await prisma.order_items.deleteMany({});
    console.log(`   ✅ Deleted ${deletedOrderItems.count} order items`);

    // 2. Delete cart items (references products)
    console.log('🛒 Deleting cart items...');
    const deletedCartItems = await prisma.cart_items.deleteMany({});
    console.log(`   ✅ Deleted ${deletedCartItems.count} cart items`);

    // 3. Delete inventory (references products)
    console.log('📊 Deleting inventory...');
    const deletedInventory = await prisma.inventory.deleteMany({});
    console.log(`   ✅ Deleted ${deletedInventory.count} inventory records`);

    // 4. Delete product review votes first (references reviews)
    console.log('👍 Deleting product review votes...');
    const deletedVotes = await prisma.product_review_votes.deleteMany({});
    console.log(`   ✅ Deleted ${deletedVotes.count} review votes`);

    // 5. Delete product reviews
    console.log('⭐ Deleting product reviews...');
    const deletedReviews = await prisma.product_reviews.deleteMany({});
    console.log(`   ✅ Deleted ${deletedReviews.count} reviews`);

    // 6. Delete wishlist items
    console.log('❤️  Deleting wishlist items...');
    const deletedWishlist = await prisma.wishlist_items.deleteMany({});
    console.log(`   ✅ Deleted ${deletedWishlist.count} wishlist items`);

    // 7. Delete product views (references products)
    console.log('👁️  Deleting product views...');
    const deletedViews = await prisma.product_views.deleteMany({});
    console.log(`   ✅ Deleted ${deletedViews.count} product views`);

    // 8. Delete products
    console.log('📦 Deleting products...');
    const deletedProducts = await prisma.products.deleteMany({});
    console.log(`   ✅ Deleted ${deletedProducts.count} products`);

    // 9. Delete promotions categories
    console.log('🎁 Deleting promotions categories...');
    const deletedPromoCategories = await prisma.promotions_categories.deleteMany({});
    console.log(`   ✅ Deleted ${deletedPromoCategories.count} promotion categories`);

    // 10. Delete promotions products
    console.log('🎁 Deleting promotions products...');
    const deletedPromoProducts = await prisma.promotions_products.deleteMany({});
    console.log(`   ✅ Deleted ${deletedPromoProducts.count} promotion products`);

    // 11. Delete categories (start with children, then parents)
    console.log('📁 Deleting categories...');
    // First delete categories with parentId
    const deletedChildCategories = await prisma.categories.deleteMany({
      where: {
        parentId: { not: null }
      }
    });
    console.log(`   ✅ Deleted ${deletedChildCategories.count} child categories`);

    // Then delete parent categories
    const deletedParentCategories = await prisma.categories.deleteMany({});
    console.log(`   ✅ Deleted ${deletedParentCategories.count} parent categories`);

    console.log('\n✅ All old data deleted successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Products: ${deletedProducts.count}`);
    console.log(`   - Categories: ${deletedChildCategories.count + deletedParentCategories.count}`);
    console.log(`   - Order Items: ${deletedOrderItems.count}`);
    console.log(`   - Cart Items: ${deletedCartItems.count}`);
    console.log(`   - Inventory: ${deletedInventory.count}`);
    console.log(`   - Review Votes: ${deletedVotes.count}`);
    console.log(`   - Reviews: ${deletedReviews.count}`);
    console.log(`   - Wishlist Items: ${deletedWishlist.count}`);
    console.log(`   - Product Views: ${deletedViews.count}`);
    console.log(`   - Promotion Products: ${deletedPromoProducts.count}`);

  } catch (error: any) {
    console.error('\n❌ Error deleting data:', error.message || error);
    throw error;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const confirm = args.includes('--confirm') || args.includes('-y') || args.includes('--yes');

// Run the script
deleteOldData(confirm)
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('\n❌ Script failed:', error.message || error);
    await prisma.$disconnect();
    process.exit(1);
  });



