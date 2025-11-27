import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { TelegramService } from '../notifications/telegram.service';

@Injectable()
export class InventoryAlertService {
  private readonly logger = new Logger(InventoryAlertService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
  ) {}

  async create(data: {
    productId: string;
    type: string;
    message: string;
    threshold?: number;
    currentStock?: number;
  }) {
    const alert = await this.prisma.inventory_alerts.create({
      data: {
        id: randomUUID(),
        productId: data.productId,
        type: data.type,
        message: data.message,
        threshold: data.threshold,
        currentStock: data.currentStock ?? 0,
        updatedAt: new Date(),
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
            categories: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Send Telegram notification
    try {
      if (data.type === 'OUT_OF_STOCK') {
        await this.telegram.sendOutOfStockAlert({
          name: alert.products?.name,
          sku: alert.products?.sku,
          stock: data.currentStock,
        });
      } else if (data.type === 'LOW_STOCK') {
        await this.telegram.sendLowStockAlert({
          name: alert.products?.name,
          sku: alert.products?.sku,
          stock: data.currentStock,
        });
      }
    } catch (error) {
      this.logger.error('Failed to send inventory alert notification:', error);
    }

    return alert;
  }

  async findAll(
    params: {
      page?: number;
      pageSize?: number;
      productId?: string;
      type?: string;
      isResolved?: boolean;
      startDate?: Date;
      endDate?: Date;
    } = {},
  ) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));

    const where: any = {};

    if (params.productId) {
      where.productId = params.productId;
    }

    if (params.type) {
      where.type = params.type;
    }

    if (params.isResolved !== undefined) {
      where.isResolved = params.isResolved;
    }

    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) {
        where.createdAt.gte = params.startDate;
      }
      if (params.endDate) {
        where.createdAt.lte = params.endDate;
      }
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.inventory_alerts.count({ where }),
      this.prisma.inventory_alerts.findMany({
        where,
        include: {
          products: {
            select: {
              id: true,
              name: true,
              sku: true,
              categories: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      items,
    };
  }

  async findByProduct(productId: string, params: { page?: number; pageSize?: number } = {}) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));

    const [total, items] = await this.prisma.$transaction([
      this.prisma.inventory_alerts.count({
        where: { productId },
      }),
      this.prisma.inventory_alerts.findMany({
        where: { productId },
        include: {
          products: {
            select: {
              id: true,
              name: true,
              sku: true,
              categories: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      items,
    };
  }

  async resolve(id: string, _userId?: string) {
    return this.prisma.inventory_alerts.update({
      where: { id },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });
  }

  async bulkResolve(ids: string[], _userId?: string) {
    return this.prisma.inventory_alerts.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
      },
    });
  }

  async getActiveAlerts() {
    return this.prisma.inventory_alerts.findMany({
      where: {
        isResolved: false,
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
            categories: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAlertSummary() {
    const [totalAlerts, activeAlerts, resolvedAlerts, alertsByType] =
      await this.prisma.$transaction([
        this.prisma.inventory_alerts.count(),
        this.prisma.inventory_alerts.count({ where: { isResolved: false } }),
        this.prisma.inventory_alerts.count({ where: { isResolved: true } }),
        (this.prisma.inventory_alerts.groupBy as any)({
          by: ['type'],
          _count: {
            id: true,
          },
          where: {
            isResolved: false,
          },
          orderBy: {
            type: 'asc',
          },
        }),
      ]);

    return {
      total: totalAlerts,
      active: activeAlerts,
      resolved: resolvedAlerts,
      byType: alertsByType.reduce(
        (acc, item) => {
          acc[item.type] = (item._count as any).id ?? 0;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  async checkAndCreateAlerts() {
    // Get all products with their current stock and inventory settings
    const products = await this.prisma.products.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        maxStock: true,
        inventory: {
          select: {
            stock: true,
            lowStockThreshold: true,
          },
        },
      },
    });

    const alerts = [];

    for (const product of products) {
      const currentStock = product.inventory?.stock ?? 0;
      const lowStockThreshold = product.inventory?.lowStockThreshold;
      const maxStock = product.maxStock;

      // Check low stock alert
      if (lowStockThreshold && currentStock <= lowStockThreshold) {
        const existingAlert = await this.prisma.inventory_alerts.findFirst({
          where: {
            productId: product.id,
            type: 'LOW_STOCK',
            isResolved: false,
          },
        });

        if (!existingAlert) {
          alerts.push(
            await this.create({
              productId: product.id,
              type: 'LOW_STOCK',
              message: `Sản phẩm ${product.name} (${product.sku}) có tồn kho thấp: ${currentStock} <= ${lowStockThreshold}`,
              threshold: lowStockThreshold,
              currentStock: currentStock,
            }),
          );
        }
      }

      // Check out of stock alert
      if (currentStock === 0) {
        const existingAlert = await this.prisma.inventory_alerts.findFirst({
          where: {
            productId: product.id,
            type: 'OUT_OF_STOCK',
            isResolved: false,
          },
        });

        if (!existingAlert) {
          alerts.push(
            await this.create({
              productId: product.id,
              type: 'OUT_OF_STOCK',
              message: `Sản phẩm ${product.name} (${product.sku}) đã hết hàng`,
              currentStock: 0,
            }),
          );
        }
      }

      // Check overstock alert
      if (maxStock && currentStock >= maxStock) {
        const existingAlert = await this.prisma.inventory_alerts.findFirst({
          where: {
            productId: product.id,
            type: 'OVERSTOCK',
            isResolved: false,
          },
        });

        if (!existingAlert) {
          alerts.push(
            await this.create({
              productId: product.id,
              type: 'OVERSTOCK',
              message: `Sản phẩm ${product.name} (${product.sku}) tồn kho quá nhiều: ${currentStock} >= ${maxStock}`,
              threshold: maxStock,
              currentStock: currentStock,
            }),
          );
        }
      }
    }

    return alerts;
  }

  async delete(id: string) {
    return this.prisma.inventory_alerts.delete({
      where: { id },
    });
  }

  async bulkDelete(ids: string[]) {
    return this.prisma.inventory_alerts.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
