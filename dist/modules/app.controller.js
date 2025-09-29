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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
let AppController = class AppController {
    root() {
        return { name: 'audiotailoc-backend', version: '0.1.0' };
    }
    getDashboardAnalytics() {
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
    getRevenueAnalytics() {
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
    getOrderAnalytics() {
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
    getUserAnalytics() {
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
    getProductAnalytics() {
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
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "root", null);
__decorate([
    (0, common_1.Get)('analytics/dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getDashboardAnalytics", null);
__decorate([
    (0, common_1.Get)('analytics/revenue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getRevenueAnalytics", null);
__decorate([
    (0, common_1.Get)('analytics/orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getOrderAnalytics", null);
__decorate([
    (0, common_1.Get)('analytics/users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getUserAnalytics", null);
__decorate([
    (0, common_1.Get)('analytics/products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getProductAnalytics", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)()
], AppController);
//# sourceMappingURL=app.controller.js.map