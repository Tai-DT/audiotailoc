import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../../notifications/mail.service';

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
}

export interface NotificationData {
  id?: string;
  type: NotificationType;
  status?: NotificationStatus;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientUserId?: string;
  subject?: string;
  title?: string;
  message: string;
  templateId?: string;
  variables?: Record<string, any>;
  campaignId?: string;
  promotionId?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  retryCount?: number;
  maxRetries?: number;
  metadata?: Record<string, any>;
}

export interface NotificationResult {
  id: string;
  status: NotificationStatus;
  timestamp: Date;
  message?: string;
}

export interface NotificationBatch {
  campaignId: string;
  promotionId?: string;
  recipients: Array<{
    email?: string;
    phone?: string;
    userId?: string;
    variables?: Record<string, any>;
  }>;
  template: string;
  type: NotificationType;
}

@Injectable()
export class PromotionNotificationEnhancedService {
  private readonly logger = new Logger(PromotionNotificationEnhancedService.name);
  private notificationQueue: NotificationData[] = [];

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  /**
   * Send a single notification
   */
  async sendNotification(data: NotificationData): Promise<NotificationResult> {
    try {
      const notification = await this.createNotificationRecord(data);

      switch (data.type) {
        case NotificationType.EMAIL:
          return await this.sendEmailNotification(notification);
        case NotificationType.SMS:
          return await this.sendSmsNotification(notification);
        case NotificationType.PUSH:
          return await this.sendPushNotification(notification);
        case NotificationType.IN_APP:
          return await this.sendInAppNotification(notification);
        default:
          throw new BadRequestException(`Unknown notification type: ${data.type}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to send notification: ${(error as any).message}`,
        (error as any).stack,
      );
      throw new BadRequestException(`Failed to send notification: ${(error as any).message}`);
    }
  }

  /**
   * Send batch notifications to multiple recipients
   */
  async sendBatchNotifications(batch: NotificationBatch): Promise<{
    total: number;
    success: number;
    failed: number;
    results: NotificationResult[];
  }> {
    try {
      const results: NotificationResult[] = [];
      let success = 0;
      let failed = 0;

      for (const recipient of batch.recipients) {
        try {
          const notificationData: NotificationData = {
            type: batch.type,
            message: batch.template,
            recipientEmail: recipient.email,
            recipientPhone: recipient.phone,
            recipientUserId: recipient.userId,
            campaignId: batch.campaignId,
            promotionId: batch.promotionId,
            variables: recipient.variables,
          };

          const result = await this.sendNotification(notificationData);
          results.push(result);
          success++;
        } catch (error) {
          this.logger.error(`Failed to send to recipient: ${(error as any).message}`);
          failed++;
          results.push({
            id: uuidv4(),
            status: NotificationStatus.FAILED,
            timestamp: new Date(),
            message: (error as any).message,
          });
        }
      }

      return {
        total: batch.recipients.length,
        success,
        failed,
        results,
      };
    } catch (error) {
      throw new BadRequestException(`Batch notification failed: ${(error as any).message}`);
    }
  }

  /**
   * Schedule a notification for later
   */
  async scheduleNotification(
    data: NotificationData,
    scheduledTime: Date,
  ): Promise<NotificationResult> {
    try {
      if (scheduledTime <= new Date()) {
        throw new BadRequestException('Scheduled time must be in the future');
      }

      const notification: NotificationData = {
        ...data,
        scheduledAt: scheduledTime,
        status: NotificationStatus.PENDING,
      };

      const record = await this.createNotificationRecord(notification);

      // Schedule for later processing
      this.scheduleNotificationProcessing(record.id, scheduledTime);

      return {
        id: record.id,
        status: NotificationStatus.PENDING,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new BadRequestException(`Failed to schedule notification: ${(error as any).message}`);
    }
  }

  /**
   * Send promotional notification to campaign audience
   */
  async sendCampaignNotification(
    campaignId: string,
    notificationType: NotificationType,
    template: string,
  ): Promise<{
    sent: number;
    failed: number;
    results: NotificationResult[];
  }> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      // Get recipients based on target audience
      const recipients = await this.getTargetAudience(campaign.targetAudience);

      const batchData: NotificationBatch = {
        campaignId,
        template,
        type: notificationType,
        recipients: recipients.map(r => ({
          email: r.email,
          userId: r.id,
        })),
      };

      const result = await this.sendBatchNotifications(batchData);

      return {
        sent: result.success,
        failed: result.failed,
        results: result.results,
      };
    } catch (error) {
      throw new BadRequestException(`Campaign notification failed: ${(error as any).message}`);
    }
  }

  /**
   * Retry failed notifications with exponential backoff
   */
  async retryFailedNotifications(maxRetries: number = 3): Promise<{
    retried: number;
    succeeded: number;
    stillFailed: number;
  }> {
    try {
      const failedNotifications = await this.prisma.email_logs.findMany({
        where: {
          status: 'FAILED',
        },
        take: 100,
      });

      let succeeded = 0;
      let stillFailed = 0;

      for (const notification of failedNotifications) {
        const retryCount = ((notification as any).metadata as any)?.retryCount || 0;

        if (retryCount >= maxRetries) {
          stillFailed++;
          continue;
        }

        try {
          // Exponential backoff wait
          const backoffMs = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, backoffMs));

          // Retry sending
          const notificationData: NotificationData = {
            type: NotificationType.EMAIL,
            recipientEmail: notification.recipientEmail,
            message: notification.subject,
            subject: notification.subject,
            retryCount: retryCount + 1,
            maxRetries,
          };

          await this.sendEmailNotification(notificationData);
          succeeded++;

          // Update status
          await this.prisma.email_logs.update({
            where: { id: notification.id },
            data: {
              status: 'SENT',
              sentAt: new Date(),
            },
          });
        } catch (error) {
          this.logger.error(
            `Retry failed for notification ${notification.id}: ${(error as any).message}`,
          );
          stillFailed++;
        }
      }

      return {
        retried: failedNotifications.length,
        succeeded,
        stillFailed,
      };
    } catch (error) {
      throw new BadRequestException(`Retry operation failed: ${(error as any).message}`);
    }
  }

  /**
   * Get notification history
   */
  async getNotificationHistory(filters?: {
    campaignId?: string;
    promotionId?: string;
    type?: NotificationType;
    status?: NotificationStatus;
    startDate?: Date;
    endDate?: Date;
    skip?: number;
    take?: number;
  }): Promise<{
    notifications: any[];
    total: number;
    stats: {
      sent: number;
      delivered: number;
      failed: number;
      bounced: number;
    };
  }> {
    try {
      const skip = filters?.skip || 0;
      const take = filters?.take || 50;

      const whereCondition: any = {};

      if (filters?.campaignId) {
        whereCondition.campaignId = filters.campaignId;
      }

      if (filters?.status) {
        whereCondition.status = filters.status;
      }

      if (filters?.startDate || filters?.endDate) {
        whereCondition.sentAt = {};
        if (filters?.startDate) whereCondition.sentAt.gte = filters.startDate;
        if (filters?.endDate) whereCondition.sentAt.lte = filters.endDate;
      }

      const [logs, total] = await Promise.all([
        this.prisma.email_logs.findMany({
          where: whereCondition,
          skip,
          take,
          orderBy: { sentAt: 'desc' },
        }),
        this.prisma.email_logs.count({ where: whereCondition }),
      ]);

      // Calculate stats
      const allLogs = await this.prisma.email_logs.findMany({
        where: whereCondition,
        select: { status: true },
      });

      const stats = {
        sent: allLogs.filter(l => l.status === 'SENT').length,
        delivered: allLogs.filter(l => l.status === 'DELIVERED').length,
        failed: allLogs.filter(l => l.status === 'FAILED').length,
        bounced: allLogs.filter(l => l.status === 'BOUNCED').length,
      };

      return {
        notifications: logs,
        total,
        stats,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to get notification history: ${(error as any).message}`,
      );
    }
  }

  /**
   * Track notification delivery
   */
  async trackDelivery(notificationId: string, status: NotificationStatus): Promise<void> {
    try {
      const log = await this.prisma.email_logs.findUnique({
        where: { id: notificationId },
      });

      if (!log) {
        throw new NotFoundException('Notification not found');
      }

      await this.prisma.email_logs.update({
        where: { id: notificationId },
        data: {
          status: status,
          sentAt: status === NotificationStatus.DELIVERED ? new Date() : log.sentAt,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to track delivery: ${(error as any).message}`);
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(campaignId?: string): Promise<{
    total: number;
    sent: number;
    delivered: number;
    failed: number;
    bounced: number;
    openRate: number;
    clickRate: number;
    deliveryRate: number;
  }> {
    try {
      const whereCondition: any = {};
      if (campaignId) whereCondition.campaignId = campaignId;

      const logs = await this.prisma.email_logs.findMany({
        where: whereCondition,
      });

      const sent = logs.filter(l => l.status === 'SENT').length;
      const delivered = logs.filter(l => l.status === 'DELIVERED').length;
      const failed = logs.filter(l => l.status === 'FAILED').length;
      const bounced = logs.filter(l => l.status === 'BOUNCED').length;

      // Get click/open metrics if campaign ID provided
      let openRate = 0;
      let clickRate = 0;

      if (campaignId) {
        const opens = await this.prisma.campaign_opens.count({
          where: { campaignId },
        });
        const clicks = await this.prisma.campaign_clicks.count({
          where: { campaignId },
        });

        openRate = sent > 0 ? (opens / sent) * 100 : 0;
        clickRate = sent > 0 ? (clicks / sent) * 100 : 0;
      }

      const deliveryRate = sent > 0 ? (delivered / sent) * 100 : 0;

      return {
        total: logs.length,
        sent,
        delivered,
        failed,
        bounced,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        deliveryRate: Math.round(deliveryRate * 100) / 100,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get stats: ${(error as any).message}`);
    }
  }

  /**
   * Unsubscribe from notifications
   */
  async unsubscribeUser(email: string): Promise<void> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email },
      });

      if (user) {
        // Mark user as unsubscribed in notifications table
        await this.prisma.notifications.updateMany({
          where: { userId: user.id },
          data: { isRead: true }, // Mark as read/processed
        });
      }
    } catch (error) {
      this.logger.error(`Failed to unsubscribe: ${(error as any).message}`);
    }
  }

  /**
   * Send reminder notification for expiring promotion
   */
  async sendExpiringPromotionReminder(promotionId: string): Promise<NotificationResult> {
    try {
      const promotion = await this.prisma.promotions.findUnique({
        where: { id: promotionId },
      });

      if (!promotion) {
        throw new NotFoundException('Promotion not found');
      }

      const daysLeft = this.getDaysUntilExpiration(promotion.expiresAt);

      if (daysLeft > 0) {
        const message = `Your promotion "${promotion.name}" expires in ${daysLeft} days!`;

        return await this.sendNotification({
          type: NotificationType.EMAIL,
          subject: `Reminder: ${promotion.name} Expires Soon`,
          title: 'Promotion Expiring Soon',
          message,
          promotionId,
        });
      }

      throw new BadRequestException('Promotion already expired');
    } catch (error) {
      throw new BadRequestException(`Failed to send reminder: ${(error as any).message}`);
    }
  }

  /**
   * Send flash sale notification
   */
  async sendFlashSaleNotification(campaignId: string): Promise<{
    sent: number;
    failed: number;
  }> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
      });

      // TODO: 'FLASH_SALE' does not exist in CampaignType enum
      if (!campaign || (campaign.type as any) !== 'FLASH_SALE') {
        throw new BadRequestException('Campaign must be a flash sale type');
      }

      const template = `🔥 FLASH SALE ALERT! Limited time offer on ${campaign.name}. Don't miss out!`;

      const result = await this.sendCampaignNotification(
        campaignId,
        NotificationType.PUSH,
        template,
      );

      return {
        sent: result.sent,
        failed: result.failed,
      };
    } catch (error) {
      throw new BadRequestException(`Flash sale notification failed: ${(error as any).message}`);
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async createNotificationRecord(data: NotificationData): Promise<NotificationData> {
    const notificationId = data.id || uuidv4();

    try {
      await this.prisma.email_logs.create({
        data: {
          id: notificationId,
          recipientEmail: data.recipientEmail,
          subject: data.subject || data.title || data.message,
          status: data.status?.toString() || 'PENDING',
          campaignId: data.campaignId,
        },
      });
    } catch (error) {
      this.logger.warn(`Could not create notification record: ${(error as any).message}`);
    }

    return {
      id: notificationId,
      ...data,
      status: data.status || NotificationStatus.PENDING,
    };
  }

  private async sendEmailNotification(data: NotificationData): Promise<NotificationResult> {
    try {
      if (!data.recipientEmail) {
        throw new BadRequestException('Email address required for email notification');
      }

      // Send email via mail service
      await this.mailService.sendEmail({
        to: data.recipientEmail,
        subject: data.subject || 'Notification',
        html: data.message,
      });

      // Update status
      if (data.id) {
        await this.prisma.email_logs.update({
          where: { id: data.id },
          data: { status: 'SENT', sentAt: new Date() },
        });
      }

      return {
        id: data.id,
        status: NotificationStatus.SENT,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Email send failed: ${(error as any).message}`);

      // Update failure status
      if (data.id) {
        await this.prisma.email_logs.update({
          where: { id: data.id },
          data: { status: 'FAILED', error: (error as any).message },
        });
      }

      throw error;
    }
  }

  private async sendSmsNotification(data: NotificationData): Promise<NotificationResult> {
    try {
      if (!data.recipientPhone) {
        throw new BadRequestException('Phone number required for SMS notification');
      }

      // TODO: Integrate with Twilio or AWS SNS
      this.logger.log(`SMS would be sent to ${data.recipientPhone}: ${data.message}`);

      return {
        id: data.id,
        status: NotificationStatus.SENT,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new BadRequestException(`SMS send failed: ${(error as any).message}`);
    }
  }

  private async sendPushNotification(data: NotificationData): Promise<NotificationResult> {
    try {
      if (!data.recipientUserId) {
        throw new BadRequestException('User ID required for push notification');
      }

      // TODO: Integrate with Firebase Cloud Messaging
      this.logger.log(`Push notification would be sent to user ${data.recipientUserId}`);

      return {
        id: data.id,
        status: NotificationStatus.SENT,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new BadRequestException(`Push send failed: ${(error as any).message}`);
    }
  }

  private async sendInAppNotification(data: NotificationData): Promise<NotificationResult> {
    try {
      if (!data.recipientUserId) {
        throw new BadRequestException('User ID required for in-app notification');
      }

      // Create in-app notification
      await this.prisma.notifications.create({
        data: {
          id: uuidv4(),
          users: { connect: { id: data.recipientUserId } },
          type: 'PROMOTION',
          title: data.title || 'Notification',
          message: data.message,
          data: data.variables || {},
          updatedAt: new Date(),
        },
      });

      return {
        id: data.id,
        status: NotificationStatus.DELIVERED,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new BadRequestException(`In-app notification failed: ${(error as any).message}`);
    }
  }

  private async getTargetAudience(targetAudience?: string): Promise<any[]> {
    try {
      if (!targetAudience) {
        // Default: get all active users
        return await this.prisma.users.findMany({
          where: { role: 'USER' },
          select: { id: true, email: true },
          take: 1000,
        });
      }

      // Filter by segment
      switch (targetAudience) {
        case 'NEW_CUSTOMERS':
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return await this.prisma.users.findMany({
            where: { createdAt: { gte: thirtyDaysAgo } },
            select: { id: true, email: true },
          });

        case 'VIP_CUSTOMERS':
          return await this.prisma.users.findMany({
            where: { role: 'VIP' },
            select: { id: true, email: true },
          });

        case 'INACTIVE_CUSTOMERS':
          const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
          return await this.prisma.users.findMany({
            where: { updatedAt: { lte: ninetyDaysAgo } },
            select: { id: true, email: true },
          });

        default:
          return await this.prisma.users.findMany({
            select: { id: true, email: true },
            take: 1000,
          });
      }
    } catch (error) {
      this.logger.error(`Failed to get target audience: ${(error as any).message}`);
      return [];
    }
  }

  private scheduleNotificationProcessing(notificationId: string, scheduledTime: Date): void {
    const delayMs = scheduledTime.getTime() - Date.now();

    if (delayMs > 0) {
      setTimeout(async () => {
        try {
          const log = await this.prisma.email_logs.findUnique({
            where: { id: notificationId },
          });

          if (log && log.status === 'PENDING') {
            // Process scheduled notification
            this.logger.log(`Processing scheduled notification: ${notificationId}`);
          }
        } catch (error) {
          this.logger.error(`Failed to process scheduled notification: ${(error as any).message}`);
        }
      }, delayMs);
    }
  }

  private getDaysUntilExpiration(expiresAt?: Date): number {
    if (!expiresAt) return 0;

    const now = new Date();
    const daysMs = expiresAt.getTime() - now.getTime();
    return Math.ceil(daysMs / (1000 * 60 * 60 * 24));
  }
}
