import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../../src/modules/notifications/notification.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../src/modules/notifications/mail.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let prismaService: PrismaService;
  let mailService: MailService;

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockMailService = {
    send: jest.fn(),
    sendWelcomeEmail: jest.fn(),
    sendOrderConfirmation: jest.fn(),
    sendOrderStatusUpdate: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prismaService = module.get<PrismaService>(PrismaService);
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendNotification', () => {
    it('should send email notification successfully', async () => {
      const notificationData = {
        email: 'test@example.com',
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'SYSTEM' as const,
        priority: 'MEDIUM' as const,
        channels: ['EMAIL'] as ('EMAIL' | 'SMS' | 'PUSH' | 'WEBSOCKET')[],
      };

      mockMailService.send.mockResolvedValue(undefined);

      await service.sendNotification(notificationData);

      expect(mockMailService.send).toHaveBeenCalledWith(
        notificationData.email,
        notificationData.title,
        notificationData.message
      );
    });

    it('should send welcome email notification', async () => {
      const notificationData = {
        email: 'test@example.com',
        title: 'Welcome',
        message: 'Welcome to Audio Tài Lộc!',
        type: 'WELCOME' as const,
        priority: 'LOW' as const,
        channels: ['EMAIL'] as ('EMAIL' | 'SMS' | 'PUSH' | 'WEBSOCKET')[],
      };

      mockMailService.sendWelcomeEmail.mockResolvedValue(undefined);

      await service.sendNotification(notificationData);

      expect(mockMailService.sendWelcomeEmail).toHaveBeenCalledWith(
        notificationData.email,
        notificationData.title
      );
    });

    it('should send order confirmation email', async () => {
      const orderData = { orderNo: 'ORD_123', status: 'CONFIRMED' };
      const notificationData = {
        email: 'test@example.com',
        title: 'Order Confirmation',
        message: 'Your order has been confirmed',
        type: 'ORDER' as const,
        priority: 'HIGH' as const,
        channels: ['EMAIL'] as ('EMAIL' | 'SMS' | 'PUSH' | 'WEBSOCKET')[],
        data: { orderData, isConfirmation: true },
      };

      mockMailService.sendOrderConfirmation.mockResolvedValue(undefined);

      await service.sendNotification(notificationData);

      expect(mockMailService.sendOrderConfirmation).toHaveBeenCalledWith(
        notificationData.email,
        orderData
      );
    });

    it('should send order status update email', async () => {
      const orderData = { orderNo: 'ORD_123', status: 'SHIPPED' };
      const notificationData = {
        email: 'test@example.com',
        title: 'Order Update',
        message: 'Your order status has been updated',
        type: 'ORDER' as const,
        priority: 'MEDIUM' as const,
        channels: ['EMAIL'] as ('EMAIL' | 'SMS' | 'PUSH' | 'WEBSOCKET')[],
        data: { orderData, isConfirmation: false },
      };

      mockMailService.sendOrderStatusUpdate.mockResolvedValue(undefined);

      await service.sendNotification(notificationData);

      expect(mockMailService.sendOrderStatusUpdate).toHaveBeenCalledWith(
        notificationData.email,
        orderData
      );
    });

    it('should handle email sending failure', async () => {
      const notificationData = {
        email: 'test@example.com',
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'SYSTEM' as const,
        priority: 'MEDIUM' as const,
        channels: ['EMAIL'] as ('EMAIL' | 'SMS' | 'PUSH' | 'WEBSOCKET')[],
      };

      mockMailService.send.mockRejectedValue(new Error('Email sending failed'));

      await service.sendNotification(notificationData);

      expect(mockMailService.send).toHaveBeenCalled();
    });

    it('should send SMS notification', async () => {
      const notificationData = {
        phone: '0987654321',
        title: 'SMS Test',
        message: 'This is an SMS notification',
        type: 'SYSTEM' as const,
        priority: 'HIGH' as const,
        channels: ['SMS'] as ('EMAIL' | 'SMS' | 'PUSH' | 'WEBSOCKET')[],
      };

      await service.sendNotification(notificationData);

      // SMS is currently just logged, so we just verify it doesn't throw
      expect(true).toBe(true);
    });

    it('should send push notification', async () => {
      const notificationData = {
        userId: 'user_123',
        title: 'Push Test',
        message: 'This is a push notification',
        type: 'SYSTEM' as const,
        priority: 'HIGH' as const,
        channels: ['PUSH'] as ('EMAIL' | 'SMS' | 'PUSH' | 'WEBSOCKET')[],
      };

      await service.sendNotification(notificationData);

      // Push notification is currently just logged
      expect(true).toBe(true);
    });

    it('should send websocket notification', async () => {
      const notificationData = {
        userId: 'user_123',
        title: 'WebSocket Test',
        message: 'This is a websocket notification',
        type: 'SYSTEM' as const,
        priority: 'MEDIUM' as const,
        channels: ['WEBSOCKET'] as ('EMAIL' | 'SMS' | 'PUSH' | 'WEBSOCKET')[],
      };

      await service.sendNotification(notificationData);

      // WebSocket notification is currently just logged
      expect(true).toBe(true);
    });
  });

  describe('sendOrderConfirmation', () => {
    it('should send order confirmation notification', async () => {
      const userId = 'user_123';
      const email = 'test@example.com';
      const orderData = { orderNo: 'ORD_123', status: 'CONFIRMED' };

      mockMailService.sendOrderConfirmation.mockResolvedValue(undefined);

      await service.sendOrderConfirmation(userId, email, orderData);

      expect(mockMailService.sendOrderConfirmation).toHaveBeenCalledWith(email, orderData);
    });
  });

  describe('sendOrderStatusUpdate', () => {
    it('should send order status update notification', async () => {
      const userId = 'user_123';
      const email = 'test@example.com';
      const orderData = { orderNo: 'ORD_123', status: 'SHIPPED' };

      mockMailService.sendOrderStatusUpdate.mockResolvedValue(undefined);

      await service.sendOrderStatusUpdate(userId, email, orderData);

      expect(mockMailService.sendOrderStatusUpdate).toHaveBeenCalledWith(email, orderData);
    });
  });

  describe('sendWelcomeNotification', () => {
    it('should send welcome notification', async () => {
      const userId = 'user_123';
      const email = 'test@example.com';
      const customerName = 'John Doe';

      mockMailService.sendWelcomeEmail.mockResolvedValue(undefined);

      await service.sendWelcomeNotification(userId, email, customerName);

      expect(mockMailService.sendWelcomeEmail).toHaveBeenCalledWith(email, customerName);
    });
  });

  describe('sendPromotionNotification', () => {
    it('should send promotion notification', async () => {
      const userId = 'user_123';
      const email = 'test@example.com';
      const promotion = {
        title: 'Summer Sale',
        description: 'Get 20% off on all products',
      };

      mockMailService.send.mockResolvedValue(undefined);

      await service.sendPromotionNotification(userId, email, promotion);

      expect(mockMailService.send).toHaveBeenCalledWith(
        email,
        promotion.title,
        promotion.description
      );
    });
  });

  describe('sendSystemNotification', () => {
    it('should send system notification', async () => {
      const message = 'System maintenance scheduled';

      await service.sendSystemNotification(message, 'HIGH');

      // System notification is currently just logged
      expect(true).toBe(true);
    });
  });

  describe('sendBulkNotification', () => {
    it('should send bulk notification to multiple users', async () => {
      const userIds = ['user_1', 'user_2', 'user_3'];
      const notificationData = {
        title: 'Bulk Test',
        message: 'This is a bulk notification',
        type: 'SYSTEM' as const,
        priority: 'MEDIUM' as const,
        channels: ['EMAIL'] as ('EMAIL' | 'SMS' | 'PUSH' | 'WEBSOCKET')[],
      };

      const mockUsers = [
        { email: 'user1@example.com', phone: '0987654321' },
        { email: 'user2@example.com', phone: null },
        { email: 'user3@example.com', phone: '0987654322' },
      ];

      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(mockUsers[0])
        .mockResolvedValueOnce(mockUsers[1])
        .mockResolvedValueOnce(mockUsers[2]);

      mockMailService.send.mockResolvedValue(undefined);

      await service.sendBulkNotification(userIds, notificationData);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(3);
      expect(mockMailService.send).toHaveBeenCalledTimes(3);
    });
  });

  describe('sendMarketingEmail', () => {
    it('should send marketing email to multiple recipients', async () => {
      const emails = ['user1@example.com', 'user2@example.com'];
      const subject = 'Special Offer';
      const htmlContent = '<h1>Special Offer</h1><p>Get 50% off!</p>';
      const textContent = 'Special Offer - Get 50% off!';

      mockMailService.send.mockResolvedValue(undefined);

      await service.sendMarketingEmail(emails, subject, htmlContent, textContent);

      expect(mockMailService.send).toHaveBeenCalledTimes(2);
      expect(mockMailService.send).toHaveBeenCalledWith(
        emails[0],
        subject,
        textContent,
        htmlContent
      );
      expect(mockMailService.send).toHaveBeenCalledWith(
        emails[1],
        subject,
        textContent,
        htmlContent
      );
    });

    it('should handle marketing email failures', async () => {
      const emails = ['user1@example.com', 'user2@example.com'];
      const subject = 'Special Offer';
      const htmlContent = '<h1>Special Offer</h1>';

      mockMailService.send
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Email failed'));

      await service.sendMarketingEmail(emails, subject, htmlContent);

      expect(mockMailService.send).toHaveBeenCalledTimes(2);
    });
  });

  describe('createNotification', () => {
    it('should create notification in database', async () => {
      const notificationData = {
        userId: 'user_123',
        type: 'ORDER' as const,
        title: 'Order Confirmed',
        message: 'Your order has been confirmed',
        data: { orderNo: 'ORD_123' },
      };

      const mockNotification = {
        id: 'notification_123',
        ...notificationData,
        read: false,
        createdAt: new Date(),
      };

      mockPrismaService.notification.create.mockResolvedValue(mockNotification);

      const result = await service.createNotification(notificationData);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: notificationData.userId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data,
          read: false,
        },
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('getPendingNotifications', () => {
    it('should get pending notifications for user', async () => {
      const userId = 'user_123';
      const mockNotifications = [
        {
          id: 'notification_1',
          userId,
          title: 'Notification 1',
          message: 'Message 1',
          read: false,
          createdAt: new Date(),
        },
        {
          id: 'notification_2',
          userId,
          title: 'Notification 2',
          message: 'Message 2',
          read: false,
          createdAt: new Date(),
        },
      ];

      mockPrismaService.notification.findMany.mockResolvedValue(mockNotifications);

      const result = await service.getPendingNotifications(userId);

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          read: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      });
      expect(result).toEqual(mockNotifications);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notificationId = 'notification_123';
      const userId = 'user_123';

      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.markAsRead(notificationId, userId);

      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: {
          id: notificationId,
          userId,
        },
        data: {
          read: true,
          readAt: expect.any(Date),
        },
      });
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read for user', async () => {
      const userId = 'user_123';

      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllAsRead(userId);

      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
          readAt: expect.any(Date),
        },
      });
      expect(result).toEqual({ count: 5 });
    });
  });

  describe('getNotificationStats', () => {
    it('should get notification statistics for user', async () => {
      const userId = 'user_123';

      mockPrismaService.notification.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(3)  // unread
        .mockResolvedValueOnce(7); // read

      const result = await service.getNotificationStats(userId);

      expect(mockPrismaService.notification.count).toHaveBeenCalledTimes(3);
      expect(result).toEqual({
        total: 10,
        unread: 3,
        read: 7,
        unreadPercentage: 30,
      });
    });

    it('should handle zero notifications', async () => {
      const userId = 'user_123';

      mockPrismaService.notification.count
        .mockResolvedValueOnce(0) // total
        .mockResolvedValueOnce(0) // unread
        .mockResolvedValueOnce(0); // read

      const result = await service.getNotificationStats(userId);

      expect(result).toEqual({
        total: 0,
        unread: 0,
        read: 0,
        unreadPercentage: 0,
      });
    });
  });
});
