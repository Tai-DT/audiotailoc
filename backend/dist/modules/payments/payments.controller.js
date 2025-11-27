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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const payos_service_1 = require("./payos.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../../prisma/prisma.service");
const payos_webhook_dto_1 = require("./dto/payos-webhook.dto");
class CreateIntentDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntentDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['PAYOS', 'COD']),
    __metadata("design:type", String)
], CreateIntentDto.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], CreateIntentDto.prototype, "idempotencyKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntentDto.prototype, "returnUrl", void 0);
class CreateRefundDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRefundDto.prototype, "paymentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateRefundDto.prototype, "amountCents", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRefundDto.prototype, "reason", void 0);
let PaymentsController = PaymentsController_1 = class PaymentsController {
    constructor(payments, payosService, prisma) {
        this.payments = payments;
        this.payosService = payosService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(PaymentsController_1.name);
    }
    getPaymentMethods() {
        return {
            methods: [
                {
                    id: 'COD',
                    name: 'Thanh toán khi nhận hàng',
                    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
                    logo: '/images/payment/cod.png',
                    enabled: true,
                },
                {
                    id: 'PAYOS',
                    name: 'PayOS',
                    description: 'Thanh toán qua PayOS (Chuyển khoản, QR, Thẻ)',
                    logo: '/images/payment/payos.png',
                    enabled: true,
                },
            ],
        };
    }
    getPaymentStatus() {
        return {
            status: 'active',
            message: 'Payment system is operational',
            timestamp: new Date().toISOString(),
            supportedProviders: ['COD', 'PAYOS'],
        };
    }
    async getMyPayments(req) {
        const userId = req.users?.sub;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const payments = await this.prisma.payments.findMany({
            where: {
                orders: {
                    userId: userId,
                },
            },
            include: {
                orders: {
                    select: {
                        id: true,
                        orderNo: true,
                        totalCents: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return payments.map((payment) => ({
            id: payment.id,
            orderId: payment.orders?.id,
            orderNo: payment.orders?.orderNo,
            description: `Payment for order ${payment.orders?.orderNo || payment.id}`,
            amount: payment.amountCents,
            provider: payment.provider,
            status: payment.status,
            transactionId: payment.id,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
        }));
    }
    async getPayments(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status) {
            where.status = query.status;
        }
        if (query.provider) {
            where.provider = query.provider;
        }
        if (query.search) {
            where.OR = [
                { orders: { orderNo: { contains: query.search, mode: 'insensitive' } } },
                { id: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [payments, total] = await Promise.all([
            this.prisma.payments.findMany({
                where,
                include: {
                    orders: {
                        select: {
                            id: true,
                            orderNo: true,
                            users: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.payments.count({ where }),
        ]);
        return {
            payments: payments.map((payment) => ({
                id: payment.id,
                orderId: payment.orders.id,
                orderNo: payment.orders.orderNo,
                amountCents: payment.amountCents,
                provider: payment.provider,
                status: payment.status,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt,
                paidAt: payment.status === 'PAID' ? payment.updatedAt : null,
                user: payment.orders.user,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getPaymentStats() {
        const [totalPayments, totalRevenue, pendingPayments, failedPayments, refundedPayments, refundedAmount,] = await Promise.all([
            this.prisma.payments.count(),
            this.prisma.payments.aggregate({
                where: { status: 'PAID' },
                _sum: { amountCents: true },
            }),
            this.prisma.payments.count({ where: { status: 'PENDING' } }),
            this.prisma.payments.count({ where: { status: 'FAILED' } }),
            this.prisma.payments.count({ where: { status: 'REFUNDED' } }),
            this.prisma.payments.aggregate({
                where: { status: 'REFUNDED' },
                _sum: { amountCents: true },
            }),
        ]);
        return {
            totalPayments,
            totalRevenue: totalRevenue._sum.amountCents || 0,
            pendingPayments,
            failedPayments,
            refundedPayments,
            refundedAmount: refundedAmount._sum.amountCents || 0,
        };
    }
    createIntent(dto) {
        return this.payments.createIntent(dto);
    }
    createRefund(dto) {
        return this.payments.createRefund(dto.paymentId, dto.amountCents, dto.reason);
    }
    async vnpayCallback(ref) {
        await this.payments.markPaid('VNPAY', String(ref));
        return { ok: true };
    }
    async momoCallback(ref) {
        await this.payments.markPaid('MOMO', String(ref));
        return { ok: true };
    }
    async payosCallback(orderCode, ref) {
        const id = String(orderCode || ref || '');
        if (!id)
            return { ok: false };
        await this.payments.markPaid('PAYOS', id);
        return { ok: true };
    }
    async createPayOSPayment(createPaymentDto, req) {
        const userId = req.user?.sub;
        let buyerName = createPaymentDto.buyerName;
        let buyerEmail = createPaymentDto.buyerEmail;
        let buyerPhone = createPaymentDto.buyerPhone;
        if (userId && (!buyerName || !buyerEmail)) {
            const user = await this.prisma.users.findUnique({
                where: { id: userId },
                select: { name: true, email: true, phone: true },
            });
            if (user) {
                buyerName = buyerName || user.name || 'Unknown';
                buyerEmail = buyerEmail || user.email;
                buyerPhone = buyerPhone || user.phone;
            }
        }
        if (!userId && !buyerName) {
            buyerName = 'Guest User';
        }
        if (!userId && !buyerEmail) {
            buyerEmail = `guest_${Date.now()}@example.com`;
        }
        return this.payosService.createPaymentLink({
            orderCode: createPaymentDto.orderCode,
            amount: createPaymentDto.amount,
            description: createPaymentDto.description,
            buyerName: buyerName,
            buyerEmail: buyerEmail,
            buyerPhone: buyerPhone,
            returnUrl: createPaymentDto.returnUrl,
            cancelUrl: createPaymentDto.cancelUrl,
        });
    }
    async getPayOSPaymentStatus(orderCode) {
        return this.payosService.checkPaymentStatus(orderCode);
    }
    async createPayOSRefund(refundDto) {
        return this.payosService.processRefund(refundDto);
    }
    async vnpayWebhook(body) {
        return this.payments.handleWebhook('VNPAY', body);
    }
    async momoWebhook(body) {
        return this.payments.handleWebhook('MOMO', body);
    }
    async payosWebhook(req, body) {
        try {
            const isValid = this.payosService.verifyWebhookSignature(body);
            if (!isValid) {
                this.logger.error('Invalid PayOS webhook signature');
                return { error: 1, message: 'Invalid signature' };
            }
            this.logger.log(`PayOS webhook verified, processing...`);
            const result = await this.payosService.handleWebhook(body);
            if (result.error === 0 && result.message === 'Payment successful') {
                this.logger.log('Payment successful, cart should be cleared on frontend');
            }
            return result;
        }
        catch (error) {
            this.logger.error(`PayOS webhook error: ${error.message}`);
            return { error: 1, message: 'Webhook processing failed' };
        }
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('methods'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getPaymentMethods", null);
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getPaymentStatus", null);
__decorate([
    (0, common_1.Get)('my-payments'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getMyPayments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPayments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPaymentStats", null);
__decorate([
    (0, common_1.Post)('intents'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateIntentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createIntent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Post)('refunds'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRefundDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createRefund", null);
__decorate([
    (0, common_1.Get)('vnpay/callback'),
    __param(0, (0, common_1.Query)('vnp_TxnRef')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "vnpayCallback", null);
__decorate([
    (0, common_1.Get)('momo/callback'),
    __param(0, (0, common_1.Query)('momo_txn')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "momoCallback", null);
__decorate([
    (0, common_1.Get)('payos/callback'),
    __param(0, (0, common_1.Query)('orderCode')),
    __param(1, (0, common_1.Query)('payos_txn')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "payosCallback", null);
__decorate([
    (0, common_1.Post)('payos/create-payment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payos_webhook_dto_1.PayOSCreatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createPayOSPayment", null);
__decorate([
    (0, common_1.Get)('payos/payment-status/:orderCode'),
    __param(0, (0, common_1.Param)('orderCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPayOSPaymentStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Post)('payos/refund'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payos_webhook_dto_1.PayOSRefundDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createPayOSRefund", null);
__decorate([
    (0, common_1.Post)('vnpay/webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "vnpayWebhook", null);
__decorate([
    (0, common_1.Post)('momo/webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "momoWebhook", null);
__decorate([
    (0, common_1.Post)('payos/webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "payosWebhook", null);
exports.PaymentsController = PaymentsController = PaymentsController_1 = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        payos_service_1.PayOSService,
        prisma_service_1.PrismaService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map