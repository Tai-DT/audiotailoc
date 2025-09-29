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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const crypto_1 = __importDefault(require("crypto"));
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async createIntent(params) {
        const order = await this.prisma.order.findUnique({ where: { id: params.orderId } });
        if (!order)
            throw new common_1.BadRequestException('Order not found');
        const intent = await this.prisma.paymentIntent.create({
            data: { orderId: order.id, provider: params.provider, amountCents: order.totalCents, status: 'PENDING', returnUrl: params.returnUrl ?? null },
        });
        if (params.provider === 'COD') {
            await this.prisma.order.update({
                where: { id: order.id },
                data: {
                    status: 'CONFIRMED'
                }
            });
            await this.prisma.paymentIntent.update({
                where: { id: intent.id },
                data: {
                    status: 'PENDING',
                    metadata: JSON.stringify({ paymentMethod: 'COD' })
                }
            });
            return { intentId: intent.id, redirectUrl: null, paymentMethod: 'COD' };
        }
        const redirectUrl = await this.buildRedirectUrl({ ...intent, provider: intent.provider }, order);
        return { intentId: intent.id, redirectUrl };
    }
    async buildRedirectUrl(intent, order) {
        const baseReturn = intent.returnUrl || this.config.get('PAYMENT_RETURN_URL') || 'http://localhost:3000/return';
        if (intent.provider === 'VNPAY') {
            const tmnCode = this.config.get('VNPAY_TMN_CODE') || 'TEST';
            const secret = this.config.get('VNPAY_HASH_SECRET') || 'secret';
            const params = {
                vnp_Amount: String(intent.amountCents),
                vnp_TmnCode: tmnCode,
                vnp_TxnRef: intent.id,
                vnp_ReturnUrl: baseReturn,
            };
            const signData = Object.keys(params)
                .sort()
                .map((k) => `${k}=${params[k]}`)
                .join('&');
            const vnp_SecureHash = crypto_1.default.createHmac('sha256', secret).update(signData).digest('hex');
            return `${this.config.get('VNPAY_PAY_URL') || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'}?${signData}&vnp_SecureHash=${vnp_SecureHash}`;
        }
        if (intent.provider === 'PAYOS') {
            const apiUrl = this.config.get('PAYOS_API_URL') || 'https://api.payos.vn';
            const clientId = this.config.get('PAYOS_CLIENT_ID') || '';
            const apiKey = this.config.get('PAYOS_API_KEY') || '';
            const checksumKey = this.config.get('PAYOS_CHECKSUM_KEY') || '';
            const partnerCode = this.config.get('PAYOS_PARTNER_CODE') || '';
            try {
                const payload = {
                    orderCode: order.orderNo || intent.id,
                    amount: intent.amountCents,
                    currency: 'VND',
                    returnUrl: baseReturn,
                    cancelUrl: baseReturn,
                    description: `Thanh toan don hang ${order.orderNo}`,
                    items: [{ name: 'Audio Tai Loc', quantity: 1, price: intent.amountCents }],
                };
                if (partnerCode) {
                    payload.partnerCode = partnerCode;
                }
                const dataStr = JSON.stringify(payload);
                const sig = crypto_1.default.createHmac('sha256', checksumKey).update(dataStr).digest('hex');
                const headers = {
                    'content-type': 'application/json',
                    'x-client-id': clientId,
                    'x-api-key': apiKey,
                };
                if (partnerCode) {
                    headers['x-partner-code'] = partnerCode;
                }
                const res = await fetch(`${apiUrl}/v2/checkout/create`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ ...payload, signature: sig }),
                });
                const out = await res.json().catch(() => ({}));
                const checkoutUrl = out?.data?.checkoutUrl || out?.checkoutUrl || '';
                if (checkoutUrl)
                    return checkoutUrl;
            }
            catch { }
            return `${baseReturn}?payos_txn=${encodeURIComponent(intent.id)}`;
        }
        if (intent.provider === 'MOMO') {
            return await this.createMomoPayment(intent, order, baseReturn);
        }
        return `${baseReturn}?error=unsupported_provider`;
    }
    async createMomoPayment(intent, order, returnUrl) {
        try {
            const partnerCode = this.config.get('MOMO_PARTNER_CODE') || '';
            const accessKey = this.config.get('MOMO_ACCESS_KEY') || '';
            const secretKey = this.config.get('MOMO_SECRET_KEY') || '';
            const endpoint = this.config.get('MOMO_ENDPOINT') || 'https://test-payment.momo.vn/v2/gateway/api/create';
            const requestId = `${intent.id}_${Date.now()}`;
            const orderId = order.orderNo || intent.id;
            const orderInfo = `Thanh toán đơn hàng ${order.orderNo}`;
            const redirectUrl = returnUrl;
            const ipnUrl = `${this.config.get('API_BASE_URL')}/webhooks/momo`;
            const amount = intent.amountCents;
            const requestType = 'payWithATM';
            const extraData = '';
            const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
            const signature = crypto_1.default.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
            const requestBody = {
                partnerCode,
                accessKey,
                requestId,
                amount,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                extraData,
                requestType,
                signature,
                lang: 'vi'
            };
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            const result = await response.json();
            if (result.resultCode === 0 && result.payUrl) {
                this.logger.log(`MOMO payment created for order ${orderId}: ${result.payUrl}`);
                return result.payUrl;
            }
            else {
                this.logger.error(`MOMO payment creation failed: ${result.message}`);
                return `${returnUrl}?error=momo_creation_failed`;
            }
        }
        catch (error) {
            this.logger.error(`MOMO payment error: ${error?.message}`);
            return `${returnUrl}?error=momo_error`;
        }
    }
    async markPaid(provider, txnRef, transactionId) {
        const intent = await this.prisma.paymentIntent.findUnique({ where: { id: txnRef } });
        if (!intent)
            throw new common_1.BadRequestException('Intent not found');
        const order = await this.prisma.order.findUnique({ where: { id: intent.orderId } });
        if (!order)
            throw new common_1.BadRequestException('Order not found');
        await this.prisma.$transaction(async (tx) => {
            await tx.payment.create({
                data: {
                    provider,
                    orderId: intent.orderId,
                    intentId: intent.id,
                    amountCents: intent.amountCents,
                    status: 'SUCCEEDED',
                    transactionId: transactionId || txnRef
                }
            });
            await tx.order.update({ where: { id: intent.orderId }, data: { status: 'PAID' } });
            await tx.paymentIntent.update({ where: { id: intent.id }, data: { status: 'SUCCEEDED' } });
        });
        this.logger.log(`Payment marked as paid: ${provider} - ${txnRef}`);
        return { ok: true };
    }
    async createRefund(paymentId, amountCents, reason) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { order: true }
        });
        if (!payment)
            throw new common_1.BadRequestException('Payment not found');
        if (payment.status !== 'SUCCEEDED')
            throw new common_1.BadRequestException('Payment not succeeded');
        const refundAmount = amountCents || payment.amountCents;
        if (refundAmount > payment.amountCents) {
            throw new common_1.BadRequestException('Refund amount cannot exceed payment amount');
        }
        const existingRefunds = await this.prisma.refund.findMany({
            where: { paymentId: payment.id }
        });
        const totalRefunded = existingRefunds.reduce((sum, refund) => sum + refund.amountCents, 0);
        if (totalRefunded + refundAmount > payment.amountCents) {
            throw new common_1.BadRequestException('Total refund amount would exceed payment amount');
        }
        const refund = await this.prisma.refund.create({
            data: {
                paymentId: payment.id,
                amountCents: refundAmount,
                reason: reason || 'Customer request',
                status: 'PENDING'
            }
        });
        let refundResult;
        try {
            switch (payment.provider) {
                case 'VNPAY':
                    refundResult = await this.processVnpayRefund(payment, refund);
                    break;
                case 'MOMO':
                    refundResult = await this.processMomoRefund(payment, refund);
                    break;
                case 'PAYOS':
                    refundResult = await this.processPayosRefund(payment, refund);
                    break;
                default:
                    throw new Error('Unsupported payment provider for refund');
            }
            await this.prisma.refund.update({
                where: { id: refund.id },
                data: {
                    status: refundResult.success ? 'SUCCEEDED' : 'FAILED',
                    providerRefundId: refundResult.refundId,
                    processedAt: new Date()
                }
            });
            this.logger.log(`Refund processed: ${refund.id} - ${refundResult.success ? 'SUCCESS' : 'FAILED'}`);
            if (payment.order.userId) {
                this.logger.log(`Refund notification sent to user ${payment.order.userId}`);
            }
            return { refundId: refund.id, success: refundResult.success };
        }
        catch (error) {
            await this.prisma.refund.update({
                where: { id: refund.id },
                data: {
                    status: 'FAILED',
                    errorMessage: error?.message || 'Unknown error',
                    processedAt: new Date()
                }
            });
            this.logger.error(`Refund processing failed: ${error?.message}`);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Refund processing failed: ${error?.message || 'Unknown error'}`);
        }
    }
    async processVnpayRefund(payment, refund) {
        try {
            const vnpTmnCode = this.config.get('VNPAY_TMN_CODE') || '';
            const vnpHashSecret = this.config.get('VNPAY_HASH_SECRET') || '';
            const vnpRefundUrl = this.config.get('VNPAY_REFUND_URL') || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction';
            const createDate = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
            const ipAddr = '127.0.0.1';
            const params = {
                vnp_Command: 'refund',
                vnp_Version: '2.1.0',
                vnp_TmnCode: vnpTmnCode,
                vnp_TransactionType: '02',
                vnp_TxnRef: payment.transactionId,
                vnp_Amount: refund.amountCents * 100,
                vnp_OrderInfo: `Refund for transaction ${payment.transactionId}`,
                vnp_TransactionNo: payment.transactionId,
                vnp_TransactionDate: payment.createdAt.toISOString().slice(0, 19).replace(/[:-]/g, ''),
                vnp_CreateDate: createDate,
                vnp_IpAddr: ipAddr,
                vnp_CreateBy: 'system'
            };
            const sortedParams = Object.keys(params).sort();
            const queryString = sortedParams.map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
            const secureHash = crypto_1.default.createHmac('sha512', vnpHashSecret).update(queryString).digest('hex');
            const requestBody = queryString + `&vnp_SecureHash=${secureHash}`;
            const response = await fetch(vnpRefundUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: requestBody
            });
            const result = await response.text();
            const resultParams = new URLSearchParams(result);
            if (resultParams.get('vnp_ResponseCode') === '00') {
                const refundTransactionNo = resultParams.get('vnp_TransactionNo') || `vnpay_refund_${refund.id}`;
                this.logger.log(`VNPay refund successful: ${refundTransactionNo}`);
                return { success: true, refundId: refundTransactionNo };
            }
            else {
                const errorCode = resultParams.get('vnp_ResponseCode');
                this.logger.error(`VNPay refund failed: ${errorCode} - ${resultParams.get('vnp_Message')}`);
                return { success: false, refundId: null };
            }
        }
        catch (error) {
            this.logger.error(`VNPay refund error: ${error?.message}`);
            return { success: false, refundId: null };
        }
    }
    async processMomoRefund(payment, refund) {
        try {
            const partnerCode = this.config.get('MOMO_PARTNER_CODE') || '';
            const accessKey = this.config.get('MOMO_ACCESS_KEY') || '';
            const secretKey = this.config.get('MOMO_SECRET_KEY') || '';
            const endpoint = this.config.get('MOMO_REFUND_ENDPOINT') || 'https://test-payment.momo.vn/v2/gateway/api/refund';
            const requestId = `refund_${refund.id}_${Date.now()}`;
            const orderId = payment.transactionId;
            const amount = refund.amountCents;
            const transId = payment.transactionId;
            const description = refund.reason || 'Refund request';
            const rawSignature = `accessKey=${accessKey}&amount=${amount}&description=${description}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}&transId=${transId}`;
            const signature = crypto_1.default.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
            const requestBody = {
                partnerCode,
                accessKey,
                requestId,
                amount,
                orderId,
                transId,
                description,
                signature
            };
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            const result = await response.json();
            if (result.resultCode === 0) {
                return { success: true, refundId: result.transId };
            }
            else {
                this.logger.error(`MOMO refund failed: ${result.message}`);
                return { success: false, refundId: null };
            }
        }
        catch (error) {
            this.logger.error(`MOMO refund error: ${error?.message}`);
            return { success: false, refundId: null };
        }
    }
    async processPayosRefund(payment, refund) {
        try {
            const apiUrl = this.config.get('PAYOS_API_URL') || 'https://api.payos.vn';
            const clientId = this.config.get('PAYOS_CLIENT_ID') || '';
            const apiKey = this.config.get('PAYOS_API_KEY') || '';
            const checksumKey = this.config.get('PAYOS_CHECKSUM_KEY') || '';
            const refundUrl = `${apiUrl}/v2/payment-requests/${payment.transactionId}/refund`;
            const requestBody = {
                amount: refund.amountCents,
                description: refund.reason || `Refund for transaction ${payment.transactionId}`,
                cancelReason: 'Customer request'
            };
            const dataToSign = `${clientId}${payment.transactionId}${refund.amountCents}${checksumKey}`;
            const signature = crypto_1.default.createHmac('sha256', checksumKey).update(dataToSign).digest('hex');
            const response = await fetch(refundUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-id': clientId,
                    'x-api-key': apiKey,
                    'x-signature': signature
                },
                body: JSON.stringify(requestBody)
            });
            const result = await response.json();
            if (response.ok && result.code === 200) {
                this.logger.log(`PayOS refund successful: ${result.data?.id || `payos_refund_${refund.id}`}`);
                return { success: true, refundId: result.data?.id || `payos_refund_${refund.id}` };
            }
            else {
                this.logger.error(`PayOS refund failed: ${result.code} - ${result.desc}`);
                return { success: false, refundId: null };
            }
        }
        catch (error) {
            this.logger.error(`PayOS refund error: ${error?.message}`);
            return { success: false, refundId: null };
        }
    }
    async handleWebhook(provider, payload) {
        this.logger.log(`Received ${provider} webhook:`, payload);
        try {
            switch (provider) {
                case 'VNPAY':
                    return await this.handleVnpayWebhook(payload);
                case 'MOMO':
                    return await this.handleMomoWebhook(payload);
                case 'PAYOS':
                    return await this.handlePayosWebhook(payload);
                default:
                    throw new Error('Unsupported webhook provider');
            }
        }
        catch (error) {
            this.logger.error(`Webhook handling failed: ${error?.message}`);
            throw error;
        }
    }
    async handleVnpayWebhook(payload) {
        const { vnp_TxnRef, vnp_ResponseCode, vnp_TransactionNo } = payload;
        if (vnp_ResponseCode === '00') {
            await this.markPaid('VNPAY', vnp_TxnRef, vnp_TransactionNo);
            return { RspCode: '00', Message: 'success' };
        }
        else {
            await this.markFailed('VNPAY', vnp_TxnRef);
            return { RspCode: '00', Message: 'success' };
        }
    }
    async handleMomoWebhook(payload) {
        const { orderId, resultCode, transId } = payload;
        const order = await this.prisma.order.findUnique({ where: { orderNo: orderId } });
        if (!order) {
            this.logger.error(`MOMO webhook: order not found for orderNo=${orderId}`);
            return { resultCode: 0, message: 'ignored' };
        }
        const intent = await this.prisma.paymentIntent.findFirst({
            where: { orderId: order.id, provider: 'MOMO' },
            orderBy: { createdAt: 'desc' },
        });
        if (!intent) {
            this.logger.error(`MOMO webhook: intent not found for order=${order.id}`);
            return { resultCode: 0, message: 'ignored' };
        }
        if (resultCode === 0) {
            await this.markPaid('MOMO', intent.id, transId);
            return { resultCode: 0, message: 'success' };
        }
        else {
            await this.markFailed('MOMO', intent.id);
            return { resultCode: 0, message: 'success' };
        }
    }
    async handlePayosWebhook(payload) {
        const { orderCode, code, id } = payload;
        if (!orderCode) {
            this.logger.error('PayOS webhook: missing orderCode in payload');
            return { error: 1, message: 'Invalid payload: missing orderCode' };
        }
        const order = await this.prisma.order.findUnique({ where: { orderNo: orderCode } });
        if (!order) {
            this.logger.error(`PayOS webhook: order not found for orderNo=${orderCode}`);
            return { error: 0, message: 'ignored' };
        }
        const intent = await this.prisma.paymentIntent.findFirst({
            where: { orderId: order.id, provider: 'PAYOS' },
            orderBy: { createdAt: 'desc' },
        });
        if (!intent) {
            this.logger.error(`PayOS webhook: intent not found for order=${order.id}`);
            return { error: 0, message: 'ignored' };
        }
        if (code === '00') {
            await this.markPaid('PAYOS', intent.id, id);
            return { error: 0, message: 'success' };
        }
        else {
            await this.markFailed('PAYOS', intent.id);
            return { error: 0, message: 'success' };
        }
    }
    async markFailed(provider, txnRef) {
        if (!txnRef) {
            this.logger.error('markFailed: missing txnRef parameter');
            return;
        }
        const intent = await this.prisma.paymentIntent.findUnique({ where: { id: txnRef } });
        if (!intent)
            return;
        await this.prisma.paymentIntent.update({
            where: { id: intent.id },
            data: { status: 'FAILED' }
        });
        const _order = await this.prisma.order.findUnique({ where: { id: intent.orderId } });
        this.logger.log(`Payment marked as failed: ${provider} - ${txnRef}`);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map