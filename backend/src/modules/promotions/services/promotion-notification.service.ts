import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export enum NotificationType {
  NEW_PROMOTION = 'NEW_PROMOTION',
  PROMOTION_EXPIRING = 'PROMOTION_EXPIRING',
  PERSONALIZED_OFFER = 'PERSONALIZED_OFFER',
  FLASH_SALE = 'FLASH_SALE',
  REMINDER = 'REMINDER',
}

export interface NotificationTemplate {
  type: NotificationType;
  channel: NotificationChannel;
  subject?: string;
  title?: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  metadata?: Record<string, any>;
}

export interface CustomerNotification {
  userId: string;
  promotionId: string;
  channels: NotificationChannel[];
  template: NotificationTemplate;
  scheduledFor?: Date;
  sentAt?: Date;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'SCHEDULED';
  metadata?: Record<string, any>;
}

@Injectable()
export class PromotionNotificationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Send promotion notification to user
   */
  async sendNotification(
    userId: string,
    promotionId: string,
    template: NotificationTemplate,
    channels: NotificationChannel[] = [NotificationChannel.EMAIL],
  ): Promise<{ success: boolean; notificationId?: string; message: string }> {
    try {
      const promotion = await this.prisma.promotions.findUnique({
        where: { id: promotionId },
      });

      if (!promotion) {
        return { success: false, message: 'Promotion not found' };
      }

      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const notificationId = uuidv4();

      // Store notification record
      await this.storeNotification({
        id: notificationId,
        userId,
        promotionId,
        channels,
        template,
        status: 'PENDING',
      });

      // Send through each channel
      const results = await Promise.allSettled(
        channels.map(channel => this.sendViaChannel(channel, user, promotion, template)),
      );

      const allSucceeded = results.every(r => r.status === 'fulfilled');

      // Update notification status
      await this.updateNotificationStatus(notificationId, allSucceeded ? 'SENT' : 'FAILED');

      return {
        success: allSucceeded,
        notificationId,
        message: allSucceeded ? 'Notification sent successfully' : 'Notification partially sent',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to send notification',
      };
    }
  }

  /**
   * Send promotional notifications to user segment
   */
  async sendToSegment(
    segment: string,
    promotionId: string,
    template: NotificationTemplate,
    channels: NotificationChannel[] = [NotificationChannel.EMAIL],
  ): Promise<{ sent: number; failed: number }> {
    const promotion = await this.prisma.promotions.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new Error('Promotion not found');
    }

    // Get users in segment - customize based on your segment logic
    const users = await this.prisma.users.findMany({
      where: {
        role: 'USER',
        // Add segment filtering based on your business logic
      },
      select: { id: true },
    });

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      const result = await this.sendNotification(user.id, promotionId, template, channels);

      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    return { sent, failed };
  }

  /**
   * Schedule notification for later
   */
  async scheduleNotification(
    userId: string,
    promotionId: string,
    template: NotificationTemplate,
    scheduledFor: Date,
    channels: NotificationChannel[] = [NotificationChannel.EMAIL],
  ): Promise<{ success: boolean; notificationId?: string }> {
    const notificationId = uuidv4();

    await this.storeNotification({
      id: notificationId,
      userId,
      promotionId,
      channels,
      template,
      scheduledFor,
      status: 'SCHEDULED',
    });

    return {
      success: true,
      notificationId,
    };
  }

  /**
   * Send expiring promotion reminder
   */
  async sendExpiringReminder(
    promotionId: string,
    daysBeforeExpiry: number = 1,
  ): Promise<{ sent: number; failed: number }> {
    const promotion = await this.prisma.promotions.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new Error('Promotion not found');
    }

    // Find users who have used this promotion
    // TODO: customer_promotions table does not exist
    const usersWhoUsed: any[] = [];
    // const usersWhoUsed = await this.prisma.customer_promotions.findMany({
    //   where: {
    //     promotionId,
    //     status: 'APPLIED',
    //   },
    //   distinct: ['userId'],
    //   select: { userId: true },
    // });

    const template: NotificationTemplate = {
      type: NotificationType.PROMOTION_EXPIRING,
      channel: NotificationChannel.EMAIL,
      subject: `⏰ Your promotion "${promotion.name}" expires soon!`,
      title: `Promotion Expiring Soon`,
      body: `Your discount code "${promotion.code}" expires in ${daysBeforeExpiry} day(s). Use it now to save!`,
      ctaText: 'Shop Now',
      ctaUrl: `/products?promo=${promotion.code}`,
      metadata: {
        promotionCode: promotion.code,
        expiresAt: promotion.expiresAt,
      },
    };

    let sent = 0;
    let failed = 0;

    for (const { userId } of usersWhoUsed) {
      const result = await this.sendNotification(userId, promotionId, template, [
        NotificationChannel.EMAIL,
      ]);

      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    return { sent, failed };
  }

  /**
   * Send personalized promotion recommendations
   */
  async sendPersonalizedOffers(
    userId: string,
    promotions: any[],
  ): Promise<{ success: boolean; notificationId?: string }> {
    const recommendedCodes = promotions.map(p => p.code).join(', ');

    const template: NotificationTemplate = {
      type: NotificationType.PERSONALIZED_OFFER,
      channel: NotificationChannel.EMAIL,
      subject: '🎁 Exclusive offers just for you!',
      title: 'Personalized Recommendations',
      body: `Based on your shopping history, we have ${promotions.length} special offers for you: ${recommendedCodes}`,
      ctaText: 'View Offers',
      ctaUrl: '/promotions',
      metadata: {
        promotionIds: promotions.map(p => p.id),
        count: promotions.length,
      },
    };

    return this.sendNotification(userId, promotions[0]?.id || '', template, [
      NotificationChannel.EMAIL,
    ]);
  }

  /**
   * Send flash sale notification
   */
  async sendFlashSaleAlert(
    promotionId: string,
    expiresIn: number, // in hours
  ): Promise<{ sent: number; failed: number }> {
    const promotion = await this.prisma.promotions.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new Error('Promotion not found');
    }

    const template: NotificationTemplate = {
      type: NotificationType.FLASH_SALE,
      channel: NotificationChannel.PUSH,
      title: '⚡ Flash Sale Alert!',
      body: `${promotion.name} is on sale for only ${expiresIn} hour(s)!`,
      ctaText: 'Shop Now',
      ctaUrl: `/promotions/${promotionId}`,
      metadata: {
        promotionCode: promotion.code,
        expiresInHours: expiresIn,
        urgency: 'HIGH',
      },
    };

    // Send to all active users
    const activeUsers = await this.prisma.users.findMany({
      where: { role: 'USER' },
      select: { id: true },
    });

    let sent = 0;
    let failed = 0;

    for (const user of activeUsers) {
      const result = await this.sendNotification(user.id, promotionId, template, [
        NotificationChannel.PUSH,
        NotificationChannel.EMAIL,
      ]);

      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    return { sent, failed };
  }

  /**
   * Get notification templates
   */
  getNotificationTemplates(): Record<NotificationType, NotificationTemplate> {
    return {
      [NotificationType.NEW_PROMOTION]: {
        type: NotificationType.NEW_PROMOTION,
        channel: NotificationChannel.EMAIL,
        subject: '🎉 New Promotion Available!',
        title: 'Check Out Our New Offer',
        body: 'We have a new promotion just for you. Save on your next purchase!',
        ctaText: 'View Promotion',
        ctaUrl: '/promotions',
      },
      [NotificationType.PROMOTION_EXPIRING]: {
        type: NotificationType.PROMOTION_EXPIRING,
        channel: NotificationChannel.EMAIL,
        subject: '⏰ Your promotion expires soon!',
        title: 'Limited Time Offer',
        body: "Your exclusive discount is expiring soon. Use it before it's gone!",
        ctaText: 'Use Now',
        ctaUrl: '/cart',
      },
      [NotificationType.PERSONALIZED_OFFER]: {
        type: NotificationType.PERSONALIZED_OFFER,
        channel: NotificationChannel.EMAIL,
        subject: '🎁 Special Offers for You',
        title: 'Personalized Recommendations',
        body: 'Based on your shopping history, we have special offers selected just for you.',
        ctaText: 'View Offers',
        ctaUrl: '/promotions',
      },
      [NotificationType.FLASH_SALE]: {
        type: NotificationType.FLASH_SALE,
        channel: NotificationChannel.PUSH,
        title: '⚡ Flash Sale!',
        body: 'Huge discounts available for a limited time only!',
        ctaText: 'Shop Now',
        ctaUrl: '/products',
      },
      [NotificationType.REMINDER]: {
        type: NotificationType.REMINDER,
        channel: NotificationChannel.EMAIL,
        subject: "💡 Don't forget your savings!",
        title: 'Promotion Reminder',
        body: "Remind me about a promotion you're interested in.",
        ctaText: 'View Promotion',
        ctaUrl: '/promotions',
      },
    };
  }

  /**
   * Get notification history for user
   */
  async getNotificationHistory(userId: string, limit: number = 50): Promise<any[]> {
    // This would query from a notifications table if it exists
    // For now, returning a placeholder
    return [];
  }

  /**
   * Update user notification preferences
   */
  async updateNotificationPreferences(
    userId: string,
    preferences: {
      emailNotifications?: boolean;
      smsNotifications?: boolean;
      pushNotifications?: boolean;
      promotionEmails?: boolean;
    },
  ): Promise<boolean> {
    // This would update user preferences in a separate table
    // For now, storing in user metadata
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return false;
    }

    // Update would happen here if we have a preferences table
    return true;
  }

  /**
   * Private helper methods
   */

  private async sendViaChannel(
    channel: NotificationChannel,
    user: any,
    promotion: any,
    template: NotificationTemplate,
  ): Promise<boolean> {
    try {
      switch (channel) {
        case NotificationChannel.EMAIL:
          return await this.sendEmail(user, promotion, template);
        case NotificationChannel.SMS:
          return await this.sendSMS(user, promotion, template);
        case NotificationChannel.PUSH:
          return await this.sendPushNotification(user, promotion, template);
        case NotificationChannel.IN_APP:
          return await this.sendInAppNotification(user, promotion, template);
        default:
          return false;
      }
    } catch (error) {
      console.error(`Failed to send ${channel} notification:`, error);
      return false;
    }
  }

  private async sendEmail(
    user: any,
    promotion: any,
    template: NotificationTemplate,
  ): Promise<boolean> {
    // Integration with email service (SendGrid, AWS SES, etc.)
    // Placeholder implementation
    console.log(`Sending email to ${user.email}:`, template.subject);
    return true;
  }

  private async sendSMS(
    user: any,
    promotion: any,
    template: NotificationTemplate,
  ): Promise<boolean> {
    // Integration with SMS service (Twilio, AWS SNS, etc.)
    // Placeholder implementation
    console.log(`Sending SMS to ${user.phone}:`, template.body);
    return true;
  }

  private async sendPushNotification(
    user: any,
    promotion: any,
    template: NotificationTemplate,
  ): Promise<boolean> {
    // Integration with push notification service (Firebase, etc.)
    // Placeholder implementation
    console.log(`Sending push to user ${user.id}:`, template.title);
    return true;
  }

  private async sendInAppNotification(
    user: any,
    promotion: any,
    template: NotificationTemplate,
  ): Promise<boolean> {
    // Store in-app notification in database
    // Placeholder implementation
    console.log(`Creating in-app notification for user ${user.id}`);
    return true;
  }

  private async storeNotification(data: {
    id: string;
    userId: string;
    promotionId: string;
    channels: NotificationChannel[];
    template: NotificationTemplate;
    scheduledFor?: Date;
    status: string;
  }): Promise<void> {
    // Store notification record (would need notifications table)
    console.log('Storing notification record:', data.id);
  }

  private async updateNotificationStatus(notificationId: string, status: string): Promise<void> {
    // Update notification status
    console.log(`Updated notification ${notificationId} to status: ${status}`);
  }
}
