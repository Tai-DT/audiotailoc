"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const health_module_1 = require("./health/health.module");
const app_controller_1 = require("./app.controller");
const logger_module_1 = require("./logger/logger.module");
const prisma_module_1 = require("../prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const catalog_module_1 = require("./catalog/catalog.module");
const cart_module_1 = require("./cart/cart.module");
const checkout_module_1 = require("./checkout/checkout.module");
const orders_module_1 = require("./orders/orders.module");
const payments_module_1 = require("./payments/payments.module");
const search_module_1 = require("./search/search.module");
const files_module_1 = require("./files/files.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({ isGlobal: true }), logger_module_1.LoggerModule, prisma_module_1.PrismaModule, health_module_1.HealthModule, auth_module_1.AuthModule, users_module_1.UsersModule, catalog_module_1.CatalogModule, cart_module_1.CartModule, checkout_module_1.CheckoutModule, orders_module_1.OrdersModule, payments_module_1.PaymentsModule, search_module_1.SearchModule, files_module_1.FilesModule, webhooks_module_1.WebhooksModule],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map