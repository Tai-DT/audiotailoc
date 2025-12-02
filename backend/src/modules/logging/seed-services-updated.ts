import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function seedServices() {
  console.log('🌱 Seeding service data...');

  try {
    // Check existing data
    const existingTypes = await prisma.service_types.findMany();
    const existingServices = await prisma.services.findMany();

    console.log(`📊 Found: ${existingTypes.length} service types, ${existingServices.length} services`);

    // Create Service Types if none exist
    if (existingTypes.length === 0) {
      console.log('🚀 Creating service types...');
      await prisma.service_types.createMany({
        data: [
          {
            id: randomUUID(),
            name: 'Audio Equipment',
            slug: 'audio-equipment',
            description: 'Professional audio equipment installation and setup',
            icon: 'speaker',
            color: '#3B82F6',
            isActive: true,
            sortOrder: 1,
            updatedAt: new Date()
          },
          {
            id: randomUUID(),
            name: 'Home Theater',
            slug: 'home-theater',
            description: 'Complete home theater system installation',
            icon: 'tv',
            color: '#8B5CF6',
            isActive: true,
            sortOrder: 2,
            updatedAt: new Date()
          },
          {
            id: randomUUID(),
            name: 'Professional Sound',
            slug: 'professional-sound',
            description: 'Professional sound system for events and venues',
            icon: 'microphone',
            color: '#10B981',
            isActive: true,
            sortOrder: 3,
            updatedAt: new Date()
          },
          {
            id: randomUUID(),
            name: 'Maintenance',
            slug: 'maintenance',
            description: 'Regular maintenance and support services',
            icon: 'wrench',
            color: '#F59E0B',
            isActive: true,
            sortOrder: 4,
            updatedAt: new Date()
          }
        ]
      });

      console.log('✅ Service types created successfully');
    }

    // Get service types for creating services
    const serviceTypes = await prisma.service_types.findMany();
    const audioEquipmentType = serviceTypes.find(t => t.slug === 'audio-equipment');
    const homeTheaterType = serviceTypes.find(t => t.slug === 'home-theater');
    const professionalSoundType = serviceTypes.find(t => t.slug === 'professional-sound');
    const maintenanceType = serviceTypes.find(t => t.slug === 'maintenance');

    // Create Services if none exist
    if (existingServices.length === 0) {
      console.log('🚀 Creating services...');
      
      const servicesData = [
        // Audio Equipment Services
        {
          id: randomUUID(),
          name: 'Speaker Installation',
          slug: 'speaker-installation',
          description: 'Professional speaker installation service for home and office',
          shortDescription: 'Expert speaker setup and configuration',
          typeId: audioEquipmentType?.id,
          basePriceCents: 150000, // 1,500,000 VND
          price: 150000,
          minPrice: 100000,
          maxPrice: 300000,
          priceType: 'RANGE',
          duration: 120, // 2 hours
          isActive: true,
          isFeatured: true,
          tags: JSON.stringify(['speaker', 'installation', 'audio']),
          features: JSON.stringify(['Professional installation', 'Cable management', 'Sound testing', '30-day warranty']),
          requirements: JSON.stringify(['Power outlet access', 'Wall mounting permission', 'Clear workspace']),
          updatedAt: new Date()
        },
        {
          id: randomUUID(),
          name: 'Audio System Setup',
          slug: 'audio-system-setup',
          description: 'Complete audio system configuration and optimization',
          shortDescription: 'Full audio system setup and tuning',
          typeId: audioEquipmentType?.id,
          basePriceCents: 200000,
          price: 200000,
          duration: 180,
          isActive: true,
          isFeatured: false,
          updatedAt: new Date()
        },

        // Home Theater Services
        {
          id: randomUUID(),
          name: 'Home Theater Installation',
          slug: 'home-theater-installation',
          description: 'Complete home theater system installation including TV, speakers, and receivers',
          shortDescription: 'Full home theater setup service',
          typeId: homeTheaterType?.id,
          basePriceCents: 500000,
          price: 500000,
          minPrice: 300000,
          maxPrice: 1000000,
          priceType: 'RANGE',
          duration: 360, // 6 hours
          isActive: true,
          isFeatured: true,
          updatedAt: new Date()
        },
        {
          id: randomUUID(),
          name: 'TV Wall Mounting',
          slug: 'tv-wall-mounting',
          description: 'Professional TV wall mounting service with cable management',
          shortDescription: 'Secure TV wall mounting',
          typeId: homeTheaterType?.id,
          basePriceCents: 80000,
          price: 80000,
          duration: 90,
          isActive: true,
          isFeatured: false,
          updatedAt: new Date()
        },

        // Professional Sound Services
        {
          id: randomUUID(),
          name: 'Event Sound Setup',
          slug: 'event-sound-setup',
          description: 'Professional sound system setup for events, conferences, and performances',
          shortDescription: 'Event audio system rental and setup',
          typeId: professionalSoundType?.id,
          basePriceCents: 1000000,
          price: 1000000,
          priceType: 'NEGOTIABLE',
          duration: 480, // 8 hours
          isActive: true,
          isFeatured: true,
          updatedAt: new Date()
        },
        {
          id: randomUUID(),
          name: 'Studio Recording Setup',
          slug: 'studio-recording-setup',
          description: 'Recording studio equipment installation and acoustic treatment',
          shortDescription: 'Professional recording studio setup',
          typeId: professionalSoundType?.id,
          basePriceCents: 2000000,
          price: 2000000,
          duration: 720, // 12 hours
          isActive: true,
          isFeatured: false,
          updatedAt: new Date()
        },

        // Maintenance Services
        {
          id: randomUUID(),
          name: 'Audio Equipment Maintenance',
          slug: 'audio-equipment-maintenance',
          description: 'Regular maintenance and cleaning of audio equipment',
          shortDescription: 'Equipment maintenance service',
          typeId: maintenanceType?.id,
          basePriceCents: 100000,
          price: 100000,
          duration: 120,
          isActive: true,
          isFeatured: false,
          updatedAt: new Date()
        },
        {
          id: randomUUID(),
          name: 'System Troubleshooting',
          slug: 'system-troubleshooting',
          description: 'Diagnosis and repair of audio system issues',
          shortDescription: 'Audio system repair service',
          typeId: maintenanceType?.id,
          basePriceCents: 120000,
          price: 120000,
          priceType: 'FIXED',
          duration: 60,
          isActive: true,
          isFeatured: false,
          updatedAt: new Date()
        }
      ];

      await prisma.services.createMany({
        data: servicesData
      });

      console.log('✅ Services created successfully');
    }

    console.log('🎉 Service seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding services:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedServices()
    .then(() => {
      console.log('✅ Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}

export default seedServices;