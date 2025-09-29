/*
  Service Types Seed Script - Tạo dữ liệu mẫu cho Service Types
  Usage: npx ts-node src/seed-service-types.ts
*/
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding service types...');

  const serviceTypes = [
    {
      id: 'st-home-theater',
      name: 'Home Theater',
      description: 'Hệ thống âm thanh rạp phim gia đình với công nghệ surround sound hiện đại',
      icon: '🎬',
      color: '#3B82F6',
      sortOrder: 1,
      slug: 'home-theater',
      isActive: true,
      updatedAt: new Date(),
    },
    {
      id: 'st-commercial-audio',
      name: 'Commercial Audio',
      description: 'Giải pháp âm thanh chuyên nghiệp cho văn phòng, cửa hàng và không gian thương mại',
      icon: '🏢',
      color: '#10B981',
      sortOrder: 2,
      slug: 'commercial-audio',
      isActive: true,
      updatedAt: new Date(),
    },
    {
      id: 'st-karaoke-system',
      name: 'Karaoke System',
      description: 'Hệ thống karaoke chuyên nghiệp cho phòng hát và giải trí',
      icon: '🎤',
      color: '#F59E0B',
      sortOrder: 3,
      slug: 'karaoke-system',
      isActive: true,
      updatedAt: new Date(),
    },
    {
      id: 'st-restaurant-audio',
      name: 'Restaurant Audio',
      description: 'Âm thanh chất lượng cao cho nhà hàng và quán ăn',
      icon: '🍽️',
      color: '#EF4444',
      sortOrder: 4,
      slug: 'restaurant-audio',
      isActive: true,
      updatedAt: new Date(),
    },
    {
      id: 'st-studio-recording',
      name: 'Studio Recording',
      description: 'Thiết bị thu âm chuyên nghiệp cho studio và podcast',
      icon: '🎵',
      color: '#8B5CF6',
      sortOrder: 5,
      slug: 'studio-recording',
      isActive: true,
      updatedAt: new Date(),
    },
    {
      id: 'st-conference-system',
      name: 'Conference System',
      description: 'Hệ thống âm thanh hội nghị và hội thảo chuyên nghiệp',
      icon: '🎙️',
      color: '#06B6D4',
      sortOrder: 6,
      slug: 'conference-system',
      isActive: true,
      updatedAt: new Date(),
    },
    {
      id: 'st-outdoor-audio',
      name: 'Outdoor Audio',
      description: 'Giải pháp âm thanh ngoài trời chống thời tiết',
      icon: '🌞',
      color: '#84CC16',
      sortOrder: 7,
      slug: 'outdoor-audio',
      isActive: true,
      updatedAt: new Date(),
    },
    {
      id: 'st-sound-reinforcement',
      name: 'Sound Reinforcement',
      description: 'Hệ thống khuếch đại âm thanh cho sự kiện và biểu diễn',
      icon: '🔊',
      color: '#F97316',
      sortOrder: 8,
      slug: 'sound-reinforcement',
      isActive: true,
      updatedAt: new Date(),
    },
  ];

  console.log(`📝 Creating ${serviceTypes.length} service types...`);

  for (const serviceTypeData of serviceTypes) {
    try {
      // Check if service type exists
      const existing = await prisma.service_types.findUnique({
        where: { slug: serviceTypeData.slug }
      });

      if (existing) {
        console.log(`✓ Updating service type: ${serviceTypeData.name}`);
        await prisma.service_types.update({
          where: { slug: serviceTypeData.slug },
          data: serviceTypeData
        });
      } else {
        console.log(`✓ Creating service type: ${serviceTypeData.name}`);
        await prisma.service_types.create({
          data: serviceTypeData
        });
      }
    } catch (error) {
      console.error(`✗ Error with service type ${serviceTypeData.name}:`, error);
    }
  }

  console.log('✅ Service types seeding completed!');
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