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

  // Categories (expanded)
  const catLoa = await prisma.category.upsert({ where: { slug: 'loa' }, update: {}, create: { slug: 'loa', name: 'Loa & Loa Sub' } });
  const catDanKaraoke = await prisma.category.upsert({ where: { slug: 'dan-karaoke' }, update: {}, create: { slug: 'dan-karaoke', name: 'Dàn Karaoke' } });
  const catDauKaraoke = await prisma.category.upsert({ where: { slug: 'dau-karaoke' }, update: {}, create: { slug: 'dau-karaoke', name: 'Đầu Karaoke' } });
  const catMicro = await prisma.category.upsert({ where: { slug: 'micro' }, update: {}, create: { slug: 'micro', name: 'Micro Phone' } });
  const catMixer = await prisma.category.upsert({ where: { slug: 'mixer-vang-so' }, update: {}, create: { slug: 'mixer-vang-so', name: 'Mixer / Vang Số' } });
  const catManHinh = await prisma.category.upsert({ where: { slug: 'man-hinh' }, update: {}, create: { slug: 'man-hinh', name: 'Màn Hình Chọn Bài' } });
  const catThanhLy = await prisma.category.upsert({ where: { slug: 'thanh-ly' }, update: {}, create: { slug: 'thanh-ly', name: 'Thanh lý' } });

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
      type: 'PERCENT',
      value: 10,
      minAmount: 500000,
      startDate: now,
      endDate: nextYear,
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
      categoryId: catLoa.id,
    },
    {
      slug: 'tai-nghe-tai-loc-pro',
      name: 'Tai nghe Tài Lộc Pro',
      description: 'Chống ồn chủ động, pin lâu.',
      priceCents: 2990000,
      imageUrl: 'https://placehold.co/600x400?text=Pro',
      categoryId: catMicro.id,
    },
    {
      slug: 'soundbar-tai-loc-5-1',
      name: 'Soundbar Tài Lộc 5.1',
      description: 'Rạp tại gia, âm trường rộng.',
      priceCents: 4990000,
      imageUrl: 'https://placehold.co/600x400?text=Soundbar',
      categoryId: catLoa.id,
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

  // Services seed (Thanh lý, Lắp đặt, Cho thuê)
  await prisma.service.upsert({
    where: { slug: 'thanh-ly' },
    update: {},
    create: {
      slug: 'thanh-ly',
      name: 'Thanh lý thiết bị âm thanh',
      description: 'Thu mua và thanh lý thiết bị âm thanh đã qua sử dụng, kiểm định chất lượng.',
      category: 'LIQUIDATION' as any,
      type: 'OTHER' as any,
      basePriceCents: 0,
      price: 0,
      duration: 0,
      isActive: true,
    } as any,
  }).catch(() => undefined);
  await prisma.service.upsert({
    where: { slug: 'lap-dat' },
    update: {},
    create: {
      slug: 'lap-dat',
      name: 'Lắp đặt hệ thống âm thanh',
      description: 'Thiết kế và thi công hệ thống âm thanh chuyên nghiệp.',
      category: 'INSTALLATION' as any,
      type: 'PROFESSIONAL_SOUND' as any,
      basePriceCents: 2000000,
      price: 2000000,
      duration: 120,
      isActive: true,
    } as any,
  }).catch(() => undefined);
  await prisma.service.upsert({
    where: { slug: 'cho-thue' },
    update: {},
    create: {
      slug: 'cho-thue',
      name: 'Cho thuê thiết bị âm thanh',
      description: 'Cho thuê dàn âm thanh cho sự kiện, hội nghị, tiệc cưới.',
      category: 'RENTAL' as any,
      type: 'PROFESSIONAL_SOUND' as any,
      basePriceCents: 500000,
      price: 500000,
      duration: 24 * 60,
      isActive: true,
    } as any,
  }).catch(() => undefined);

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
