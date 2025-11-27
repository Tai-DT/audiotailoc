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

    const [pageViews] = await Promise.all([
      this.prisma.product_views.count({
        where: { timestamp: { gte: startDate, lte: endDate } },
      }),
    ]);

    const sessions = await this.prisma.activity_logs.groupBy({
      by: ['userId'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
        action: 'LOGIN',
      },
      _count: true,
    });

    // Get actual activity logs for duration calculation
    const activityLogRecords = await this.prisma.activity_logs.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { duration: true },
    });

    const avgSessionDuration =
      activityLogRecords.length > 0
        ? activityLogRecords.reduce((sum: number, log: any) => sum + (log.duration || 0), 0) /
          activityLogRecords.length
        : 0;

    return {
      pageViews,
      sessions: sessions.length,
      avgSessionDuration: avgSessionDuration / 1000, // Convert to seconds
      bounceRate: 0.32, // Mock for now, calculate based on actual behavior
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

    const [totalCustomers, newCustomers, orders, topSpendersAgg, users] = await Promise.all([
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
      this.prisma.orders.groupBy({
        by: ['userId'],
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['COMPLETED', 'DELIVERED'] },
          userId: { not: null },
        },
        _sum: { totalCents: true },
        orderBy: { _sum: { totalCents: 'desc' } },
        take: 5,
      }),
      this.prisma.users.findMany({
        where: { role: 'USER' },
        select: { id: true, email: true, name: true },
      }),
    ]);

    const returningCustomers = new Set(orders.map(o => o.userId)).size;
    const avgOrderValue =
      orders.length > 0
        ? orders.reduce((sum, o) => sum + (o.totalCents || 0), 0) / orders.length / 100
        : 0;

    const topSpenders = topSpendersAgg.map(spender => {
      const user = users.find(u => u.id === spender.userId);
      return {
        id: spender.userId,
        email: user?.email || 'unknown',
        name: user?.name || user?.email || 'Khách hàng',
        totalSpent: Number(spender._sum.totalCents || 0) / 100,
      };
    });

    return {
      totalCustomers,
      newCustomers,
      returningCustomers,
      avgOrderValue,
      topSpenders,
    };
  }

  // Get performance metrics
  async getPerformanceMetrics(range: string = '7days') {
    const { startDate, endDate } = this.parseDateRange(range);

    const [orders, completedOrders, cancelledOrders, completedOrderList] = await Promise.all([
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
      this.prisma.orders.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['DELIVERED', 'COMPLETED'] },
        },
        select: { createdAt: true, updatedAt: true },
      }),
    ]);

    const fulfillmentRate = orders > 0 ? (completedOrders / orders) * 100 : 0;
    const cancellationRate = orders > 0 ? (cancelledOrders / orders) * 100 : 0;
    const avgProcessingTime = completedOrderList.length
      ? completedOrderList.reduce((sum, o) => {
          const start = new Date(o.createdAt).getTime();
          const end = new Date(o.updatedAt).getTime();
          if (!start || !end || end < start) return sum;
          return sum + (end - start);
        }, 0) /
        completedOrderList.length /
        (1000 * 60 * 60 * 24) // days
      : 0;

    return {
      totalOrders: orders,
      completedOrders,
      cancelledOrders,
      fulfillmentRate,
      cancellationRate,
      avgProcessingTime,
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

    // Calculate conversion rate (simplified - would need visitor data)
    const conversionRate = 2.5; // Placeholder

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      conversionRate,
    };
  }

  private async getTopProductsMetrics(
    startDate: Date,
    endDate: Date,
    _filters: AnalyticsFilters,
  ): Promise<SalesMetrics['topProducts']> {
    // Aggregate order items by product within the range
    const currentTop = await this.prisma.order_items.groupBy({
      by: ['productId'],
      where: {
        orders: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['COMPLETED', 'DELIVERED'] },
        },
      },
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { price: 'desc' } },
      take: 5,
    });

    // Previous period for growth comparison
    const prevPeriod = this.getPreviousPeriod(startDate, endDate);
    const prevTop = await this.prisma.order_items.groupBy({
      by: ['productId'],
      where: {
        orders: {
          createdAt: { gte: prevPeriod.start, lte: prevPeriod.end },
          status: { in: ['COMPLETED', 'DELIVERED'] },
        },
      },
      _sum: { quantity: true, price: true },
    });

    const prevRevenueMap = new Map<string, number>();
    prevTop.forEach(p => {
      prevRevenueMap.set(p.productId, Number(p._sum.price || 0));
    });

    const products = await this.prisma.products.findMany({
      where: { id: { in: currentTop.map(p => p.productId).filter(Boolean) } },
      select: { id: true, name: true },
    });

    return currentTop.map(p => {
      const product = products.find(prod => prod.id === p.productId);
      const revenue = Number(p._sum.price || 0);
      const prevRevenue = prevRevenueMap.get(p.productId) || 0;
      return {
        id: p.productId,
        name: product?.name || 'Unknown',
        revenue: revenue / 100,
        quantity: p._sum.quantity || 0,
        growth: this.calculateGrowthRate(revenue, prevRevenue),
      };
    });
  }

  private async getSalesByPeriod(
    startDate: Date,
    endDate: Date,
    _filters: AnalyticsFilters,
  ): Promise<SalesMetrics['salesByPeriod']> {
    // Fetch all relevant orders in a single query
    const orders = await this.prisma.orders.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
      select: {
        createdAt: true,
        totalCents: true,
        userId: true,
      },
    });

    const periodMap = new Map<
      string,
      { revenue: number; orders: number; customerSet: Set<string> }
    >();

    // Initialize map with all days in range if range is small enough (e.g. < 90 days)
    // Otherwise just let the data drive the keys to avoid creating thousands of empty entries
    const dayMs = 24 * 60 * 60 * 1000;
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / dayMs);
    const shouldFillGaps = totalDays <= 90;

    if (shouldFillGaps) {
      for (let i = 0; i < totalDays; i++) {
        const date = new Date(startDate.getTime() + i * dayMs);
        const key = date.toISOString().split('T')[0];
        periodMap.set(key, { revenue: 0, orders: 0, customerSet: new Set() });
      }
    }

    // Aggregate data
    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().split('T')[0];

      if (!periodMap.has(dateKey)) {
        // If we didn't pre-fill (large range), or date falls outside (shouldn't happen with where clause)
        if (!shouldFillGaps) {
          periodMap.set(dateKey, { revenue: 0, orders: 0, customerSet: new Set() });
        } else {
          continue;
        }
      }

      const entry = periodMap.get(dateKey);
      if (entry) {
        entry.revenue += order.totalCents;
        entry.orders += 1;
        if (order.userId) {
          entry.customerSet.add(order.userId);
        }
      }
    }

    // Convert map to array and sort
    const results = Array.from(periodMap.entries()).map(([period, data]) => ({
      period,
      revenue: data.revenue / 100,
      orders: data.orders,
      customers: data.customerSet.size,
    }));

    return results.sort((a, b) => a.period.localeCompare(b.period));
  }

  private async calculateCustomerLifetimeValue(_filters: AnalyticsFilters): Promise<number> {
    const [revenueAgg, totalOrders, uniqueCustomers] = await Promise.all([
      this.prisma.orders.aggregate({
        _sum: { totalCents: true },
        where: { status: { in: ['COMPLETED', 'DELIVERED'] } },
      }),
      this.prisma.orders.count({
        where: { status: { in: ['COMPLETED', 'DELIVERED'] } },
      }),
      this.prisma.orders.findMany({
        where: { status: { in: ['COMPLETED', 'DELIVERED'] }, userId: { not: null } },
        select: { userId: true },
        distinct: ['userId'],
      }),
    ]);

    const totalRevenue = (revenueAgg._sum.totalCents || 0) / 100;
    const customers = uniqueCustomers.length || 1;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const purchaseFrequency = totalOrders > 0 ? totalOrders / customers : 0;

    return averageOrderValue * purchaseFrequency;
  }

  private async getCustomerSegments(
    startDate: Date,
    endDate: Date,
  ): Promise<CustomerMetrics['customerSegments']> {
    // Segment customers by total spend within the window
    const customerSpend = await this.prisma.orders.groupBy({
      by: ['userId'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['COMPLETED', 'DELIVERED'] },
        userId: { not: null },
      },
      _sum: { totalCents: true },
    });

    const segments = {
      'High Value': { count: 0, revenue: 0 },
      'Medium Value': { count: 0, revenue: 0 },
      'Low Value': { count: 0, revenue: 0 },
    };

    customerSpend.forEach(c => {
      const spent = Number(c._sum.totalCents || 0);
      if (spent >= 10_000_000) {
        segments['High Value'].count += 1;
        segments['High Value'].revenue += spent;
      } else if (spent >= 2_000_000) {
        segments['Medium Value'].count += 1;
        segments['Medium Value'].revenue += spent;
      } else {
        segments['Low Value'].count += 1;
        segments['Low Value'].revenue += spent;
      }
    });

    const totalRevenue = Object.values(segments).reduce((sum, seg) => sum + seg.revenue, 0) || 1;

    return Object.entries(segments).map(([segment, data]) => ({
      segment,
      count: data.count,
      revenue: data.revenue / 100,
      percentage: (data.revenue / totalRevenue) * 100,
    }));
  }

  private async getTopCustomers(
    startDate: Date,
    endDate: Date,
    _filters: AnalyticsFilters,
  ): Promise<CustomerMetrics['topCustomers']> {
    const top = await this.prisma.orders.groupBy({
      by: ['userId'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['COMPLETED', 'DELIVERED'] },
        userId: { not: null },
      },
      _sum: { totalCents: true },
      _count: { _all: true },
      orderBy: { _sum: { totalCents: 'desc' } },
      take: 5,
    });

    const users = await this.prisma.users.findMany({
      where: { id: { in: top.map(t => t.userId).filter(Boolean) } },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return top.map(t => {
      const user = users.find(u => u.id === t.userId);
      return {
        id: t.userId,
        email: user?.email || 'unknown',
        totalSpent: Number(t._sum.totalCents || 0) / 100,
        orderCount: t._count._all || 0,
        lastOrderDate: user?.createdAt || new Date(),
      };
    });
  }

  private async calculateInventoryTurnover(_filters: AnalyticsFilters): Promise<number> {
    const inventoryRows = await this.prisma.inventory.findMany({
      include: { products: { select: { priceCents: true } } },
    });
    const inventoryValue = inventoryRows.reduce(
      (sum, row) => sum + Number(row.products?.priceCents || 0) * row.stock,
      0,
    );

    const salesAgg = await this.prisma.orders.aggregate({
      _sum: { totalCents: true },
      where: { status: { in: ['COMPLETED', 'DELIVERED'] } },
    });

    const cogs = Number(salesAgg._sum.totalCents || 0);
    if (!inventoryValue) return 0;
    return cogs / inventoryValue;
  }

  private async getTopSellingProducts(
    _filters: AnalyticsFilters,
  ): Promise<InventoryMetrics['topSellingProducts']> {
    const topProducts = await this.prisma.order_items.groupBy({
      by: ['productId'],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const products = await this.prisma.products.findMany({
      where: { id: { in: topProducts.map(p => p.productId).filter(Boolean) } },
      include: { inventory: { select: { stock: true } } },
    });

    return topProducts.map(tp => {
      const product = products.find(p => p.id === tp.productId);
      return {
        id: tp.productId,
        name: product?.name || 'Unknown Product',
        quantitySold: tp._sum.quantity || 0,
        revenue: Number(tp._sum.price || 0) / 100,
        stockLevel: product?.inventory?.stock || 0,
      };
    });
  }

  private async getSlowMovingProducts(
    _filters: AnalyticsFilters,
  ): Promise<InventoryMetrics['slowMovingProducts']> {
    // Products that still have stock but have not been sold recently
    const productsWithStock = await this.prisma.products.findMany({
      where: { inventory: { stock: { gt: 0 } } },
      select: {
        id: true,
        name: true,
        inventory: { select: { stock: true } },
      },
    });

    const latestSales = await this.prisma.order_items.groupBy({
      by: ['productId'],
      _max: { createdAt: true },
    });
    const latestSaleMap = new Map<string, Date>();
    latestSales.forEach(row => {
      if (row._max.createdAt) latestSaleMap.set(row.productId, row._max.createdAt);
    });

    const now = Date.now();

    return productsWithStock
      .map(p => {
        const lastSale = latestSaleMap.get(p.id);
        const daysSinceLastSale = lastSale
          ? Math.floor((now - lastSale.getTime()) / (1000 * 60 * 60 * 24))
          : 999;
        return {
          id: p.id,
          name: p.name,
          daysSinceLastSale,
          stockLevel: p.inventory?.stock ?? 0,
          value: 0,
        };
      })
      .sort((a, b) => b.daysSinceLastSale - a.daysSinceLastSale)
      .slice(0, 5);
  }

  private async calculateMRR(_startDate: Date, _endDate: Date): Promise<number> {
    // Approximate MRR using revenue of last 30 days divided by 1 month
    const start = new Date();
    start.setDate(start.getDate() - 30);
    const revenue = await this.prisma.orders.aggregate({
      _sum: { totalCents: true },
      where: { createdAt: { gte: start }, status: { in: ['COMPLETED', 'DELIVERED'] } },
    });
    return (revenue._sum.totalCents || 0) / 100;
  }

  private async calculateCAC(_startDate: Date, _endDate: Date): Promise<number> {
    // Rough CAC: total revenue / new customers (as proxy without marketing spend data)
    const customers = await this.prisma.users.count({
      where: { role: 'USER', createdAt: { gte: _startDate, lte: _endDate } },
    });
    const revenue = await this.prisma.orders.aggregate({
      _sum: { totalCents: true },
      where: {
        createdAt: { gte: _startDate, lte: _endDate },
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
    });
    if (!customers) return 0;
    return (revenue._sum.totalCents || 0) / 100 / customers;
  }

  private async calculateChurnRate(_startDate: Date, _endDate: Date): Promise<number> {
    // Simplified churn: users with no orders in period / total active users
    const activeUsers = await this.prisma.users.count({ where: { role: 'USER' } });
    if (!activeUsers) return 0;

    const usersWithOrders = await this.prisma.orders.findMany({
      where: { createdAt: { gte: _startDate, lte: _endDate }, userId: { not: null } },
      select: { userId: true },
      distinct: ['userId'],
    });
    const retained = usersWithOrders.length;
    const churned = Math.max(activeUsers - retained, 0);
    return (churned / activeUsers) * 100;
  }

  private async calculateAverageResponseTime(_startDate: Date, _endDate: Date): Promise<number> {
    const logs = await this.prisma.activity_logs.findMany({
      where: { createdAt: { gte: _startDate, lte: _endDate }, duration: { not: null } },
      select: { duration: true },
    });
    if (!logs.length) return 0;
    const total = logs.reduce((sum, log) => sum + (log.duration || 0), 0);
    return total / logs.length;
  }

  private async calculateOrderFulfillmentRate(_startDate: Date, _endDate: Date): Promise<number> {
    const [total, fulfilled] = await Promise.all([
      this.prisma.orders.count({
        where: { createdAt: { gte: _startDate, lte: _endDate } },
      }),
      this.prisma.orders.count({
        where: {
          createdAt: { gte: _startDate, lte: _endDate },
          status: { in: ['COMPLETED', 'DELIVERED'] },
        },
      }),
    ]);
    if (!total) return 0;
    return (fulfilled / total) * 100;
  }

  private async calculateReturnRate(_startDate: Date, _endDate: Date): Promise<number> {
    // If returns are tracked as CANCELLED after completion, approximate using cancelled / total
    const [cancelled, total] = await Promise.all([
      this.prisma.orders.count({
        where: { createdAt: { gte: _startDate, lte: _endDate }, status: 'CANCELLED' },
      }),
      this.prisma.orders.count({
        where: { createdAt: { gte: _startDate, lte: _endDate } },
      }),
    ]);
    if (!total) return 0;
    return (cancelled / total) * 100;
  }

  private async calculateProfitMargin(_startDate: Date, _endDate: Date): Promise<number> {
    const revenue = await this.prisma.orders.aggregate({
      _sum: { totalCents: true },
      where: {
        createdAt: { gte: _startDate, lte: _endDate },
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
    });
    // Without cost data, assume 20% cost of goods as a basic heuristic
    const revenueValue = (revenue._sum.totalCents || 0) / 100;
    const estimatedCost = revenueValue * 0.8;
    if (!revenueValue) return 0;
    return ((revenueValue - estimatedCost) / revenueValue) * 100;
  }

  private async calculateMarketingROI(_startDate: Date, _endDate: Date): Promise<number> {
    // Simplified ROI: revenue / assumed spend (5% of revenue)
    const revenue = await this.prisma.orders.aggregate({
      _sum: { totalCents: true },
      where: {
        createdAt: { gte: _startDate, lte: _endDate },
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
    });
    const revenueValue = (revenue._sum.totalCents || 0) / 100;
    if (!revenueValue) return 0;
    const spend = revenueValue * 0.05 || 1;
    return ((revenueValue - spend) / spend) * 100;
  }

  private async getRecentActivity(): Promise<
    Array<{
      type: string;
      description: string;
      timestamp: Date;
      value?: number;
    }>
  > {
    return [
      {
        type: 'order',
        description: 'New order #12345',
        timestamp: new Date(),
        value: 1500000,
      },
    ];
  }

  // NEW METHODS FOR DASHBOARD //

  async getRevenueChartData(days: number = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1); // Go back 'days' days, including today
    startDate.setHours(0, 0, 0, 0); // Start of the first day

    // Fetch all relevant orders in a single query
    const orders = await this.prisma.orders.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
      select: {
        createdAt: true,
        totalCents: true,
      },
    });

    const revenueMap = new Map<string, number>();

    // Initialize map with all days
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const key = date.toISOString().split('T')[0];
      revenueMap.set(key, 0);
    }

    // Aggregate revenue
    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      if (revenueMap.has(dateKey)) {
        revenueMap.set(dateKey, (revenueMap.get(dateKey) || 0) + order.totalCents);
      }
    }

    const dates: string[] = [];
    const values: number[] = [];

    // Convert map to arrays (map iterates in insertion order, which is chronological here)
    for (const [date, cents] of revenueMap.entries()) {
      dates.push(date);
      values.push(cents / 100);
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
