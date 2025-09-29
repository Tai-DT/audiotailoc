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
exports.InventoryMovementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_movement_service_1 = require("./inventory-movement.service");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
let InventoryMovementController = class InventoryMovementController {
    constructor(inventoryMovementService) {
        this.inventoryMovementService = inventoryMovementService;
    }
    async create(data) {
        return this.inventoryMovementService.create(data);
    }
    async findAll(page, pageSize, productId, type, userId, startDate, endDate) {
        const params = {
            page: page ? parseInt(page) : undefined,
            pageSize: pageSize ? parseInt(pageSize) : undefined,
            productId,
            type,
            userId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        return this.inventoryMovementService.findAll(params);
    }
    async findByProduct(productId, page, pageSize) {
        const params = {
            page: page ? parseInt(page) : undefined,
            pageSize: pageSize ? parseInt(pageSize) : undefined,
        };
        return this.inventoryMovementService.findByProduct(productId, params);
    }
    async getSummary(productId, startDate, endDate) {
        const params = {
            productId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        return this.inventoryMovementService.getSummary(params.productId, params.startDate, params.endDate);
    }
};
exports.InventoryMovementController = InventoryMovementController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create inventory movement' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Movement created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryMovementController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all inventory movements' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Movements retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('productId')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('userId')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], InventoryMovementController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get movements for specific product' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product movements retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], InventoryMovementController.prototype, "findByProduct", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get movement summary' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Movement summary retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], InventoryMovementController.prototype, "getSummary", null);
exports.InventoryMovementController = InventoryMovementController = __decorate([
    (0, swagger_1.ApiTags)('Inventory Movements'),
    (0, common_1.Controller)('inventory/movements'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [inventory_movement_service_1.InventoryMovementService])
], InventoryMovementController);
//# sourceMappingURL=inventory-movement.controller.js.map