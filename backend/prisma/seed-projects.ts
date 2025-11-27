import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function seedProjects() {
    console.log('🎨 Seeding projects...');

    // Get admin user
    const admin = await prisma.users.findFirst({
        where: { email: 'admin@audiotailoc.com' }
    });

    if (!admin) {
        console.error('❌ Admin user not found');
        return;
    }

    const now = new Date();

    const projects = [
        {
            id: randomUUID(),
            name: 'Phòng Karaoke Luxury - Quận 1',
            slug: 'phong-karaoke-luxury-quan-1',
            description: 'Hệ thống âm thanh karaoke cao cấp cho phòng VIP',
            shortDescription: 'Dự án lắp đặt hệ thống karaoke chuyên nghiệp',
            client: 'Karaoke ABC Premium',
            category: 'Karaoke',
            status: 'COMPLETED' as const,
            isActive: true,
            isFeatured: true,
            thumbnailImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
            youtubeVideoId: 'dQw4w9WgXcQ',
            liveUrl: 'https://karaokeabc.com',
            startDate: new Date('2024-09-01'),
            endDate: new Date('2024-10-15'),
            duration: '6 tuần',
            viewCount: 1250,
            displayOrder: 1,
            userId: admin.id,
            content: '<h2>Chi tiết dự án</h2><p>Lắp đặt hệ thống âm thanh karaoke cao cấp với 20 phòng hát.</p>',
            technologies: 'JBL, Yamaha, Shure, Crown',
            features: 'Âm thanh chất lượng cao, Ánh sáng LED hiện đại, Màn hình cảm ứng',
            results: 'Tăng 40% doanh thu sau khi nâng cấp hệ thống',
            createdAt: new Date('2024-09-01'),
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: 'Hệ thống loa hội trường 500 người',
            slug: 'he-thong-loa-hoi-truong-500-nguoi',
            description: 'Âm thanh hội trường quy mô lớn',
            shortDescription: 'Lắp đặt hệ thống âm thanh hội trường chuyên nghiệp',
            client: 'Trung tâm Hội nghị XYZ',
            category: 'Hội trường',
            status: 'COMPLETED' as const,
            isActive: true,
            isFeatured: true,
            thumbnailImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            liveUrl: 'https://hoitruongxyz.com',
            startDate: new Date('2024-08-01'),
            endDate: new Date('2024-09-01'),
            duration: '4 tuần',
            viewCount: 890,
            displayOrder: 2,
            userId: admin.id,
            content: '<h2>Dự án hội trường</h2><p>Hệ thống âm thanh cho hội trường 500 chỗ ngồi.</p>',
            technologies: 'Bose, QSC, Sennheiser',
            features: 'Line array speakers, Digital mixer, Wireless microphones',
            createdAt: new Date('2024-08-01'),
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: 'Quán Cafe Âm Nhạc Acoustic',
            slug: 'quan-cafe-am-nhac-acoustic',
            description: 'Hệ thống âm thanh cafe nhạc sống',
            shortDescription: 'Thiết kế âm thanh cho không gian cafe nhạc sống',
            client: 'Cafe Melody',
            category: 'Cafe & Bar',
            status: 'IN_PROGRESS' as const,
            isActive: true,
            isFeatured: false,
            thumbnailImage: 'https://images.unsplash.com/photo-1501295114620-7e6e1fd813d0?w=800',
            startDate: new Date('2024-11-01'),
            duration: '3 tuần',
            viewCount: 320,
            displayOrder: 3,
            userId: admin.id,
            content: '<h2>Cafe âm nhạc</h2><p>Thiết kế hệ thống âm thanh cho không gian nhạc sống.</p>',
            technologies: 'Yamaha, Mackie, Audio-Technica',
            createdAt: new Date('2024-11-01'),
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: 'Nhà hát Mini 200 chỗ',
            slug: 'nha-hat-mini-200-cho',
            description: 'Âm thanh và ánh sáng sân khấu chuyên nghiệp',
            shortDescription: 'Dự án âm thanh và ánh sáng nhà hát',
            client: 'Nhà hát Mini Sài Gòn',
            category: 'Nhà hát',
            status: 'COMPLETED' as const,
            isActive: true,
            isFeatured: true,
            thumbnailImage: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
            youtubeVideoId: 'abc123xyz',
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-08-30'),
            duration: '8 tuần',
            viewCount: 1560,
            displayOrder: 0,
            userId: admin.id,
            content: '<h2>Nhà hát chuyên nghiệp</h2><p>Hệ thống âm thanh và ánh sáng sân khấu đẳng cấp.</p>',
            technologies: 'L-Acoustics, Allen & Heath, ETC',
            features: 'Surround sound, Stage lighting, Digital control',
            results: 'Chất lượng âm thanh được đánh giá 5 sao',
            testimonial: 'Hệ thống âm thanh tuyệt vời, đội ngũ chuyên nghiệp!',
            createdAt: new Date('2024-07-01'),
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: 'Studio thu âm chuyên nghiệp',
            slug: 'studio-thu-am-chuyen-nghiep',
            description: 'Thiết kế và lắp đặt studio thu âm',
            shortDescription: 'Studio thu âm chuẩn quốc tế',
            client: 'Music Production House',
            category: 'Studio',
            status: 'ON_HOLD' as const,
            isActive: false,
            isFeatured: false,
            thumbnailImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
            startDate: new Date('2024-10-01'),
            duration: '6 tuần',
            viewCount: 180,
            displayOrder: 10,
            userId: admin.id,
            content: '<h2>Studio thu âm</h2><p>Phòng thu âm với cách âm chuyên nghiệp.</p>',
            technologies: 'Neumann, Universal Audio, Genelec',
            createdAt: new Date('2024-10-01'),
            updatedAt: now,
        },
    ];

    for (const project of projects) {
        const created = await prisma.projects.create({
            data: project,
        });
        console.log(`✅ Created project: ${created.name}`);
    }

    console.log(`\n✅ Successfully seeded ${projects.length} projects`);
}

seedProjects()
    .catch((e) => {
        console.error('❌ Error seeding projects:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
