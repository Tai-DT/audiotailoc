import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import { CampaignStatus, CampaignType } from '@prisma/client';

@Injectable()
export class MarketingService {
  private readonly logger = new Logger(MarketingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  // Campaign Management

  async getCampaigns(status?: CampaignStatus) {
    const where: any = status ? { status } : {};
    const campaigns = await this.prisma.campaigns.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return campaigns;
  }

  async getCampaign(id: string) {
    const campaign = await this.prisma.campaigns.findUnique({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async createCampaign(data: {
    name: string;
    description: string;
    type: CampaignType;
    targetAudience?: string;
    discountPercent?: number;
    discountAmount?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const campaign = await this.prisma.campaigns.create({
      data: {
        id: randomUUID(),
        name: data.name,
        description: data.description,
        type: data.type,
        targetAudience: data.targetAudience || null,
        discountPercent: data.discountPercent || 0,
        discountAmount: data.discountAmount || 0,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: CampaignStatus.DRAFT,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Campaign created: ${campaign.id}`);
    return campaign;
  }

  async updateCampaign(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      type: CampaignType;
      targetAudience: string;
      discountPercent: number;
      discountAmount: number;
      startDate: string;
      endDate: string;
      status: CampaignStatus;
    }>,
  ) {
    const campaign = await this.prisma.campaigns.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    this.logger.log(`Campaign updated: ${id}`);
    return campaign;
  }

  async deleteCampaign(id: string) {
    await this.prisma.campaigns.delete({ where: { id } });
    this.logger.log(`Campaign deleted: ${id}`);
    return { message: 'Campaign deleted successfully' };
  }

  async sendCampaign(id: string) {
    const campaign = await this.getCampaign(id);

    // Get target audience
    const recipients = await this.getTargetAudience(campaign.targetAudience);

    // Send campaign based on type
    switch (campaign.type) {
      case 'EMAIL':
        await this.sendEmailCampaign(campaign, recipients);
        break;
      case 'SMS':
        await this.sendSMSCampaign(campaign, recipients);
        break;
      case 'PUSH':
        await this.sendPushCampaign(campaign, recipients);
        break;
      case 'SOCIAL':
        await this.sendSocialCampaign(campaign);
        break;
    }

    // Update campaign status
    await this.prisma.campaigns.update({
      where: { id },
      data: { status: CampaignStatus.SENT, sentAt: new Date() },
    });

    this.logger.log(`Campaign sent: ${id} to ${recipients.length} recipients`);
    return { message: 'Campaign sent successfully', recipientCount: recipients.length };
  }

  async getCampaignStats(id: string) {
    const campaign = await this.getCampaign(id);

    const stats = {
      totalRecipients: 0,
      totalOpens: 0,
      totalClicks: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
    };

    return stats;
  }

  // Email Marketing
  async sendEmail(data: {
    recipients: string[];
    subject: string;
    content: string;
    templateId?: string;
  }) {
    const results = [];

    for (const recipient of data.recipients) {
      try {
        await this.mailService.sendEmail({
          to: recipient,
          subject: data.subject,
          html: data.content,
        });

        results.push({ email: recipient, status: 'sent' });
      } catch (error) {
        this.logger.error(`Failed to send email to ${recipient}:`, error as any);
        results.push({ email: recipient, status: 'failed', error: (error as any).message });
      }
    }

    return {
      total: data.recipients.length,
      sent: results.filter(r => r.status === 'sent').length,
      failed: results.filter(r => r.status === 'failed').length,
      results,
    };
  }

  async getEmailTemplates() {
    return [
      {
        id: 'welcome',
        name: 'Welcome Email',
        subject: 'Welcome to Audio Tài Lộc!',
        content: '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
      },
      {
        id: 'promotion',
        name: 'Promotion Email',
        subject: 'Special Offer Just for You!',
        content: '<h1>Special Offer</h1><p>Get 20% off your next purchase!</p>',
      },
      {
        id: 'order-confirmation',
        name: 'Order Confirmation',
        subject: 'Your Order Confirmation',
        content: '<h1>Order Confirmed</h1><p>Thank you for your order.</p>',
      },
    ];
  }

  async getEmailStats(startDate?: string, endDate?: string) {
    const where: any = {};
    if (startDate || endDate) {
      where['createdAt'] = {};
      if (startDate) where['createdAt']['gte'] = new Date(startDate);
      if (endDate) where['createdAt']['lte'] = new Date(endDate);
    }

    const [totalEmails, sentEmails, failedEmails] = await Promise.all([
      this.prisma.email_logs.count({ where }),
      this.prisma.email_logs.count({ where: { ...where, status: 'SENT' } }),
      this.prisma.email_logs.count({ where: { ...where, status: 'FAILED' } }),
    ]);

    return {
      totalEmails,
      sentEmails,
      failedEmails,
      successRate: totalEmails > 0 ? ((sentEmails / totalEmails) * 100).toFixed(2) : 0,
    };
  }

  // Audience Management
  async getAudienceSegments() {
    return [
      {
        id: 'new-customers',
        name: 'New Customers',
        description: 'Customers who registered in the last 30 days',
        count: 150,
      },
      {
        id: 'returning-customers',
        name: 'Returning Customers',
        description: 'Customers with more than 1 order',
        count: 320,
      },
      {
        id: 'high-value',
        name: 'High Value Customers',
        description: 'Customers who spent more than 5M VND',
        count: 85,
      },
      {
        id: 'inactive',
        name: 'Inactive Customers',
        description: 'Customers with no activity in 90 days',
        count: 200,
      },
    ];
  }

  async getAudienceSegment(id: string) {
    const segments = await this.getAudienceSegments();
    const segment = segments.find(s => s.id === id);

    if (!segment) {
      throw new NotFoundException('Audience segment not found');
    }

    return segment;
  }

  async createAudienceSegment(data: { name: string; criteria: any }) {
    // This would create a new audience segment based on criteria
    const segment = {
      id: `segment-${Date.now()}`,
      name: data.name,
      criteria: data.criteria,
      count: 0,
      createdAt: new Date(),
    };

    this.logger.log(`Audience segment created: ${segment.id}`);
    return segment;
  }

  // Analytics
  async getROIAnalysis(startDate?: string, endDate?: string) {
    const where: any = {};
    if (startDate || endDate) {
      where['createdAt'] = {};
      if (startDate) where['createdAt']['gte'] = new Date(startDate);
      if (endDate) where['createdAt']['lte'] = new Date(endDate);
    }

    // Mock ROI data
    return {
      totalSpent: 5000000, // 5M VND
      totalRevenue: 25000000, // 25M VND
      roi: 400, // 400% ROI
      campaigns: 12,
      averageROI: 350,
      topPerformingCampaign: 'Summer Sale 2024',
      topPerformingChannel: 'Email Marketing',
    };
  }

  async getConversionFunnel(_startDate?: string, _endDate?: string) {
    // Mock conversion funnel data
    return {
      visitors: 10000,
      leads: 1500,
      prospects: 750,
      customers: 300,
      conversionRates: {
        visitorToLead: 15,
        leadToProspect: 50,
        prospectToCustomer: 40,
        overall: 3,
      },
    };
  }

  // Helper methods
  private async getTargetAudience(targetAudience?: string | null) {
    if (!targetAudience) {
      // Return all customers
      return this.prisma.users.findMany({
        where: { role: 'USER' },
        select: { email: true, name: true },
      });
    }

    // Return specific audience based on criteria
    switch (targetAudience) {
      case 'new-customers':
        return this.prisma.users.findMany({
          where: {
            role: 'USER',
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          select: { email: true, name: true },
        });

      case 'returning-customers':
        return this.prisma.users.findMany({
          where: {
            role: 'USER',
            orders: {
              some: {},
            },
          },
          select: { email: true, name: true },
        });

      default:
        return [];
    }
  }

  private async sendEmailCampaign(campaign: any, recipients: any[]) {
    for (const recipient of recipients) {
      try {
        await this.mailService.sendEmail({
          to: recipient.email,
          subject: campaign.name,
          html: campaign.description,
        });

        // Log email sent
        await this.prisma.email_logs.create({
          data: {
            id: randomUUID(),
            campaignId: campaign.id,
            recipientEmail: recipient.email,
            subject: campaign.name,
            status: 'SENT',
            sentAt: new Date(),
          },
        });
      } catch (error) {
        this.logger.error(`Failed to send campaign email to ${recipient.email}:`, error as any);

        await this.prisma.email_logs.create({
          data: {
            id: randomUUID(),
            campaignId: campaign.id,
            recipientEmail: recipient.email,
            subject: campaign.name,
            status: 'FAILED',
            error: (error as any).message,
          },
        });
      }
    }
  }

  private async sendSMSCampaign(campaign: any, recipients: any[]) {
    // SMS sending implementation would go here
    this.logger.log(`SMS campaign sent to ${recipients.length} recipients`);
  }

  private async sendPushCampaign(campaign: any, recipients: any[]) {
    // Push notification implementation would go here
    this.logger.log(`Push campaign sent to ${recipients.length} recipients`);
  }

  private async sendSocialCampaign(_campaign: any) {
    // Social media posting implementation would go here
    this.logger.log(`Social campaign posted`);
  }
}
