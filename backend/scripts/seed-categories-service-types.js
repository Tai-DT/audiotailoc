const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedCategoriesAndServiceTypes() {
  console.log('🌱 Seeding categories and service types...');

  try {
    // Seed categories for products
    const categories = [
      { name: 'Âm thanh chuyên nghiệp', slug: 'am-thanh-chuyen-nghiep', isActive: true },
      { name: 'Thiết bị ghi âm', slug: 'thiet-bi-ghi-am', isActive: true },
      { name: 'Loa & Amplifier', slug: 'loa-amplifier', isActive: true },
      { name: 'Microphone', slug: 'microphone', isActive: true },
      { name: 'Mixer & Console', slug: 'mixer-console', isActive: true },
      { name: 'Phụ kiện âm thanh', slug: 'phu-kien-am-thanh', isActive: true },
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      });
    }

    console.log('✅ Categories seeded successfully');

    // Seed service types
    const serviceTypes = [
      { name: 'Lắp đặt hệ thống', slug: 'lap-dat-he-thong', description: 'Lắp đặt và cấu hình hệ thống âm thanh chuyên nghiệp', isActive: true, sortOrder: 1 },
      { name: 'Bảo trì - Sửa chữa', slug: 'bao-tri-sua-chua', description: 'Bảo trì định kỳ và sửa chữa thiết bị âm thanh', isActive: true, sortOrder: 2 },
      { name: 'Tư vấn kỹ thuật', slug: 'tu-van-ky-thuat', description: 'Tư vấn thiết kế và lựa chọn giải pháp âm thanh', isActive: true, sortOrder: 3 },
      { name: 'Đào tạo - Huấn luyện', slug: 'dao-tao-huan-luyen', description: 'Đào tạo sử dụng thiết bị và kỹ thuật âm thanh', isActive: true, sortOrder: 4 },
      { name: 'Thuê thiết bị', slug: 'thue-thiet-bi', description: 'Cho thuê thiết bị âm thanh sự kiện', isActive: true, sortOrder: 5 },
    ];

    for (const serviceType of serviceTypes) {
      await prisma.serviceType.upsert({
        where: { slug: serviceType.slug },
        update: serviceType,
        create: serviceType,
      });
    }

    console.log('✅ Service types seeded successfully');

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedCategoriesAndServiceTypes()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });