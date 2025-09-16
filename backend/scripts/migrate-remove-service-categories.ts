import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateRemoveServiceCategories() {
  console.log('🚀 Starting migration to remove service categories...');

  try {
    // First, update all services to remove categoryId references
    console.log('📝 Updating services to remove categoryId...');
    await prisma.service.updateMany({
      where: {
        categoryId: { not: null }
      },
      data: {
        categoryId: null
      }
    });

    // Update all service types to remove categoryId references
    console.log('📝 Updating service types to remove categoryId...');
    await prisma.serviceType.updateMany({
      where: {
        categoryId: { not: null }
      },
      data: {
        categoryId: null
      }
    });

    // Delete all service categories
    console.log('🗑️ Deleting all service categories...');
    const deletedCategories = await prisma.serviceCategory.deleteMany();
    console.log(`✅ Deleted ${deletedCategories.count} service categories`);

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateRemoveServiceCategories()
  .then(() => {
    console.log('✅ Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });