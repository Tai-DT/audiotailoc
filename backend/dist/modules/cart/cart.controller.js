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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const class_validator_1 = require("class-validator");
class AddToCartDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddToCartDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddToCartDto.prototype, "quantity", void 0);
class UpdateCartItemDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateCartItemDto.prototype, "quantity", void 0);
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    async getCart(cartId, userId) {
        if (cartId) {
            return this.cartService.getGuestCart(cartId);
        }
        if (userId) {
            return this.cartService.getUserCart(userId);
        }
        return {
            items: [],
            total: 0,
            message: 'No cart ID provided',
        };
    }
    async addToCart(addToCartDto, cartId, userId) {
        if (cartId) {
            return this.cartService.addToGuestCart(cartId, addToCartDto.productId, addToCartDto.quantity);
        }
        if (userId) {
            return this.cartService.addToUserCart(userId, addToCartDto.productId, addToCartDto.quantity);
        }
        return {
            success: false,
            message: 'No cart ID provided',
        };
    }
    async createGuestCart() {
        return this.cartService.createGuestCart();
    }
    async getGuestCart(cartId) {
        return this.cartService.getGuestCart(cartId);
    }
    async addToGuestCart(cartId, addToCartDto) {
        return this.cartService.addToGuestCart(cartId, addToCartDto.productId, addToCartDto.quantity);
    }
    async updateGuestCartItem(cartId, productId, updateCartItemDto) {
        return this.cartService.updateGuestCartItem(cartId, productId, updateCartItemDto.quantity);
    }
    async removeFromGuestCart(cartId, productId) {
        return this.cartService.removeFromGuestCart(cartId, productId);
    }
    async clearGuestCart(cartId) {
        return this.cartService.clearGuestCart(cartId);
    }
    async convertGuestCartToUserCart(cartId, userId) {
        return this.cartService.convertGuestCartToUserCart(cartId, userId);
    }
    async getUserCart(userId) {
        return this.cartService.getUserCart(userId);
    }
    async addToUserCart(userId, addToCartDto) {
        return this.cartService.addToUserCart(userId, addToCartDto.productId, addToCartDto.quantity);
    }
    async updateUserCartItem(userId, productId, updateCartItemDto) {
        return this.cartService.updateUserCartItem(userId, productId, updateCartItemDto.quantity);
    }
    async removeFromUserCart(userId, productId) {
        return this.cartService.removeFromUserCart(userId, productId);
    }
    async clearUserCart(userId) {
        return this.cartService.clearUserCart(userId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('cartId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('items'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('cartId')),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddToCartDto, String, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Post)('guest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CartController.prototype, "createGuestCart", null);
__decorate([
    (0, common_1.Get)('guest/:cartId'),
    __param(0, (0, common_1.Param)('cartId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getGuestCart", null);
__decorate([
    (0, common_1.Post)('guest/:cartId/items'),
    __param(0, (0, common_1.Param)('cartId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AddToCartDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addToGuestCart", null);
__decorate([
    (0, common_1.Put)('guest/:cartId/items/:productId'),
    __param(0, (0, common_1.Param)('cartId')),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, UpdateCartItemDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateGuestCartItem", null);
__decorate([
    (0, common_1.Delete)('guest/:cartId/items/:productId'),
    __param(0, (0, common_1.Param)('cartId')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeFromGuestCart", null);
__decorate([
    (0, common_1.Delete)('guest/:cartId/clear'),
    __param(0, (0, common_1.Param)('cartId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearGuestCart", null);
__decorate([
    (0, common_1.Post)('guest/:cartId/convert/:userId'),
    __param(0, (0, common_1.Param)('cartId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "convertGuestCartToUserCart", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getUserCart", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)('user/items'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AddToCartDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addToUserCart", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Put)('user/items/:productId'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, UpdateCartItemDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateUserCartItem", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Delete)('user/items/:productId'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeFromUserCart", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Delete)('user/clear'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearUserCart", null);
exports.CartController = CartController = __decorate([
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map