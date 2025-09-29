"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
let SimpleAnalyticsController = class SimpleAnalyticsController {
    async getDashboardAnalytics() {
        return {
            success: true,
            data: {
                totalRevenue: 0,
                totalOrders: 0,
                totalUsers: 0,
                totalProducts: 0,
                revenueGrowth: 0,
                ordersGrowth: 0,
                usersGrowth: 0,
                productsGrowth: 0,
                recentOrders: [],
                topProducts: [],
                salesChart: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    data: [0, 0, 0, 0, 0, 0]
                },
                userChart: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    data: [0, 0, 0, 0, 0, 0]
                }
            },
            message: 'Analytics data retrieved successfully'
        };
    }
    async getRevenueAnalytics() {
        return {
            success: true,
            data: {
                totalRevenue: 0,
                revenueGrowth: 0,
                monthlyRevenue: [],
                dailyRevenue: []
            },
            message: 'Revenue analytics retrieved successfully'
        };
    }
    async getOrderAnalytics() {
        return {
            success: true,
            data: {
                totalOrders: 0,
                ordersGrowth: 0,
                ordersByStatus: {},
                monthlyOrders: [],
                dailyOrders: []
            },
            message: 'Order analytics retrieved successfully'
        };
    }
    async getUserAnalytics() {
        return {
            success: true,
            data: {
                totalUsers: 0,
                usersGrowth: 0,
                activeUsers: 0,
                newUsers: 0,
                monthlyUsers: [],
                dailyUsers: []
            },
            message: 'User analytics retrieved successfully'
        };
    }
    async getProductAnalytics() {
        return {
            success: true,
            data: {
                totalProducts: 0,
                productsGrowth: 0,
                topProducts: [],
                categoryDistribution: {},
                monthlyProducts: [],
                dailyProducts: []
            },
            message: 'Product analytics retrieved successfully'
        };
    }
};
exports.SimpleAnalyticsController = SimpleAnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimpleAnalyticsController.prototype, "getDashboardAnalytics", null);
__decorate([
    (0, common_1.Get)('revenue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimpleAnalyticsController.prototype, "getRevenueAnalytics", null);
__decorate([
    (0, common_1.Get)('orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimpleAnalyticsController.prototype, "getOrderAnalytics", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimpleAnalyticsController.prototype, "getUserAnalytics", null);
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimpleAnalyticsController.prototype, "getProductAnalytics", null);
exports.SimpleAnalyticsController = SimpleAnalyticsController = __decorate([
    (0, common_1.Controller)('simple-analytics')
], SimpleAnalyticsController);
//# sourceMappingURL=simple-analytics.controller.js.map