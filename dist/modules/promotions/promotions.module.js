"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionsModule = void 0;
const common_1 = require("@nestjs/common");
const promotion_service_1 = require("./promotion.service");
const promotions_controller_1 = require("./promotions.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
let PromotionsModule = class PromotionsModule {
};
exports.PromotionsModule = PromotionsModule;
exports.PromotionsModule = PromotionsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [promotions_controller_1.PromotionsController],
        providers: [promotion_service_1.PromotionService],
        exports: [promotion_service_1.PromotionService],
    })
], PromotionsModule);
//# sourceMappingURL=promotions.module.js.map