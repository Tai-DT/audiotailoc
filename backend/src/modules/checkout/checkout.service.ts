import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
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
      const order = await tx.orders.create({
        data: {
          id: randomUUID(),
          orderNo,
          userId,
          status: 'PENDING',
          subtotalCents: subtotalCents,
          discountCents: discount,
          shippingCents: shipping,
          totalCents: total,
          promotionCode: promo?.code ?? null,
          shippingAddress: params.shippingAddress ?? null,
          updatedAt: new Date()
        },
      });
      // Copy items and validate prices from database
      for (const i of items) {
        // SECURITY: Re-fetch product price from database to prevent tampering
        const product = await tx.products.findUnique({
          where: { id: i.productId },
          select: { priceCents: true, isActive: true, isDeleted: true }
        });

        if (!product || !product.isActive || product.isDeleted) {
          throw new BadRequestException(`Product ${i.products.name} is no longer available`);
        }

        // Use the current price from database, not from cart
        const currentPrice = product.priceCents;

        await tx.order_items.create({
          data: {
            id: randomUUID(),
            orderId: order.id,
            productId: i.productId,
            name: i.products.name,
            quantity: i.quantity,
            price: currentPrice,
            unitPrice: currentPrice,
            imageUrl: i.products.imageUrl ?? null,
            updatedAt: new Date()
          },
        });

        // Note: Stock will be reserved when order status changes to CONFIRMED
        // and deducted when status changes to COMPLETED
        // This is handled by orders.services.ts updateStatus method
      }
      // Mark cart checked out
      await tx.carts.update({ where: { id: cart.id }, data: { status: 'CHECKED_OUT' } });

      return order;
    });
    try {
      if (result.userId) {
        const user = await this.prisma.users.findUnique({ where: { id: result.userId } });
        if (user?.email) {
          // Prepare order data for email template using cart items
          const orderData = {
            orderNo: result.orderNo,
            customerName: user.name || user.email,
            totalAmount: `${(result.totalCents / 100).toLocaleString('vi-VN')} VNĐ`,
            items: items.map((item: any) => ({
              name: item.products.name || 'Sản phẩm',
              quantity: item.quantity,
              price: `${((item.unitPrice || item.products.priceCents) / 100).toLocaleString('vi-VN')} VNĐ`
            })),
            status: result.status
          };

          await this.mail.sendOrderConfirmation(user.email, orderData);
        }
      }
    } catch (_error) {
      // Email notification failed silently
    }
    return result;
  }

  async getOrderForUserByNo(userId: string, orderNo: string) {
    const order = await this.prisma.orders.findFirst({ where: { orderNo, userId }, include: { order_items: true, payments: true } });
    if (!order) throw new Error('Không tìm thấy đơn hàng');
    return order;
  }
}
