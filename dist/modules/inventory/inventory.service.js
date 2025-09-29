"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const inventory_movement_service_1 = require("./inventory-movement.service");
const inventory_alert_service_1 = require("./inventory-alert.service");
let InventoryService = class InventoryService {
    constructor(prisma, inventoryMovementService, inventoryAlertsService) {
        this.prisma = prisma;
        this.inventoryMovementService = inventoryMovementService;
        this.inventoryAlertsService = inventoryAlertsService;
    }
    async ensureInventoryRecords() {
        const productsWithoutInventory = await this.prisma.products.findMany({
            where: {
                isDeleted: false,
                isActive: true,
                inventory: null,
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
                    },
                });
                created++;
            }
            catch (createError) {
                if (createError.message.includes('Unique constraint failed')) {
                    skipped++;
                }
                else {
                    console.error(`Error creating inventory for product ${product.id}:`, createError.message);
                }
            }
        }
        console.log(`✅ Created ${created} inventory records, skipped ${skipped} existing records`);
    }
    async list(params) {
        await this.ensureInventoryRecords();
        const page = Math.max(1, Math.floor(params.page ?? 1));
        const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
        const offset = (page - 1) * pageSize;
        if (params.lowStockOnly) {
            const countResult = await this.prisma.$queryRaw `
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
            const rows = await this.prisma.$queryRaw `
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
    async adjust(productId, delta) {
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
        const currentInventory = await this.prisma.inventory.findUnique({
            where: { productId },
            select: { stock: true, reserved: true, lowStockThreshold: true }
        });
        const previousStock = currentInventory?.stock || 0;
        const previousReserved = currentInventory?.reserved || 0;
        const data = {};
        if (typeof delta.stock === 'number') {
            data.stock = delta.stock;
        }
        else if (typeof delta.stockDelta === 'number') {
            data.stock = { increment: delta.stockDelta };
        }
        if (typeof delta.reserved === 'number') {
            data.reserved = delta.reserved;
        }
        else if (typeof delta.reservedDelta === 'number') {
            data.reserved = { increment: delta.reservedDelta };
        }
        if (typeof delta.lowStockThreshold === 'number') {
            data.lowStockThreshold = delta.lowStockThreshold;
        }
        const inv = await this.prisma.inventory.upsert({
            where: { productId },
            update: data,
            create: {
                productId,
                stock: typeof delta.stock === 'number' ? delta.stock : (typeof delta.stockDelta === 'number' ? delta.stockDelta : 0),
                reserved: typeof delta.reserved === 'number' ? delta.reserved : (typeof delta.reservedDelta === 'number' ? delta.reservedDelta : 0),
                lowStockThreshold: delta.lowStockThreshold || 0,
            },
            select: {
                id: true,
                stock: true,
                reserved: true,
                lowStockThreshold: true,
                updatedAt: true,
                products: { select: { name: true, sku: true } }
            }
        });
        const newStock = inv.stock;
        const newReserved = inv.reserved;
        const stockDelta = newStock - previousStock;
        const reservedDelta = newReserved - previousReserved;
        if (stockDelta !== 0 || reservedDelta !== 0) {
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
            if (reservedDelta !== 0) {
                await this.inventoryMovementService.create({
                    productId,
                    type: reservedDelta > 0 ? 'RESERVED' : 'UNRESERVED',
                    quantity: Math.abs(reservedDelta),
                    previousStock: newStock,
                    newStock,
                    reason: delta.reason || 'Reservation adjustment',
                    referenceId: delta.referenceId,
                    referenceType: delta.referenceType,
                    userId: delta.userId,
                    notes: delta.notes
                });
            }
        }
        if (stockDelta !== 0) {
            try {
                await this.inventoryAlertsService.checkAndCreateAlerts(productId);
            }
            catch (error) {
                console.error('Failed to check and create alerts:', error);
            }
        }
        return inv;
    }
    async delete(productId) {
        const inventory = await this.prisma.inventory.findUnique({
            where: { productId },
            include: { products: { select: { name: true, sku: true } } }
        });
        if (!inventory) {
            throw new Error(`Inventory record for product ${productId} not found`);
        }
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
        const createdInventories = [];
        for (const product of productsWithoutInventory) {
            const inventory = await this.prisma.inventory.create({
                data: {
                    productId: product.id,
                    stock: product.stockQuantity || 0,
                    reserved: 0,
                    lowStockThreshold: 0
                },
                include: { products: { select: { name: true, sku: true } } }
            });
            createdInventories.push(inventory);
        }
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
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        inventory_movement_service_1.InventoryMovementService,
        inventory_alert_service_1.InventoryAlertsService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map