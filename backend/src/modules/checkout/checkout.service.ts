import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PromotionService } from '../promotions/promotion.service';
import { MailService } from '../notifications/mail.service';

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService, private readonly cart: CartService, private readonly promos: PromotionService, private readonly mail: MailService) {}

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
      // Copy items and adjust inventory
      for (const i of items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: i.productId,
            name: i.product.name,
            quantity: i.quantity,
            unitPrice: i.unitPrice || i.product.priceCents,
            totalPrice: (i.unitPrice || i.product.priceCents) * i.quantity,
            imageUrl: i.product.imageUrl ?? null,
          },
        });
        await tx.inventory.update({ where: { productId: i.productId }, data: { stock: { decrement: i.quantity }, reserved: { decrement: i.quantity } } });
      }
      // Mark cart checked out
      await tx.cart.update({ where: { id: cart.id }, data: { status: 'CHECKED_OUT' } });

      return order;
    });
    try {
      if (result.userId) {
        const user = await this.prisma.user.findUnique({ where: { id: result.userId } });
        if (user?.email) {
          // Prepare order data for email template using cart items
          const orderData = {
            orderNo: result.orderNo,
            customerName: user.name || user.email,
            totalAmount: `${(result.totalCents / 100).toLocaleString('vi-VN')} VNĐ`,
            items: items.map((item: any) => ({
              name: item.product.name || 'Sản phẩm',
              quantity: item.quantity,
              price: `${((item.unitPrice || item.product.priceCents) / 100).toLocaleString('vi-VN')} VNĐ`
            })),
            status: result.status
          };

          await this.mail.sendOrderConfirmation(user.email, orderData);
        }
      }
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }
    return result;
  }

  async getOrderForUserByNo(userId: string, orderNo: string) {
    const order = await this.prisma.order.findFirst({ where: { orderNo, userId }, include: { items: true, payments: true } });
    if (!order) throw new Error('Không tìm thấy đơn hàng');
    return order;
  }
}
