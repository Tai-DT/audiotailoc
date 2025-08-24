import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');
  console.log('🎤 About to create karaoke categories...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@audiotailoc.com' },
    update: {},
    create: {
      email: 'admin@audiotailoc.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: true,
      phone: '+84123456789',
      phoneVerified: true,
    },
  });

  // Create test customer
  const customerPassword = await bcrypt.hash('Customer123!', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      password: customerPassword,
      name: 'Test Customer',
      role: 'CUSTOMER',
      emailVerified: true,
      phone: '+84987654321',
      phoneVerified: true,
    },
  });

  // Delete existing categories first
  console.log('🗑️ Deleting existing categories...');
  await prisma.category.deleteMany();

  // Create categories
  console.log('🎤 Creating karaoke categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Dàng Karaoke',
        slug: 'dang-karaoke',
        description: 'Dàn karaoke chuyên nghiệp với âm thanh sống động',
        image: '/images/categories/karaoke-system.jpg',
        featured: true,
        seoTitle: 'Dàn Karaoke chuyên nghiệp - Audio Tài Lộc',
        seoDescription: 'Dàn karaoke chất lượng cao với âm thanh sống động, phù hợp cho gia đình và kinh doanh',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Đầu Karaoke',
        slug: 'dau-karaoke',
        description: 'Đầu karaoke với nhiều bài hát phong phú',
        image: '/images/categories/karaoke-player.jpg',
        featured: true,
        seoTitle: 'Đầu Karaoke chất lượng cao - Audio Tài Lộc',
        seoDescription: 'Đầu karaoke với kho bài hát phong phú, giao diện thân thiện, dễ sử dụng',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Loa & Loa Sub',
        slug: 'loa-loa-sub',
        description: 'Loa và loa sub karaoke chuyên dụng',
        image: '/images/categories/speakers-subwoofers.jpg',
        featured: true,
        seoTitle: 'Loa và Loa Sub karaoke - Audio Tài Lộc',
        seoDescription: 'Loa karaoke và loa sub chuyên dụng với âm bass mạnh mẽ, âm thanh chất lượng',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Micro Phone',
        slug: 'micro-phone',
        description: 'Microphone karaoke chất lượng cao',
        image: '/images/categories/microphones-karaoke.jpg',
        featured: true,
        seoTitle: 'Micro karaoke chuyên nghiệp - Audio Tài Lộc',
        seoDescription: 'Micro karaoke với chất lượng thu âm tốt, thiết kế chuyên nghiệp',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mixer / Vang Số',
        slug: 'mixer-vang-so',
        description: 'Mixer và vang số karaoke chuyên nghiệp',
        image: '/images/categories/mixer-effects.jpg',
        featured: true,
        seoTitle: 'Mixer và Vang số karaoke - Audio Tài Lộc',
        seoDescription: 'Mixer và vang số chuyên nghiệp cho karaoke với nhiều hiệu ứng âm thanh',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Màn Hình Chọn Bài',
        slug: 'man-hinh-chon-bai',
        description: 'Màn hình cảm ứng chọn bài karaoke',
        image: '/images/categories/touch-screen.jpg',
        featured: true,
        seoTitle: 'Màn hình chọn bài karaoke - Audio Tài Lộc',
        seoDescription: 'Màn hình cảm ứng chọn bài karaoke với giao diện thân thiện, dễ sử dụng',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Thanh lý',
        slug: 'thanh-ly',
        description: 'Sản phẩm thanh lý với giá ưu đãi đặc biệt',
        image: '/images/categories/clearance-sale.jpg',
        featured: false,
        seoTitle: 'Thanh lý sản phẩm karaoke - Audio Tài Lộc',
        seoDescription: 'Sản phẩm thanh lý với giá ưu đãi đặc biệt, chất lượng đảm bảo',
      },
    }),
  ]);

  console.log('✅ Created categories:', categories.map(c => c.name));

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'sony' },
      update: {},
      create: {
        name: 'Sony',
        slug: 'sony',
        description: 'Thương hiệu âm thanh hàng đầu thế giới',
        logo: '/images/brands/sony.png',
        website: 'https://www.sony.com',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'jbl' },
      update: {},
      create: {
        name: 'JBL',
        slug: 'jbl',
        description: 'Chuyên gia về loa và tai nghe',
        logo: '/images/brands/jbl.png',
        website: 'https://www.jbl.com',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'audio-technica' },
      update: {},
      create: {
        name: 'Audio-Technica',
        slug: 'audio-technica',
        description: 'Thiết bị âm thanh chuyên nghiệp',
        logo: '/images/brands/audio-technica.png',
        website: 'https://www.audio-technica.com',
      },
    }),
  ]);

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'dan-karaoke-professional-5-1' },
      update: {},
      create: {
        name: 'Dàn Karaoke Professional 5.1',
        slug: 'dan-karaoke-professional-5-1',
        description: 'Dàn karaoke chuyên nghiệp 5.1 kênh với âm thanh sống động, phù hợp cho gia đình và kinh doanh',
        shortDescription: 'Dàn karaoke 5.1 kênh chuyên nghiệp với âm bass mạnh mẽ',
        sku: 'KARA-5-1-PRO-001',
        priceCents: 1599000000, // 15,990,000 VND
        originalPriceCents: 1799000000, // 17,990,000 VND
        costCents: 1200000000, // 12,000,000 VND
        categoryId: categories[0].id, // Dàn Karaoke
        brandId: brands[0].id,
        inStock: true,
        stockQuantity: 10,
        lowStockThreshold: 3,
        weight: 25000,
        dimensions: '80 x 40 x 30 cm',
        images: [
          '/images/products/karaoke-5-1-1.jpg',
          '/images/products/karaoke-5-1-2.jpg',
          '/images/products/karaoke-5-1-3.jpg',
        ],
        featured: true,
        published: true,
        seoTitle: 'Dàn Karaoke 5.1 Chuyên nghiệp - Audio Tài Lộc',
        seoDescription: 'Dàn karaoke 5.1 kênh chuyên nghiệp với âm thanh sống động, phù hợp cho gia đình và kinh doanh',
        specifications: {
          'Số kênh': '5.1 kênh',
          'Công suất tổng': '1000W RMS',
          'Loa chính': '2 x 200W (Trái/Phải)',
          'Loa center': '1 x 150W',
          'Loa surround': '2 x 150W',
          'Loa subwoofer': '1 x 350W (10 inch)',
          'Đầu karaoke': 'Tích hợp với 30.000 bài hát',
          'Microphone': '2 micro không dây',
          'Kết nối': 'HDMI, USB, Bluetooth, AUX',
          'Màn hình': '7 inch cảm ứng',
          'Trọng lượng': '25kg',
        },
        features: [
          'Âm thanh 5.1 kênh sống động',
          '30.000 bài hát Việt Nam chất lượng cao',
          '2 micro không dây chuyên nghiệp',
          'Màn hình cảm ứng 7 inch',
          'Kết nối đa dạng: HDMI, USB, Bluetooth',
          'Điều khiển từ xa tiện lợi',
          'Chế độ karaoke và nghe nhạc',
          'Thiết kế sang trọng, bền bỉ',
        ],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'dau-karaoke-premium-50000-bai' },
      update: {},
      create: {
        name: 'Đầu Karaoke Premium 50.000 Bài',
        slug: 'dau-karaoke-premium-50000-bai',
        description: 'Đầu karaoke với 50.000 bài hát Việt Nam chất lượng cao, giao diện thân thiện',
        shortDescription: 'Đầu karaoke với 50.000 bài hát và giao diện cảm ứng',
        sku: 'KARA-PLAYER-50000-001',
        priceCents: 799000000, // 7,990,000 VND
        originalPriceCents: 999000000, // 9,990,000 VND
        costCents: 600000000, // 6,000,000 VND
        categoryId: categories[1].id, // Đầu Karaoke
        brandId: brands[1].id,
        inStock: true,
        stockQuantity: 15,
        lowStockThreshold: 3,
        weight: 3500,
        dimensions: '43 x 28 x 10 cm',
        images: [
          '/images/products/karaoke-player-1.jpg',
          '/images/products/karaoke-player-2.jpg',
          '/images/products/karaoke-player-3.jpg',
        ],
        featured: true,
        published: true,
        seoTitle: 'Đầu Karaoke 50.000 Bài - Audio Tài Lộc',
        seoDescription: 'Đầu karaoke với 50.000 bài hát Việt Nam chất lượng cao, giao diện cảm ứng thân thiện',
        specifications: {
          'Số lượng bài hát': '50.000 bài Việt Nam',
          'Màn hình': '7 inch cảm ứng HD',
          'Kết nối': 'HDMI, USB, Bluetooth 5.0, WiFi',
          'Định dạng hỗ trợ': 'MP3, MP4, AVI, MKV',
          'Điều khiển': 'Remote + cảm ứng',
          'Ngôn ngữ': 'Tiếng Việt',
          'Cập nhật': 'USB/WiFi',
          'Trọng lượng': '3.5kg',
        },
        features: [
          '50.000 bài hát Việt Nam chất lượng cao',
          'Màn hình cảm ứng 7 inch HD',
          'Kết nối đa dạng: HDMI, USB, Bluetooth, WiFi',
          'Giao diện tiếng Việt thân thiện',
          'Tìm kiếm bài hát nhanh chóng',
          'Cập nhật bài hát qua USB/WiFi',
          'Hỗ trợ nhiều định dạng video',
          'Điều khiển từ xa tiện lợi',
        ],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'loa-karaoke-400w-subwoofer' },
      update: {},
      create: {
        name: 'Loa Karaoke 400W + Subwoofer',
        slug: 'loa-karaoke-400w-subwoofer',
        description: 'Bộ loa karaoke chuyên dụng với loa chính 400W và loa subwoofer 200W, âm bass mạnh mẽ',
        shortDescription: 'Bộ loa karaoke 400W + subwoofer với âm bass mạnh mẽ',
        sku: 'KARA-SPEAKER-400W-001',
        priceCents: 599000000, // 5,990,000 VND
        originalPriceCents: 699000000, // 6,990,000 VND
        costCents: 450000000, // 4,500,000 VND
        categoryId: categories[2].id, // Loa & Loa Sub
        brandId: brands[2].id,
        inStock: true,
        stockQuantity: 25,
        lowStockThreshold: 5,
        weight: 8500,
        dimensions: 'Loa chính: 35x25x20cm, Subwoofer: 40x30x30cm',
        images: [
          '/images/products/karaoke-speakers-1.jpg',
          '/images/products/karaoke-speakers-2.jpg',
          '/images/products/karaoke-speakers-3.jpg',
        ],
        featured: true,
        published: true,
        seoTitle: 'Loa Karaoke 400W + Subwoofer - Audio Tài Lộc',
        seoDescription: 'Bộ loa karaoke chuyên dụng với loa chính 400W và loa subwoofer 200W, âm bass mạnh mẽ',
        specifications: {
          'Loa chính': '400W RMS, 2 kênh (Trái/Phải)',
          'Subwoofer': '200W RMS, 10 inch',
          'Tần số loa chính': '60Hz - 20kHz',
          'Tần số subwoofer': '30Hz - 200Hz',
          'Driver loa chính': '8 inch + tweeter',
          'Driver subwoofer': '10 inch',
          'Kết nối': 'Jack 6.35mm, XLR',
          'Chống nhiễu': 'Có',
          'Chống phản hồi': 'Có',
          'Trọng lượng': '8.5kg (tổng)',
        },
        features: [
          'Loa chính 400W RMS chất lượng cao',
          'Subwoofer 200W với âm bass mạnh mẽ',
          'Tách âm thanh karaoke chuyên nghiệp',
          'Chống nhiễu và phản hồi âm thanh',
          'Kết nối đa dạng: Jack, XLR',
          'Thiết kế chuyên dụng cho karaoke',
          'Chất liệu bền bỉ, chống va đập',
          'Dễ dàng lắp đặt và sử dụng',
        ],
      },
    }),
  ]);

  // Create product tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'Karaoke' },
      update: {},
      create: { name: 'Karaoke', slug: 'karaoke' },
    }),
    prisma.tag.upsert({
      where: { name: 'Chuyên nghiệp' },
      update: {},
      create: { name: 'Chuyên nghiệp', slug: 'chuyen-nghiep' },
    }),
    prisma.tag.upsert({
      where: { name: 'Gia đình' },
      update: {},
      create: { name: 'Gia đình', slug: 'gia-dinh' },
    }),
    prisma.tag.upsert({
      where: { name: 'Kinh doanh' },
      update: {},
      create: { name: 'Kinh doanh', slug: 'kinh-doanh' },
    }),
    prisma.tag.upsert({
      where: { name: 'Âm bass mạnh' },
      update: {},
      create: { name: 'Âm bass mạnh', slug: 'am-bass-manh' },
    }),
    prisma.tag.upsert({
      where: { name: 'Nhiều bài hát' },
      update: {},
      create: { name: 'Nhiều bài hát', slug: 'nhieu-bai-hat' },
    }),
    prisma.tag.upsert({
      where: { name: 'Cảm ứng' },
      update: {},
      create: { name: 'Cảm ứng', slug: 'cam-ung' },
    }),
    prisma.tag.upsert({
      where: { name: 'Bluetooth' },
      update: {},
      create: { name: 'Bluetooth', slug: 'bluetooth' },
    }),
  ]);

  // Connect products with tags
  await Promise.all([
    // Dàn Karaoke Professional 5.1
    prisma.product.update({
      where: { id: products[0].id },
      data: {
        tags: {
          connect: [
            { id: tags[0].id }, // Karaoke
            { id: tags[1].id }, // Chuyên nghiệp
            { id: tags[2].id }, // Gia đình
            { id: tags[3].id }, // Kinh doanh
            { id: tags[4].id }, // Âm bass mạnh
            { id: tags[5].id }, // Nhiều bài hát
            { id: tags[6].id }, // Cảm ứng
          ],
        },
      },
    }),
    // Đầu Karaoke Premium 50.000 Bài
    prisma.product.update({
      where: { id: products[1].id },
      data: {
        tags: {
          connect: [
            { id: tags[0].id }, // Karaoke
            { id: tags[5].id }, // Nhiều bài hát
            { id: tags[6].id }, // Cảm ứng
            { id: tags[7].id }, // Bluetooth
            { id: tags[1].id }, // Chuyên nghiệp
          ],
        },
      },
    }),
    // Loa Karaoke 400W + Subwoofer
    prisma.product.update({
      where: { id: products[2].id },
      data: {
        tags: {
          connect: [
            { id: tags[0].id }, // Karaoke
            { id: tags[1].id }, // Chuyên nghiệp
            { id: tags[4].id }, // Âm bass mạnh
          ],
        },
      },
    }),
  ]);

  // Create shipping zones
  const shippingZones = await Promise.all([
    prisma.shippingZone.upsert({
      where: { name: 'Hồ Chí Minh' },
      update: {},
      create: {
        name: 'Hồ Chí Minh',
        description: 'Khu vực Thành phố Hồ Chí Minh',
        countries: ['VN'],
        states: ['Hồ Chí Minh'],
        postalCodes: ['7*'],
      },
    }),
    prisma.shippingZone.upsert({
      where: { name: 'Hà Nội' },
      update: {},
      create: {
        name: 'Hà Nội',
        description: 'Khu vực Thủ đô Hà Nội',
        countries: ['VN'],
        states: ['Hà Nội'],
        postalCodes: ['1*'],
      },
    }),
    prisma.shippingZone.upsert({
      where: { name: 'Toàn quốc' },
      update: {},
      create: {
        name: 'Toàn quốc',
        description: 'Các tỉnh thành khác',
        countries: ['VN'],
        states: [],
        postalCodes: [],
      },
    }),
  ]);

  // Create shipping methods
  await Promise.all([
    prisma.shippingMethod.upsert({
      where: { name: 'Giao hàng nhanh HCM' },
      update: {},
      create: {
        name: 'Giao hàng nhanh HCM',
        description: 'Giao hàng trong ngày tại TP.HCM',
        carrier: 'Giao Hàng Nhanh',
        estimatedDays: 1,
        costCents: 3000000, // 30,000 VND
        freeShippingThreshold: 50000000, // 500,000 VND
        zoneId: shippingZones[0].id,
        isActive: true,
      },
    }),
    prisma.shippingMethod.upsert({
      where: { name: 'Giao hàng nhanh HN' },
      update: {},
      create: {
        name: 'Giao hàng nhanh HN',
        description: 'Giao hàng trong ngày tại Hà Nội',
        carrier: 'Giao Hàng Nhanh',
        estimatedDays: 1,
        costCents: 3000000, // 30,000 VND
        freeShippingThreshold: 50000000, // 500,000 VND
        zoneId: shippingZones[1].id,
        isActive: true,
      },
    }),
    prisma.shippingMethod.upsert({
      where: { name: 'Giao hàng tiêu chuẩn' },
      update: {},
      create: {
        name: 'Giao hàng tiêu chuẩn',
        description: 'Giao hàng toàn quốc 2-3 ngày',
        carrier: 'Giao Hàng Tiết Kiệm',
        estimatedDays: 3,
        costCents: 5000000, // 50,000 VND
        freeShippingThreshold: 100000000, // 1,000,000 VND
        zoneId: shippingZones[2].id,
        isActive: true,
      },
    }),
  ]);

  // Create coupons
  await Promise.all([
    prisma.coupon.upsert({
      where: { code: 'WELCOME10' },
      update: {},
      create: {
        code: 'WELCOME10',
        name: 'Chào mừng khách hàng mới',
        description: 'Giảm 10% cho đơn hàng đầu tiên',
        type: 'PERCENTAGE',
        value: 10,
        minimumAmount: 50000000, // 500,000 VND
        maximumDiscount: 20000000, // 200,000 VND
        usageLimit: 1000,
        usageCount: 0,
        isActive: true,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'FREESHIP' },
      update: {},
      create: {
        code: 'FREESHIP',
        name: 'Miễn phí vận chuyển',
        description: 'Miễn phí vận chuyển cho đơn hàng từ 1 triệu',
        type: 'FREE_SHIPPING',
        value: 0,
        minimumAmount: 100000000, // 1,000,000 VND
        usageLimit: 500,
        usageCount: 0,
        isActive: true,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
    }),
  ]);

  // Create sample reviews
  await Promise.all([
    prisma.review.create({
      data: {
        productId: products[0].id,
        userId: customer.id,
        rating: 5,
        title: 'Dàn karaoke tuyệt vời cho gia đình!',
        content: 'Âm thanh rất sống động, nhiều bài hát hay. Con cái rất thích hát karaoke với dàn này. Giao hàng nhanh và hỗ trợ tận tình.',
        verified: true,
        helpful: 25,
        notHelpful: 2,
      },
    }),
    prisma.review.create({
      data: {
        productId: products[1].id,
        userId: customer.id,
        rating: 4,
        title: 'Đầu karaoke nhiều bài hát',
        content: '50.000 bài hát đủ để hát trong nhiều năm. Giao diện dễ sử dụng, cập nhật bài hát qua USB rất tiện.',
        verified: true,
        helpful: 18,
        notHelpful: 1,
      },
    }),
    prisma.review.create({
      data: {
        productId: products[2].id,
        userId: customer.id,
        rating: 5,
        title: 'Loa karaoke chuyên nghiệp',
        content: 'Âm bass mạnh mẽ, âm thanh rõ ràng. Chống nhiễu tốt khi hát karaoke. Giá cả hợp lý so với chất lượng.',
        verified: true,
        helpful: 12,
        notHelpful: 0,
      },
    }),
  ]);

  // Create FAQ entries
  await Promise.all([
    prisma.fAQ.create({
      data: {
        question: 'Làm thế nào để đổi trả sản phẩm?',
        answer: 'Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên vẹn, chưa sử dụng và có đầy đủ hóa đơn. Riêng dàn karaoke cần kiểm tra kỹ trước khi đổi trả.',
        category: 'Đổi trả',
        isPublished: true,
        order: 1,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Thời gian giao hàng là bao lâu?',
        answer: 'Thời gian giao hàng tùy thuộc vào khu vực: TP.HCM và Hà Nội trong 24h, các tỉnh khác 2-3 ngày làm việc. Dàn karaoke cồng kềnh có thể cần thêm thời gian vận chuyển.',
        category: 'Giao hàng',
        isPublished: true,
        order: 2,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Có hỗ trợ bảo hành không?',
        answer: 'Tất cả sản phẩm đều được bảo hành chính hãng. Thời gian bảo hành tùy theo từng sản phẩm: dàn karaoke 12-24 tháng, đầu karaoke 12 tháng, loa 6-12 tháng.',
        category: 'Bảo hành',
        isPublished: true,
        order: 3,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Làm thế nào để cập nhật bài hát mới?',
        answer: 'Bạn có thể cập nhật bài hát qua USB hoặc WiFi (nếu có). Audio Tài Lộc cung cấp dịch vụ cập nhật bài hát định kỳ với chi phí hợp lý.',
        category: 'Karaoke',
        isPublished: true,
        order: 4,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Có hỗ trợ lắp đặt dàn karaoke không?',
        answer: 'Có, Audio Tài Lộc cung cấp dịch vụ lắp đặt và hướng dẫn sử dụng dàn karaoke tận nơi với chi phí hợp lý.',
        category: 'Dịch vụ',
        isPublished: true,
        order: 5,
      },
    }),
  ]);

  console.log('✅ Database seeding completed successfully!');
  console.log(`👤 Admin user: admin@audiotailoc.com / Admin123!`);
  console.log(`👤 Test customer: customer@test.com / Customer123!`);
  console.log(`📦 Created ${products.length} karaoke products`);
  console.log(`🎤 Created ${categories.length} karaoke categories:`);
  console.log(`   - Dàn Karaoke`);
  console.log(`   - Đầu Karaoke`);
  console.log(`   - Loa & Loa Sub`);
  console.log(`   - Micro Phone`);
  console.log(`   - Mixer / Vang Số`);
  console.log(`   - Màn Hình Chọn Bài`);
  console.log(`   - Thanh lý`);
  console.log(`🏢 Created ${brands.length} brands`);
  console.log(`🏷️ Created ${tags.length} product tags`);
  console.log(`🎫 Created 2 coupons`);
  console.log(`🚚 Created 3 shipping methods`);
  console.log(`⭐ Created 3 sample reviews`);
  console.log(`❓ Created 5 FAQ entries`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
