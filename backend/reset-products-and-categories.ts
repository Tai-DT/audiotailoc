import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetAndSeed() {
  console.log('🔁 Resetting products and categories...');

  // Delete products first (foreign key)
  await prisma.product.deleteMany({});
  // Then delete categories
  await prisma.category.deleteMany({});

  console.log('🗑️ Existing products and categories removed');

  const categories = [
    { name: 'Loa', slug: 'loa', isActive: true },
    { name: 'Tai nghe', slug: 'tai-nghe', isActive: true },
    { name: 'Dàn Karaoke', slug: 'dang-karaoke', isActive: true },
    { name: 'Đầu Karaoke', slug: 'dau-karaoke', isActive: true },
    { name: 'Loa & Loa Sub', slug: 'loa-loa-sub', isActive: true },
    { name: 'Micro Phone', slug: 'micro-phone', isActive: true },
    { name: 'Mixer / Vang Số', slug: 'mixer-vang-so', isActive: true },
    { name: 'Màn Hình Chọn Bài', slug: 'man-hinh-chon-bai', isActive: true },
    { name: 'Thanh Lý', slug: 'thanh-ly', isActive: true },
  ];

  // Create categories
  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  console.log(`📂 Created ${categories.length} categories`);

  // For each category create exactly 10 products
  for (const cat of categories) {
    const dbCat = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!dbCat) continue;

    for (let i = 1; i <= 10; i++) {
      const idx = String(i).padStart(2, '0');
      const slug = `${cat.slug}-product-${idx}`;
      const name = `${cat.name} Mẫu ${i}`;
      const description = `Sản phẩm mẫu ${i} cho danh mục ${cat.name}`;
      const priceCents = 1000000 * i; // simple pricing
      const imageUrl = '/images/products/placeholder.jpg';

      await prisma.product.create({
        data: {
          name,
          slug,
          description,
          priceCents,
          categoryId: dbCat.id,
          featured: false,
          imageUrl,
          metaTitle: `${name} - Audio Tài Lộc`,
          metaDescription: `${description}`,
          metaKeywords: `${cat.name}, ${name}`,
          canonicalUrl: `https://audiotailoc.com/products/${slug}`,
        },
      });
    }

    console.log(`✅ Seeded 10 products for category ${cat.slug}`);
  }

  console.log('🎉 Reset and seeding complete');
}

resetAndSeed()
  .catch((e) => {
    console.error('❌ Error during reset:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
