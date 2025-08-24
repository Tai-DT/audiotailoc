import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addKaraokeProducts() {
  console.log('🎤 Adding sample products for karaoke categories...');

  // Get all categories
  const categories = await prisma.category.findMany();
  console.log(`📋 Found ${categories.length} categories`);

  // Create products for each category
  const productsData = [
    // Dàn Karaoke products
    {
      categorySlug: 'dang-karaoke',
      name: 'Dàn Karaoke Gia Đình 5.1 Premium',
      slug: 'dan-karaoke-gia-dinh-5-1-premium',
      description: 'Dàn karaoke gia đình 5.1 kênh với âm thanh sống động, phù hợp cho gia đình và tiệc nhỏ. Bao gồm 50.000 bài hát Việt Nam, 3 micro chuyên nghiệp, màn hình cảm ứng 10 inch.',
      priceCents: 1899000000, // 18,990,000 VND
      images: [
        '/images/products/karaoke-5-1-family-1.jpg',
        '/images/products/karaoke-5-1-family-2.jpg',
        '/images/products/karaoke-5-1-family-3.jpg',
      ],
      featured: true,
      seoTitle: 'Dàn Karaoke Gia Đình 5.1 Premium - Audio Tài Lộc',
      seoDescription: 'Dàn karaoke gia đình 5.1 kênh với âm thanh sống động, phù hợp cho gia đình và tiệc nhỏ',
      features: [
        'Âm thanh 5.1 kênh sống động',
        '50.000 bài hát Việt Nam chất lượng cao',
        '3 micro chuyên nghiệp (2 không dây)',
        'Màn hình cảm ứng 10 inch HD',
        'Kết nối đa dạng: HDMI, USB, Bluetooth',
        'Điều khiển từ xa tiện lợi',
        'Chế độ karaoke và nghe nhạc',
        'Thiết kế sang trọng, phù hợp gia đình',
        'Bảo hành 24 tháng chính hãng',
      ],
    },
    // Đầu Karaoke products
    {
      categorySlug: 'dau-karaoke',
      name: 'Đầu Karaoke 100.000 Bài Hát HD',
      slug: 'dau-karaoke-100000-bai-hat-hd',
      description: 'Đầu karaoke với 100.000 bài hát Việt Nam và Quốc tế, màn hình cảm ứng 10.1 inch HD 1080p, bộ nhớ 128GB SSD tốc độ cao.',
      priceCents: 1299000000, // 12,990,000 VND
      images: [
        '/images/products/karaoke-player-100k-1.jpg',
        '/images/products/karaoke-player-100k-2.jpg',
        '/images/products/karaoke-player-100k-3.jpg',
      ],
      featured: true,
      seoTitle: 'Đầu Karaoke 100.000 Bài Hát HD - Audio Tài Lộc',
      seoDescription: 'Đầu karaoke với 100.000 bài hát chất lượng cao, giao diện cảm ứng thân thiện',
      features: [
        '100.000 bài hát Việt Nam và Quốc tế',
        'Màn hình cảm ứng 10.1 inch HD 1080p',
        'Kết nối đa dạng: HDMI, USB, Bluetooth, WiFi',
        'Giao diện tiếng Việt thân thiện',
        'Tìm kiếm bài hát thông minh (giọng hát, tên bài)',
        'Cập nhật bài hát qua USB/WiFi',
        'Hỗ trợ nhiều định dạng video 4K',
        'Điều khiển từ xa + voice control',
        'Bộ nhớ 128GB SSD tốc độ cao',
        'Bảo hành 24 tháng',
      ],
    },
    // Loa & Loa Sub products
    {
      categorySlug: 'loa-loa-sub',
      name: 'Bộ Loa Karaoke 500W + Subwoofer 300W',
      slug: 'bo-loa-karaoke-500w-subwoofer-300w',
      description: 'Bộ loa karaoke chuyên dụng với loa chính 500W RMS và loa subwoofer 300W, âm bass mạnh mẽ, tách âm chuyên nghiệp.',
      priceCents: 799000000, // 7,990,000 VND
      images: [
        '/images/products/karaoke-speakers-500w-1.jpg',
        '/images/products/karaoke-speakers-500w-2.jpg',
        '/images/products/karaoke-speakers-500w-3.jpg',
      ],
      featured: true,
      published: true,
      seoTitle: 'Bộ Loa Karaoke 500W + Subwoofer 300W - Audio Tài Lộc',
      seoDescription: 'Bộ loa karaoke chuyên dụng với loa chính 500W và loa subwoofer 300W, âm bass mạnh mẽ',
      features: [
        'Loa chính 500W RMS chất lượng cao',
        'Subwoofer 300W với âm bass mạnh mẽ',
        'Tách âm thanh karaoke chuyên nghiệp',
        'Chống nhiễu và phản hồi âm thanh',
        'Kết nối đa dạng: XLR, Jack 6.35mm',
        'Thiết kế chuyên dụng cho karaoke',
        'Chất liệu bền bỉ, chống va đập',
        'Dễ dàng lắp đặt và sử dụng',
        'Bảo hành 18 tháng',
        'Phù hợp quán karaoke, gia đình',
      ],
    },
    // Micro Phone products
    {
      categorySlug: 'micro-phone',
      name: 'Micro Karaoke Không Dây 2.4G Dual',
      slug: 'micro-karaoke-khong-day-2-4g-dual',
      description: 'Micro karaoke không dây 2.4G dual với tầm hoạt động 50m, pin 8 giờ, tích hợp hiệu ứng Echo, Reverb, Harmony.',
      priceCents: 399000000, // 3,990,000 VND
      images: [
        '/images/products/micro-wireless-2-4g-1.jpg',
        '/images/products/micro-wireless-2-4g-2.jpg',
        '/images/products/micro-wireless-2-4g-3.jpg',
      ],
      featured: true,
      published: true,
      seoTitle: 'Micro Karaoke Không Dây 2.4G Dual - Audio Tài Lộc',
      seoDescription: 'Micro karaoke không dây 2.4G dual với chất lượng thu âm cao, pin lâu, chống nhiễu tốt',
      features: [
        'Công nghệ không dây 2.4G Dual ổn định',
        'Tầm hoạt động 50m không chướng ngại',
        'Pin 8 giờ sử dụng liên tục',
        'Chất lượng thu âm cao 50Hz-18kHz',
        'Tích hợp hiệu ứng Echo, Reverb, Harmony',
        'Chống nhiễu DPLL tiên tiến',
        'Thiết kế ergonomic, cầm thoải mái',
        'Hiển thị LED thông tin pin',
        'Sạc USB tiện lợi',
        'Bảo hành 12 tháng',
      ],
    },
    // Mixer / Vang Số products
    {
      categorySlug: 'mixer-vang-so',
      name: 'Mixer Karaoke 8 Kênh + Vang Số Pro',
      slug: 'mixer-karaoke-8-kenh-vang-so-pro',
      description: 'Mixer karaoke 8 kênh chuyên nghiệp với vang số DSP 24-bit, 99 presets, nhiều hiệu ứng âm thanh.',
      priceCents: 599000000, // 5,990,000 VND
      images: [
        '/images/products/mixer-8ch-pro-1.jpg',
        '/images/products/mixer-8ch-pro-2.jpg',
        '/images/products/mixer-8ch-pro-3.jpg',
      ],
      featured: true,
      published: true,
      seoTitle: 'Mixer Karaoke 8 Kênh + Vang Số Pro - Audio Tài Lộc',
      seoDescription: 'Mixer karaoke 8 kênh chuyên nghiệp với vang số tích hợp, nhiều hiệu ứng âm thanh',
      features: [
        '8 kênh mixer chuyên nghiệp',
        'Vang số DSP 24-bit với 99 presets',
        'Nhiều hiệu ứng: Reverb, Echo, Delay, Chorus, Flanger',
        'EQ 3-band cho mỗi kênh',
        'Phantom power 48V cho micro condenser',
        'Kết nối đa dạng: XLR, Jack, RCA',
        'USB recording và playback',
        'Bluetooth input tiện lợi',
        'Màn hình LCD hiển thị thông số',
        'Bảo hành 18 tháng',
      ],
    },
    // Màn Hình Chọn Bài products
    {
      categorySlug: 'man-hinh-chon-bai',
      name: 'Màn Hình Cảm Ứng 15 Inch Chọn Bài Karaoke',
      slug: 'man-hinh-cam-ung-15-inch-chon-bai-karaoke',
      description: 'Màn hình cảm ứng 15 inch với công nghệ Infrared, độ phân giải cao 1024x768, chạy Android 9.0.',
      priceCents: 899000000, // 8,990,000 VND
      images: [
        '/images/products/touch-screen-15inch-1.jpg',
        '/images/products/touch-screen-15inch-2.jpg',
        '/images/products/touch-screen-15inch-3.jpg',
      ],
      featured: true,
      published: true,
      seoTitle: 'Màn Hình Cảm Ứng 15 Inch Chọn Bài Karaoke - Audio Tài Lộc',
      seoDescription: 'Màn hình cảm ứng 15 inch chuyên dụng cho việc chọn bài karaoke với giao diện thân thiện',
      features: [
        'Màn hình 15 inch độ phân giải cao',
        'Công nghệ cảm ứng Infrared chính xác',
        'Bề mặt Gorilla Glass 3 chống trầy xước',
        'Hệ điều hành Android 9.0 mượt mà',
        'Kết nối đa dạng: HDMI, VGA, USB',
        'Bộ nhớ 32GB + 2GB RAM',
        'Thiết kế chống nước IP65',
        'Mount VESA tiêu chuẩn',
        'Dễ dàng lắp đặt treo tường',
        'Bảo hành 24 tháng',
      ],
    },
  ];

  for (const productData of productsData) {
    const category = categories.find(c => c.slug === productData.categorySlug);

    if (category) {
      const product = await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {},
        create: {
          name: productData.name,
          slug: productData.slug,
          description: productData.description,

          priceCents: productData.priceCents,
          categoryId: category.id,
          images: productData.images,
          featured: productData.featured,
          metaTitle: productData.seoTitle,
          metaDescription: productData.seoDescription,
          features: JSON.stringify(productData.features),
        },
      });

      console.log(`✅ Created product: ${product.name} in category: ${category.name}`);
    } else {
      console.log(`❌ Category not found for slug: ${productData.categorySlug}`);
    }
  }

  console.log('🎉 Finished adding karaoke products!');
}

addKaraokeProducts()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
