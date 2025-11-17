"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutModule = void 0;
const common_1 = require("@nestjs/common");
const checkout_service_1 = require("./checkout.service");
const checkout_controller_1 = require("./checkout.controller");
const cart_module_1 = require("../cart/cart.module");
const promotions_module_1 = require("../promotions/promotions.module");
const mail_service_1 = require("../notifications/mail.service");
const prisma_module_1 = require("../../prisma/prisma.module");
let CheckoutModule = class CheckoutModule {
};
exports.CheckoutModule = CheckoutModule;
exports.CheckoutModule = CheckoutModule = __decorate([
    (0, common_1.Module)({
        imports: [cart_module_1.CartModule, promotions_module_1.PromotionsModule, prisma_module_1.PrismaModule],
        providers: [checkout_service_1.CheckoutService, mail_service_1.MailService],
        controllers: [checkout_controller_1.CheckoutController],
    })
], CheckoutModule);
//# sourceMappingURL=checkout.module.js.map