import { Test, TestingModule } from '@nestjs/testing';
import { TelegramService } from '../src/modules/notifications/telegram.service';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
    const logger = new Logger('TelegramTest');

    try {
        logger.log('Initializing standalone TelegramService...');
        const module: TestingModule = await Test.createTestingModule({
            providers: [TelegramService],
        }).compile();

        const telegramService = module.get<TelegramService>(TelegramService);

        logger.log('Checking Telegram connection...');
        const connection = await telegramService.testConnection();
        if (!connection.success) {
            logger.error(`Connection failed: ${connection.message}`);
            process.exit(1);
        }
        logger.log(`Connected to bot: ${connection.botInfo.first_name} (@${connection.botInfo.username})`);

        // 1. Test Order Notification
        logger.log('Testing Order Notification...');
        await telegramService.sendOrderNotification({
            id: 'test-order-id',
            orderNumber: 'TEST-ORD-001',
            customerName: 'Nguyen Van Test',
            customerEmail: 'test@example.com',
            customerPhone: '0901234567',
            totalAmount: 15000000,
            status: 'PENDING',
            createdAt: new Date(),
            items: [
                { productName: 'Loa Karaoke JBL', quantity: 2 },
                { productName: 'Amply Jarguar', quantity: 1 }
            ],
            shippingAddress: '123 Test Street, HCM'
        });

        // 2. Test Booking Notification
        logger.log('Testing Booking Notification...');
        await telegramService.sendBookingNotification({
            id: 'test-booking-id',
            customerName: 'Tran Thi Test',
            customerEmail: 'booking@example.com',
            customerPhone: '0909876543',
            serviceName: 'Lắp đặt dàn karaoke gia đình',
            scheduledTime: new Date(Date.now() + 86400000), // Tomorrow
            technicianName: 'Ky Thuat Vien A',
            estimatedCost: 500000,
            status: 'PENDING'
        });

        // 3. Test Booking Status Update
        logger.log('Testing Booking Status Update...');
        await telegramService.sendBookingStatusUpdate({
            id: 'test-booking-id',
            customerName: 'Tran Thi Test',
            serviceName: 'Lắp đặt dàn karaoke gia đình'
        }, 'PENDING', 'CONFIRMED');

        // 4. Test Review Notification
        logger.log('Testing Review Notification...');
        await telegramService.sendNewReviewNotification({
            productName: 'Micro Shure UGX',
            userName: 'Le Van Review',
            rating: 5,
            comment: 'Sản phẩm rất tốt, giao hàng nhanh!',
            createdAt: new Date()
        });

        // 5. Test Low Stock Alert
        logger.log('Testing Low Stock Alert...');
        await telegramService.sendLowStockAlert({
            name: 'Dây tín hiệu Audioquest',
            sku: 'CABLE-001',
            stock: 2,
            inventory: { stock: 2 }
        });

        // 6. Test Refund Notification
        logger.log('Testing Refund Notification...');
        await telegramService.sendRefundNotification({
            orderNo: 'TEST-ORD-001',
            amountCents: 500000,
            provider: 'MOMO',
            reason: 'Khách hàng đổi ý',
            createdAt: new Date()
        });

        // 7. Test Critical Alert
        logger.log('Testing Critical Alert...');
        await telegramService.sendCriticalAlert(
            'Database Connection High Latency',
            'Latency > 1000ms detected on primary node.'
        );

        // 8. Test Chat Message Notification
        logger.log('Testing Chat Message Notification...');
        await telegramService.sendChatMessageNotification(
            'Nguyen Van A',
            'Tôi muốn tư vấn về dàn karaoke gia đình tầm 20 triệu',
            'conv-123456'
        );

        console.log('✅ All test notifications sent successfully!');
        process.exit(0);

    } catch (error) {
        logger.error('Test failed:', error);
        process.exit(1);
    }
}

bootstrap();
