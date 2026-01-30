import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || '';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Seed banners with separate images for Light and Dark themes.
 * - imageUrl: Ảnh cho theme Sáng (light mode)
 * - darkImageUrl: Ảnh cho theme Tối (dark mode)
 */
async function main() {
    console.log('🎨 Seeding banners with Light/Dark theme images...\n');

    const banners = [
        {
            id: randomUUID(),
            title: 'Dàn Gia Đẳng',
            subtitle: 'TRẢI NGHIỆM ĐỈ̉NH CAO - MANG CHUẨN RẠP VỀ NHÀ',
            description: 'Mang cả rạp hát về ngôi nhà của bạn với hệ thống âm thanh Hi-End tinh tế và năng biệt.',
            imageUrl: '/images/banners/hero-showroom-light.png',
            darkImageUrl: '/images/banners/hero-cinema-dark.png',
            mobileImageUrl: null,
            darkMobileImageUrl: null,
            linkUrl: '/products',
            buttonLabel: 'Khám phá ngay',
            page: 'home',
            position: 0,
            isActive: true,
            isDeleted: false,
        },
        {
            id: randomUUID(),
            title: 'Karaoke VIP',
            subtitle: 'KHÔNG GIAN GIẢI TRÍ ĐẲNG CẤP',
            description: 'Giải pháp karaoke gia đình đẳng cấp, kết hợp công nghệ tối tân và thiết kế sang trọng.',
            imageUrl: '/images/banners/hero-karaoke-light.png',
            darkImageUrl: '/images/banners/hero-karaoke-dark.png',
            mobileImageUrl: null,
            darkMobileImageUrl: null,
            linkUrl: '/categories/karaoke',
            buttonLabel: 'Xem ngay',
            page: 'home',
            position: 1,
            isActive: true,
            isDeleted: false,
        },
        {
            id: randomUUID(),
            title: 'Sân Khấu Pro',
            subtitle: 'CÔNG SUẤT & SỨC MẠNH CHUYÊN NGHIỆP',
            description: 'Hệ thống âm thanh sân khấu chuyên nghiệp, bền bỉ, đáp ứng mọi quy mô sự kiện.',
            imageUrl: '/images/banners/hero-stage-light.png',
            darkImageUrl: '/images/banners/hero-stage-dark.png',
            mobileImageUrl: null,
            darkMobileImageUrl: null,
            linkUrl: '/categories/loa-san-khau',
            buttonLabel: 'Tìm hiểu thêm',
            page: 'home',
            position: 2,
            isActive: true,
            isDeleted: false,
        },
        {
            id: randomUUID(),
            title: 'Dịch Vụ Lắp Đặt',
            subtitle: 'THI CÔNG CHUYÊN NGHIỆP TẠI NHÀ',
            description: 'Đội ngũ kỹ thuật viên tay nghề cao, lắp đặt tận nơi với chế độ bảo hành dài hạn.',
            imageUrl: '/images/banners/service-install-light.png',
            darkImageUrl: '/images/banners/service-install-dark.png',
            mobileImageUrl: null,
            darkMobileImageUrl: null,
            linkUrl: '/services',
            buttonLabel: 'Đặt lịch ngay',
            page: 'home',
            position: 3,
            isActive: true,
            isDeleted: false,
        },
    ];

    // Delete existing home banners
    await prisma.banners.deleteMany({
        where: { page: 'home' },
    });
    console.log('✅ Deleted old home banners.');

    // Insert new banners
    for (const banner of banners) {
        await prisma.banners.create({
            data: {
                ...banner,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        console.log(`✅ Created banner: ${banner.title}`);
    }

    console.log('\n🎉 Successfully seeded', banners.length, 'banners with Light/Dark images!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
