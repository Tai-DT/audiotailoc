import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryMovementService } from './inventory-movement.service';
import { InventoryAlertsService } from './inventory-alert.service';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryMovementService: InventoryMovementService,
    private readonly inventoryAlertsService: InventoryAlertsService,
  ) {}

  private async ensureInventoryRecords() {
    // Find products that don't have inventory records yet
    const productsWithoutInventory = await this.prisma.products.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        inventory: null, // This should work correctly with Prisma's relation filtering
      },
      select: {
        id: true,
        stockQuantity: true,
      },
      take: 500,
    });

    if (productsWithoutInventory.length === 0) {
      console.log('✅ No products need inventory records');
      return;
    }

    console.log(`📦 Creating inventory records for ${productsWithoutInventory.length} products`);

    // Use individual creates instead of createMany to avoid type issues
    let created = 0;
    let skipped = 0;

    for (const product of productsWithoutInventory) {
      try {
        await this.prisma.inventory.create({
          data: {
            productId: product.id,
            stock: product.stockQuantity ?? 0,
            reserved: 0,
            lowStockThreshold: 0,
          } as any,
        });
        created++;
      } catch (createError) {
        // Skip if already exists or other constraint error
        if (createError.message.includes('Unique constraint failed')) {
          skipped++;
        } else {
          console.error(`Error creating inventory for product ${product.id}:`, createError.message);
        }
      }
    }

    console.log(`✅ Created ${created} inventory records, skipped ${skipped} existing records`);
  }

  async list(params: { page?: number; pageSize?: number; lowStockOnly?: boolean }) {
    await this.ensureInventoryRecords();
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
    const offset = (page - 1) * pageSize;

    if (params.lowStockOnly) {
      const countResult = await this.prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(*)::int AS count
        FROM "inventory" i
        INNER JOIN "products" p ON p.id = i."productId"
        WHERE i."lowStockThreshold" > 0
          AND i.stock <= i."lowStockThreshold"
      `;
      const total = countResult[0]?.count ?? 0;

      if (total === 0) {
        return { total: 0, page, pageSize, items: [] };
      }

      const rows = await this.prisma.$queryRaw<Array<{
        id: string;
        productId: string;
        stock: number;
        reserved: number;
        lowStockThreshold: number;
        createdAt: Date;
        updatedAt: Date;
        product: any;
      }>>`
        SELECT
          i.id,
          i."productId",
          i.stock,
          i.reserved,
          i."lowStockThreshold",
          i."createdAt",
          i."updatedAt",
          json_build_object(
            'id', p.id,
            'name', p.name,
            'sku', p.sku,
            'slug', p.slug,
            'priceCents', p."priceCents",
            'imageUrl', p."imageUrl",
            'isActive', p."isActive",
            'isDeleted', p."isDeleted",
            'categoryId', p."categoryId",
            'category', CASE
              WHEN c.id IS NULL THEN NULL
              ELSE json_build_object(
                'id', c.id,
                'name', c.name,
                'slug', c.slug
              )
            END
          ) AS product
        FROM "inventory" i
        INNER JOIN "products" p ON p.id = i."productId"
        LEFT JOIN "categories" c ON c.id = p."categoryId"
        WHERE i."lowStockThreshold" > 0
          AND i.stock <= i."lowStockThreshold"
        ORDER BY i."updatedAt" DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      const items = rows.map(row => ({
        id: row.id,
        productId: row.productId,
        stock: row.stock,
        reserved: row.reserved,
        lowStockThreshold: row.lowStockThreshold,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        product: row.product,
      }));

      return { total, page, pageSize, items };
    }

    const [total, items] = await Promise.all([
      this.prisma.inventory.count({
        where: {
          products: {
            OR: [
              { isDeleted: false },
              { isActive: true }
            ]
          }
        }
      }),
      this.prisma.inventory.findMany({
        skip: offset,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
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
      }),
    ]);

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
        productId,
        stock: typeof delta.stock === 'number' ? delta.stock : (typeof delta.stockDelta === 'number' ? delta.stockDelta : 0),
        reserved: typeof delta.reserved === 'number' ? delta.reserved : (typeof delta.reservedDelta === 'number' ? delta.reservedDelta : 0),
        lowStockThreshold: delta.lowStockThreshold || 0,
      } as any,
      select: {
        id: true,
        stock: true,
        reserved: true,
        lowStockThreshold: true,
        updatedAt: true,
        products: { select: { name: true, sku: true } }
      }
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
        await this.inventoryAlertsService.checkAndCreateAlerts(productId);
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
          productId: product.id,
          stock: product.stockQuantity || 0,
          reserved: 0,
          lowStockThreshold: 0
        } as any,
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
