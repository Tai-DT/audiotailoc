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
var CartService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let CartService = CartService_1 = class CartService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.logger = new common_1.Logger(CartService_1.name);
    }
    async createGuestCart() {
        const guestCart = await this.prisma.cart.create({
            data: {
                userId: null,
                status: 'ACTIVE',
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                priceCents: true,
                                images: true,
                                imageUrl: true,
                            }
                        }
                    }
                }
            }
        });
        this.logger.log(`Guest cart created: ${guestCart.id}`);
        return guestCart;
    }
    async getGuestCart(cartId) {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                userId: null,
                status: 'ACTIVE'
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                priceCents: true,
                                images: true,
                                imageUrl: true,
                            }
                        }
                    }
                }
            }
        });
        if (!cart) {
            throw new common_1.NotFoundException('Guest cart not found');
        }
        return this.calculateCartTotals(cart);
    }
    async addToGuestCart(cartId, productId, quantity = 1) {
        let cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                userId: null,
                status: 'ACTIVE'
            }
        });
        if (!cart) {
            throw new common_1.NotFoundException('Guest cart not found');
        }
        const product = await this.prisma.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });
        if (existingItem) {
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        }
        else {
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                    price: product.priceCents
                }
            });
        }
        this.logger.log(`Added ${quantity} of product ${productId} to guest cart ${cartId}`);
        return this.getGuestCart(cartId);
    }
    async updateGuestCartItem(cartId, productId, quantity) {
        const cart = await this.prisma.cart.findFirst({
            where: { id: cartId, userId: null, status: 'ACTIVE' }
        });
        if (!cart) {
            throw new common_1.NotFoundException('Guest cart not found');
        }
        const cartItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        const delta = quantity - cartItem.quantity;
        if (delta !== 0) {
        }
        if (quantity <= 0) {
            await this.prisma.cartItem.delete({
                where: { id: cartItem.id }
            });
        }
        else {
            await this.prisma.cartItem.update({
                where: { id: cartItem.id },
                data: { quantity }
            });
        }
        return this.getGuestCart(cartId);
    }
    async removeFromGuestCart(cartId, productId) {
        const cart = await this.prisma.cart.findFirst({
            where: { id: cartId, userId: null, status: 'ACTIVE' }
        });
        if (!cart) {
            throw new common_1.NotFoundException('Guest cart not found');
        }
        const item = await this.prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
        if (item) {
            await this.prisma.cartItem.delete({ where: { id: item.id } });
        }
        return this.getGuestCart(cartId);
    }
    async clearGuestCart(cartId) {
        const cart = await this.prisma.cart.findFirst({
            where: { id: cartId, userId: null, status: 'ACTIVE' }
        });
        if (!cart) {
            throw new common_1.NotFoundException('Guest cart not found');
        }
        const items = await this.prisma.cartItem.findMany({ where: { cartId: cart.id } });
        for (const item of items) {
            await this.prisma.cartItem.delete({ where: { id: item.id } });
        }
        return this.getGuestCart(cartId);
    }
    async convertGuestCartToUserCart(cartId, userId) {
        const guestCart = await this.prisma.cart.findFirst({
            where: { id: cartId, userId: null, status: 'ACTIVE' }
        });
        if (!guestCart) {
            throw new common_1.NotFoundException('Guest cart not found');
        }
        const existingUserCart = await this.prisma.cart.findFirst({
            where: { userId, status: 'ACTIVE' }
        });
        if (existingUserCart) {
            const guestItems = await this.prisma.cartItem.findMany({
                where: { cartId: guestCart.id }
            });
            for (const item of guestItems) {
                const existingItem = await this.prisma.cartItem.findFirst({
                    where: {
                        cartId: existingUserCart.id,
                        productId: item.productId
                    }
                });
                if (existingItem) {
                    await this.prisma.cartItem.update({
                        where: { id: existingItem.id },
                        data: { quantity: existingItem.quantity + item.quantity }
                    });
                }
                else {
                    await this.prisma.cartItem.create({
                        data: {
                            cartId: existingUserCart.id,
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price
                        }
                    });
                }
            }
            await this.prisma.cart.delete({
                where: { id: guestCart.id }
            });
            return this.getUserCart(userId);
        }
        else {
            await this.prisma.cart.update({
                where: { id: guestCart.id },
                data: {
                    userId
                }
            });
            return this.getUserCart(userId);
        }
    }
    async getUserCart(userId) {
        const cart = await this.prisma.cart.findFirst({
            where: {
                userId,
                status: 'ACTIVE'
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                priceCents: true,
                                images: true,
                            }
                        }
                    }
                }
            }
        });
        if (!cart) {
            return this.createUserCart(userId);
        }
        return this.calculateCartTotals(cart);
    }
    async createUserCart(userId) {
        const cart = await this.prisma.cart.create({
            data: {
                userId,
                status: 'ACTIVE'
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                priceCents: true,
                                images: true,
                            }
                        }
                    }
                }
            }
        });
        this.logger.log(`User cart created: ${userId}`);
        return this.calculateCartTotals(cart);
    }
    async addToUserCart(userId, productId, quantity = 1) {
        let cart = await this.prisma.cart.findFirst({
            where: { userId, status: 'ACTIVE' }
        });
        if (!cart) {
            cart = await this.createUserCart(userId);
        }
        if (!cart) {
            throw new Error('Failed to create or find cart');
        }
        const product = await this.prisma.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });
        if (existingItem) {
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        }
        else {
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                    price: product.priceCents
                }
            });
        }
        return this.getUserCart(userId);
    }
    async updateUserCartItem(userId, productId, quantity) {
        const cart = await this.prisma.cart.findFirst({
            where: { userId, status: 'ACTIVE' }
        });
        if (!cart) {
            throw new common_1.NotFoundException('User cart not found');
        }
        const cartItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        const delta = quantity - cartItem.quantity;
        if (delta !== 0) {
        }
        if (quantity <= 0) {
            await this.prisma.cartItem.delete({
                where: { id: cartItem.id }
            });
        }
        else {
            await this.prisma.cartItem.update({
                where: { id: cartItem.id },
                data: { quantity }
            });
        }
        return this.getUserCart(userId);
    }
    async removeFromUserCart(userId, productId) {
        const cart = await this.prisma.cart.findFirst({
            where: { userId, status: 'ACTIVE' }
        });
        if (!cart) {
            throw new common_1.NotFoundException('User cart not found');
        }
        const item = await this.prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
        if (item) {
            await this.prisma.cartItem.delete({ where: { id: item.id } });
        }
        return this.getUserCart(userId);
    }
    async clearUserCart(userId) {
        const cart = await this.prisma.cart.findFirst({
            where: { userId, status: 'ACTIVE' }
        });
        if (!cart) {
            throw new common_1.NotFoundException('User cart not found');
        }
        const items = await this.prisma.cartItem.findMany({ where: { cartId: cart.id } });
        for (const item of items) {
            await this.prisma.cartItem.delete({ where: { id: item.id } });
        }
        return this.getUserCart(userId);
    }
    calculateCartTotals(cart) {
        const subtotal = cart.items.reduce((sum, item) => {
            return sum + ((item.price ?? item.product?.priceCents ?? 0) * item.quantity);
        }, 0);
        const itemCount = cart.items.reduce((sum, item) => {
            return sum + item.quantity;
        }, 0);
        return {
            ...cart,
            subtotal,
            itemCount,
            tax: Math.round(subtotal * 0.1),
            shipping: subtotal > 500000 ? 0 : 30000,
            total: subtotal + Math.round(subtotal * 0.1) + (subtotal > 500000 ? 0 : 30000)
        };
    }
    async cleanupExpiredGuestCarts() {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const expiredCarts = await this.prisma.cart.findMany({
            where: {
                userId: null,
                createdAt: { lt: sevenDaysAgo },
                status: 'ACTIVE'
            }
        });
        for (const cart of expiredCarts) {
            await this.prisma.cart.update({
                where: { id: cart.id },
                data: { status: 'ABANDONED' }
            });
        }
        this.logger.log(`Cleaned up ${expiredCarts.length} expired guest carts`);
    }
    async getCartWithTotals(userId) {
        const cart = await this.prisma.cart.findFirst({
            where: { userId, status: 'ACTIVE' },
        });
        if (!cart) {
            return { cart: await this.createUserCart(userId), items: [], subtotalCents: 0 };
        }
        const items = await this.prisma.cartItem.findMany({
            where: { cartId: cart.id },
            include: { product: true },
        });
        const subtotalCents = items.reduce((sum, i) => sum + Number(i.price || i.product.priceCents) * i.quantity, 0);
        return { cart, items, subtotalCents };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = CartService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], CartService);
//# sourceMappingURL=cart.service.js.map