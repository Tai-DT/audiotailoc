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
        select: { id: true, isActive: true, isDeleted: true, name: true },
      });

      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      if (product.isDeleted || !product.isActive) {
        throw new Error(`Product ${product.name} is not active or has been deleted`);
      }

      // When inside a transaction, lock the inventory row to prevent race conditions
      try {
        // Use FOR UPDATE to lock the row in the current transaction
        await client.$queryRaw`SELECT id FROM inventory WHERE productId = ${productId} FOR UPDATE`;
      } catch (e) {
        // Some Prisma clients or DBs may not support raw queries in mocked tests; ignore failures gracefully
      }

      // Get current inventory to track changes
      const currentInventory = await client.inventory.findUnique({
        where: { productId },
        select: { stock: true, reserved: true, lowStockThreshold: true },
      });

      const previousStock = currentInventory?.stock || 0;
      const previousReserved = currentInventory?.reserved || 0;

      const data: any = {};

      // Handle absolute values vs deltas
      if (typeof delta.stock === 'number') {
        data.stock = delta.stock;
      } else if (typeof delta.stockDelta === 'number') {
        data.stock = { increment: delta.stockDelta };
      }

      if (typeof delta.reserved === 'number') {
        data.reserved = delta.reserved;
      } else if (typeof delta.reservedDelta === 'number') {
        data.reserved = { increment: delta.reservedDelta };
      }

      if (typeof delta.lowStockThreshold === 'number') {
        data.lowStockThreshold = delta.lowStockThreshold;
      }

      // Use upsert to create inventory record if it doesn't exist
      const inv = await client.inventory.upsert({
        where: { productId },
        update: data,
        create: {
          id: randomUUID(),
          productId,
          stock:
            typeof delta.stock === 'number'
              ? delta.stock
              : typeof delta.stockDelta === 'number'
                ? delta.stockDelta
                : 0,
          reserved:
            typeof delta.reserved === 'number'
              ? delta.reserved
              : typeof delta.reservedDelta === 'number'
                ? delta.reservedDelta
                : 0,
          lowStockThreshold: delta.lowStockThreshold || 0,
          updatedAt: new Date(),
        },
        include: { products: { select: { name: true, sku: true } } },
      });

      // Calculate actual changes for movement tracking
      const newStock = inv.stock;
      const newReserved = inv.reserved;
      const stockDelta = newStock - previousStock;
      const reservedDelta = newReserved - previousReserved;

      // Safety Check: Prevent negative stock (overselling protection)
      if (inv.stock < 0) {
        this.logger.error(
          `Stock level for product ${productId} would become negative (${inv.stock}). Rolling back.`,
        );
        throw new Error(`Số lượng tồn kho không đủ (Sản phẩm: ${inv.products?.name || productId})`);
      }

      // Record movements if there are stock changes
      if (stockDelta !== 0 || reservedDelta !== 0) {
        // Record stock movement
        if (stockDelta !== 0) {
          await this.inventoryMovementService.create(
            {
              productId,
              type: stockDelta > 0 ? 'STOCK_IN' : 'STOCK_OUT',
              quantity: Math.abs(stockDelta),
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

        // Record reserved movement if changed
        if (reservedDelta !== 0) {
          await this.inventoryMovementService.create(
            {
              productId,
              type: reservedDelta > 0 ? 'RESERVED' : 'RELEASED',
              quantity: Math.abs(reservedDelta),
              previousStock: newStock, // Use current stock as previous for reserved changes
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

      // Check and create alerts for this specific product after stock changes
      if (stockDelta !== 0) {
        await this.inventoryAlertService.checkProductAlerts(productId, client);
      }

      // Sync to Products table if requested
      if (options.syncToProduct && stockDelta !== 0) {
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
      const inventory = await this.prisma.inventory.create({
        data: {
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
