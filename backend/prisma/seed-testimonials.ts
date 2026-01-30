/**
 * Seed script for testimonials data
 * Run with: npx ts-node prisma/seed-testimonials.ts
 */

import { prisma } from './seed-client';
import { randomUUID } from 'crypto';

interface TestimonialData {
    name: string;
    position?: string;
    company?: string;
    content: string;
    rating: number;
    avatarUrl?: string;
    displayOrder: number;
}

const testimonials: TestimonialData[] = [
    {
        name: 'Trần Văn Minh',
        position: 'Giám đốc',
        company: 'Karaoke VIP Golden',
        content: 'Đã sử dụng dịch vụ của Audio Tài Lộc cho 15 phòng karaoke. Chất lượng âm thanh tuyệt vời, đội ngũ kỹ thuật chuyên nghiệp. Rất hài lòng!',
        rating: 5,
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        displayOrder: 1,
    },
    {
        name: 'Nguyễn Thị Hương',
        position: 'Chủ quán',
        company: 'Cafe Acoustic Garden',
        content: 'Hệ thống loa nền được Audio Tài Lộc tư vấn rất phù hợp với không gian quán. Khách hàng thường xuyên khen ngợi. Giá cả hợp lý, bảo hành tốt.',
        rating: 5,
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        displayOrder: 2,
    },
    {
        name: 'Lê Đức Anh',
        position: 'Kỹ sư IT',
        company: 'FPT Software',
        content: 'Mua dàn karaoke gia đình tại đây, được tư vấn rất kỹ và lắp đặt miễn phí. Âm thanh hoàn hảo, cả nhà ai cũng thích.',
        rating: 5,
        avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
        displayOrder: 3,
    },
    {
        name: 'Phạm Quốc Hùng',
        position: 'Trưởng phòng Marketing',
        company: 'Công ty Sự kiện ABC',
        content: 'Thuê hệ thống âm thanh cho nhiều sự kiện qua Audio Tài Lộc. Thiết bị hiện đại, kỹ thuật viên hỗ trợ nhiệt tình 24/7. Sẽ tiếp tục hợp tác lâu dài.',
        rating: 5,
        avatarUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
        displayOrder: 4,
    },
    {
        name: 'Đặng Thị Ngọc',
        position: 'Giám đốc F&B',
        company: 'Nhà hàng Phố Cổ',
        content: 'Hệ thống âm thanh nhà hàng được Audio Tài Lộc setup rất chuyên nghiệp. Âm nhạc phát đều khắp không gian, không quá to cũng không quá nhỏ.',
        rating: 4,
        avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
        displayOrder: 5,
    },
    {
        name: 'Hoàng Văn Tuấn',
        position: 'Chủ đầu tư',
        company: 'Cinema House',
        content: 'Đầu tư hệ thống Home Theater cho villa. Audio Tài Lộc tư vấn từ A-Z, hiệu ứng Dolby Atmos như rạp phim. Đáng đồng tiền bát gạo!',
        rating: 5,
        avatarUrl: 'https://randomuser.me/api/portraits/men/77.jpg',
        displayOrder: 6,
    },
    {
        name: 'Bùi Thị Mai Lan',
        position: 'Hiệu trưởng',
        company: 'Trường THCS Nguyễn Du',
        content: 'Hệ thống âm thanh hội trường trường học được lắp đặt hoàn hảo. Mic không dây hoạt động ổn định, phù hợp cho các buổi lễ và hội nghị.',
        rating: 5,
        avatarUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
        displayOrder: 7,
    },
    {
        name: 'Vũ Đình Phong',
        position: 'Producer',
        company: 'Phong Music Studio',
        content: 'Setup phòng thu của tôi với thiết bị từ Audio Tài Lộc. Chất lượng âm thanh chuẩn studio, giá tốt hơn nhiều nơi khác. Highly recommend!',
        rating: 5,
        avatarUrl: 'https://randomuser.me/api/portraits/men/88.jpg',
        displayOrder: 8,
    },
];

async function main() {
    console.log('⭐ Seeding testimonials data...');

    let created = 0;
    let skipped = 0;

    for (const item of testimonials) {
        // Check if testimonial already exists by name and company
        const existing = await prisma.testimonials.findFirst({
            where: {
                name: item.name,
                company: item.company,
            },
        });

        if (existing) {
            console.log(`✓ Testimonial from "${item.name}" already exists`);
            skipped++;
            continue;
        }

        await prisma.testimonials.create({
            data: {
                id: randomUUID(),
                name: item.name,
                position: item.position,
                company: item.company,
                content: item.content,
                rating: item.rating,
                avatarUrl: item.avatarUrl,
                displayOrder: item.displayOrder,
                isActive: true,
                updatedAt: new Date(),
            },
        });

        console.log(`✅ Created testimonial from: ${item.name} (${item.company})`);
        created++;
    }

    console.log(`\n✅ Testimonials seeding completed!`);
    console.log(`   - Created: ${created} testimonials`);
    console.log(`   - Skipped: ${skipped} testimonials (already exist)`);
    console.log(`   - Total: ${testimonials.length} testimonials`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding testimonials:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
