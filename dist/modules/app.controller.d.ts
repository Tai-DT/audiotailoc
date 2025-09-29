export declare class AppController {
    root(): {
        name: string;
        version: string;
    };
    getDashboardAnalytics(): {
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
    };
    getRevenueAnalytics(): {
        success: boolean;
        data: {
            totalRevenue: number;
            revenueGrowth: number;
            monthlyRevenue: any[];
            dailyRevenue: any[];
        };
        message: string;
    };
    getOrderAnalytics(): {
        success: boolean;
        data: {
            totalOrders: number;
            ordersGrowth: number;
            ordersByStatus: {};
            monthlyOrders: any[];
            dailyOrders: any[];
        };
        message: string;
    };
    getUserAnalytics(): {
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
    };
    getProductAnalytics(): {
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
    };
}
