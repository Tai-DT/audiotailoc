import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PromotionsService } from '../promotions/promotions.service';
import { MailService } from '../notifications/mail.service';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cart: CartService,
    private readonly promos: PromotionsService,
    private readonly mail: MailService,
    private readonly inventory: InventoryService,
  ) {}

  async createOrder(
    userId: string | null,
    params: {
      cartId?: string;
      promotionCode?: string;
      shippingAddress?: any;
      shippingCoordinates?: any;
      customerEmail?: string;
      customerName?: string;
      customerPhone?: string;
    },
  ) {
    let cart, items;

    if (userId) {
      const result = await this.cart.getCartWithTotals(userId);
      cart = result.cart;
      items = result.items;
    } else if (params.cartId) {
      const result = await this.cart.getGuestCart(params.cartId);
      cart = result;
      items = result.items || [];
    } else {
      throw new BadRequestException('userId or cartId is required');
    }

    if (items.length === 0) throw new BadRequestException('Giỏ hàng trống');

    if (!userId && !params.customerEmail) {
      throw new BadRequestException('Vui lòng cung cấp email để đặt hàng');
    }

    const orderNo = 'ATL' + Date.now();

    const result = await this.prisma.$transaction(async tx => {
      let subtotalCents = 0;
      const orderItemsData = [];

      // ✅ STEP 1: Process items, validate stock, and lock prices within transaction
      for (const cartItem of items) {
        const product = await tx.products.findUnique({
          where: { id: cartItem.productId },
          select: {
            id: true,
            name: true,
            priceCents: true,
            isActive: true,
            isDeleted: true,
            imageUrl: true,
            stockQuantity: true,
          },
        });

        if (!product || !product.isActive || product.isDeleted) {
          throw new BadRequestException(
            `Sản phẩm "${cartItem.products?.name || 'Sản phẩm'}" không còn được bán`,
          );
        }

        // Deduct Stock via InventoryService (ensures consistency, logs, and triggers alerts)
        await this.inventory.adjust(
          product.id,
          {
            stockDelta: -cartItem.quantity,
            reason: `Order ${orderNo} created`,
            referenceId: orderNo,
            referenceType: 'CHECKOUT',
          },
          { syncToProduct: true },
          tx,
        );

        const currentPrice = Number(product.priceCents);
        subtotalCents += currentPrice * cartItem.quantity;

        orderItemsData.push({
          id: randomUUID(),
          productId: product.id,
          name: product.name,
          quantity: cartItem.quantity,
          price: currentPrice,
          unitPrice: currentPrice,
          imageUrl: product.imageUrl || null,
          updatedAt: new Date(),
        });
      }

      // ✅ STEP 2: Promotion & Shipping
      let discountCents = 0;
      let isFreeShipping = false;

      if (params.promotionCode) {
        const promoResult = await this.promos.validateCode(
          params.promotionCode,
          subtotalCents,
          userId,
          orderItemsData,
          tx,
        );
        if (promoResult.valid) {
          discountCents = Number(promoResult.discount || 0);
          isFreeShipping = !!promoResult.isFreeShipping;
        } else {
          throw new BadRequestException(promoResult.error || 'Mã giảm giá không hợp lệ');
        }
      }

      // Shipping: Free if > 10M VND or promo provides it
      const shippingCents = subtotalCents > 10000000 || isFreeShipping ? 0 : 50000;
      const totalCents = Math.max(0, subtotalCents - discountCents + shippingCents);

      let finalUserId = userId;
      if (!finalUserId && params.customerEmail) {
        let user = await tx.users.findUnique({ where: { email: params.customerEmail } });
        if (!user) {
          user = await tx.users.create({
            data: {
              id: randomUUID(),
              email: params.customerEmail,
              name: params.customerName || 'Guest Customer',
              phone: params.customerPhone || null,
              role: 'USER',
              isActive: true,
              updatedAt: new Date(),
            },
          });
        }
        finalUserId = user.id;
      }

      // ✅ STEP 3: Create order
      const order = await tx.orders.create({
        data: {
          id: randomUUID(),
          orderNo,
          userId: finalUserId,
          status: 'PENDING',
          subtotalCents,
          discountCents,
          shippingCents,
          totalCents,
          promotionCode: params.promotionCode || null,
          shippingAddress: params.shippingAddress
            ? typeof params.shippingAddress === 'string'
              ? params.shippingAddress
              : JSON.stringify(params.shippingAddress)
            : null,
          shippingCoordinates: params.shippingCoordinates
            ? typeof params.shippingCoordinates === 'string'
              ? params.shippingCoordinates
              : JSON.stringify(params.shippingCoordinates)
            : null,
          updatedAt: new Date(),
        },
      });

      // Save items
      await tx.order_items.createMany({
        data: orderItemsData.map(item => ({ ...item, orderId: order.id })),
      });

      // Track promotion usage if applicable
      if (params.promotionCode) {
        await this.promos.incrementUsage(params.promotionCode, userId, order.id, discountCents, tx);
      }

      // ✅ STEP 4: Finalize
      await tx.carts.update({
        where: { id: cart.id },
        data: { status: 'COMPLETED', updatedAt: new Date() },
      });

      return order;
    });

    // Send email confirmation asynchronously (post-transaction)
    try {
      const email = result.userId
        ? (await this.prisma.users.findUnique({ where: { id: result.userId } }))?.email
        : params.customerEmail;

      const name = result.userId
        ? (await this.prisma.users.findUnique({ where: { id: result.userId } }))?.name
        : params.customerName;

      if (email) {
        const orderData = {
          orderNo: result.orderNo,
          customerName: name || email,
          totalAmount: `${result.totalCents.toLocaleString('vi-VN')} VNĐ`,
          items: items.map((item: any) => ({
            name: item.products?.name || item.name || 'Sản phẩm',
            quantity: item.quantity,
            price: `${Number(item.price || item.products?.priceCents).toLocaleString('vi-VN')} VNĐ`,
          })),
          status: result.status,
        };
        await this.mail.sendOrderConfirmation(email, orderData);
      }
    } catch (_error) {
      // Email failed silently
    }

    return result;
  }

  async getOrderForUserByNo(userId: string, orderNo: string) {
    const order = await this.prisma.orders.findFirst({
      where: { orderNo, userId },
      include: { order_items: true, payments: true },
    });
    if (!order) throw new Error('Không tìm thấy đơn hàng');
    return order;
  }
}
