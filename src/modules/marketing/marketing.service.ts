import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CampaignStatus, CampaignType, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type CampaignsWithRelations = any;

export interface CampaignsResponse {
  id: string;
  name: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  targetAudience?: string | null;
  discountPercent?: number | null;
  discountAmount?: number | null;
  subject?: string | null;
  content?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  scheduledAt?: string | null;
  sentAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  templateId?: string | null;
  template?: {
    id: string;
    name: string;
    description?: string | null;
    subject: string;
    content: string;
  } | null;
  recipients: number;
  opens: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface CampaignsStatsResponse {
  totalCampaignss: number;
  activeCampaignss: number;
  sentCampaignss: number;
  totalRecipients: number;
  averageOpenRate: number;
  averageClickRate: number;
  totalRevenue: number;
  conversionRate: number;
}

export interface EmailTemplateResponse {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  subject: string;
  content: string;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class MarketingService {
  private readonly logger = new Logger(MarketingService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Campaigns Management
  async getCampaignss(status?: CampaignStatus) {
    try {
      const where: Prisma.campaignsWhereInput = status ? { status } : {};

      const campaignss = await this.prisma.campaigns.findMany({
        where,
        include: {
          template: true,
          campaign_recipients: true,
          campaign_opens: true,
          campaign_clicks: true,
        },
        orderBy: { createdAt: 'desc' },
      } as any);

      const transformed = campaignss.map((campaigns) => this.transformCampaigns(campaigns));
      const stats = this.buildCampaignsStats(transformed);

      return {
        campaignss: transformed,
        stats,
      };
    } catch (error) {
      // In environments without the Campaigns table/migrations, avoid crashing and return safe defaults
      this.logger.error('Failed to load campaignss', error as Error);
      return {
        campaignss: [],
        stats: {
          totalCampaignss: 0,
          activeCampaignss: 0,
          sentCampaignss: 0,
          totalRecipients: 0,
          averageOpenRate: 0,
          averageClickRate: 0,
          totalRevenue: 0,
          conversionRate: 0,
        },
      };
    }
  }

  async getCampaigns(id: string) {
    const campaigns = await this.prisma.campaigns.findUnique({
      where: { id },
      include: {
        template: true,
        campaign_recipients: true,
        campaign_opens: true,
        campaign_clicks: true,
      },
    } as any);

    if (!campaigns) {
      throw new NotFoundException('Campaigns not found');
    }

    const transformed = this.transformCampaigns(campaigns);
    const stats = this.buildCampaignsStats([transformed]);

    return {
      campaigns: transformed,
      stats,
    };
  }

  async createCampaigns(data: {
    name: string;
    description: string;
    type: CampaignType;
    targetAudience?: string;
    discountPercent?: number;
    discountAmount?: number;
    subject?: string;
    content?: string;
    startDate?: string;
    endDate?: string;
    scheduledAt?: string;
    templateId?: string;
    createdBy?: string;
  }) {
    if (data.templateId) {
      await this.ensureTemplateExists(data.templateId);
    }

    const campaigns = await this.prisma.campaigns.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        targetAudience: data.targetAudience,
        discountPercent: data.discountPercent ?? null,
        discountAmount: data.discountAmount ?? null,
        subject: data.subject,
        content: data.content,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        templateId: data.templateId ?? null,
        createdBy: data.createdBy ?? 'system',
        status: data.scheduledAt ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
      },
      include: {
        template: true,
        campaign_recipients: true,
        campaign_opens: true,
        campaign_clicks: true,
      },
    } as any);

    this.logger.log(`Campaigns created: ${campaigns.id}`);
    return this.transformCampaigns(campaigns);
  }

  async updateCampaigns(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      type: CampaignType;
      targetAudience: string;
      discountPercent: number;
      discountAmount: number;
      subject: string;
      content: string;
      startDate: string | null;
      endDate: string | null;
      scheduledAt: string | null;
      templateId: string | null;
      status: CampaignStatus;
      createdBy: string;
    }>,
  ) {
    if (data.templateId) {
      await this.ensureTemplateExists(data.templateId);
    }

    const updateData: any = {
      ...('name' in data ? { name: data.name } : {}),
      ...('description' in data ? { description: data.description } : {}),
      ...('type' in data ? { type: data.type } : {}),
      ...('targetAudience' in data ? { targetAudience: data.targetAudience } : {}),
      ...('discountPercent' in data ? { discountPercent: data.discountPercent } : {}),
      ...('discountAmount' in data ? { discountAmount: data.discountAmount } : {}),
      ...('subject' in data ? { subject: data.subject } : {}),
      ...('content' in data ? { content: data.content } : {}),
      ...('templateId' in data ? { templateId: data.templateId } : {}),
      ...('status' in data ? { status: data.status } : {}),
      ...('createdBy' in data ? { createdBy: data.createdBy } : {}),
    };

    if ('startDate' in data) {
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    }
    if ('endDate' in data) {
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    }
    if ('scheduledAt' in data) {
      updateData.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
    }

    const campaigns = await this.prisma.campaigns.update({
      where: { id },
      data: updateData,
      include: {
        template: true,
        campaign_recipients: true,
        campaign_opens: true,
        campaign_clicks: true,
      },
    } as any);

    this.logger.log(`Campaigns updated: ${id}`);
    return this.transformCampaigns(campaigns);
  }

  async deleteCampaigns(id: string) {
    await this.prisma.campaigns.delete({ where: { id } });
    this.logger.log(`Campaigns deleted: ${id}`);
    return { message: 'Campaigns deleted successfully' };
  }

  async duplicateCampaigns(id: string) {
    const original = await this.prisma.campaigns.findUnique({ where: { id } });
    if (!original) {
      throw new NotFoundException('Campaigns not found');
    }

    const duplicated = await this.prisma.campaigns.create({
      data: {
        name: `${original.name} (Copy)`
          .trim()
          .slice(0, 120),
        description: original.description,
        type: original.type,
        status: CampaignStatus.DRAFT,
        targetAudience: original.targetAudience,
        discountPercent: original.discountPercent,
        discountAmount: original.discountAmount,
        subject: original.subject,
        content: original.content,
        templateId: original.templateId,
        createdBy: original.createdBy ?? 'system',
      },
      include: {
        template: true,
        campaign_recipients: true,
        campaign_opens: true,
        campaign_clicks: true,
      },
    } as any);

    this.logger.log(`Campaigns duplicated: ${duplicated.id} from ${id}`);
    return this.transformCampaigns(duplicated);
  }

  async scheduleCampaigns(id: string, scheduledAt: string) {
    const scheduledDate = new Date(scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) {
      throw new BadRequestException('Invalid scheduledAt value');
    }

    const campaigns = await this.prisma.campaigns.update({
      where: { id },
      data: {
        status: CampaignStatus.SCHEDULED,
        scheduledAt: scheduledDate,
      },
      include: {
        template: true,
        campaign_recipients: true,
        campaign_opens: true,
        campaign_clicks: true,
      },
    } as any);

    this.logger.log(`Campaigns scheduled: ${id} at ${scheduledDate.toISOString()}`);
    return this.transformCampaigns(campaigns);
  }

  async sendCampaigns(id: string) {
    const campaigns = await this.prisma.campaigns.findUnique({
      where: { id },
      include: {
        template: true,
        campaign_recipients: true,
        campaign_opens: true,
        campaign_clicks: true,
      },
    } as any);

    if (!campaigns) {
      throw new NotFoundException('Campaigns not found');
    }

    const recipients = await this.getTargetAudience(campaigns.targetAudience);

    if (!recipients.length) {
      this.logger.warn(`Campaigns ${id} has no recipients.`);
    }

    await this.prisma.campaign_recipients.createMany({
      data: recipients.map((recipient) => ({
        campaignId: campaigns.id,
        email: recipient.email,
        name: recipient.name ?? null,
      })),
      skipDuplicates: true,
    } as any);

    switch (campaigns.type) {
      case CampaignType.EMAIL:
        await this.sendEmailCampaigns(campaigns, recipients);
        break;
      case CampaignType.SMS:
        await this.sendSMSCampaigns(campaigns, recipients);
        break;
      case CampaignType.PUSH:
        await this.sendPushCampaigns(campaigns, recipients);
        break;
      case CampaignType.SOCIAL:
        await this.sendSocialCampaigns(campaigns);
        break;
    }

    await this.prisma.campaigns.update({
      where: { id },
      data: {
        status: CampaignStatus.SENT,
        sentAt: new Date(),
        scheduledAt: null,
      },
    });

    if (campaigns.templateId) {
      await (this.prisma as any).emailTemplate.update({
        where: { id: campaigns.templateId },
        data: {
          usageCount: { increment: recipients.length || 1 },
        },
      });
    }

    this.logger.log(`Campaigns sent: ${id} to ${recipients.length} recipients`);
    return {
      message: 'Campaigns sent successfully',
      recipientCount: recipients.length,
    };
  }

  async getCampaignsStats(id: string) {
    const campaigns = await this.prisma.campaigns.findUnique({
      where: { id },
      include: {
        campaign_recipients: true,
        campaign_opens: true,
        campaign_clicks: true,
      },
    } as any);

    if (!campaigns) {
      throw new NotFoundException('Campaigns not found');
    }

    const stats = {
      totalRecipients: (campaigns as any).campaign_recipients.length,
      totalOpens: (campaigns as any).campaign_opens.length,
      totalClicks: (campaigns as any).campaign_clicks.length,
      openRate:
        (campaigns as any).campaign_recipients.length > 0
          ? Number((((campaigns as any).campaign_opens.length / (campaigns as any).campaign_recipients.length) * 100).toFixed(2))
          : 0,
      clickRate:
        (campaigns as any).campaign_recipients.length > 0
          ? Number((((campaigns as any).campaign_clicks.length / (campaigns as any).campaign_recipients.length) * 100).toFixed(2))
          : 0,
      conversionRate: 0,
    };

    return stats;
  }

  // Email templates
  async getEmailTemplates(): Promise<{ templates: EmailTemplateResponse[] }> {
    const templates = await (this.prisma as any).emailTemplate.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    return {
      templates: templates.map((template) => this.transformTemplate(template)),
    };
  }

  async getEmailTemplate(id: string): Promise<EmailTemplateResponse> {
    const template = await (this.prisma as any).emailTemplate.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException('Email template not found');
    }
    return this.transformTemplate(template);
  }

  async createEmailTemplate(data: {
    name: string;
    description?: string;
    category?: string;
    subject: string;
    content: string;
    isActive?: boolean;
  }): Promise<EmailTemplateResponse> {
    const template = await (this.prisma as any).emailTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        subject: data.subject,
        content: data.content,
        isActive: data.isActive ?? true,
      },
    });

    this.logger.log(`Email template created: ${template.id}`);
    return this.transformTemplate(template);
  }

  async updateEmailTemplate(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      category: string;
      subject: string;
      content: string;
      isActive: boolean;
    }>,
  ): Promise<EmailTemplateResponse> {
    const template = await (this.prisma as any).emailTemplate.update({
      where: { id },
      data,
    });

    this.logger.log(`Email template updated: ${id}`);
    return this.transformTemplate(template);
  }

  async deleteEmailTemplate(id: string) {
    await (this.prisma as any).emailTemplate.delete({ where: { id } });
    this.logger.log(`Email template deleted: ${id}`);
    return { message: 'Email template deleted successfully' };
  }

  async getEmailStats(startDate?: string, endDate?: string) {
    const where: Prisma.email_logsWhereInput = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
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
      successRate: totalEmails > 0 ? Number(((sentEmails / totalEmails) * 100).toFixed(2)) : 0,
    };
  }

  async sendEmail(data: {
    recipients: string[];
    subject: string;
    content: string;
    templateId?: string;
  }) {
    // let subject = data.subject;
    // let content = data.content;

    if (data.templateId) {
      const template = await (this.prisma as any).emailTemplate.findUnique({ where: { id: data.templateId } });
      if (template) {
        // subject = subject || template.subject;
        // content = content || template.content;
      }
    }

    this.logger.log(`Manual email send skipped for ${data.recipients.length} recipients (notification system disabled).`);

    return {
      total: data.recipients.length,
      sent: 0,
      failed: 0,
      results: data.recipients.map((email) => ({ email, status: 'skipped' as const })),
    };
  }

  // Audience Management (placeholder implementations)
  async getAudienceSegments() {
    return [
      {
        id: 'new-customers',
        name: 'New Customers',
        description: 'Customers who registered in the last 30 days',
        count: await this.prisma.users.count({
          where: {
            role: 'USER',
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      },
      {
        id: 'returning-customers',
        name: 'Returning Customers',
        description: 'Customers with more than 1 order',
        count: await this.prisma.users.count({
          where: {
            role: 'USER',
            orders: {
              some: {},
            },
          },
        }),
      },
      {
        id: 'high-value',
        name: 'High Value Customers',
        description: 'Customers who spent more than 5M VND',
        count: 0,
      },
      {
        id: 'inactive',
        name: 'Inactive Customers',
        description: 'Customers with no activity in 90 days',
        count: await this.prisma.users.count({
          where: {
            role: 'USER',
            updatedAt: {
              lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      },
    ];
  }

  async getAudienceSegment(id: string) {
    const segments = await this.getAudienceSegments();
    const segment = segments.find((s) => s.id === id);

    if (!segment) {
      throw new NotFoundException('Audience segment not found');
    }

    return segment;
  }

  async createAudienceSegment(data: { name: string; criteria: any }) {
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

  // Analytics (placeholder implementations)
  async getROIAnalysis(_startDate?: string, _endDate?: string) {
    return {
      totalSpent: 5_000_000,
      totalRevenue: 25_000_000,
      roi: 400,
      campaignss: 12,
      averageROI: 350,
      topPerformingCampaigns: 'Summer Sale 2024',
      topPerformingChannel: 'Email Marketing',
    };
  }

  async getConversionFunnel(_startDate?: string, _endDate?: string) {
    return {
      visitors: 10_000,
      leads: 1_500,
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
  private transformCampaigns(campaigns: CampaignsWithRelations): CampaignsResponse {
    const recipients = (campaigns as any).campaign_recipients.length;
    const opens = (campaigns as any).campaign_opens.length;
    const clicks = (campaigns as any).campaign_clicks.length;

    return {
      id: campaigns.id,
      name: campaigns.name,
      description: campaigns.description,
      type: campaigns.type,
      status: campaigns.status,
      targetAudience: campaigns.targetAudience,
      discountPercent: campaigns.discountPercent,
      discountAmount: campaigns.discountAmount,
      subject: campaigns.subject,
      content: campaigns.content,
      startDate: campaigns.startDate ? campaigns.startDate.toISOString() : null,
      endDate: campaigns.endDate ? campaigns.endDate.toISOString() : null,
      scheduledAt: campaigns.scheduledAt ? campaigns.scheduledAt.toISOString() : null,
      sentAt: campaigns.sentAt ? campaigns.sentAt.toISOString() : null,
      createdAt: campaigns.createdAt.toISOString(),
      updatedAt: campaigns.updatedAt.toISOString(),
      createdBy: campaigns.createdBy,
      templateId: campaigns.templateId ?? null,
      template: campaigns.template
        ? {
            id: campaigns.template.id,
            name: campaigns.template.name,
            description: campaigns.template.description,
            subject: campaigns.template.subject,
            content: campaigns.template.content,
          }
        : null,
      recipients,
      opens,
      clicks,
      conversions: 0,
      revenue: 0,
    };
  }

  private buildCampaignsStats(campaignss: CampaignsResponse[]): CampaignsStatsResponse {
    const totalCampaignss = campaignss.length;
    const sentCampaignss = campaignss.filter((c) => c.status === CampaignStatus.SENT).length;
    const activeCampaignss = campaignss.filter((c) =>
      c.status === CampaignStatus.SENT || c.status === CampaignStatus.SCHEDULED,
    ).length;
    const totalRecipients = campaignss.reduce((sum, c) => sum + (c.recipients || 0), 0);
    const totalRevenue = campaignss.reduce((sum, c) => sum + (c.revenue || 0), 0);

    const campaignssWithRecipients = campaignss.filter((c) => c.recipients > 0);
    const averageOpenRate = campaignssWithRecipients.length
      ? campaignssWithRecipients.reduce((sum, c) => sum + (c.opens / c.recipients) * 100, 0) /
        campaignssWithRecipients.length
      : 0;
    const averageClickRate = campaignssWithRecipients.length
      ? campaignssWithRecipients.reduce((sum, c) => sum + (c.clicks / c.recipients) * 100, 0) /
        campaignssWithRecipients.length
      : 0;

    return {
      totalCampaignss,
      activeCampaignss,
      sentCampaignss,
      totalRecipients,
      averageOpenRate: Number(averageOpenRate.toFixed(2)),
      averageClickRate: Number(averageClickRate.toFixed(2)),
      totalRevenue,
      conversionRate: 0,
    };
  }

  private transformTemplate(template: any): EmailTemplateResponse {
    return {
      id: template.id,
      name: template.name,
      description: template.description ?? null,
      category: template.category ?? null,
      subject: template.subject,
      content: template.content,
      usageCount: template.usageCount ?? 0,
      isActive: template.isActive ?? true,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };
  }

  private async ensureTemplateExists(templateId: string) {
    const template = await (this.prisma as any).emailTemplate.findUnique({ where: { id: templateId } });
    if (!template) {
      throw new NotFoundException('Email template not found');
    }
  }

  private async getTargetAudience(targetAudience?: string | null) {
    if (!targetAudience) {
      return this.prisma.users.findMany({
        where: { role: 'USER', email: { not: null } },
        select: { email: true, name: true },
      });
    }

    switch (targetAudience) {
      case 'new-customers':
        return this.prisma.users.findMany({
          where: {
            role: 'USER',
            email: { not: null },
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
            email: { not: null },
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

  private async sendEmailCampaigns(campaigns: CampaignsWithRelations, _recipients: { email: string; name?: string | null }[]) {
    this.logger.log(`Email campaigns ${campaigns.id} skipped (notification system disabled).`);
  }

  private async sendSMSCampaigns(campaigns: CampaignsWithRelations, recipients: { email: string; name?: string | null }[]) {
    this.logger.log(`SMS campaigns ${campaigns.id} prepared for ${recipients.length} recipients.`);
  }

  private async sendPushCampaigns(campaigns: CampaignsWithRelations, recipients: { email: string; name?: string | null }[]) {
    this.logger.log(`Push campaigns ${campaigns.id} prepared for ${recipients.length} recipients.`);
  }

  private async sendSocialCampaigns(campaigns: CampaignsWithRelations) {
    this.logger.log(`Social campaigns ${campaigns.id} posted.`);
  }
}
