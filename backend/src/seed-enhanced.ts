/*
  Enhanced seed script for comprehensive dashboard testing data.
  Usage: ts-node src/seed-enhanced.ts
*/
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function generateComprehensiveTestData() {
  console.log('🌱 Starting enhanced data seeding for dashboard testing...');

  try {
    // Promote admin emails if configured
    const adminEnv = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Create admin users
    if (adminEnv.length > 0) {
      for (const email of adminEnv) {
        const hashedPassword = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // "password"
        
        await prisma.user.upsert({
          where: { email },
          update: { role: 'ADMIN' },
          create: {
            email,
            password: hashedPassword,
            name: `Admin User (${email})`,
            phone: '+84123456789',
            role: 'ADMIN'
          }
        });
        console.log(`✅ Admin user created/updated: ${email}`);
      }
    }

    // Create sample regular users for testing
    const sampleUsers = [
      { email: 'user1@example.com', name: 'Nguyễn Văn A', phone: '+84901234567' },
      { email: 'user2@example.com', name: 'Trần Thị B', phone: '+84901234568' },
      { email: 'user3@example.com', name: 'Lê Văn C', phone: '+84901234569' },
      { email: 'user4@example.com', name: 'Phạm Thị D', phone: '+84901234570' },
      { email: 'user5@example.com', name: 'Hoàng Văn E', phone: '+84901234571' },
    ];

    for (const userData of sampleUsers) {
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          ...userData,
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
          role: 'USER'
        }
      });
    }
    console.log(`✅ Created ${sampleUsers.length} sample users`);

    // Categories
    const categories = [
      { slug: 'loa', name: 'Loa' },
      { slug: 'tai-nghe', name: 'Tai nghe' },
      { slug: 'soundbar', name: 'Soundbar' },
      { slug: 'amplifier', name: 'Ampli' },
      { slug: 'dac', name: 'DAC' },
    ];

    const createdCategories = {};
    for (const cat of categories) {
      const category = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat
      });
      createdCategories[cat.slug] = category;
    }
    console.log(`✅ Created ${categories.length} categories`);

    // Enhanced Products with more variety
    const products = [
      {
        slug: 'loa-tai-loc-classic',
        name: 'Loa Tài Lộc Classic',
        description: 'Âm thanh ấm áp, thiết kế cổ điển. Driver 6.5 inch, công suất 100W.',
        priceCents: 1990000,
        imageUrl: 'https://placehold.co/600x400/4f46e5/ffffff?text=Classic+Speaker',
        categoryId: createdCategories['loa'].id,
        featured: true,
      },
      {
        slug: 'tai-nghe-tai-loc-pro',
        name: 'Tai nghe Tài Lộc Pro',
        description: 'Chống ồn chủ động, pin 30 giờ. Driver dynamic 40mm.',
        priceCents: 2990000,
        imageUrl: 'https://placehold.co/600x400/059669/ffffff?text=Pro+Headphones',
        categoryId: createdCategories['tai-nghe'].id,
        featured: true,
      },
      {
        slug: 'soundbar-tai-loc-5-1',
        name: 'Soundbar Tài Lộc 5.1',
        description: 'Rạp tại gia, âm trường rộng. Hỗ trợ Dolby Atmos.',
        priceCents: 4990000,
        imageUrl: 'https://placehold.co/600x400/dc2626/ffffff?text=Soundbar+5.1',
        categoryId: createdCategories['soundbar'].id,
        featured: false,
      },
      {
        slug: 'ampli-tai-loc-tube',
        name: 'Ampli Tài Lộc Tube',
        description: 'Ampli đèn cổ điển, âm thanh ấm áp. Công suất 50W x 2.',
        priceCents: 8990000,
        imageUrl: 'https://placehold.co/600x400/7c2d12/ffffff?text=Tube+Amplifier',
        categoryId: createdCategories['amplifier'].id,
        featured: false,
      },
      {
        slug: 'dac-tai-loc-hi-res',
        name: 'DAC Tài Lộc Hi-Res',
        description: 'DAC 32bit/384kHz, hỗ trợ DSD. Chất lượng studio.',
        priceCents: 3990000,
        imageUrl: 'https://placehold.co/600x400/1e40af/ffffff?text=Hi-Res+DAC',
        categoryId: createdCategories['dac'].id,
        featured: false,
      },
      {
        slug: 'loa-tai-loc-bookshelf',
        name: 'Loa Tài Lộc Bookshelf',
        description: 'Loa kệ sách nhỏ gọn, âm thanh chi tiết. Driver 5 inch.',
        priceCents: 1490000,
        imageUrl: 'https://placehold.co/600x400/059669/ffffff?text=Bookshelf',
        categoryId: createdCategories['loa'].id,
        featured: false,
      },
      {
        slug: 'tai-nghe-tai-loc-gaming',
        name: 'Tai nghe Tài Lộc Gaming',
        description: 'Tai nghe gaming với mic chống ồn, LED RGB.',
        priceCents: 1990000,
        imageUrl: 'https://placehold.co/600x400/7c3aed/ffffff?text=Gaming+Headset',
        categoryId: createdCategories['tai-nghe'].id,
        featured: false,
      },
    ];

    const createdProducts = [];
    for (const product of products) {
      const p = await prisma.product.upsert({
        where: { slug: product.slug },
        update: product,
        create: product,
      });
      createdProducts.push(p);

      // Create knowledge base entry for each product
      await prisma.knowledgeBaseEntry.upsert({
        where: {
          productId_kind: {
            productId: p.id,
            kind: 'PRODUCT'
          }
        },
        update: {},
        create: {
          kind: 'PRODUCT',
          title: p.name,
          content: p.description || '',
          productId: p.id
        }
      });
    }
    console.log(`✅ Created ${products.length} products`);

    // Create sample orders for dashboard metrics
    const users = await prisma.user.findMany({ where: { role: 'USER' } });
    const orderStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    
    for (let i = 0; i < 25; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const randomStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      
      // Create orders over the last 30 days
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));

      const order = await prisma.order.create({
        data: {
          userId: randomUser.id,
          status: randomStatus,
          totalCents: randomProduct.priceCents + Math.floor(Math.random() * 500000),
          shippingAddressLine1: '123 Đường ABC',
          shippingAddressLine2: 'Quận 1',
          shippingCity: 'TP.HCM',
          shippingPostalCode: '70000',
          shippingCountry: 'VN',
          createdAt: orderDate,
          updatedAt: orderDate,
        }
      });

      // Create order items
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: randomProduct.id,
          quantity: Math.floor(Math.random() * 3) + 1,
          priceCents: randomProduct.priceCents,
        }
      });
    }
    console.log(`✅ Created 25 sample orders`);

    // Create promotions
    const now = new Date();
    const nextMonth = new Date(now.getTime());
    nextMonth.setMonth(now.getMonth() + 1);

    const promotions = [
      {
        code: 'WELCOME10',
        name: 'Welcome 10%',
        description: 'Giảm 10% cho khách hàng mới',
        type: 'PERCENT',
        value: 10,
        minAmount: 500000,
        startDate: now,
        endDate: nextMonth,
        isActive: true,
      },
      {
        code: 'SUMMER20',
        name: 'Summer Sale 20%',
        description: 'Giảm 20% mùa hè',
        type: 'PERCENT',
        value: 20,
        minAmount: 1000000,
        startDate: now,
        endDate: nextMonth,
        isActive: true,
      },
      {
        code: 'FREESHIP',
        name: 'Free Shipping',
        description: 'Miễn phí vận chuyển',
        type: 'FIXED',
        value: 50000,
        minAmount: 300000,
        startDate: now,
        endDate: nextMonth,
        isActive: true,
      },
    ];

    for (const promo of promotions) {
      await prisma.promotion.upsert({
        where: { code: promo.code },
        update: {},
        create: promo
      });
    }
    console.log(`✅ Created ${promotions.length} promotions`);

    // Create FAQ entries for knowledge base
    const faqs = [
      {
        title: 'Chính sách đổi trả',
        content: 'Đổi trả trong 7 ngày với sản phẩm còn nguyên vẹn. Khách hàng chịu phí vận chuyển.'
      },
      {
        title: 'Bảo hành sản phẩm',
        content: 'Bảo hành 12 tháng cho tất cả sản phẩm chính hãng. Bảo hành 24 tháng cho sản phẩm cao cấp.'
      },
      {
        title: 'Hướng dẫn thanh toán',
        content: 'Hỗ trợ thanh toán qua thẻ tín dụng, chuyển khoản, và thanh toán khi nhận hàng.'
      },
      {
        title: 'Thời gian giao hàng',
        content: 'Giao hàng trong 2-3 ngày làm việc tại TP.HCM và Hà Nội. 3-5 ngày tại các tỉnh khác.'
      },
      {
        title: 'Hỗ trợ kỹ thuật',
        content: 'Đội ngũ kỹ thuật hỗ trợ 24/7 qua hotline 1900-xxxx hoặc email support@audiotailoc.vn'
      },
    ];

    for (const faq of faqs) {
      await prisma.knowledgeBaseEntry.upsert({
        where: {
          title_kind: {
            title: faq.title,
            kind: 'FAQ'
          }
        },
        update: {},
        create: {
          kind: 'FAQ',
          title: faq.title,
          content: faq.content
        }
      });
    }
    console.log(`✅ Created ${faqs.length} FAQ entries`);

    // Create notifications for admin users
    if (adminEnv.length > 0) {
      const admins = await prisma.user.findMany({ 
        where: { email: { in: adminEnv } }, 
        select: { id: true, email: true } 
      });

      const notifications = [
        {
          type: 'SYSTEM',
          title: 'Hệ thống khởi động thành công',
          message: 'Dashboard backend đã được kết nối và sẵn sàng hoạt động.',
        },
        {
          type: 'ORDER',
          title: 'Đơn hàng mới',
          message: 'Có 5 đơn hàng mới cần xử lý trong hôm nay.',
        },
        {
          type: 'PROMOTION',
          title: 'Khuyến mãi sắp hết hạn',
          message: 'Chương trình khuyến mãi SUMMER20 sẽ kết thúc trong 3 ngày.',
        },
      ];

      for (const admin of admins) {
        for (const notif of notifications) {
          await prisma.notification.create({
            data: {
              userId: admin.id,
              type: notif.type,
              title: notif.title,
              message: notif.message,
              data: JSON.stringify({ seeded: true, timestamp: new Date().toISOString() }),
            }
          });
        }
      }
      console.log(`✅ Created notifications for ${admins.length} admin users`);
    }

    console.log('🎉 Enhanced data seeding completed successfully!');
    
    // Print summary
    const summary = {
      users: await prisma.user.count(),
      products: await prisma.product.count(),
      orders: await prisma.order.count(),
      categories: await prisma.category.count(),
      promotions: await prisma.promotion.count(),
      knowledgeBase: await prisma.knowledgeBaseEntry.count(),
    };

    console.log('\n📊 Database Summary:');
    console.table(summary);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

generateComprehensiveTestData()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✅ Database connection closed');
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });