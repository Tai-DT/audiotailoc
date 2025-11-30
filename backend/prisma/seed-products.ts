import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function seedProducts() {
    console.log('📦 Seeding products and categories...');

    // 1. Categories
    const categories = [
        {
            name: 'Loa Karaoke',
            slug: 'loa-karaoke',
            description: 'Các loại loa karaoke chất lượng cao',
        },
        {
            name: 'Amply',
            slug: 'amply',
            description: 'Amply công suất lớn',
        },
        {
            name: 'Micro',
            slug: 'micro',
            description: 'Micro không dây và có dây',
        },
        {
            name: 'Vang số',
            slug: 'vang-so',
            description: 'Vang số chỉnh âm chuyên nghiệp',
        },
    ];

    const createdCategories = [];

    for (const cat of categories) {
        const existing = await prisma.categories.findUnique({
            where: { slug: cat.slug },
        });

        if (existing) {
            console.log(`✓ Category already exists: ${cat.name}`);
            createdCategories.push(existing);
        } else {
            const created = await prisma.categories.create({
                data: {
                    id: randomUUID(),
                    ...cat,
                    isActive: true,
                    updatedAt: new Date(),
                },
            });
            console.log(`✓ Created category: ${cat.name}`);
            createdCategories.push(created);
        }
    }

    // 2. Products
    const products = [
        {
            name: 'Loa JBL Pasion 10',
            slug: 'loa-jbl-pasion-10',
            priceCents: 15000000,
            categoryId: createdCategories.find(c => c.slug === 'loa-karaoke')?.id,
            description: 'Loa karaoke JBL Pasion 10 chính hãng, âm thanh sống động.',
            imageUrl: 'https://example.com/jbl-pasion-10.jpg',
        },
        {
            name: 'Loa Bose 301 Series V',
            slug: 'loa-bose-301-series-v',
            priceCents: 8500000,
            categoryId: createdCategories.find(c => c.slug === 'loa-karaoke')?.id,
            description: 'Loa Bose huyền thoại cho karaoke gia đình.',
            imageUrl: 'https://example.com/bose-301.jpg',
        },
        {
            name: 'Amply Jarguar 506N',
            slug: 'amply-jarguar-506n',
            priceCents: 7200000,
            categoryId: createdCategories.find(c => c.slug === 'amply')?.id,
            description: 'Amply karaoke 4 kênh mạnh mẽ.',
            imageUrl: 'https://example.com/jarguar-506n.jpg',
        },
        {
            name: 'Micro Shure UGX 23',
            slug: 'micro-shure-ugx-23',
            priceCents: 2500000,
            categoryId: createdCategories.find(c => c.slug === 'micro')?.id,
            description: 'Micro không dây chống hú cực tốt.',
            imageUrl: 'https://example.com/shure-ugx-23.jpg',
        },
        {
            name: 'Vang số JBL KX180',
            slug: 'vang-so-jbl-kx180',
            priceCents: 9000000,
            categoryId: createdCategories.find(c => c.slug === 'vang-so')?.id,
            description: 'Vang số cao cấp của JBL.',
            imageUrl: 'https://example.com/jbl-kx180.jpg',
        },
    ];

    for (const prod of products) {
        if (!prod.categoryId) continue;

        const existing = await prisma.products.findUnique({
            where: { slug: prod.slug },
        });

        if (existing) {
            console.log(`✓ Product already exists: ${prod.name}`);
        } else {
            await prisma.products.create({
                data: {
                    id: randomUUID(),
                    name: prod.name,
                    slug: prod.slug,
                    priceCents: prod.priceCents,
                    categoryId: prod.categoryId,
                    description: prod.description,
                    imageUrl: prod.imageUrl,
                    isActive: true,
                    updatedAt: new Date(),
                },
            });
            console.log(`✓ Created product: ${prod.name}`);
        }
    }
}

seedProducts()
    .catch((e) => {
        console.error('❌ Error seeding products:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
