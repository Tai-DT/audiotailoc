import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function seedPromotions() {
    console.log('🎉 Seeding promotions...');

    // Clear existing promotions
    await prisma.customer_promotions.deleteMany();
    await prisma.promotions_products.deleteMany();
    await prisma.promotions_categories.deleteMany();
    await prisma.promotion_audit_logs.deleteMany();
    await prisma.promotion_analytics.deleteMany();
    await prisma.promotions.deleteMany();

    // Get some categories and products for linking
    const categories = await prisma.categories.findMany({ take: 3 });
    const products = await prisma.products.findMany({ take: 5 });

    // Get admin user
    const admin = await prisma.users.findFirst({
        where: { email: 'admin@audiotailoc.com' }
    });

    if (!admin) {
        console.error('❌ Admin user not found. Please create admin first.');
        return;
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const promotions = [
        // 1. Percentage discount - Active
        {
            id: randomUUID(),
            code: 'SUMMER2024',
            name: 'Giảm giá mùa hè 2024',
            description: 'Giảm 20% cho tất cả sản phẩm âm thanh',
            type: 'PERCENTAGE',
            value: 20,
            minOrderAmount: 1000000, // 1tr VND
            maxDiscount: 500000, // 500k VND
            isActive: true,
            startsAt: now,
            expiresAt: nextMonth,
            usageLimit: 100,
            usageCount: 15,
            createdBy: admin.id,
            createdAt: now,
            updatedAt: now,
            tierBased: false,
            isFirstPurchaseOnly: false,
            versionNumber: 1,
        },
        // 2. Fixed amount discount - Active  
        {
            id: randomUUID(),
            code: 'SAVE100K',
            name: 'Giảm 100K cho đơn từ 2 triệu',
            description: 'Giảm ngay 100.000đ cho đơn hàng từ 2 triệu đồng',
            type: 'FIXED_AMOUNT',
            value: 100000,
            minOrderAmount: 2000000,
            isActive: true,
            startsAt: now,
            expiresAt: nextMonth,
            usageLimit: 200,
            usageCount: 45,
            createdBy: admin.id,
            createdAt: now,
            updatedAt: now,
            tierBased: false,
            isFirstPurchaseOnly: false,
            versionNumber: 1,
        },
        // 3. Free shipping - Active
        {
            id: randomUUID(),
            code: 'FREESHIP',
            name: 'Miễn phí vận chuyển',
            description: 'Miễn phí vận chuyển cho đơn hàng từ 500k',
            type: 'FREE_SHIPPING',
            value: 0,
            minOrderAmount: 500000,
            isActive: true,
            startsAt: now,
            expiresAt: nextMonth,
            usageLimit: 500,
            usageCount: 120,
            createdBy: admin.id,
            createdAt: now,
            updatedAt: now,
            tierBased: false,
            isFirstPurchaseOnly: false,
            versionNumber: 1,
        },
        // 4. New customer discount - Active
        {
            id: randomUUID(),
            code: 'WELCOME15',
            name: 'Chào mừng khách hàng mới',
            description: 'Giảm 15% cho đơn hàng đầu tiên',
            type: 'PERCENTAGE',
            value: 15,
            minOrderAmount: 0,
            maxDiscount: 300000,
            isActive: true,
            startsAt: now,
            expiresAt: nextMonth,
            usageLimit: null,
            usageCount: 67,
            createdBy: admin.id,
            createdAt: now,
            updatedAt: now,
            tierBased: false,
            isFirstPurchaseOnly: true,
            customerSegment: 'NEW',
            versionNumber: 1,
        },
        // 5. VIP tier discount - Active
        {
            id: randomUUID(),
            code: 'VIP25',
            name: 'Ưu đãi khách hàng VIP',
            description: 'Giảm 25% dành riêng cho khách hàng VIP',
            type: 'PERCENTAGE',
            value: 25,
            minOrderAmount: 0,
            maxDiscount: 1000000,
            isActive: true,
            startsAt: now,
            expiresAt: nextMonth,
            usageLimit: null,
            usageCount: 23,
            createdBy: admin.id,
            createdAt: now,
            updatedAt: now,
            tierBased: true,
            isFirstPurchaseOnly: false,
            customerSegment: 'VIP',
            versionNumber: 1,
        },
        // 6. Flash sale - Scheduled (starts tomorrow)
        {
            id: randomUUID(),
            code: 'FLASH50',
            name: 'Flash Sale 50%',
            description: 'Giảm sốc 50% trong 24h',
            type: 'PERCENTAGE',
            value: 50,
            minOrderAmount: 0,
            maxDiscount: 2000000,
            isActive: true,
            startsAt: tomorrow,
            expiresAt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
            usageLimit: 50,
            usageCount: 0,
            createdBy: admin.id,
            createdAt: now,
            updatedAt: now,
            tierBased: false,
            isFirstPurchaseOnly: false,
            versionNumber: 1,
        },
        // 7. Inactive promotion
        {
            id: randomUUID(),
            code: 'EXPIRED2023',
            name: 'Khuyến mãi hết hạn',
            description: 'Khuyến mãi đã kết thúc',
            type: 'PERCENTAGE',
            value: 30,
            minOrderAmount: 1000000,
            isActive: false,
            startsAt: new Date('2023-12-01'),
            expiresAt: new Date('2023-12-31'),
            usageLimit: 100,
            usageCount: 95,
            createdBy: admin.id,
            createdAt: new Date('2023-12-01'),
            updatedAt: new Date('2023-12-01'),
            tierBased: false,
            isFirstPurchaseOnly: false,
            versionNumber: 1,
        },
    ];

    // Create promotions
    for (const promotion of promotions) {
        const created = await prisma.promotions.create({
            data: promotion,
        });
        console.log(`✅ Created promotion: ${created.name} (${created.code})`);

        // Link some promotions to categories
        if (categories.length > 0 && ['SUMMER2024', 'SAVE100K'].includes(created.code)) {
            for (const category of categories.slice(0, 2)) {
                await prisma.promotions_categories.create({
                    data: {
                        id: randomUUID(),
                        promotionId: created.id,
                        categoryId: category.id,
                    },
                });
            }
            console.log(`   📁 Linked to ${categories.slice(0, 2).length} categories`);
        }

        // Link some promotions to products
        if (products.length > 0 && ['VIP25', 'FLASH50'].includes(created.code)) {
            for (const product of products.slice(0, 3)) {
                await prisma.promotions_products.create({
                    data: {
                        id: randomUUID(),
                        promotionId: created.id,
                        productId: product.id,
                    },
                });
            }
            console.log(`   📦 Linked to ${products.slice(0, 3).length} products`);
        }

        // Create some analytics data for active promotions
        if (created.isActive && created.startsAt <= now) {
            for (let i = 0; i < 7; i++) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);

                await prisma.promotion_analytics.create({
                    data: {
                        id: randomUUID(),
                        promotionId: created.id,
                        date: date,
                        impressions: Math.floor(Math.random() * 1000) + 100,
                        clicks: Math.floor(Math.random() * 200) + 20,
                        conversions: Math.floor(Math.random() * 50) + 5,
                        revenueImpact: (Math.random() * 10000000 + 1000000).toFixed(2),
                        discountGiven: (Math.random() * 500000 + 50000).toFixed(2),
                        usageCount: Math.floor(Math.random() * 20) + 1,
                    },
                });
            }
            console.log(`   📊 Created 7 days of analytics data`);
        }

        // Create audit log for creation
        await prisma.promotion_audit_logs.create({
            data: {
                id: randomUUID(),
                promotionId: created.id,
                userId: admin.id,
                action: 'CREATED',
                newValues: promotion,
                reason: 'Initial seed data',
            },
        });
    }

    console.log(`\n✅ Successfully seeded ${promotions.length} promotions`);
    console.log('📊 With analytics data and audit logs');
}

seedPromotions()
    .catch((e) => {
        console.error('❌ Error seeding promotions:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
