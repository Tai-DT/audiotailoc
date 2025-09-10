import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAllData() {
  console.log('🌱 Seeding all sample data...');

  // 1. Create categories
  console.log('📂 Creating categories...');
  const categories = [
    // Product categories
    { name: 'Dàn Karaoke', slug: 'dang-karaoke', isActive: true },
    { name: 'Đầu Karaoke', slug: 'dau-karaoke', isActive: true },
    { name: 'Loa & Loa Sub', slug: 'loa-loa-sub', isActive: true },
    { name: 'Micro Phone', slug: 'micro-phone', isActive: true },
    { name: 'Mixer / Vang Số', slug: 'mixer-vang-so', isActive: true },
    { name: 'Màn Hình Chọn Bài', slug: 'man-hinh-chon-bai', isActive: true },
    { name: 'Thanh Lý', slug: 'thanh-ly', isActive: true },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('✅ Categories created');

  // 2. Create products
  console.log('📦 Creating products...');
  const products = [
    // Dàn Karaoke
    {
      name: 'Dàn Karaoke Gia Đình 5.1 Premium',
      slug: 'dan-karaoke-gia-dinh-5-1-premium',
      description: 'Dàn karaoke gia đình 5.1 kênh với âm thanh sống động, phù hợp cho gia đình và tiệc nhỏ.',
      priceCents: 18990000, // 18,990,000 VND
      categorySlug: 'dang-karaoke',
      featured: true,
      imageUrl: '/images/products/karaoke-5-1-family.jpg',
    },
    {
      name: 'Dàn Karaoke Chuyên Nghiệp 7.1',
      slug: 'dan-karaoke-chuyen-nghiep-7-1',
      description: 'Dàn karaoke chuyên nghiệp 7.1 kênh cho quán karaoke, hội trường.',
      priceCents: 29990000, // 29,990,000 VND
      categorySlug: 'dang-karaoke',
      featured: true,
      imageUrl: '/images/products/karaoke-7-1-pro.jpg',
    },

    // Đầu Karaoke
    {
      name: 'Đầu Karaoke 100.000 Bài Hát HD',
      slug: 'dau-karaoke-100000-bai-hat-hd',
      description: 'Đầu karaoke với 100.000 bài hát Việt Nam và Quốc tế.',
      priceCents: 12990000, // 12,990,000 VND
      categorySlug: 'dau-karaoke',
      featured: true,
      imageUrl: '/images/products/karaoke-player-100k.jpg',
    },
    {
      name: 'Đầu Karaoke 50.000 Bài Hát',
      slug: 'dau-karaoke-50000-bai-hat',
      description: 'Đầu karaoke với 50.000 bài hát chất lượng cao.',
      priceCents: 8990000, // 8,990,000 VND
      categorySlug: 'dau-karaoke',
      featured: false,
      imageUrl: '/images/products/karaoke-player-50k.jpg',
    },

    // Loa & Loa Sub
    {
      name: 'Bộ Loa Karaoke 500W + Subwoofer 300W',
      slug: 'bo-loa-karaoke-500w-subwoofer-300w',
      description: 'Bộ loa karaoke chuyên dụng với loa chính 500W và loa subwoofer 300W.',
      priceCents: 7990000, // 7,990,000 VND
      categorySlug: 'loa-loa-sub',
      featured: true,
      imageUrl: '/images/products/karaoke-speakers-500w.jpg',
    },
    {
      name: 'Loa Karaoke 300W',
      slug: 'loa-karaoke-300w',
      description: 'Loa karaoke 300W chất lượng cao.',
      priceCents: 4990000, // 4,990,000 VND
      categorySlug: 'loa-loa-sub',
      featured: false,
      imageUrl: '/images/products/karaoke-speakers-300w.jpg',
    },

    // Micro Phone
    {
      name: 'Micro Karaoke Không Dây 2.4G Dual',
      slug: 'micro-karaoke-khong-day-2-4g-dual',
      description: 'Micro karaoke không dây 2.4G dual với tầm hoạt động 50m.',
      priceCents: 3990000, // 3,990,000 VND
      categorySlug: 'micro-phone',
      featured: true,
      imageUrl: '/images/products/micro-wireless-2-4g.jpg',
    },
    {
      name: 'Micro Karaoke Có Dây',
      slug: 'micro-karaoke-co-day',
      description: 'Micro karaoke có dây chất lượng cao.',
      priceCents: 1990000, // 1,990,000 VND
      categorySlug: 'micro-phone',
      featured: false,
      imageUrl: '/images/products/micro-wired.jpg',
    },

    // Mixer / Vang Số
    {
      name: 'Mixer Karaoke 8 Kênh + Vang Số Pro',
      slug: 'mixer-karaoke-8-kenh-vang-so-pro',
      description: 'Mixer karaoke 8 kênh chuyên nghiệp với vang số DSP.',
      priceCents: 5990000, // 5,990,000 VND
      categorySlug: 'mixer-vang-so',
      featured: true,
      imageUrl: '/images/products/mixer-8ch-pro.jpg',
    },
    {
      name: 'Vang Số Karaoke 4 Kênh',
      slug: 'vang-so-karaoke-4-kenh',
      description: 'Vang số karaoke 4 kênh với nhiều hiệu ứng.',
      priceCents: 2990000, // 2,990,000 VND
      categorySlug: 'mixer-vang-so',
      featured: false,
      imageUrl: '/images/products/reverb-4ch.jpg',
    },

    // Màn Hình Chọn Bài
    {
      name: 'Màn Hình Cảm Ứng 15 Inch Chọn Bài Karaoke',
      slug: 'man-hinh-cam-ung-15-inch-chon-bai-karaoke',
      description: 'Màn hình cảm ứng 15 inch chuyên dụng cho việc chọn bài karaoke.',
      priceCents: 8990000, // 8,990,000 VND
      categorySlug: 'man-hinh-chon-bai',
      featured: true,
      imageUrl: '/images/products/touch-screen-15inch.jpg',
    },
    {
      name: 'Màn Hình Chọn Bài 10 Inch',
      slug: 'man-hinh-chon-bai-10-inch',
      description: 'Màn hình chọn bài 10 inch với giao diện thân thiện.',
      priceCents: 5990000, // 5,990,000 VND
      categorySlug: 'man-hinh-chon-bai',
      featured: false,
      imageUrl: '/images/products/touch-screen-10inch.jpg',
    },

    // Thanh Lý
    {
      name: 'Dàn Karaoke Thanh Lý - Còn Mới 90%',
      slug: 'dan-karaoke-thanh-ly-con-moi-90',
      description: 'Dàn karaoke thanh lý còn mới 90%, giá ưu đãi.',
      priceCents: 9990000, // 9,990,000 VND
      categorySlug: 'thanh-ly',
      featured: false,
      imageUrl: '/images/products/karaoke-liquidation-90.jpg',
    },
    {
      name: 'Đầu Karaoke Thanh Lý',
      slug: 'dau-karaoke-thanh-ly',
      description: 'Đầu karaoke thanh lý với nhiều bài hát.',
      priceCents: 4990000, // 4,990,000 VND
      categorySlug: 'thanh-ly',
      featured: false,
      imageUrl: '/images/products/player-liquidation.jpg',
    },
  ];

  for (const prod of products) {
    const category = await prisma.category.findUnique({ where: { slug: prod.categorySlug } });
    if (category) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {},
        create: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          priceCents: prod.priceCents,
          categoryId: category.id,
          featured: prod.featured,
          imageUrl: prod.imageUrl,
        },
      });
    }
  }
  console.log('✅ Products created');

  // 2.b Ensure each category has at least 10 products (generate synthetic samples)
  console.log('🧩 Ensuring each category has at least 10 products...');
  const targetPerCategory = 10;

  const allCategories = await prisma.category.findMany({});
  for (const cat of allCategories) {
    const existingCount = await prisma.product.count({ where: { categoryId: cat.id } });
    const toCreate = Math.max(0, targetPerCategory - existingCount);
    if (toCreate === 0) continue;

    let created = 0;
    let candidateIndex = 1;
    while (created < toCreate) {
      const slug = `${cat.slug}-seed-${candidateIndex}`;
      // ensure slug doesn't exist
      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) {
        candidateIndex++;
        continue;
      }

      await prisma.product.create({
        data: {
          name: `${cat.name} Mẫu ${candidateIndex}`,
          slug,
          description: `Sản phẩm mẫu cho danh mục ${cat.name}`,
          priceCents: 990000 + (candidateIndex * 100000),
          categoryId: cat.id,
          featured: false,
          imageUrl: '/images/products/placeholder.jpg',
        },
      });

      created++;
      candidateIndex++;
    }
  }
  console.log('✅ Category product counts normalized to at least 10');

  // 3. Create services
  console.log('🔧 Creating services...');
  const services = [
    {
      name: 'Dịch Vụ Thanh Lý Thiết Bị Âm Thanh',
      slug: 'dich-vu-thanh-ly-thiet-bi-am-thanh',
      description: 'Dịch vụ thanh lý thiết bị âm thanh cũ, đổi mới với giá tốt.',
      basePriceCents: 0, // Contact for pricing
      price: 0,
      duration: 60, // 1 hour
      isActive: true,
      images: '/images/services/liquidation.jpg',
    },
    {
      name: 'Dịch Vụ Lắp Đặt Hệ Thống Karaoke',
      slug: 'dich-vu-lap-dat-he-thong-karaoke',
      description: 'Lắp đặt chuyên nghiệp hệ thống karaoke gia đình và quán karaoke.',
      basePriceCents: 5000000, // 5,000,000 VND
      price: 5000000,
      duration: 240, // 4 hours
      isActive: true,
      images: '/images/services/installation.jpg',
    },
    {
      name: 'Dịch Vụ Cho Thuê Thiết Bị Karaoke',
      slug: 'dich-vu-cho-thue-thiet-bi-karaoke',
      description: 'Cho thuê thiết bị karaoke cho sự kiện, tiệc cưới, hội nghị.',
      basePriceCents: 10000000, // 10,000,000 VND per day
      price: 10000000,
      duration: 480, // 8 hours
      isActive: true,
      images: '/images/services/rental.jpg',
    },
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {},
      create: {
        name: svc.name,
        slug: svc.slug,
        description: svc.description,
        basePriceCents: svc.basePriceCents,
        price: svc.price,
        duration: svc.duration,
        isActive: svc.isActive,
        images: svc.images,
      },
    });
  }
  console.log('✅ Services created');

  // 4. Create pages for banner and about
  console.log('📄 Creating pages...');
  const pages = [
    {
      slug: 'banner',
      title: 'Banner Trang Chủ',
      content: `
        <div class="hero-banner">
          <h1>Chào Mừng Đến Với Audio Tài Lộc</h1>
          <p>Chuyên cung cấp thiết bị âm thanh karaoke chất lượng cao</p>
          <div class="banner-features">
            <div class="feature">
              <h3>🎤 Thiết Bị Chuyên Nghiệp</h3>
              <p>Dàn karaoke, đầu karaoke, loa sub chất lượng cao</p>
            </div>
            <div class="feature">
              <h3>🔧 Dịch Vụ Tận Tâm</h3>
              <p>Lắp đặt, bảo trì, cho thuê thiết bị âm thanh</p>
            </div>
            <div class="feature">
              <h3>💰 Giá Cả Hợp Lý</h3>
              <p>Cam kết giá tốt nhất thị trường</p>
            </div>
          </div>
        </div>
      `,
      isPublished: true,
    },
    {
      slug: 'about',
      title: 'Về Chúng Tôi',
      content: `
        <div class="about-section">
          <h1>Về Audio Tài Lộc</h1>
          <p>Audio Tài Lộc là đơn vị hàng đầu trong lĩnh vực cung cấp và phân phối thiết bị âm thanh karaoke tại Việt Nam.</p>

          <h2>Lịch Sử Phát Triển</h2>
          <p>Được thành lập từ năm 2010, Audio Tài Lộc đã có hơn 10 năm kinh nghiệm trong ngành âm thanh karaoke.</p>

          <h2>Sứ Mệnh</h2>
          <p>Mang đến cho khách hàng những sản phẩm chất lượng cao với giá cả hợp lý, dịch vụ chuyên nghiệp và tận tâm.</p>

          <h2>Tầm Nhìn</h2>
          <p>Trở thành nhà cung cấp thiết bị âm thanh karaoke số 1 Việt Nam, mở rộng kinh doanh ra khu vực Đông Nam Á.</p>

          <h2>Giá Trị Cốt Lõi</h2>
          <ul>
            <li>Chất lượng sản phẩm vượt trội</li>
            <li>Dịch vụ khách hàng chuyên nghiệp</li>
            <li>Giá cả cạnh tranh</li>
            <li>Bảo hành và hỗ trợ kỹ thuật tận tình</li>
          </ul>
        </div>
      `,
      isPublished: true,
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }
  console.log('✅ Pages created');

  console.log('🎉 All sample data seeded successfully!');
}

seedAllData()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
