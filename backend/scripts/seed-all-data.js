const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedAllData() {
  console.log(' Bắt đầu seeding dữ liệu mẫu cho Audio Tài Lộc...');
  
  try {
    // 1. Seed Categories
    console.log(' Seeding Categories...');
    const categories = [
      { name: 'Âm thanh chuyên nghiệp', slug: 'am-thanh-chuyen-nghiep', isActive: true },
      { name: 'Thiết bị ghi âm', slug: 'thiet-bi-ghi-am', isActive: true },
      { name: 'Loa & Amplifier', slug: 'loa-amplifier', isActive: true },
    ];
    
    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      });
    }
    console.log(' Đã seed categories');
    
    console.log(' Hoàn thành seeding dữ liệu mẫu!');
  } catch (error) {
    console.error(' Lỗi khi seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAllData();
