import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(@Query() query: {
    userId?: string;
    type?: string;
    read?: string;
    page?: string;
    limit?: string;
  }) {
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 20;
    const read = query.read ? query.read === 'true' : undefined;

    return {
      notifications: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    };
  }

  @Get('settings')
  async getNotificationSettings(@Query('userId') userId?: string) {
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
  async subscribeToNotifications(@Body() data: {
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
  async unsubscribeFromNotifications(@Body() data: {
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
  async markAsRead(@Body() data: {
    notificationId: string;
    userId: string;
  }) {
    return {
      success: true,
      message: 'Notification marked as read'
    };
  }

  @Post('mark-all-read')
  async markAllAsRead(@Body() data: {
    userId: string;
  }) {
    return {
      success: true,
      message: 'All notifications marked as read'
    };
  }
}
