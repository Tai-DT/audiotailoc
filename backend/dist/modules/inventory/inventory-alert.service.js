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
exports.InventoryAlertService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let InventoryAlertService = class InventoryAlertService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.inventoryAlert.create({
            data: {
                productId: data.productId,
                type: data.type,
                message: data.message,
                threshold: data.threshold,
                currentStock: data.currentStock ?? 0
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
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
        if (params.isResolved !== undefined) {
            where.isResolved = params.isResolved;
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
            this.prisma.inventoryAlert.count({ where }),
            this.prisma.inventoryAlert.findMany({
                where,
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            sku: true,
                            category: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
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
    async findByProduct(productId, params = {}) {
        const page = Math.max(1, Math.floor(params.page ?? 1));
        const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
        const [total, items] = await this.prisma.$transaction([
            this.prisma.inventoryAlert.count({
                where: { productId }
            }),
            this.prisma.inventoryAlert.findMany({
                where: { productId },
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            sku: true,
                            category: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
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
    async resolve(id, _userId) {
        return this.prisma.inventoryAlert.update({
            where: { id },
            data: {
                isResolved: true,
                resolvedAt: new Date()
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true
                    }
                }
            }
        });
    }
    async bulkResolve(ids, _userId) {
        return this.prisma.inventoryAlert.updateMany({
            where: {
                id: { in: ids }
            },
            data: {
                isResolved: true,
                resolvedAt: new Date()
            }
        });
    }
    async getActiveAlerts() {
        return this.prisma.inventoryAlert.findMany({
            where: {
                isResolved: false
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getAlertSummary() {
        const [totalAlerts, activeAlerts, resolvedAlerts, alertsByType] = await this.prisma.$transaction([
            this.prisma.inventoryAlert.count(),
            this.prisma.inventoryAlert.count({ where: { isResolved: false } }),
            this.prisma.inventoryAlert.count({ where: { isResolved: true } }),
            this.prisma.inventoryAlert.groupBy({
                by: ['type'],
                _count: {
                    id: true
                },
                where: {
                    isResolved: false
                },
                orderBy: {
                    type: 'asc'
                }
            })
        ]);
        return {
            total: totalAlerts,
            active: activeAlerts,
            resolved: resolvedAlerts,
            byType: alertsByType.reduce((acc, item) => {
                acc[item.type] = item._count.id ?? 0;
                return acc;
            }, {})
        };
    }
    async checkAndCreateAlerts() {
        const products = await this.prisma.product.findMany({
            select: {
                id: true,
                name: true,
                sku: true,
                stockQuantity: true,
                maxStock: true,
                inventory: {
                    select: {
                        lowStockThreshold: true
                    }
                }
            }
        });
        const alerts = [];
        for (const product of products) {
            const currentStock = product.stockQuantity;
            const lowStockThreshold = product.inventory?.lowStockThreshold;
            const maxStock = product.maxStock;
            if (lowStockThreshold && currentStock <= lowStockThreshold) {
                const existingAlert = await this.prisma.inventoryAlert.findFirst({
                    where: {
                        productId: product.id,
                        type: 'LOW_STOCK',
                        isResolved: false
                    }
                });
                if (!existingAlert) {
                    alerts.push(await this.create({
                        productId: product.id,
                        type: 'LOW_STOCK',
                        message: `Sản phẩm ${product.name} (${product.sku}) có tồn kho thấp: ${currentStock} <= ${lowStockThreshold}`,
                        threshold: lowStockThreshold,
                        currentStock: currentStock
                    }));
                }
            }
            if (currentStock === 0) {
                const existingAlert = await this.prisma.inventoryAlert.findFirst({
                    where: {
                        productId: product.id,
                        type: 'OUT_OF_STOCK',
                        isResolved: false
                    }
                });
                if (!existingAlert) {
                    alerts.push(await this.create({
                        productId: product.id,
                        type: 'OUT_OF_STOCK',
                        message: `Sản phẩm ${product.name} (${product.sku}) đã hết hàng`,
                        currentStock: 0
                    }));
                }
            }
            if (maxStock && currentStock >= maxStock) {
                const existingAlert = await this.prisma.inventoryAlert.findFirst({
                    where: {
                        productId: product.id,
                        type: 'OVERSTOCK',
                        isResolved: false
                    }
                });
                if (!existingAlert) {
                    alerts.push(await this.create({
                        productId: product.id,
                        type: 'OVERSTOCK',
                        message: `Sản phẩm ${product.name} (${product.sku}) tồn kho quá nhiều: ${currentStock} >= ${maxStock}`,
                        threshold: maxStock,
                        currentStock: currentStock
                    }));
                }
            }
        }
        return alerts;
    }
    async delete(id) {
        return this.prisma.inventoryAlert.delete({
            where: { id }
        });
    }
    async bulkDelete(ids) {
        return this.prisma.inventoryAlert.deleteMany({
            where: {
                id: { in: ids }
            }
        });
    }
};
exports.InventoryAlertService = InventoryAlertService;
exports.InventoryAlertService = InventoryAlertService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryAlertService);
//# sourceMappingURL=inventory-alert.service.js.map