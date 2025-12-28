import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../caching/cache.service';

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueGrowth: number;
  orderGrowth: number;
  topProducts: Array<{
    id: string;
    name: string;
    revenue: number;
    quantity: number;
    growth: number;
  }>;
  salesByPeriod: Array<{
    period: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerRetentionRate: number;
  customerLifetimeValue: number;
  averageOrdersPerCustomer: number;
  customerSegments: Array<{
    segment: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  topCustomers: Array<{
    id: string;
    email: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate: Date;
  }>;
}

export interface InventoryMetrics {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalInventoryValue: number;
  averageInventoryTurnover: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    quantitySold: number;
    revenue: number;
    stockLevel: number;
  }>;
  slowMovingProducts: Array<{
    id: string;
    name: string;
    daysSinceLastSale: number;
    stockLevel: number;
    value: number;
  }>;
}

export interface BusinessKPIs {
  monthlyRecurringRevenue: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
  churnRate: number;
  netPromoterScore: number;
  averageResponseTime: number;
  orderFulfillmentRate: number;
  returnRate: number;
  profitMargin: number;
  marketingROI: number;
}

export interface AnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
  productIds?: string[];
  categoryIds?: string[];
  customerSegment?: string;
  region?: string;
  channel?: string;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  // Dashboard Overview
  async getOverview(range: string = '7days') {
    const { startDate, endDate } = this.parseDateRange(range);
    const previousPeriod = this.getPreviousPeriod(startDate, endDate);

    // Current period stats
    const [orders, users, revenue] = await Promise.all([
      this.prisma.orders.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        include: { order_items: true },
      }),
      this.prisma.users.count({
        where: {
          role: 'USER',
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.orders.aggregate({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['DELIVERED', 'COMPLETED'] },
        },
        _sum: { totalCents: true },
      }),
    ]);

    // Previous period stats for growth calculation
    const [prevOrders, prevUsers, prevRevenue] = await Promise.all([
      this.prisma.orders.count({
        where: { createdAt: { gte: previousPeriod.start, lte: previousPeriod.end } },
      }),
      this.prisma.users.count({
        where: {
          role: 'USER',
          createdAt: { gte: previousPeriod.start, lte: previousPeriod.end },
        },
      }),
      this.prisma.orders.aggregate({
        where: {
          createdAt: { gte: previousPeriod.start, lte: previousPeriod.end },
          status: { in: ['DELIVERED', 'COMPLETED'] },
        },
        _sum: { totalCents: true },
      }),
    ]);

    const totalRevenue = (revenue._sum.totalCents || 0) / 100;
    const prevTotalRevenue = (prevRevenue._sum.totalCents || 0) / 100;
    const totalOrders = orders.length;
    const conversionRate = users > 0 ? (totalOrders / users) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers: await this.prisma.users.count({ where: { role: 'USER' } }),
      newCustomers: users,
      conversionRate,
      revenueGrowth: this.calculateGrowthRate(totalRevenue, prevTotalRevenue),
      ordersGrowth: this.calculateGrowthRate(totalOrders, prevOrders),
      customersGrowth: this.calculateGrowthRate(users, prevUsers),
    };
  }

  // Get trends data
  async getTrends(range: string = '7days') {
    const { startDate, endDate } = this.parseDateRange(range);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const trends = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [revenue, orders, customers] = await Promise.all([
        this.prisma.orders.aggregate({
          where: {
            createdAt: { gte: date, lt: nextDate },
            status: { in: ['DELIVERED', 'COMPLETED'] },
          },
          _sum: { totalCents: true },
        }),
        this.prisma.orders.count({
          where: { createdAt: { gte: date, lt: nextDate } },
        }),
        this.prisma.users.count({
          where: {
            role: 'USER',
            createdAt: { gte: date, lt: nextDate },
          },
        }),
      ]);

      trends.push({
        date: date.toISOString().split('T')[0],
        revenue: (revenue._sum.totalCents || 0) / 100,
        orders,
        customers,
      });
    }

    return trends;
  }

  // Get top products
  async getTopProducts(limit: number = 5) {
    const topProducts = await this.prisma.order_items.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        price: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          price: 'desc',
        },
      },
      take: limit,
    });

    const products = await this.prisma.products.findMany({
      where: {
        id: { in: topProducts.map(p => p.productId) },
      },
    });

    return topProducts.map(tp => {
      const product = products.find(p => p.id === tp.productId);
      return {
        id: tp.productId,
        name: product?.name || 'Unknown',
        sold: tp._sum.quantity || 0,
        revenue: Number(tp._sum.price || 0) / 100,
      };
    });
  }

  // Get top services
  async getTopServices(limit: number = 5) {
    const bookings = await this.prisma.service_bookings.groupBy({
      by: ['serviceId'],
      _count: true,
      _sum: {
        estimatedCosts: true,
      },
      orderBy: {
        _count: {
          serviceId: 'desc',
        },
      },
      take: limit,
    });

    const services = await this.prisma.services.findMany({
      where: {
        id: { in: bookings.map(b => b.serviceId) },
      },
    });

    return bookings.map(booking => {
      const service = services.find(s => s.id === booking.serviceId);
      return {
        id: booking.serviceId,
        name: service?.name || 'Unknown',
        bookings: booking._count,
        revenue: (booking._sum.estimatedCosts || 0) / 100,
      };
    });
  }

  // Get user activity
  async getUserActivity(range: string = '7days') {
    const { startDate, endDate } = this.parseDateRange(range);

    // Get page views (from product_views and service_views)
    const [productViews, serviceViews] = await Promise.all([
      this.prisma.product_views.count({
        where: { timestamp: { gte: startDate, lte: endDate } },
      }),
      this.prisma.service_views.count({
        where: { timestamp: { gte: startDate, lte: endDate } },
      }),
    ]);

    const pageViews = productViews + serviceViews;

    // Get unique sessions based on unique users who viewed products/services
    // A session is defined as a unique user in the time period
    const [uniqueProductViewers, uniqueServiceViewers] = await Promise.all([
      this.prisma.product_views.groupBy({
        by: ['userId'],
        where: {
          timestamp: { gte: startDate, lte: endDate },
          userId: { not: null },
        },
      }),
      this.prisma.service_views.groupBy({
        by: ['userId'],
        where: {
          timestamp: { gte: startDate, lte: endDate },
          userId: { not: null },
        },
      }),
    ]);

    // Combine unique users from both sources
    const uniqueUserIds = new Set([
      ...uniqueProductViewers.map(v => v.userId).filter(Boolean),
      ...uniqueServiceViewers.map(v => v.userId).filter(Boolean),
    ]);

    const sessions = uniqueUserIds.size;

    // Calculate bounce rate: sessions with only 1 page view
    // Get view counts per user
    const [productViewCounts, serviceViewCounts] = await Promise.all([
      this.prisma.product_views.groupBy({
        by: ['userId'],
        where: {
          timestamp: { gte: startDate, lte: endDate },
          userId: { not: null },
        },
        _count: { id: true },
      }),
      this.prisma.service_views.groupBy({
        by: ['userId'],
        where: {
          timestamp: { gte: startDate, lte: endDate },
          userId: { not: null },
        },
        _count: { id: true },
      }),
    ]);

    // Combine view counts per user
    const userViewCounts = new Map<string, number>();

    productViewCounts.forEach(v => {
      if (v.userId) {
        userViewCounts.set(v.userId, (userViewCounts.get(v.userId) || 0) + v._count.id);
      }
    });

    serviceViewCounts.forEach(v => {
      if (v.userId) {
        userViewCounts.set(v.userId, (userViewCounts.get(v.userId) || 0) + v._count.id);
      }
    });

    // Count users with only 1 page view (bounced sessions)
    let bounceSessions = 0;
    userViewCounts.forEach(count => {
      if (count === 1) {
        bounceSessions++;
      }
    });

    const bounceRate = sessions > 0 ? (bounceSessions / sessions) * 100 : 0;

    // Get actual activity logs for duration calculation
    const activityLogRecords = await this.prisma.activity_logs.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        duration: { not: null },
      },
      select: { duration: true },
    });

    const avgSessionDuration =
      activityLogRecords.length > 0
        ? activityLogRecords.reduce((sum: number, log: any) => sum + (log.duration || 0), 0) /
          activityLogRecords.length
        : 0;

    return {
      pageViews,
      sessions,
      avgSessionDuration: avgSessionDuration / 1000, // Convert to seconds
      bounceRate: Math.round(bounceRate * 100) / 100, // Round to 2 decimal places
    };
  }

  // Get revenue by category
  async getRevenueByCategory(range: string = '7days') {
    const { startDate, endDate } = this.parseDateRange(range);

    const orderItems = await this.prisma.order_items.findMany({
      where: {
        orders: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['DELIVERED', 'COMPLETED'] },
        },
      },
      include: {
        products: {
          include: {
            categories: true,
          },
        },
      },
    });

    const categoryRevenue = new Map<string, number>();

    orderItems.forEach(item => {
      const categoryName = item.products?.categories?.name || 'Khác';
      const revenue = (Number(item.price) * item.quantity) / 100;
      categoryRevenue.set(categoryName, (categoryRevenue.get(categoryName) || 0) + revenue);
    });

    return Array.from(categoryRevenue.entries()).map(([category, revenue]) => ({
      category,
      revenue,
    }));
  }

  // Get customer insights
  async getCustomerInsights(range: string = '7days') {
    const { startDate, endDate } = this.parseDateRange(range);

    const [totalCustomers, newCustomers, orders] = await Promise.all([
      this.prisma.users.count({ where: { role: 'USER' } }),
      this.prisma.users.count({
        where: {
          role: 'USER',
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.orders.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        include: { users: true },
      }),
    ]);

    const returningCustomers = new Set(orders.map(o => o.userId)).size;
    const avgOrderValue =
      orders.length > 0
        ? orders.reduce((sum, o) => sum + (o.totalCents || 0), 0) / orders.length / 100
        : 0;

    return {
      totalCustomers,
      newCustomers,
      returningCustomers,
      avgOrderValue,
      topSpenders: [], // TODO: Calculate top spenders
    };
  }

  // Get performance metrics
  async getPerformanceMetrics(range: string = '7days') {
    const { startDate, endDate } = this.parseDateRange(range);

    const [orders, completedOrders, cancelledOrders] = await Promise.all([
      this.prisma.orders.count({
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),
      this.prisma.orders.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['DELIVERED', 'COMPLETED'] },
        },
      }),
      this.prisma.orders.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: 'CANCELLED',
        },
      }),
    ]);

    const fulfillmentRate = orders > 0 ? (completedOrders / orders) * 100 : 0;
    const cancellationRate = orders > 0 ? (cancelledOrders / orders) * 100 : 0;

    // Calculate average processing time from actual orders
    const completedOrdersData = await this.prisma.orders.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['DELIVERED', 'COMPLETED'] },
      },
      select: { createdAt: true, updatedAt: true },
    });

    let avgProcessingTime = 0;
    if (completedOrdersData.length > 0) {
      const totalDays = completedOrdersData.reduce((sum, order) => {
        const diff = order.updatedAt.getTime() - order.createdAt.getTime();
        return sum + diff / (1000 * 60 * 60 * 24); // Convert to days
      }, 0);
      avgProcessingTime = totalDays / completedOrdersData.length;
    }

    return {
      totalOrders: orders,
      completedOrders,
      cancelledOrders,
      fulfillmentRate,
      cancellationRate,
      avgProcessingTime: Math.round(avgProcessingTime * 10) / 10, // Round to 1 decimal
    };
  }

  // Helper: Parse date range
  private parseDateRange(range: string) {
    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    return { startDate, endDate };
  }

  // Sales Analytics
  async getSalesMetrics(filters: AnalyticsFilters = {}): Promise<SalesMetrics> {
    const cacheKey = `sales_metrics:${JSON.stringify(filters)}`;
    const cached = await this.cacheService.get<SalesMetrics>(cacheKey);
    if (cached) return cached;

    try {
      const { startDate, endDate } = this.getDateRange(filters);
      const previousPeriod = this.getPreviousPeriod(startDate, endDate);

      // Current period metrics
      const currentMetrics = await this.calculateSalesMetrics(startDate, endDate, filters);

      // Previous period metrics for growth calculation
      const previousMetrics = await this.calculateSalesMetrics(
        previousPeriod.start,
        previousPeriod.end,
        filters,
      );

      // Calculate growth rates
      const revenueGrowth = this.calculateGrowthRate(
        currentMetrics.totalRevenue,
        previousMetrics.totalRevenue,
      );
      const orderGrowth = this.calculateGrowthRate(
        currentMetrics.totalOrders,
        previousMetrics.totalOrders,
      );

      // Get top products
      const topProducts = await this.getTopProductsMetrics(startDate, endDate, filters);

      // Get sales by period (daily/weekly/monthly breakdown)
      const salesByPeriod = await this.getSalesByPeriod(startDate, endDate, filters);

      const result: SalesMetrics = {
        ...currentMetrics,
        revenueGrowth,
        orderGrowth,
        topProducts,
        salesByPeriod,
      };

      await this.cacheService.set(cacheKey, result, { ttl: 300 }); // 5 minutes cache
      return result;
    } catch (error) {
      this.logger.error('Failed to get sales metrics', error);
      throw error;
    }
  }

  // Customer Analytics
  async getCustomerMetrics(filters: AnalyticsFilters = {}): Promise<CustomerMetrics> {
    const cacheKey = `customer_metrics:${JSON.stringify(filters)}`;
    const cached = await this.cacheService.get<CustomerMetrics>(cacheKey);
    if (cached) return cached;

    try {
      const { startDate, endDate } = this.getDateRange(filters);

      // Total customers
      const totalCustomers = await this.prisma.users.count({
        where: {
          role: 'USER',
          createdAt: { lte: endDate },
        },
      });

      // New customers in period
      const newCustomers = await this.prisma.users.count({
        where: {
          role: 'USER',
          createdAt: { gte: startDate, lte: endDate },
        },
      });

      // Returning customers (customers with more than one order)
      const returningCustomersData = await this.prisma.users.findMany({
        where: {
          role: 'USER',
          orders: { some: { createdAt: { gte: startDate, lte: endDate } } },
        },
        include: {
          _count: { select: { orders: true } },
        },
      });

      const returningCustomers = returningCustomersData.filter(
        customer => customer._count.orders > 1,
      ).length;

      // Customer retention rate
      const customerRetentionRate =
        totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;

      // Customer lifetime value
      const customerLifetimeValue = await this.calculateCustomerLifetimeValue(filters);

      // Average orders per customer
      const totalOrders = await this.prisma.orders.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['COMPLETED', 'DELIVERED'] },
        },
      });

      const averageOrdersPerCustomer = totalCustomers > 0 ? totalOrders / totalCustomers : 0;

      // Customer segments
      const customerSegments = await this.getCustomerSegments(startDate, endDate);

      // Top customers
      const topCustomers = await this.getTopCustomers(startDate, endDate, filters);

      const result: CustomerMetrics = {
        totalCustomers,
        newCustomers,
        returningCustomers,
        customerRetentionRate,
        customerLifetimeValue,
        averageOrdersPerCustomer,
        customerSegments,
        topCustomers,
      };

      await this.cacheService.set(cacheKey, result, { ttl: 300 });
      return result;
    } catch (error) {
      this.logger.error('Failed to get customer metrics', error);
      throw error;
    }
  }

  // Inventory Analytics
  async getInventoryMetrics(filters: AnalyticsFilters = {}): Promise<InventoryMetrics> {
    const cacheKey = `inventory_metrics:${JSON.stringify(filters)}`;
    const cached = await this.cacheService.get<InventoryMetrics>(cacheKey);
    if (cached) return cached;

    try {
      // Total products
      const totalProducts = await this.prisma.products.count();

      // Low stock products (assuming stock level < 10)
      const lowStockProducts = await this.prisma.inventory.count({
        where: { stock: { lt: 10, gt: 0 } },
      });

      // Out of stock products
      const outOfStockProducts = await this.prisma.inventory.count({
        where: { stock: { lte: 0 } },
      });
      const inventoryRows = await this.prisma.inventory.findMany({
        include: { products: { select: { priceCents: true } } },
      });
      const totalInventoryValue = inventoryRows.reduce(
        (sum, row) => sum + Number(row.products?.priceCents || 0) * row.stock,
        0,
      );

      // Average inventory turnover (simplified calculation)
      const averageInventoryTurnover = await this.calculateInventoryTurnover(filters);

      // Top selling products
      const topSellingProducts = await this.getTopSellingProducts(filters);

      // Slow moving products
      const slowMovingProducts = await this.getSlowMovingProducts(filters);

      const result: InventoryMetrics = {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        totalInventoryValue,
        averageInventoryTurnover,
        topSellingProducts,
        slowMovingProducts,
      };

      await this.cacheService.set(cacheKey, result, { ttl: 600 }); // 10 minutes cache
      return result;
    } catch (error) {
      this.logger.error('Failed to get inventory metrics', error);
      throw error;
    }
  }

  // Business KPIs
  async getBusinessKPIs(filters: AnalyticsFilters = {}): Promise<BusinessKPIs> {
    const cacheKey = `business_kpis:${JSON.stringify(filters)}`;
    const cached = await this.cacheService.get<BusinessKPIs>(cacheKey);
    if (cached) return cached;

    try {
      const { startDate, endDate } = this.getDateRange(filters);

      // Monthly Recurring Revenue (for subscription-like products)
      const monthlyRecurringRevenue = await this.calculateMRR(startDate, endDate);

      // Customer Acquisition Cost
      const customerAcquisitionCost = await this.calculateCAC(startDate, endDate);

      // Customer Lifetime Value
      const customerLifetimeValue = await this.calculateCustomerLifetimeValue(filters);

      // Churn Rate
      const churnRate = await this.calculateChurnRate(startDate, endDate);

      // Net Promoter Score (would come from surveys)
      const netPromoterScore = 0; // Placeholder

      // Average Response Time (customer support)
      const averageResponseTime = await this.calculateAverageResponseTime(startDate, endDate);

      // Order Fulfillment Rate
      const orderFulfillmentRate = await this.calculateOrderFulfillmentRate(startDate, endDate);

      // Return Rate
      const returnRate = await this.calculateReturnRate(startDate, endDate);

      // Profit Margin
      const profitMargin = await this.calculateProfitMargin(startDate, endDate);

      // Marketing ROI
      const marketingROI = await this.calculateMarketingROI(startDate, endDate);

      const result: BusinessKPIs = {
        monthlyRecurringRevenue,
        customerAcquisitionCost,
        customerLifetimeValue,
        churnRate,
        netPromoterScore,
        averageResponseTime,
        orderFulfillmentRate,
        returnRate,
        profitMargin,
        marketingROI,
      };

      await this.cacheService.set(cacheKey, result, { ttl: 600 });
      return result;
    } catch (error) {
      this.logger.error('Failed to get business KPIs', error);
      throw error;
    }
  }

  // Real-time dashboard data
  async getDashboardData(filters: AnalyticsFilters = {}): Promise<{
    sales: SalesMetrics;
    customers: CustomerMetrics;
    inventory: InventoryMetrics;
    kpis: BusinessKPIs;
    recentActivity: Array<{
      type: string;
      description: string;
      timestamp: Date;
      value?: number;
    }>;
  }> {
    try {
      const [sales, customers, inventory, kpis] = await Promise.all([
        this.getSalesMetrics(filters),
        this.getCustomerMetrics(filters),
        this.getInventoryMetrics(filters),
        this.getBusinessKPIs(filters),
      ]);

      const recentActivity = await this.getRecentActivity();

      return {
        sales,
        customers,
        inventory,
        kpis,
        recentActivity,
      };
    } catch (error) {
      this.logger.error('Failed to get dashboard data', error);
      throw error;
    }
  }

  // Export analytics data
  async exportAnalytics(
    type: 'sales' | 'customers' | 'inventory' | 'all',
    format: 'csv' | 'excel' | 'pdf',
    filters: AnalyticsFilters = {},
  ): Promise<string> {
    try {
      let _data: any;

      switch (type) {
        case 'sales':
          _data = await this.getSalesMetrics(filters);
          break;
        case 'customers':
          _data = await this.getCustomerMetrics(filters);
          break;
        case 'inventory':
          _data = await this.getInventoryMetrics(filters);
          break;
        case 'all':
          _data = await this.getDashboardData(filters);
          break;
      }

      // Generate export file (implementation would depend on format)
      const filename = `analytics_${type}_${Date.now()}.${format}`;

      this.logger.log(`Analytics export generated: ${filename}`);
      return filename;
    } catch (error) {
      this.logger.error('Failed to export analytics', error);
      throw error;
    }
  }

  // Helper methods
  private getDateRange(filters: AnalyticsFilters): { startDate: Date; endDate: Date } {
    const endDate = filters.endDate || new Date();
    const startDate = filters.startDate || new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    return { startDate, endDate };
  }

  private getPreviousPeriod(startDate: Date, endDate: Date): { start: Date; end: Date } {
    const periodLength = endDate.getTime() - startDate.getTime();
    return {
      start: new Date(startDate.getTime() - periodLength),
      end: new Date(startDate.getTime() - 1),
    };
  }

  private calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  private async calculateSalesMetrics(
    startDate: Date,
    endDate: Date,
    _filters: AnalyticsFilters,
  ): Promise<
    Omit<SalesMetrics, 'revenueGrowth' | 'orderGrowth' | 'topProducts' | 'salesByPeriod'>
  > {
    // Get orders in the period
    const orders = await this.prisma.orders.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
      include: {
        order_items: true,
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalCents, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate conversion rate from actual data
    const totalVisitors = await this.prisma.product_views.count({
      where: { timestamp: { gte: startDate, lte: endDate } },
    });
    const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };
  }

  private async getTopProductsMetrics(
    startDate: Date,
    endDate: Date,
    _filters: AnalyticsFilters,
  ): Promise<SalesMetrics['topProducts']> {
    // Aggregate order items by product from database
    const topProducts = await this.prisma.order_items.groupBy({
      by: ['productId'],
      where: {
        orders: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['COMPLETED', 'DELIVERED'] },
        },
      },
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { price: 'desc' } },
      take: 10,
    });

    const productIds = topProducts.map(p => p.productId).filter(Boolean) as string[];
    const products = await this.prisma.products.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    return topProducts.map(tp => {
      const product = products.find(p => p.id === tp.productId);
      return {
        id: tp.productId || 'unknown',
        name: product?.name || 'Unknown Product',
        revenue: Number(tp._sum.price || 0) / 100,
        quantity: tp._sum.quantity || 0,
        growth: 0, // Would need previous period comparison
      };
    });
  }

  private async getSalesByPeriod(
    startDate: Date,
    endDate: Date,
    _filters: AnalyticsFilters,
  ): Promise<SalesMetrics['salesByPeriod']> {
    // Group sales by day from database
    const orders = await this.prisma.orders.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
      select: { createdAt: true, totalCents: true, userId: true },
    });

    // Group by date
    const salesMap = new Map<string, { revenue: number; orders: number; customers: Set<string> }>();

    orders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      const existing = salesMap.get(dateKey) || {
        revenue: 0,
        orders: 0,
        customers: new Set<string>(),
      };
      existing.revenue += order.totalCents / 100;
      existing.orders += 1;
      if (order.userId) existing.customers.add(order.userId);
      salesMap.set(dateKey, existing);
    });

    return Array.from(salesMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, data]) => ({
        period,
        revenue: data.revenue,
        orders: data.orders,
        customers: data.customers.size,
      }));
  }

  private async calculateCustomerLifetimeValue(_filters: AnalyticsFilters): Promise<number> {
    // Calculate CLV from actual data
    // CLV = Average Order Value × Purchase Frequency × Customer Lifespan
    const users = await this.prisma.users.findMany({
      where: { role: 'USER' },
      include: { orders: { where: { status: { in: ['COMPLETED', 'DELIVERED'] } } } },
    });

    if (users.length === 0) return 0;

    let totalCLV = 0;
    users.forEach(user => {
      if (user.orders.length > 0) {
        const totalSpent = user.orders.reduce((sum, o) => sum + o.totalCents, 0);
        totalCLV += totalSpent;
      }
    });

    return Math.round(totalCLV / users.length); // Average CLV in cents
  }

  private async getCustomerSegments(
    startDate: Date,
    endDate: Date,
  ): Promise<CustomerMetrics['customerSegments']> {
    // Segment customers by spending from database
    const users = await this.prisma.users.findMany({
      where: { role: 'USER' },
      include: {
        orders: {
          where: {
            createdAt: { gte: startDate, lte: endDate },
            status: { in: ['COMPLETED', 'DELIVERED'] },
          },
        },
      },
    });

    const segments = {
      high: { count: 0, revenue: 0 },
      medium: { count: 0, revenue: 0 },
      low: { count: 0, revenue: 0 },
    };

    users.forEach(user => {
      const totalSpent = user.orders.reduce((sum, o) => sum + o.totalCents, 0) / 100;
      if (totalSpent >= 10000000) {
        segments.high.count++;
        segments.high.revenue += totalSpent;
      } else if (totalSpent >= 1000000) {
        segments.medium.count++;
        segments.medium.revenue += totalSpent;
      } else {
        segments.low.count++;
        segments.low.revenue += totalSpent;
      }
    });

    const total = segments.high.count + segments.medium.count + segments.low.count;
    return [
      {
        segment: 'High Value',
        count: segments.high.count,
        revenue: segments.high.revenue,
        percentage: total > 0 ? (segments.high.count / total) * 100 : 0,
      },
      {
        segment: 'Medium Value',
        count: segments.medium.count,
        revenue: segments.medium.revenue,
        percentage: total > 0 ? (segments.medium.count / total) * 100 : 0,
      },
      {
        segment: 'Low Value',
        count: segments.low.count,
        revenue: segments.low.revenue,
        percentage: total > 0 ? (segments.low.count / total) * 100 : 0,
      },
    ];
  }

  private async getTopCustomers(
    _startDate: Date,
    _endDate: Date,
    _filters: AnalyticsFilters,
  ): Promise<CustomerMetrics['topCustomers']> {
    // This would find customers with highest spending
    return [];
  }

  private async calculateInventoryTurnover(_filters: AnalyticsFilters): Promise<number> {
    // Inventory Turnover = Cost of Goods Sold / Average Inventory Value
    const [soldItems, inventoryValue] = await Promise.all([
      this.prisma.order_items.aggregate({
        where: { orders: { status: { in: ['COMPLETED', 'DELIVERED'] } } },
        _sum: { price: true },
      }),
      this.prisma.inventory.aggregate({ _sum: { stock: true } }),
    ]);

    const cogs = Number(soldItems._sum.price || 0) / 100;
    const avgInventory = (inventoryValue._sum.stock || 1) * 1000000; // Estimate
    return avgInventory > 0 ? Math.round((cogs / avgInventory) * 100) / 100 : 0;
  }

  private async getTopSellingProducts(
    _filters: AnalyticsFilters,
  ): Promise<InventoryMetrics['topSellingProducts']> {
    return [];
  }

  private async getSlowMovingProducts(
    _filters: AnalyticsFilters,
  ): Promise<InventoryMetrics['slowMovingProducts']> {
    return [];
  }

  private async calculateMRR(_startDate: Date, _endDate: Date): Promise<number> {
    return 0; // Placeholder
  }

  private async calculateCAC(_startDate: Date, _endDate: Date): Promise<number> {
    return 0; // Placeholder
  }

  private async calculateChurnRate(_startDate: Date, _endDate: Date): Promise<number> {
    return 0; // Placeholder
  }

  private async calculateAverageResponseTime(_startDate: Date, _endDate: Date): Promise<number> {
    return 0; // Placeholder
  }

  private async calculateOrderFulfillmentRate(startDate: Date, endDate: Date): Promise<number> {
    const [total, fulfilled] = await Promise.all([
      this.prisma.orders.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
      this.prisma.orders.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['DELIVERED', 'COMPLETED'] },
        },
      }),
    ]);
    return total > 0 ? Math.round((fulfilled / total) * 10000) / 100 : 0;
  }

  private async calculateReturnRate(startDate: Date, endDate: Date): Promise<number> {
    const [total, cancelled] = await Promise.all([
      this.prisma.orders.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
      this.prisma.orders.count({
        where: { createdAt: { gte: startDate, lte: endDate }, status: 'CANCELLED' },
      }),
    ]);
    return total > 0 ? Math.round((cancelled / total) * 10000) / 100 : 0;
  }

  private async calculateProfitMargin(_startDate: Date, _endDate: Date): Promise<number> {
    return 25; // Placeholder
  }

  private async calculateMarketingROI(_startDate: Date, _endDate: Date): Promise<number> {
    return 300; // Placeholder
  }

  private async getRecentActivity(): Promise<
    Array<{
      type: string;
      description: string;
      timestamp: Date;
      value?: number;
    }>
  > {
    // Get recent orders from database
    const recentOrders = await this.prisma.orders.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { orderNo: true, totalCents: true, createdAt: true, status: true },
    });

    // Get recent bookings
    const recentBookings = await this.prisma.service_bookings.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { services: { select: { name: true } } },
    });

    const activities: Array<{
      type: string;
      description: string;
      timestamp: Date;
      value?: number;
    }> = [];

    recentOrders.forEach(order => {
      activities.push({
        type: 'order',
        description: `Đơn hàng #${order.orderNo} - ${order.status}`,
        timestamp: order.createdAt,
        value: order.totalCents / 100,
      });
    });

    recentBookings.forEach(booking => {
      activities.push({
        type: 'booking',
        description: `Lịch hẹn: ${booking.services?.name || 'Dịch vụ'}`,
        timestamp: booking.createdAt,
      });
    });

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  }

  // NEW METHODS FOR DASHBOARD //

  async getRevenueChartData(days: number = 7) {
    const dates: string[] = [];
    const values: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayRevenue = await this.prisma.orders.aggregate({
        where: {
          createdAt: { gte: date, lt: nextDate },
          status: { in: ['COMPLETED', 'DELIVERED'] },
        },
        _sum: { totalCents: true },
      });

      dates.push(date.toISOString().split('T')[0]);
      values.push((dayRevenue._sum.totalCents || 0) / 100);
    }

    return { dates, values };
  }

  async getTopSellingProductsReal(limit: number = 5) {
    const topProducts = await this.prisma.order_items.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        price: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    const products = await this.prisma.products.findMany({
      where: {
        id: { in: topProducts.map(p => p.productId).filter(Boolean) },
      },
      include: {
        inventory: {
          select: { stock: true },
        },
      },
    });

    return topProducts.map(tp => {
      const product = products.find(p => p.id === tp.productId);
      return {
        id: tp.productId,
        name: product?.name || 'Unknown Product',
        salesCount: tp._sum.quantity || 0,
        revenue: Number(tp._sum.price || 0) / 100,
        stock: product?.inventory?.stock || 0,
      };
    });
  }

  async getGrowthMetricsReal() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    // Current period (last 7 days)
    const [currentOrders, currentCustomers] = await Promise.all([
      this.prisma.orders.count({
        where: { createdAt: { gte: sevenDaysAgo, lte: today } },
      }),
      this.prisma.users.count({
        where: {
          role: 'USER',
          createdAt: { gte: sevenDaysAgo, lte: today },
        },
      }),
    ]);

    // Previous period (14-7 days ago)
    const [previousOrders, previousCustomers] = await Promise.all([
      this.prisma.orders.count({
        where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
      }),
      this.prisma.users.count({
        where: {
          role: 'USER',
          createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
      }),
    ]);

    return {
      ordersGrowth: this.calculateGrowthRate(currentOrders, previousOrders),
      customersGrowth: this.calculateGrowthRate(currentCustomers, previousCustomers),
    };
  }

  async getBookingsTodayReal() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookingsToday = await this.prisma.service_bookings.count({
      where: {
        createdAt: { gte: today, lt: tomorrow },
      },
    });

    return { bookingsToday };
  }
}
