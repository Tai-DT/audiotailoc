import { Response } from 'express';
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
    private readonly logger;
    constructor(analyticsService: AnalyticsService);
    getDashboardData(query: AnalyticsQueryDto): Promise<{
        sales: import("./analytics.service").SalesMetrics;
        customers: import("./analytics.service").CustomerMetrics;
        inventory: import("./analytics.service").InventoryMetrics;
        kpis: import("./analytics.service").BusinessKPIs;
        recentActivity: {
            type: string;
            description: string;
            timestamp: Date;
            value?: number;
        }[];
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
    getTopProducts(limit?: string): Promise<{
        id: string;
        name: string;
        sold: number;
        revenue: number;
    }[]>;
    getTopServices(limit?: string): Promise<{
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
    getSalesMetrics(query: AnalyticsQueryDto): Promise<import("./analytics.service").SalesMetrics>;
    getCustomerMetrics(query: AnalyticsQueryDto): Promise<import("./analytics.service").CustomerMetrics>;
    getInventoryMetrics(query: AnalyticsQueryDto): Promise<import("./analytics.service").InventoryMetrics>;
    getBusinessKPIs(query: AnalyticsQueryDto): Promise<import("./analytics.service").BusinessKPIs>;
    getRealTimeSales(): Promise<import("./analytics.service").SalesMetrics>;
    getRealTimeOrders(): Promise<{
        todayOrders: number;
        todayRevenue: number;
        averageOrderValue: number;
        lastUpdated: Date;
    }>;
    downloadAnalytics(filename: string, res: Response): Promise<void>;
}
export {};
