import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import { TelegramService } from '../notifications/telegram.service';
import { CacheService } from '../caching/cache.service';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InventoryService } from '../inventory/inventory.service';

const allowedTransitions: Record<string, string[]> = {
  PENDING: ['PROCESSING', 'CANCELLED', 'COMPLETED'],
  PROCESSING: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

import { PromotionsService } from '../promotions/promotions.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly telegram: TelegramService,
    private readonly cache: CacheService,
    private readonly promotionsService: PromotionsService,
    private readonly inventoryService: InventoryService,
  ) { }

  list(params: { page?: number; pageSize?: number; status?: string }) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
    const where: any = { isDeleted: false };
    if (params.status) where.status = params.status;
    return this.prisma
      .$transaction([
        this.prisma.orders.count({ where }),
        this.prisma.orders.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            users: {
              select: {
                name: true,
                email: true,
              },
            },
            order_items: {
              include: {
                products: {
                  select: {
                    name: true,
                    slug: true,
                    inventory: {
                      select: {
                        stock: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
      ])
      .then(([total, items]) => ({
        total,
        page,
        pageSize,
        items: items.map(order => ({
          id: order.id,
          orderNumber: order.orderNo,
          customerName: order.users?.name || 'N/A',
          customerEmail: order.users?.email || 'N/A',
          totalAmount: order.totalCents,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: order.order_items.map(item => ({
            id: item.id,
            productId: item.productId,
            productSlug: (item as any).products?.slug || null,
            productName: item.products?.name || item.name || 'Sản phẩm',
            quantity: item.quantity,
            price: Number(item.unitPrice || 0),
            total: Number(item.unitPrice || 0) * item.quantity,
          })),
        })),
      }));
  }

  async get(id: string) {
    const order = await this.prisma.orders.findFirst({
      where: { id, isDeleted: false },
      include: { order_items: true, payments: true },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return this.transformOrderForResponse(order);
  }

  async updateStatus(id: string, status: string) {
    const order = await this.get(id);
    const current = (order.status || '').toUpperCase();
    const next = (status || '').toUpperCase();
    const nexts = allowedTransitions[current] || [];
    // Debug logs to help diagnose invalid transitions
    this.logger.log(
      `[OrdersService.updateStatus] current=${current} requested=${next} allowed=${JSON.stringify(nexts)}`,
    );
    if (!nexts.includes(next)) throw new BadRequestException('Trạng thái không hợp lệ');

    // Use transaction to ensure data consistency between order status and inventory
    const updated = await this.prisma.$transaction(async tx => {
      const updatedOrder = await tx.orders.update({ where: { id }, data: { status: next } });

      // If order is cancelled from PENDING/PROCESSING, restore stock back to inventory
      if (next === 'CANCELLED' && (current === 'PENDING' || current === 'PROCESSING')) {
        try {
          const items = await tx.order_items.findMany({
            where: { orderId: id },
            include: { products: { select: { id: true, slug: true, name: true } } },
          });

          for (const item of items) {
            let targetProductId: string | null = item.productId ?? null;

            // Try to resolve via relation if productId is null
            if (!targetProductId && item.products?.id) {
              targetProductId = item.products.id;
            }

            // Try resolve by slug if available
            if (!targetProductId && item.products?.slug) {
              const bySlug = await tx.products.findUnique({
                where: { slug: item.products.slug },
              });
              if (bySlug) targetProductId = bySlug.id;
            }

            // As a last resort, try by name
            if (!targetProductId && item.products?.name) {
              const byName = await (tx as any).products.findFirst({
                where: { name: item.products.name },
              });
              if (byName) targetProductId = byName.id;
            }

            if (targetProductId) {
              // Update inventory table and create movement record
              const inventory = await tx.inventory.findUnique({
                where: { productId: targetProductId },
              });

              if (inventory) {
                const previousStock = inventory.stock;
                const newStock = previousStock + item.quantity;

                await tx.inventory.update({
                  where: { productId: targetProductId },
                  data: {
                    stock: { increment: item.quantity },
                    updatedAt: new Date(),
                  },
                });

                await tx.inventory_movements.create({
                  data: {
                    id: randomUUID(),
                    productId: targetProductId,
                    type: 'IN', // Stock return
                    quantity: item.quantity,
                    previousStock,
                    newStock,
                    reason: `Order cancelled: ${order.orderNumber}`,
                    referenceId: order.id,
                    referenceType: 'ORDER',
                    createdAt: new Date(),
                  },
                });
              }
            } else {
              this.logger.warn(
                '[OrdersService.updateStatus] Could not resolve product for order item during cancel restore. Skipped increment.',
              );
            }
          }
        } catch (error) {
          this.logger.error('Failed to restore stock on cancellation:', error);
          // We should probably throw here to rollback the status change if stock restore fails
          throw error;
        }
      }
      return updatedOrder;
    });

    // Invalidate cached product lists so stock changes reflect immediately
    try {
      await this.cache.clearByPrefix('audiotailoc');
    } catch (error) {
      this.logger.warn('Failed to clear cache after status update:', error);
    }

    // Send notification email if we have the user's email
    if (order.userId) {
      try {
        const user = await this.prisma.users.findUnique({ where: { id: order.userId } });
        if (user?.email) {
          // Get order with items for email template
          const orderWithItems = await this.prisma.orders.findUnique({
            where: { id: order.id },
            include: { order_items: true },
          });

          if (orderWithItems) {
            const orderData = {
              orderNo: order.orderNo,
              customerName: user.name || user.email,
              totalAmount: `${(order.totalCents / 100).toLocaleString('vi-VN')} VNĐ`,
              items: orderWithItems.order_items.map((item: any) => ({
                name: item.name || 'Sản phẩm',
                quantity: item.quantity,
                price: `${(item.unitPrice / 100).toLocaleString('vi-VN')} VNĐ`,
              })),
              status: status,
            };

            await this.mail.sendOrderStatusUpdate(user.email, orderData);
          }
        }
      } catch (error) {
        this.logger.error('Failed to send email notification:', error);
      }
    }

    // Send Telegram notification for status update
    try {
      const orderForTelegram = await this.prisma.orders.findUnique({
        where: { id },
        include: {
          users: { select: { name: true, email: true, phone: true } },
          order_items: { include: { products: true } },
        },
      });

      if (orderForTelegram) {
        await this.telegram.sendOrderStatusUpdate(
          {
            id: orderForTelegram.id,
            orderNumber: orderForTelegram.orderNo,
            customerName: orderForTelegram.users?.name || 'N/A',
            customerEmail: orderForTelegram.users?.email || 'N/A',
            customerPhone: orderForTelegram.users?.phone,
            totalAmount: orderForTelegram.totalCents,
            items: orderForTelegram.order_items,
            shippingAddress: orderForTelegram.shippingAddress,
            status: next,
            createdAt: orderForTelegram.createdAt,
          },
          current,
          next,
        );
      }
    } catch (error) {
      this.logger.error('Failed to send Telegram notification:', error);
    }

    return updated;
  }

  async create(orderData: CreateOrderDto): Promise<any> {
    // Generate unique order number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const orderNo = `ORD${timestamp}${random}`;

    // Handle user creation/connection
    let userId = orderData.userId;
    if (!userId) {
      const uniqueEmail = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@audiotailoc.com`;
      const guestPassword = await bcrypt.hash(`guest-${randomUUID()}`, 10);
      const guestUser = await this.prisma.users.create({
        data: {
          id: randomUUID(),
          email: uniqueEmail,
          password: guestPassword,
          name: orderData.customerName || 'Khách hàng',
          phone: orderData.customerPhone,
          role: 'USER',
          updatedAt: new Date(),
        },
      });
      userId = guestUser.id;
    }

    // Simple item processing
    const items = [];
    let subtotalCents = 0;
    const rawItems = orderData.items || [];

    for (const item of rawItems) {
      // Get product
      const product = await this.prisma.products.findUnique({
        where: { id: item.productId },
        include: { inventory: true },
      });

      if (!product) {
        throw new BadRequestException(`Product not found: ${item.productId}`);
      }

      // Check stock availability
      const availableStock = product.inventory?.stock || 0;
      if (availableStock < (item.quantity || 1)) {
        throw new BadRequestException(
          `Product "${product.name}" is out of stock (Requested: ${item.quantity || 1}, Available: ${availableStock})`,
        );
      }

      const itemData = {
        productId: product.id,
        quantity: item.quantity || 1,
        price: Number(product.priceCents),
        unitPrice: Number(product.priceCents),
        name: product.name,
      };

      items.push(itemData);
      subtotalCents += itemData.price * itemData.quantity;
    }

    if (items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Calculate discount if promotion code provided
    let discountCents = 0;
    let promotionCode = null;

    if (orderData.promotionCode) {
      const promoResult = await this.promotionsService.validateCode(
        orderData.promotionCode,
        subtotalCents,
      );
      if (promoResult.valid) {
        discountCents = promoResult.discount || 0;
        promotionCode = orderData.promotionCode;
      }
    }

    const totalCents = Math.max(0, subtotalCents - discountCents);

    // Create order and items in a transaction to keep them consistent
    const order = await this.prisma.$transaction(async tx => {
      const createdOrder = await tx.orders.create({
        data: {
          id: randomUUID(),
          orderNo,
          userId,
          status: 'PENDING',
          subtotalCents,
          discountCents,
          promotionCode,
          totalCents,
          shippingAddress: orderData.shippingAddress || null,
          updatedAt: new Date(),
        },
      });

      // Increment promotion usage if applied
      if (promotionCode) {
        await this.promotionsService.incrementUsage(promotionCode);
      }

      for (const itemData of items) {
        await tx.order_items.create({
          data: {
            id: randomUUID(),
            orderId: createdOrder.id,
            ...itemData,
            updatedAt: new Date(),
          },
        });

        // Decrease stock if available - Sync inventory table
        try {
          // Update inventory table and create movement record
          // We need to check if inventory record exists first
          const inventory = await tx.inventory.findUnique({
            where: { productId: itemData.productId },
          });

          if (inventory) {
            const previousStock = inventory.stock;
            const newStock = previousStock - itemData.quantity;

            // Update inventory stock
            await tx.inventory.update({
              where: { productId: itemData.productId },
              data: {
                stock: { decrement: itemData.quantity },
                updatedAt: new Date(),
              },
            });

            // Create movement record
            await tx.inventory_movements.create({
              data: {
                id: randomUUID(),
                productId: itemData.productId,
                type: 'OUT',
                quantity: itemData.quantity,
                previousStock,
                newStock,
                reason: `Order created: ${createdOrder.orderNo}`,
                referenceId: createdOrder.id,
                referenceType: 'ORDER',
                createdAt: new Date(),
              },
            });
          } else {
            // If inventory record doesn't exist, we should create it or log a warning
            // For now, let's log a warning as the system might be in transition
            this.logger.warn(
              `[OrdersService.create] Inventory record not found for product ${itemData.productId}`,
            );
          }
        } catch (error: any) {
          // If stock update fails, we should probably fail the transaction to ensure consistency
          this.logger.error(
            `[OrdersService.create] Failed to decrement stock for product ${itemData.productId}: ${error.message || error}`,
          );
          throw new BadRequestException(`Failed to update stock for product ${itemData.productId}`);
        }
      }

      return createdOrder;
    });

    // Get full order with items
    const fullOrder = await this.prisma.orders.findUnique({
      where: { id: order.id },
      include: {
        order_items: { include: { products: true } },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Send Telegram notification for new order (BEFORE transforming, so we catch any BigInt issues)
    try {
      if (fullOrder) {
        // Transform items for Telegram notification
        const telegramItems = fullOrder.order_items.map(item => ({
          ...item,
          price: Number(item.price),
          unitPrice: item.unitPrice ? Number(item.unitPrice) : null,
        }));

        await this.telegram.sendOrderNotification({
          id: fullOrder.id,
          orderNumber: fullOrder.orderNo,
          customerName: fullOrder.users?.name || 'N/A',
          customerEmail: fullOrder.users?.email || 'N/A',
          customerPhone: fullOrder.users?.phone,
          totalAmount: fullOrder.totalCents,
          items: telegramItems,
          shippingAddress: fullOrder.shippingAddress,
          status: fullOrder.status,
          createdAt: fullOrder.createdAt,
        });
      }
    } catch (error) {
      this.logger.error('Failed to send Telegram notification:', error);
    }

    // Transform BigInt to Number for JSON serialization
    const transformedOrder = this.transformOrderForResponse(fullOrder);
    return transformedOrder;
  }

  async update(id: string, updateData: UpdateOrderDto): Promise<any> {
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
          data: userUpdate,
        });
      }
    }

    // Update order fields
    if (updateData.shippingAddress !== undefined) {
      updatePayload.shippingAddress =
        typeof updateData.shippingAddress === 'string'
          ? updateData.shippingAddress
          : updateData.shippingAddress
            ? JSON.stringify(updateData.shippingAddress)
            : null;
    }

    if (updateData.shippingCoordinates !== undefined) {
      updatePayload.shippingCoordinates = updateData.shippingCoordinates
        ? JSON.stringify(updateData.shippingCoordinates)
        : null;
    }

    if (updateData.notes !== undefined) {
      // Notes field doesn't exist in Order model, skip this update
    }

    // Update items if provided
    if (updateData.items) {
      // Get existing items to calculate stock adjustments
      const existingItems = await this.prisma.order_items.findMany({
        where: { orderId: id },
        include: {
          products: { select: { id: true, name: true, inventory: { select: { stock: true } } } },
        },
      });

      // Delete existing items
      await this.prisma.order_items.deleteMany({ where: { orderId: id } });

      // Recalculate total and validate stock
      let subtotalCents = 0;
      const items: any[] = [];

      for (const item of updateData.items) {
        const itemData: any = {
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          price: item.unitPrice || 0, // Required field for compatibility
          name: item.name || 'Sản phẩm',
        };

        // Try to get product price from database
        try {
          let product = await this.prisma.products.findUnique({
            where: { id: item.productId },
            include: { inventory: true },
          });

          if (!product) {
            product = await this.prisma.products.findUnique({
              where: { slug: item.productId },
              include: { inventory: true },
            });
          }

          if (product) {
            itemData.unitPrice = Number(product.priceCents);
            itemData.price = Number(product.priceCents); // Keep both fields in sync
            itemData.productId = product.id;
            if (!item.name && product.name) itemData.name = product.name;

            // Find the old quantity for this product from existing items
            const oldItem = existingItems.find(ei => ei.productId === product.id);
            const oldQuantity = oldItem?.quantity || 0;
            const newQuantity = itemData.quantity || 1;
            const quantityDifference = newQuantity - oldQuantity;

            // If we're adding more items, check if stock is available
            if (quantityDifference > 0) {
              const currentStock = product.inventory?.stock || 0;
              const availableStock = currentStock + oldQuantity; // Available = current + what was reserved
              if (availableStock < newQuantity) {
                throw new BadRequestException(
                  `Product "${product.name}" has insufficient stock. Requested: ${newQuantity}, Available: ${availableStock}`,
                );
              }
            }
          }
        } catch (error) {
          if (error instanceof BadRequestException) {
            throw error;
          }
          this.logger.error('Failed to fetch product:', error);
        }

        items.push(itemData);
        subtotalCents += (itemData.unitPrice || 0) * (itemData.quantity || 1);
      }

      // Ensure every item resolved to a valid productId
      const unresolved = items.filter(i => !i.productId);
      if (unresolved.length > 0) {
        throw new BadRequestException('Sản phẩm không hợp lệ. Vui lòng chọn lại sản phẩm.');
      }

      // Adjust stock for changed quantities
      try {
        await this.prisma.$transaction(async tx => {
          for (const newItem of items) {
            const oldItem = existingItems.find(ei => ei.productId === newItem.productId);
            if (oldItem) {
              const quantityDifference = (newItem.quantity || 1) - (oldItem.quantity || 0);
              if (quantityDifference !== 0) {
                // Update inventory table and create movement record
                const inventory = await tx.inventory.findUnique({
                  where: { productId: newItem.productId },
                });

                if (inventory) {
                  const previousStock = inventory.stock;
                  const newStock = previousStock - quantityDifference;

                  await tx.inventory.update({
                    where: { productId: newItem.productId },
                    data: {
                      stock: { decrement: quantityDifference },
                      updatedAt: new Date(),
                    },
                  });

                  await tx.inventory_movements.create({
                    data: {
                      id: randomUUID(),
                      productId: newItem.productId,
                      type: quantityDifference > 0 ? 'OUT' : 'IN',
                      quantity: Math.abs(quantityDifference),
                      previousStock,
                      newStock,
                      reason: `Order updated: ${order.orderNo}`,
                      referenceId: order.id,
                      referenceType: 'ORDER',
                      createdAt: new Date(),
                    },
                  });
                }
              }
            }
          }
        });
      } catch (error) {
        this.logger.error('[OrdersService.update] Failed to adjust stock:', error);
        throw new BadRequestException('Failed to update stock. Please try again.');
      }

      updatePayload.order_items = { create: items };
      updatePayload.subtotalCents = subtotalCents;
      updatePayload.totalCents = subtotalCents;
    }

    // Update the order
    const _updatedOrder = await this.prisma.orders.update({
      where: { id },
      data: updatePayload,
      include: {
        order_items: {
          include: {
            products: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        users: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Get the full order with all fields for return
    const fullOrder = await this.prisma.orders.findUnique({
      where: { id },
      include: {
        order_items: {
          include: {
            products: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        users: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return {
      id: fullOrder!.id,
      orderNumber: fullOrder!.orderNo,
      customerName: fullOrder!.users?.name || 'N/A',
      customerEmail: fullOrder!.users?.email || 'N/A',
      customerPhone: fullOrder!.users?.phone || 'N/A',
      totalAmount: fullOrder!.totalCents,
      status: fullOrder!.status,
      shippingAddress: fullOrder!.shippingAddress,
      createdAt: fullOrder!.createdAt,
      updatedAt: fullOrder!.updatedAt,
      items: fullOrder!.order_items.map(item => ({
        id: item.id,
        productName: item.products?.name || item.name || 'Sản phẩm',
        quantity: item.quantity,
        price: item.unitPrice || 0,
        total: Number(item.unitPrice || 0) * item.quantity,
      })),
    };
  }

  async sendInvoice(id: string) {
    const order = await this.prisma.orders.findUnique({
      where: { id },
      include: {
        order_items: {
          include: {
            products: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        users: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    // Cast to any to avoid strict type checking on relations
    const orderData = order as any;

    const email = orderData.users?.email || orderData.customerEmail;
    if (!email) {
      throw new BadRequestException('Đơn hàng không có địa chỉ email khách hàng');
    }

    const invoiceData = {
      invoiceNo: orderData.orderNo,
      createdDate: orderData.createdAt.toLocaleDateString('vi-VN'),
      dueDate: new Date(orderData.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(
        'vi-VN',
      ),
      status: orderData.status,
      customer: {
        name: orderData.users?.name || orderData.customerName || 'Khách hàng',
        email: email,
        phone: orderData.users?.phone || orderData.customerPhone || '',
        address: orderData.shippingAddress || '',
      },
      items: orderData.order_items.map((item: any) => ({
        name: item.products?.name || item.name || 'Sản phẩm',
        quantity: item.quantity,
        price: Number(item.unitPrice || 0),
        total: Number(item.unitPrice || 0) * item.quantity,
      })),
      subTotal: orderData.subtotalCents,
      tax: 0,
      discount: orderData.discountCents,
      total: orderData.totalCents,
      company: {
        name: 'Audio Tai Loc',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '0123 456 789',
        email: 'support@audiotailoc.com',
        website: 'https://audiotailoc.com',
      },
    };

    try {
      await this.mail.sendInvoice(email, invoiceData as any);
      return { success: true, message: `Đã gửi hóa đơn đến ${email}` };
    } catch (error) {
      this.logger.error('Failed to send invoice:', error);
      throw new BadRequestException('Không thể gửi hóa đơn. Vui lòng thử lại sau.');
    }
  }

  async delete(id: string) {
    try {
      const order = await this.prisma.orders.findUnique({
        where: { id },
        include: { order_items: true },
      });
      if (!order || order.isDeleted) throw new NotFoundException('Không tìm thấy đơn hàng');

      // If deleting a PENDING/PROCESSING order, restore stock first
      if (order.status === 'PENDING' || order.status === 'PROCESSING') {
        try {
          // Use transaction for atomic updates
          await this.prisma.$transaction(async tx => {
            for (const item of order.order_items) {
              if (item.productId) {
                // Update inventory table and create movement record
                const inventory = await tx.inventory.findUnique({
                  where: { productId: item.productId },
                });

                if (inventory) {
                  const previousStock = inventory.stock;
                  const newStock = previousStock + item.quantity;

                  await tx.inventory.update({
                    where: { productId: item.productId },
                    data: {
                      stock: { increment: item.quantity },
                      updatedAt: new Date(),
                    },
                  });

                  await tx.inventory_movements.create({
                    data: {
                      id: randomUUID(),
                      productId: item.productId,
                      type: 'IN', // Restoring stock
                      quantity: item.quantity,
                      previousStock,
                      newStock,
                      reason: `Order deleted (Soft Delete): ${order.orderNo}`,
                      referenceId: order.id,
                      referenceType: 'ORDER',
                      createdAt: new Date(),
                    },
                  });
                }
              }
            }
          });
          // Invalidate cached product lists
          try {
            await this.cache.clearByPrefix('audiotailoc');
          } catch (cacheError) {
            this.logger.warn('[OrdersService.delete] Failed to clear cache:', cacheError);
            // Continue with deletion even if cache clear fails
          }
        } catch (restoreError) {
          this.logger.error('Failed to restore stock on delete:', restoreError);
          // Continue with deletion even if stock restoration fails
        }
      }

      // Soft delete the order
      await this.prisma.orders.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          status: 'CANCELLED', // Optionally mark as cancelled
        },
      });

      return { message: 'Đơn hàng đã được xóa thành công', id };
    } catch (error) {
      this.logger.error('[OrdersService.delete] Unexpected error:', error);
      throw error;
    }
  }

  /**
   * Get orders for a specific user
   */
  async getUserOrders(
    userId: string,
    params: { page?: number; pageSize?: number; status?: string },
  ) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
    const where: any = {
      userId,
      isDeleted: false
    };
    if (params.status) where.status = params.status;

    return this.prisma
      .$transaction([
        this.prisma.orders.count({ where }),
        this.prisma.orders.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            order_items: {
              include: {
                products: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    imageUrl: true,
                    inventory: {
                      select: {
                        stock: true,
                      },
                    },
                  },
                },
              },
            },
            payments: {
              select: {
                id: true,
                amountCents: true,
                status: true,
                provider: true,
                createdAt: true,
              },
            },
          },
        }),
      ])
      .then(([total, items]) => ({
        total,
        page,
        pageSize,
        items: items.map(order => this.transformOrderForResponse({
          id: order.id,
          orderNo: order.orderNo,
          status: order.status,
          totalCents: order.totalCents,
          shippingAddress: order.shippingAddress,
          shippingName: order.shippingName,
          shippingPhone: order.shippingPhone,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: order.order_items.map(item => ({
            id: item.id,
            productId: item.productId,
            product: item.products,
            name: item.name,
            quantity: item.quantity,
            price: item.unitPrice,
            total: Number(item.unitPrice || 0) * item.quantity,
          })),
          payments: order.payments,
        })),
      }));
  }

  /**
   * Get a single order for a specific user (with ownership check)
   */
  async getUserOrder(userId: string, orderId: string) {
    const order = await this.prisma.orders.findFirst({
      where: {
        id: orderId,
        userId,
        isDeleted: false
      },
      include: {
        order_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                slug: true,
                imageUrl: true,
                inventory: {
                  select: {
                    stock: true,
                  },
                },
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            amountCents: true,
            status: true,
            provider: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return this.transformOrderForResponse({
      id: order.id,
      orderNo: order.orderNo,
      status: order.status,
      totalCents: order.totalCents,
      shippingAddress: order.shippingAddress,
      shippingName: order.shippingName,
      shippingPhone: order.shippingPhone,
      shippingNotes: order.shippingNotes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.order_items.map(item => ({
        id: item.id,
        productId: item.productId,
        product: item.products,
        name: item.name,
        quantity: item.quantity,
        price: item.unitPrice,
        total: Number(item.unitPrice || 0) * item.quantity,
      })),
      payments: order.payments,
    });
  }

  /**
   * Transform order response to handle BigInt serialization
   * Converts BigInt values from order_items to numbers
   */
  private transformOrderForResponse(order: any): any {
    if (!order) return order;

    // Deep serialize to handle all BigInt values
    return JSON.parse(
      JSON.stringify(order, (key, value) => {
        // Convert BigInt to string, then to number
        if (typeof value === 'bigint') {
          return Number(value);
        }
        return value;
      }),
    );
  }
}
