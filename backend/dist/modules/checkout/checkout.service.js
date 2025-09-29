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
const prisma_service_1 = require("../../prisma/prisma.service");
const cart_service_1 = require("../cart/cart.service");
const promotion_service_1 = require("../promotions/promotion.service");
const mail_service_1 = require("../notifications/mail.service");
let CheckoutService = class CheckoutService {
    constructor(prisma, cart, promos, mail) {
        this.prisma = prisma;
        this.cart = cart;
        this.promos = promos;
        this.mail = mail;
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
            const order = await tx.order.create({
                data: {
                    orderNo,
                    userId,
                    status: 'PENDING',
                    subtotalCents: subtotalCents,
                    discountCents: discount,
                    shippingCents: shipping,
                    totalCents: total,
                    promotionCode: promo?.code ?? null,
                    shippingAddress: params.shippingAddress ?? null,
                },
            });
            for (const i of items) {
                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: i.productId,
                        name: i.product.name,
                        quantity: i.quantity,
                        price: i.price || i.product.priceCents,
                        unitPrice: i.price || i.product.priceCents,
                        imageUrl: i.product.imageUrl ?? null,
                    },
                });
                await tx.inventory.update({ where: { productId: i.productId }, data: { stock: { decrement: i.quantity }, reserved: { decrement: i.quantity } } });
            }
            await tx.cart.update({ where: { id: cart.id }, data: { status: 'CHECKED_OUT' } });
            return order;
        });
        try {
            if (result.userId) {
                const user = await this.prisma.user.findUnique({ where: { id: result.userId } });
                if (user?.email) {
                    const orderData = {
                        orderNo: result.orderNo,
                        customerName: user.name || user.email,
                        totalAmount: `${(result.totalCents / 100).toLocaleString('vi-VN')} VNĐ`,
                        items: items.map((item) => ({
                            name: item.product.name || 'Sản phẩm',
                            quantity: item.quantity,
                            price: `${((item.unitPrice || item.product.priceCents) / 100).toLocaleString('vi-VN')} VNĐ`
                        })),
                        status: result.status
                    };
                    await this.mail.sendOrderConfirmation(user.email, orderData);
                }
            }
        }
        catch (error) {
            console.error('Failed to send order confirmation email:', error);
        }
        return result;
    }
    async getOrderForUserByNo(userId, orderNo) {
        const order = await this.prisma.order.findFirst({ where: { orderNo, userId }, include: { items: true, payments: true } });
        if (!order)
            throw new Error('Không tìm thấy đơn hàng');
        return order;
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, cart_service_1.CartService, promotion_service_1.PromotionService, mail_service_1.MailService])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map