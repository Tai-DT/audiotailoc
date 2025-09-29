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
exports.WishlistController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const wishlist_service_1 = require("./wishlist.service");
const create_wishlist_dto_1 = require("./dto/create-wishlist.dto");
const swagger_1 = require("@nestjs/swagger");
let WishlistController = class WishlistController {
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
    }
    async addToWishlist(req, createWishlistDto) {
        const userId = req.user.sub;
        return this.wishlistService.addToWishlist(userId, createWishlistDto);
    }
    async getWishlist(req) {
        const userId = req.user.sub;
        return this.wishlistService.getWishlist(userId);
    }
    async getWishlistCount(req) {
        const userId = req.user.sub;
        const count = await this.wishlistService.getWishlistCount(userId);
        return { count };
    }
    async isInWishlist(req, productId) {
        const userId = req.user.sub;
        const isInWishlist = await this.wishlistService.isInWishlist(userId, productId);
        return { isInWishlist };
    }
    async removeFromWishlist(req, productId) {
        const userId = req.user.sub;
        return this.wishlistService.removeFromWishlist(userId, productId);
    }
    async clearWishlist(req) {
        const userId = req.user.sub;
        return this.wishlistService.clearWishlist(userId);
    }
};
exports.WishlistController = WishlistController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add product to wishlist' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product added to wishlist successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Product already in wishlist' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_wishlist_dto_1.CreateWishlistDto]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "addToWishlist", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user wishlist' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wishlist retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "getWishlist", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wishlist item count' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Count retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "getWishlistCount", null);
__decorate([
    (0, common_1.Get)('check/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if product is in wishlist' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Check completed successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "isInWishlist", null);
__decorate([
    (0, common_1.Delete)(':productId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove product from wishlist' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product removed from wishlist successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found in wishlist' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "removeFromWishlist", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Clear entire wishlist' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wishlist cleared successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "clearWishlist", null);
exports.WishlistController = WishlistController = __decorate([
    (0, swagger_1.ApiTags)('Wishlist'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('wishlist'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [wishlist_service_1.WishlistService])
], WishlistController);
//# sourceMappingURL=wishlist.controller.js.map