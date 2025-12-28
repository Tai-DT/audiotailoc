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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../notifications/mail.service");
const cache_service_1 = require("../caching/cache.service");
const crypto_1 = require("crypto");
const allowedTransitions = {
    PENDING: ['PROCESSING', 'CANCELLED', 'COMPLETED'],
    PROCESSING: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
};
let OrdersService = class OrdersService {
    constructor(prisma, mail, cache) {
        this.prisma = prisma;
        this.mail = mail;
        this.cache = cache;
    }
    list(params) {
        const page = Math.max(1, Math.floor(params.page ?? 1));
        const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
        const where = {};
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
                totalAmount: Number(order.totalCents),
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                items: order.order_items.map(item => {
                    const unitPrice = item.unitPrice ? Number(item.unitPrice) : 0;
                    return {
                        id: item.id,
                        productId: item.productId,
                        productSlug: item.products?.slug || null,
                        productName: item.products?.name || item.name || 'Sản phẩm',
                        quantity: item.quantity,
                        price: unitPrice,
                        total: unitPrice * item.quantity,
                    };
                }),
            })),
        }));
    }
    async get(id) {
        const order = await this.prisma.orders.findFirst({
            where: {
                OR: [{ id: id }, { orderNo: id }],
            },
            include: { order_items: true, payments: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        return {
            ...order,
            totalCents: Number(order.totalCents),
            subtotalCents: order.subtotalCents ? Number(order.subtotalCents) : null,
            order_items: order.order_items.map(item => ({
                ...item,
                price: item.price ? Number(item.price) : null,
                unitPrice: item.unitPrice ? Number(item.unitPrice) : null,
            })),
        };
    }
    async updateStatus(id, status) {
        const order = await this.get(id);
        const current = (order.status || '').toUpperCase();
        const next = (status || '').toUpperCase();
        const nexts = allowedTransitions[current] || [];
        console.log('[OrdersService.updateStatus] current=', current, 'requested=', next, 'allowed=', nexts);
        if (!nexts.includes(next))
            throw new common_1.BadRequestException('Trạng thái không hợp lệ');
        const updated = await this.prisma.orders.update({ where: { id }, data: { status: next } });
        if (next === 'CANCELLED' && (current === 'PENDING' || current === 'PROCESSING')) {
            try {
                const items = await this.prisma.order_items.findMany({
                    where: { orderId: id },
                    include: { products: { select: { id: true, slug: true, name: true } } },
                });
                for (const item of items) {
                    let targetProductId = item.productId ?? null;
                    if (!targetProductId && item.products?.id) {
                        targetProductId = item.products.id;
                    }
                    if (!targetProductId && item.products?.slug) {
                        const bySlug = await this.prisma.products.findUnique({
                            where: { slug: item.products.slug },
                        });
                        if (bySlug)
                            targetProductId = bySlug.id;
                    }
                    if (!targetProductId && item.products?.name) {
                        const byName = await this.prisma.products.findFirst({
                            where: { name: item.products.name },
                        });
                        if (byName)
                            targetProductId = byName.id;
                    }
                    if (targetProductId) {
                        await this.prisma.products.update({
                            where: { id: targetProductId },
                            data: { stockQuantity: { increment: item.quantity } },
                        });
                    }
                    else {
                        console.warn('[OrdersService.updateStatus] Could not resolve product for order item during cancel restore. Skipped increment.');
                    }
                }
                await this.cache.clearByPrefix('audiotailoc');
            }
            catch (error) {
                console.error('Failed to restore stock on cancellation:', error);
            }
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
                            totalAmount: `${(Number(order.totalCents) / 100).toLocaleString('vi-VN')} VNĐ`,
                            items: orderWithItems.order_items.map((item) => ({
                                name: item.name || 'Sản phẩm',
                                quantity: item.quantity,
                                price: `${(Number(item.unitPrice || 0) / 100).toLocaleString('vi-VN')} VNĐ`,
                            })),
                            status: status,
                        };
                        await this.mail.sendOrderStatusUpdate(user.email, orderData);
                    }
                }
            }
            catch (error) {
                console.error('Failed to send email notification:', error);
            }
        }
        return updated;
    }
    async create(orderData) {
        if (process.env.NODE_ENV === 'development') {
            console.log('=== SIMPLE CREATE ORDER DEBUG ===');
            const sanitizedData = { ...orderData };
            if (sanitizedData.customerEmail)
                sanitizedData.customerEmail = '***';
            if (sanitizedData.customerPhone)
                sanitizedData.customerPhone = '***';
            console.log('Input data:', JSON.stringify(sanitizedData, null, 2));
        }
        const timestamp = Date.now();
        const random = (0, crypto_1.randomBytes)(2).readUInt16BE(0) % 10000;
        const orderNo = `ORD${timestamp}${random.toString().padStart(4, '0')}`;
        let userId = orderData.userId;
        if (!userId) {
            if (process.env.NODE_ENV === 'development') {
                console.log('Creating guest user...');
            }
            const uniqueEmail = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@audiotailoc.com`;
            const guestUser = await this.prisma.users.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    email: uniqueEmail,
                    password: 'hashed_guest_password',
                    name: orderData.customerName || 'Khách hàng',
                    phone: orderData.customerPhone,
                    role: 'USER',
                    updatedAt: new Date(),
                },
            });
            userId = guestUser.id;
            if (process.env.NODE_ENV === 'development') {
                console.log('Guest user created:', userId);
            }
        }
        const items = [];
        let subtotalCents = 0;
        const incomingItems = Array.isArray(orderData.items) ? orderData.items : [];
        if (incomingItems.length === 0) {
            throw new common_1.BadRequestException('Vui lòng chọn ít nhất một sản phẩm');
        }
        for (const item of incomingItems) {
            console.log('Processing item:', item);
            const product = await this.prisma.products.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.BadRequestException(`Product not found: ${item.productId}`);
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
        if (process.env.NODE_ENV === 'development') {
            console.log('Processed items:', items);
            console.log('Subtotal:', subtotalCents);
        }
        const order = await this.prisma.orders.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                orderNo,
                userId,
                status: 'PENDING',
                subtotalCents,
                totalCents: subtotalCents,
                shippingAddress: orderData.shippingAddress || null,
                shippingCoordinates: orderData.shippingCoordinates
                    ? JSON.stringify(orderData.shippingCoordinates)
                    : null,
                updatedAt: new Date(),
            },
        });
        if (process.env.NODE_ENV === 'development') {
            console.log('Order created:', order.id);
        }
        for (const itemData of items) {
            await this.prisma.order_items.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    orderId: order.id,
                    ...itemData,
                    updatedAt: new Date(),
                },
            });
        }
        if (process.env.NODE_ENV === 'development') {
            console.log('Order items created');
        }
        const fullOrder = await this.prisma.orders.findUnique({
            where: { id: order.id },
            include: {
                order_items: true,
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
        if (process.env.NODE_ENV === 'development') {
            console.log('Returning order:', fullOrder?.id);
        }
        return fullOrder;
    }
    async update(id, updateData) {
        if (process.env.NODE_ENV === 'development') {
            console.log('=== UPDATE ORDER DEBUG ===');
            console.log('Order ID:', id);
            console.log('Update data keys:', Object.keys(updateData));
            const sanitizedUpdateData = { ...updateData };
            if (sanitizedUpdateData.customerEmail)
                sanitizedUpdateData.customerEmail = '***';
            if (sanitizedUpdateData.customerPhone)
                sanitizedUpdateData.customerPhone = '***';
            console.log('Update data:', JSON.stringify(sanitizedUpdateData, null, 2));
        }
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
            console.log('Skipping notes update - field not in Order schema');
        }
        if (updateData.items) {
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
                    });
                    if (!product) {
                        product = await this.prisma.products.findUnique({
                            where: { slug: item.productId },
                        });
                    }
                    if (product) {
                        itemData.unitPrice = Number(product.priceCents);
                        itemData.price = Number(product.priceCents);
                        itemData.productId = product.id;
                        if (!item.name && product.name)
                            itemData.name = product.name;
                    }
                }
                catch (error) {
                    console.error('Failed to fetch product:', error);
                }
                items.push(itemData);
                subtotalCents += (itemData.unitPrice || 0) * (itemData.quantity || 1);
            }
            const unresolved = items.filter(i => !i.productId);
            if (unresolved.length > 0) {
                throw new common_1.BadRequestException('Sản phẩm không hợp lệ. Vui lòng chọn lại sản phẩm.');
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
            totalAmount: Number(fullOrder.totalCents),
            status: fullOrder.status,
            shippingAddress: fullOrder.shippingAddress,
            createdAt: fullOrder.createdAt,
            updatedAt: fullOrder.updatedAt,
            items: fullOrder.order_items.map(item => {
                const unitPrice = item.unitPrice ? Number(item.unitPrice) : 0;
                return {
                    id: item.id,
                    productName: item.products?.name || item.name || 'Sản phẩm',
                    quantity: item.quantity,
                    price: unitPrice,
                    total: unitPrice * item.quantity,
                };
            }),
        };
    }
    async delete(id) {
        const order = await this.prisma.orders.findUnique({
            where: { id },
            include: { order_items: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        if (order.status === 'PENDING' || order.status === 'PROCESSING') {
            try {
                for (const item of order.order_items) {
                    if (item.productId) {
                        await this.prisma.products.update({
                            where: { id: item.productId },
                            data: { stockQuantity: { increment: item.quantity } },
                        });
                    }
                }
                await this.cache.clearByPrefix('audiotailoc');
            }
            catch (error) {
                console.error('Failed to restore stock on delete:', error);
            }
        }
        await this.prisma.order_items.deleteMany({ where: { orderId: id } });
        await this.prisma.payments.deleteMany({ where: { orderId: id } });
        await this.prisma.orders.delete({ where: { id } });
        return { message: 'Đơn hàng đã được xóa thành công' };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        cache_service_1.CacheService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map