import { prisma } from './seed-client';
import { randomUUID } from 'crypto';

async function seedProducts() {
  console.log('📦 Seeding products...');

  const categories = await prisma.categories.findMany();
  if (categories.length === 0) {
    console.error('❌ No categories found. Please run seed-categories.ts first.');
    return;
  }

  const catMap = new Map(categories.map(c => [c.slug, c.id]));

  const products = [
    {
      name: 'Loa JBL Partybox 310',
      slug: 'loa-jbl-partybox-310',
      description: 'Loa Bluetooth di động với công suất 240W, âm thanh mạnh mẽ tích hợp đèn LED rực rỡ.',
      priceCents: 1299000000, // 12.990.000 VND (BigInt cents)
      originalPriceCents: 1450000000,
      brand: 'JBL',
      model: 'Partybox 310',
      sku: 'JBL-PB-310',
      stockQuantity: 15,
      featured: true,
      categoryId: catMap.get('loa-karaoke'),
      imageUrl: 'https://placehold.co/600x600/png?text=JBL+Partybox+310',
    },
    {
      name: 'Bose S1 Pro System',
      slug: 'bose-s1-pro-system',
      description: 'Hệ thống âm thanh di động tất cả trong một cho nghệ sĩ biểu diễn và karaoke gia đình.',
      priceCents: 1550000000,
      originalPriceCents: 1650000000,
      brand: 'Bose',
      model: 'S1 Pro',
      sku: 'BOSE-S1-PRO',
      stockQuantity: 20,
      featured: true,
      categoryId: catMap.get('loa-karaoke'),
      imageUrl: 'https://placehold.co/600x600/png?text=Bose+S1+Pro',
    },
    {
      name: 'Amply Karaoke Jarguar PA-203N',
      slug: 'amply-karaoke-jarguar-pa-203n',
      description: 'Amply karaoke huyền thoại với chất âm trong trẻo, tiếng vang mượt mà.',
      priceCents: 550000000,
      brand: 'Jarguar',
      model: 'PA-203N',
      sku: 'JAR-203N',
      stockQuantity: 50,
      featured: false,
      categoryId: catMap.get('amply-karaoke'),
      imageUrl: 'https://placehold.co/600x600/png?text=Jarguar+PA-203N',
    },
    {
      name: 'Micro Shure SM58',
      slug: 'micro-shure-sm58',
      description: 'Microphone có dây chuyên nghiệp cho giọng hát, độ bền cực cao.',
      priceCents: 250000000,
      brand: 'Shure',
      model: 'SM58',
      sku: 'SHURE-SM58',
      stockQuantity: 100,
      featured: true,
      categoryId: catMap.get('microphone'),
      imageUrl: 'https://placehold.co/600x600/png?text=Shure+SM58',
    },
    {
      name: 'Vang số JBL KX180A',
      slug: 'vang-so-jbl-kx180a',
      description: 'Thiết bị xử lý tín hiệu âm thanh kỹ thuật số chuyên dụng cho karaoke chuyên nghiệp.',
      priceCents: 850000000,
      brand: 'JBL',
      model: 'KX180A',
      sku: 'JBL-KX180A',
      stockQuantity: 10,
      featured: true,
      categoryId: catMap.get('vang-so-mixer'),
      imageUrl: 'https://placehold.co/600x600/png?text=JBL+KX180A',
    }
  ];

  for (const p of products) {
    const existing = await prisma.products.findUnique({
      where: { slug: p.slug }
    });

    if (existing) {
      console.log(`✓ Product "${p.name}" already exists`);
    } else {
      await prisma.products.create({
        data: {
          id: randomUUID(),
          ...p,
          isActive: true,
          priceCents: BigInt(p.priceCents),
          originalPriceCents: p.originalPriceCents ? BigInt(p.originalPriceCents) : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });
      console.log(`✓ Created product: ${p.name}`);
    }
  }

  console.log('✅ Products seeding completed!');
}

seedProducts()
  .catch((e) => {
    console.error('❌ Error seeding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
