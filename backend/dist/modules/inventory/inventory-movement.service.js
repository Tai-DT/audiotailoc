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
exports.InventoryMovementService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let InventoryMovementService = class InventoryMovementService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.inventory_movements.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                ...data
            },
            include: {
                products: {
                    select: {
                        id: true,
                        name: true,
                        sku: true
                    }
                },
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    }
    async findByProduct(productId, params = {}) {
        const page = Math.max(1, Math.floor(params.page ?? 1));
        const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
        const [total, items] = await this.prisma.$transaction([
            this.prisma.inventory_movements.count({
                where: { productId }
            }),
            this.prisma.inventory_movements.findMany({
                where: { productId },
                include: {
                    products: {
                        select: {
                            id: true,
                            name: true,
                            sku: true
                        }
                    },
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize
            })
        ]);
        return {
            total,
            page,
            pageSize,
            items
        };
    }
    async findAll(params = {}) {
        const page = Math.max(1, Math.floor(params.page ?? 1));
        const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
        const where = {};
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
                                    name: true
                                }
                            }
                        }
                    },
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize
            })
        ]);
        return {
            total,
            page,
            pageSize,
            items
        };
    }
    async getSummary(productId, startDate, endDate) {
        const where = {};
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
                        sku: true
                    }
                }
            }
        });
        const summary = {
            totalMovements: movements.length,
            stockIn: 0,
            stockOut: 0,
            adjustments: 0,
            reserved: 0,
            released: 0,
            byProduct: {}
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
                    released: 0
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
};
exports.InventoryMovementService = InventoryMovementService;
exports.InventoryMovementService = InventoryMovementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryMovementService);
//# sourceMappingURL=inventory-movement.service.js.map