import { prisma } from './seed-client';
import { randomUUID } from 'crypto';

async function seedCategories() {
  console.log('🌱 Seeding product categories...');

  const categories = [
    { name: 'Loa Karaoke', slug: 'loa-karaoke', description: 'Các loại loa chuyên dụng cho dàn karaoke gia đình và kinh doanh' },
    { name: 'Amply Karaoke', slug: 'amply-karaoke', description: 'Amply khuếch đại âm thanh chất lượng cao' },
    { name: 'Microphone', slug: 'microphone', description: 'Micro không dây và có dây chính hãng' },
    { name: 'Dàn âm thanh', slug: 'dan-am-thanh', description: 'Trọn bộ dàn âm thanh phối ghép sẵn' },
    { name: 'Phụ kiện', slug: 'phu-kien', description: 'Dây loa, giá treo và các phụ kiện âm thanh khác' },
    { name: 'Cục đẩy công suất', slug: 'cuc-day-cong-suat', description: 'Main công suất đẩy cho hệ thống lớn' },
    { name: 'Vang số & Mixer', slug: 'vang-so-mixer', description: 'Thiết bị xử lý tín hiệu âm thanh chuyên nghiệp' },
  ];

  for (const cat of categories) {
    const existing = await prisma.categories.findUnique({
      where: { slug: cat.slug }
    });

    if (existing) {
      console.log(`✓ Category "${cat.name}" already exists`);
    } else {
      await prisma.categories.create({
        data: {
          id: randomUUID(),
          ...cat,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });
      console.log(`✓ Created category: ${cat.name}`);
    }
  }

  console.log('✅ Categories seeding completed!');
}

seedCategories()
  .catch((e) => {
    console.error('❌ Error seeding categories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
