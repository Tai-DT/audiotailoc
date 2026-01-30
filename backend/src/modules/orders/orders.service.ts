import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import { CacheService } from '../caching/cache.service';
import { randomUUID, randomBytes } from 'crypto';
import { InventoryMovementService } from '../inventory/inventory-movement.service';
import { PromotionsService } from '../promotions/promotions.service';
import { InventoryService } from '../inventory/inventory.service';
import { CartService } from '../cart/cart.service';
import { UsersService } from '../users/users.service';
import { TelegramService } from '../notifications/telegram.service';

const allowedTransitions: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'PROCESSING', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'COMPLETED', 'CANCELLED'],
  SHIPPED: ['COMPLETED', 'RETURNED', 'CANCELLED'],
  COMPLETED: ['RETURNED'],
  CANCELLED: [],
  RETURNED: [],
};

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly cache: CacheService,
    private readonly inventoryMovement: InventoryMovementService,
    private readonly promotions: PromotionsService,
    private readonly inventory: InventoryService,
    private readonly cartService: CartService,
    private readonly usersService: UsersService,
    private readonly telegramService: TelegramService,
  ) {}

  async list(params: { page?: number; pageSize?: number; status?: string }) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
    const where: any = {};
    if (params.status) where.status = params.status;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.orders.count({ where }),
      this.prisma.orders.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          users: { select: { name: true, email: true } },
          order_items: { include: { products: { select: { name: true, slug: true } } } },
        },
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      items: items.map(order => ({
        id: order.id,
        orderNumber: order.orderNo,
        customerName: order.users?.name || 'N/A',
        customerEmail: order.users?.email || 'N/A',
        totalAmount: Number(order.totalCents),
        status: order.status,
        createdAt: order.createdAt,
        items: order.order_items.map(item => {
          const price = Number(item.unitPrice || item.price || 0);
          return {
            id: item.id,
            productId: item.productId,
            productName: item.products?.name || item.name,
            quantity: item.quantity,
            price: price,
            total: price * item.quantity,
          };
        }),
      })),
    };
  }

  async get(id: string, tx?: any) {
    const client = tx || this.prisma;
    const order = await client.orders.findFirst({
      where: { OR: [{ id }, { orderNo: id }] },
      include: { order_items: true, payments: true, users: true },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return {
      ...order,
      totalCents: Number(order.totalCents),
      subtotalCents: Number(order.subtotalCents),
      discountCents: Number(order.discountCents),
      shippingAddress: this.safeParseJSON(order.shippingAddress, order.shippingAddress),
      shippingCoordinates: this.safeParseJSON(order.shippingCoordinates, order.shippingCoordinates),
    };
  }

  private safeParseJSON(data: any, defaultValue: any = null) {
    if (!data) return defaultValue;
    if (typeof data !== 'string') return data;
    try {
      return JSON.parse(data);
    } catch (e) {
      return defaultValue;
    }
  }

  async create(orderData: any, userId?: string): Promise<any> {
    const orderNo = `ATL-${Date.now()}-${randomBytes(2).toString('hex').toUpperCase()}`;
    const itemsToProcess = Array.isArray(orderData.items) ? orderData.items : [];
    if (itemsToProcess.length === 0) throw new BadRequestException('Đơn hàng không có sản phẩm');

    const result = await this.prisma.$transaction(
      async tx => {
        let subtotalCents = BigInt(0);
        const finalItems = [];

        for (const item of itemsToProcess) {
          const product = await tx.products.findUnique({ where: { id: item.productId } });
          if (!product || !product.isActive || product.isDeleted) {
            throw new BadRequestException(`Sản phẩm ${item.productId} không tồn tại`);
          }

          const quantity = Math.max(1, item.quantity || 1);
          if (product.stockQuantity < quantity) {
            throw new BadRequestException(`Sản phẩm ${product.name} hết hàng`);
          }

          // Deduct Stock via InventoryService (handles movements, alerts, and sync)
          await this.inventory.adjust(
            product.id,
            {
              stockDelta: -quantity,
              reason: `Order ${orderNo}`,
              referenceId: orderNo,
              referenceType: 'ORDER',
            },
            { syncToProduct: true },
            tx,
          );

          subtotalCents += product.priceCents * BigInt(quantity);
          finalItems.push({
            id: randomUUID(),
            productId: product.id,
            name: product.name,
            quantity,
            price: product.priceCents,
            unitPrice: product.priceCents,
          });
        }

        let discountCents = BigInt(0);
        let isFreeShipping = false;

        if (orderData.promotionCode) {
          const promo: any = await this.promotions.validateCode(
            orderData.promotionCode,
            subtotalCents,
            userId,
            finalItems,
            tx,
          );
          if (promo.valid) {
            discountCents = BigInt(promo.discount || 0);
            isFreeShipping = !!promo.isFreeShipping;
          } else {
            throw new BadRequestException(promo.error || 'Mã khuyến mãi không hợp lệ');
          }
        }

        let finalUserId = userId;

        // Guest User Handling: Link order to user by email or create a guest user
        if (!finalUserId && orderData.customerEmail) {
          let user = await tx.users.findUnique({
            where: { email: orderData.customerEmail },
          });
          if (!user) {
            user = await tx.users.create({
              data: {
                id: randomUUID(),
                email: orderData.customerEmail,
                name: orderData.customerName || 'Guest Customer',
                phone: orderData.customerPhone || null,
                role: 'USER',
                isActive: true,
                updatedAt: new Date(),
              },
            });
          }
          finalUserId = user.id;
        }

        // Shipping Calculation (Sync with CartService)
        // Free shipping if subtotal > 10M VND or promo provides free shipping
        const shippingCents =
          subtotalCents > BigInt(10000000) || isFreeShipping ? BigInt(0) : BigInt(50000);

        const totalCents =
          subtotalCents - discountCents + shippingCents > BigInt(0)
            ? subtotalCents - discountCents + shippingCents
            : BigInt(0);
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
            promotionCode: orderData.promotionCode || null,
            shippingAddress: orderData.shippingAddress,
            shippingCoordinates: orderData.shippingCoordinates
              ? JSON.stringify(orderData.shippingCoordinates)
              : null,
            notes: orderData.notes || null,
            updatedAt: new Date(),
          } as any,
        });

        await tx.order_items.createMany({
          data: finalItems.map(i => ({ ...i, orderId: order.id, updatedAt: new Date() })),
        });

        // Track promotion usage if applicable
        if (orderData.promotionCode) {
          await this.promotions.incrementUsage(
            orderData.promotionCode,
            finalUserId,
            order.id,
            Number(discountCents),
            tx,
          );
        }

        // Clear User Cart after successful checkout
        if (finalUserId) {
          await this.cartService.clearCart(finalUserId);
          await this.cache.del(`cart:${finalUserId}`);
          await this.cache.del(`cart_totals:${finalUserId}`);
        }

        return { ...order, items: finalItems };
      },
      { timeout: 15000 },
    );

    // Notify via Telegram (post-transaction)
    try {
      const message = [
        `🔔 *ĐƠN HÀNG MỚI*: #${result.orderNo}`,
        `👤 Khách hàng: ${orderData.customerName || 'Guest'}`,
        `💰 Tổng cộng: ${result.totalCents.toLocaleString('vi-VN')}đ`,
        `📍 Địa chỉ: ${orderData.shippingAddress || 'N/A'}`,
      ].join('\n');

      await this.telegramService.sendMessage(message);
    } catch (err) {
      // Log but don't fail
      this.logger.error('Telegram notification failed', err);
    }

    return result;
  }

  async updateStatus(id: string, status: string, tx?: any) {
    const client = tx || this.prisma;
    const order = await this.get(id, client);
    const current = order.status.toUpperCase();
    const next = status.toUpperCase();
    if (!(allowedTransitions[current] || []).includes(next))
      throw new BadRequestException('Chuyển đổi trạng thái không hợp lệ');

    const updated = await client.orders.update({ where: { id: order.id }, data: { status: next } });

    // Handle Restoration if Cancelled
    // Handle Restoration if Cancelled or Returned
    if (
      ['CANCELLED', 'RETURNED'].includes(next) &&
      ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'COMPLETED'].includes(current)
    ) {
      const items = await client.order_items.findMany({ where: { orderId: order.id } });
      for (const item of items) {
        await this.inventory.adjust(
          item.productId,
          {
            stockDelta: item.quantity,
            reason: `${next} Order ${order.orderNo}`,
            referenceId: order.id,
            referenceType: next,
          },
          { syncToProduct: true },
          client,
        );
      }
    }

    if (order.users?.email) {
      try {
        await this.mail.sendOrderStatusUpdate(order.users.email, {
          orderNo: order.orderNo,
          customerName: order.users.name || 'Khách hàng',
          status: next,
          items: [],
          totalAmount: order.totalCents.toString(),
        });
      } catch (err) {
        this.logger.error('Failed to send status update email', err);
      }
    }

    return updated;
  }

  async getStats() {
    const [total, pending, processing, completed, cancelled] = await Promise.all([
      this.prisma.orders.count(),
      this.prisma.orders.count({ where: { status: 'PENDING' } }),
      this.prisma.orders.count({ where: { status: 'PROCESSING' } }),
      this.prisma.orders.count({ where: { status: { in: ['DELIVERED', 'COMPLETED'] } } }),
      this.prisma.orders.count({ where: { status: 'CANCELLED' } }),
    ]);

    return {
      total,
      pending,
      processing,
      completed,
      cancelled,
    };
  }

  async delete(id: string) {
    return this.prisma.$transaction(async tx => {
      const order = await tx.orders.findFirst({
        where: { OR: [{ id }, { orderNo: id }] },
        include: { order_items: true },
      });

      if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

      // Security: Only allow deletion if not already shipped/completed
      if (['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(order.status)) {
        throw new BadRequestException('Không thể xóa đơn hàng đã giao hoặc đã hoàn thành');
      }

      this.logger.log(`Performing permanent delete for order: ${order.orderNo} (${order.id})`);

      // 1. Restore stock if the order was active (not already cancelled)
      if (!['CANCELLED', 'RETURNED'].includes(order.status.toUpperCase())) {
        for (const item of order.order_items) {
          await this.inventory.adjust(
            item.productId,
            {
              stockDelta: item.quantity,
              reason: `Deleted Order ${order.orderNo}`,
              referenceId: order.id,
              referenceType: 'ORDER_DELETED',
            },
            { syncToProduct: true },
            tx,
          );
        }
      }

      // Dependency cascades are now handled by Prisma at the database level (onDelete: Cascade)
      // We only need to delete the parent record
      await tx.orders.delete({
        where: { id: order.id },
      });

      this.logger.log(`Successfully deleted order ${order.orderNo}`);
      return { success: true, message: `Đơn hàng #${order.orderNo} đã được xóa vĩnh viễn` };
    });
  }

  async update(id: string, data: any) {
    const order = await this.get(id);

    // Filter valid fields for orders model
    const {
      customerName: _customerName,
      customerEmail: _customerEmail,
      customerPhone: _customerPhone,
      items: _items,
      ...validData
    } = data;

    // notes is now supported in schema
    return this.prisma.orders.update({
      where: { id: order.id },
      data: {
        ...validData,
        updatedAt: new Date(),
      },
      include: {
        order_items: true,
      },
    });
  }
}
