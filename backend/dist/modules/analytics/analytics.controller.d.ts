import { AnalyticsService } from './analytics.service';
declare class AnalyticsQueryDto {
    startDate?: string;
    endDate?: string;
    productIds?: string[];
    categoryIds?: string[];
    customerSegment?: string;
    region?: string;
    channel?: string;
}
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardData(query: AnalyticsQueryDto): Promise<{
        sales: import("./analytics.service").SalesMetrics;
        customers: import("./analytics.service").CustomerMetrics;
        inventory: import("./analytics.service").InventoryMetrics;
        kpis: import("./analytics.service").BusinessKPIs;
        recentActivity: Array<{
            type: string;
            description: string;
            timestamp: Date;
            value?: number;
        }>;
    }>;
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
    getRevenue(period?: string): Promise<{
        period: string;
        startDate: string;
        endDate: string;
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
        revenueGrowth: number;
    }>;
    getRevenueChart(days?: string): Promise<{
        dates: string[];
        values: number[];
    }>;
    getTopSellingProductsReal(limit?: string): Promise<{
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
    getTopServices(limit?: string): Promise<{
        id: string;
        name: string;
        bookings: number;
        revenue: number;
    }[]>;
    getTopProducts(limit?: string): Promise<{
        id: string;
        name: string;
        sold: number;
        revenue: number;
    }[]>;
    getUserActivity(range?: string): Promise<{
        pageViews: number;
        sessions: number;
        avgSessionDuration: number;
        bounceRate: number;
        uniqueVisitors: number;
        returnVisitors: number;
        topPages: {
            path: string;
            views: number;
        }[];
    }>;
    getSalesMetrics(query: AnalyticsQueryDto): Promise<import("./analytics.service").SalesMetrics>;
    getCustomerMetrics(query: AnalyticsQueryDto): Promise<import("./analytics.service").CustomerMetrics>;
    getInventoryMetrics(query: AnalyticsQueryDto): Promise<import("./analytics.service").InventoryMetrics>;
    getBusinessKPIs(query: AnalyticsQueryDto): Promise<import("./analytics.service").BusinessKPIs>;
    exportAnalytics(type: 'sales' | 'customers' | 'inventory' | 'all', format: 'csv' | 'excel' | 'pdf', query: AnalyticsQueryDto): Promise<{
        filename: string;
        downloadUrl: string;
    }>;
    getRealTimeSales(): Promise<import("./analytics.service").SalesMetrics>;
    getRealTimeOrders(): Promise<{
        todayOrders: number;
        todayRevenue: number;
        averageOrderValue: number;
        lastUpdated: Date;
    }>;
}
export {};
