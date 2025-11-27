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
var InventoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
let InventoryService = InventoryService_1 = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(InventoryService_1.name);
    }
    async list(params) {
        const { page = 1, pageSize = 20, lowStockOnly } = params;
        const skip = (page - 1) * pageSize;
        const where = {};
        if (lowStockOnly) {
            where.stock = {
                lte: this.prisma.inventory.fields.lowStockThreshold,
            };
        }
        const [items, total] = await Promise.all([
            this.prisma.inventory.findMany({
                where,
                skip,
                take: pageSize,
                include: {
                    products: true,
                },
                orderBy: {
                    stock: 'asc',
                },
            }),
            this.prisma.inventory.count({ where }),
        ]);
        return {
            items,
            meta: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }
    async getInventoryStatus(productId) {
        return this.prisma.inventory.findUnique({
            where: { productId },
        });
    }
    async adjust(productId, dto) {
        return this.updateInventory(productId, {
            quantity: dto.stock,
            reserved: dto.reserved,
            lowStockThreshold: dto.lowStockThreshold
        });
    }
    async delete(productId) {
        return this.prisma.inventory.delete({
            where: { productId }
        });
    }
    async updateInventory(productId, updateDto) {
        const { quantity, reserved, lowStockThreshold } = updateDto;
        return this.prisma.$transaction(async (tx) => {
            const product = await tx.products.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
            }
            const currentInventory = await tx.inventory.findUnique({
                where: { productId },
            });
            const oldQuantity = currentInventory?.stock || 0;
            const inventory = await tx.inventory.upsert({
                where: { productId },
                update: {
                    stock: quantity,
                    reserved,
                    lowStockThreshold,
                    updatedAt: new Date(),
                },
                create: {
                    id: (0, crypto_1.randomUUID)(),
                    products: { connect: { id: productId } },
                    stock: quantity || 0,
                    reserved: reserved || 0,
                    lowStockThreshold: lowStockThreshold || 5,
                    updatedAt: new Date(),
                },
            });
            if (quantity !== undefined) {
                const diff = quantity - oldQuantity;
                if (diff !== 0) {
                    await tx.inventory_movements.create({
                        data: {
                            id: (0, crypto_1.randomUUID)(),
                            products: { connect: { id: productId } },
                            type: diff > 0 ? 'IN' : 'OUT',
                            quantity: Math.abs(diff),
                            previousStock: oldQuantity,
                            newStock: quantity,
                            reason: 'Manual Adjustment',
                        },
                    });
                }
            }
            return inventory;
        });
    }
    async recordMovement(dto) {
        return this.prisma.$transaction(async (tx) => {
            const inventory = await tx.inventory.findUnique({
                where: { id: dto.inventoryId },
            });
            if (!inventory) {
                throw new common_1.NotFoundException(`Inventory record ${dto.inventoryId} not found`);
            }
            let newQuantity = inventory.stock;
            if (dto.type === 'IN') {
                newQuantity += dto.quantity;
            }
            else {
                if (inventory.stock < dto.quantity) {
                    throw new common_1.BadRequestException('Insufficient stock');
                }
                newQuantity -= dto.quantity;
            }
            await tx.inventory.update({
                where: { id: dto.inventoryId },
                data: { stock: newQuantity },
            });
            return tx.inventory_movements.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    products: { connect: { id: inventory.productId } },
                    type: dto.type,
                    quantity: dto.quantity,
                    previousStock: inventory.stock,
                    newStock: newQuantity,
                    reason: dto.reason,
                    notes: dto.notes,
                },
            });
        });
    }
    async checkLowStock() {
        return this.prisma.inventory.findMany({
            where: {
                stock: {
                    lte: this.prisma.inventory.fields.lowStockThreshold,
                },
            },
            include: {
                products: true,
            },
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = InventoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map