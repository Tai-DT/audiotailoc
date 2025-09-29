import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../caching/cache.service';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const allowedTransitions: Record<string, string[]> = {
  PENDING: ['PROCESSING', 'CANCELLED', 'COMPLETED'],
  PROCESSING: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

const toNumber = (value: bigint | number | null | undefined, fallback = 0): number => {
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return fallback;
};

const toBigInt = (value: number): bigint => BigInt(Math.round(value));

const normalizeStatus = (status?: string): string => {
  if (!status) return 'PENDING';
  const normalized = status.toUpperCase();
  if (normalized === 'CANCELED') return 'CANCELLED';
  return normalized;
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  list(params: { page?: number; pageSize?: number; status?: string }) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
    const where: any = {};
    if (params.status) where.status = normalizeStatus(params.status);
    return this.prisma.$transaction([
      this.prisma.orders.count({ where }),
      this.prisma.orders.findMany({
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
          order_items: {
            include: {
              products: {
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
        customerName: order.users?.name || 'N/A',
        customerEmail: order.users?.email || 'N/A',
        totalAmount: Number(order.totalCents ?? 0),
        status: normalizeStatus(order.status),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.order_items.map(item => ({
          id: item.id,
          productId: item.productId,
          productSlug: (item as any).products?.slug || null,
          productName: item.products?.name || item.name || 'Sản phẩm',
          quantity: item.quantity,
          price: toNumber(item.unitPrice),
          total: toNumber(item.unitPrice) * item.quantity
        }))
      }))
    }));
  }

  async get(id: string) {
    const order = await this.prisma.orders.findUnique({
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
        payments: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    return {
      id: order.id,
      orderNumber: order.orderNo,
      userId: order.userId,
      status: normalizeStatus(order.status),
      customerName: order.user?.name || 'N/A',
      customerEmail: order.user?.email || 'N/A',
      customerPhone: order.user?.phone || 'N/A',
      subtotalCents: order.subtotalCents,
      discountCents: order.discountCents,
      shippingCents: order.shippingCents,
      totalAmount: order.totalCents,
      shippingAddress: order.shippingAddress,
      shippingCoordinates: order.shippingCoordinates,
      promotionCode: order.promotionCode,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productSlug: (item as any).product?.slug || null,
        productName: item.product?.name || item.name || 'Sản phẩm',
        quantity: item.quantity,
        price: toNumber(item.unitPrice),
        total: toNumber(item.price)
      })),
      payments: order.payments
    };
  }

  async updateStatus(id: string, status: string) {
    const order = await this.get(id);
    const current = normalizeStatus(order.status);
    const next = normalizeStatus(status);
    const nexts = allowedTransitions[current] || [];
    // Debug logs to help diagnose invalid transitions
    console.log('[OrdersService.updateStatus] current=', current, 'requested=', next, 'allowed=', nexts);
    if (!nexts.includes(next)) throw new BadRequestException('Trạng thái không hợp lệ');
    const updated = await this.prisma.orders.update({ where: { id }, data: { status: next } });

    // If order is cancelled from PENDING/PROCESSING, restore stock back to inventory
    if (next === 'CANCELLED' && (current === 'PENDING' || current === 'PROCESSING')) {
      try {
        const items = await this.prisma.order_items.findMany({
          where: { orderId: id },
          include: { products: { select: { id: true, slug: true, name: true } } },
        });

        for (const item of items) {
          let targetProductId: string | null = item.productId ?? null;

          // Try to resolve via relation if productId is null
          if (!targetProductId && item.product?.id) {
            targetProductId = item.products.id;
          }

          // Try resolve by slug if available
          if (!targetProductId && item.product?.slug) {
            const bySlug = await this.prisma.products.findUnique({ where: { slug: item.products.slug } });
            if (bySlug) targetProductId = bySlug.id;
          }

          // As a last resort, try by name
          if (!targetProductId && item.product?.name) {
            const byName = await (this.prisma as any).products.findFirst({ where: { name: item.products.name } });
            if (byName) targetProductId = byName.id;
          }

          if (targetProductId) {
            await this.prisma.products.update({
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

    return updated;
  }

  async create(orderData: any): Promise<any> {
    console.log('=== CREATE ORDER DEBUG ===');
    console.log('Order data:', JSON.stringify(orderData, null, 2));

    if (!orderData || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new BadRequestException('Đơn hàng phải có ít nhất một sản phẩm.');
    }

    // Generate unique order number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const orderNo = `ORD${timestamp}${random}`;

    const resolvedItems: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      name: string;
      product: { id: string; name: string; stockQuantity: number | null };
    }> = [];

    let subtotalCents = 0;

    for (const rawItem of orderData.items) {
      const quantity = Math.max(1, Number(rawItem.quantity) || 1);
      const identifier = rawItem.productId || rawItem.productSlug || rawItem.slug;
      let product = null;

      if (identifier) {
        product = await this.prisma.products.findUnique({ where: { id: identifier } });
        if (!product) {
          product = await this.prisma.products.findUnique({ where: { slug: identifier } });
        }
      }

      if (!product) {
        throw new BadRequestException('Sản phẩm không hợp lệ. Vui lòng chọn lại sản phẩm.');
      }

      const unitPrice = rawItem.unitPrice != null && rawItem.unitPrice !== ''
        ? Number(rawItem.unitPrice)
        : Number(product.priceCents);

      if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
        throw new BadRequestException(`Giá của sản phẩm "${product.name}" không hợp lệ.`);
      }

      if (product.stockQuantity != null && product.stockQuantity < quantity) {
        throw new BadRequestException(`Số lượng tồn kho của "${product.name}" không đủ.`);
      }

      subtotalCents += unitPrice * quantity;

      resolvedItems.push({
        productId: product.id,
        quantity,
        unitPrice,
        name: rawItem.name || product.name,
        product: {
          id: product.id,
          name: product.name,
          stockQuantity: product.stockQuantity,
        }
      });
    }

    const discountCents = Math.max(0, Number(orderData.discountCents) || 0);
    const shippingCents = Math.max(0, Number(orderData.shippingCents ?? orderData.shippingFee ?? 0));
    const totalCents = Math.max(0, subtotalCents + shippingCents - discountCents);

    let userId: string | null = orderData.userId ?? null;
    const customerEmail: string | undefined = orderData.customerEmail?.trim().toLowerCase();
    const customerName: string = orderData.customerName || orderData.fullName || 'Khách hàng';
    const customerPhone: string | undefined = orderData.customerPhone;

    if (!userId && customerEmail) {
      const existing = await this.prisma.users.findUnique({ where: { email: customerEmail } });
      if (existing) {
        userId = existing.id;
      } else {
        const randomPassword = randomBytes(9).toString('base64');
        const hashedPassword = await bcrypt.hash(randomPassword, 12);
        const created = await this.prisma.users.create({
          data: {
            email: customerEmail,
            password: hashedPassword,
            name: customerName,
            phone: customerPhone,
            role: 'USER'
          }
        });
        userId = created.id;
      }
    }

    if (!userId) {
      const fallbackEmail = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}@audiotailoc.com`;
      const hashedPassword = await bcrypt.hash(randomBytes(12).toString('base64'), 12);
      const guest = await this.prisma.users.create({
        data: {
          email: fallbackEmail,
          password: hashedPassword,
          name: customerName,
          phone: customerPhone,
          role: 'USER'
        }
      });
      userId = guest.id;
    }

    const shippingAddress = orderData.shippingAddress || orderData.address || null;
    const shippingCoordinates = orderData.shippingCoordinates
      ? JSON.stringify(orderData.shippingCoordinates)
      : orderData.shippingCoordinatesJson || null;

    const normalizedStatus = normalizeStatus(orderData.status);

    const createdOrder = await this.prisma.$transaction(async tx => {
      const order = await tx.orders.create({
        data: {
          orderNo,
          userId,
          status: normalizedStatus,
          subtotalCents,
          discountCents,
          shippingCents,
          totalCents,
          shippingAddress,
          shippingCoordinates,
          promotionCode: orderData.promotionCode ?? null,
          items: {
            create: resolvedItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: toBigInt(item.unitPrice),
              name: item.name,
              price: toBigInt(item.unitPrice * item.quantity)
            }))
          }
        },
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

      for (const item of resolvedItems) {
        if (item.products.stockQuantity != null) {
          await tx.products.update({
            where: { id: item.productId },
            data: {
              stockQuantity: { decrement: item.quantity }
            }
          });
        }
      }

      return order;
    });

    await this.cache.clearByPrefix('audiotailoc');

    return {
      id: createdOrder.id,
      orderNumber: createdOrder.orderNo,
      customerName: createdOrder.user?.name || customerName,
      customerEmail: createdOrder.user?.email || customerEmail,
      customerPhone: createdOrder.user?.phone || customerPhone,
      status: normalizeStatus(createdOrder.status),
      subtotalCents,
      discountCents,
      shippingCents,
      totalAmount: totalCents,
      shippingAddress: createdOrder.shippingAddress,
      createdAt: createdOrder.createdAt,
      items: createdOrder.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productSlug: (item as any).product?.slug || null,
        productName: item.product?.name || item.name || 'Sản phẩm',
        quantity: item.quantity,
        price: toNumber(item.unitPrice),
        total: toNumber(item.price)
      }))
    };
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
        await this.prisma.users.update({
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
      await this.prisma.order_items.deleteMany({ where: { orderId: id } });

      // Recalculate total
      let subtotalCents = 0;
      const items: any[] = [];

      for (const item of updateData.items) {
      const itemData: any = {
        quantity: item.quantity || 1,
        unitPrice: Number(item.unitPrice ?? 0),
        name: item.name || 'Sản phẩm',
        price: Number(item.unitPrice ?? 0)
      };

        // Try to get product price from database
        try {
          let product = await this.prisma.products.findUnique({
            where: { id: item.productId }
          });

          if (!product) {
            product = await this.prisma.products.findUnique({
              where: { slug: item.productId }
            });
          }

          if (product) {
            itemData.unitPrice = Number(product.priceCents);
            itemData.price = itemData.unitPrice;
            itemData.productId = product.id;
            if (!item.name && product.name) itemData.name = product.name;
          }
        } catch (error) {
          console.error('Failed to fetch product:', error);
        }

        items.push(itemData);
        subtotalCents += Number(itemData.unitPrice || 0) * (itemData.quantity || 1);
      }

      // Ensure every item resolved to a valid productId
      const unresolved = items.filter(i => !i.productId);
      if (unresolved.length > 0) {
        throw new BadRequestException('Sản phẩm không hợp lệ. Vui lòng chọn lại sản phẩm.');
      }

      updatePayload.items = {
        create: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: toBigInt(i.unitPrice),
          name: i.name,
          price: toBigInt(i.unitPrice * i.quantity)
        }))
      };
      updatePayload.subtotalCents = subtotalCents;
      updatePayload.totalCents = subtotalCents;
    }

    // Update the order
    const _updatedOrder = await this.prisma.orders.update({
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
    const fullOrder = await this.prisma.orders.findUnique({
      where: { id },
      include: {
        order_items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        },
        users: {
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
      customerName: fullOrder!.users?.name || 'N/A',
      customerEmail: fullOrder!.users?.email || 'N/A',
      customerPhone: fullOrder!.users?.phone || 'N/A',
      totalAmount: fullOrder!.totalCents,
      status: normalizeStatus(fullOrder!.status),
      shippingAddress: fullOrder!.shippingAddress,
      createdAt: fullOrder!.createdAt,
      updatedAt: fullOrder!.updatedAt,
      items: fullOrder!.order_items.map(item => ({
        id: item.id,
        productName: item.product?.name || item.name || 'Sản phẩm',
        quantity: item.quantity,
        price: toNumber(item.unitPrice),
        total: toNumber(item.unitPrice) * item.quantity
      }))
    };
  }

  async delete(id: string) {
    const order = await this.prisma.orders.findUnique({
      where: { id },
      include: { service_items: true }
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    // If deleting a PENDING/PROCESSING order, restore stock first
    if (order.status === 'PENDING' || order.status === 'PROCESSING') {
      try {
        for (const item of order.items) {
          if (item.productId) {
            await this.prisma.products.update({
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

    await this.prisma.order_items.deleteMany({ where: { orderId: id } });
    await this.prisma.payments.deleteMany({ where: { orderId: id } });
    await this.prisma.orders.delete({ where: { id } });
    return { message: 'Đơn hàng đã được xóa thành công' };
  }
}
