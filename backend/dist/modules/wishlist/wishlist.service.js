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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
let WishlistService = class WishlistService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addToWishlist(userId, createWishlistDto) {
        const { productId } = createWishlistDto;
        const product = await this.prisma.products.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existingItem = await this.prisma.wishlist_items.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });
        if (existingItem) {
            throw new common_1.ConflictException('Product already in wishlist');
        }
        const wishlistItem = await this.prisma.wishlist_items.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                updatedAt: new Date(),
                users: { connect: { id: userId } },
                products: { connect: { id: productId } }
            },
            include: {
                products: true
            },
        });
        return wishlistItem;
    }
    async getWishlist(userId) {
        const wishlistItems = await this.prisma.wishlist_items.findMany({
            where: { userId },
            include: {
                products: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        priceCents: true,
                        originalPriceCents: true,
                        imageUrl: true,
                        images: true,
                        isActive: true,
                        stockQuantity: true,
                        categories: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return {
            items: wishlistItems,
            total: wishlistItems.length,
        };
    }
    async removeFromWishlist(userId, productId) {
        const wishlistItem = await this.prisma.wishlist_items.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });
        if (!wishlistItem) {
            throw new common_1.NotFoundException('Product not found in wishlist');
        }
        await this.prisma.wishlist_items.delete({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });
        return { message: 'Product removed from wishlist successfully' };
    }
    async isInWishlist(userId, productId) {
        const item = await this.prisma.wishlist_items.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });
        return !!item;
    }
    async getWishlistCount(userId) {
        const count = await this.prisma.wishlist_items.count({
            where: { userId },
        });
        return count;
    }
    async clearWishlist(userId) {
        await this.prisma.wishlist_items.deleteMany({
            where: { userId },
        });
        return { message: 'Wishlist cleared successfully' };
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map