/*
  Seed script to populate initial products for local development.
  Usage: pnpm --filter @audiotailoc/backend ts-node src/seed.ts
*/
import { PrismaClient } from '@prisma/client';

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

  const items = [
    {
      slug: 'loa-tai-loc-classic',
      name: 'Loa Tài Lộc Classic',
      description: 'Âm thanh ấm áp, thiết kế cổ điển.',
      priceCents: 1990000,
      imageUrl: 'https://placehold.co/600x400?text=Classic',
    },
    {
      slug: 'tai-nghe-tai-loc-pro',
      name: 'Tai nghe Tài Lộc Pro',
      description: 'Chống ồn chủ động, pin lâu.',
      priceCents: 2990000,
      imageUrl: 'https://placehold.co/600x400?text=Pro',
    },
    {
      slug: 'soundbar-tai-loc-5-1',
      name: 'Soundbar Tài Lộc 5.1',
      description: 'Rạp tại gia, âm trường rộng.',
      priceCents: 4990000,
      imageUrl: 'https://placehold.co/600x400?text=Soundbar',
    },
  ];

  for (const item of items) {
    // Upsert to keep idempotent
    // Note: sequential upserts to avoid DB write spikes
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
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
