/*
  Comprehensive Seed Script for All Models
  Usage: npx tsx src/seed-complete-data.ts
*/
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

// Helper function to generate random date in past
function randomPastDate(daysAgo: number = 365): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
}

// Helper function to generate future date
function randomFutureDate(daysAhead: number = 365): Date {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
  return date;
}

async function seedData() {
  console.log('🌱 Starting comprehensive data seeding...\n');
  
  try {
    // ========================================
    // 1. SEED TECHNICIANS
    // ========================================
    console.log('👷 Creating Technicians...');
    const technicians = [
      {
        name: 'Nguyễn Văn Hùng',
        phone: '0901234567',
        email: 'hung.nguyen@audiotailoc.com',
        specialties: JSON.stringify(['Lắp đặt hệ thống âm thanh', 'Tư vấn kỹ thuật']),
        isActive: true
      },
      {
        name: 'Trần Minh Tuấn',
        phone: '0901234568',
        email: 'tuan.tran@audiotailoc.com',
        specialties: JSON.stringify(['Sửa chữa thiết bị âm thanh', 'Bảo trì định kỳ']),
        isActive: true
      },
      {
        name: 'Lê Hoàng Long',
        phone: '0901234569',
        email: 'long.le@audiotailoc.com',
        specialties: JSON.stringify(['Tư vấn âm học', 'Thiết kế phòng thu']),
        isActive: true
      },
      {
        name: 'Phạm Quốc Đạt',
        phone: '0901234570',
        email: 'dat.pham@audiotailoc.com',
        specialties: JSON.stringify(['Lắp đặt karaoke', 'Thiết kế hệ thống']),
        isActive: true
      },
      {
        name: 'Vũ Đình Phong',
        phone: '0901234571',
        email: 'phong.vu@audiotailoc.com',
        specialties: JSON.stringify(['Bảo trì định kỳ', 'Sửa chữa khẩn cấp']),
        isActive: true
      }
    ];
    
    for (const tech of technicians) {
      await prisma.technician.upsert({
        where: { email: tech.email },
        update: tech,
        create: tech
      });
    }
    console.log(`  ✅ Created ${technicians.length} technicians`);
    
    // ========================================
    // 2. SEED SERVICE ITEMS
    // ========================================
    console.log('\n🔧 Creating Service Items...');
    const services = await prisma.service.findMany({ take: 6 });
    const serviceItems = [];
    
    for (const service of services) {
      const items = [
        {
          serviceId: service.id,
          name: `Gói cơ bản - ${service.name}`,
          price: service.minPrice || 1000000,
          quantity: 1
        },
        {
          serviceId: service.id,
          name: `Gói nâng cao - ${service.name}`,
          price: service.maxPrice || 3000000,
          quantity: 1
        }
      ];
      
      for (const item of items) {
        const created = await prisma.serviceItem.create({ data: item });
        serviceItems.push(created);
      }
    }
    console.log(`  ✅ Created ${serviceItems.length} service items`);
    
    // ========================================
    // 3. SEED SERVICE BOOKINGS
    // ========================================
    console.log('\n📅 Creating Service Bookings...');
    const users = await prisma.user.findMany({ where: { role: 'USER' }, take: 3 });
    const techniciansList = await prisma.technician.findMany();
    
    const bookingStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    const bookings = [];
    
    for (let i = 0; i < 15; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const service = services[Math.floor(Math.random() * services.length)];
      const technician = techniciansList[Math.floor(Math.random() * techniciansList.length)];
      const status = bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)];
      
      const booking = await prisma.serviceBooking.create({
        data: {
          userId: user.id,
          serviceId: service.id,
          technicianId: technician.id,
          scheduledAt: randomFutureDate(30),
          scheduledTime: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'][Math.floor(Math.random() * 4)],
          status,
          notes: 'Khách hàng yêu cầu kỹ thuật viên đến đúng giờ',
          estimatedCosts: service.minPrice || 1000000,
          actualCosts: status === 'COMPLETED' ? (service.minPrice || 1000000) : null,
          completedAt: status === 'COMPLETED' ? new Date() : null
        }
      });
      bookings.push(booking);
    }
    console.log(`  ✅ Created ${bookings.length} service bookings`);
    
    // ========================================
    // 4. SEED PRODUCT REVIEWS
    // ========================================
    console.log('\n⭐ Creating Product Reviews...');
    const products = await prisma.product.findMany({ take: 8 });
    
    const reviewComments = [
      'Sản phẩm rất tốt, âm thanh trong trẻo',
      'Chất lượng tuyệt vời, đáng đồng tiền',
      'Giao hàng nhanh, đóng gói cẩn thận',
      'Âm bass mạnh mẽ, treble rõ ràng',
      'Thiết kế đẹp, chất lượng ổn định',
      'Giá cả hợp lý, chất lượng tốt',
      'Rất hài lòng với sản phẩm này',
      'Dịch vụ tư vấn nhiệt tình, sản phẩm chất lượng'
    ];
    
    for (const product of products) {
      const numReviews = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numReviews; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        await prisma.productReview.create({
          data: {
            productId: product.id,
            userId: user.id,
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
            title: 'Sản phẩm tuyệt vời',
            comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
            isVerified: Math.random() > 0.3,
            status: 'APPROVED',
            upvotes: Math.floor(Math.random() * 20),
            downvotes: Math.floor(Math.random() * 5),
            createdAt: randomPastDate(90)
          }
        });
      }
    }
    console.log(`  ✅ Created product reviews`);
    
    // ========================================
    // 5. SEED WISHLIST ITEMS
    // ========================================
    console.log('\n❤️ Creating Wishlist Items...');
    for (const user of users) {
      const numItems = Math.floor(Math.random() * 5) + 2;
      const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, numItems);
      
      for (const product of selectedProducts) {
        await prisma.wishlistItem.create({
          data: {
            userId: user.id,
            productId: product.id,
            createdAt: randomPastDate(30)
          }
        }).catch(() => {}); // Ignore duplicates
      }
    }
    console.log(`  ✅ Created wishlist items`);
    
    // ========================================
    // 6. SEED NOTIFICATIONS
    // ========================================
    console.log('\n🔔 Creating Notifications...');
    const notificationTypes = ['ORDER', 'PROMOTION', 'INFO', 'WARNING', 'SUCCESS'];
    const notificationTemplates = [
      { title: 'Đơn hàng đã được xác nhận', message: 'Đơn hàng #ORDER123 của bạn đã được xác nhận', type: 'ORDER' },
      { title: 'Khuyến mãi mới', message: 'Giảm 20% cho tất cả sản phẩm loa karaoke', type: 'PROMOTION' },
      { title: 'Cập nhật hệ thống', message: 'Hệ thống sẽ bảo trì từ 2h-4h sáng', type: 'INFO' },
      { title: 'Thanh toán thành công', message: 'Thanh toán đơn hàng #ORDER456 thành công', type: 'SUCCESS' },
      { title: 'Sản phẩm yêu thích có giảm giá', message: 'Loa JBL GO 3 đang giảm 30%', type: 'PROMOTION' },
      { title: 'Đánh giá sản phẩm', message: 'Hãy đánh giá sản phẩm bạn đã mua', type: 'INFO' },
      { title: 'Điểm thưởng sắp hết hạn', message: 'Bạn có 500 điểm sắp hết hạn', type: 'WARNING' }
    ];
    
    for (const user of users) {
      const numNotifications = Math.floor(Math.random() * 5) + 3;
      for (let i = 0; i < numNotifications; i++) {
        const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
        await prisma.notification.create({
          data: {
            userId: user.id,
            ...template,
            isRead: Math.random() > 0.5,
            createdAt: randomPastDate(30)
          }
        });
      }
    }
    console.log(`  ✅ Created notifications`);
    
    // ========================================
    // 7. CHAT SESSIONS & MESSAGES (DISABLED)
    // ========================================
    // Note: chatSession and chatMessage models not available in current schema
    console.log('\n💬 Skipping Chat Sessions (model not available in schema)...');
    
    /*
    // Commented out chat session creation
    for (const user of users.slice(0, 3)) {
      const session = await prisma.chatSession.create({
        data: {
          userId: user.id,
          status: 'ACTIVE',
          source: 'WEB',
          createdAt: randomPastDate(15)
        }
      });
      
      const messages = [
        { content: 'Xin chào, tôi cần tư vấn về loa karaoke', role: 'user' },
        { content: 'Chào bạn! Tôi có thể giúp gì cho bạn về loa karaoke?', role: 'ASSISTANT' },
        { content: 'Tôi muốn mua loa cho phòng 30m2', role: 'user' },
        { content: 'Với phòng 30m2, tôi recommend dòng loa JBL KP6012', role: 'ASSISTANT' },
        { content: 'Giá bao nhiêu vậy?', role: 'user' },
        { content: 'Giá hiện tại là 12 triệu, đang có khuyến mãi 10%', role: 'ASSISTANT' },
        { content: 'Có bảo hành không?', role: 'user' },
        { content: 'Có bảo hành 24 tháng chính hãng', role: 'ASSISTANT' }
      ];
      
      for (const msg of messages) {
        await prisma.chatMessage.create({
          data: {
            sessionId: session.id,
            ...msg,
            createdAt: randomPastDate(15)
          }
        });
      }
    }
    */
    
    // ========================================
    // 8. SEED CUSTOMER QUESTIONS
    // ========================================
    console.log('\n❓ Creating Customer Questions...');
    const questions = [
      'Loa này có kết nối Bluetooth không?',
      'Công suất thực tế là bao nhiêu W?',
      'Có hỗ trợ lắp đặt tại nhà không?',
      'Thời gian bảo hành là bao lâu?',
      'Có thể kết nối với TV không?',
      'Phụ kiện đi kèm gồm những gì?',
      'Có hỗ trợ trả góp không?',
      'Khoảng cách bluetooth xa nhất là bao nhiêu?',
      'Có chống nước không?',
      'Pin dùng được bao lâu?'
    ];
    
    for (const product of products.slice(0, 6)) {
      const numQuestions = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numQuestions; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const question = await prisma.customerQuestion.create({
          data: {
            userId: user.id,
            question: questions[Math.floor(Math.random() * questions.length)],
            category: 'product',
            satisfaction: Math.floor(Math.random() * 2) + 4,
            timestamp: randomPastDate(60)
          }
        });
      }
    }
    console.log(`  ✅ Created customer questions`);
    
    // ========================================
    // 9. SEED PROMOTIONS
    // ========================================
    console.log('\n🎁 Creating Promotions...');
    const promotions = [
      {
        code: 'NEWYEAR2025',
        name: 'Khuyến mãi năm mới 2025',
        description: 'Giảm 25% cho tất cả sản phẩm',
        type: 'PERCENTAGE',
        value: 25,
        isActive: true,
        expiresAt: new Date('2025-01-31')
      },
      {
        code: 'FIRSTORDER',
        name: 'Ưu đãi đơn hàng đầu tiên',
        description: 'Giảm 200k cho đơn hàng đầu tiên',
        type: 'FIXED',
        value: 200000,
        isActive: true,
        expiresAt: new Date('2025-12-31')
      },
      {
        code: 'FREESHIP',
        name: 'Miễn phí vận chuyển',
        description: 'Miễn phí vận chuyển cho đơn từ 1 triệu',
        type: 'FREESHIP',
        value: 0,
        isActive: true,
        expiresAt: new Date('2025-03-31')
      },
      {
        code: 'VIP20',
        name: 'Ưu đãi VIP',
        description: 'Giảm 20% cho khách hàng VIP',
        type: 'PERCENTAGE',
        value: 20,
        isActive: true,
        expiresAt: new Date('2025-06-30')
      },
      {
        code: 'SUMMER50K',
        name: 'Khuyến mãi mùa hè',
        description: 'Giảm 50k cho đơn từ 500k',
        type: 'FIXED',
        value: 50000,
        isActive: false,
        expiresAt: new Date('2024-08-31')
      }
    ];
    
    for (const promo of promotions) {
      await prisma.promotion.upsert({
        where: { code: promo.code },
        update: promo,
        create: promo
      });
    }
    console.log(`  ✅ Created ${promotions.length} promotions`);
    
    // ========================================
    // 10. SEED LOYALTY ACCOUNTS & REWARDS
    // ========================================
    console.log('\n🏆 Creating Loyalty Accounts & Rewards...');
    
    // Create rewards first
    const rewards = [
      {
        name: 'Giảm 100k',
        description: 'Voucher giảm 100k cho đơn từ 1 triệu',
        pointsCost: 1000,
        value: 100000,
        type: 'DISCOUNT',
        isActive: true
      },
      {
        name: 'Giảm 200k',
        description: 'Voucher giảm 200k cho đơn từ 2 triệu',
        pointsCost: 1800,
        value: 200000,
        type: 'DISCOUNT',
        isActive: true
      },
      {
        name: 'Miễn phí vận chuyển',
        description: 'Miễn phí vận chuyển cho 1 đơn hàng',
        pointsCost: 500,
        value: 0,
        type: 'FREESHIP',
        isActive: true
      },
      {
        name: 'Quà tặng độc quyền',
        description: 'Nhận quà tặng độc quyền từ Audio Tài Lộc',
        pointsCost: 3000,
        value: 500000,
        type: 'GIFT',
        isActive: true
      },
      {
        name: 'Nâng cấp VIP',
        description: 'Nâng cấp lên tài khoản VIP trong 1 tháng',
        pointsCost: 5000,
        value: 0,
        type: 'UPGRADE',
        isActive: true
      }
    ];
    
    for (const reward of rewards) {
      await prisma.loyaltyReward.create({ data: reward });
    }
    console.log(`  ✅ Created ${rewards.length} loyalty rewards`);
    
    // Create loyalty accounts for users
    for (const user of users) {
      const points = Math.floor(Math.random() * 5000) + 100;
      const tier = points > 3000 ? 'GOLD' : points > 1500 ? 'SILVER' : 'BRONZE';
      
      await prisma.loyaltyAccount.create({
        data: {
          userId: user.id,
          points,
          tier,
          isActive: true
        }
      }).catch(() => {}); // Ignore if already exists
    }
    console.log(`  ✅ Created loyalty accounts`);
    
    // ========================================
    // 11. SEED CAMPAIGNS
    // ========================================
    console.log('\n📧 Creating Marketing Campaigns...');
    const campaigns = [
      {
        name: 'Khuyến mãi Tết 2025',
        description: 'Chiến dịch khuyến mãi đặc biệt dịp Tết Nguyên Đán',
        type: 'EMAIL' as const,
        status: 'SENT' as const,
        targetAudience: 'Tất cả khách hàng',
        discountPercent: 30,
        startDate: new Date('2025-01-20'),
        endDate: new Date('2025-02-10'),
        sentAt: new Date('2025-01-15')
      },
      {
        name: 'Ra mắt sản phẩm mới',
        description: 'Giới thiệu dòng loa karaoke mới',
        type: 'EMAIL' as const,
        status: 'SCHEDULED' as const,
        targetAudience: 'Khách hàng VIP',
        discountPercent: 15,
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-02-28')
      },
      {
        name: 'Black Friday 2024',
        description: 'Siêu sale Black Friday',
        type: 'SOCIAL' as const,
        status: 'SENT' as const,
        targetAudience: 'Khách hàng trẻ',
        discountPercent: 50,
        startDate: new Date('2024-11-24'),
        endDate: new Date('2024-11-30'),
        sentAt: new Date('2024-11-20')
      },
      {
        name: 'Sinh nhật Audio Tài Lộc',
        description: 'Kỷ niệm 10 năm thành lập',
        type: 'PUSH' as const,
        status: 'DRAFT' as const,
        targetAudience: 'Tất cả khách hàng',
        discountAmount: 500000,
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-05-31')
      },
      {
        name: 'Flash Sale cuối tuần',
        description: 'Giảm giá nhanh cuối tuần',
        type: 'SMS' as const,
        status: 'SCHEDULED' as const,
        targetAudience: 'Khách hàng active',
        discountPercent: 20,
        startDate: new Date('2025-01-25'),
        endDate: new Date('2025-01-26')
      }
    ];
    
    for (const campaign of campaigns) {
      await prisma.campaign.create({ data: campaign });
    }
    console.log(`  ✅ Created ${campaigns.length} campaigns`);
    
    // ========================================
    // 12. SEED CART & CART ITEMS
    // ========================================
    console.log('\n🛒 Creating Carts & Cart Items...');
    for (const user of users) {
      const cart = await prisma.cart.create({
        data: {
          userId: user.id,
          status: 'ACTIVE',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
      });
      
      // Add random items to cart
      const numItems = Math.floor(Math.random() * 4) + 1;
      const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, numItems);
      
      for (const product of selectedProducts) {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: product.priceCents
          }
        }).catch(() => {}); // Ignore duplicates
      }
    }
    console.log(`  ✅ Created carts with items`);
    
    // ========================================
    // 13. SEED MORE ORDERS & PAYMENTS
    // ========================================
    console.log('\n📦 Creating More Orders & Payments...');
    const orderStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    
    for (let i = 0; i < 15; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const numItems = Math.floor(Math.random() * 4) + 1;
      const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, numItems);
      
      let subtotal = 0;
      const orderItems = selectedProducts.map(product => {
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = product.priceCents;
        subtotal += price * quantity;
        return {
          productId: product.id,
          quantity,
          price,
          name: product.name,
          unitPrice: price,
          imageUrl: product.imageUrl
        };
      });
      
      const discount = Math.random() > 0.7 ? Math.floor(subtotal * 0.1) : 0;
      const shipping = 30000; // 30k VND
      const total = subtotal - discount + shipping;
      
      const order = await prisma.order.create({
        data: {
          orderNo: `ORD${Date.now()}${i}`,
          userId: user.id,
          subtotalCents: subtotal,
          discountCents: discount,
          shippingCents: shipping,
          totalCents: total,
          status,
          shippingAddress: [
            '123 Nguyễn Huệ, Q1, TP.HCM',
            '456 Lê Lợi, Q1, TP.HCM',
            '789 Hai Bà Trưng, Q3, TP.HCM'
          ][Math.floor(Math.random() * 3)],
          promotionCode: Math.random() > 0.7 ? 'NEWYEAR2025' : null,
          items: {
            create: orderItems
          },
          createdAt: randomPastDate(90)
        }
      });
      
      // Create payment for completed orders
      if (status === 'DELIVERED' || status === 'SHIPPED') {
        const paymentIntent = await prisma.paymentIntent.create({
          data: {
            orderId: order.id,
            provider: ['VNPAY', 'MOMO', 'PAYOS'][Math.floor(Math.random() * 3)],
            amountCents: total,
            status: 'SUCCEEDED',
            clientSecret: `pi_${Date.now()}_secret`,
            returnUrl: 'http://localhost:3000/checkout/success'
          }
        });
        
        await prisma.payment.create({
          data: {
            orderId: order.id,
            intentId: paymentIntent.id,
            provider: paymentIntent.provider,
            amountCents: total,
            status: 'COMPLETED',
            transactionId: `TXN${Date.now()}${i}`,
            metadata: JSON.stringify({ method: 'online' })
          }
        });
      }
    }
    console.log(`  ✅ Created additional orders with payments`);
    
    // ========================================
    // 14. SEED INVENTORY
    // ========================================
    console.log('\n📊 Creating Inventory Records...');
    for (const product of products) {
      const stock = Math.floor(Math.random() * 100) + 10;
      const reserved = Math.floor(stock * 0.1);
      
      await prisma.inventory.create({
        data: {
          productId: product.id,
          stock,
          reserved,
          lowStockThreshold: 10
        }
      }).catch(() => {}); // Ignore if already exists
    }
    console.log(`  ✅ Created inventory records`);
    
    // ========================================
    // 15. SEED ANALYTICS DATA
    // ========================================
    console.log('\n📈 Creating Analytics Data...');
    
    // Product Views
    for (const product of products) {
      const numViews = Math.floor(Math.random() * 20) + 5;
      for (let i = 0; i < numViews; i++) {
        const user = Math.random() > 0.5 ? users[Math.floor(Math.random() * users.length)] : null;
        await prisma.productView.create({
          data: {
            productId: product.id,
            userId: user?.id,
            timestamp: randomPastDate(30),
            duration: Math.floor(Math.random() * 300) + 10
          }
        });
      }
    }
    console.log(`  ✅ Created product views`);
    
    // Service Views
    for (const service of services) {
      const numViews = Math.floor(Math.random() * 10) + 3;
      for (let i = 0; i < numViews; i++) {
        const user = Math.random() > 0.5 ? users[Math.floor(Math.random() * users.length)] : null;
        await prisma.serviceView.create({
          data: {
            serviceId: service.id,
            userId: user?.id,
            timestamp: randomPastDate(30),
            duration: Math.floor(Math.random() * 180) + 5
          }
        });
      }
    }
    console.log(`  ✅ Created service views`);
    
    // Search Queries
    const searchTerms = [
      'loa karaoke', 'loa bluetooth', 'micro không dây', 'amply', 'soundbar',
      'tai nghe', 'loa JBL', 'loa Sony', 'dịch vụ lắp đặt', 'sửa chữa loa',
      'bảo trì âm thanh', 'tư vấn âm học', 'phòng thu', 'mixer', 'loa bass'
    ];
    
    for (let i = 0; i < 30; i++) {
      const user = Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)] : null;
      await prisma.searchQuery.create({
        data: {
          query: searchTerms[Math.floor(Math.random() * searchTerms.length)],
          userId: user?.id,
          timestamp: randomPastDate(30)
        }
      });
    }
    console.log(`  ✅ Created search queries`);
    
    // Activity Logs
    const actions = ['LOGIN', 'LOGOUT', 'VIEW_PRODUCT', 'ADD_TO_CART', 'CHECKOUT', 'UPDATE_PROFILE'];
    for (let i = 0; i < 100; i++) {
      const user = Math.random() > 0.2 ? users[Math.floor(Math.random() * users.length)] : null;
      await prisma.activityLog.create({
        data: {
          userId: user?.id,
          action: actions[Math.floor(Math.random() * actions.length)],
          resource: ['products', 'orders', 'users', 'services'][Math.floor(Math.random() * 4)],
          resourceId: Math.random() > 0.5 ? products[Math.floor(Math.random() * products.length)].id : null,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0',
          method: 'GET',
          url: '/api/v1/products',
          statusCode: 200,
          duration: Math.floor(Math.random() * 500) + 50,
          category: 'user_activity',
          severity: 'info',
          createdAt: randomPastDate(30)
        }
      });
    }
    console.log(`  ✅ Created activity logs`);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedData();
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
