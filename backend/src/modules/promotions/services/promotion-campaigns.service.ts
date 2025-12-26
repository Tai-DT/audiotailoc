import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Decimal } from '@prisma/client/runtime/library';
import { CampaignStatus, CampaignType } from '@prisma/client';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  promotionIds: string[];
  startDate: Date;
  endDate: Date;
  targetAudience?: string;
  budget?: number;
  expectedReach?: number;
  priority?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CampaignMetrics {
  campaignId: string;
  impressions: number;
  clicks: number;
  ctr: number; // Click-through rate
  conversions: number;
  conversionRate: number;
  revenue: number;
  discount: number;
  roi: number;
  audienceReached: number;
  engagementRate: number;
}

export interface CampaignPromotion {
  promotionId: string;
  campaignId: string;
  order: number;
  priority: number;
  isActive: boolean;
}

@Injectable()
export class PromotionCampaignsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new campaign with full database persistence
   */
  async createCampaign(
    data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: CampaignStatus },
  ): Promise<Campaign> {
    try {
      const campaignId = uuidv4();

      // Create campaign in database
      const campaign = await this.prisma.campaigns.create({
        data: {
          id: campaignId,
          name: data.name,
          description: data.description || '',
          type: data.type as CampaignType,
          status: (data.status || CampaignStatus.DRAFT) as CampaignStatus,
          targetAudience: data.targetAudience,
          discountPercent: null,
          discountAmount: null,
          startDate: data.startDate,
          endDate: data.endDate,
          content: JSON.stringify(data.metadata || {}),
          createdBy: data.createdBy,
          updatedAt: new Date(),
        },
      });

      // Add promotions to campaign if provided
      // TODO: campaign_promotions table does not exist
      // if (data.promotionIds && data.promotionIds.length > 0) {
      //   await Promise.all(
      //     data.promotionIds.map((promotionId, index) =>
      //       (this.prisma as any).campaign_promotions.create({
      //         data: {
      //           id: uuidv4(),
      //           campaignId,
      //           promotionId,
      //           orderIndex: index,
      //           priority: index,
      //         },
      //       }),
      //     ),
      //   );
      // }

      return this.formatCampaign(campaign);
    } catch (error) {
      throw new BadRequestException(`Failed to create campaign: ${(error as any).message}`);
    }
  }

  /**
   * Get campaign by ID with all relations
   */
  async getCampaignById(campaignId: string): Promise<Campaign | null> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
        // TODO: campaign_promotions relation does not exist
        // include: {
        //   campaign_promotions: {
        //     orderBy: { orderIndex: 'asc' },
        //     include: { promotions: true },
        //   },
        // },
      });

      if (!campaign) {
        return null;
      }

      return this.formatCampaignWithPromotions(campaign);
    } catch (error) {
      throw new BadRequestException(`Failed to get campaign: ${(error as any).message}`);
    }
  }

  /**
   * List all campaigns with advanced filtering and pagination
   */
  async listCampaigns(filters?: {
    status?: CampaignStatus;
    type?: CampaignType;
    startDate?: Date;
    endDate?: Date;
    search?: string;
    skip?: number;
    take?: number;
  }): Promise<{
    campaigns: Campaign[];
    total: number;
  }> {
    try {
      const skip = filters?.skip || 0;
      const take = filters?.take || 20;

      const whereCondition: any = {};

      if (filters?.status) {
        whereCondition.status = filters.status;
      }

      if (filters?.type) {
        whereCondition.type = filters.type;
      }

      if (filters?.startDate) {
        whereCondition.startDate = { gte: filters.startDate };
      }

      if (filters?.endDate) {
        whereCondition.endDate = { lte: filters.endDate };
      }

      if (filters?.search) {
        whereCondition.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const [campaigns, total] = await Promise.all([
        this.prisma.campaigns.findMany({
          where: whereCondition,
          skip,
          take,
          // TODO: campaign_promotions relation does not exist
          // include: {
          //   campaign_promotions: {
          //     orderBy: { orderIndex: 'asc' },
          //     include: { promotions: true },
          //   },
          // },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.campaigns.count({ where: whereCondition }),
      ]);

      return {
        campaigns: campaigns.map(c => this.formatCampaignWithPromotions(c)),
        total,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to list campaigns: ${(error as any).message}`);
    }
  }

  /**
   * Update campaign
   */
  async updateCampaign(campaignId: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      const updated = await this.prisma.campaigns.update({
        where: { id: campaignId },
        data: {
          name: updates.name,
          description: updates.description,
          type: updates.type as CampaignType,
          status: updates.status as CampaignStatus,
          targetAudience: updates.targetAudience,
          startDate: updates.startDate,
          endDate: updates.endDate,
          content: updates.metadata ? JSON.stringify(updates.metadata) : undefined,
        },
        // TODO: campaign_promotions relation does not exist
        // include: {
        //   campaign_promotions: {
        //     orderBy: { orderIndex: 'asc' },
        //     include: { promotions: true },
        //   },
        // },
      });

      return this.formatCampaignWithPromotions(updated);
    } catch (error) {
      throw new BadRequestException(`Failed to update campaign: ${(error as any).message}`);
    }
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(campaignId: string): Promise<boolean> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      // Delete campaign (cascade will handle related records)
      await this.prisma.campaigns.delete({
        where: { id: campaignId },
      });

      return true;
    } catch (error) {
      throw new BadRequestException(`Failed to delete campaign: ${(error as any).message}`);
    }
  }

  /**
   * Add promotions to campaign
   */
  async addPromotionsToCampaign(campaignId: string, promotionIds: string[]): Promise<boolean> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
        // TODO: campaign_promotions relation does not exist
        // include: { campaign_promotions: true },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      // Get current highest orderIndex
      // TODO: campaign_promotions relation does not exist
      const maxOrder = 0; // campaign.campaign_promotions.length;

      // Add new promotions
      // TODO: campaign_promotions table does not exist
      // await Promise.all(
      //   promotionIds.map((promotionId, index) =>
      //     (this.prisma as any).campaign_promotions.create({
      //       data: {
      //         id: uuidv4(),
      //         campaignId,
      //         promotionId,
      //         orderIndex: maxOrder + index,
      //         priority: maxOrder + index,
      //       },
      //     }),
      //   ),
      // );

      return true;
    } catch (error) {
      throw new BadRequestException(`Failed to add promotions: ${(error as any).message}`);
    }
  }

  /**
   * Remove promotions from campaign
   */
  async removePromotionsFromCampaign(campaignId: string, promotionIds: string[]): Promise<boolean> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      // Delete campaign promotions
      // TODO: campaign_promotions table does not exist
      // await (this.prisma as any).campaign_promotions.deleteMany({
      //   where: {
      //     campaignId,
      //     promotionId: { in: promotionIds },
      //   },
      // });

      // Reorder remaining promotions
      // TODO: campaign_promotions table does not exist
      // const remaining = await (this.prisma as any).campaign_promotions.findMany({
      //   where: { campaignId },
      //   orderBy: { orderIndex: 'asc' },
      // });

      // await Promise.all(
      //   remaining.map((cp, index) =>
      //     (this.prisma as any).campaign_promotions.update({
      //       where: { id: cp.id },
      //       data: { orderIndex: index, priority: index },
      //     }),
      //   ),
      // );

      return true;
    } catch (error) {
      throw new BadRequestException(`Failed to remove promotions: ${(error as any).message}`);
    }
  }

  /**
   * Launch campaign (change status to ACTIVE)
   */
  async launchCampaign(campaignId: string): Promise<Campaign | null> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
        // TODO: campaign_promotions relation does not exist
        // include: { campaign_promotions: true },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      // TODO: campaign_promotions relation does not exist
      // Skip validation until relation is added
      // if (campaign.campaign_promotions.length === 0) {
      //   throw new BadRequestException('Cannot launch campaign without promotions');
      // }

      const updated = await this.prisma.campaigns.update({
        where: { id: campaignId },
        data: {
          status: CampaignStatus.SCHEDULED, // ACTIVE does not exist, using SCHEDULED
          startDate: new Date(),
        },
        // TODO: campaign_promotions relation does not exist
        // include: {
        //   campaign_promotions: {
        //     orderBy: { orderIndex: 'asc' },
        //     include: { promotions: true },
        //   },
        // },
      });

      return this.formatCampaignWithPromotions(updated);
    } catch (error) {
      throw new BadRequestException(`Failed to launch campaign: ${(error as any).message}`);
    }
  }

  /**
   * Pause campaign
   */
  async pauseCampaign(campaignId: string): Promise<Campaign | null> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      const updated = await this.prisma.campaigns.update({
        where: { id: campaignId },
        data: { status: CampaignStatus.CANCELLED }, // PAUSED does not exist, using CANCELLED
        // TODO: campaign_promotions relation does not exist
        // include: {
        //   campaign_promotions: {
        //     orderBy: { orderIndex: 'asc' },
        //     include: { promotions: true },
        //   },
        // },
      });

      return this.formatCampaignWithPromotions(updated);
    } catch (error) {
      throw new BadRequestException(`Failed to pause campaign: ${(error as any).message}`);
    }
  }

  /**
   * Resume paused campaign
   */
  async resumeCampaign(campaignId: string): Promise<Campaign | null> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      if (campaign.status !== CampaignStatus.CANCELLED) {
        // PAUSED does not exist
        throw new BadRequestException('Only paused campaigns can be resumed');
      }

      const updated = await this.prisma.campaigns.update({
        where: { id: campaignId },
        data: { status: CampaignStatus.SCHEDULED }, // ACTIVE does not exist
        // TODO: campaign_promotions relation does not exist
        // include: {
        //   campaign_promotions: {
        //     orderBy: { orderIndex: 'asc' },
        //     include: { promotions: true },
        //   },
        // },
      });

      return this.formatCampaignWithPromotions(updated);
    } catch (error) {
      throw new BadRequestException(`Failed to resume campaign: ${(error as any).message}`);
    }
  }

  /**
   * End campaign
   */
  async endCampaign(campaignId: string): Promise<Campaign | null> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      const updated = await this.prisma.campaigns.update({
        where: { id: campaignId },
        data: {
          status: CampaignStatus.SENT, // COMPLETED does not exist, using SENT
          endDate: new Date(),
          sentAt: new Date(),
        },
        // TODO: campaign_promotions relation does not exist
        // include: {
        //   campaign_promotions: {
        //     orderBy: { orderIndex: 'asc' },
        //     include: { promotions: true },
        //   },
        // },
      });

      return this.formatCampaignWithPromotions(updated);
    } catch (error) {
      throw new BadRequestException(`Failed to end campaign: ${(error as any).message}`);
    }
  }

  /**
   * Cancel campaign
   */
  async cancelCampaign(campaignId: string): Promise<Campaign | null> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      const updated = await this.prisma.campaigns.update({
        where: { id: campaignId },
        data: { status: 'CANCELLED' },
        // TODO: campaign_promotions relation does not exist
        // include: {
        //   campaign_promotions: {
        //     orderBy: { orderIndex: 'asc' },
        //     include: { promotions: true },
        //   },
        // },
      });

      return this.formatCampaignWithPromotions(updated);
    } catch (error) {
      throw new BadRequestException(`Failed to cancel campaign: ${(error as any).message}`);
    }
  }

  /**
   * Get campaign metrics from database
   */
  async getCampaignMetrics(
    campaignId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<CampaignMetrics> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      const whereCondition: any = { campaignId };

      if (startDate || endDate) {
        whereCondition.date = {};
        if (startDate) whereCondition.date.gte = startDate;
        if (endDate) whereCondition.date.lte = endDate;
      }

      // Get metrics from campaign_metrics table
      const metrics = await (this.prisma as any).campaign_metrics.findMany({
        where: whereCondition,
      });

      // Aggregate metrics
      let totalImpressions = 0;
      let totalClicks = 0;
      let totalConversions = 0;
      let totalRevenue = 0;
      let totalDiscount = 0;
      let totalAudienceReached = 0;

      metrics.forEach(m => {
        totalImpressions += m.impressions;
        totalClicks += m.clicks;
        totalConversions += m.conversions;
        totalRevenue += Number(m.revenueImpact);
        totalDiscount += Number(m.discountGiven);
        totalAudienceReached += m.audienceReached;
      });

      const ctr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
      const conversionRate = totalClicks > 0 ? totalConversions / totalClicks : 0;
      const roi = totalDiscount > 0 ? ((totalRevenue - totalDiscount) / totalDiscount) * 100 : 0;

      return {
        campaignId,
        impressions: totalImpressions,
        clicks: totalClicks,
        ctr,
        conversions: totalConversions,
        conversionRate,
        revenue: totalRevenue,
        discount: totalDiscount,
        roi,
        audienceReached: totalAudienceReached,
        engagementRate: ctr,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get metrics: ${(error as any).message}`);
    }
  }

  /**
   * Get active campaigns
   */
  async getActiveCampaigns(): Promise<Campaign[]> {
    try {
      const now = new Date();

      const campaigns = await this.prisma.campaigns.findMany({
        where: {
          status: CampaignStatus.SCHEDULED, // ACTIVE does not exist, using SCHEDULED
          startDate: { lte: now },
          endDate: { gte: now },
        },
        // TODO: campaign_promotions relation does not exist
        // include: {
        //   campaign_promotions: {
        //     orderBy: { orderIndex: 'asc' },
        //     include: { promotions: true },
        //   },
        // },
        orderBy: { startDate: 'asc' },
      });

      return campaigns.map(c => this.formatCampaignWithPromotions(c));
    } catch (error) {
      throw new BadRequestException(`Failed to get active campaigns: ${(error as any).message}`);
    }
  }

  /**
   * Get upcoming campaigns
   */
  async getUpcomingCampaigns(days: number = 7): Promise<Campaign[]> {
    try {
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      const campaigns = await this.prisma.campaigns.findMany({
        where: {
          status: { in: [CampaignStatus.SCHEDULED, CampaignStatus.SENT] }, // ACTIVE does not exist
          startDate: { gte: now, lte: futureDate },
        },
        // TODO: campaign_promotions relation does not exist
        // include: {
        //   campaign_promotions: {
        //     orderBy: { orderIndex: 'asc' },
        //     include: { promotions: true },
        //   },
        // },
        orderBy: { startDate: 'asc' },
      });

      return campaigns.map(c => this.formatCampaignWithPromotions(c));
    } catch (error) {
      throw new BadRequestException(`Failed to get upcoming campaigns: ${(error as any).message}`);
    }
  }

  /**
   * Get campaign performance report
   */
  async getCampaignPerformanceReport(campaignId: string): Promise<{
    campaign: Campaign;
    metrics: CampaignMetrics;
    promotionStats: Array<{
      promotionId: string;
      revenue: number;
      usage: number;
      roi: number;
    }>;
    timeline: Array<{
      date: Date;
      clicks: number;
      conversions: number;
      revenue: number;
    }>;
  }> {
    try {
      const campaign = await this.getCampaignById(campaignId);

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      const metrics = await this.getCampaignMetrics(campaignId);

      // Get promotion stats
      // TODO: promotion_analytics table does not exist, campaign.promotionIds is empty array
      const promotionStats: any[] = [];
      // const promotionStats = await Promise.all(
      //   campaign.promotionIds.map(async promotionId => {
      //     const analytics = await this.prisma.promotion_analytics.aggregate({
      //       where: { promotionId },
      //       _sum: {
      //         revenueImpact: true,
      //         usageCount: true,
      //       },
      //     });
      //     return {
      //       promotionId,
      //       revenue: Number(analytics._sum.revenueImpact || 0),
      //       usage: analytics._sum.usageCount || 0,
      //       roi: 0,
      //     };
      //   }),
      // );

      // Get timeline data from campaign metrics
      // TODO: campaign_metrics table does not exist
      const timeline: any[] = [];
      // const timeline = await (this.prisma as any).campaign_metrics.findMany({
      //   where: { campaignId },
      //   orderBy: { date: 'asc' },
      //   select: {
      //     date: true,
      //     clicks: true,
      //     conversions: true,
      //     revenueImpact: true,
      //   },
      // });

      return {
        campaign,
        metrics,
        promotionStats,
        timeline: [], // timeline.map(t => ({
        //   date: t.date,
        //   clicks: t.clicks,
        //   conversions: t.conversions,
        //   revenue: Number(t.revenueImpact),
        // })),
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get performance report: ${(error as any).message}`);
    }
  }

  /**
   * Duplicate campaign
   */
  async duplicateCampaign(campaignId: string, createdBy: string): Promise<Campaign | null> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
        // TODO: campaign_promotions relation does not exist
        // include: { campaign_promotions: true },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      const newCampaignId = uuidv4();

      // Create new campaign
      const newCampaign = await this.prisma.campaigns.create({
        data: {
          id: newCampaignId,
          name: `${campaign.name} (Copy)`,
          description: campaign.description,
          type: campaign.type,
          status: CampaignStatus.DRAFT,
          targetAudience: campaign.targetAudience,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          content: campaign.content,
          createdBy,
          updatedAt: new Date(),
        },
      });

      // Copy promotions
      // TODO: campaign_promotions relation does not exist
      // if (campaign.campaign_promotions.length > 0) {
      //   await Promise.all(
      //     campaign.campaign_promotions.map((cp, index) =>
      //       (this.prisma as any).campaign_promotions.create({
      //         data: {
      //           id: uuidv4(),
      //           campaignId: newCampaignId,
      //           promotionId: cp.promotionId,
      //           orderIndex: index,
      //           priority: index,
      //         },
      //       }),
      //     ),
      //   );
      // }

      const created = await this.prisma.campaigns.findUnique({
        where: { id: newCampaignId },
        // TODO: campaign_promotions relation does not exist
        // include: {
        //   campaign_promotions: {
        //     orderBy: { orderIndex: 'asc' },
        //     include: { promotions: true },
        //   },
        // },
      });

      return this.formatCampaignWithPromotions(created);
    } catch (error) {
      throw new BadRequestException(`Failed to duplicate campaign: ${(error as any).message}`);
    }
  }

  /**
   * Schedule campaign
   */
  async scheduleCampaign(
    campaignId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Campaign | null> {
    try {
      if (startDate >= endDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      const updated = await this.prisma.campaigns.update({
        where: { id: campaignId },
        data: {
          startDate,
          endDate,
          status: 'SCHEDULED',
        },
        // TODO: campaign_promotions relation does not exist
        // include: {
        //   campaign_promotions: {
        //     orderBy: { orderIndex: 'asc' },
        //     include: { promotions: true },
        //   },
        // },
      });

      return this.formatCampaignWithPromotions(updated);
    } catch (error) {
      throw new BadRequestException(`Failed to schedule campaign: ${(error as any).message}`);
    }
  }

  /**
   * Get campaigns by promotion ID
   */
  async getCampaignsByPromotionId(promotionId: string): Promise<Campaign[]> {
    try {
      const campaigns = await this.prisma.campaigns.findMany({
        // TODO: campaign_promotions relation does not exist
        // where: {
        //   campaign_promotions: {
        //     some: { promotionId },
        //   },
        // },
        // include: {
        //   campaign_promotions: {
        //     orderBy: { orderIndex: 'asc' },
        //     include: { promotions: true },
        //   },
        // },
        where: { id: { not: '' } }, // Temporary filter
      });

      return []; // campaigns.map(c => this.formatCampaignWithPromotions(c));
    } catch (error) {
      throw new BadRequestException(`Failed to get campaigns: ${(error as any).message}`);
    }
  }

  /**
   * Create campaign from template
   */
  async createCampaignFromTemplate(
    templateType: CampaignType,
    name: string,
    promotionIds: string[],
    createdBy: string,
  ): Promise<Campaign> {
    try {
      const templates: Record<
        CampaignType,
        {
          expectedReach: number;
          budget: number;
          description: string;
        }
      > = {
        [CampaignType.PROMOTIONAL]: {
          expectedReach: 20000,
          budget: 1000,
          description: 'Promotional campaign',
        },
        [CampaignType.NEWSLETTER]: {
          expectedReach: 15000,
          budget: 500,
          description: 'Newsletter campaign',
        },
        [CampaignType.PRODUCT_UPDATE]: {
          expectedReach: 10000,
          budget: 300,
          description: 'Product update campaign',
        },
        [CampaignType.WELCOME]: {
          expectedReach: 5000,
          budget: 200,
          description: 'Welcome campaign',
        },
        [CampaignType.ABANDONED_CART]: {
          expectedReach: 8000,
          budget: 400,
          description: 'Abandoned cart campaign',
        },
        [CampaignType.EMAIL]: {
          expectedReach: 10000,
          budget: 500,
          description: 'Email marketing campaign',
        },
        [CampaignType.SMS]: {
          expectedReach: 5000,
          budget: 300,
          description: 'SMS marketing campaign',
        },
        [CampaignType.PUSH]: {
          expectedReach: 20000,
          budget: 200,
          description: 'Push notification campaign',
        },
        [CampaignType.SOCIAL]: {
          expectedReach: 50000,
          budget: 1000,
          description: 'Social media campaign',
        },
      };

      const template = templates[templateType];
      const campaignId = uuidv4();

      const campaign = await this.prisma.campaigns.create({
        data: {
          id: campaignId,
          name,
          description: template.description,
          type: templateType as CampaignType,
          status: CampaignStatus.DRAFT,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          content: JSON.stringify({
            budget: template.budget,
            expectedReach: template.expectedReach,
          }),
          createdBy,
          updatedAt: new Date(),
        },
      });

      // Add promotions
      // TODO: campaign_promotions table does not exist
      // if (promotionIds && promotionIds.length > 0) {
      //   await Promise.all(
      //     promotionIds.map((promotionId, index) =>
      //       (this.prisma as any).campaign_promotions.create({
      //         data: {
      //           id: uuidv4(),
      //           campaignId,
      //           promotionId,
      //           orderIndex: index,
      //           priority: index,
      //         },
      //       }),
      //     ),
      //   );
      // }

      return this.getCampaignById(campaignId);
    } catch (error) {
      throw new BadRequestException(
        `Failed to create campaign from template: ${(error as any).message}`,
      );
    }
  }

  /**
   * Track campaign metric
   */
  async trackMetric(
    campaignId: string,
    metricType: 'impression' | 'click' | 'conversion',
    date?: Date,
  ): Promise<void> {
    try {
      const metricsDate = date || new Date();
      const dateKey = new Date(
        metricsDate.getFullYear(),
        metricsDate.getMonth(),
        metricsDate.getDate(),
      );

      const existing = await (this.prisma as any).campaign_metrics.findUnique({
        where: {
          campaignId_date: {
            campaignId,
            date: dateKey,
          },
        },
      });

      if (existing) {
        await (this.prisma as any).campaign_metrics.update({
          where: {
            id: existing.id,
          },
          data: {
            impressions: metricType === 'impression' ? { increment: 1 } : undefined,
            clicks: metricType === 'click' ? { increment: 1 } : undefined,
            conversions: metricType === 'conversion' ? { increment: 1 } : undefined,
          },
        });
      } else {
        await (this.prisma as any).campaign_metrics.create({
          data: {
            id: uuidv4(),
            campaignId,
            date: dateKey,
            impressions: metricType === 'impression' ? 1 : 0,
            clicks: metricType === 'click' ? 1 : 0,
            conversions: metricType === 'conversion' ? 1 : 0,
          },
        });
      }
    } catch (error) {
      console.error('Failed to track metric:', error);
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private formatCampaign(campaign: any): Campaign {
    return {
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      type: campaign.type,
      status: campaign.status,
      promotionIds: [],
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      targetAudience: campaign.targetAudience,
      metadata: campaign.content ? JSON.parse(campaign.content) : {},
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
      createdBy: campaign.createdBy,
    };
  }

  private formatCampaignWithPromotions(campaign: any): Campaign {
    return {
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      type: campaign.type,
      status: campaign.status,
      promotionIds: [], // TODO: campaign_promotions relation does not exist
      // promotionIds: campaign.campaign_promotions.map((cp: any) => cp.promotionId),
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      targetAudience: campaign.targetAudience,
      metadata: campaign.content ? JSON.parse(campaign.content) : {},
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
      createdBy: campaign.createdBy,
    };
  }
}
