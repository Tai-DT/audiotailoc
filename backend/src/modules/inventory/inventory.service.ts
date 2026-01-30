import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryMovementService } from './inventory-movement.service';
import { InventoryAlertService } from './inventory-alert.service';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryMovementService: InventoryMovementService,
    private readonly inventoryAlertService: InventoryAlertService,
  ) {}

  async list(params: { page?: number; pageSize?: number; lowStockOnly?: boolean }) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(10000, Math.max(1, Math.floor(params.pageSize ?? 20)));
    // Prisma doesn't support field-to-field comparisons in filters. We'll fetch
    // with a coarse where and filter in memory when lowStockOnly is requested.
    const baseWhere: any = params.lowStockOnly ? { lowStockThreshold: { gt: 0 } } : {};

    const all = await this.prisma.inventory.findMany({
      where: baseWhere,
      include: {
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
            slug: true,
            priceCents: true,
            imageUrl: true,
            isActive: true,
            isDeleted: true,
            categoryId: true,
            categories: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const filtered = params.lowStockOnly
      ? all.filter(i => i.lowStockThreshold > 0 && i.stock <= i.lowStockThreshold)
      : all;
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize).map(item => ({
      ...item,
      product: item.products
        ? {
            ...item.products,
            priceCents: item.products.priceCents ? Number(item.products.priceCents) : null,
          }
        : null,
    }));
    return { total, page, pageSize, items };
  }

  async create(productId: string, data: { stock?: number; lowStockThreshold?: number }) {
    return this.prisma.inventory.create({
      data: {
        id: randomUUID(),
        productId,
        stock: data.stock || 0,
        reserved: 0,
        lowStockThreshold: data.lowStockThreshold || 0,
        updatedAt: new Date(),
      },
    });
  }

  async adjust(
    productId: string,
    delta: {
      stockDelta?: number;
      reservedDelta?: number;
      lowStockThreshold?: number;
      stock?: number;
      reserved?: number;
      reason?: string;
      referenceId?: string;
      referenceType?: string;
      userId?: string;
      notes?: string;
    },
    options: { syncToProduct?: boolean } = { syncToProduct: true },
    tx?: any,
  ) {
    const executeAdjustment = async (client: any) => {
      // First check if product exists and is active
      const product = await client.products.findUnique({
        where: { id: productId },
        select: { id: true, isActive: true, isDeleted: true, name: true, stockQuantity: true },
      });

      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      if (product.isDeleted || !product.isActive) {
        throw new Error(`Product ${product.name} is not active or has been deleted`);
      }

      // Prepare deltas - ensure they are numbers or 0
      const stockDeltaValue = delta.stockDelta || 0;
      const reservedDeltaValue = delta.reservedDelta || 0;

      // Prepare increment/absolute update data
      const updateData: any = { updatedAt: new Date() };
      if (typeof delta.stock === 'number') {
        updateData.stock = delta.stock;
      } else if (stockDeltaValue !== 0) {
        updateData.stock = { increment: stockDeltaValue };
      }

      if (typeof delta.reserved === 'number') {
        updateData.reserved = delta.reserved;
      } else if (reservedDeltaValue !== 0) {
        updateData.reserved = { increment: reservedDeltaValue };
      }

      if (typeof delta.lowStockThreshold === 'number') {
        updateData.lowStockThreshold = delta.lowStockThreshold;
      }

      // Use a single upsert for atomicity. If it fails due to race, we'll catch and retry once.
      let inv: any;
      try {
        inv = await client.inventory.upsert({
          where: { productId },
          update: updateData,
          create: {
            id: randomUUID(),
            productId,
            stock:
              typeof delta.stock === 'number'
                ? delta.stock
                : (product.stockQuantity || 0) + stockDeltaValue,
            reserved: typeof delta.reserved === 'number' ? delta.reserved : reservedDeltaValue,
            lowStockThreshold: delta.lowStockThreshold || 0,
            updatedAt: new Date(),
          },
          include: { products: { select: { name: true, sku: true } } },
        });
      } catch (err) {
        // If we hit a unique constraint race (P2002), retry exactly once as it should now exist
        if (err.code === 'P2002') {
          this.logger.warn(`Race condition detected for product ${productId}, retrying adjust...`);
          inv = await client.inventory.upsert({
            where: { productId },
            update: updateData,
            create: {
              id: randomUUID(),
              productId,
              stock:
                typeof delta.stock === 'number'
                  ? delta.stock
                  : (product.stockQuantity || 0) + stockDeltaValue,
              reserved: typeof delta.reserved === 'number' ? delta.reserved : reservedDeltaValue,
              lowStockThreshold: delta.lowStockThreshold || 0,
              updatedAt: new Date(),
            },
            include: { products: { select: { name: true, sku: true } } },
          });
        } else {
          throw err;
        }
      }

      // Calculate previous values for movement tracking
      // Note: If an absolute value was set, we don't know the exact delta unless we fetch before.
      // But for most operations (like orders), we use deltas.
      const newStock = inv.stock;
      const _newReserved = inv.reserved;
      const actualStockDelta = typeof delta.stock === 'number' ? 0 : stockDeltaValue;
      const actualReservedDelta = typeof delta.reserved === 'number' ? 0 : reservedDeltaValue;
      const previousStock = newStock - actualStockDelta;

      // Safety Check: Prevent negative stock (overselling protection)
      if (inv.stock < 0) {
        this.logger.error(
          `Stock level for product ${productId} would become negative (${inv.stock}). Rolling back.`,
        );
        throw new Error(`Số lượng tồn kho không đủ (Sản phẩm: ${inv.products?.name || productId})`);
      }

      // Record movements if there were changes
      if (actualStockDelta !== 0 || actualReservedDelta !== 0) {
        if (actualStockDelta !== 0) {
          await this.inventoryMovementService.create(
            {
              productId,
              type: actualStockDelta > 0 ? 'STOCK_IN' : 'STOCK_OUT',
              quantity: Math.abs(actualStockDelta),
              previousStock,
              newStock,
              reason: delta.reason || 'Manual adjustment',
              referenceId: delta.referenceId,
              referenceType: delta.referenceType,
              userId: delta.userId,
              notes: delta.notes,
            },
            client,
          );
        }

        if (actualReservedDelta !== 0) {
          await this.inventoryMovementService.create(
            {
              productId,
              type: actualReservedDelta > 0 ? 'RESERVED' : 'RELEASED',
              quantity: Math.abs(actualReservedDelta),
              previousStock: newStock,
              newStock,
              reason: delta.reason || 'Reservation adjustment',
              referenceId: delta.referenceId,
              referenceType: delta.referenceType,
              userId: delta.userId,
              notes: delta.notes,
            },
            client,
          );
        }
      }

      // Check and create alerts
      if (actualStockDelta !== 0) {
        await this.inventoryAlertService.checkProductAlerts(productId, client);
      }

      // Sync to Products table
      if (options.syncToProduct && actualStockDelta !== 0) {
        await client.products.update({
          where: { id: productId },
          data: { stockQuantity: newStock },
        });
      }

      return inv;
    };

    if (tx) {
      return executeAdjustment(tx);
    } else {
      return this.prisma.$transaction(async pTx => {
        return executeAdjustment(pTx);
      });
    }
  }

  async delete(productId: string) {
    // Check if inventory exists
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
      include: { products: { select: { name: true, sku: true } } },
    });

    if (!inventory) {
      throw new Error(`Inventory record for product ${productId} not found`);
    }

    // Delete the inventory record
    await this.prisma.inventory.delete({
      where: { productId },
    });

    return {
      message: 'Inventory deleted successfully',
      productId,
      productName: inventory.products.name,
      sku: inventory.products.sku,
    };
  }

  async syncWithProducts() {
    // Find all products that should have inventory but don't
    const productsWithoutInventory = await this.prisma.products.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        inventory: null,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stockQuantity: true,
      },
    });

    // Create inventory records for products that don't have them
    const createdInventories = [];
    for (const product of productsWithoutInventory) {
      // Use upsert instead of create to be safe against race conditions
      const inventory = await this.prisma.inventory.upsert({
        where: { productId: product.id },
        update: {}, // No changes needed if already exists
        create: {
          id: randomUUID(),
          productId: product.id,
          stock: product.stockQuantity || 0,
          reserved: 0,
          lowStockThreshold: 0,
          updatedAt: new Date(),
        },
        include: { products: { select: { name: true, sku: true } } },
      });
      createdInventories.push(inventory);
    }

    // Find inventory records for deleted/inactive products
    const orphanedInventories = await this.prisma.inventory.findMany({
      where: {
        products: {
          OR: [{ isDeleted: true }, { isActive: false }],
        },
      },
      include: { products: { select: { name: true, sku: true, isDeleted: true, isActive: true } } },
    });

    return {
      syncedProducts: createdInventories.length,
      orphanedInventoriesCount: orphanedInventories.length,
      createdInventories,
      orphanedInventoriesList: orphanedInventories,
    };
  }

  /**
   * ✅ Sync stock quantities between Inventory and Products tables
   * This ensures both tables have matching stock values
   */
  async syncStockQuantities() {
    // Get all inventory records with their products
    const inventoryRecords = await this.prisma.inventory.findMany({
      where: {
        products: {
          isDeleted: false,
        },
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            stockQuantity: true,
          },
        },
      },
    });

    const syncResults = {
      checked: 0,
      synced: 0,
      mismatches: [] as {
        productId: string;
        productName: string;
        inventoryStock: number;
        productStock: number;
      }[],
    };

    for (const inv of inventoryRecords) {
      syncResults.checked++;

      // Check if inventory.stock differs from products.stockQuantity
      const inventoryStock = inv.stock;
      const productStock = inv.products?.stockQuantity || 0;

      if (inventoryStock !== productStock) {
        syncResults.mismatches.push({
          productId: inv.productId,
          productName: inv.products?.name || 'Unknown',
          inventoryStock,
          productStock,
        });

        // Use inventory as source of truth and update products
        await this.prisma.products.update({
          where: { id: inv.productId },
          data: { stockQuantity: inventoryStock },
        });

        syncResults.synced++;
      }
    }

    return syncResults;
  }

  /**
   * ✅ Get stock discrepancies between Inventory and Products tables
   */
  async getStockDiscrepancies() {
    const inventoryRecords = await this.prisma.inventory.findMany({
      where: {
        products: {
          isDeleted: false,
        },
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
            stockQuantity: true,
          },
        },
      },
    });

    const discrepancies = inventoryRecords
      .filter(inv => inv.stock !== (inv.products?.stockQuantity || 0))
      .map(inv => ({
        productId: inv.productId,
        productName: inv.products?.name,
        sku: inv.products?.sku,
        inventoryStock: inv.stock,
        productStock: inv.products?.stockQuantity || 0,
        difference: inv.stock - (inv.products?.stockQuantity || 0),
      }));

    return {
      totalProducts: inventoryRecords.length,
      discrepancyCount: discrepancies.length,
      discrepancies,
    };
  }
}
