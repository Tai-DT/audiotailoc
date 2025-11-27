import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class InventoryReportService {
  constructor(private readonly prisma: PrismaService) {}

  async generateStockReport(filters?: {
    categoryId?: string;
    lowStockOnly?: boolean;
    outOfStockOnly?: boolean;
  }) {
    const where: any = {};

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.lowStockOnly) {
      // Since we can't easily compare two fields in Prisma where clause directly in this version,
      // we'll filter in memory or use raw query if performance is critical.
      // For now, let's fetch and filter.
    }

    if (filters?.outOfStockOnly) {
      where.inventory = { stock: 0 };
    }

    let products = await this.prisma.products.findMany({
      where,
      select: {
        id: true,
        name: true,
        sku: true,
        maxStock: true,
        categoryId: true,
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
        inventory: {
          select: {
            lowStockThreshold: true,
            stock: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    if (filters?.lowStockOnly) {
      products = products.filter(
        p =>
          p.inventory?.lowStockThreshold &&
          (p.inventory?.stock ?? 0) <= p.inventory.lowStockThreshold,
      );
    }

    const report = {
      totalProducts: products.length,
      totalStockValue: products.reduce((sum, product) => sum + (product.inventory?.stock ?? 0), 0),
      lowStockProducts: products.filter(
        p =>
          p.inventory?.lowStockThreshold &&
          (p.inventory?.stock ?? 0) <= p.inventory.lowStockThreshold,
      ).length,
      outOfStockProducts: products.filter(p => (p.inventory?.stock ?? 0) === 0).length,
      overstockProducts: products.filter(p => p.maxStock && (p.inventory?.stock ?? 0) >= p.maxStock)
        .length,
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        currentStock: product.inventory?.stock ?? 0,
        lowStockThreshold: product.inventory?.lowStockThreshold || null,
        maxStock: product.maxStock,
        category: product.categories?.name,
        status: this.getStockStatus(product),
      })),
    };

    return report;
  }

  async generateMovementReport(filters?: {
    productId?: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
  }) {
    const where: any = {};

    if (filters?.productId) {
      where.productId = filters.productId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const movements = await this.prisma.inventory_movements.findMany({
      where,
      select: {
        id: true,
        type: true,
        quantity: true,
        previousStock: true,
        newStock: true,
        reason: true,
        referenceId: true,
        referenceType: true,
        notes: true,
        createdAt: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    const summary = {
      totalMovements: movements.length,
      totalStockIn: movements
        .filter(m => m.type === 'STOCK_IN' || m.type === 'ADJUSTMENT_IN')
        .reduce((sum, m) => sum + m.quantity, 0),
      totalStockOut: movements
        .filter(m => m.type === 'STOCK_OUT' || m.type === 'ADJUSTMENT_OUT' || m.type === 'SALE')
        .reduce((sum, m) => sum + m.quantity, 0),
      movementsByType: this.groupMovementsByType(movements),
      movements: movements,
    };

    return summary;
  }

  async generateAlertReport(filters?: {
    type?: string;
    isResolved?: boolean;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.isResolved !== undefined) {
      where.isResolved = filters.isResolved;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const alerts = await this.prisma.inventory_alerts.findMany({
      where,
      select: {
        id: true,
        type: true,
        message: true,
        threshold: true,
        currentStock: true,
        isResolved: true,
        resolvedAt: true,
        createdAt: true,
        updatedAt: true,
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const summary = {
      totalAlerts: alerts.length,
      activeAlerts: alerts.filter(a => !a.isResolved).length,
      resolvedAlerts: alerts.filter(a => a.isResolved).length,
      alertsByType: this.groupAlertsByType(alerts),
      alerts: alerts,
    };

    return summary;
  }

  private getStockStatus(product: any): string {
    const stock = product.inventory?.stock ?? 0;
    const _lowThreshold = null;
    const maxStock = product.maxStock;

    if (stock === 0) return 'OUT_OF_STOCK';
    if (maxStock && stock >= maxStock) return 'OVERSTOCK';
    return 'NORMAL';
  }

  private groupMovementsByType(movements: any[]): Record<string, number> {
    return movements.reduce((acc, movement) => {
      acc[movement.type] = (acc[movement.type] || 0) + 1;
      return acc;
    }, {});
  }

  private groupAlertsByType(alerts: any[]): Record<string, number> {
    return alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {});
  }
}
