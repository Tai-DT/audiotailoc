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
const swagger_1 = require("@nestjs/swagger");
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
        const overview = await this.analyticsService.getOverview(range);
        return overview;
    }
    async getTrends(range = '7days') {
        return this.analyticsService.getTrends(range);
    }
    async getRevenue(period = 'month') {
        const endDate = new Date();
        let startDate = new Date();
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
            case 'all':
                startDate = new Date(0);
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
            revenueGrowth: salesMetrics.revenueGrowth || 0,
        };
    }
    async getRevenueChart(days) {
        const daysNum = days ? parseInt(days) : 7;
        const result = await this.analyticsService.getRevenueChartData(daysNum);
        return result;
    }
    async getTopSellingProductsReal(limit) {
        const limitNum = limit ? parseInt(limit) : 5;
        const result = await this.analyticsService.getTopSellingProductsReal(limitNum);
        return result;
    }
    async getGrowthMetricsReal() {
        const result = await this.analyticsService.getGrowthMetricsReal();
        return result;
    }
    async getBookingsTodayReal() {
        const result = await this.analyticsService.getBookingsTodayReal();
        return result;
    }
    async getTopServices(limit = '5') {
        const limitNum = parseInt(limit) || 5;
        return this.analyticsService.getTopServices(limitNum);
    }
    async getTopProducts(limit = '5') {
        const limitNum = parseInt(limit) || 5;
        return this.analyticsService.getTopSellingProductsReal(limitNum);
    }
    async getUserActivity(range = '7days') {
        return this.analyticsService.getUserActivity(range);
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
    (0, common_1.Get)('revenue/chart'),
    (0, swagger_1.ApiOperation)({ summary: 'Get revenue chart data for dashboard' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRevenueChart", null);
__decorate([
    (0, common_1.Get)('products/top-selling-real'),
    (0, swagger_1.ApiOperation)({ summary: 'Get real top selling products from orders' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopSellingProductsReal", null);
__decorate([
    (0, common_1.Get)('growth-metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get growth metrics for orders and customers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getGrowthMetricsReal", null);
__decorate([
    (0, common_1.Get)('services/bookings-today-real'),
    (0, swagger_1.ApiOperation)({ summary: 'Get real service bookings count for today' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getBookingsTodayReal", null);
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