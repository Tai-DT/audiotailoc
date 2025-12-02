import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PromotionAnalyticsService } from './promotion-analytics.service';

export interface ReportFilter {
  startDate?: Date;
  endDate?: Date;
  promotionType?: string;
  status?: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
  minRevenue?: number;
  maxRevenue?: number;
}

export interface PromotionReport {
  promotionId: string;
  code: string;
  name: string;
  type: string;
  status: string;
  revenue: number;
  discount: number;
  usage: number;
  roi: number;
  conversionRate: number;
  avgOrderValue: number;
}

export interface DashboardMetrics {
  totalPromotions: number;
  activePromotions: number;
  expiredPromotions: number;
  totalRevenue: number;
  totalDiscount: number;
  totalUsage: number;
  averageRoi: number;
  topPromotion: PromotionReport | null;
  metrics30Days: {
    revenue: number;
    discount: number;
    usage: number;
  };
}

@Injectable()
export class PromotionReportingService {
  constructor(
    private prisma: PrismaService,
    private analyticsService: PromotionAnalyticsService,
  ) {}

  /**
   * Generate comprehensive promotion report
   */
  async generateReport(filters?: ReportFilter): Promise<PromotionReport[]> {
    const promotions = await this.prisma.promotions.findMany({
      where: {
        ...(filters?.promotionType && { type: filters.promotionType }),
        ...(filters?.startDate && { createdAt: { gte: filters.startDate } }),
        ...(filters?.endDate && { createdAt: { lte: filters.endDate } }),
      },
    });

    const reports: PromotionReport[] = [];

    for (const promo of promotions) {
      const metrics = await this.analyticsService.getPromotionMetrics(promo.id);
      const status = this.getPromotionStatus(promo);

      if (filters?.status && filters.status !== status) {
        continue;
      }

      const report: PromotionReport = {
        promotionId: promo.id,
        code: promo.code,
        name: promo.name,
        type: promo.type,
        status,
        revenue: metrics.totalRevenueImpact,
        discount: metrics.totalDiscountGiven,
        usage: metrics.totalUsageCount,
        roi: metrics.roi || 0,
        conversionRate: metrics.overallConversionRate || 0,
        avgOrderValue: metrics.averageOrderValue || 0,
      };

      if (!filters?.minRevenue || report.revenue >= filters.minRevenue) {
        if (!filters?.maxRevenue || report.revenue <= filters.maxRevenue) {
          reports.push(report);
        }
      }
    }

    return reports.sort((a, b) => b.revenue - a.revenue);
  }

  /**
   * Get dashboard metrics overview
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [allPromotions, activeCount, expiredCount] = await Promise.all([
      this.prisma.promotions.findMany(),
      this.prisma.promotions.count({
        where: {
          isActive: true,
          expiresAt: { gt: now },
        },
      }),
      this.prisma.promotions.count({
        where: {
          expiresAt: { lt: now },
        },
      }),
    ]);

    let totalRevenue = 0;
    let totalDiscount = 0;
    let totalUsage = 0;
    let totalRoi = 0;
    let topPromotion: PromotionReport | null = null;

    for (const promo of allPromotions) {
      const metrics = await this.analyticsService.getPromotionMetrics(promo.id);
      totalRevenue += metrics.totalRevenueImpact;
      totalDiscount += metrics.totalDiscountGiven;
      totalUsage += metrics.totalUsageCount;
      totalRoi += metrics.roi || 0;

      if (!topPromotion || metrics.totalRevenueImpact > topPromotion.revenue) {
        topPromotion = {
          promotionId: promo.id,
          code: promo.code,
          name: promo.name,
          type: promo.type,
          status: this.getPromotionStatus(promo),
          revenue: metrics.totalRevenueImpact,
          discount: metrics.totalDiscountGiven,
          usage: metrics.totalUsageCount,
          roi: metrics.roi || 0,
          conversionRate: metrics.overallConversionRate || 0,
          avgOrderValue: metrics.averageOrderValue || 0,
        };
      }
    }

    // Get 30-day metrics
    const metrics30Days = await this.analyticsService.getPromotionMetrics(
      allPromotions[0]?.id || '',
      thirtyDaysAgo,
      now,
    );

    return {
      totalPromotions: allPromotions.length,
      activePromotions: activeCount,
      expiredPromotions: expiredCount,
      totalRevenue,
      totalDiscount,
      totalUsage,
      averageRoi: allPromotions.length > 0 ? totalRoi / allPromotions.length : 0,
      topPromotion,
      metrics30Days: {
        revenue: metrics30Days.totalRevenueImpact,
        discount: metrics30Days.totalDiscountGiven,
        usage: metrics30Days.totalUsageCount,
      },
    };
  }

  /**
   * Export promotions to CSV format
   */
  async exportToCSV(filters?: ReportFilter): Promise<string> {
    const reports = await this.generateReport(filters);

    const headers = [
      'Promotion Code',
      'Name',
      'Type',
      'Status',
      'Revenue',
      'Discount Given',
      'Times Used',
      'ROI',
      'Conversion Rate',
      'Avg Order Value',
    ];

    const rows = reports.map(report => [
      report.code,
      report.name,
      report.type,
      report.status,
      report.revenue.toFixed(2),
      report.discount.toFixed(2),
      report.usage.toString(),
      (report.roi * 100).toFixed(2) + '%',
      (report.conversionRate * 100).toFixed(2) + '%',
      report.avgOrderValue.toFixed(2),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row
          .map(cell => (typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell))
          .join(','),
      ),
    ].join('\n');

    return csvContent;
  }

  /**
   * Export promotions to JSON format
   */
  async exportToJSON(filters?: ReportFilter): Promise<string> {
    const reports = await this.generateReport(filters);
    return JSON.stringify(reports, null, 2);
  }

  /**
   * Get performance comparison between promotions
   */
  async getPerformanceComparison(promotionIds: string[], startDate?: Date, endDate?: Date) {
    const metrics: Record<string, any> = {};

    for (const promotionId of promotionIds) {
      const promo = await this.prisma.promotions.findUnique({
        where: { id: promotionId },
      });

      if (!promo) continue;

      const promoMetrics = await this.analyticsService.getPromotionMetrics(
        promotionId,
        startDate,
        endDate,
      );

      metrics[promotionId] = {
        code: promo.code,
        name: promo.name,
        ...promoMetrics,
      };
    }

    return metrics;
  }

  /**
   * Get promotion efficiency score
   */
  async getEfficiencyScore(promotionId: string): Promise<{
    score: number;
    rating: string;
    breakdown: Record<string, number>;
  }> {
    const promo = await this.prisma.promotions.findUnique({
      where: { id: promotionId },
    });

    if (!promo) {
      throw new Error('Promotion not found');
    }

    const metrics = await this.analyticsService.getPromotionMetrics(promotionId);

    const breakdown: Record<string, number> = {
      revenue: metrics.totalRevenueImpact > 0 ? 25 : 0,
      usage: Math.min(metrics.totalUsageCount / 100, 25),
      roi: Math.min((metrics.roi || 0) * 25, 25),
      conversion: Math.min(metrics.overallConversionRate * 25, 25),
    };

    const score = Object.values(breakdown).reduce((a, b) => a + b, 0);
    const rating = this.getRating(score);

    return {
      score: Math.round(score),
      rating,
      breakdown,
    };
  }

  /**
   * Get promotion ROI analysis
   */
  async getROIAnalysis(promotionId: string) {
    const promo = await this.prisma.promotions.findUnique({
      where: { id: promotionId },
    });

    if (!promo) {
      throw new Error('Promotion not found');
    }

    const metrics = await this.analyticsService.getPromotionMetrics(promotionId);

    const costOfPromotion = metrics.totalDiscountGiven; // Assume discount is the cost
    const revenue = metrics.totalRevenueImpact;
    const profit = revenue - costOfPromotion;
    const roi = costOfPromotion > 0 ? (profit / costOfPromotion) * 100 : 0;

    return {
      promotionId,
      code: promo.code,
      name: promo.name,
      totalRevenue: revenue,
      totalCost: costOfPromotion,
      totalProfit: profit,
      roi: roi.toFixed(2) + '%',
      paybackPeriod: this.calculatePaybackPeriod(metrics),
      profitability: profit > 0 ? 'PROFITABLE' : 'NOT_PROFITABLE',
    };
  }

  /**
   * Get promotion effectiveness over time
   */
  async getEffectivenessTimeSeries(promotionId: string, days: number = 30) {
    const trends = await this.analyticsService.getTrends(promotionId, days);

    return trends.map(day => ({
      date: day.date,
      impressions: day.impressions,
      clicks: day.clicks,
      ctr: (day.ctr * 100).toFixed(2) + '%',
      conversions: day.conversions,
      conversionRate: (day.cr * 100).toFixed(2) + '%',
      revenue: day.revenue,
      discount: day.discount,
    }));
  }

  /**
   * Get segment analysis
   */
  async getSegmentAnalysis() {
    const promotions = await this.prisma.promotions.findMany({
      where: {
        // customerSegment field does not exist in schema
        // customerSegment: { not: null },
      },
    });

    const segments: Record<string, any> = {};

    for (const promo of promotions) {
      const segment = 'unknown'; // customerSegment field does not exist in schema

      if (!segments[segment]) {
        segments[segment] = {
          segment,
          promotions: [],
          totalRevenue: 0,
          totalUsage: 0,
        };
      }

      const metrics = await this.analyticsService.getPromotionMetrics(promo.id);

      segments[segment].promotions.push({
        code: promo.code,
        name: promo.name,
        revenue: metrics.totalRevenueImpact,
      });

      segments[segment].totalRevenue += metrics.totalRevenueImpact;
      segments[segment].totalUsage += metrics.totalUsageCount;
    }

    return Object.values(segments);
  }

  /**
   * Get monthly comparison
   */
  async getMonthlyComparison(): Promise<
    Array<{
      month: string;
      revenue: number;
      discount: number;
      usage: number;
      roi: number;
    }>
  > {
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      // TODO: promotion_analytics table does not exist in schema
      const analytics: any[] = [];
      // const analytics = await this.prisma.promotion_analytics.findMany({
      //   where: {
      //     date: {
      //       gte: monthStart,
      //       lte: monthEnd,
      //     },
      //   },
      // });

      const revenue = analytics.reduce((sum, a) => sum + Number(a.revenueImpact), 0);
      const discount = analytics.reduce((sum, a) => sum + Number(a.discountGiven), 0);
      const usage = analytics.reduce((sum, a) => sum + a.usageCount, 0);
      const roi =
        analytics.length > 0
          ? analytics.reduce((sum, a) => sum + (Number(a.roi) || 0), 0) / analytics.length
          : 0;

      months.push({
        month: monthStart.toLocaleString('vi-VN', {
          month: 'long',
          year: 'numeric',
        }),
        revenue,
        discount,
        usage,
        roi,
      });
    }

    return months;
  }

  /**
   * Get recommendations based on analytics
   */
  async getRecommendations(): Promise<
    Array<{
      type: string;
      priority: 'HIGH' | 'MEDIUM' | 'LOW';
      message: string;
    }>
  > {
    const recommendations = [];
    const dashboardMetrics = await this.getDashboardMetrics();

    // Check for underperforming promotions
    if (dashboardMetrics.totalPromotions > 0) {
      const reports = await this.generateReport();
      const avgRevenue = dashboardMetrics.totalRevenue / dashboardMetrics.totalPromotions;

      for (const report of reports) {
        if (report.revenue < avgRevenue * 0.5) {
          recommendations.push({
            type: 'LOW_PERFORMANCE',
            priority: 'MEDIUM',
            message: `Promotion "${report.code}" is underperforming. Consider adjusting its value or conditions.`,
          });
        }
      }
    }

    // Check for expiring promotions
    const expiringPromos = await this.prisma.promotions.findMany({
      where: {
        expiresAt: {
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          gt: new Date(),
        },
      },
    });

    if (expiringPromos.length > 0) {
      recommendations.push({
        type: 'EXPIRING_SOON',
        priority: 'HIGH',
        message: `${expiringPromos.length} promotion(s) will expire within 7 days. Consider extending or creating new ones.`,
      });
    }

    // Check for unused promotions
    const unusedPromos = await this.prisma.promotions.findMany({
      where: {
        usage_count: 0,
        isActive: true,
      },
    });

    if (unusedPromos.length > 0) {
      recommendations.push({
        type: 'UNUSED_PROMOTIONS',
        priority: 'MEDIUM',
        message: `${unusedPromos.length} active promotion(s) have not been used yet. They might not be visible enough.`,
      });
    }

    return recommendations;
  }

  /**
   * Private helper methods
   */

  private getPromotionStatus(promo: any): 'ACTIVE' | 'EXPIRED' | 'DRAFT' {
    const now = new Date();

    if (!promo.isActive) return 'DRAFT';
    if (promo.expiresAt && promo.expiresAt < now) return 'EXPIRED';

    return 'ACTIVE';
  }

  private getRating(score: number): string {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 50) return 'FAIR';
    if (score >= 30) return 'POOR';
    return 'VERY_POOR';
  }

  private calculatePaybackPeriod(metrics: any): string {
    const dailyRevenue = metrics.totalRevenueImpact / 30; // Assume 30 days of data
    const totalCost = metrics.totalDiscountGiven;

    if (dailyRevenue <= 0) return 'N/A';

    const days = Math.ceil(totalCost / dailyRevenue);
    return `${days} days`;
  }
}
