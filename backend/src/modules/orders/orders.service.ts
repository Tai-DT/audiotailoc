import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import { CacheService } from '../caching/cache.service';

const allowedTransitions: Record<string, string[]> = {
  PENDING: ['PROCESSING', 'CANCELLED', 'COMPLETED'],
  PROCESSING: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly cache: CacheService,
  ) {}

  list(params: { page?: number; pageSize?: number; status?: string }) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
    const where: any = {};
    if (params.status) where.status = params.status;
    return this.prisma.$transaction([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  slug: true
                }
              }
            }
          }
        }
      }),
    ]).then(([total, items]) => ({
      total,
      page,
      pageSize,
      items: items.map(order => ({
        id: order.id,
        orderNumber: order.orderNo,
        customerName: order.user?.name || 'N/A',
        customerEmail: order.user?.email || 'N/A',
        totalAmount: order.totalCents,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items.map(item => ({
          id: item.id,
          productId: item.productId,
          productSlug: (item as any).product?.slug || null,
          productName: item.product?.name || item.name || 'Sản phẩm',
          quantity: item.quantity,
          price: item.unitPrice || 0,
          total: (item.unitPrice || 0) * item.quantity
        }))
      }))
    }));
  }

  async get(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: { items: true, payments: true } });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return order;
  }

  async updateStatus(id: string, status: string) {
    const order = await this.get(id);
    const current = (order.status || '').toUpperCase();
    const next = (status || '').toUpperCase();
    const nexts = allowedTransitions[current] || [];
    // Debug logs to help diagnose invalid transitions
    console.log('[OrdersService.updateStatus] current=', current, 'requested=', next, 'allowed=', nexts);
    if (!nexts.includes(next)) throw new BadRequestException('Trạng thái không hợp lệ');
    const updated = await this.prisma.order.update({ where: { id }, data: { status: next } });

    // If order is cancelled from PENDING/PROCESSING, restore stock back to inventory
    if (next === 'CANCELLED' && (current === 'PENDING' || current === 'PROCESSING')) {
      try {
        const items = await this.prisma.orderItem.findMany({
          where: { orderId: id },
          include: { product: { select: { id: true, slug: true, name: true } } },
        });

        for (const item of items) {
          let targetProductId: string | null = item.productId ?? null;

          // Try to resolve via relation if productId is null
          if (!targetProductId && item.product?.id) {
            targetProductId = item.product.id;
          }

          // Try resolve by slug if available
          if (!targetProductId && item.product?.slug) {
            const bySlug = await this.prisma.product.findUnique({ where: { slug: item.product.slug } });
            if (bySlug) targetProductId = bySlug.id;
          }

          // As a last resort, try by name
          if (!targetProductId && item.product?.name) {
            const byName = await (this.prisma as any).product.findFirst({ where: { name: item.product.name } });
            if (byName) targetProductId = byName.id;
          }

          if (targetProductId) {
            await this.prisma.product.update({
              where: { id: targetProductId },
              data: { stockQuantity: { increment: item.quantity } },
            });
          } else {
            console.warn('[OrdersService.updateStatus] Could not resolve product for order item during cancel restore. Skipped increment.');
          }
        }

        // Invalidate cached product lists so stock changes reflect immediately
        await this.cache.clearByPrefix('audiotailoc');
      } catch (error) {
        console.error('Failed to restore stock on cancellation:', error);
      }
    }

    // Send notification email if we have the user's email
    if (order.userId) {
      try {
        const user = await this.prisma.user.findUnique({ where: { id: order.userId } });
        if (user?.email) {
          // Get order with items for email template
          const orderWithItems = await this.prisma.order.findUnique({
            where: { id: order.id },
            include: { items: true }
          });

          if (orderWithItems) {
            const orderData = {
              orderNo: order.orderNo,
              customerName: user.name || user.email,
              totalAmount: `${(order.totalCents / 100).toLocaleString('vi-VN')} VNĐ`,
              items: orderWithItems.items.map((item: any) => ({
                name: item.name || 'Sản phẩm',
                quantity: item.quantity,
                price: `${(item.unitPrice / 100).toLocaleString('vi-VN')} VNĐ`
              })),
              status: status
            };

            await this.mail.sendOrderStatusUpdate(user.email, orderData);
          }
        }
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    }

    return updated;
  }

  async create(orderData: any): Promise<any> {
    console.log('=== SIMPLE CREATE ORDER DEBUG ===');
    console.log('Input data:', JSON.stringify(orderData, null, 2));

    // Generate unique order number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const orderNo = `ORD${timestamp}${random}`;

    // Handle user creation/connection
    let userId = orderData.userId;
    if (!userId) {
      console.log('Creating guest user...');
      // Create a guest user if no userId provided
      const uniqueEmail = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@audiotailoc.com`;
      const guestUser = await this.prisma.user.create({
        data: {
          email: uniqueEmail,
          password: 'hashed_guest_password', // Use a simple string for now
          name: orderData.customerName || 'Khách hàng',
          phone: orderData.customerPhone,
          role: 'USER'
        }
      });
      userId = guestUser.id;
      console.log('Guest user created:', userId);
    }

    // Simple item processing
    const items = [];
    let subtotalCents = 0;

    for (const item of orderData.items || []) {
      console.log('Processing item:', item);
      
      // Get product
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        throw new BadRequestException(`Product not found: ${item.productId}`);
      }

      const itemData = {
        productId: product.id,
        quantity: item.quantity || 1,
        price: product.priceCents,
        unitPrice: product.priceCents,
        name: product.name
      };

      items.push(itemData);
      subtotalCents += itemData.price * itemData.quantity;
    }

    console.log('Processed items:', items);
    console.log('Subtotal:', subtotalCents);

    // Create order and items separately (no transaction for debugging)
    const order = await this.prisma.order.create({
      data: {
        orderNo,
        userId,
        status: 'PENDING',
        subtotalCents,
        totalCents: subtotalCents,
        shippingAddress: orderData.shippingAddress || null
      }
    });

    console.log('Order created:', order.id);

    // Create order items
    for (const itemData of items) {
      await this.prisma.orderItem.create({
        data: {
          orderId: order.id,
          ...itemData
        }
      });
    }

    console.log('Order items created');

    // Get full order with items
    const fullOrder = await this.prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    console.log('Returning order:', fullOrder?.id);
    return fullOrder;
  }

  async update(id: string, updateData: any): Promise<any> {
    console.log('=== UPDATE ORDER DEBUG ===');
    console.log('Order ID:', id);
    console.log('Update data keys:', Object.keys(updateData));
    console.log('Update data:', JSON.stringify(updateData, null, 2));

    const order = await this.get(id);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    const updatePayload: any = {};

    // Update user information if provided
    if (updateData.customerName || updateData.customerPhone || updateData.customerEmail) {
      const userUpdate: any = {};
      if (updateData.customerName) userUpdate.name = updateData.customerName;
      if (updateData.customerPhone) userUpdate.phone = updateData.customerPhone;
      if (updateData.customerEmail) userUpdate.email = updateData.customerEmail;

      if (order.userId) {
        await this.prisma.user.update({
          where: { id: order.userId },
          data: userUpdate
        });
      }
    }

    // Update order fields
    if (updateData.shippingAddress !== undefined) {
      updatePayload.shippingAddress = typeof updateData.shippingAddress === 'string'
        ? updateData.shippingAddress
        : (updateData.shippingAddress ? JSON.stringify(updateData.shippingAddress) : null);
    }

    if (updateData.shippingCoordinates !== undefined) {
      updatePayload.shippingCoordinates = updateData.shippingCoordinates
        ? JSON.stringify(updateData.shippingCoordinates)
        : null;
    }

    if (updateData.notes !== undefined) {
      // Notes field doesn't exist in Order model, skip this update
      console.log('Skipping notes update - field not in Order schema');
    }

    // Update items if provided
    if (updateData.items) {
      // Delete existing items
      await this.prisma.orderItem.deleteMany({ where: { orderId: id } });

      // Recalculate total
      let subtotalCents = 0;
      const items: any[] = [];

      for (const item of updateData.items) {
        const itemData: any = {
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          price: item.unitPrice || 0, // Required field for compatibility
          name: item.name || 'Sản phẩm'
        };

        // Try to get product price from database
        try {
          let product = await this.prisma.product.findUnique({
            where: { id: item.productId }
          });

          if (!product) {
            product = await this.prisma.product.findUnique({
              where: { slug: item.productId }
            });
          }

          if (product) {
            itemData.unitPrice = product.priceCents;
            itemData.price = product.priceCents; // Keep both fields in sync
            itemData.productId = product.id;
            if (!item.name && product.name) itemData.name = product.name;
          }
        } catch (error) {
          console.error('Failed to fetch product:', error);
        }

        items.push(itemData);
        subtotalCents += (itemData.unitPrice || 0) * (itemData.quantity || 1);
      }

      // Ensure every item resolved to a valid productId
      const unresolved = items.filter(i => !i.productId);
      if (unresolved.length > 0) {
        throw new BadRequestException('Sản phẩm không hợp lệ. Vui lòng chọn lại sản phẩm.');
      }

      updatePayload.items = { create: items };
      updatePayload.subtotalCents = subtotalCents;
      updatePayload.totalCents = subtotalCents;
    }

    // Update the order
    const _updatedOrder = await this.prisma.order.update({
      where: { id },
      data: updatePayload,
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    // Get the full order with all fields for return
    const fullOrder = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    return {
      id: fullOrder!.id,
      orderNumber: fullOrder!.orderNo,
      customerName: fullOrder!.user?.name || 'N/A',
      customerEmail: fullOrder!.user?.email || 'N/A',
      customerPhone: fullOrder!.user?.phone || 'N/A',
      totalAmount: fullOrder!.totalCents,
      status: fullOrder!.status,
      shippingAddress: fullOrder!.shippingAddress,
      createdAt: fullOrder!.createdAt,
      updatedAt: fullOrder!.updatedAt,
      items: fullOrder!.items.map(item => ({
        id: item.id,
        productName: item.product?.name || item.name || 'Sản phẩm',
        quantity: item.quantity,
        price: item.unitPrice || 0,
        total: (item.unitPrice || 0) * item.quantity
      }))
    };
  }

  async delete(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    // If deleting a PENDING/PROCESSING order, restore stock first
    if (order.status === 'PENDING' || order.status === 'PROCESSING') {
      try {
        for (const item of order.items) {
          if (item.productId) {
            await this.prisma.product.update({
              where: { id: item.productId },
              data: { stockQuantity: { increment: item.quantity } }
            });
          }
        }
        // Invalidate cached product lists
        await this.cache.clearByPrefix('audiotailoc');
      } catch (error) {
        console.error('Failed to restore stock on delete:', error);
      }
    }

    await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
    await this.prisma.payment.deleteMany({ where: { orderId: id } });
    await this.prisma.order.delete({ where: { id } });
    return { message: 'Đơn hàng đã được xóa thành công' };
  }
}
