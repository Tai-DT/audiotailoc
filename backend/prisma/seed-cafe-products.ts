import { prisma } from './seed-client';
import { randomUUID } from 'crypto';

async function seedCafeProducts() {
    console.log('☕ Seeding Cafe Products...');

    // Ensure 'dan-am-thanh-cafe' category exists
    let category = await prisma.categories.findFirst({
        where: { slug: 'dan-am-thanh-cafe' }
    });

    if (!category) {
        console.log('Creating category: Dàn Âm Thanh Cafe');
        category = await prisma.categories.create({
            data: {
                id: randomUUID(),
                name: 'Dàn Âm Thanh Cafe',
                slug: 'dan-am-thanh-cafe',
                description: 'Các bộ dàn âm thanh chuyên dụng cho quán cafe, nhà hàng, sân vườn.',
                updatedAt: new Date(),
            }
        });
    }

    const products = [
        {
            name: 'Dàn Âm Thanh Bose SP008283',
            slug: 'dan-am-thanh-bose-sp008283',
            description: 'Bộ dàn cao cấp cho quán cafe sân vườn, khả năng chống chịu thời tiết khắc nghiệt. Âm thanh trung thực, phủ rộng. Thành phần: 02 Cặp Loa Bose 251 Environmental, 01 Amply Bose Music Amplifier.',
            priceCents: 3775000000n, // 37.750.000
            brand: 'Bose',
            model: 'SP008283',
            imageUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2024/04/dan-am-thanh-bose-sp008283.jpg',
        },
        {
            name: 'Dàn Âm Thanh Bose Cho Quán Cafe',
            slug: 'dan-am-thanh-bose-cho-quan-cafe',
            description: 'Giải pháp tiết kiệm với chất âm Bose huyền thoại. Phù hợp quán nhỏ nghe nhạc nhẹ. Thành phần: 03 Cặp Loa Bose 101, 01 Amply Boston Audio PA-1100 II.',
            priceCents: 1060000000n, // 10.600.000
            brand: 'Bose',
            model: 'Cafe Basic',
            imageUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2021/01/dan-am-thanh-bose-cho-quan-cafe.jpg',
        },
        {
            name: 'Dàn Âm Thanh Quán Cafe Không Gian Nhỏ',
            slug: 'dan-am-thanh-quan-cafe-khong-gian-nho',
            description: 'Phối ghép chuyên nghiệp cho không gian hiện đại, âm thanh mạnh mẽ nhưng không chói gắt. Thành phần: 03 Cặp Loa Bose 101, Vang CAVS G4, Cục đẩy FOX FX-40.',
            priceCents: 1600000000n, // 16.000.000
            brand: 'Thunder',
            model: 'Small Space',
            imageUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2021/01/dan-am-thanh-quan-cafe-khong-gian-nho.jpg',
        },
        {
            name: 'Dàn Âm Thanh Quán Cafe Không Gian Vừa 2026',
            slug: 'dan-am-thanh-quan-cafe-khong-gian-vua-2026',
            description: 'Hệ thống đa vùng JBL, cho phép điều chỉnh âm lượng riêng biệt các khu vực. Thành phần: 2 cặp JBL Control 24CT, 2 cặp JBL Control 23, Amply JBL VMA-160.',
            priceCents: 4640000000n, // 46.400.000
            brand: 'Thunder',
            model: 'Medium Space 2026',
            imageUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2021/01/dan-am-thanh-quan-cafe-khong-gian-vua.jpg',
        },
        {
            name: 'Dàn Âm Thanh Cafe Hay Nhất Hiện Nay 2026',
            slug: 'dan-am-thanh-cafe-hay-nhat-hien-nay-2026',
            description: 'Đỉnh cao âm thanh âm trần Yamaha, thiết kế sang trọng, chất âm hifi ấm áp. Thành phần: 3 cặp Yamaha VXC4, Amply Thunder MA-360.',
            priceCents: 6500000000n, // 65.000.000
            brand: 'Yamaha',
            model: 'Best Choice 2026',
            imageUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2021/01/dan-am-thanh-cafe-hay-nhat-hien-nay.jpg',
        },
        {
            name: 'Hệ Thống Âm Thanh Cafe Cao Cấp 2026',
            slug: 'he-thong-am-thanh-cafe-cao-cap-2026',
            description: 'Sự kết hợp hoàn hảo giữa loa âm trần và loa treo tường JBL. Thành phần: JBL 24CT Micro, JBL Control 1 Pro, Amply Thunder MA-360.',
            priceCents: 2941000000n, // 29.410.000
            brand: 'Thunder',
            model: 'Premium 2026',
            imageUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2021/01/he-thong-am-thanh-cafe-cao-cap.jpg',
        },
        {
            name: 'Dàn Âm Thanh Quán Cà Phê Sân Thượng 2026',
            slug: 'dan-am-thanh-quan-ca-phe-san-thuong-2026',
            description: 'Thiết kế chuyên dụng cho sân thượng, chống nắng mưa, điều khiển âm lượng từ xa. Thành phần: Loa Thunder CW15/5, Amply Thunder MA-360, Volume Control VL60.',
            priceCents: 2738000000n, // 27.380.000
            brand: 'Thunder',
            model: 'Rooftop 2026',
            imageUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2021/01/dan-am-thanh-quan-ca-phe-san-thuong.jpg',
        },
        {
            name: 'Dàn Âm Thanh Quán Cafe, Sân Vườn',
            slug: 'dan-am-thanh-quan-cafe-san-vuon',
            description: 'Thành phần: Loa JBL Control 1 Pro, Cục đẩy VOVA VN2650, Vang CAVS F6000.',
            priceCents: 1990000000n, // 19.900.000
            brand: 'Thunder',
            model: 'Garden',
            imageUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2021/01/dan-am-thanh-quan-cafe-san-vuon.jpg',
        },
        {
            name: 'Dàn âm thanh quán ăn, nhà hàng nhỏ',
            slug: 'dan-am-thanh-quan-an-nha-hang-nho',
            description: 'Thành phần: 4 cặp JBL Control 1 Pro, Cục đẩy Cavs M4850, Vang CAVS F6000.',
            priceCents: 3900000000n, // 39.000.000
            brand: 'FOX',
            model: 'Restaurant Small',
            imageUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2021/01/dan-am-thanh-quan-an-nha-hang-nho.jpg',
        },
        {
            name: 'Dàn âm thanh sân khấu Cafe Acoustic',
            slug: 'dan-am-thanh-san-khau-cafe-acoustic',
            description: 'Thành phần: E3 BR8.5, Sub E3 BR115, Micro E3 Q8900, Vang E3 S7, Đẩy E3 PA4.8, Soundcraft EPM 6.',
            priceCents: 9800000000n, // 98.000.000
            brand: 'E3',
            model: 'Acoustic Stage',
            imageUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2021/01/dan-am-thanh-san-khau-cafe-acoustic.jpg',
        },
        {
            name: 'Dàn âm thanh sân khấu E3 Acoustic',
            slug: 'dan-am-thanh-san-khau-e3-acoustic',
            description: 'Thành phần: Loa E3 MK12, Sub BR115, Micro Q8900, Vang S7, Đẩy PA4.8, Mixer Dynacord CMS 1000.',
            priceCents: 8900000000n, // 89.000.000
            brand: 'E3',
            model: 'E3 Acoustic',
            imageUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2021/01/dan-am-thanh-san-khau-e3-acoustic.jpg',
        },
        {
            name: 'Dàn Âm Thanh Acoustic Bose S1 Pro',
            slug: 'dan-am-thanh-acoustic-bose-s1-pro',
            description: 'Thành phần: 2 loa Bose S1 Pro, Sub Bose Sub2, Vang Vova V9Pro, Micro Sica MK290.',
            priceCents: 8895000000n, // 88.950.000
            brand: 'Bose',
            model: 'S1 Pro System',
            imageUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2021/01/dan-am-thanh-acoustic-bose-s1-pro.jpg',
        },
        {
            name: 'Dàn Âm Thanh Klipsch R-15PM Turntable',
            slug: 'dan-am-thanh-klipsch-r-15pm-turntable',
            description: 'Dành cho quán cafe phong cách retro, hoài cổ với chất âm đĩa than mộc mạc. Thành phần: Loa bookshelf Klipsch R-15PM, Đầu đĩa than Klipsch Primary.',
            priceCents: 1889000000n, // 18.890.000
            brand: 'Klipsch',
            model: 'R-15PM Turntable',
            imageUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2021/01/dan-am-thanh-klipsch-r-15pm-turntable.jpg',
        }
    ];

    for (const p of products) {
        const existing = await prisma.products.findUnique({
            where: { slug: p.slug }
        });

        if (existing) {
            console.log(`✓ Product "${p.name}" already exists`);
            // Update basic info
            await prisma.products.update({
                where: { id: existing.id },
                data: {
                    description: p.description,
                    priceCents: p.priceCents,
                    // imageUrl: p.imageUrl, // Uncomment if you want to force update images
                }
            });
        } else {
            await prisma.products.create({
                data: {
                    id: randomUUID(),
                    name: p.name,
                    slug: p.slug,
                    description: p.description,
                    priceCents: p.priceCents,
                    brand: p.brand,
                    model: p.model,
                    imageUrl: p.imageUrl,
                    isActive: true,
                    stockQuantity: 10,
                    categoryId: category.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });
            console.log(`✓ Created product: ${p.name}`);
        }
    }

    console.log('✅ Cafe Products seeding completed!');
}

seedCafeProducts()
    .catch((e) => {
        console.error('❌ Error seeding cafe products:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
