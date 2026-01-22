import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryAlertService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: {
      productId: string;
      type: string;
      message: string;
      threshold?: number;
      currentStock?: number;
    },
    tx?: any,
  ) {
    const client = tx || this.prisma;
    return client.inventory_alerts.create({
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

  async checkAndCreateAlerts(tx?: any) {
    // Legacy support: check all products (could be slow)
    const client = tx || this.prisma;
    const products = await client.products.findMany({
      select: { id: true },
    });

    const results = [];
    for (const p of products) {
      const alerts = await this.checkProductAlerts(p.id, tx);
      if (alerts.length > 0) results.push(...alerts);
    }
    return results;
  }

  /**
   * ✅ OPTIMIZED: Check alerts for a single product efficiently
   */
  async checkProductAlerts(productId: string, tx?: any) {
    const client = tx || this.prisma;
    const product = await client.products.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        sku: true,
        stockQuantity: true,
        maxStock: true,
        inventory: {
          select: {
            lowStockThreshold: true,
          },
        },
      },
    });

    if (!product) return [];

    const currentStock = product.stockQuantity;
    const lowStockThreshold = product.inventory?.lowStockThreshold;
    const maxStock = product.maxStock;
    const newAlerts = [];

    // 1. AUTO-RESOLVE
    if (lowStockThreshold && currentStock > lowStockThreshold) {
      await client.inventory_alerts.updateMany({
        where: {
          productId: product.id,
          type: { in: ['LOW_STOCK', 'OUT_OF_STOCK'] },
          isResolved: false,
        },
        data: {
          isResolved: true,
          resolvedAt: new Date(),
          message: `[Hệ thống] Tồn kho phục hồi: ${currentStock} > ${lowStockThreshold}`,
        },
      });
    }

    if (maxStock && currentStock < maxStock) {
      await client.inventory_alerts.updateMany({
        where: {
          productId: product.id,
          type: 'OVERSTOCK',
          isResolved: false,
        },
        data: {
          isResolved: true,
          resolvedAt: new Date(),
          message: `[Hệ thống] Tồn kho an toàn: ${currentStock} < ${maxStock}`,
        },
      });
    }

    // 2. CREATE ALERTS
    if (currentStock === 0) {
      const existing = await client.inventory_alerts.findFirst({
        where: { productId: product.id, type: 'OUT_OF_STOCK', isResolved: false },
      });
      if (!existing) {
        await client.inventory_alerts.updateMany({
          where: { productId: product.id, type: 'LOW_STOCK', isResolved: false },
          data: { isResolved: true, resolvedAt: new Date() },
        });
        newAlerts.push(
          await this.create(
            {
              productId: product.id,
              type: 'OUT_OF_STOCK',
              message: `Hết hàng: ${product.name}`,
              currentStock: 0,
            },
            tx,
          ),
        );
      }
    } else if (lowStockThreshold && currentStock <= lowStockThreshold) {
      const existing = await client.inventory_alerts.findFirst({
        where: { productId: product.id, type: 'LOW_STOCK', isResolved: false },
      });
      if (!existing) {
        newAlerts.push(
          await this.create(
            {
              productId: product.id,
              type: 'LOW_STOCK',
              message: `Sắp hết hàng: ${product.name} (${currentStock})`,
              threshold: lowStockThreshold,
              currentStock,
            },
            tx,
          ),
        );
      }
    }

    if (maxStock && currentStock >= maxStock) {
      const existing = await client.inventory_alerts.findFirst({
        where: { productId: product.id, type: 'OVERSTOCK', isResolved: false },
      });
      if (!existing) {
        newAlerts.push(
          await this.create(
            {
              productId: product.id,
              type: 'OVERSTOCK',
              message: `Quá định mức: ${product.name} (${currentStock})`,
              threshold: maxStock,
              currentStock,
            },
            tx,
          ),
        );
      }
    }

    return newAlerts;
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
