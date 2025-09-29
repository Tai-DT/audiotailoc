import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PromotionService } from '../promotions/promotion.service';

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService, private readonly cart: CartService, private readonly promos: PromotionService) {}

  async createOrder(userId: string, params: { promotionCode?: string; shippingAddress?: any }) {
    const { cart, items, subtotalCents } = await this.cart.getCartWithTotals(userId);
    if (items.length === 0) throw new BadRequestException('Giỏ hàng trống');
    const promo = await this.promos.validate(params.promotionCode);
    const discount = this.promos.computeDiscount(promo, subtotalCents);
    const shipping = Number(process.env.SHIPPING_FLAT_CENTS ?? '30000');
    const total = Math.max(0, subtotalCents - discount) + shipping;

    const orderNo = 'ATL' + Date.now();
    const result = await this.prisma.$transaction(async (tx) => {
      // Create order
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
        } as any,
      });
      // Copy items and adjust inventory
      for (const i of items) {
        await tx.order_items.create({
          data: {
            id: randomUUID(),
            orderId: order.id,
            productId: i.productId,
            name: i.products.name,
            quantity: i.quantity,
            price: Number(i.price || i.products.priceCents),
            unitPrice: Number(i.price || i.products.priceCents),
            imageUrl: i.products.imageUrl ?? null,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as any,
        });
        await tx.inventory.update({ where: { productId: i.productId }, data: { stock: { decrement: i.quantity }, reserved: { decrement: i.quantity } } });
      }
      // Mark cart checked out
      await tx.carts.update({ where: { id: cart.id }, data: { status: 'CHECKED_OUT' } });

    });
    return result;
  }

  async getOrderForUserByNo(userId: string, orderNo: string) {
    const order = await this.prisma.orders.findFirst({ where: { orderNo, userId }, include: { order_items: true, payments: true } });
    if (!order) throw new Error('Không tìm thấy đơn hàng');
    return order;
  }
}
