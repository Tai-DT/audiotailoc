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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PromotionService = class PromotionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validate(code) {
        if (!code)
            return null;
        const now = new Date();
        const promo = await this.prisma.promotions.findUnique({ where: { code } });
        if (!promo)
            return null;
        if (promo.expiresAt && promo.expiresAt < now)
            return null;
        if (promo.isActive === false)
            return null;
        return { code: promo.code, type: promo.type, value: promo.value };
    }
    computeDiscount(promo, subtotal) {
        if (!promo)
            return 0;
        if (promo.type === 'FIXED')
            return Math.min(subtotal, promo.value);
        const pct = Math.max(0, Math.min(100, promo.value));
        return Math.floor((subtotal * pct) / 100);
    }
};
exports.PromotionService = PromotionService;
exports.PromotionService = PromotionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromotionService);
//# sourceMappingURL=promotion.service.js.map