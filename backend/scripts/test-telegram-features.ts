import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { TelegramService } from '../src/modules/notifications/telegram.service';

// Load environment variables
dotenv.config();

// Mock dependencies
const mockBackupService = {} as any;
const mockAnalyticsService = {} as any;
const mockMessagesService = {} as any;
const mockCacheService = {} as any;
const mockNotificationGateway = {} as any;
const mockChatService = {} as any;

async function main() {
  console.log('🚀 Starting Telegram Features Test...');

  // Initialize Service manually
  const telegramService = new TelegramService(
    mockBackupService,
    mockAnalyticsService,
    mockMessagesService,
    mockCacheService,
    mockNotificationGateway,
    mockChatService,
  );

  // Check if enabled
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_IDS) {
    console.error('❌ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_IDS');
    return;
  }

  try {
    console.log('1️⃣ Testing Order Notification...');
    await telegramService.sendOrderNotification({
      id: 'test-order-123',
      orderNumber: 'ORD-2025-001',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@example.com',
      customerPhone: '0909123456',
      totalAmount: 15000000, // 15 triệu
      status: 'PENDING',
      createdAt: new Date(),
      items: [
        { productName: 'Loa Marshall Stanmore III', quantity: 1 },
        { productName: 'Cáp Audio Cao Cấp', quantity: 2 }
      ],
      shippingAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM'
    });
    console.log('✅ Order Notification sent.');

    console.log('2️⃣ Testing Order Status Update...');
    await telegramService.sendOrderStatusUpdate(
      {
        id: 'test-order-123',
        orderNumber: 'ORD-2025-001',
        customerName: 'Nguyễn Văn A',
        customerEmail: 'nguyenvana@example.com',
        totalAmount: 15000000,
        status: 'PROCESSING',
        createdAt: new Date(),
      },
      'PENDING',
      'PROCESSING'
    );
    console.log('✅ Status Update sent.');

    console.log('3️⃣ Testing New Review...');
    await telegramService.sendNewReviewNotification({
      productName: 'Loa Marshall Stanmore III',
      userName: 'Trần Thị B',
      rating: 5,
      comment: 'Sản phẩm nghe rất hay, bass ấm, giao hàng nhanh!',
      createdAt: new Date()
    });
    console.log('✅ Review Notification sent.');

    console.log('4️⃣ Testing Low Stock Alert...');
    await telegramService.sendLowStockAlert({
      name: 'Tai nghe Sony WH-1000XM5',
      sku: 'SN-WH1000XM5-BLK',
      stock: 2,
      inventory: { stock: 2 }
    });
    console.log('✅ Low Stock Alert sent.');

    console.log('5️⃣ Testing System Alert...');
    await telegramService.sendSystemAlert(
      'Server High CPU Usage',
      'CPU usage has exceeded 90% for the last 5 minutes.'
    );
    console.log('✅ System Alert sent.');

    console.log('--------------------------------------------------');
    console.log('🎉 All notifications sent! Please check your Telegram.');
    console.log('--------------------------------------------------');

  } catch (error) {
    console.error('❌ Error sending notifications:', error);
  }
}

main();