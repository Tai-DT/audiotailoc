export declare class SimpleAnalyticsController {
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
                labels: string[];
                data: number[];
            };
            userChart: {
                labels: string[];
                data: number[];
            };
        };
        message: string;
    }>;
    getRevenueAnalytics(): Promise<{
        success: boolean;
        data: {
            totalRevenue: number;
            revenueGrowth: number;
            monthlyRevenue: any[];
            dailyRevenue: any[];
        };
        message: string;
    }>;
    getOrderAnalytics(): Promise<{
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
    getUserAnalytics(): Promise<{
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
    getProductAnalytics(): Promise<{
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
