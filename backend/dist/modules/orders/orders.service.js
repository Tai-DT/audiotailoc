"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../notifications/mail.service");
const telegram_service_1 = require("../notifications/telegram.service");
const cache_service_1 = require("../caching/cache.service");
const crypto_1 = require("crypto");
const bcrypt = __importStar(require("bcryptjs"));
const inventory_service_1 = require("../inventory/inventory.service");
const allowedTransitions = {
    PENDING: ['PROCESSING', 'CANCELLED', 'COMPLETED'],
    PROCESSING: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
};
const promotions_service_1 = require("../promotions/promotions.service");
let OrdersService = OrdersService_1 = class OrdersService {
    constructor(prisma, mail, telegram, cache, promotionsService, inventoryService) {
        this.prisma = prisma;
        this.mail = mail;
        this.telegram = telegram;
        this.cache = cache;
        this.promotionsService = promotionsService;
        this.inventoryService = inventoryService;
        this.logger = new common_1.Logger(OrdersService_1.name);
    }
    list(params) {
        const page = Math.max(1, Math.floor(params.page ?? 1));
        const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
        const where = { isDeleted: false };
        if (params.status)
            where.status = params.status;
        return this.prisma
            .$transaction([
            this.prisma.orders.count({ where }),
            this.prisma.orders.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: {
                    users: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    order_items: {
                        include: {
                            products: {
                                select: {
                                    name: true,
                                    slug: true,
                                    inventory: {
                                        select: {
                                            stock: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }),
        ])
            .then(([total, items]) => ({
            total,
            page,
            pageSize,
            items: items.map(order => ({
                id: order.id,
                orderNumber: order.orderNo,
                customerName: order.users?.name || 'N/A',
                customerEmail: order.users?.email || 'N/A',
                totalAmount: order.totalCents,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                items: order.order_items.map(item => ({
                    id: item.id,
                    productId: item.productId,
                    productSlug: item.products?.slug || null,
                    productName: item.products?.name || item.name || 'Sản phẩm',
                    quantity: item.quantity,
                    price: Number(item.unitPrice || 0),
                    total: Number(item.unitPrice || 0) * item.quantity,
                })),
            })),
        }));
    }
    async get(id) {
        const order = await this.prisma.orders.findFirst({
            where: { id, isDeleted: false },
            include: { order_items: true, payments: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        return this.transformOrderForResponse(order);
    }
    async updateStatus(id, status) {
        const order = await this.get(id);
        const current = (order.status || '').toUpperCase();
        const next = (status || '').toUpperCase();
        const nexts = allowedTransitions[current] || [];
        this.logger.log(`[OrdersService.updateStatus] current=${current} requested=${next} allowed=${JSON.stringify(nexts)}`);
        if (!nexts.includes(next))
            throw new common_1.BadRequestException('Trạng thái không hợp lệ');
        const updated = await this.prisma.$transaction(async (tx) => {
            const updatedOrder = await tx.orders.update({ where: { id }, data: { status: next } });
            if (next === 'CANCELLED' && (current === 'PENDING' || current === 'PROCESSING')) {
                try {
                    const items = await tx.order_items.findMany({
                        where: { orderId: id },
                        include: { products: { select: { id: true, slug: true, name: true } } },
                    });
                    for (const item of items) {
                        let targetProductId = item.productId ?? null;
                        if (!targetProductId && item.products?.id) {
                            targetProductId = item.products.id;
                        }
                        if (!targetProductId && item.products?.slug) {
                            const bySlug = await tx.products.findUnique({
                                where: { slug: item.products.slug },
                            });
                            if (bySlug)
                                targetProductId = bySlug.id;
                        }
                        if (!targetProductId && item.products?.name) {
                            const byName = await tx.products.findFirst({
                                where: { name: item.products.name },
                            });
                            if (byName)
                                targetProductId = byName.id;
                        }
                        if (targetProductId) {
                            const inventory = await tx.inventory.findUnique({
                                where: { productId: targetProductId },
                            });
                            if (inventory) {
                                const previousStock = inventory.stock;
                                const newStock = previousStock + item.quantity;
                                await tx.inventory.update({
                                    where: { productId: targetProductId },
                                    data: {
                                        stock: { increment: item.quantity },
                                        updatedAt: new Date(),
                                    },
                                });
                                await tx.inventory_movements.create({
                                    data: {
                                        id: (0, crypto_1.randomUUID)(),
                                        productId: targetProductId,
                                        type: 'IN',
                                        quantity: item.quantity,
                                        previousStock,
                                        newStock,
                                        reason: `Order cancelled: ${order.orderNumber}`,
                                        referenceId: order.id,
                                        referenceType: 'ORDER',
                                        createdAt: new Date(),
                                    },
                                });
                            }
                        }
                        else {
                            this.logger.warn('[OrdersService.updateStatus] Could not resolve product for order item during cancel restore. Skipped increment.');
                        }
                    }
                }
                catch (error) {
                    this.logger.error('Failed to restore stock on cancellation:', error);
                    throw error;
                }
            }
            return updatedOrder;
        });
        try {
            await this.cache.clearByPrefix('audiotailoc');
        }
        catch (error) {
            this.logger.warn('Failed to clear cache after status update:', error);
        }
        if (order.userId) {
            try {
                const user = await this.prisma.users.findUnique({ where: { id: order.userId } });
                if (user?.email) {
                    const orderWithItems = await this.prisma.orders.findUnique({
                        where: { id: order.id },
                        include: { order_items: true },
                    });
                    if (orderWithItems) {
                        const orderData = {
                            orderNo: order.orderNo,
                            customerName: user.name || user.email,
                            totalAmount: `${(order.totalCents / 100).toLocaleString('vi-VN')} VNĐ`,
                            items: orderWithItems.order_items.map((item) => ({
                                name: item.name || 'Sản phẩm',
                                quantity: item.quantity,
                                price: `${(item.unitPrice / 100).toLocaleString('vi-VN')} VNĐ`,
                            })),
                            status: status,
                        };
                        await this.mail.sendOrderStatusUpdate(user.email, orderData);
                    }
                }
            }
            catch (error) {
                this.logger.error('Failed to send email notification:', error);
            }
        }
        try {
            const orderForTelegram = await this.prisma.orders.findUnique({
                where: { id },
                include: {
                    users: { select: { name: true, email: true, phone: true } },
                    order_items: { include: { products: true } },
                },
            });
            if (orderForTelegram) {
                await this.telegram.sendOrderStatusUpdate({
                    id: orderForTelegram.id,
                    orderNumber: orderForTelegram.orderNo,
                    customerName: orderForTelegram.users?.name || 'N/A',
                    customerEmail: orderForTelegram.users?.email || 'N/A',
                    customerPhone: orderForTelegram.users?.phone,
                    totalAmount: orderForTelegram.totalCents,
                    items: orderForTelegram.order_items,
                    shippingAddress: orderForTelegram.shippingAddress,
                    status: next,
                    createdAt: orderForTelegram.createdAt,
                }, current, next);
            }
        }
        catch (error) {
            this.logger.error('Failed to send Telegram notification:', error);
        }
        return updated;
    }
    async create(orderData) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const orderNo = `ORD${timestamp}${random}`;
        let userId = orderData.userId;
        if (!userId) {
            const uniqueEmail = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@audiotailoc.com`;
            const guestPassword = await bcrypt.hash(`guest-${(0, crypto_1.randomUUID)()}`, 10);
            const guestUser = await this.prisma.users.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    email: uniqueEmail,
                    password: guestPassword,
                    name: orderData.customerName || 'Khách hàng',
                    phone: orderData.customerPhone,
                    role: 'USER',
                    updatedAt: new Date(),
                },
            });
            userId = guestUser.id;
        }
        const items = [];
        let subtotalCents = 0;
        const rawItems = orderData.items || [];
        for (const item of rawItems) {
            const product = await this.prisma.products.findUnique({
                where: { id: item.productId },
                include: { inventory: true },
            });
            if (!product) {
                throw new common_1.BadRequestException(`Product not found: ${item.productId}`);
            }
            const availableStock = product.inventory?.stock || 0;
            if (availableStock < (item.quantity || 1)) {
                throw new common_1.BadRequestException(`Product "${product.name}" is out of stock (Requested: ${item.quantity || 1}, Available: ${availableStock})`);
            }
            const itemData = {
                productId: product.id,
                quantity: item.quantity || 1,
                price: Number(product.priceCents),
                unitPrice: Number(product.priceCents),
                name: product.name,
            };
            items.push(itemData);
            subtotalCents += itemData.price * itemData.quantity;
        }
        if (items.length === 0) {
            throw new common_1.BadRequestException('Order must contain at least one item');
        }
        let discountCents = 0;
        let promotionCode = null;
        if (orderData.promotionCode) {
            const promoResult = await this.promotionsService.validateCode(orderData.promotionCode, subtotalCents);
            if (promoResult.valid) {
                discountCents = promoResult.discount || 0;
                promotionCode = orderData.promotionCode;
            }
        }
        const totalCents = Math.max(0, subtotalCents - discountCents);
        const order = await this.prisma.$transaction(async (tx) => {
            const createdOrder = await tx.orders.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    orderNo,
                    userId,
                    status: 'PENDING',
                    subtotalCents,
                    discountCents,
                    promotionCode,
                    totalCents,
                    shippingAddress: orderData.shippingAddress || null,
                    updatedAt: new Date(),
                },
            });
            if (promotionCode) {
                await this.promotionsService.incrementUsage(promotionCode);
            }
            for (const itemData of items) {
                await tx.order_items.create({
                    data: {
                        id: (0, crypto_1.randomUUID)(),
                        orderId: createdOrder.id,
                        ...itemData,
                        updatedAt: new Date(),
                    },
                });
                try {
                    const inventory = await tx.inventory.findUnique({
                        where: { productId: itemData.productId },
                    });
                    if (inventory) {
                        const previousStock = inventory.stock;
                        const newStock = previousStock - itemData.quantity;
                        await tx.inventory.update({
                            where: { productId: itemData.productId },
                            data: {
                                stock: { decrement: itemData.quantity },
                                updatedAt: new Date(),
                            },
                        });
                        await tx.inventory_movements.create({
                            data: {
                                id: (0, crypto_1.randomUUID)(),
                                productId: itemData.productId,
                                type: 'OUT',
                                quantity: itemData.quantity,
                                previousStock,
                                newStock,
                                reason: `Order created: ${createdOrder.orderNo}`,
                                referenceId: createdOrder.id,
                                referenceType: 'ORDER',
                                createdAt: new Date(),
                            },
                        });
                    }
                    else {
                        this.logger.warn(`[OrdersService.create] Inventory record not found for product ${itemData.productId}`);
                    }
                }
                catch (error) {
                    this.logger.error(`[OrdersService.create] Failed to decrement stock for product ${itemData.productId}: ${error.message || error}`);
                    throw new common_1.BadRequestException(`Failed to update stock for product ${itemData.productId}`);
                }
            }
            return createdOrder;
        });
        const fullOrder = await this.prisma.orders.findUnique({
            where: { id: order.id },
            include: {
                order_items: { include: { products: true } },
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });
        try {
            if (fullOrder) {
                const telegramItems = fullOrder.order_items.map(item => ({
                    ...item,
                    price: Number(item.price),
                    unitPrice: item.unitPrice ? Number(item.unitPrice) : null,
                }));
                await this.telegram.sendOrderNotification({
                    id: fullOrder.id,
                    orderNumber: fullOrder.orderNo,
                    customerName: fullOrder.users?.name || 'N/A',
                    customerEmail: fullOrder.users?.email || 'N/A',
                    customerPhone: fullOrder.users?.phone,
                    totalAmount: fullOrder.totalCents,
                    items: telegramItems,
                    shippingAddress: fullOrder.shippingAddress,
                    status: fullOrder.status,
                    createdAt: fullOrder.createdAt,
                });
            }
        }
        catch (error) {
            this.logger.error('Failed to send Telegram notification:', error);
        }
        const transformedOrder = this.transformOrderForResponse(fullOrder);
        return transformedOrder;
    }
    async update(id, updateData) {
        const order = await this.get(id);
        if (!order)
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        const updatePayload = {};
        if (updateData.customerName || updateData.customerPhone || updateData.customerEmail) {
            const userUpdate = {};
            if (updateData.customerName)
                userUpdate.name = updateData.customerName;
            if (updateData.customerPhone)
                userUpdate.phone = updateData.customerPhone;
            if (updateData.customerEmail)
                userUpdate.email = updateData.customerEmail;
            if (order.userId) {
                await this.prisma.users.update({
                    where: { id: order.userId },
                    data: userUpdate,
                });
            }
        }
        if (updateData.shippingAddress !== undefined) {
            updatePayload.shippingAddress =
                typeof updateData.shippingAddress === 'string'
                    ? updateData.shippingAddress
                    : updateData.shippingAddress
                        ? JSON.stringify(updateData.shippingAddress)
                        : null;
        }
        if (updateData.shippingCoordinates !== undefined) {
            updatePayload.shippingCoordinates = updateData.shippingCoordinates
                ? JSON.stringify(updateData.shippingCoordinates)
                : null;
        }
        if (updateData.notes !== undefined) {
        }
        if (updateData.items) {
            const existingItems = await this.prisma.order_items.findMany({
                where: { orderId: id },
                include: {
                    products: { select: { id: true, name: true, inventory: { select: { stock: true } } } },
                },
            });
            await this.prisma.order_items.deleteMany({ where: { orderId: id } });
            let subtotalCents = 0;
            const items = [];
            for (const item of updateData.items) {
                const itemData = {
                    quantity: item.quantity || 1,
                    unitPrice: item.unitPrice || 0,
                    price: item.unitPrice || 0,
                    name: item.name || 'Sản phẩm',
                };
                try {
                    let product = await this.prisma.products.findUnique({
                        where: { id: item.productId },
                        include: { inventory: true },
                    });
                    if (!product) {
                        product = await this.prisma.products.findUnique({
                            where: { slug: item.productId },
                            include: { inventory: true },
                        });
                    }
                    if (product) {
                        itemData.unitPrice = Number(product.priceCents);
                        itemData.price = Number(product.priceCents);
                        itemData.productId = product.id;
                        if (!item.name && product.name)
                            itemData.name = product.name;
                        const oldItem = existingItems.find(ei => ei.productId === product.id);
                        const oldQuantity = oldItem?.quantity || 0;
                        const newQuantity = itemData.quantity || 1;
                        const quantityDifference = newQuantity - oldQuantity;
                        if (quantityDifference > 0) {
                            const currentStock = product.inventory?.stock || 0;
                            const availableStock = currentStock + oldQuantity;
                            if (availableStock < newQuantity) {
                                throw new common_1.BadRequestException(`Product "${product.name}" has insufficient stock. Requested: ${newQuantity}, Available: ${availableStock}`);
                            }
                        }
                    }
                }
                catch (error) {
                    if (error instanceof common_1.BadRequestException) {
                        throw error;
                    }
                    this.logger.error('Failed to fetch product:', error);
                }
                items.push(itemData);
                subtotalCents += (itemData.unitPrice || 0) * (itemData.quantity || 1);
            }
            const unresolved = items.filter(i => !i.productId);
            if (unresolved.length > 0) {
                throw new common_1.BadRequestException('Sản phẩm không hợp lệ. Vui lòng chọn lại sản phẩm.');
            }
            try {
                await this.prisma.$transaction(async (tx) => {
                    for (const newItem of items) {
                        const oldItem = existingItems.find(ei => ei.productId === newItem.productId);
                        if (oldItem) {
                            const quantityDifference = (newItem.quantity || 1) - (oldItem.quantity || 0);
                            if (quantityDifference !== 0) {
                                const inventory = await tx.inventory.findUnique({
                                    where: { productId: newItem.productId },
                                });
                                if (inventory) {
                                    const previousStock = inventory.stock;
                                    const newStock = previousStock - quantityDifference;
                                    await tx.inventory.update({
                                        where: { productId: newItem.productId },
                                        data: {
                                            stock: { decrement: quantityDifference },
                                            updatedAt: new Date(),
                                        },
                                    });
                                    await tx.inventory_movements.create({
                                        data: {
                                            id: (0, crypto_1.randomUUID)(),
                                            productId: newItem.productId,
                                            type: quantityDifference > 0 ? 'OUT' : 'IN',
                                            quantity: Math.abs(quantityDifference),
                                            previousStock,
                                            newStock,
                                            reason: `Order updated: ${order.orderNo}`,
                                            referenceId: order.id,
                                            referenceType: 'ORDER',
                                            createdAt: new Date(),
                                        },
                                    });
                                }
                            }
                        }
                    }
                });
            }
            catch (error) {
                this.logger.error('[OrdersService.update] Failed to adjust stock:', error);
                throw new common_1.BadRequestException('Failed to update stock. Please try again.');
            }
            updatePayload.order_items = { create: items };
            updatePayload.subtotalCents = subtotalCents;
            updatePayload.totalCents = subtotalCents;
        }
        const _updatedOrder = await this.prisma.orders.update({
            where: { id },
            data: updatePayload,
            include: {
                order_items: {
                    include: {
                        products: {
                            select: {
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
                users: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });
        const fullOrder = await this.prisma.orders.findUnique({
            where: { id },
            include: {
                order_items: {
                    include: {
                        products: {
                            select: {
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
                users: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });
        return {
            id: fullOrder.id,
            orderNumber: fullOrder.orderNo,
            customerName: fullOrder.users?.name || 'N/A',
            customerEmail: fullOrder.users?.email || 'N/A',
            customerPhone: fullOrder.users?.phone || 'N/A',
            totalAmount: fullOrder.totalCents,
            status: fullOrder.status,
            shippingAddress: fullOrder.shippingAddress,
            createdAt: fullOrder.createdAt,
            updatedAt: fullOrder.updatedAt,
            items: fullOrder.order_items.map(item => ({
                id: item.id,
                productName: item.products?.name || item.name || 'Sản phẩm',
                quantity: item.quantity,
                price: item.unitPrice || 0,
                total: Number(item.unitPrice || 0) * item.quantity,
            })),
        };
    }
    async sendInvoice(id) {
        const order = await this.prisma.orders.findUnique({
            where: { id },
            include: {
                order_items: {
                    include: {
                        products: {
                            select: {
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
                users: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        const orderData = order;
        const email = orderData.users?.email || orderData.customerEmail;
        if (!email) {
            throw new common_1.BadRequestException('Đơn hàng không có địa chỉ email khách hàng');
        }
        const invoiceData = {
            invoiceNo: orderData.orderNo,
            createdDate: orderData.createdAt.toLocaleDateString('vi-VN'),
            dueDate: new Date(orderData.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
            status: orderData.status,
            customer: {
                name: orderData.users?.name || orderData.customerName || 'Khách hàng',
                email: email,
                phone: orderData.users?.phone || orderData.customerPhone || '',
                address: orderData.shippingAddress || '',
            },
            items: orderData.order_items.map((item) => ({
                name: item.products?.name || item.name || 'Sản phẩm',
                quantity: item.quantity,
                price: Number(item.unitPrice || 0),
                total: Number(item.unitPrice || 0) * item.quantity,
            })),
            subTotal: orderData.subtotalCents,
            tax: 0,
            discount: orderData.discountCents,
            total: orderData.totalCents,
            company: {
                name: 'Audio Tai Loc',
                address: '123 Đường ABC, Quận 1, TP.HCM',
                phone: '0123 456 789',
                email: 'support@audiotailoc.com',
                website: 'https://audiotailoc.com',
            },
        };
        try {
            await this.mail.sendInvoice(email, invoiceData);
            return { success: true, message: `Đã gửi hóa đơn đến ${email}` };
        }
        catch (error) {
            this.logger.error('Failed to send invoice:', error);
            throw new common_1.BadRequestException('Không thể gửi hóa đơn. Vui lòng thử lại sau.');
        }
    }
    async delete(id) {
        try {
            const order = await this.prisma.orders.findUnique({
                where: { id },
                include: { order_items: true },
            });
            if (!order || order.isDeleted)
                throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
            if (order.status === 'PENDING' || order.status === 'PROCESSING') {
                try {
                    await this.prisma.$transaction(async (tx) => {
                        for (const item of order.order_items) {
                            if (item.productId) {
                                const inventory = await tx.inventory.findUnique({
                                    where: { productId: item.productId },
                                });
                                if (inventory) {
                                    const previousStock = inventory.stock;
                                    const newStock = previousStock + item.quantity;
                                    await tx.inventory.update({
                                        where: { productId: item.productId },
                                        data: {
                                            stock: { increment: item.quantity },
                                            updatedAt: new Date(),
                                        },
                                    });
                                    await tx.inventory_movements.create({
                                        data: {
                                            id: (0, crypto_1.randomUUID)(),
                                            productId: item.productId,
                                            type: 'IN',
                                            quantity: item.quantity,
                                            previousStock,
                                            newStock,
                                            reason: `Order deleted (Soft Delete): ${order.orderNo}`,
                                            referenceId: order.id,
                                            referenceType: 'ORDER',
                                            createdAt: new Date(),
                                        },
                                    });
                                }
                            }
                        }
                    });
                    try {
                        await this.cache.clearByPrefix('audiotailoc');
                    }
                    catch (cacheError) {
                        this.logger.warn('[OrdersService.delete] Failed to clear cache:', cacheError);
                    }
                }
                catch (restoreError) {
                    this.logger.error('Failed to restore stock on delete:', restoreError);
                }
            }
            await this.prisma.orders.update({
                where: { id },
                data: {
                    isDeleted: true,
                    deletedAt: new Date(),
                    status: 'CANCELLED',
                },
            });
            return { message: 'Đơn hàng đã được xóa thành công', id };
        }
        catch (error) {
            this.logger.error('[OrdersService.delete] Unexpected error:', error);
            throw error;
        }
    }
    async getUserOrders(userId, params) {
        const page = Math.max(1, Math.floor(params.page ?? 1));
        const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
        const where = {
            userId,
            isDeleted: false
        };
        if (params.status)
            where.status = params.status;
        return this.prisma
            .$transaction([
            this.prisma.orders.count({ where }),
            this.prisma.orders.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: {
                    order_items: {
                        include: {
                            products: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    imageUrl: true,
                                    inventory: {
                                        select: {
                                            stock: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    payments: {
                        select: {
                            id: true,
                            amountCents: true,
                            status: true,
                            provider: true,
                            createdAt: true,
                        },
                    },
                },
            }),
        ])
            .then(([total, items]) => ({
            total,
            page,
            pageSize,
            items: items.map(order => this.transformOrderForResponse({
                id: order.id,
                orderNo: order.orderNo,
                status: order.status,
                totalCents: order.totalCents,
                shippingAddress: order.shippingAddress,
                shippingName: order.shippingName,
                shippingPhone: order.shippingPhone,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                items: order.order_items.map(item => ({
                    id: item.id,
                    productId: item.productId,
                    product: item.products,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.unitPrice,
                    total: Number(item.unitPrice || 0) * item.quantity,
                })),
                payments: order.payments,
            })),
        }));
    }
    async getUserOrder(userId, orderId) {
        const order = await this.prisma.orders.findFirst({
            where: {
                id: orderId,
                userId,
                isDeleted: false
            },
            include: {
                order_items: {
                    include: {
                        products: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                imageUrl: true,
                                inventory: {
                                    select: {
                                        stock: true,
                                    },
                                },
                            },
                        },
                    },
                },
                payments: {
                    select: {
                        id: true,
                        amountCents: true,
                        status: true,
                        provider: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        }
        return this.transformOrderForResponse({
            id: order.id,
            orderNo: order.orderNo,
            status: order.status,
            totalCents: order.totalCents,
            shippingAddress: order.shippingAddress,
            shippingName: order.shippingName,
            shippingPhone: order.shippingPhone,
            shippingNotes: order.shippingNotes,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: order.order_items.map(item => ({
                id: item.id,
                productId: item.productId,
                product: item.products,
                name: item.name,
                quantity: item.quantity,
                price: item.unitPrice,
                total: Number(item.unitPrice || 0) * item.quantity,
            })),
            payments: order.payments,
        });
    }
    transformOrderForResponse(order) {
        if (!order)
            return order;
        return JSON.parse(JSON.stringify(order, (key, value) => {
            if (typeof value === 'bigint') {
                return Number(value);
            }
            return value;
        }));
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        telegram_service_1.TelegramService,
        cache_service_1.CacheService,
        promotions_service_1.PromotionsService,
        inventory_service_1.InventoryService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map