import { prisma } from './seed-client';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

async function main() {
    console.log('🚀 Starting to seed real products...');

    // 1. Get categories map
    const categories = await prisma.categories.findMany();
    const categoryMap = new Map<string, string>();
    categories.forEach(c => {
        categoryMap.set(c.slug, c.id);
    });

    // 2. Load product mapping
    const mappingPath = path.resolve(process.cwd(), 'product-image-mapping.json');
    const mappingData = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

    // 3. Clear existing products
    console.log('🧹 Cleaning old products...');
    await prisma.cart_items.deleteMany({});
    await prisma.wishlist_items.deleteMany({});
    await prisma.order_items.deleteMany({});
    await prisma.product_reviews.deleteMany({});
    await prisma.product_views.deleteMany({});
    await prisma.inventory.deleteMany({});
    await prisma.products.deleteMany({});

    console.log('📝 Seeding products...');

    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    };

    const getCategoryByProductName = (name: string): string => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('sub')) return 'loa-sub';
        if (lowerName.includes('micro')) return 'microphone';
        if (lowerName.includes('vang số') || lowerName.includes('vang liền') || lowerName.includes('mixer')) return 'vang-so-mixer';
        if (lowerName.includes('cục đẩy') || lowerName.includes('amply')) return 'amply-cuc-day';
        if (lowerName.includes('đầu karaoke')) return 'dau-karaoke';
        if (lowerName.includes('màn hình')) return 'man-hinh-chon-bai';
        if (lowerName.includes('dàn') || lowerName.includes('combo')) return 'dan-karaoke';
        if (lowerName.includes('loa')) return 'loa-karaoke';
        return 'dan-karaoke'; // Default
    };

    const getRandomPrice = (name: string): bigint => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('dàn') || lowerName.includes('combo')) return BigInt(Math.floor(Math.random() * (150000000 - 30000000) + 30000000));
        if (lowerName.includes('phần mềm')) return BigInt(0);
        if (lowerName.includes('micro')) return BigInt(Math.floor(Math.random() * (8000000 - 2000000) + 2000000));
        if (lowerName.includes('vang')) return BigInt(Math.floor(Math.random() * (15000000 - 3000000) + 3000000));
        if (lowerName.includes('cục đẩy')) return BigInt(Math.floor(Math.random() * (25000000 - 8000000) + 8000000));
        if (lowerName.includes('sub')) return BigInt(Math.floor(Math.random() * (20000000 - 5000000) + 5000000));
        // Default speaker price
        return BigInt(Math.floor(Math.random() * (35000000 - 12000000) + 12000000));
    };

    for (const [name, imageUrl] of Object.entries(mappingData)) {
        const categorySlug = getCategoryByProductName(name);
        const categoryId = categoryMap.get(categorySlug);
        const priceCents = getRandomPrice(name);
        const originalPriceCents = priceCents + BigInt(Math.floor(Math.random() * 5000000 + 1000000));

        await prisma.products.create({
            data: {
                id: uuidv4(),
                name,
                slug: slugify(name),
                description: `Sản phẩm ${name} chính hãng cung cấp bởi Audio Tài Lộc. Chất liệu cao cấp, độ bền vượt trội và chất âm đẳng cấp chuyên nghiệp.`,
                shortDescription: `${name} - Đỉnh cao âm thanh chuyên nghiệp.`,
                priceCents,
                originalPriceCents,
                imageUrl: imageUrl as string,
                categoryId,
                brand: name.split(' ')[0], // Simple guess
                sku: 'ATL-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
                isActive: true,
                stockQuantity: 10 + Math.floor(Math.random() * 20),
                featured: Math.random() > 0.7,
                updatedAt: new Date(),
            }
        });
        console.log(`✅ Created product: ${name}`);
    }

    console.log('✅ PRODUCT SEEDING COMPLETED SUCCESSFULLY!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
