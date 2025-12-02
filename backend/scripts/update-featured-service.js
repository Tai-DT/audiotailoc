const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateFeaturedService() {
  try {
    console.log('🔄 Updating service to featured...\n');

    // Find a non-featured service to make featured
    const nonFeaturedService = await prisma.service.findFirst({
      where: { 
        isFeatured: false,
        isActive: true 
      },
      select: {
        id: true,
        name: true,
        slug: true,
      }
    });

    if (!nonFeaturedService) {
      console.log('⚠️  No non-featured active service found to update');
      return;
    }

    console.log(`📝 Updating service: ${nonFeaturedService.name}`);

    // Update service to be featured
    const updated = await prisma.service.update({
      where: { id: nonFeaturedService.id },
      data: { isFeatured: true },
      select: {
        id: true,
        name: true,
        slug: true,
        isFeatured: true,
        isActive: true,
      }
    });

    console.log('✅ Service updated successfully:');
    console.log(`   Name: ${updated.name}`);
    console.log(`   Slug: ${updated.slug}`);
    console.log(`   Featured: ${updated.isFeatured ? '⭐ Yes' : 'No'}`);

    // Count featured services
    const featuredCount = await prisma.service.count({
      where: { 
        isFeatured: true,
        isActive: true 
      }
    });

    console.log(`\n🌟 Total featured services now: ${featuredCount}`);

  } catch (error) {
    console.error('❌ Error updating service:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateFeaturedService();
