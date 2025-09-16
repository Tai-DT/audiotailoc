import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from './mail.service';
// import { RealtimeGateway } from '../../websocket/websocket.gateway';

export interface NotificationData {
  userId?: string;
  email?: string;
  phone?: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PAYMENT' | 'PROMOTION' | 'SYSTEM' | 'WELCOME';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  channels: ('EMAIL' | 'SMS' | 'PUSH' | 'WEBSOCKET')[];
  data?: Record<string, any>;
  scheduledAt?: Date;
}

export interface SMSProvider {
  send(to: string, message: string): Promise<boolean>;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    // private readonly websocketGateway: RealtimeGateway
  ) {}

  async sendNotification(data: NotificationData): Promise<void> {
    this.logger.log(`Sending notification: ${data.title} to ${data.userId || data.email}`);

    const results: Record<string, boolean> = {};

    // Send via each requested channel
    for (const channel of data.channels) {
      try {
        switch (channel) {
          case 'EMAIL':
            if (data.email) {
              results.EMAIL = await this.sendEmail(data);
            }
            break;
          case 'SMS':
            if (data.phone) {
              results.SMS = await this.sendSMS(data);
            }
            break;
          case 'PUSH':
            if (data.userId) {
              results.PUSH = await this.sendPushNotification(data);
            }
            break;
          case 'WEBSOCKET':
            if (data.userId) {
              results.WEBSOCKET = await this.sendWebSocketNotification(data);
            }
            break;
        }
      } catch (error) {
        this.logger.error(`Failed to send ${channel} notification:`, error);
        results[channel] = false;
      }
    }

    // Log notification attempt
    await this.logNotification(data, results);
  }

  private async sendEmail(data: NotificationData): Promise<boolean> {
    if (!data.email) return false;

    try {
      switch (data.type) {
        case 'WELCOME':
          await this.mailService.sendWelcomeEmail(data.email, data.title);
          break;
        case 'ORDER':
          if (data.data?.orderData) {
            if (data.data.isConfirmation) {
              await this.mailService.sendOrderConfirmation(data.email, data.data.orderData);
            } else {
              await this.mailService.sendOrderStatusUpdate(data.email, data.data.orderData);
            }
          } else {
            await this.mailService.send(data.email, data.title, data.message);
          }
          break;
        default:
          await this.mailService.send(data.email, data.title, data.message);
      }
      return true;
    } catch (error) {
      this.logger.error('Email sending failed:', error);
      return false;
    }
  }

  private async sendSMS(data: NotificationData): Promise<boolean> {
    if (!data.phone) return false;

    // SMS implementation would go here
    // For now, just log the attempt
    this.logger.log(`SMS would be sent to ${data.phone}: ${data.message}`);
    
    // In a real implementation, you would integrate with SMS providers like:
    // - Twilio
    // - AWS SNS
    // - Vietnamese SMS providers like VIETGUYS, SPEEDSMS, etc.
    
    return true;
  }

  private async sendPushNotification(data: NotificationData): Promise<boolean> {
    if (!data.userId) return false;

    // Push notification implementation would go here
    // For now, just log the attempt
    this.logger.log(`Push notification would be sent to user ${data.userId}: ${data.message}`);
    
    // In a real implementation, you would integrate with:
    // - Firebase Cloud Messaging (FCM)
    // - Apple Push Notification Service (APNs)
    // - Web Push API
    
    return true;
  }

  private async sendWebSocketNotification(data: NotificationData): Promise<boolean> {
    if (!data.userId) return false;

    try {
      // this.websocketGateway.sendNotification(data.userId, {
      //   title: data.title,
      //   message: data.message,
      //   type: data.type.toLowerCase(),
      //   priority: data.priority.toLowerCase(),
      //   data: data.data
      // });
      this.logger.log(`WebSocket notification would be sent to user ${data.userId}: ${data.title}`);
      return true;
    } catch (error) {
      this.logger.error('WebSocket notification failed:', error);
      return false;
    }
  }

  private async logNotification(data: NotificationData, results: Record<string, boolean>): Promise<void> {
    try {
      // In a real implementation, you would log to database
      // For now, just log to console
      this.logger.log(`Notification sent - Success: ${JSON.stringify(results)}`);
      
      // Example database logging (commented out as we don't have the table):
      /*
      await this.prisma.notificationLog.create({
        data: {
          userId: data.userId,
          email: data.email,
          phone: data.phone,
          title: data.title,
          message: data.message,
          type: data.type,
          priority: data.priority,
          channels: data.channels,
          results: results,
          sentAt: new Date()
        }
      });
      */
    } catch (error) {
      this.logger.error('Failed to log notification:', error);
    }
  }

  // Convenience methods for common notification types
  async sendOrderConfirmation(userId: string, email: string, orderData: any): Promise<void> {
    await this.sendNotification({
      userId,
      email,
      title: `Xác nhận đơn hàng #${orderData.orderNo}`,
      message: `Đơn hàng của bạn đã được xác nhận và đang được xử lý.`,
      type: 'ORDER',
      priority: 'HIGH',
      channels: ['EMAIL', 'WEBSOCKET'],
      data: { orderData, isConfirmation: true }
    });
  }

  async sendOrderStatusUpdate(userId: string, email: string, orderData: any): Promise<void> {
    await this.sendNotification({
      userId,
      email,
      title: `Cập nhật đơn hàng #${orderData.orderNo}`,
      message: `Đơn hàng của bạn đã chuyển sang trạng thái ${orderData.status}.`,
      type: 'ORDER',
      priority: 'MEDIUM',
      channels: ['EMAIL', 'WEBSOCKET'],
      data: { orderData, isConfirmation: false }
    });
  }

  async sendWelcomeNotification(userId: string, email: string, customerName: string): Promise<void> {
    await this.sendNotification({
      userId,
      email,
      title: customerName,
      message: 'Chào mừng bạn đến với Audio Tài Lộc!',
      type: 'WELCOME',
      priority: 'LOW',
      channels: ['EMAIL'],
      data: { customerName }
    });
  }

  async sendPromotionNotification(userId: string, email: string, promotion: any): Promise<void> {
    await this.sendNotification({
      userId,
      email,
      title: promotion.title,
      message: promotion.description,
      type: 'PROMOTION',
      priority: 'MEDIUM',
      channels: ['EMAIL', 'WEBSOCKET'],
      data: { promotion }
    });
  }

  async sendSystemNotification(message: string, _priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM'): Promise<void> {
    // Broadcast to all connected users
    // this.websocketGateway.broadcastAnnouncement(message, priority === 'URGENT' ? 'warning' : 'info');
    
    this.logger.log(`System notification would be broadcasted: ${message}`);
  }

  // Bulk notification methods
  async sendBulkNotification(userIds: string[], data: Omit<NotificationData, 'userId'>): Promise<void> {
    const promises = userIds.map(async (userId) => {
      // Get user email from database
      const user = await this.prisma.user.findUnique({ 
        where: { id: userId },
        select: { email: true, phone: true }
      });

      if (user) {
        await this.sendNotification({
          ...data,
          userId,
          email: user.email,
          phone: user.phone || undefined
        });
      }
    });

    await Promise.allSettled(promises);
    this.logger.log(`Bulk notification sent to ${userIds.length} users`);
  }

  // Marketing email methods
  async sendMarketingEmail(emails: string[], subject: string, htmlContent: string, textContent?: string): Promise<void> {
    const promises = emails.map(email => 
      this.mailService.send(email, subject, textContent || htmlContent, htmlContent)
    );

    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    this.logger.log(`Marketing email sent - Success: ${successful}, Failed: ${failed}`);
  }

  // === Database-backed helpers expected by unit tests ===
  async listNotifications(userId: string, options: { read?: boolean; page?: number; limit?: number } = {}) {
    const page = Math.max(1, Math.floor(options.page ?? 1));
    const limit = Math.min(100, Math.max(1, Math.floor(options.limit ?? 20)));
    const where: any = { userId };
    if (typeof options.read === 'boolean') where.read = options.read;

    const [items, total] = await Promise.all([
      (this.prisma as any).notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      (this.prisma as any).notification.count({ where }),
    ]);

    return {
      notifications: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async createNotification(notification: {
    userId: string;
    type: 'ORDER' | 'PAYMENT' | 'PROMOTION' | 'SYSTEM' | 'WELCOME';
    title: string;
    message: string;
    data?: Record<string, any>;
  }) {
    return (this.prisma as any).notification.create({
      data: {
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        read: false,
      },
    });
  }

  async getPendingNotifications(userId: string) {
    return (this.prisma as any).notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return (this.prisma as any).notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return (this.prisma as any).notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() },
    });
  }

  async getNotificationStats(userId: string) {
    const total = await (this.prisma as any).notification.count({ where: { userId } });
    const unread = await (this.prisma as any).notification.count({ where: { userId, read: false } });
    const read = await (this.prisma as any).notification.count({ where: { userId, read: true } });
    const unreadPercentage = total > 0 ? Math.round((unread / total) * 100) : 0;
    return { total, unread, read, unreadPercentage };
  }
}
