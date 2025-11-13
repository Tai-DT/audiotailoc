#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Helper function to generate slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seedComprehensiveData() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║    🌱 Audio Tài Lộc - Comprehensive Data Seeding 🌱     ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // 1. SEED USERS
    console.log('👥 Seeding Users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        email: 'admin@audiotailoc.vn',
        password: hashedPassword,
        name: 'Admin Audio Tài Lộc',
        phone: '0901234567',
        role: 'ADMIN',
      },
      {
        email: 'manager@audiotailoc.vn',
        password: hashedPassword,
        name: 'Quản Lý Hệ Thống',
        phone: '0901234568',
        role: 'MANAGER',
      },
      {
        email: 'customer1@gmail.com',
        password: hashedPassword,
        name: 'Nguyễn Văn A',
        phone: '0901234569',
        role: 'USER',
      },
      {
        email: 'customer2@gmail.com',
        password: hashedPassword,
        name: 'Trần Thị B',
        phone: '0901234570',
        role: 'USER',
      },
      {
        email: 'customer3@gmail.com',
        password: hashedPassword,
        name: 'Lê Văn C',
        phone: '0901234571',
        role: 'USER',
      },
    ];

    for (const userData of users) {
      await prisma.user.upsert({
        where: { email: userData.email },
        update: userData,
        create: userData,
      });
    }
    console.log(`✅ Created ${users.length} users\n`);

    // 2. SEED CATEGORIES
    console.log('🏷️  Seeding Categories...');
    const categories = [
      {
        name: 'Âm thanh chuyên nghiệp',
        slug: 'am-thanh-chuyen-nghiep',
        description: 'Thiết bị âm thanh cao cấp cho sân khấu, hội trường',
        isActive: true,
      },
      {
        name: 'Loa & Amplifier',
        slug: 'loa-amplifier',
        description: 'Hệ thống loa và amply chất lượng cao',
        isActive: true,
      },
      {
        name: 'Microphone',
        slug: 'microphone',
        description: 'Micro không dây, có dây chuyên nghiệp',
        isActive: true,
      },
      {
        name: 'Mixer & Console',
        slug: 'mixer-console',
        description: 'Bàn mixer âm thanh analog và digital',
        isActive: true,
      },
      {
        name: 'Thiết bị ghi âm',
        slug: 'thiet-bi-ghi-am',
        description: 'Thiết bị ghi âm studio và di động',
        isActive: true,
      },
      {
        name: 'Phụ kiện âm thanh',
        slug: 'phu-kien-am-thanh',
        description: 'Cáp, giắc, chân đế và phụ kiện khác',
        isActive: true,
      },
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      });
    }
    console.log(`✅ Created ${categories.length} categories\n`);

    // Get category IDs
    const allCategories = await prisma.category.findMany();
    const categoryMap = {};
    allCategories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    // 3. SEED PRODUCTS
    console.log('📦 Seeding Products...');
    const products = [
      {
        name: 'Loa JBL PRX815W',
        slug: 'loa-jbl-prx815w',
        shortDescription: 'Loa sân khấu chuyên nghiệp 15 inch với Wi-Fi',
        description: 'Loa JBL PRX815W là dòng loa sân khấu chuyên nghiệp với công suất mạnh mẽ, âm thanh trong trẻo. Tích hợp Wi-Fi để điều khiển từ xa qua app di động.',
        priceCents: BigInt(45000000),
        originalPriceCents: BigInt(50000000),
        categoryId: categoryMap['loa-amplifier'],
        brand: 'JBL',
        model: 'PRX815W',
        sku: 'JBL-PRX815W-001',
        features: 'Công suất 1500W, Loa bass 15 inch, Wi-Fi control, Bluetooth streaming',
        warranty: '24 tháng',
        stockQuantity: 20,
        featured: true,
        isActive: true,
      },
      {
        name: 'Mixer Yamaha MG16XU',
        slug: 'mixer-yamaha-mg16xu',
        shortDescription: 'Bàn mixer 16 kênh với hiệu ứng built-in',
        description: 'Yamaha MG16XU là bàn mixer analog 16 kênh chất lượng cao với hiệu ứng SPX tích hợp sẵn, USB audio interface.',
        priceCents: BigInt(18500000),
        originalPriceCents: BigInt(20000000),
        categoryId: categoryMap['mixer-console'],
        brand: 'Yamaha',
        model: 'MG16XU',
        sku: 'YAMAHA-MG16XU-001',
        features: '16 input channels, 24-bit/192kHz USB interface, SPX effects, EQ 3 band',
        warranty: '12 tháng',
        stockQuantity: 15,
        featured: true,
        isActive: true,
      },
      {
        name: 'Micro Shure SM58',
        slug: 'micro-shure-sm58',
        shortDescription: 'Micro vocal huyền thoại của Shure',
        description: 'Shure SM58 là chiếc micro biểu tượng của ngành âm thanh chuyên nghiệp, được tin dùng bởi hàng triệu nghệ sĩ trên toàn thế giới.',
        priceCents: BigInt(3200000),
        originalPriceCents: BigInt(3500000),
        categoryId: categoryMap['microphone'],
        brand: 'Shure',
        model: 'SM58',
        sku: 'SHURE-SM58-001',
        features: 'Cardioid pickup, Frequency response 50-15kHz, Built-in pop filter',
        warranty: '24 tháng',
        stockQuantity: 50,
        featured: true,
        isActive: true,
      },
      {
        name: 'Interface Focusrite Scarlett 2i2',
        slug: 'interface-focusrite-scarlett-2i2',
        shortDescription: 'Audio interface 2-in/2-out USB',
        description: 'Focusrite Scarlett 2i2 là audio interface phổ biến nhất thế giới cho home studio và recording.',
        priceCents: BigInt(4800000),
        categoryId: categoryMap['thiet-bi-ghi-am'],
        brand: 'Focusrite',
        model: 'Scarlett 2i2',
        sku: 'FOCUS-2I2-001',
        features: '24-bit/192kHz, 2 Mic preamps, USB-C, Direct monitoring',
        warranty: '12 tháng',
        stockQuantity: 30,
        featured: false,
        isActive: true,
      },
      {
        name: 'Cáp XLR Mogami',
        slug: 'cap-xlr-mogami',
        shortDescription: 'Cáp micro chất lượng cao Mogami',
        description: 'Cáp XLR Mogami Gold là chuẩn mực cho cáp microphone chuyên nghiệp với chất lượng âm thanh tuyệt vời.',
        priceCents: BigInt(850000),
        categoryId: categoryMap['phu-kien-am-thanh'],
        brand: 'Mogami',
        model: 'Gold Studio XLR',
        sku: 'MOGAMI-XLR-5M',
        features: 'Chiều dài 5m, OFC copper, Gold plated connectors, Lifetime warranty',
        warranty: 'Trọn đời',
        stockQuantity: 100,
        featured: false,
        isActive: true,
      },
    ];

    for (const product of products) {
      const created = await prisma.product.upsert({
        where: { slug: product.slug },
        update: product,
        create: product,
      });

      // Create inventory for each product
      await prisma.inventory.upsert({
        where: { productId: created.id },
        update: {
          stock: product.stockQuantity,
          lowStockThreshold: 5,
        },
        create: {
          productId: created.id,
          stock: product.stockQuantity,
          lowStockThreshold: 5,
        },
      });
    }
    console.log(`✅ Created ${products.length} products with inventory\n`);

    // 4. SEED SERVICE TYPES
    console.log('🔧 Seeding Service Types...');
    const serviceTypes = [
      {
        name: 'Lắp đặt hệ thống',
        slug: 'lap-dat-he-thong',
        description: 'Thi công lắp đặt hệ thống âm thanh chuyên nghiệp',
        icon: 'wrench',
        color: '#3B82F6',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Bảo trì - Sửa chữa',
        slug: 'bao-tri-sua-chua',
        description: 'Bảo dưỡng, sửa chữa thiết bị âm thanh',
        icon: 'tool',
        color: '#10B981',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Tư vấn kỹ thuật',
        slug: 'tu-van-ky-thuat',
        description: 'Tư vấn giải pháp âm thanh phù hợp',
        icon: 'lightbulb',
        color: '#F59E0B',
        isActive: true,
        sortOrder: 3,
      },
      {
        name: 'Đào tạo - Huấn luyện',
        slug: 'dao-tao-huan-luyen',
        description: 'Đào tạo vận hành hệ thống âm thanh',
        icon: 'academic-cap',
        color: '#8B5CF6',
        isActive: true,
        sortOrder: 4,
      },
      {
        name: 'Thuê thiết bị',
        slug: 'thue-thiet-bi',
        description: 'Cho thuê thiết bị âm thanh sự kiện',
        icon: 'calendar',
        color: '#EF4444',
        isActive: true,
        sortOrder: 5,
      },
    ];

    for (const serviceType of serviceTypes) {
      await prisma.serviceType.upsert({
        where: { slug: serviceType.slug },
        update: serviceType,
        create: serviceType,
      });
    }
    console.log(`✅ Created ${serviceTypes.length} service types\n`);

    // Get service type IDs
    const allServiceTypes = await prisma.serviceType.findMany();
    const serviceTypeMap = {};
    allServiceTypes.forEach(st => {
      serviceTypeMap[st.slug] = st.id;
    });

    // 5. SEED SERVICES
    console.log('🛠️  Seeding Services...');
    const services = [
      {
        name: 'Lắp đặt âm thanh hội trường',
        slug: 'lap-dat-am-thanh-hoi-truong',
        shortDescription: 'Thi công lắp đặt hệ thống âm thanh hội trường, phòng họp',
        description: 'Dịch vụ thi công lắp đặt hệ thống âm thanh chuyên nghiệp cho hội trường, phòng họp với đội ngũ kỹ thuật viên giàu kinh nghiệm.',
        basePriceCents: 50000000,
        price: 50000000,
        minPrice: 30000000,
        maxPrice: 200000000,
        priceType: 'RANGE',
        duration: 3,
        typeId: serviceTypeMap['lap-dat-he-thong'],
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Bảo trì định kỳ hệ thống',
        slug: 'bao-tri-dinh-ky-he-thong',
        shortDescription: 'Bảo dưỡng định kỳ thiết bị âm thanh',
        description: 'Gói bảo trì định kỳ đảm bảo hệ thống luôn hoạt động ổn định, kéo dài tuổi thọ thiết bị.',
        basePriceCents: 5000000,
        price: 5000000,
        priceType: 'FIXED',
        duration: 1,
        typeId: serviceTypeMap['bao-tri-sua-chua'],
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Tư vấn giải pháp âm thanh',
        slug: 'tu-van-giai-phap-am-thanh',
        shortDescription: 'Tư vấn thiết kế hệ thống phù hợp',
        description: 'Dịch vụ tư vấn chuyên sâu về giải pháp âm thanh, giúp khách hàng lựa chọn thiết bị phù hợp với nhu cầu và ngân sách.',
        basePriceCents: 2000000,
        price: 2000000,
        priceType: 'FIXED',
        duration: 1,
        typeId: serviceTypeMap['tu-van-ky-thuat'],
        isActive: true,
        isFeatured: false,
      },
    ];

    for (const service of services) {
      await prisma.service.upsert({
        where: { slug: service.slug },
        update: service,
        create: service,
      });
    }
    console.log(`✅ Created ${services.length} services\n`);

    // 6. SEED BANNERS
    console.log('🎨 Seeding Banners...');
    const banners = [
      {
        title: 'Giảm giá 20% toàn bộ loa JBL',
        subtitle: 'Khuyến mãi tháng 11',
        description: 'Nhận ngay ưu đãi lớn cho dòng sản phẩm loa JBL chuyên nghiệp',
        imageUrl: 'https://placehold.co/1920x600/3B82F6/FFFFFF?text=JBL+Sale+20%',
        linkUrl: '/products?brand=jbl',
        buttonLabel: 'Mua ngay',
        page: 'home',
        position: 1,
        isActive: true,
      },
      {
        title: 'Dịch vụ lắp đặt chuyên nghiệp',
        subtitle: 'Miễn phí khảo sát',
        description: 'Đội ngũ kỹ thuật với hơn 10 năm kinh nghiệm',
        imageUrl: 'https://placehold.co/1920x600/10B981/FFFFFF?text=Installation+Service',
        linkUrl: '/services',
        buttonLabel: 'Tìm hiểu thêm',
        page: 'home',
        position: 2,
        isActive: true,
      },
    ];

    for (const banner of banners) {
      await prisma.banner.create({
        data: banner,
      });
    }
    console.log(`✅ Created ${banners.length} banners\n`);

    // 7. SEED PROJECTS
    console.log('💼 Seeding Projects...');
    const adminUser = await prisma.user.findUnique({ where: { email: 'admin@audiotailoc.vn' } });
    
    const projects = [
      {
        name: 'Hệ thống âm thanh Hội trường Thống Nhất',
        slug: 'he-thong-am-thanh-hoi-truong-thong-nhat',
        shortDescription: 'Lắp đặt hệ thống âm thanh Line Array cho hội trường 2000 chỗ',
        description: 'Dự án lắp đặt hệ thống âm thanh chuyên nghiệp cho Hội trường Thống Nhất với công suất lớn, âm thanh chuẩn quốc tế.',
        client: 'Hội trường Thống Nhất',
        category: 'Hội trường',
        technologies: 'JBL Line Array, Yamaha Digital Mixer, Crown Amplifier',
        status: 'COMPLETED',
        isFeatured: true,
        isActive: true,
        userId: adminUser.id,
        projectDate: new Date('2024-06-01'),
      },
      {
        name: 'Studio thu âm MusicLab',
        slug: 'studio-thu-am-musiclab',
        shortDescription: 'Thi công studio thu âm chuyên nghiệp',
        description: 'Thiết kế và thi công studio thu âm với cách âm chuyên nghiệp, trang bị thiết bị cao cấp.',
        client: 'MusicLab Studio',
        category: 'Studio',
        technologies: 'Acoustic Treatment, Neumann Microphones, Universal Audio Interface',
        status: 'COMPLETED',
        isFeatured: true,
        isActive: true,
        userId: adminUser.id,
        projectDate: new Date('2024-08-15'),
      },
    ];

    for (const project of projects) {
      await prisma.project.upsert({
        where: { slug: project.slug },
        update: project,
        create: project,
      });
    }
    console.log(`✅ Created ${projects.length} projects\n`);

    // 8. SEED PROMOTIONS
    console.log('🎁 Seeding Promotions...');
    const promotions = [
      {
        code: 'WELCOME10',
        name: 'Giảm 10% đơn đầu tiên',
        description: 'Ưu đãi cho khách hàng mới',
        type: 'PERCENTAGE',
        value: 10,
        isActive: true,
        min_order_amount: 1000000,
        max_discount: 1000000,
        usage_limit: 100,
        updatedAt: new Date(),
        expiresAt: new Date('2025-12-31'),
      },
      {
        code: 'FLASH20',
        name: 'Flash Sale 20%',
        description: 'Giảm giá khủng trong thời gian có hạn',
        type: 'PERCENTAGE',
        value: 20,
        isActive: true,
        min_order_amount: 5000000,
        max_discount: 5000000,
        usage_limit: 50,
        updatedAt: new Date(),
        expiresAt: new Date('2025-11-30'),
      },
    ];

    for (const promotion of promotions) {
      try {
        await prisma.promotion.create({
          data: promotion,
        });
        console.log(`✅ Created promotion: ${promotion.code}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`ℹ️  Promotion already exists: ${promotion.code}`);
        } else {
          console.error(`❌ Error creating promotion ${promotion.code}:`, error.message);
        }
      }
    }
    console.log(`✅ Processed ${promotions.length} promotions\n`);

    // 9. SEED SITE STATS
    console.log('📊 Seeding Site Stats...');
    const siteStats = [
      {
        key: 'customers',
        value: '1200',
        label: 'Khách hàng hài lòng',
        description: 'Được tin tưởng bởi doanh nghiệp, studio và nhà hát',
        icon: 'Users',
        isActive: true,
        displayOrder: 1,
        updatedAt: new Date(),
      },
      {
        key: 'products',
        value: '650',
        label: 'Thiết bị & giải pháp',
        description: 'Danh mục sản phẩm chuyên sâu',
        icon: 'Package',
        isActive: true,
        displayOrder: 2,
        updatedAt: new Date(),
      },
      {
        key: 'rating',
        value: '4.9',
        label: 'Đánh giá trung bình',
        description: 'Chất lượng dịch vụ vượt mong đợi',
        icon: 'Star',
        isActive: true,
        displayOrder: 3,
        updatedAt: new Date(),
      },
      {
        key: 'experience',
        value: '7',
        label: 'Năm kinh nghiệm',
        description: 'Đồng hành cùng 300+ dự án',
        icon: 'Award',
        isActive: true,
        displayOrder: 4,
        updatedAt: new Date(),
      },
    ];

    for (const stat of siteStats) {
      try {
        await prisma.site_stats.create({
          data: { id: require('crypto').randomUUID(), ...stat },
        });
        console.log(`✅ Created stat: ${stat.key}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`ℹ️  Stat already exists: ${stat.key}`);
        } else {
          console.error(`❌ Error creating stat ${stat.key}:`, error.message);
        }
      }
    }
    console.log(`✅ Processed ${siteStats.length} site stats\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ COMPREHENSIVE DATA SEEDING COMPLETED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Final statistics
    const finalCounts = {
      users: await prisma.user.count(),
      products: await prisma.product.count(),
      categories: await prisma.category.count(),
      services: await prisma.service.count(),
      serviceTypes: await prisma.serviceType.count(),
      banners: await prisma.banner.count(),
      projects: await prisma.project.count(),
      promotions: await prisma.promotion.count(),
    };

    console.log('📊 Final Database Statistics:');
    console.log(`   👥 Users: ${finalCounts.users}`);
    console.log(`   📦 Products: ${finalCounts.products}`);
    console.log(`   🏷️  Categories: ${finalCounts.categories}`);
    console.log(`   🛠️  Services: ${finalCounts.services}`);
    console.log(`   🔧 Service Types: ${finalCounts.serviceTypes}`);
    console.log(`   🎨 Banners: ${finalCounts.banners}`);
    console.log(`   💼 Projects: ${finalCounts.projects}`);
    console.log(`   🎁 Promotions: ${finalCounts.promotions}\n`);

    console.log('🔑 Test Account Credentials:');
    console.log('   Admin: admin@audiotailoc.vn / password123');
    console.log('   Manager: manager@audiotailoc.vn / password123');
    console.log('   Customer: customer1@gmail.com / password123\n');

  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedComprehensiveData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedComprehensiveData };
