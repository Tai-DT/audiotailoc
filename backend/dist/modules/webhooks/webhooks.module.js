"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksModule = void 0;
const common_1 = require("@nestjs/common");
const zalo_controller_1 = require("./zalo.controller");
const zalo_service_1 = require("./zalo.service");
const webhooks_service_1 = require("./webhooks.service");
const webhooks_controller_1 = require("./webhooks.controller");
const payments_module_1 = require("../payments/payments.module");
const orders_module_1 = require("../orders/orders.module");
const notifications_module_1 = require("../notifications/notifications.module");
let WebhooksModule = class WebhooksModule {
};
exports.WebhooksModule = WebhooksModule;
exports.WebhooksModule = WebhooksModule = __decorate([
    (0, common_1.Module)({
        imports: [payments_module_1.PaymentsModule, orders_module_1.OrdersModule, notifications_module_1.NotificationsModule],
        providers: [zalo_service_1.ZaloService, webhooks_service_1.WebhooksService],
        controllers: [zalo_controller_1.ZaloWebhookController, webhooks_controller_1.WebhooksController],
        exports: [webhooks_service_1.WebhooksService],
    })
], WebhooksModule);
//# sourceMappingURL=webhooks.module.js.map