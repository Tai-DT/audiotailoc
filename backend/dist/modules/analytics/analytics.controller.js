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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
const class_validator_1 = require("class-validator");
class AnalyticsQueryDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AnalyticsQueryDto.prototype, "productIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AnalyticsQueryDto.prototype, "categoryIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "customerSegment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "region", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "channel", void 0);
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getDashboardData(query) {
        const filters = {
            startDate: query.startDate ? new Date(query.startDate) : undefined,
            endDate: query.endDate ? new Date(query.endDate) : undefined,
            productIds: query.productIds,
            categoryIds: query.categoryIds,
            customerSegment: query.customerSegment,
            region: query.region,
            channel: query.channel,
        };
        return this.analyticsService.getDashboardData(filters);
    }
    async getOverview(range = '7days') {
        const endDate = new Date();
        const startDate = new Date();
        switch (range) {
            case '7days':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(endDate.getDate() - 90);
                break;
            case '1year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(endDate.getDate() - 7);
        }
        const filters = {
            startDate,
            endDate,
        };
        const dashboardData = await this.analyticsService.getDashboardData(filters);
        return {
            totalRevenue: dashboardData.sales?.totalRevenue || 0,
            totalOrders: dashboardData.sales?.totalOrders || 0,
            totalCustomers: dashboardData.customers?.totalCustomers || 0,
            newCustomers: dashboardData.customers?.newCustomers || 0,
            conversionRate: dashboardData.sales?.conversionRate || 0,
            revenueGrowth: dashboardData.sales?.revenueGrowth || 0,
            ordersGrowth: dashboardData.sales?.orderGrowth || 0,
            customersGrowth: 0,
        };
    }
    async getTrends(range = '7days') {
        const endDate = new Date();
        const startDate = new Date();
        switch (range) {
            case '7days':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(endDate.getDate() - 90);
                break;
            case '1year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(endDate.getDate() - 7);
        }
        const _filters = {
            startDate,
            endDate,
        };
        const trends = [];
        const days = range === '7days' ? 7 : range === '30days' ? 30 : 7;
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            trends.push({
                date: date.toISOString().split('T')[0],
                revenue: Math.floor(Math.random() * 10000) + 1000,
                orders: Math.floor(Math.random() * 50) + 5,
                customers: Math.floor(Math.random() * 20) + 2,
            });
        }
        return trends;
    }
    async getRevenue(period = 'month') {
        const endDate = new Date();
        const startDate = new Date();
        switch (period) {
            case 'day':
                startDate.setDate(endDate.getDate() - 1);
                break;
            case 'week':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(endDate.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(endDate.getMonth() - 1);
        }
        const filters = {
            startDate,
            endDate,
        };
        const salesMetrics = await this.analyticsService.getSalesMetrics(filters);
        return {
            period,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            totalRevenue: salesMetrics.totalRevenue || 0,
            totalOrders: salesMetrics.totalOrders || 0,
            averageOrderValue: salesMetrics.averageOrderValue || 0,
            revenueGrowth: salesMetrics.revenueGrowth || 0
        };
    }
    async getTopServices(limit = '5') {
        const limitNum = parseInt(limit) || 5;
        const topServices = [
            { id: '1', name: 'Sửa chữa loa', bookings: 45, revenue: 13500000 },
            { id: '2', name: 'Bảo dưỡng ampli', bookings: 32, revenue: 9600000 },
            { id: '3', name: 'Thay linh kiện', bookings: 28, revenue: 8400000 },
            { id: '4', name: 'Tư vấn hệ thống', bookings: 21, revenue: 6300000 },
            { id: '5', name: 'Cài đặt âm thanh', bookings: 18, revenue: 5400000 },
        ];
        return topServices.slice(0, limitNum);
    }
    async getTopProducts(limit = '5') {
        const limitNum = parseInt(limit) || 5;
        const topProducts = [
            { id: '1', name: 'Loa Bluetooth Sony', sold: 125, revenue: 37500000 },
            { id: '2', name: 'Ampli Denon', sold: 89, revenue: 26700000 },
            { id: '3', name: 'Micro không dây', sold: 67, revenue: 20100000 },
            { id: '4', name: 'Dàn karaoke', sold: 45, revenue: 13500000 },
            { id: '5', name: 'Tai nghe gaming', sold: 34, revenue: 10200000 },
        ];
        return topProducts.slice(0, limitNum);
    }
    async getUserActivity(range = '7days') {
        const endDate = new Date();
        const startDate = new Date();
        switch (range) {
            case '7days':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(endDate.getDate() - 90);
                break;
            case '1year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(endDate.getDate() - 7);
        }
        const userActivity = {
            pageViews: Math.floor(Math.random() * 10000) + 5000,
            sessions: Math.floor(Math.random() * 1000) + 500,
            avgSessionDuration: Math.floor(Math.random() * 300) + 120,
            bounceRate: Math.floor(Math.random() * 30) + 20,
            uniqueVisitors: Math.floor(Math.random() * 500) + 200,
            returnVisitors: Math.floor(Math.random() * 300) + 100,
            topPages: [
                { path: '/san-pham', views: Math.floor(Math.random() * 1000) + 500 },
                { path: '/dich-vu', views: Math.floor(Math.random() * 800) + 300 },
                { path: '/lien-he', views: Math.floor(Math.random() * 400) + 100 },
            ]
        };
        return userActivity;
    }
    async getSalesMetrics(query) {
        const filters = {
            startDate: query.startDate ? new Date(query.startDate) : undefined,
            endDate: query.endDate ? new Date(query.endDate) : undefined,
            productIds: query.productIds,
            categoryIds: query.categoryIds,
            customerSegment: query.customerSegment,
            region: query.region,
            channel: query.channel,
        };
        return this.analyticsService.getSalesMetrics(filters);
    }
    async getCustomerMetrics(query) {
        const filters = {
            startDate: query.startDate ? new Date(query.startDate) : undefined,
            endDate: query.endDate ? new Date(query.endDate) : undefined,
            productIds: query.productIds,
            categoryIds: query.categoryIds,
            customerSegment: query.customerSegment,
            region: query.region,
            channel: query.channel,
        };
        return this.analyticsService.getCustomerMetrics(filters);
    }
    async getInventoryMetrics(query) {
        const filters = {
            startDate: query.startDate ? new Date(query.startDate) : undefined,
            endDate: query.endDate ? new Date(query.endDate) : undefined,
            productIds: query.productIds,
            categoryIds: query.categoryIds,
            customerSegment: query.customerSegment,
            region: query.region,
            channel: query.channel,
        };
        return this.analyticsService.getInventoryMetrics(filters);
    }
    async getBusinessKPIs(query) {
        const filters = {
            startDate: query.startDate ? new Date(query.startDate) : undefined,
            endDate: query.endDate ? new Date(query.endDate) : undefined,
            productIds: query.productIds,
            categoryIds: query.categoryIds,
            customerSegment: query.customerSegment,
            region: query.region,
            channel: query.channel,
        };
        return this.analyticsService.getBusinessKPIs(filters);
    }
    async exportAnalytics(type, format = 'csv', query) {
        const filters = {
            startDate: query.startDate ? new Date(query.startDate) : undefined,
            endDate: query.endDate ? new Date(query.endDate) : undefined,
            productIds: query.productIds,
            categoryIds: query.categoryIds,
            customerSegment: query.customerSegment,
            region: query.region,
            channel: query.channel,
        };
        const filename = await this.analyticsService.exportAnalytics(type, format, filters);
        return { filename, downloadUrl: `/api/v1/analytics/download/${filename}` };
    }
    async getRealTimeSales() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const filters = {
            startDate: today,
            endDate: now,
        };
        return this.analyticsService.getSalesMetrics(filters);
    }
    async getRealTimeOrders() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const filters = {
            startDate: today,
            endDate: now,
        };
        const salesMetrics = await this.analyticsService.getSalesMetrics(filters);
        return {
            todayOrders: salesMetrics.totalOrders,
            todayRevenue: salesMetrics.totalRevenue,
            averageOrderValue: salesMetrics.averageOrderValue,
            lastUpdated: new Date(),
        };
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboardData", null);
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Query)('range')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('trends'),
    __param(0, (0, common_1.Query)('range')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTrends", null);
__decorate([
    (0, common_1.Get)('revenue'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Get)('top-services'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopServices", null);
__decorate([
    (0, common_1.Get)('top-products'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopProducts", null);
__decorate([
    (0, common_1.Get)('user-activity'),
    __param(0, (0, common_1.Query)('range')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getUserActivity", null);
__decorate([
    (0, common_1.Get)('sales'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSalesMetrics", null);
__decorate([
    (0, common_1.Get)('customers'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCustomerMetrics", null);
__decorate([
    (0, common_1.Get)('inventory'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getInventoryMetrics", null);
__decorate([
    (0, common_1.Get)('kpis'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getBusinessKPIs", null);
__decorate([
    (0, common_1.Get)('export/:type'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Query)('format')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "exportAnalytics", null);
__decorate([
    (0, common_1.Get)('realtime/sales'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRealTimeSales", null);
__decorate([
    (0, common_1.Get)('realtime/orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRealTimeOrders", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map