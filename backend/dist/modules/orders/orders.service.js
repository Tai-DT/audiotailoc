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
        return this.prisma.$transaction([
            this.prisma.order.count({ where }),
            this.prisma.order.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    items: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    slug: true
                                }
                            }
                        }
                    }
                }
            }),
        ]).then(([total, items]) => ({
            total,
            page,
            pageSize,
            items: items.map(order => ({
                id: order.id,
                orderNumber: order.orderNo,
                customerName: order.user?.name || 'N/A',
                customerEmail: order.user?.email || 'N/A',
                totalAmount: order.totalCents,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                items: order.items.map(item => ({
                    id: item.id,
                    productId: item.productId,
                    productSlug: item.product?.slug || null,
                    productName: item.product?.name || item.name || 'Sản phẩm',
                    quantity: item.quantity,
                    price: item.unitPrice || 0,
                    total: (item.unitPrice || 0) * item.quantity
                }))
            }))
        }));
    }
    async get(id) {
        const order = await this.prisma.order.findUnique({ where: { id }, include: { items: true, payments: true } });
        if (!order)
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        return order;
    }
    async updateStatus(id, status) {
        const order = await this.get(id);
        const current = (order.status || '').toUpperCase();
        const next = (status || '').toUpperCase();
        const nexts = allowedTransitions[current] || [];
        console.log('[OrdersService.updateStatus] current=', current, 'requested=', next, 'allowed=', nexts);
        if (!nexts.includes(next))
            throw new common_1.BadRequestException('Trạng thái không hợp lệ');
        const updated = await this.prisma.order.update({ where: { id }, data: { status: next } });
        if (next === 'CANCELLED' && (current === 'PENDING' || current === 'PROCESSING')) {
            try {
                const items = await this.prisma.orderItem.findMany({
                    where: { orderId: id },
                    include: { product: { select: { id: true, slug: true, name: true } } },
                });
                for (const item of items) {
                    let targetProductId = item.productId ?? null;
                    if (!targetProductId && item.product?.id) {
                        targetProductId = item.product.id;
                    }
                    if (!targetProductId && item.product?.slug) {
                        const bySlug = await this.prisma.product.findUnique({ where: { slug: item.product.slug } });
                        if (bySlug)
                            targetProductId = bySlug.id;
                    }
                    if (!targetProductId && item.product?.name) {
                        const byName = await this.prisma.product.findFirst({ where: { name: item.product.name } });
                        if (byName)
                            targetProductId = byName.id;
                    }
                    if (targetProductId) {
                        await this.prisma.product.update({
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
                const user = await this.prisma.user.findUnique({ where: { id: order.userId } });
                if (user?.email) {
                    const orderWithItems = await this.prisma.order.findUnique({
                        where: { id: order.id },
                        include: { items: true }
                    });
                    if (orderWithItems) {
                        const orderData = {
                            orderNo: order.orderNo,
                            customerName: user.name || user.email,
                            totalAmount: `${(order.totalCents / 100).toLocaleString('vi-VN')} VNĐ`,
                            items: orderWithItems.items.map((item) => ({
                                name: item.name || 'Sản phẩm',
                                quantity: item.quantity,
                                price: `${(item.unitPrice / 100).toLocaleString('vi-VN')} VNĐ`
                            })),
                            status: status
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
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const orderNo = `ORD${timestamp}${random}`;
        const items = [];
        let subtotalCents = 0;
        for (const item of orderData.items || []) {
            const itemData = {
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || 0,
                name: item.name || 'Sản phẩm',
                price: item.unitPrice || 0
            };
            try {
                let product = await this.prisma.product.findUnique({
                    where: { id: item.productId }
                });
                if (!product) {
                    product = await this.prisma.product.findUnique({
                        where: { slug: item.productId }
                    });
                }
                if (product) {
                    itemData.unitPrice = product.priceCents;
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
        try {
            const shippingAddress = typeof orderData.shippingAddress === 'string'
                ? orderData.shippingAddress
                : (orderData.shippingAddress ? JSON.stringify(orderData.shippingAddress) : null);
            const shippingCoordinates = orderData.shippingCoordinates
                ? JSON.stringify(orderData.shippingCoordinates)
                : null;
            let userId = orderData.userId;
            if (!userId) {
                const uniqueEmail = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@audiotailoc.com`;
                const guestUser = await this.prisma.user.create({
                    data: {
                        email: uniqueEmail,
                        password: 'guest_password',
                        name: orderData.customerName || 'Khách hàng',
                        phone: orderData.customerPhone,
                        role: 'USER'
                    }
                });
                userId = guestUser.id;
            }
            const order = await this.prisma.$transaction(async (tx) => {
                for (const item of items) {
                    if (item.productId) {
                        const product = await tx.product.findUnique({
                            where: { id: item.productId },
                            select: { stockQuantity: true }
                        });
                        if (product && product.stockQuantity !== null && product.stockQuantity < item.quantity) {
                            throw new common_1.BadRequestException('Số lượng tồn kho không đủ cho sản phẩm');
                        }
                        await tx.product.update({
                            where: { id: item.productId },
                            data: { stockQuantity: { decrement: item.quantity } }
                        });
                    }
                }
                return await tx.order.create({
                    data: {
                        orderNo,
                        userId,
                        status: 'PENDING',
                        subtotalCents,
                        totalCents: subtotalCents,
                        shippingAddress,
                        shippingCoordinates,
                        items: {
                            create: items
                        }
                    },
                    include: {
                        items: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true
                            }
                        }
                    }
                });
            });
            await this.cache.clearByPrefix('audiotailoc');
            return order;
        }
        catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
    async update(id, updateData) {
        console.log('=== UPDATE ORDER DEBUG ===');
        console.log('Order ID:', id);
        console.log('Update data keys:', Object.keys(updateData));
        console.log('Update data:', JSON.stringify(updateData, null, 2));
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
                await this.prisma.user.update({
                    where: { id: order.userId },
                    data: userUpdate
                });
            }
        }
        if (updateData.shippingAddress !== undefined) {
            updatePayload.shippingAddress = typeof updateData.shippingAddress === 'string'
                ? updateData.shippingAddress
                : (updateData.shippingAddress ? JSON.stringify(updateData.shippingAddress) : null);
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
            await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
            let subtotalCents = 0;
            const items = [];
            for (const item of updateData.items) {
                const itemData = {
                    quantity: item.quantity || 1,
                    unitPrice: item.unitPrice || 0,
                    name: item.name || 'Sản phẩm',
                    price: item.unitPrice || 0
                };
                try {
                    let product = await this.prisma.product.findUnique({
                        where: { id: item.productId }
                    });
                    if (!product) {
                        product = await this.prisma.product.findUnique({
                            where: { slug: item.productId }
                        });
                    }
                    if (product) {
                        itemData.unitPrice = product.priceCents;
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
            updatePayload.items = { create: items };
            updatePayload.subtotalCents = subtotalCents;
            updatePayload.totalCents = subtotalCents;
        }
        const _updatedOrder = await this.prisma.order.update({
            where: { id },
            data: updatePayload,
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                slug: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });
        const fullOrder = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                slug: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });
        return {
            id: fullOrder.id,
            orderNumber: fullOrder.orderNo,
            customerName: fullOrder.user?.name || 'N/A',
            customerEmail: fullOrder.user?.email || 'N/A',
            customerPhone: fullOrder.user?.phone || 'N/A',
            totalAmount: fullOrder.totalCents,
            status: fullOrder.status,
            shippingAddress: fullOrder.shippingAddress,
            createdAt: fullOrder.createdAt,
            updatedAt: fullOrder.updatedAt,
            items: fullOrder.items.map(item => ({
                id: item.id,
                productName: item.product?.name || item.name || 'Sản phẩm',
                quantity: item.quantity,
                price: item.unitPrice || 0,
                total: (item.unitPrice || 0) * item.quantity
            }))
        };
    }
    async delete(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: true }
        });
        if (!order)
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        if (order.status === 'PENDING' || order.status === 'PROCESSING') {
            try {
                for (const item of order.items) {
                    if (item.productId) {
                        await this.prisma.product.update({
                            where: { id: item.productId },
                            data: { stockQuantity: { increment: item.quantity } }
                        });
                    }
                }
                await this.cache.clearByPrefix('audiotailoc');
            }
            catch (error) {
                console.error('Failed to restore stock on delete:', error);
            }
        }
        await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
        await this.prisma.payment.deleteMany({ where: { orderId: id } });
        await this.prisma.order.delete({ where: { id } });
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