import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function seedCampaigns() {
    console.log('📧 Seeding campaigns...');

    // Clear existing campaigns
    await prisma.campaign_clicks.deleteMany();
    await prisma.campaign_opens.deleteMany();
    await prisma.campaign_recipients.deleteMany();
    await prisma.email_logs.deleteMany();
    await prisma.campaigns.deleteMany();

    // Get admin user
    const admin = await prisma.users.findFirst({
        where: { email: 'admin@audiotailoc.com' }
    });

    if (!admin) {
        console.error('❌ Admin user not found');
        return;
    }

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const campaigns = [
        {
            id: randomUUID(),
            name: 'Khuyến mãi mùa hè sôi động',
            description: 'Campaign giới thiệu các sản phẩm âm thanh mùa hè',
            type: 'EMAIL' as const,
            status: 'SENT' as const,
            targetAudience: 'Tất cả khách hàng',
            subject: '🎉 Giảm giá sốc mùa hè - Tiết kiệm đến 50%',
            content: '<h1>Chào mừng mùa hè!</h1><p>Giảm giá đến 50% cho tất cả sản phẩm âm thanh.</p>',
            sentAt: lastWeek,
            createdBy: admin.id,
            createdAt: lastWeek,
            updatedAt: lastWeek,
        },
        {
            id: randomUUID(),
            name: 'Newsletter tháng 11',
            description: 'Bản tin sản phẩm và ưu đãi tháng 11',
            type: 'EMAIL' as const,
            status: 'SENT' as const,
            targetAudience: 'Newsletter subscribers',
            subject: '📰 Bản tin tháng 11 - Sản phẩm mới & Ưu đãi',
            content: '<h1>Tin tức tháng 11</h1><p>Khám phá sản phẩm mới và ưu đãi đặc biệt.</p>',
            sentAt: yesterday,
            createdBy: admin.id,
            createdAt: yesterday,
            updatedAt: yesterday,
        },
        {
            id: randomUUID(),
            name: 'Flash Sale cuối tuần',
            description: 'Chiến dịch flash sale cho cuối tuần này',
            type: 'EMAIL' as const,
            status: 'SCHEDULED' as const,
            targetAudience: 'Active customers',
            subject: '⚡ Flash Sale Cuối Tuần - Chỉ 48h!',
            content: '<h1>Flash Sale 48h!</h1><p>Giảm giá sốc trong 48 giờ cuối tuần.</p>',
            scheduledAt: nextWeek,
            createdBy: admin.id,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: 'SMS tri ân khách hàng',
            description: 'Tin nhắn cảm ơn khách hàng thân thiết',
            type: 'SMS' as const,
            status: 'DRAFT' as const,
            targetAudience: 'VIP customers',
            content: 'Cảm ơn quý khách đã đồng hành cùng Audio Tài Lộc!',
            createdBy: admin.id,
            createdAt: now,
            updatedAt: now,
        },
    ];

    for (const campaign of campaigns) {
        const created = await prisma.campaigns.create({
            data: campaign,
        });
        console.log(`✅ Created campaign: ${created.name}`);

        // Add recipients for sent campaigns
        if (created.status === 'SENT') {
            const customers = await prisma.users.findMany({
                where: { role: 'USER' },
                take: 20
            });

            for (const customer of customers) {
                await prisma.campaign_recipients.create({
                    data: {
                        id: randomUUID(),
                        campaignId: created.id,
                        email: customer.email,
                        name: customer.name,
                    },
                });

                // Simulate some opens and clicks
                if (Math.random() > 0.4) {
                    await prisma.campaign_opens.create({
                        data: {
                            id: randomUUID(),
                            campaignId: created.id,
                            recipientEmail: customer.email,
                        },
                    });
                }

                if (Math.random() > 0.7) {
                    await prisma.campaign_clicks.create({
                        data: {
                            id: randomUUID(),
                            campaignId: created.id,
                            recipientEmail: customer.email,
                            url: 'https://audiotailoc.com/products',
                        },
                    });
                }

                await prisma.email_logs.create({
                    data: {
                        id: randomUUID(),
                        campaignId: created.id,
                        recipientEmail: customer.email,
                        subject: created.subject || '',
                        status: 'SENT',
                        sentAt: created.sentAt,
                    },
                });
            }
            console.log(`   📨 Added ${customers.length} recipients with engagement data`);
        }
    }

    console.log(`\n✅ Successfully seeded ${campaigns.length} campaigns`);
}

seedCampaigns()
    .catch((e) => {
        console.error('❌ Error seeding campaigns:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
