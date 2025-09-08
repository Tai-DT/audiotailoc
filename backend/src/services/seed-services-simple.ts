import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedServices() {
  console.log('🌱 Checking service data...');

  try {
    // Check existing data
    const existingCategories = await prisma.serviceCategory.findMany();
    const existingTypes = await prisma.serviceType.findMany();
    const existingServices = await prisma.service.findMany();

    console.log(`📊 Found: ${existingCategories.length} categories, ${existingTypes.length} types, ${existingServices.length} services`);

    if (existingCategories.length === 0) {
      console.log('🚀 Creating categories...');
      await prisma.serviceCategory.createMany({
        data: [
          {
            name: 'Audio Equipment',
            slug: 'audio-equipment',
            description: 'Professional audio equipment services',
            icon: 'speaker',
            color: '#3B82F6',
            isActive: true,
            sortOrder: 1
          },
          {
            name: 'Recording Services',
            slug: 'recording-services',
            description: 'Professional recording and production services',
            icon: 'mic',
            color: '#10B981',
            isActive: true,
            sortOrder: 2
          },
          {
            name: 'Live Sound',
            slug: 'live-sound',
            description: 'Live performance audio services',
            icon: 'volume-2',
            color: '#F59E0B',
            isActive: true,
            sortOrder: 3
          }
        ]
      });
    }

    if (existingTypes.length === 0) {
      console.log('🚀 Creating types...');
      const categories = await prisma.serviceCategory.findMany();

      await prisma.serviceType.createMany({
        data: [
          {
            name: 'Speakers & Amplifiers',
            slug: 'speakers-amplifiers',
            description: 'Speaker systems and amplifier services',
            categoryId: categories[0].id,
            icon: 'speaker',
            color: '#3B82F6',
            isActive: true,
            sortOrder: 1
          },
          {
            name: 'Microphones',
            slug: 'microphones',
            description: 'Microphone repair and maintenance',
            categoryId: categories[0].id,
            icon: 'mic',
            color: '#3B82F6',
            isActive: true,
            sortOrder: 2
          },
          {
            name: 'Studio Recording',
            slug: 'studio-recording',
            description: 'Professional studio recording sessions',
            categoryId: categories[1].id,
            icon: 'mic',
            color: '#10B981',
            isActive: true,
            sortOrder: 1
          },
          {
            name: 'Mixing & Mastering',
            slug: 'mixing-mastering',
            description: 'Audio mixing and mastering services',
            categoryId: categories[1].id,
            icon: 'settings',
            color: '#10B981',
            isActive: true,
            sortOrder: 2
          },
          {
            name: 'Concert Sound',
            slug: 'concert-sound',
            description: 'Concert and live event sound services',
            categoryId: categories[2].id,
            icon: 'volume-2',
            color: '#F59E0B',
            isActive: true,
            sortOrder: 1
          },
          {
            name: 'Event Audio',
            slug: 'event-audio',
            description: 'Audio services for events and ceremonies',
            categoryId: categories[2].id,
            icon: 'music',
            color: '#F59E0B',
            isActive: true,
            sortOrder: 2
          }
        ]
      });
    }

    if (existingServices.length === 0) {
      console.log('🚀 Creating sample services...');
      const categories = await prisma.serviceCategory.findMany();
      const types = await prisma.serviceType.findMany();

      await prisma.service.createMany({
        data: [
          {
            name: 'Professional Speaker Repair',
            slug: 'professional-speaker-repair',
            description: 'Complete speaker system repair and maintenance service',
            basePriceCents: 500000,
            price: 5000,
            duration: 120,
            categoryId: categories[0].id,
            typeId: types.find(t => t.slug === 'speakers-amplifiers')?.id,
            requirements: 'Bring your speaker system, warranty card if available',
            features: 'Free diagnostic, parts replacement, testing',
            isActive: true,
            isFeatured: true
          },
          {
            name: 'Studio Recording Session',
            slug: 'studio-recording-session',
            description: 'Professional studio recording for vocals and instruments',
            basePriceCents: 2000000,
            price: 20000,
            duration: 180,
            categoryId: categories[1].id,
            typeId: types.find(t => t.slug === 'studio-recording')?.id,
            requirements: 'Bring your instrument or prepare vocals',
            features: 'Professional equipment, engineer assistance, high-quality recording',
            isActive: true,
            isFeatured: true
          },
          {
            name: 'Concert Sound Setup',
            slug: 'concert-sound-setup',
            description: 'Complete sound system setup for concerts and live events',
            basePriceCents: 10000000,
            price: 100000,
            duration: 480,
            categoryId: categories[2].id,
            typeId: types.find(t => t.slug === 'concert-sound')?.id,
            requirements: 'Event details, venue information, equipment list',
            features: 'Full sound system, mixing console, microphones, monitoring',
            isActive: true,
            isFeatured: true
          }
        ]
      });
    }

    console.log('🎉 Service data check completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
if (require.main === module) {
  seedServices()
    .then(() => {
      console.log('✅ Completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed:', error);
      process.exit(1);
    });
}

export { seedServices };
