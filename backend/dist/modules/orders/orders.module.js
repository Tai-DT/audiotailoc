"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const users_module_1 = require("../users/users.module");
const notifications_module_1 = require("../notifications/notifications.module");
const guards_module_1 = require("../auth/guards.module");
const cache_service_1 = require("../caching/cache.service");
const promotions_module_1 = require("../promotions/promotions.module");
const inventory_module_1 = require("../inventory/inventory.module");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            users_module_1.UsersModule,
            notifications_module_1.NotificationsModule,
            guards_module_1.GuardsModule,
            promotions_module_1.PromotionsModule,
            inventory_module_1.InventoryModule,
        ],
        providers: [orders_service_1.OrdersService, cache_service_1.CacheService],
        controllers: [orders_controller_1.OrdersController],
        exports: [orders_service_1.OrdersService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map