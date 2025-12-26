import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export interface CachedAnalytics {
  campaignId: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    discount: number;
    roi: number;
    ctr: number;
  };
  timestamp: Date;
  ttl: number; // Time to live in seconds
}

export interface AggregatedDashboardData {
  totalCampaigns: number;
  activeCampaigns: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  averageRoi: number;
  topPerformingCampaigns: Array<{
    id: string;
    name: string;
    roi: number;
    conversions: number;
  }>;
  recentActivity: Array<{
    date: Date;
    clicks: number;
    conversions: number;
    revenue: number;
  }>;
}

@Injectable()
export class PromotionAnalyticsCacheService {
  private readonly logger = new Logger(PromotionAnalyticsCacheService.name);
  private analyticsCache: Map<string, CachedAnalytics> = new Map();
  private dashboardCache: Map<string, AggregatedDashboardData> = new Map();
  private cacheTimestamps: Map<string, Date> = new Map();

  // Cache TTL in seconds
  private readonly ANALYTICS_TTL = 5 * 60; // 5 minutes
  private readonly DASHBOARD_TTL = 15 * 60; // 15 minutes
  private readonly DETAILED_TTL = 60 * 60; // 1 hour

  constructor(private prisma: PrismaService) {
    // Periodically clean expired cache
    this.startCacheCleanup();
  }

  /**
   * Get cached analytics for a campaign
   */
  async getCachedAnalytics(
    campaignId: string,
    forceRefresh: boolean = false,
  ): Promise<CachedAnalytics> {
    const cacheKey = `analytics:${campaignId}`;

    // Check if cache is valid
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      const cached = this.analyticsCache.get(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for ${cacheKey}`);
        return cached;
      }
    }

    // Cache miss or expired - fetch fresh data
    this.logger.debug(`Cache miss/expired for ${cacheKey}`);
    const metrics = await this.calculateCampaignMetrics(campaignId);

    const cached: CachedAnalytics = {
      campaignId,
      metrics,
      timestamp: new Date(),
      ttl: this.ANALYTICS_TTL,
    };

    this.analyticsCache.set(cacheKey, cached);
    this.cacheTimestamps.set(cacheKey, new Date());

    return cached;
  }

  /**
   * Get cached dashboard data
   */
  async getCachedDashboard(forceRefresh: boolean = false): Promise<AggregatedDashboardData> {
    const cacheKey = 'dashboard:main';

    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      const cached = this.dashboardCache.get(cacheKey);
      if (cached) {
        this.logger.debug('Dashboard cache hit');
        return cached;
      }
    }

    this.logger.debug('Dashboard cache miss/expired');
    const data = await this.aggregateDashboardData();

    this.dashboardCache.set(cacheKey, data);
    this.cacheTimestamps.set(cacheKey, new Date());

    return data;
  }

  /**
   * Get cached metrics for multiple campaigns
   */
  async getCachedBatchMetrics(campaignIds: string[]): Promise<Map<string, CachedAnalytics>> {
    const results = new Map<string, CachedAnalytics>();

    for (const campaignId of campaignIds) {
      const cached = await this.getCachedAnalytics(campaignId);
      results.set(campaignId, cached);
    }

    return results;
  }

  /**
   * Invalidate cache for a campaign
   */
  invalidateCache(campaignId: string): void {
    const cacheKey = `analytics:${campaignId}`;
    this.analyticsCache.delete(cacheKey);
    this.cacheTimestamps.delete(cacheKey);
    this.logger.debug(`Invalidated cache for ${cacheKey}`);
  }

  /**
   * Invalidate dashboard cache
   */
  invalidateDashboardCache(): void {
    this.dashboardCache.clear();
    this.cacheTimestamps.delete('dashboard:main');
    this.logger.debug('Invalidated dashboard cache');
  }

  /**
   * Invalidate all caches
   */
  invalidateAllCaches(): void {
    this.analyticsCache.clear();
    this.dashboardCache.clear();
    this.cacheTimestamps.clear();
    this.logger.debug('Cleared all caches');
  }

  /**
   * Get real-time metrics with optional caching
   */
  async getRealTimeMetrics(
    campaignId: string,
    useCache: boolean = true,
  ): Promise<{
    current: CachedAnalytics;
    trend: {
      impressions: number; // % change from previous hour
      clicks: number;
      conversions: number;
    };
  }> {
    const current = await this.getCachedAnalytics(campaignId, !useCache);

    // Compare with previous data point (simplified)
    const trend = {
      impressions: 5.2, // Placeholder
      clicks: 3.1,
      conversions: 2.8,
    };

    return { current, trend };
  }

  /**
   * Generate pre-computed reports
   */
  async generatePreComputedReport(
    campaignId: string,
    dateRange: {
      startDate: Date;
      endDate: Date;
    },
  ): Promise<{
    summary: {
      totalImpressions: number;
      totalClicks: number;
      totalConversions: number;
      averageCtr: number;
      totalRevenue: number;
    };
    daily: Array<{
      date: Date;
      impressions: number;
      clicks: number;
      conversions: number;
      revenue: number;
    }>;
    hourly: Array<{
      hour: string;
      clicks: number;
      conversions: number;
    }>;
  }> {
    try {
      // TODO: campaign_metrics table does not exist
      const metrics: any[] = []; // await this.prisma.campaign_metrics.findMany({
      //   where: {
      //     campaignId,
      //     date: {
      //       gte: dateRange.startDate,
      //       lte: dateRange.endDate,
      //     },
      //   },
      //   orderBy: { date: 'asc' },
      // });

      if (metrics.length === 0) {
        return {
          summary: {
            totalImpressions: 0,
            totalClicks: 0,
            totalConversions: 0,
            averageCtr: 0,
            totalRevenue: 0,
          },
          daily: [],
          hourly: [],
        };
      }

      // Calculate summary
      const summary = {
        totalImpressions: metrics.reduce((sum, m) => sum + m.impressions, 0),
        totalClicks: metrics.reduce((sum, m) => sum + m.clicks, 0),
        totalConversions: metrics.reduce((sum, m) => sum + m.conversions, 0),
        totalRevenue: metrics.reduce((sum, m) => sum + Number(m.revenueImpact), 0),
        averageCtr: 0,
      };

      summary.averageCtr =
        summary.totalImpressions > 0 ? (summary.totalClicks / summary.totalImpressions) * 100 : 0;

      const daily = metrics.map(m => ({
        date: m.date,
        impressions: m.impressions,
        clicks: m.clicks,
        conversions: m.conversions,
        revenue: Number(m.revenueImpact),
      }));

      // Generate hourly breakdown (simplified)
      const hourly = this.generateHourlyBreakdown(daily);

      return {
        summary,
        daily,
        hourly,
      };
    } catch (error) {
      this.logger.error(`Failed to generate report: ${(error as any).message}`);
      throw error;
    }
  }

  /**
   * Export analytics data
   */
  async exportAnalytics(
    campaignId: string,
    format: 'csv' | 'json' | 'xlsx',
    dateRange?: {
      startDate: Date;
      endDate: Date;
    },
  ): Promise<string | Buffer> {
    try {
      const startDate = dateRange?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = dateRange?.endDate || new Date();

      // TODO: campaign_metrics table does not exist
      const metrics: any[] = []; // await this.prisma.campaign_metrics.findMany({
      //   where: {
      //     campaignId,
      //     date: { gte: startDate, lte: endDate },
      //   },
      //   orderBy: { date: 'asc' },
      // });

      switch (format) {
        case 'csv':
          return this.convertToCsv(metrics);
        case 'json':
          return JSON.stringify(metrics, null, 2);
        case 'xlsx':
          // TODO: Implement XLSX export using xlsx library
          return JSON.stringify(metrics);
        default:
          throw new Error('Unsupported format');
      }
    } catch (error) {
      this.logger.error(`Export failed: ${(error as any).message}`);
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    analyticsCacheSize: number;
    dashboardCacheSize: number;
    cacheKeys: string[];
    oldestCacheEntry?: Date;
    newestCacheEntry?: Date;
  } {
    const analyticsCacheSize = this.analyticsCache.size;
    const dashboardCacheSize = this.dashboardCache.size;
    const timestamps = Array.from(this.cacheTimestamps.values()).sort(
      (a, b) => a.getTime() - b.getTime(),
    );

    return {
      analyticsCacheSize,
      dashboardCacheSize,
      cacheKeys: Array.from(this.cacheTimestamps.keys()),
      oldestCacheEntry: timestamps[0],
      newestCacheEntry: timestamps[timestamps.length - 1],
    };
  }

  /**
   * Warm up cache for commonly accessed campaigns
   */
  async warmUpCache(campaignIds: string[]): Promise<void> {
    try {
      this.logger.log(`Warming up cache for ${campaignIds.length} campaigns`);

      for (const campaignId of campaignIds) {
        await this.getCachedAnalytics(campaignId, true);
      }

      this.logger.log('Cache warm-up complete');
    } catch (error) {
      this.logger.error(`Cache warm-up failed: ${(error as any).message}`);
    }
  }

  /**
   * Get trending campaigns
   */
  async getTrendingCampaigns(limit: number = 10): Promise<
    Array<{
      campaignId: string;
      name: string;
      trend: number; // % growth
      impressions: number;
      clicks: number;
      conversions: number;
    }>
  > {
    try {
      const campaigns = await this.prisma.campaigns.findMany({
        where: { status: 'SENT' as any }, // 'ACTIVE' does not exist, use SENT
        // include: { campaign_metrics: { orderBy: { date: 'desc' }, take: 2 } }, // campaign_metrics does not exist
        take: limit,
      });

      return campaigns.map(c => {
        // TODO: campaign_metrics does not exist
        const trend = 0; // this.calculateTrend(c.campaign_metrics);
        const latest: any = null; // c.campaign_metrics[0];

        return {
          campaignId: c.id,
          name: c.name,
          trend,
          impressions: latest?.impressions || 0,
          clicks: latest?.clicks || 0,
          conversions: latest?.conversions || 0,
        };
      });
    } catch (error) {
      this.logger.error(`Failed to get trending campaigns: ${(error as any).message}`);
      return [];
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async calculateCampaignMetrics(campaignId: string): Promise<{
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    discount: number;
    roi: number;
    ctr: number;
  }> {
    // TODO: campaign_metrics table does not exist
    const metrics: any[] = []; // await this.prisma.campaign_metrics.findMany({
    //   where: { campaignId },
    // });

    if (metrics.length === 0) {
      return {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        discount: 0,
        roi: 0,
        ctr: 0,
      };
    }

    const impressions = metrics.reduce((sum, m) => sum + m.impressions, 0);
    const clicks = metrics.reduce((sum, m) => sum + m.clicks, 0);
    const conversions = metrics.reduce((sum, m) => sum + m.conversions, 0);
    const revenue = metrics.reduce((sum, m) => sum + Number(m.revenueImpact), 0);
    const discount = metrics.reduce((sum, m) => sum + Number(m.discountGiven), 0);

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const roi = discount > 0 ? ((revenue - discount) / discount) * 100 : 0;

    return {
      impressions,
      clicks,
      conversions,
      revenue,
      discount,
      roi,
      ctr,
    };
  }

  private async aggregateDashboardData(): Promise<AggregatedDashboardData> {
    const [campaigns, metrics] = await Promise.all([
      this.prisma.campaigns.findMany(),
      // TODO: campaign_metrics table does not exist
      [], // this.prisma.campaign_metrics.findMany({
      //   where: {
      //     date: {
      //       gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      //     },
      //   },
      //   orderBy: { date: 'asc' },
      // }),
    ]);

    // TODO: 'ACTIVE' status does not exist in CampaignStatus enum
    const activeCampaigns = campaigns.filter(c => c.status === ('SENT' as any)).length;

    const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0);
    const totalClicks = metrics.reduce((sum, m) => sum + m.clicks, 0);
    const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0);
    const totalRevenue = metrics.reduce((sum, m) => sum + Number(m.revenueImpact), 0);

    // Calculate ROI
    const totalDiscount = metrics.reduce((sum, m) => sum + Number(m.discountGiven), 0);
    const averageRoi =
      totalDiscount > 0 ? ((totalRevenue - totalDiscount) / totalDiscount) * 100 : 0;

    // Get top performing campaigns
    const topPerforming = await this.getTopPerformingCampaigns(5);

    // Group metrics by date for recent activity
    const recentActivity = this.groupMetricsByDate(metrics);

    return {
      totalCampaigns: campaigns.length,
      activeCampaigns,
      totalImpressions,
      totalClicks,
      totalConversions,
      totalRevenue,
      averageRoi,
      topPerformingCampaigns: topPerforming,
      recentActivity,
    };
  }

  private async getTopPerformingCampaigns(limit: number): Promise<
    Array<{
      id: string;
      name: string;
      roi: number;
      conversions: number;
    }>
  > {
    const campaigns = await this.prisma.campaigns.findMany({
      // include: { campaign_metrics: true }, // campaign_metrics does not exist
    });

    return campaigns
      .map(c => {
        // TODO: campaign_metrics does not exist
        const conversions = 0; // c.campaign_metrics.reduce((sum, m) => sum + m.conversions, 0);
        const revenue = 0; // c.campaign_metrics.reduce((sum, m) => sum + Number(m.revenueImpact), 0);
        const discount = 0; // c.campaign_metrics.reduce((sum, m) => sum + Number(m.discountGiven), 0);
        const roi = discount > 0 ? ((revenue - discount) / discount) * 100 : 0;

        return {
          id: c.id,
          name: c.name,
          roi,
          conversions,
        };
      })
      .sort((a, b) => b.roi - a.roi)
      .slice(0, limit);
  }

  private groupMetricsByDate(metrics: any[]): Array<{
    date: Date;
    clicks: number;
    conversions: number;
    revenue: number;
  }> {
    const grouped = new Map<string, any>();

    for (const metric of metrics) {
      const dateKey = metric.date.toISOString().split('T')[0];

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, {
          date: metric.date,
          clicks: 0,
          conversions: 0,
          revenue: 0,
        });
      }

      const entry = grouped.get(dateKey);
      entry.clicks += metric.clicks;
      entry.conversions += metric.conversions;
      entry.revenue += Number(metric.revenueImpact);
    }

    return Array.from(grouped.values()).slice(-30); // Last 30 days
  }

  private isCacheValid(cacheKey: string): boolean {
    const timestamp = this.cacheTimestamps.get(cacheKey);
    if (!timestamp) return false;

    const age = (Date.now() - timestamp.getTime()) / 1000;
    const ttl = cacheKey.startsWith('dashboard') ? this.DASHBOARD_TTL : this.ANALYTICS_TTL;

    return age < ttl;
  }

  private generateHourlyBreakdown(
    daily: any[],
  ): Array<{ hour: string; clicks: number; conversions: number }> {
    // Simplified hourly breakdown
    return daily.slice(-1).map((day, i) => ({
      hour: `${i}:00`,
      clicks: Math.floor(day.clicks / 24),
      conversions: Math.floor(day.conversions / 24),
    }));
  }

  private calculateTrend(metrics: any[]): number {
    if (metrics.length < 2) return 0;

    const current = metrics[0];
    const previous = metrics[1];

    const currentConversions = current?.conversions || 0;
    const previousConversions = previous?.conversions || 0;

    if (previousConversions === 0) return 0;

    return ((currentConversions - previousConversions) / previousConversions) * 100;
  }

  private convertToCsv(metrics: any[]): string {
    const headers = ['Date', 'Impressions', 'Clicks', 'Conversions', 'Revenue', 'Discount'];
    const rows = metrics.map(m => [
      m.date.toISOString().split('T')[0],
      m.impressions,
      m.clicks,
      m.conversions,
      Number(m.revenueImpact).toFixed(2),
      Number(m.discountGiven).toFixed(2),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private startCacheCleanup(): void {
    // Clean up expired cache entries every 5 minutes
    setInterval(
      () => {
        const now = new Date();
        const keysToDelete: string[] = [];

        for (const [key, timestamp] of this.cacheTimestamps.entries()) {
          const age = (now.getTime() - timestamp.getTime()) / 1000;
          const ttl = key.startsWith('dashboard') ? this.DASHBOARD_TTL : this.ANALYTICS_TTL;

          if (age >= ttl) {
            keysToDelete.push(key);
          }
        }

        for (const key of keysToDelete) {
          if (key.startsWith('dashboard')) {
            this.dashboardCache.delete(key);
          } else {
            this.analyticsCache.delete(key);
          }
          this.cacheTimestamps.delete(key);
        }

        if (keysToDelete.length > 0) {
          this.logger.debug(`Cleaned up ${keysToDelete.length} expired cache entries`);
        }
      },
      5 * 60 * 1000,
    );
  }
}
