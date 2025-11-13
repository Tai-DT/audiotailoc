import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryMovementService } from './inventory-movement.service';
import { InventoryAlertService } from './inventory-alert.service';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryMovementService: InventoryMovementService,
    private readonly inventoryAlertService: InventoryAlertService,
  ) {}

  async list(params: { page?: number; pageSize?: number; lowStockOnly?: boolean }) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
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
                slug: true
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' } 
    });
    
    const filtered = params.lowStockOnly
      ? all.filter((i) => i.lowStockThreshold > 0 && i.stock <= i.lowStockThreshold)
      : all;
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize).map(item => ({
      ...item,
      product: item.products ? {
        ...item.products,
        priceCents: item.products.priceCents ? Number(item.products.priceCents) : null
      } : null
    }));
    return { total, page, pageSize, items };
  }

  async adjust(productId: string, delta: { stockDelta?: number; reservedDelta?: number; lowStockThreshold?: number; stock?: number; reserved?: number; reason?: string; referenceId?: string; referenceType?: string; userId?: string; notes?: string }) {
    // First check if product exists and is active
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, isActive: true, isDeleted: true, name: true }
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    if (product.isDeleted || !product.isActive) {
      throw new Error(`Product ${product.name} is not active or has been deleted`);
    }

    // Get current inventory to track changes
    const currentInventory = await this.prisma.inventory.findUnique({
      where: { productId },
      select: { stock: true, reserved: true, lowStockThreshold: true }
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
    const inv = await this.prisma.inventory.upsert({
      where: { productId },
      update: data,
      create: {
        id: randomUUID(),
        productId,
        stock: typeof delta.stock === 'number' ? delta.stock : (typeof delta.stockDelta === 'number' ? delta.stockDelta : 0),
        reserved: typeof delta.reserved === 'number' ? delta.reserved : (typeof delta.reservedDelta === 'number' ? delta.reservedDelta : 0),
        lowStockThreshold: delta.lowStockThreshold || 0,
        updatedAt: new Date()
      },
      include: { products: { select: { name: true, sku: true } } }
    });

    // Calculate actual changes for movement tracking
    const newStock = inv.stock;
    const newReserved = inv.reserved;
    const stockDelta = newStock - previousStock;
    const reservedDelta = newReserved - previousReserved;

    // Record movements if there are stock changes
    if (stockDelta !== 0 || reservedDelta !== 0) {
      // Record stock movement
      if (stockDelta !== 0) {
        await this.inventoryMovementService.create({
          productId,
          type: stockDelta > 0 ? 'IN' : 'OUT',
          quantity: Math.abs(stockDelta),
          previousStock,
          newStock,
          reason: delta.reason || 'Manual adjustment',
          referenceId: delta.referenceId,
          referenceType: delta.referenceType,
          userId: delta.userId,
          notes: delta.notes
        });
      }

      // Record reserved movement if changed
      if (reservedDelta !== 0) {
        await this.inventoryMovementService.create({
          productId,
          type: reservedDelta > 0 ? 'RESERVED' : 'UNRESERVED',
          quantity: Math.abs(reservedDelta),
          previousStock: newStock, // Use current stock as previous for reserved changes
          newStock,
          reason: delta.reason || 'Reservation adjustment',
          referenceId: delta.referenceId,
          referenceType: delta.referenceType,
          userId: delta.userId,
          notes: delta.notes
        });
      }
    }

    // Check and create alerts for this product after stock changes
    if (stockDelta !== 0) {
      try {
        await this.inventoryAlertService.checkAndCreateAlerts();
      } catch (error) {
        // Log error but don't fail the adjustment
        console.error('Failed to check and create alerts:', error);
      }
    }

    return inv;
  }

  async delete(productId: string) {
    // Check if inventory exists
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
      include: { products: { select: { name: true, sku: true } } }
    });

    if (!inventory) {
      throw new Error(`Inventory record for product ${productId} not found`);
    }

    // Delete the inventory record
    await this.prisma.inventory.delete({
      where: { productId }
    });

    return { 
      message: 'Inventory deleted successfully',
      productId,
      productName: inventory.products.name,
      sku: inventory.products.sku
    };
  }

  async syncWithProducts() {
    // Find all products that should have inventory but don't
    const productsWithoutInventory = await this.prisma.products.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        inventory: null
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stockQuantity: true
      }
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
          updatedAt: new Date()
        },
        include: { products: { select: { name: true, sku: true } } }
      });
      createdInventories.push(inventory);
    }

    // Find inventory records for deleted/inactive products
    const orphanedInventories = await this.prisma.inventory.findMany({
      where: {
        products: {
          OR: [
            { isDeleted: true },
            { isActive: false }
          ]
        }
      },
      include: { products: { select: { name: true, sku: true, isDeleted: true, isActive: true } } }
    });

    return {
      syncedProducts: createdInventories.length,
      orphanedInventoriesCount: orphanedInventories.length,
      createdInventories,
      orphanedInventoriesList: orphanedInventories
    };
  }
}
