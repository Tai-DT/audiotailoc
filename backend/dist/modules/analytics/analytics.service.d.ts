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
export declare class AnalyticsService {
    private readonly prisma;
    private readonly cacheService;
    private readonly logger;
    constructor(prisma: PrismaService, cacheService: CacheService);
    getOverview(range?: string): Promise<{
        totalRevenue: number;
        totalOrders: number;
        totalCustomers: number;
        newCustomers: number;
        conversionRate: number;
        revenueGrowth: number;
        ordersGrowth: number;
        customersGrowth: number;
    }>;
    getTrends(range?: string): Promise<any[]>;
    getTopProducts(limit?: number): Promise<{
        id: string;
        name: string;
        sold: number;
        revenue: number;
    }[]>;
    getTopServices(limit?: number): Promise<{
        id: string;
        name: string;
        bookings: number;
        revenue: number;
    }[]>;
    getUserActivity(range?: string): Promise<{
        pageViews: number;
        sessions: number;
        avgSessionDuration: number;
        bounceRate: number;
    }>;
    getRevenueByCategory(range?: string): Promise<{
        category: string;
        revenue: number;
    }[]>;
    getCustomerInsights(range?: string): Promise<{
        totalCustomers: number;
        newCustomers: number;
        returningCustomers: number;
        avgOrderValue: number;
        topSpenders: any[];
    }>;
    getPerformanceMetrics(range?: string): Promise<{
        totalOrders: number;
        completedOrders: number;
        cancelledOrders: number;
        fulfillmentRate: number;
        cancellationRate: number;
        avgProcessingTime: number;
    }>;
    private parseDateRange;
    getSalesMetrics(filters?: AnalyticsFilters): Promise<SalesMetrics>;
    getCustomerMetrics(filters?: AnalyticsFilters): Promise<CustomerMetrics>;
    getInventoryMetrics(filters?: AnalyticsFilters): Promise<InventoryMetrics>;
    getBusinessKPIs(filters?: AnalyticsFilters): Promise<BusinessKPIs>;
    getDashboardData(filters?: AnalyticsFilters): Promise<{
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
    }>;
    exportAnalytics(type: 'sales' | 'customers' | 'inventory' | 'all', format: 'csv' | 'excel' | 'pdf', filters?: AnalyticsFilters): Promise<string>;
    private getDateRange;
    private getPreviousPeriod;
    private calculateGrowthRate;
    private calculateSalesMetrics;
    private getTopProductsMetrics;
    private getSalesByPeriod;
    private calculateCustomerLifetimeValue;
    private getCustomerSegments;
    private getTopCustomers;
    private calculateInventoryTurnover;
    private getTopSellingProducts;
    private getSlowMovingProducts;
    private calculateMRR;
    private calculateCAC;
    private calculateChurnRate;
    private calculateAverageResponseTime;
    private calculateOrderFulfillmentRate;
    private calculateReturnRate;
    private calculateProfitMargin;
    private calculateMarketingROI;
    private getRecentActivity;
    getRevenueChartData(days?: number): Promise<{
        dates: string[];
        values: number[];
    }>;
    getTopSellingProductsReal(limit?: number): Promise<{
        id: string;
        name: string;
        salesCount: number;
        revenue: number;
        stock: number;
    }[]>;
    getGrowthMetricsReal(): Promise<{
        ordersGrowth: number;
        customersGrowth: number;
    }>;
    getBookingsTodayReal(): Promise<{
        bookingsToday: number;
    }>;
}
