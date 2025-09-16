import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateRemoveServiceCategories() {
  console.log('🚀 Starting migration to remove service categories...');

  try {
    // Delete all service categories first (this will cascade delete related data)
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