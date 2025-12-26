import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Decimal } from '@prisma/client/runtime/library';

export interface AnalyticsData {
  promotionId: string;
  date: Date;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  revenueImpact?: number;
  discountGiven?: number;
  usageCount?: number;
  avgOrderValue?: number;
  conversionRate?: number;
  roi?: number;
}

@Injectable()
export class PromotionAnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Record or update analytics for a promotion on a specific date
   */
  async recordAnalytics(data: AnalyticsData) {
    const startOfDay = new Date(data.date);
    startOfDay.setHours(0, 0, 0, 0);

    // TODO: promotion_analytics table does not exist
    throw new Error('promotion_analytics table does not exist');
    // return this.prisma.promotion_analytics.upsert({
    //   where: {
    //     promotionId_date: {
    //       promotionId: data.promotionId,
    //       date: startOfDay,
    //     },
    //   },
    //   update: {
    //     impressions: data.impressions ?? undefined,
    //     clicks: data.clicks ?? undefined,
    //     conversions: data.conversions ?? undefined,
    //     revenueImpact: data.revenueImpact ? new Decimal(data.revenueImpact) : undefined,
    //     discountGiven: data.discountGiven ? new Decimal(data.discountGiven) : undefined,
    //     usageCount: data.usageCount ?? undefined,
    //     avgOrderValue: data.avgOrderValue ? new Decimal(data.avgOrderValue) : undefined,
    //     conversionRate: data.conversionRate ? new Decimal(data.conversionRate) : undefined,
    //     roi: data.roi ? new Decimal(data.roi) : undefined,
    //   },
    //   create: {
    //     id: uuidv4(),
    //     promotionId: data.promotionId,
    //     date: startOfDay,
    //     impressions: data.impressions ?? 0,
    //     clicks: data.clicks ?? 0,
    //     conversions: data.conversions ?? 0,
    //     revenueImpact: data.revenueImpact ? new Decimal(data.revenueImpact) : new Decimal(0),
    //     discountGiven: data.discountGiven ? new Decimal(data.discountGiven) : new Decimal(0),
    //     usageCount: data.usageCount ?? 0,
    //     avgOrderValue: data.avgOrderValue ? new Decimal(data.avgOrderValue) : undefined,
    //     conversionRate: data.conversionRate ? new Decimal(data.conversionRate) : undefined,
    //     roi: data.roi ? new Decimal(data.roi) : undefined,
    //   },
    // });
  }

  /**
   * Get analytics for a promotion over a date range
   */
  async getPromotionAnalytics(promotionId: string, startDate: Date, endDate: Date) {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    // TODO: promotion_analytics table does not exist
    return []; // return this.prisma.promotion_analytics.findMany({
    //   where: {
    //     promotionId,
    //     date: {
    //       gte: startOfDay,
    //       lte: endOfDay,
    //     },
    //   },
    //   orderBy: { date: 'asc' },
    // });
  }

  /**
   * Calculate aggregated metrics for a promotion
   */
  async getPromotionMetrics(promotionId: string, startDate?: Date, endDate?: Date) {
    const where: any = { promotionId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    // TODO: promotion_analytics table does not exist
    const analytics: any[] = []; // await this.prisma.promotion_analytics.findMany({
    //   where,
    // });

    const aggregated = {
      totalImpressions: analytics.reduce((sum, a) => sum + a.impressions, 0),
      totalClicks: analytics.reduce((sum, a) => sum + a.clicks, 0),
      totalConversions: analytics.reduce((sum, a) => sum + a.conversions, 0),
      totalRevenueImpact: analytics.reduce((sum, a) => sum + (Number(a.revenueImpact) || 0), 0),
      totalDiscountGiven: analytics.reduce((sum, a) => sum + (Number(a.discountGiven) || 0), 0),
      totalUsageCount: analytics.reduce((sum, a) => sum + a.usageCount, 0),
      averageOrderValue:
        analytics.length > 0
          ? analytics.reduce((sum, a) => sum + (Number(a.avgOrderValue) || 0), 0) / analytics.length
          : 0,
      overallConversionRate:
        analytics.length > 0
          ? analytics.reduce((sum, a) => sum + (Number(a.conversionRate) || 0), 0) /
            analytics.length
          : 0,
      roi:
        analytics.length > 0
          ? analytics.reduce((sum, a) => sum + (Number(a.roi) || 0), 0) / analytics.length
          : 0,
      clickThroughRate:
        analytics.reduce((sum, a) => sum + a.impressions, 0) > 0
          ? analytics.reduce((sum, a) => sum + a.clicks, 0) /
            analytics.reduce((sum, a) => sum + a.impressions, 0)
          : 0,
      conversionRate:
        analytics.reduce((sum, a) => sum + a.clicks, 0) > 0
          ? analytics.reduce((sum, a) => sum + a.conversions, 0) /
            analytics.reduce((sum, a) => sum + a.clicks, 0)
          : 0,
    };

    return aggregated;
  }

  /**
   * Get top performing promotions
   */
  async getTopPromotions(
    metric: 'revenue' | 'usage' | 'conversions' | 'roi' = 'revenue',
    limit: number = 10,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: any = {};

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    // TODO: promotion_analytics table does not exist
    const analytics: any[] = []; // await this.prisma.promotion_analytics.findMany({
    //   where,
    //   include: {
    //     promotion: {
    //       select: {
    //         id: true,
    //         code: true,
    //         name: true,
    //         type: true,
    //       },
    //     },
    //   },
    // });

    // Group by promotionId and calculate totals
    const grouped = analytics.reduce(
      (acc, a) => {
        if (!acc[a.promotionId]) {
          acc[a.promotionId] = {
            ...a.promotion,
            totalRevenue: 0,
            totalUsage: 0,
            totalConversions: 0,
            totalRoi: 0,
            dataPoints: 0,
          };
        }
        acc[a.promotionId].totalRevenue += Number(a.revenueImpact) || 0;
        acc[a.promotionId].totalUsage += a.usageCount;
        acc[a.promotionId].totalConversions += a.conversions;
        acc[a.promotionId].totalRoi += Number(a.roi) || 0;
        acc[a.promotionId].dataPoints += 1;
        return acc;
      },
      {} as Record<string, any>,
    );

    const sorted = Object.values(grouped).sort((a: any, b: any) => {
      switch (metric) {
        case 'revenue':
          return (b.totalRevenue || 0) - (a.totalRevenue || 0);
        case 'usage':
          return (b.totalUsage || 0) - (a.totalUsage || 0);
        case 'conversions':
          return (b.totalConversions || 0) - (a.totalConversions || 0);
        case 'roi':
          return (b.totalRoi || 0) / (b.dataPoints || 1) - (a.totalRoi || 0) / (a.dataPoints || 1);
        default:
          return 0;
      }
    });

    return sorted.slice(0, limit);
  }

  /**
   * Calculate daily trends for a promotion
   */
  async getTrends(promotionId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const analytics = await this.getPromotionAnalytics(promotionId, startDate, new Date());

    return analytics.map(a => ({
      date: a.date,
      impressions: a.impressions,
      clicks: a.clicks,
      conversions: a.conversions,
      revenue: Number(a.revenueImpact),
      discount: Number(a.discountGiven),
      ctr: a.impressions > 0 ? a.clicks / a.impressions : 0,
      cr: a.clicks > 0 ? a.conversions / a.clicks : 0,
    }));
  }

  /**
   * Get comparison between multiple promotions
   */
  async comparePromotions(promotionIds: string[], startDate: Date, endDate: Date) {
    const metrics: Record<string, any> = {};

    for (const promotionId of promotionIds) {
      metrics[promotionId] = await this.getPromotionMetrics(promotionId, startDate, endDate);
    }

    return metrics;
  }

  /**
   * Forecast promotion performance
   */
  async forecastPerformance(promotionId: string, days: number = 30) {
    const analytics = await this.getTrends(promotionId, 30);

    if (analytics.length === 0) {
      return null;
    }

    // Simple linear regression forecast
    const n = analytics.length;
    const avgImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0) / n;
    const avgConversions = analytics.reduce((sum, a) => sum + a.conversions, 0) / n;
    const avgRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0) / n;

    return {
      forecastedDays: days,
      projectedImpressions: Math.round(avgImpressions * days),
      projectedConversions: Math.round(avgConversions * days),
      projectedRevenue: avgRevenue * days,
      avgDailyImpressions: avgImpressions,
      avgDailyConversions: avgConversions,
      avgDailyRevenue: avgRevenue,
    };
  }
}
