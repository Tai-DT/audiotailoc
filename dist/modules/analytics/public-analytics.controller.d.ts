import { AnalyticsService } from './analytics.service';
export declare class PublicAnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardAnalytics(): Promise<{
        success: boolean;
        data: {
            totalRevenue: number;
            totalOrders: number;
            totalUsers: number;
            totalProducts: number;
            revenueGrowth: number;
            ordersGrowth: number;
            usersGrowth: number;
            productsGrowth: number;
            recentOrders: any[];
            topProducts: any[];
            salesChart: {
                labels: any[];
                data: any[];
            };
            userChart: {
                labels: any[];
                data: any[];
            };
        };
        message: string;
    }>;
    getRevenueAnalytics(_startDate?: string, _endDate?: string): Promise<{
        success: boolean;
        data: {
            totalRevenue: number;
            revenueGrowth: number;
            monthlyRevenue: any[];
            dailyRevenue: any[];
        };
        message: string;
    }>;
    getOrderAnalytics(_startDate?: string, _endDate?: string): Promise<{
        success: boolean;
        data: {
            totalOrders: number;
            ordersGrowth: number;
            ordersByStatus: {};
            monthlyOrders: any[];
            dailyOrders: any[];
        };
        message: string;
    }>;
    getUserAnalytics(_startDate?: string, _endDate?: string): Promise<{
        success: boolean;
        data: {
            totalUsers: number;
            usersGrowth: number;
            activeUsers: number;
            newUsers: number;
            monthlyUsers: any[];
            dailyUsers: any[];
        };
        message: string;
    }>;
    getProductAnalytics(_startDate?: string, _endDate?: string): Promise<{
        success: boolean;
        data: {
            totalProducts: number;
            productsGrowth: number;
            topProducts: any[];
            categoryDistribution: {};
            monthlyProducts: any[];
            dailyProducts: any[];
        };
        message: string;
    }>;
}
