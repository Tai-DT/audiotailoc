import { prisma } from './seed-client';
import { randomUUID } from 'crypto';

async function seedQuocVinhCategories() {
    console.log('🗑️ Xoá toàn bộ sản phẩm cũ...');

    // Xoá các bảng liên quan trước
    await prisma.cart_items.deleteMany({});
    await prisma.order_items.deleteMany({});
    await prisma.product_reviews.deleteMany({});
    await prisma.product_views.deleteMany({});
    await prisma.inventory_alerts.deleteMany({});
    await prisma.inventory_movements.deleteMany({});
    await prisma.inventory.deleteMany({});
    await prisma.wishlist_items.deleteMany({});

    // Xoá sản phẩm
    const deletedProducts = await prisma.products.deleteMany({});
    console.log(`✅ Đã xoá ${deletedProducts.count} sản phẩm cũ`);

    // Xoá categories cũ
    await prisma.categories.deleteMany({});
    console.log('✅ Đã xoá categories cũ');

    console.log('🌱 Tạo categories mới từ Quốc Vinh Audio...');

    const categories = [
        {
            name: 'Dàn Karaoke',
            slug: 'dan-karaoke',
            description: 'Trọn bộ dàn karaoke cao cấp cho gia đình và kinh doanh, bao gồm loa, amply, mic và các thiết bị đi kèm',
            imageUrl: '/images/categories/dan-karaoke.jpg'
        },
        {
            name: 'Loa Karaoke',
            slug: 'loa-karaoke',
            description: 'Loa karaoke chất lượng cao từ các thương hiệu CAF, E3 Audio với âm thanh sống động',
            imageUrl: '/images/categories/loa-karaoke.jpg'
        },
        {
            name: 'Loa Sub',
            slug: 'loa-sub',
            description: 'Loa sub bass mạnh mẽ, tái tạo âm trầm sâu cho dàn karaoke chuyên nghiệp',
            imageUrl: '/images/categories/loa-sub.jpg'
        },
        {
            name: 'Vang Số / Mixer',
            slug: 'vang-so-mixer',
            description: 'Vang số, mixer xử lý tín hiệu âm thanh chuyên nghiệp với công nghệ chống hú thông minh',
            imageUrl: '/images/categories/vang-so.jpg'
        },
        {
            name: 'Microphone',
            slug: 'microphone',
            description: 'Micro không dây cao cấp với khả năng thu sóng ổn định, chống hú feedback hiệu quả',
            imageUrl: '/images/categories/microphone.jpg'
        },
        {
            name: 'Amply & Cục Đẩy',
            slug: 'amply-cuc-day',
            description: 'Amply và cục đẩy công suất lớn cho hệ thống âm thanh karaoke chuyên nghiệp',
            imageUrl: '/images/categories/amply.jpg'
        },
        {
            name: 'Đầu Karaoke',
            slug: 'dau-karaoke',
            description: 'Đầu karaoke VOD với kho bài hát khổng lồ, giao diện dễ sử dụng',
            imageUrl: '/images/categories/dau-karaoke.jpg'
        },
        {
            name: 'Màn Hình Chọn Bài',
            slug: 'man-hinh-chon-bai',
            description: 'Màn hình cảm ứng chọn bài karaoke thông minh, dễ thao tác',
            imageUrl: '/images/categories/man-hinh.jpg'
        }
    ];

    for (const cat of categories) {
        await prisma.categories.create({
            data: {
                id: randomUUID(),
                ...cat,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });
        console.log(`✓ Tạo category: ${cat.name}`);
    }

    console.log('✅ Hoàn thành tạo categories!');
}

seedQuocVinhCategories()
    .catch((e) => {
        console.error('❌ Lỗi:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
