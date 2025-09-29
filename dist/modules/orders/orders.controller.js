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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
let OrdersController = class OrdersController {
    constructor(orders, config) {
        this.orders = orders;
        this.config = config;
    }
    list(page = '1', pageSize = '20', status) {
        return this.orders.list({ page: Number(page), pageSize: Number(pageSize), status });
    }
    create(req) {
        console.log('=== CONTROLLER CREATE DEBUG ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        const expectedKey = this.config.get('PUBLIC_ORDER_API_KEY');
        if (expectedKey) {
            const headerValue = req.headers?.['x-order-key'];
            if (headerValue !== expectedKey) {
                throw new common_1.ForbiddenException('Invalid order token');
            }
        }
        return this.orders.create(req.body);
    }
    createLegacy(req) {
        const expectedKey = this.config.get('PUBLIC_ORDER_API_KEY');
        if (expectedKey) {
            const headerValue = req.headers?.['x-order-key'];
            if (headerValue !== expectedKey) {
                throw new common_1.ForbiddenException('Invalid order token');
            }
        }
        return this.orders.create(req.body);
    }
    get(id) {
        return this.orders.get(id);
    }
    updateStatusLegacy(id, status) {
        return this.orders.updateStatus(id, status);
    }
    updateStatus(id, payload) {
        return this.orders.updateStatus(id, payload?.status);
    }
    update(id, updateOrderDto) {
        return this.orders.update(id, updateOrderDto);
    }
    delete(id) {
        return this.orders.delete(id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60 } }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "createLegacy", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Patch)(':id/status/:status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatusLegacy", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "delete", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService, config_1.ConfigService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map