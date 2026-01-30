import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';

async function main() {
  const connectionString = process.env.DATABASE_URL || '';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  const prisma = new PrismaClient({
    adapter,
  });

  try {
    console.log('🧹 Cleaning up old banners...');
    await prisma.banners.updateMany({
      data: { isDeleted: true, isActive: false },
    });

    const banners = [
      {
        id: randomUUID(),
        title: 'Audio Tài Lộc Royal Elite',
        subtitle: 'Đẳng Cấp Âm Thanh Hoàng Gia',
        description:
          'Trải nghiệm đỉnh cao công nghệ âm thanh với thiết kế sang trọng, quý phái. Sự kết hợp hoàn hảo giữa Sắc Đỏ Quyền Lực và Ánh Kim Vương Giả.',
        imageUrl: '/images/banners/banner_master_sound.png',
        page: 'home',
        position: 0,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: 'Gắn Kết Yêu Thương',
        subtitle: 'Phòng Hát Tại Gia - Đẳng Cấp Thượng Lưu',
        description:
          'Biến phòng khách thành sân khấu chuyên nghiệp. Nơi lưu giữ những khoảnh khắc hạnh phúc cùng gia đình trong không gian ấm cúng và sang trọng.',
        imageUrl: '/images/banners/banner_luxury_karaoke.png',
        page: 'home',
        position: 1,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: 'Sức Mạnh Vượt Trội',
        subtitle: 'Giải Pháp Âm Thanh Sân Khấu Chuyên Nghiệp',
        description:
          'Hệ thống loa công suất lớn, chinh phục mọi không gian. Đánh thức mọi giác quan với chất âm mạnh mẽ, sống động và chân thực nhất.',
        imageUrl: '/images/banners/banner_pro_stage.png',
        page: 'home',
        position: 2,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: 'Bộ Sưu Tập Royal Elite',
        subtitle: 'Tinh Hoa Âm Thanh Thế Giới',
        description:
          'Khám phá những kiệt tác âm thanh đến từ các thương hiệu hàng đầu. Thiết kế sang trọng, chất âm đỉnh cao.',
        imageUrl: '/images/banners/banner_products_showcase.png',
        page: 'products',
        position: 1,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: 'Dịch Vụ Lắp Đặt Chuyên Nghiệp',
        subtitle: 'Kiến Tạo Không Gian Giải Trí',
        description:
          'Đội ngũ kỹ thuật viên giàu kinh nghiệm, thi công tỉ mỉ, đảm bảo thẩm mỹ và chất lượng âm thanh tốt nhất cho ngôi nhà của bạn.',
        imageUrl: '/images/banners/banner_service_installation.png',
        page: 'services',
        position: 1,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: 'Cân Chỉnh Âm Thanh Đỉnh Cao',
        subtitle: 'Đánh Thức Tiềm Năng Hệ Thống',
        description:
          'Quy trình căn chỉnh chuyên sâu, tối ưu hóa mọi thiết bị để đạt được độ chi tiết và trung thực tuyệt đối.',
        imageUrl: '/images/banners/banner_service_tuning.png',
        page: 'services',
        position: 2,
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
