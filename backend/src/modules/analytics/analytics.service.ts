import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

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
    private readonly cacheService: CacheService
  ) {}

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
        filters
      );

      // Calculate growth rates
      const revenueGrowth = this.calculateGrowthRate(
        currentMetrics.totalRevenue, 
        previousMetrics.totalRevenue
      );
      const orderGrowth = this.calculateGrowthRate(
        currentMetrics.totalOrders, 
        previousMetrics.totalOrders
      );

      // Get top products
      const topProducts = await this.getTopProducts(startDate, endDate, filters);

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
      const totalCustomers = await this.prisma.user.count({
        where: {
          role: 'USER',
          createdAt: { lte: endDate },
        },
      });

      // New customers in period
      const newCustomers = await this.prisma.user.count({
        where: {
          role: 'USER',
          createdAt: { gte: startDate, lte: endDate },
        },
      });

      // Returning customers (customers with more than one order)
      const returningCustomersData = await this.prisma.user.findMany({
        where: {
          role: 'USER',
          orders: { some: { createdAt: { gte: startDate, lte: endDate } } },
        },
        include: {
          _count: { select: { orders: true } },
        },
      });

      const returningCustomers = returningCustomersData.filter(
        customer => customer._count.orders > 1
      ).length;

      // Customer retention rate
      const customerRetentionRate = totalCustomers > 0 
        ? (returningCustomers / totalCustomers) * 100 
        : 0;

      // Customer lifetime value
      const customerLifetimeValue = await this.calculateCustomerLifetimeValue(filters);

      // Average orders per customer
      const totalOrders = await this.prisma.order.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['COMPLETED', 'DELIVERED'] },
        },
      });

      const averageOrdersPerCustomer = totalCustomers > 0 
        ? totalOrders / totalCustomers 
        : 0;

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
      const totalProducts = await this.prisma.product.count();

      // Low stock products (assuming stock level < 10)
      const lowStockProducts = await this.prisma.inventory.count({
        where: { stock: { lt: 10, gt: 0 } },
      });

      // Out of stock products
      const outOfStockProducts = await this.prisma.inventory.count({ where: { stock: { lte: 0 } } });
      const inventoryRows = await this.prisma.inventory.findMany({ include: { product: { select: { priceCents: true } } } });
      const totalInventoryValue = inventoryRows.reduce((sum, row) => sum + (row.product?.priceCents || 0) * row.stock, 0);

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
    filters: AnalyticsFilters = {}
  ): Promise<string> {
    try {
      let data: any;

      switch (type) {
        case 'sales':
          data = await this.getSalesMetrics(filters);
          break;
        case 'customers':
          data = await this.getCustomerMetrics(filters);
          break;
        case 'inventory':
          data = await this.getInventoryMetrics(filters);
          break;
        case 'all':
          data = await this.getDashboardData(filters);
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
    filters: AnalyticsFilters
  ): Promise<Omit<SalesMetrics, 'revenueGrowth' | 'orderGrowth' | 'topProducts' | 'salesByPeriod'>> {
    // Get orders in the period
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
      include: {
        items: true,
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

  private async getTopProducts(
    startDate: Date, 
    endDate: Date, 
    filters: AnalyticsFilters
  ): Promise<SalesMetrics['topProducts']> {
    // This would aggregate order items by product
    // For now, return mock data
    return [
      {
        id: '1',
        name: 'Tai nghe Sony WH-1000XM4',
        revenue: 50000000,
        quantity: 100,
        growth: 15.5,
      },
    ];
  }

  private async getSalesByPeriod(
    startDate: Date, 
    endDate: Date, 
    filters: AnalyticsFilters
  ): Promise<SalesMetrics['salesByPeriod']> {
    // This would group sales by day/week/month
    // For now, return mock data
    return [
      {
        period: '2024-01-01',
        revenue: 10000000,
        orders: 25,
        customers: 20,
      },
    ];
  }

  private async calculateCustomerLifetimeValue(filters: AnalyticsFilters): Promise<number> {
    // Simplified CLV calculation
    // CLV = Average Order Value × Purchase Frequency × Customer Lifespan
    return 5000000; // Placeholder
  }

  private async getCustomerSegments(
    startDate: Date, 
    endDate: Date
  ): Promise<CustomerMetrics['customerSegments']> {
    // This would segment customers by spending, frequency, etc.
    return [
      { segment: 'High Value', count: 50, revenue: 100000000, percentage: 25 },
      { segment: 'Medium Value', count: 150, revenue: 150000000, percentage: 50 },
      { segment: 'Low Value', count: 100, revenue: 50000000, percentage: 25 },
    ];
  }

  private async getTopCustomers(
    startDate: Date, 
    endDate: Date, 
    filters: AnalyticsFilters
  ): Promise<CustomerMetrics['topCustomers']> {
    // This would find customers with highest spending
    return [];
  }

  private async calculateInventoryTurnover(filters: AnalyticsFilters): Promise<number> {
    // Inventory Turnover = Cost of Goods Sold / Average Inventory Value
    return 4.5; // Placeholder
  }

  private async getTopSellingProducts(filters: AnalyticsFilters): Promise<InventoryMetrics['topSellingProducts']> {
    return [];
  }

  private async getSlowMovingProducts(filters: AnalyticsFilters): Promise<InventoryMetrics['slowMovingProducts']> {
    return [];
  }

  private async calculateMRR(startDate: Date, endDate: Date): Promise<number> {
    return 0; // Placeholder
  }

  private async calculateCAC(startDate: Date, endDate: Date): Promise<number> {
    return 0; // Placeholder
  }

  private async calculateChurnRate(startDate: Date, endDate: Date): Promise<number> {
    return 0; // Placeholder
  }

  private async calculateAverageResponseTime(startDate: Date, endDate: Date): Promise<number> {
    return 0; // Placeholder
  }

  private async calculateOrderFulfillmentRate(startDate: Date, endDate: Date): Promise<number> {
    return 95; // Placeholder
  }

  private async calculateReturnRate(startDate: Date, endDate: Date): Promise<number> {
    return 2.5; // Placeholder
  }

  private async calculateProfitMargin(startDate: Date, endDate: Date): Promise<number> {
    return 25; // Placeholder
  }

  private async calculateMarketingROI(startDate: Date, endDate: Date): Promise<number> {
    return 300; // Placeholder
  }

  private async getRecentActivity(): Promise<Array<{
    type: string;
    description: string;
    timestamp: Date;
    value?: number;
  }>> {
    return [
      {
        type: 'order',
        description: 'New order #12345',
        timestamp: new Date(),
        value: 1500000,
      },
    ];
  }
}
