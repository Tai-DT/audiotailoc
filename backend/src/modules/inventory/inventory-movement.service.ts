import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryMovementService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: {
      productId: string;
      type: string;
      quantity: number;
      previousStock: number;
      newStock: number;
      reason?: string;
      referenceId?: string;
      referenceType?: string;
      userId?: string;
      notes?: string;
    },
    tx?: any,
  ) {
    const client = tx || this.prisma;
    return client.inventory_movements.create({
      data: {
        id: randomUUID(),
        ...data,
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByProduct(productId: string, params: { page?: number; pageSize?: number } = {}) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));

    const [total, items] = await this.prisma.$transaction([
      this.prisma.inventory_movements.count({
        where: { productId },
      }),
      this.prisma.inventory_movements.findMany({
        where: { productId },
        include: {
          products: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
          users: {
            select: {
              id: true,
              name: true,
              email: true,
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

  async findAll(
    params: {
      page?: number;
      pageSize?: number;
      productId?: string;
      type?: string;
      userId?: string;
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

    if (params.userId) {
      where.userId = params.userId;
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
      this.prisma.inventory_movements.count({ where }),
      this.prisma.inventory_movements.findMany({
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
          users: {
            select: {
              id: true,
              name: true,
              email: true,
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

  async getSummary(productId?: string, startDate?: Date, endDate?: Date) {
    const where: any = {};

    if (productId) {
      where.productId = productId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    const movements = await this.prisma.inventory_movements.findMany({
      where,
      select: {
        type: true,
        quantity: true,
        productId: true,
        products: {
          select: {
            name: true,
            sku: true,
          },
        },
      },
    });

    const summary = {
      totalMovements: movements.length,
      stockIn: 0,
      stockOut: 0,
      adjustments: 0,
      reserved: 0,
      released: 0,
      byProduct: {} as Record<string, any>,
    };

    for (const movement of movements) {
      const qty = movement.quantity;

      switch (movement.type) {
        case 'STOCK_IN':
          summary.stockIn += qty;
          break;
        case 'STOCK_OUT':
          summary.stockOut += qty;
          break;
        case 'ADJUSTMENT':
          summary.adjustments += qty;
          break;
        case 'RESERVED':
          summary.reserved += qty;
          break;
        case 'RELEASED':
          summary.released += qty;
          break;
      }

      const productKey = movement.productId;
      if (!summary.byProduct[productKey]) {
        summary.byProduct[productKey] = {
          productId: movement.productId,
          productName: movement.products.name,
          productSku: movement.products.sku,
          stockIn: 0,
          stockOut: 0,
          adjustments: 0,
          reserved: 0,
          released: 0,
        };
      }

      switch (movement.type) {
        case 'STOCK_IN':
          summary.byProduct[productKey].stockIn += qty;
          break;
        case 'STOCK_OUT':
          summary.byProduct[productKey].stockOut += qty;
          break;
        case 'ADJUSTMENT':
          summary.byProduct[productKey].adjustments += qty;
          break;
        case 'RESERVED':
          summary.byProduct[productKey].reserved += qty;
          break;
        case 'RELEASED':
          summary.byProduct[productKey].released += qty;
          break;
      }
    }

    return summary;
  }
}
