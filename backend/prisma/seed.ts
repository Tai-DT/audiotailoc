import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

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

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'tai-nghe' },
      update: {},
      create: {
        name: 'Tai nghe',
        slug: 'tai-nghe',
        description: 'Tai nghe chất lượng cao cho mọi nhu cầu',
        image: '/images/categories/headphones.jpg',
        featured: true,
        seoTitle: 'Tai nghe chất lượng cao - Audio Tài Lộc',
        seoDescription: 'Khám phá bộ sưu tập tai nghe chất lượng cao với âm thanh tuyệt vời',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'loa' },
      update: {},
      create: {
        name: 'Loa',
        slug: 'loa',
        description: 'Loa bluetooth và loa có dây chất lượng',
        image: '/images/categories/speakers.jpg',
        featured: true,
        seoTitle: 'Loa bluetooth và loa có dây - Audio Tài Lộc',
        seoDescription: 'Tuyển chọn các dòng loa chất lượng với âm thanh sống động',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'micro' },
      update: {},
      create: {
        name: 'Micro',
        slug: 'micro',
        description: 'Micro thu âm chuyên nghiệp',
        image: '/images/categories/microphones.jpg',
        featured: true,
        seoTitle: 'Micro thu âm chuyên nghiệp - Audio Tài Lộc',
        seoDescription: 'Micro chất lượng cao cho thu âm, livestream và karaoke',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'phu-kien' },
      update: {},
      create: {
        name: 'Phụ kiện',
        slug: 'phu-kien',
        description: 'Phụ kiện âm thanh đa dạng',
        image: '/images/categories/accessories.jpg',
        featured: false,
        seoTitle: 'Phụ kiện âm thanh - Audio Tài Lộc',
        seoDescription: 'Phụ kiện âm thanh chất lượng cho thiết bị của bạn',
      },
    }),
  ]);

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
      where: { slug: 'sony-wh-1000xm4' },
      update: {},
      create: {
        name: 'Sony WH-1000XM4',
        slug: 'sony-wh-1000xm4',
        description: 'Tai nghe chống ồn hàng đầu với chất lượng âm thanh tuyệt vời',
        shortDescription: 'Tai nghe chống ồn Sony WH-1000XM4 với công nghệ AI',
        sku: 'SONY-WH1000XM4-001',
        priceCents: 799000000, // 7,990,000 VND
        originalPriceCents: 899000000, // 8,990,000 VND
        costCents: 600000000, // 6,000,000 VND
        categoryId: categories[0].id,
        brandId: brands[0].id,
        inStock: true,
        stockQuantity: 50,
        lowStockThreshold: 10,
        weight: 254,
        dimensions: '25.4 x 22.0 x 8.0 cm',
        images: [
          '/images/products/sony-wh-1000xm4-1.jpg',
          '/images/products/sony-wh-1000xm4-2.jpg',
          '/images/products/sony-wh-1000xm4-3.jpg',
        ],
        featured: true,
        published: true,
        seoTitle: 'Sony WH-1000XM4 - Tai nghe chống ồn tốt nhất',
        seoDescription: 'Tai nghe Sony WH-1000XM4 với công nghệ chống ồn AI, âm thanh Hi-Res và pin 30 giờ',
        specifications: {
          'Loại tai nghe': 'Over-ear, không dây',
          'Công nghệ chống ồn': 'Active Noise Cancelling với AI',
          'Driver': '40mm',
          'Tần số': '4Hz - 40kHz',
          'Thời lượng pin': '30 giờ (ANC bật), 38 giờ (ANC tắt)',
          'Kết nối': 'Bluetooth 5.0, NFC, Jack 3.5mm',
          'Codec hỗ trợ': 'SBC, AAC, LDAC',
          'Trọng lượng': '254g',
          'Màu sắc': 'Đen, Bạc',
        },
        features: [
          'Công nghệ chống ồn AI thích ứng',
          'Âm thanh Hi-Res Audio',
          'Pin 30 giờ sử dụng',
          'Sạc nhanh 10 phút cho 5 giờ nghe',
          'Điều khiển cảm ứng thông minh',
          'Hỗ trợ Google Assistant và Alexa',
        ],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'jbl-charge-5' },
      update: {},
      create: {
        name: 'JBL Charge 5',
        slug: 'jbl-charge-5',
        description: 'Loa bluetooth di động với âm bass mạnh mẽ và khả năng chống nước IP67',
        shortDescription: 'Loa bluetooth JBL Charge 5 chống nước, pin 20 giờ',
        sku: 'JBL-CHARGE5-001',
        priceCents: 399000000, // 3,990,000 VND
        originalPriceCents: 449000000, // 4,490,000 VND
        costCents: 300000000, // 3,000,000 VND
        categoryId: categories[1].id,
        brandId: brands[1].id,
        inStock: true,
        stockQuantity: 30,
        lowStockThreshold: 5,
        weight: 960,
        dimensions: '22.0 x 9.6 x 9.3 cm',
        images: [
          '/images/products/jbl-charge-5-1.jpg',
          '/images/products/jbl-charge-5-2.jpg',
          '/images/products/jbl-charge-5-3.jpg',
        ],
        featured: true,
        published: true,
        seoTitle: 'JBL Charge 5 - Loa bluetooth chống nước tốt nhất',
        seoDescription: 'Loa JBL Charge 5 với âm bass mạnh mẽ, chống nước IP67 và pin 20 giờ',
        specifications: {
          'Loại loa': 'Bluetooth di động',
          'Công suất': '30W RMS',
          'Driver': '1 x Woofer, 2 x Tweeter',
          'Tần số': '65Hz - 20kHz',
          'Thời lượng pin': '20 giờ',
          'Kết nối': 'Bluetooth 5.1, USB-C',
          'Chống nước': 'IP67',
          'Trọng lượng': '960g',
          'Màu sắc': 'Đen, Xanh, Đỏ, Xám',
        },
        features: [
          'Âm bass JBL Pro Sound mạnh mẽ',
          'Chống nước và bụi IP67',
          'Pin 20 giờ sử dụng liên tục',
          'Sạc cho thiết bị khác qua USB',
          'Kết nối nhiều loa JBL PartyBoost',
          'Thiết kế bền bỉ, di động',
        ],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'audio-technica-at2020' },
      update: {},
      create: {
        name: 'Audio-Technica AT2020',
        slug: 'audio-technica-at2020',
        description: 'Micro condenser chuyên nghiệp cho studio và livestream',
        shortDescription: 'Micro condenser Audio-Technica AT2020 chuyên nghiệp',
        sku: 'AT-AT2020-001',
        priceCents: 299000000, // 2,990,000 VND
        originalPriceCents: 329000000, // 3,290,000 VND
        costCents: 220000000, // 2,200,000 VND
        categoryId: categories[2].id,
        brandId: brands[2].id,
        inStock: true,
        stockQuantity: 20,
        lowStockThreshold: 5,
        weight: 345,
        dimensions: '16.2 x 5.2 x 5.2 cm',
        images: [
          '/images/products/audio-technica-at2020-1.jpg',
          '/images/products/audio-technica-at2020-2.jpg',
        ],
        featured: false,
        published: true,
        seoTitle: 'Audio-Technica AT2020 - Micro condenser chuyên nghiệp',
        seoDescription: 'Micro AT2020 với chất lượng studio, phù hợp cho thu âm và livestream chuyên nghiệp',
        specifications: {
          'Loại micro': 'Condenser',
          'Polar pattern': 'Cardioid',
          'Tần số': '20Hz - 20kHz',
          'Độ nhạy': '-37 dBV/Pa',
          'SPL tối đa': '144 dB',
          'Kết nối': 'XLR 3-pin',
          'Nguồn': 'Phantom power 48V',
          'Trọng lượng': '345g',
        },
        features: [
          'Chất lượng âm thanh studio',
          'Polar pattern cardioid chống nhiễu',
          'Tần số phản hồi rộng 20Hz-20kHz',
          'Thiết kế bền bỉ, chuyên nghiệp',
          'Phù hợp thu âm, livestream, podcast',
          'Tương thích với mọi audio interface',
        ],
      },
    }),
  ]);

  // Create product tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'Chống ồn' },
      update: {},
      create: { name: 'Chống ồn', slug: 'chong-on' },
    }),
    prisma.tag.upsert({
      where: { name: 'Bluetooth' },
      update: {},
      create: { name: 'Bluetooth', slug: 'bluetooth' },
    }),
    prisma.tag.upsert({
      where: { name: 'Chống nước' },
      update: {},
      create: { name: 'Chống nước', slug: 'chong-nuoc' },
    }),
    prisma.tag.upsert({
      where: { name: 'Chuyên nghiệp' },
      update: {},
      create: { name: 'Chuyên nghiệp', slug: 'chuyen-nghiep' },
    }),
    prisma.tag.upsert({
      where: { name: 'Hi-Res' },
      update: {},
      create: { name: 'Hi-Res', slug: 'hi-res' },
    }),
  ]);

  // Connect products with tags
  await Promise.all([
    prisma.product.update({
      where: { id: products[0].id },
      data: {
        tags: {
          connect: [
            { id: tags[0].id }, // Chống ồn
            { id: tags[1].id }, // Bluetooth
            { id: tags[4].id }, // Hi-Res
          ],
        },
      },
    }),
    prisma.product.update({
      where: { id: products[1].id },
      data: {
        tags: {
          connect: [
            { id: tags[1].id }, // Bluetooth
            { id: tags[2].id }, // Chống nước
          ],
        },
      },
    }),
    prisma.product.update({
      where: { id: products[2].id },
      data: {
        tags: {
          connect: [
            { id: tags[3].id }, // Chuyên nghiệp
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
        title: 'Tai nghe tuyệt vời!',
        content: 'Chất lượng âm thanh rất tốt, chống ồn hiệu quả. Rất hài lòng với sản phẩm.',
        verified: true,
        helpful: 15,
        notHelpful: 1,
      },
    }),
    prisma.review.create({
      data: {
        productId: products[1].id,
        userId: customer.id,
        rating: 4,
        title: 'Loa bass mạnh',
        content: 'Âm bass rất mạnh, chống nước tốt. Pin hơi yếu so với quảng cáo.',
        verified: true,
        helpful: 8,
        notHelpful: 2,
      },
    }),
  ]);

  // Create FAQ entries
  await Promise.all([
    prisma.fAQ.create({
      data: {
        question: 'Làm thế nào để đổi trả sản phẩm?',
        answer: 'Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên vẹn, chưa sử dụng và có đầy đủ hóa đơn.',
        category: 'Đổi trả',
        isPublished: true,
        order: 1,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Thời gian giao hàng là bao lâu?',
        answer: 'Thời gian giao hàng tùy thuộc vào khu vực: TP.HCM và Hà Nội trong ngày, các tỉnh khác 2-3 ngày làm việc.',
        category: 'Giao hàng',
        isPublished: true,
        order: 2,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Có hỗ trợ bảo hành không?',
        answer: 'Tất cả sản phẩm đều được bảo hành chính hãng. Thời gian bảo hành tùy theo từng sản phẩm, thường từ 12-24 tháng.',
        category: 'Bảo hành',
        isPublished: true,
        order: 3,
      },
    }),
  ]);

  console.log('✅ Database seeding completed successfully!');
  console.log(`👤 Admin user: admin@audiotailoc.com / Admin123!`);
  console.log(`👤 Test customer: customer@test.com / Customer123!`);
  console.log(`📦 Created ${products.length} products`);
  console.log(`🏷️ Created ${categories.length} categories`);
  console.log(`🏢 Created ${brands.length} brands`);
  console.log(`🎫 Created 2 coupons`);
  console.log(`🚚 Created 3 shipping methods`);
  console.log(`⭐ Created 2 sample reviews`);
  console.log(`❓ Created 3 FAQ entries`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
