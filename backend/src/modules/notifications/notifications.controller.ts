import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(@Query() query: { userId?: string; read?: string; page?: string; limit?: string }) {
    const userId = query.userId || '';
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 20;
    const read = typeof query.read === 'string' ? query.read === 'true' : undefined;
    if (!userId) {
      return { notifications: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }
    return this.notificationService.listNotifications(userId, { read, page, limit });
  }

  @Get('settings')
  async getNotificationSettings(@Query('userId') _userId?: string) {
    return {
      email: {
        enabled: true,
        types: ['booking_confirmation', 'payment_success', 'system_updates']
      },
      sms: {
        enabled: false,
        types: ['booking_reminder']
      },
      push: {
        enabled: true,
        types: ['booking_updates', 'promotions']
      }
    };
  }

  @Post('subscribe')
  async subscribeToNotifications(@Body() _data: {
    userId: string;
    type: string;
    channel: 'email' | 'sms' | 'push';
  }) {
    return {
      success: true,
      message: 'Successfully subscribed to notifications'
    };
  }

  @Post('unsubscribe')
  async unsubscribeFromNotifications(@Body() _data: {
    userId: string;
    type: string;
    channel: 'email' | 'sms' | 'push';
  }) {
    return {
      success: true,
      message: 'Successfully unsubscribed from notifications'
    };
  }

  @Post('mark-read')
  async markAsRead(@Body() data: { notificationId: string; userId: string }) {
    const res = await this.notificationService.markAsRead(data.notificationId, data.userId);
    return res;
  }

  @Post('mark-all-read')
  async markAllAsRead(@Body() data: { userId: string }) {
    return this.notificationService.markAllAsRead(data.userId);
  }

  @Get('stats')
  async getStats(@Query('userId') userId?: string) {
    if (!userId) return { total: 0, unread: 0, read: 0, unreadPercentage: 0 };
    return this.notificationService.getNotificationStats(userId);
  }
}
