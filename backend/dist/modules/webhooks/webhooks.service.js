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
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const payments_service_1 = require("../payments/payments.service");
const orders_service_1 = require("../orders/orders.service");
const notification_service_1 = require("../notifications/notification.service");
const crypto = __importStar(require("crypto"));
const crypto_1 = require("crypto");
let WebhooksService = WebhooksService_1 = class WebhooksService {
    constructor(config, prisma, paymentsService, ordersService, notificationService) {
        this.config = config;
        this.prisma = prisma;
        this.paymentsService = paymentsService;
        this.ordersService = ordersService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(WebhooksService_1.name);
    }
    async handleVNPAYWebhook(data) {
        try {
            this.logger.log('Processing VNPAY webhook:', data);
            const isValidSignature = this.validateVNPAYSignature(data);
            if (!isValidSignature) {
                throw new common_1.BadRequestException('Invalid VNPAY webhook signature');
            }
            const { vnp_TxnRef, vnp_ResponseCode, vnp_Amount, vnp_TransactionNo, vnp_OrderInfo: _vnp_OrderInfo, vnp_PayDate: _vnp_PayDate, } = data;
            const paymentIntent = await this.prisma.payment_intents.findUnique({
                where: { id: vnp_TxnRef },
                include: { orders: true },
            });
            if (!paymentIntent) {
                throw new common_1.BadRequestException('Payment intent not found');
            }
            if (paymentIntent.status !== 'PENDING') {
                this.logger.warn(`Payment intent ${vnp_TxnRef} already processed with status ${paymentIntent.status}`);
                return {
                    success: true,
                    message: 'Payment already processed',
                    orderId: paymentIntent.orderId,
                    paymentId: paymentIntent.id,
                };
            }
            const isSuccess = vnp_ResponseCode === '00';
            const status = isSuccess ? 'COMPLETED' : 'FAILED';
            await this.prisma.payment_intents.update({
                where: { id: vnp_TxnRef },
                data: { status: status },
            });
            const payment = await this.prisma.payments.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    orderId: paymentIntent.orderId,
                    amountCents: parseInt(vnp_Amount),
                    provider: 'VNPAY',
                    status: status,
                    transactionId: vnp_TransactionNo,
                    updatedAt: new Date(),
                },
            });
            if (isSuccess) {
                await this.ordersService.updateStatus(paymentIntent.orderId, 'PAID');
                await this.notificationService.sendNotification({
                    userId: paymentIntent.orders.userId || undefined,
                    title: 'Thanh toán thành công',
                    message: `Đơn hàng ${paymentIntent.orders.orderNo} đã được thanh toán thành công`,
                    type: 'PAYMENT',
                    priority: 'HIGH',
                    channels: ['EMAIL', 'PUSH'],
                    data: {
                        orderId: paymentIntent.orderId,
                        paymentId: payment.id,
                        amount: parseInt(vnp_Amount),
                    },
                });
            }
            return {
                success: true,
                message: isSuccess ? 'Payment processed successfully' : 'Payment failed',
                orderId: paymentIntent.orderId,
                paymentId: payment.id,
            };
        }
        catch (error) {
            this.logger.error('VNPAY webhook processing failed:', error);
            throw error;
        }
    }
    async handleMOMOWebhook(data) {
        try {
            this.logger.log('Processing MOMO webhook:', data);
            const isValidSignature = this.validateMOMOSignature(data);
            if (!isValidSignature) {
                throw new common_1.BadRequestException('Invalid MOMO webhook signature');
            }
            const { orderId, resultCode, amount, transId, message: _message, } = data;
            const paymentIntent = await this.prisma.payment_intents.findUnique({
                where: { id: orderId },
                include: { orders: true },
            });
            if (!paymentIntent) {
                throw new common_1.BadRequestException('Payment intent not found');
            }
            if (paymentIntent.status !== 'PENDING') {
                return {
                    success: true,
                    message: 'Payment already processed',
                    orderId: paymentIntent.orderId,
                    paymentId: paymentIntent.id,
                };
            }
            const isSuccess = resultCode === 0;
            const status = isSuccess ? 'COMPLETED' : 'FAILED';
            await this.prisma.payment_intents.update({
                where: { id: orderId },
                data: { status: status },
            });
            const payment = await this.prisma.payments.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    orderId: paymentIntent.orderId,
                    amountCents: parseInt(amount),
                    provider: 'MOMO',
                    status: status,
                    transactionId: transId,
                    updatedAt: new Date(),
                },
            });
            if (isSuccess) {
                await this.ordersService.updateStatus(paymentIntent.orderId, 'PAID');
                await this.notificationService.sendNotification({
                    userId: paymentIntent.orders.userId || undefined,
                    title: 'Thanh toán thành công',
                    message: `Đơn hàng ${paymentIntent.orders.orderNo} đã được thanh toán thành công`,
                    type: 'PAYMENT',
                    priority: 'HIGH',
                    channels: ['EMAIL', 'PUSH'],
                    data: {
                        orderId: paymentIntent.orderId,
                        paymentId: payment.id,
                        amount: parseInt(amount),
                    },
                });
            }
            return {
                success: true,
                message: isSuccess ? 'Payment processed successfully' : 'Payment failed',
                orderId: paymentIntent.orderId,
                paymentId: payment.id,
            };
        }
        catch (error) {
            this.logger.error('MOMO webhook processing failed:', error);
            throw error;
        }
    }
    async handlePAYOSWebhook(data) {
        try {
            this.logger.log('Processing PAYOS webhook:', data);
            const isValidSignature = this.validatePAYOSSignature(data);
            if (!isValidSignature) {
                throw new common_1.BadRequestException('Invalid PAYOS webhook signature');
            }
            const { orderCode, status, amount, transactionId, description: _description, } = data;
            const paymentIntent = await this.prisma.payment_intents.findUnique({
                where: { id: orderCode },
                include: { orders: true },
            });
            if (!paymentIntent) {
                throw new common_1.BadRequestException('Payment intent not found');
            }
            if (paymentIntent.status !== 'PENDING') {
                return {
                    success: true,
                    message: 'Payment already processed',
                    orderId: paymentIntent.orderId,
                    paymentId: paymentIntent.id,
                };
            }
            const isSuccess = status === 'PAID';
            const paymentStatus = isSuccess ? 'COMPLETED' : 'FAILED';
            await this.prisma.payment_intents.update({
                where: { id: orderCode },
                data: { status: paymentStatus },
            });
            const payment = await this.prisma.payments.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    orderId: paymentIntent.orderId,
                    amountCents: parseInt(amount),
                    provider: 'PAYOS',
                    status: paymentStatus,
                    transactionId,
                    updatedAt: new Date(),
                },
            });
            if (isSuccess) {
                await this.ordersService.updateStatus(paymentIntent.orderId, 'PAID');
                await this.notificationService.sendNotification({
                    userId: paymentIntent.orders.userId || undefined,
                    title: 'Thanh toán thành công',
                    message: `Đơn hàng ${paymentIntent.orders.orderNo} đã được thanh toán thành công`,
                    type: 'PAYMENT',
                    priority: 'HIGH',
                    channels: ['EMAIL', 'PUSH'],
                    data: {
                        orderId: paymentIntent.orderId,
                        paymentId: payment.id,
                        amount: parseInt(amount),
                    },
                });
            }
            return {
                success: true,
                message: isSuccess ? 'Payment processed successfully' : 'Payment failed',
                orderId: paymentIntent.orderId,
                paymentId: payment.id,
            };
        }
        catch (error) {
            this.logger.error('PAYOS webhook processing failed:', error);
            throw error;
        }
    }
    validateVNPAYSignature(data) {
        const secret = this.config.get('VNPAY_HASH_SECRET');
        if (!secret)
            return false;
        const { vnp_SecureHash, ...params } = data;
        const signData = Object.keys(params)
            .filter(key => key !== 'vnp_SecureHash')
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        const expectedHash = crypto
            .createHmac('sha256', secret)
            .update(signData)
            .digest('hex');
        return vnp_SecureHash === expectedHash;
    }
    validateMOMOSignature(data) {
        const secret = this.config.get('MOMO_SECRET_KEY');
        if (!secret)
            return false;
        const { signature, ...params } = data;
        const signData = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        const expectedHash = crypto
            .createHmac('sha256', secret)
            .update(signData)
            .digest('hex');
        return signature === expectedHash;
    }
    validatePAYOSSignature(data) {
        const checksumKey = this.config.get('PAYOS_CHECKSUM_KEY');
        if (!checksumKey)
            return false;
        const { signature, ...params } = data;
        const dataStr = JSON.stringify(params);
        const expectedHash = crypto
            .createHmac('sha256', checksumKey)
            .update(dataStr)
            .digest('hex');
        return signature === expectedHash;
    }
    async handleOrderStatusWebhook(data) {
        try {
            this.logger.log('Processing order status webhook:', data);
            const { orderId, status, reason } = data;
            await this.ordersService.updateStatus(orderId, status);
            const order = await this.prisma.orders.findUnique({
                where: { id: orderId },
                include: { users: true },
            });
            if (!order) {
                throw new common_1.BadRequestException('Order not found');
            }
            await this.notificationService.sendNotification({
                userId: order.userId || undefined,
                title: `Cập nhật đơn hàng ${order.orderNo}`,
                message: `Đơn hàng của bạn đã được cập nhật: ${status}`,
                type: 'ORDER',
                priority: 'MEDIUM',
                channels: ['EMAIL', 'PUSH'],
                data: {
                    orderId,
                    status,
                    reason,
                },
            });
            return {
                success: true,
                message: 'Order status updated successfully',
                orderId,
            };
        }
        catch (error) {
            this.logger.error('Order status webhook processing failed:', error);
            throw error;
        }
    }
    async handleInventoryWebhook(data) {
        try {
            this.logger.log('Processing inventory webhook:', data);
            const { productId, action, quantity, reason } = data;
            if (action === 'ADJUST') {
                await this.prisma.inventory.update({
                    where: { productId },
                    data: {
                        stock: { increment: quantity },
                    },
                });
            }
            else if (action === 'SET') {
                await this.prisma.inventory.update({
                    where: { productId },
                    data: {
                        stock: quantity,
                    },
                });
            }
            const product = await this.prisma.products.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new common_1.BadRequestException('Product not found');
            }
            await this.notificationService.sendNotification({
                title: 'Cập nhật tồn kho',
                message: `Sản phẩm ${product.name} đã được cập nhật tồn kho`,
                type: 'SYSTEM',
                priority: 'LOW',
                channels: ['EMAIL'],
                data: {
                    productId,
                    action,
                    quantity,
                    reason,
                },
            });
            return {
                success: true,
                message: 'Inventory updated successfully',
            };
        }
        catch (error) {
            this.logger.error('Inventory webhook processing failed:', error);
            throw error;
        }
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        payments_service_1.PaymentsService,
        orders_service_1.OrdersService,
        notification_service_1.NotificationService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map