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
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const inventory_movement_service_1 = require("./inventory-movement.service");
const inventory_alert_service_1 = require("./inventory-alert.service");
let InventoryService = class InventoryService {
    constructor(prisma, inventoryMovementService, inventoryAlertService) {
        this.prisma = prisma;
        this.inventoryMovementService = inventoryMovementService;
        this.inventoryAlertService = inventoryAlertService;
    }
    async list(params) {
        const page = Math.max(1, Math.floor(params.page ?? 1));
        const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
        const baseWhere = params.lowStockOnly ? { lowStockThreshold: { gt: 0 } } : {};
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
                id: (0, crypto_1.randomUUID)(),
                productId,
                stock: typeof delta.stock === 'number' ? delta.stock : (typeof delta.stockDelta === 'number' ? delta.stockDelta : 0),
                reserved: typeof delta.reserved === 'number' ? delta.reserved : (typeof delta.reservedDelta === 'number' ? delta.reservedDelta : 0),
                lowStockThreshold: delta.lowStockThreshold || 0,
                updatedAt: new Date()
            },
            include: { products: { select: { name: true, sku: true } } }
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
                await this.inventoryAlertService.checkAndCreateAlerts();
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
                    id: (0, crypto_1.randomUUID)(),
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
        inventory_alert_service_1.InventoryAlertService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map