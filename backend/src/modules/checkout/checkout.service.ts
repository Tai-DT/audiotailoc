import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PromotionsService } from '../promotions/promotions.service';
import { MailService } from '../notifications/mail.service';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cart: CartService,
    private readonly promos: PromotionsService,
    private readonly mail: MailService,
  ) {}

  async createOrder(
    userId: string | undefined,
    params: {
      promotionCode?: string;
      shippingAddress?: any;
      items?: Array<{ productId: string; quantity: number }>;
    },
  ) {
    let cart: any = null;
    let items: any[] = [];
    let subtotalCents = 0;

    // Priority 1: Use items from request (for guest checkout)
    if (params.items && params.items.length > 0) {
      // Validate and calculate from provided items
      for (const item of params.items) {
        const product = await this.prisma.products.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            priceCents: true,
            imageUrl: true,
            isActive: true,
            isDeleted: true,
            inventory: {
              select: { stock: true, reserved: true },
            },
          },
        });

        if (!product || !product.isActive || product.isDeleted) {
          throw new BadRequestException(`Sản phẩm không còn tồn tại hoặc đã ngừng bán`);
        }

        // ✅ FIX #5: Stock validation trước checkout
        const stock = product.inventory?.stock ?? 0;
        const reserved = product.inventory?.reserved ?? 0;
        const available = stock - reserved;

        if (available < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm "${product.name}" chỉ còn ${available} sản phẩm trong kho`,
          );
        }

        items.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.priceCents,
          products: product,
        });
        subtotalCents += Number(product.priceCents) * Number(item.quantity);
      }
    } else {
      // Priority 2: Use cart from database (for authenticated users)
      const cartData = await this.cart.getCartWithTotals(userId);
      cart = cartData.cart;
      items = cartData.items;
      subtotalCents = cartData.subtotalCents;

      // ✅ FIX #5: Stock validation cho cart items
      for (const item of items) {
        const product = await this.prisma.products.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            isActive: true,
            isDeleted: true,
            inventory: {
              select: { stock: true, reserved: true },
            },
          },
        });

        if (!product || !product.isActive || product.isDeleted) {
          throw new BadRequestException(`Sản phẩm "${item.products?.name}" không còn tồn tại`);
        }

        const stock = product.inventory?.stock ?? 0;
        const reserved = product.inventory?.reserved ?? 0;
        const available = stock - reserved;

        if (available < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm "${product.name}" chỉ còn ${available} sản phẩm trong kho`,
          );
        }
      }
    }

    if (items.length === 0) throw new BadRequestException('Giỏ hàng trống');

    let discount = 0;
    let promo = null;
    let promotionDetails = null;

    if (params.promotionCode) {
      // Prepare cart items for promotion calculation
      const cartItems = items.map(item => ({
        productId: item.productId,
        categoryId: item.products?.categoryId,
        quantity: item.quantity,
        priceCents: item.unitPrice || item.products?.priceCents,
      }));

      // Apply promotion with product/category filtering
      const promoResult = await this.promos.applyToCart(params.promotionCode, cartItems);

      if (promoResult.valid) {
        discount = promoResult.totalDiscount || 0;
        promo = promoResult.promotion;
        promotionDetails = {
          code: params.promotionCode,
          type: promo?.type,
          value: promo?.value,
          itemDiscounts: promoResult.itemDiscounts,
          applicableItemsCount: promoResult.applicableItemsCount,
        };

        // Mark promotion as used for tracking
        if (discount > 0) {
          await this.promos.markAsUsed(params.promotionCode).catch(err => {
            console.error('Failed to mark promotion as used:', err);
          });

          // Log promotion application details for analytics
          console.log('Promotion applied:', {
            code: promotionDetails.code,
            type: promotionDetails.type,
            discount,
            applicableItems: promotionDetails.applicableItemsCount,
            totalItems: cartItems.length,
          });
        }
      }
    }

    const shipping = Number(process.env.SHIPPING_FLAT_CENTS ?? '30000');
    const total = Math.max(0, subtotalCents - discount) + shipping;

    const orderNo = 'ATL' + Date.now();

    // Format shipping address - lưu đầy đủ thông tin từ frontend
    const shippingAddressData = params.shippingAddress
      ? JSON.stringify({
          fullName: params.shippingAddress.fullName,
          phone: params.shippingAddress.phone,
          email: params.shippingAddress.email,
          address: params.shippingAddress.address,
          notes: params.shippingAddress.notes || null,
          coordinates: params.shippingAddress.coordinates,
          goongPlaceId: params.shippingAddress.goongPlaceId,
        })
      : null;

    const result = await this.prisma.$transaction(async tx => {
      // Create order
      const order = await tx.orders.create({
        data: {
          id: randomUUID(),
          orderNo,
          userId: userId || null, // Allow null for guest checkout
          status: 'PENDING',
          subtotalCents: subtotalCents,
          discountCents: discount,
          shippingCents: shipping,
          totalCents: total,
          promotionCode: promo?.code ?? null,
          shippingAddress: shippingAddressData,
          updatedAt: new Date(),
        },
      });
      // Copy items and validate prices from database
      for (const i of items) {
        // SECURITY: Re-fetch product price from database to prevent tampering
        const product = await tx.products.findUnique({
          where: { id: i.productId },
          select: { priceCents: true, isActive: true, isDeleted: true },
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
            updatedAt: new Date(),
          },
        });

        // Note: Stock will be reserved when order status changes to CONFIRMED
        // and deducted when status changes to COMPLETED
        // This is handled by orders.services.ts updateStatus method
      }
      // Mark cart checked out (only if cart exists)
      if (cart && cart.id) {
        await tx.carts.update({ where: { id: cart.id }, data: { status: 'CHECKED_OUT' } });
      }

      return order;
    });

    try {
      // Get user info for email notification
      let userEmail = params.shippingAddress?.email;
      if (!userEmail && result.userId) {
        const user = await this.prisma.users.findUnique({ where: { id: result.userId } });
        userEmail = user?.email;
      }

      if (userEmail) {
        // Prepare order data for email template using cart items
        const orderData = {
          orderNo: result.orderNo,
          customerName: params.shippingAddress?.fullName || 'Khách hàng',
          totalAmount: `${(result.totalCents / 100).toLocaleString('vi-VN')} VNĐ`,
          items: items.map((item: any) => ({
            name: item.products.name || 'Sản phẩm',
            quantity: item.quantity,
            price: `${((item.unitPrice || item.products.priceCents) / 100).toLocaleString('vi-VN')} VNĐ`,
          })),
          status: result.status,
        };

        await this.mail.sendOrderConfirmation(userEmail, orderData);
      }
    } catch (_error) {
      // Email notification failed silently
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
