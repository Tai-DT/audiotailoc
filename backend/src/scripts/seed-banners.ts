import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('🧹 Cleaning up old banners...');
    await prisma.banners.updateMany({
      data: { isDeleted: true, isActive: false },
    });

    const banners = [
      {
        id: randomUUID(),
        title: 'Trải Nghiệm Âm Thanh Đỉnh Cao',
        subtitle: 'Hệ Thống Karaoke Gia Đình Hạng Sang',
        description:
          'Mang không gian sân khấu chuyên nghiệp về ngay phòng khách nhà bạn với các giải pháp âm thanh từ JBL, Bose, BMB.',
        imageUrl: '/images/banners/home-hero.png',
        page: 'home',
        position: 1,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: 'Chào Xuân 2026 - Bùng Nổ Ưu Đãi',
        subtitle: 'Giảm giá lên đến 40%',
        description:
          'Cơ hội sở hữu thiết bị âm thanh chính hãng với mức giá tốt nhất năm. Tặng phụ kiện và gói lắp đặt chuyên nghiệp.',
        imageUrl: '/images/banners/promo-2026.png',
        page: 'home',
        position: 2,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: 'Showroom Thiết Bị Âm Thanh Chính Hãng',
        subtitle: 'Đa dạng mẫu mã - Cam kết chất lượng',
        description:
          'Khám phá hàng ngàn sản phẩm từ Loa, Amply, Micro đến các bộ dàn Karaoke trọn gói.',
        imageUrl: '/images/banners/products-hero.png',
        page: 'products',
        position: 1,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: 'Dịch vụ Kỹ thuật & Lắp đặt Chuyên nghiệp',
        subtitle: 'Hỗ trợ tận tâm 24/7',
        description:
          'Đội ngũ kỹ thuật viên giàu kinh nghiệm, khảo sát và lắp đặt tận nơi. Bảo hành, bảo trì định kỳ uy tín.',
        imageUrl: '/images/banners/services-hero.png',
        page: 'services',
        position: 1,
        isActive: true,
        updatedAt: new Date(),
      },
    ];

    console.log('🚀 Seeding new banners...');
    for (const banner of banners) {
      await prisma.banners.create({ data: banner });
    }

    console.log('✅ Banner seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding banners:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
