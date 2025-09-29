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
    getDashboardData(query: AnalyticsQueryDto): unknown;
    getOverview(range?: string): unknown;
    getTrends(range?: string): unknown;
    getTopServices(limit?: string): unknown;
    getSalesMetrics(query: AnalyticsQueryDto): unknown;
    getCustomerMetrics(query: AnalyticsQueryDto): unknown;
    getInventoryMetrics(query: AnalyticsQueryDto): unknown;
    getBusinessKPIs(query: AnalyticsQueryDto): unknown;
    exportAnalytics(type: 'sales' | 'customers' | 'inventory' | 'all', format: 'csv' | 'excel' | 'pdf', query: AnalyticsQueryDto): unknown;
    getRealTimeSales(): unknown;
    getRealTimeOrders(): unknown;
}
export {};
