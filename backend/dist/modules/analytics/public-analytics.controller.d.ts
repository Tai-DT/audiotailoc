import { AnalyticsService } from './analytics.service';
export declare class PublicAnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardAnalytics(): unknown;
    getRevenueAnalytics(_startDate?: string, _endDate?: string): unknown;
    getOrderAnalytics(_startDate?: string, _endDate?: string): unknown;
    getUserAnalytics(_startDate?: string, _endDate?: string): unknown;
    getProductAnalytics(_startDate?: string, _endDate?: string): unknown;
}
