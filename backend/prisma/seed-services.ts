import { prisma } from './seed-client';
import { randomUUID } from 'crypto';

async function seedServices() {
  console.log('🛠️ Seeding services...');

  const types = await prisma.service_types.findMany();
  if (types.length === 0) {
    console.error('❌ No service types found. Run seed-service-types.ts first.');
    return;
  }

  const typeMap = new Map(types.map(t => [t.slug, t.id]));

  const services = [
    {
      name: 'Lắp đặt dàn Karaoke gia đình',
      slug: 'lap-dat-karaoke-gia-dinh',
      description: 'Dịch vụ lắp đặt trọn gói dàn karaoke cho gia đình, bao gồm khảo sát, thiết kế vị trí loa và cân chỉnh âm thanh chuyên nghiệp.',
      shortDescription: 'Lắp đặt dàn karaoke gia đình trọn gói',
      basePriceCents: 100000000, // 1.000.000 VND
      price: 100000000,
      duration: 120, // 2 hours
      typeId: typeMap.get('lap-dat'),
      images: JSON.stringify(['https://placehold.co/800x600/png?text=Lap+dat+karaoke']),
      isFeatured: true,
      features: JSON.stringify(['Cân chỉnh âm thanh', 'Hướng dẫn sử dụng', 'Bảo hành 12 tháng']),
    },
    {
      name: 'Sửa chữa Loa & Amply',
      slug: 'sua-chua-loa-amply',
      description: 'Sửa chữa các lỗi phổ biến của loa và amply như mất tiếng, rè, hỏng mạch hoặc cháy cuộn cảm.',
      shortDescription: 'Sửa chữa thiết bị âm thanh chuyên nghiệp',
      basePriceCents: 50000000, // 500.000 VND
      price: 50000000,
      duration: 60,
      typeId: typeMap.get('sua-chua'),
      images: JSON.stringify(['https://placehold.co/800x600/png?text=Sua+chua+loa']),
      isFeatured: false,
    },
    {
      name: 'Tư vấn & Khảo sát phòng phim',
      slug: 'tu-van-phong-phim',
      description: 'Khảo sát không gian và tư vấn giải pháp lắp đặt phòng chiếu phim gia đình tiêu chuẩn 5.1, 7.1, Atmos.',
      shortDescription: 'Tư vấn giải pháp phòng phim gia đình',
      basePriceCents: 30000000,
      price: 30000000,
      duration: 45,
      typeId: typeMap.get('khao-sat'),
      images: JSON.stringify(['https://placehold.co/800x600/png?text=Tu-van-phong-phim']),
      isFeatured: true,
    }
  ];

  for (const s of services) {
    const existing = await prisma.services.findUnique({
      where: { slug: s.slug }
    });

    if (existing) {
      console.log(`✓ Service "${s.name}" already exists`);
    } else {
      await prisma.services.create({
        data: {
          id: randomUUID(),
          ...s,
          isActive: true,
          updatedAt: new Date(),
        }
      });
      console.log(`✓ Created service: ${s.name}`);
    }
  }

  console.log('✅ Services seeding completed!');
}

seedServices()
  .catch((e) => {
    console.error('❌ Error seeding services:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
