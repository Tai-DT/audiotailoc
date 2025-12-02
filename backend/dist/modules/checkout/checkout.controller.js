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
exports.CheckoutController = void 0;
const common_1 = require("@nestjs/common");
const checkout_service_1 = require("./checkout.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const class_validator_1 = require("class-validator");
class CheckoutDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "promotionCode", void 0);
let CheckoutController = class CheckoutController {
    constructor(checkout) {
        this.checkout = checkout;
    }
    async create(req, dto) {
        const order = await this.checkout.createOrder(req.user?.sub, { promotionCode: dto.promotionCode });
        return { order };
    }
    async getByOrderNo(req, orderNo) {
        return this.checkout.getOrderForUserByNo(req.user?.sub, orderNo);
    }
};
exports.CheckoutController = CheckoutController;
__decorate([
    (0, common_1.Post)('create-order'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CheckoutDto]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('order-by-no/:orderNo'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orderNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "getByOrderNo", null);
exports.CheckoutController = CheckoutController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('checkout'),
    __metadata("design:paramtypes", [checkout_service_1.CheckoutService])
], CheckoutController);
//# sourceMappingURL=checkout.controller.js.map