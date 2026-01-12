import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function seedServiceTypes() {
  console.log('🛠️ Seeding service types...');

  const types = [
    { name: 'Lắp đặt', slug: 'lap-dat', description: 'Dịch vụ lắp đặt hệ thống âm thanh tại nhà', icon: 'Settings', color: '#3b82f6' },
    { name: 'Sửa chữa', slug: 'sua-chua', description: 'Sửa chữa thiết bị âm thanh chuyên nghiệp', icon: 'Wrench', color: '#ef4444' },
    { name: 'Khảo sát', slug: 'khao-sat', description: 'Khảo sát và tư vấn giải pháp âm thanh tận nơi', icon: 'Search', color: '#10b981' },
    { name: 'Bảo trì', slug: 'bao-tri', description: 'Dịch vụ bảo dưỡng định kỳ hệ thống âm thanh', icon: 'Shield', color: '#f59e0b' },
  ];

  for (const t of types) {
    const existing = await prisma.service_types.findUnique({
      where: { slug: t.slug }
    });

    if (existing) {
      console.log(`✓ Service type "${t.name}" already exists`);
    } else {
      await prisma.service_types.create({
        data: {
          id: randomUUID(),
          ...t,
          isActive: true,
          updatedAt: new Date(),
        }
      });
      console.log(`✓ Created service type: ${t.name}`);
    }
  }

  console.log('✅ Service types seeding completed!');
}

seedServiceTypes()
  .catch((e) => {
    console.error('❌ Error seeding service types:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
