import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PromotionAnalyticsService } from './promotion-analytics.service';
import { PromotionReportingService } from './promotion-reporting.service';
import { v4 as uuidv4 } from 'uuid';

export interface DashboardCard {
  id: string;
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: string;
  color?: string;
  action?: string;
}

export interface PromotionPreview {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: string;
  value: number;
  isActive: boolean;
  startsAt?: Date;
  expiresAt?: Date;
  estimatedSavings?: number;
  applicableProductCount?: number;
  estimatedReach?: number;
  conversionRate?: number;
}

export interface BulkEditOperation {
  id: string;
  type: 'UPDATE' | 'ACTIVATE' | 'DEACTIVATE' | 'DELETE' | 'EXTEND';
  promotionIds: string[];
  changes?: Record<string, any>;
  executedAt?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  results?: {
    success: string[];
    failed: string[];
    errors?: Record<string, string>;
  };
}

export interface ExportFormat {
  format: 'CSV' | 'EXCEL' | 'JSON' | 'PDF';
  filters?: any;
  includeAnalytics?: boolean;
  includeAuditLogs?: boolean;
}

export interface DashboardFilters {
  search?: string;
  status?: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
  type?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minRevenue?: number;
  maxRevenue?: number;
  sortBy?: 'name' | 'created' | 'revenue' | 'usage';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable()
export class PromotionDashboardService {
  constructor(
    private prisma: PrismaService,
    private analyticsService: PromotionAnalyticsService,
    private reportingService: PromotionReportingService,
  ) {}

  /**
   * Get dashboard overview with key metrics
   */
  async getDashboardOverview(): Promise<{
    cards: DashboardCard[];
    topPromotions: PromotionPreview[];
    recentActivity: any[];
  }> {
    const metrics = await this.reportingService.getDashboardMetrics();

    const cards: DashboardCard[] = [
      {
        id: 'total-promotions',
        title: 'Total Promotions',
        value: metrics.totalPromotions,
        icon: 'gift',
        color: 'blue',
      },
      {
        id: 'active-promotions',
        title: 'Active Promotions',
        value: metrics.activePromotions,
        icon: 'check-circle',
        color: 'green',
      },
      {
        id: 'total-revenue',
        title: 'Total Revenue Impact',
        value: `$${(metrics.totalRevenue / 100).toFixed(2)}`,
        icon: 'trending-up',
        color: 'purple',
      },
      {
        id: 'avg-roi',
        title: 'Average ROI',
        value: `${(metrics.averageRoi * 100).toFixed(1)}%`,
        icon: 'bar-chart',
        color: 'orange',
      },
      {
        id: 'total-usage',
        title: 'Total Usage',
        value: metrics.totalUsage,
        icon: 'repeat',
        color: 'cyan',
      },
      {
        id: 'total-discount',
        title: 'Total Discount Given',
        value: `$${(metrics.totalDiscount / 100).toFixed(2)}`,
        icon: 'percent',
        color: 'red',
      },
    ];

    // Get top performing promotions
    const reports = await this.reportingService.generateReport();
    const topPromotions = reports.slice(0, 5).map(r => ({
      id: r.promotionId,
      code: r.code,
      name: r.name,
      description: undefined,
      type: r.type,
      value: r.revenue,
      isActive: r.status === 'ACTIVE',
      conversionRate: r.conversionRate,
    }));

    // Recent activity (placeholder)
    const recentActivity = [];

    return {
      cards,
      topPromotions,
      recentActivity,
    };
  }

  /**
   * Get paginated promotions list with filters
   */
  async getPromotionsList(filters?: DashboardFilters): Promise<PaginatedResult<PromotionPreview>> {
    const {
      search = '',
      status,
      type,
      dateFrom,
      dateTo,
      sortBy = 'created',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = filters || {};

    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Status filter
    if (status) {
      const now = new Date();
      if (status === 'ACTIVE') {
        where.isActive = true;
        where.expiresAt = { gt: now };
      } else if (status === 'EXPIRED') {
        where.expiresAt = { lt: now };
      } else if (status === 'DRAFT') {
        where.isActive = false;
      }
    }

    // Type filter
    if (type) {
      where.type = type;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = dateFrom;
      }
      if (dateTo) {
        where.createdAt.lte = dateTo;
      }
    }

    // Count total
    const total = await this.prisma.promotions.count({ where });

    // Sort configuration
    const sortConfig: any = {};
    if (sortBy === 'revenue') {
      // Note: Revenue requires analytics join, using creation date as fallback
      sortConfig.createdAt = sortOrder;
    } else {
      sortConfig[sortBy === 'created' ? 'createdAt' : sortBy] = sortOrder;
    }

    // Get paginated results
    const skip = (page - 1) * limit;
    const promotions = await this.prisma.promotions.findMany({
      where,
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        type: true,
        value: true,
        isActive: true,
        starts_at: true,
        expiresAt: true,
      },
      orderBy: sortConfig,
      skip,
      take: limit,
    });

    // Enrich with analytics
    const enriched: PromotionPreview[] = await Promise.all(
      promotions.map(async promo => {
        const metrics = await this.analyticsService.getPromotionMetrics(promo.id);

        return {
          id: promo.id,
          code: promo.code,
          name: promo.name,
          description: promo.description || undefined,
          type: promo.type,
          value: Number(promo.value),
          isActive: promo.isActive,
          startsAt: promo.starts_at,
          expiresAt: promo.expiresAt,
          estimatedSavings: metrics.totalDiscountGiven,
          applicableProductCount: 0, // Would need products join
          estimatedReach: metrics.totalUsageCount,
          conversionRate: metrics.overallConversionRate,
        };
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: enriched,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  /**
   * Get detailed preview of a promotion
   */
  async getPromotionPreview(promotionId: string): Promise<PromotionPreview> {
    const promotion = await this.prisma.promotions.findUnique({
      where: { id: promotionId },
      // TODO: Add products relation if needed
      // include: {
      //   products: {
      //     select: { productId: true },
      //   },
      // },
    });

    if (!promotion) {
      throw new Error('Promotion not found');
    }

    const metrics = await this.analyticsService.getPromotionMetrics(promotionId);

    return {
      id: promotion.id,
      code: promotion.code,
      name: promotion.name,
      description: promotion.description || undefined,
      type: promotion.type,
      value: Number(promotion.value),
      isActive: promotion.isActive,
      startsAt: promotion.starts_at,
      expiresAt: promotion.expiresAt,
      estimatedSavings: metrics.totalDiscountGiven,
      applicableProductCount: 0, // TODO: Add products relation if needed
      estimatedReach: metrics.totalUsageCount,
      conversionRate: metrics.overallConversionRate,
    };
  }

  /**
   * Preview bulk edit operation without executing
   */
  async previewBulkEdit(
    promotionIds: string[],
    changes: Record<string, any>,
  ): Promise<{
    affectedCount: number;
    preview: Record<string, any>[];
  }> {
    const promotions = await this.prisma.promotions.findMany({
      where: { id: { in: promotionIds } },
      select: {
        id: true,
        code: true,
        name: true,
        type: true,
        value: true,
        isActive: true,
        expiresAt: true,
      },
      take: 10, // Limit preview to first 10
    });

    const preview = promotions.map(promo => ({
      id: promo.id,
      code: promo.code,
      name: promo.name,
      current: {
        type: promo.type,
        value: promo.value,
        isActive: promo.isActive,
        expiresAt: promo.expiresAt,
      },
      updated: {
        type: changes.type || promo.type,
        value: changes.value || promo.value,
        isActive: changes.isActive !== undefined ? changes.isActive : promo.isActive,
        expiresAt: changes.expiresAt || promo.expiresAt,
      },
    }));

    return {
      affectedCount: promotionIds.length,
      preview,
    };
  }

  /**
   * Execute bulk edit operation
   */
  async executeBulkEdit(
    promotionIds: string[],
    changes: Record<string, any>,
    userId: string,
  ): Promise<BulkEditOperation> {
    const operationId = uuidv4();
    const operation: BulkEditOperation = {
      id: operationId,
      type: 'UPDATE',
      promotionIds,
      changes,
      status: 'IN_PROGRESS',
      results: {
        success: [],
        failed: [],
        errors: {},
      },
    };

    try {
      for (const promotionId of promotionIds) {
        try {
          const updateData: any = {};

          // Map changes to database fields
          if (changes.type !== undefined) updateData.type = changes.type;
          if (changes.value !== undefined) updateData.value = Math.round(Number(changes.value));
          if (changes.isActive !== undefined) updateData.isActive = changes.isActive;
          if (changes.expiresAt !== undefined) {
            updateData.expiresAt = new Date(changes.expiresAt);
          }
          if (changes.name !== undefined) updateData.name = changes.name;
          if (changes.description !== undefined) updateData.description = changes.description;
          if (changes.code !== undefined) updateData.code = changes.code;
          if (changes.minOrderAmount !== undefined)
            updateData.minOrderAmount = Math.round(Number(changes.minOrderAmount));
          if (changes.maxDiscount !== undefined)
            updateData.maxDiscount = Math.round(Number(changes.maxDiscount));

          updateData.updatedAt = new Date();

          await this.prisma.promotions.update({
            where: { id: promotionId },
            data: updateData,
          });

          operation.results!.success.push(promotionId);
        } catch (error: any) {
          operation.results!.failed.push(promotionId);
          operation.results!.errors![promotionId] = error.message;
        }
      }

      operation.status = 'COMPLETED';
      operation.executedAt = new Date();
    } catch (error: any) {
      operation.status = 'FAILED';
      operation.executedAt = new Date();
    }

    return operation;
  }

  /**
   * Bulk activate promotions
   */
  async bulkActivate(promotionIds: string[]): Promise<{
    activated: number;
    failed: number;
    errors?: Record<string, string>;
  }> {
    let activated = 0;
    const errors: Record<string, string> = {};

    for (const id of promotionIds) {
      try {
        await this.prisma.promotions.update({
          where: { id },
          data: { isActive: true, updatedAt: new Date() },
        });
        activated++;
      } catch (error: any) {
        errors[id] = error.message;
      }
    }

    return {
      activated,
      failed: promotionIds.length - activated,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  }

  /**
   * Bulk deactivate promotions
   */
  async bulkDeactivate(promotionIds: string[]): Promise<{
    deactivated: number;
    failed: number;
    errors?: Record<string, string>;
  }> {
    let deactivated = 0;
    const errors: Record<string, string> = {};

    for (const id of promotionIds) {
      try {
        await this.prisma.promotions.update({
          where: { id },
          data: { isActive: false, updatedAt: new Date() },
        });
        deactivated++;
      } catch (error: any) {
        errors[id] = error.message;
      }
    }

    return {
      deactivated,
      failed: promotionIds.length - deactivated,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  }

  /**
   * Bulk delete promotions
   */
  async bulkDelete(promotionIds: string[]): Promise<{
    deleted: number;
    failed: number;
    errors?: Record<string, string>;
  }> {
    let deleted = 0;
    const errors: Record<string, string> = {};

    for (const id of promotionIds) {
      try {
        await this.prisma.promotions.delete({
          where: { id },
        });
        deleted++;
      } catch (error: any) {
        errors[id] = error.message;
      }
    }

    return {
      deleted,
      failed: promotionIds.length - deleted,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  }

  /**
   * Extend promotion expiration dates
   */
  async bulkExtendExpiration(
    promotionIds: string[],
    days: number = 30,
  ): Promise<{
    extended: number;
    failed: number;
    errors?: Record<string, string>;
  }> {
    let extended = 0;
    const errors: Record<string, string> = {};
    const newExpiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    for (const id of promotionIds) {
      try {
        await this.prisma.promotions.update({
          where: { id },
          data: {
            expiresAt: newExpiryDate,
            updatedAt: new Date(),
          },
        });
        extended++;
      } catch (error: any) {
        errors[id] = error.message;
      }
    }

    return {
      extended,
      failed: promotionIds.length - extended,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  }

  /**
   * Export promotions data in various formats
   */
  async exportPromotions(
    promotionIds: string[],
    format: 'CSV' | 'JSON' = 'CSV',
    includeAnalytics: boolean = false,
  ): Promise<string> {
    const promotions = await this.prisma.promotions.findMany({
      where: { id: { in: promotionIds } },
    });

    if (format === 'JSON') {
      return this.exportAsJSON(promotions, includeAnalytics);
    } else {
      return this.exportAsCSV(promotions, includeAnalytics);
    }
  }

  /**
   * Get export templates
   */
  getExportTemplates(): Record<string, any> {
    return {
      FULL_EXPORT: {
        name: 'Full Promotion Export',
        description: 'All promotion data with analytics',
        includeFields: [
          'id',
          'code',
          'name',
          'description',
          'type',
          'value',
          'isActive',
          'startsAt',
          'expiresAt',
          'revenue',
          'conversions',
          'roi',
        ],
      },
      BASIC_EXPORT: {
        name: 'Basic Promotion Export',
        description: 'Essential promotion information only',
        includeFields: ['code', 'name', 'type', 'value', 'isActive', 'expiresAt'],
      },
      ANALYTICS_EXPORT: {
        name: 'Analytics Export',
        description: 'Performance metrics and KPIs',
        includeFields: [
          'code',
          'name',
          'revenue',
          'discount_given',
          'usage_count',
          'conversion_rate',
          'roi',
        ],
      },
      COMPLIANCE_EXPORT: {
        name: 'Compliance Export',
        description: 'For audit and compliance purposes',
        includeFields: [
          'code',
          'name',
          'created_date',
          'created_by',
          'modified_date',
          'modified_by',
          'status',
        ],
      },
    };
  }

  /**
   * Get available quick filters
   */
  getQuickFilters(): Record<string, any> {
    return {
      active: {
        label: 'Active Promotions',
        filter: { status: 'ACTIVE' },
      },
      expired: {
        label: 'Expired Promotions',
        filter: { status: 'EXPIRED' },
      },
      draft: {
        label: 'Draft Promotions',
        filter: { status: 'DRAFT' },
      },
      highRevenue: {
        label: 'High Revenue (>$1000)',
        filter: { minRevenue: 100000 }, // in cents
      },
      lowUsage: {
        label: 'Low Usage (<10 times)',
        filter: { maxRevenue: 1000 }, // placeholder
      },
      expiringThisMonth: {
        label: 'Expiring This Month',
        filter: { dateFrom: new Date(), dateTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      },
    };
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStatistics(): Promise<{
    totalPromotions: number;
    activePromotions: number;
    expiredPromotions: number;
    draftPromotions: number;
    promotionsByType: Record<string, number>;
    promotionsByStatus: Record<string, number>;
  }> {
    const now = new Date();

    const [total, active, expired, draft, byType] = await Promise.all([
      this.prisma.promotions.count(),
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
      this.prisma.promotions.count({
        where: {
          isActive: false,
        },
      }),
      this.prisma.promotions.groupBy({
        by: ['type'],
        _count: true,
      }),
    ]);

    const typeMap: Record<string, number> = {};
    byType.forEach(item => {
      typeMap[item.type] = item._count;
    });

    return {
      totalPromotions: total,
      activePromotions: active,
      expiredPromotions: expired,
      draftPromotions: draft,
      promotionsByType: typeMap,
      promotionsByStatus: {
        active,
        expired,
        draft,
      },
    };
  }

  /**
   * Private helper methods
   */

  private async exportAsCSV(promotions: any[], includeAnalytics: boolean): Promise<string> {
    const headers = ['Code', 'Name', 'Type', 'Value', 'Active', 'Expires At', 'Created At'];

    if (includeAnalytics) {
      headers.push('Revenue', 'Discount', 'Usage Count', 'ROI');
    }

    const rows = await Promise.all(
      promotions.map(async promo => {
        const row = [
          promo.code,
          promo.name,
          promo.type,
          promo.value,
          promo.isActive ? 'Yes' : 'No',
          promo.expiresAt?.toISOString().split('T')[0] || 'N/A',
          promo.createdAt.toISOString().split('T')[0],
        ];

        if (includeAnalytics) {
          const metrics = await this.analyticsService.getPromotionMetrics(promo.id);
          row.push(
            metrics.totalRevenueImpact.toString(),
            metrics.totalDiscountGiven.toString(),
            metrics.totalUsageCount.toString(),
            ((metrics.roi || 0) * 100).toFixed(2),
          );
        }

        return row;
      }),
    );

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

  private async exportAsJSON(promotions: any[], includeAnalytics: boolean): Promise<string> {
    const data = await Promise.all(
      promotions.map(async promo => {
        const obj: any = {
          code: promo.code,
          name: promo.name,
          type: promo.type,
          value: promo.value,
          isActive: promo.isActive,
          expiresAt: promo.expiresAt,
          createdAt: promo.createdAt,
        };

        if (includeAnalytics) {
          const metrics = await this.analyticsService.getPromotionMetrics(promo.id);
          obj.analytics = {
            revenue: metrics.totalRevenueImpact,
            discount: metrics.totalDiscountGiven,
            usage: metrics.totalUsageCount,
            roi: metrics.roi,
          };
        }

        return obj;
      }),
    );

    return JSON.stringify(data, null, 2);
  }
}
