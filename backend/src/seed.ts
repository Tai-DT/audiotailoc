/*
  Seed script to populate initial products for local development.
  Usage: pnpm --filter @audiotailoc/backend ts-node src/seed.ts
*/
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  // Promote admin emails if configured
  const adminEnv = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (adminEnv.length > 0) {
    for (const email of adminEnv) {
      await prisma.user
        .update({ where: { email }, data: { role: 'ADMIN' } })
        .catch(() => Promise.resolve());
    }
  }

  // Categories
  const catSpeakers = await prisma.category.upsert({ where: { slug: 'loa' }, update: {}, create: { slug: 'loa', name: 'Loa' } });
  const catHeadphones = await prisma.category.upsert({ where: { slug: 'tai-nghe' }, update: {}, create: { slug: 'tai-nghe', name: 'Tai nghe' } });

  // Promotions
  const now = new Date();
  const nextYear = new Date(now.getTime());
  nextYear.setFullYear(now.getFullYear() + 1);
  await prisma.promotion.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      name: 'Welcome 10%',
      description: 'Giảm 10% cho khách hàng mới',
      type: 'PERCENTAGE',
      value: 10,
      expiresAt: nextYear,
      isActive: true,
    },
  });

  const items = [
    {
      slug: 'loa-tai-loc-classic',
      name: 'Loa Tài Lộc Classic',
      description: 'Âm thanh ấm áp, thiết kế cổ điển.',
      priceCents: 1990000,
      imageUrl: 'https://placehold.co/600x400?text=Classic',
      categoryId: catSpeakers.id,
    },
    {
      slug: 'tai-nghe-tai-loc-pro',
      name: 'Tai nghe Tài Lộc Pro',
      description: 'Chống ồn chủ động, pin lâu.',
      priceCents: 2990000,
      imageUrl: 'https://placehold.co/600x400?text=Pro',
      categoryId: catHeadphones.id,
    },
    {
      slug: 'soundbar-tai-loc-5-1',
      name: 'Soundbar Tài Lộc 5.1',
      description: 'Rạp tại gia, âm trường rộng.',
      priceCents: 4990000,
      imageUrl: 'https://placehold.co/600x400?text=Soundbar',
      categoryId: catSpeakers.id,
    },
  ];

  for (const item of items) {
    // Upsert to keep idempotent
    // Note: sequential upserts to avoid DB write spikes
    const p = await prisma.product.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
    // Seed KB entry for product if not exists
    const exists = await prisma.knowledgeBaseEntry.findFirst({ where: { productId: p.id, kind: 'PRODUCT' } });
    if (!exists) {
      await prisma.knowledgeBaseEntry.create({ data: { kind: 'PRODUCT', title: p.name, content: p.description || '', productId: p.id } });
    }
  }

  // Seed FAQ entries if none
  const faqCount = await prisma.knowledgeBaseEntry.count({ where: { kind: 'FAQ' } });
  if (faqCount === 0) {
    await prisma.knowledgeBaseEntry.createMany({
      data: [
        { kind: 'FAQ', title: 'Chính sách đổi trả', content: 'Đổi trả trong 7 ngày với sản phẩm còn nguyên vẹn.' },
        { kind: 'FAQ', title: 'Bảo hành', content: 'Bảo hành 12 tháng cho tất cả sản phẩm chính hãng.' },
      ],
    });
  }

  // Create sample notifications for admin emails if users exist
  if (adminEnv.length > 0) {
    const admins = await prisma.user.findMany({ where: { email: { in: adminEnv } }, select: { id: true, email: true } });
    for (const admin of admins) {
      const hasAny = await (prisma as any).notification.count({ where: { userId: admin.id } }).catch(() => 0);
      if (hasAny === 0) {
        await (prisma as any).notification.create({
          data: {
            userId: admin.id,
            type: 'SYSTEM',
            title: 'Chào mừng quản trị viên',
            message: 'Tài khoản của bạn đã được thiết lập. Đây là thông báo thử nghiệm.',
            data: JSON.stringify({ seeded: true }),
          }
        }).catch(() => undefined);
      }
    }
  }
}

main()
  .then(async () => {
    console.log('Seed completed');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
