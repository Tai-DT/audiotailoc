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
exports.CheckoutService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const cart_service_1 = require("../cart/cart.service");
const promotion_service_1 = require("../promotions/promotion.service");
let CheckoutService = class CheckoutService {
    constructor(prisma, cart, promos) {
        this.prisma = prisma;
        this.cart = cart;
        this.promos = promos;
    }
    async createOrder(userId, params) {
        const { cart, items, subtotalCents } = await this.cart.getCartWithTotals(userId);
        if (items.length === 0)
            throw new common_1.BadRequestException('Giỏ hàng trống');
        const promo = await this.promos.validate(params.promotionCode);
        const discount = this.promos.computeDiscount(promo, subtotalCents);
        const shipping = Number(process.env.SHIPPING_FLAT_CENTS ?? '30000');
        const total = Math.max(0, subtotalCents - discount) + shipping;
        const orderNo = 'ATL' + Date.now();
        const result = await this.prisma.$transaction(async (tx) => {
            const order = await tx.orders.create({
                data: {
                    orderNo,
                    userId,
                    status: 'PENDING',
                    subtotalCents: Number(subtotalCents),
                    discountCents: discount,
                    shippingCents: shipping,
                    totalCents: total,
                    promotionCode: promo?.code ?? null,
                    shippingAddress: params.shippingAddress ?? null,
                },
            });
            for (const i of items) {
                await tx.order_items.create({
                    data: {
                        id: (0, crypto_1.randomUUID)(),
                        orderId: order.id,
                        productId: i.productId,
                        name: i.products.name,
                        quantity: i.quantity,
                        price: Number(i.price || i.products.priceCents),
                        unitPrice: Number(i.price || i.products.priceCents),
                        imageUrl: i.products.imageUrl ?? null,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
                await tx.inventory.update({ where: { productId: i.productId }, data: { stock: { decrement: i.quantity }, reserved: { decrement: i.quantity } } });
            }
            await tx.carts.update({ where: { id: cart.id }, data: { status: 'CHECKED_OUT' } });
        });
        return result;
    }
    async getOrderForUserByNo(userId, orderNo) {
        const order = await this.prisma.orders.findFirst({ where: { orderNo, userId }, include: { order_items: true, payments: true } });
        if (!order)
            throw new Error('Không tìm thấy đơn hàng');
        return order;
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, cart_service_1.CartService, promotion_service_1.PromotionService])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map