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
exports.InventoryAlertController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_alert_service_1 = require("./inventory-alert.service");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
let InventoryAlertController = class InventoryAlertController {
    constructor(inventoryAlertsService) {
        this.inventoryAlertsService = inventoryAlertsService;
    }
    async create(data) {
        return this.inventoryAlertsService.create(data);
    }
    async findAll(page, pageSize, productId, type, isResolved, startDate, endDate) {
        const params = {
            page: page ? parseInt(page) : undefined,
            pageSize: pageSize ? parseInt(pageSize) : undefined,
            productId,
            type,
            isResolved: isResolved ? isResolved === 'true' : undefined,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        return this.inventoryAlertsService.findAll(params);
    }
    async findByProduct(productId, page, pageSize) {
        const params = {
            page: page ? parseInt(page) : undefined,
            pageSize: pageSize ? parseInt(pageSize) : undefined,
        };
        return this.inventoryAlertsService.findByProduct(productId, params);
    }
    async getActiveAlerts() {
        return this.inventoryAlertsService.getActiveAlerts();
    }
    async getAlertSummary() {
        return this.inventoryAlertsService.getAlertSummary();
    }
    async resolve(id) {
        return this.inventoryAlertsService.resolve(id);
    }
    async bulkResolve(data) {
        return this.inventoryAlertsService.bulkResolve(data.ids);
    }
    async checkAndCreateAlerts(data = {}) {
        return this.inventoryAlertsService.checkAndCreateAlerts(data.productId);
    }
    async delete(id) {
        return this.inventoryAlertsService.delete(id);
    }
    async bulkDelete(data) {
        return this.inventoryAlertsService.bulkDelete(data.ids);
    }
};
exports.InventoryAlertController = InventoryAlertController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create inventory alert' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Alert created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryAlertController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all inventory alerts' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alerts retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('productId')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('isResolved')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], InventoryAlertController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alerts for specific product' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product alerts retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], InventoryAlertController.prototype, "findByProduct", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active alerts' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Active alerts retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryAlertController.prototype, "getActiveAlerts", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert summary' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alert summary retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryAlertController.prototype, "getAlertSummary", null);
__decorate([
    (0, common_1.Patch)(':id/resolve'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve alert' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alert resolved successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryAlertController.prototype, "resolve", null);
__decorate([
    (0, common_1.Post)('bulk-resolve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk resolve alerts' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alerts resolved successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryAlertController.prototype, "bulkResolve", null);
__decorate([
    (0, common_1.Post)('check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Check and create alerts based on current stock' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alerts checked and created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryAlertController.prototype, "checkAndCreateAlerts", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete alert' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alert deleted successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryAlertController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('bulk-delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk delete alerts' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alerts deleted successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryAlertController.prototype, "bulkDelete", null);
exports.InventoryAlertController = InventoryAlertController = __decorate([
    (0, swagger_1.ApiTags)('Inventory Alerts'),
    (0, common_1.Controller)('inventory/alerts'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [inventory_alert_service_1.InventoryAlertsService])
], InventoryAlertController);
//# sourceMappingURL=inventory-alert.controller.js.map