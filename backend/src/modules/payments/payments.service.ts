import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import { PayOSService } from './payos.service';
import { MailService } from '../notifications/mail.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly payos: PayOSService,
    private readonly mailService: MailService,
  ) {}

  async createIntent(params: {
    orderId: string;
    provider: 'PAYOS' | 'COD';
    idempotencyKey?: string;
    returnUrl?: string;
  }) {
    const order = await this.prisma.orders.findUnique({ where: { id: params.orderId } });
    if (!order) throw new BadRequestException('Order not found');

    if (!params.idempotencyKey || params.idempotencyKey.length < 8) {
      throw new BadRequestException('idempotencyKey is required');
    }

    // Idempotency: if an intent already exists for this order+provider+key, return it
    const existingIntent = await this.prisma.payment_intents.findFirst({
      where: {
        orderId: order.id,
        provider: params.provider,
        metadata: {
          contains: params.idempotencyKey,
        },
        status: { in: ['PENDING', 'PROCESSING', 'SUCCEEDED'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingIntent) {
      let redirectUrl: string | null = null;
      try {
        const meta = existingIntent.metadata ? JSON.parse(existingIntent.metadata) : {};
        redirectUrl = meta?.checkoutUrl || null;
      } catch {
        redirectUrl = null;
      }
      return { intentId: existingIntent.id, redirectUrl };
    }

    const intent = await this.prisma.payment_intents.create({
      data: {
        id: randomUUID(),
        orderId: order.id,
        provider: params.provider,
        amountCents: order.totalCents,
        status: 'PENDING',
        returnUrl: params.returnUrl ?? null,
        metadata: JSON.stringify({ idempotencyKey: params.idempotencyKey }),
        updatedAt: new Date(),
      },
    });
    // For COD, no redirect needed
    if (params.provider === 'COD') {
      await this.prisma.orders.update({
        where: { id: order.id },
        data: {
          status: 'CONFIRMED',
        },
      });
      // Update payment intent to mark COD
      await this.prisma.payment_intents.update({
        where: { id: intent.id },
        data: {
          status: 'PENDING',
          metadata: JSON.stringify({ paymentMethod: 'COD', idempotencyKey: params.idempotencyKey }),
        },
      });
      return { intentId: intent.id, redirectUrl: null, paymentMethod: 'COD' };
    }

    // PAYOS: create checkout link with SDK, persist identifiers in intent.metadata
    try {
      const baseReturn =
        params.returnUrl ||
        this.config.get<string>('PAYMENT_RETURN_URL') ||
        'http://localhost:3000/return';

      const user = order.userId
        ? await this.prisma.users.findUnique({ where: { id: order.userId } })
        : null;

      const payosResult = await this.payos.createPaymentLink({
        orderCode: order.orderNo,
        amount: order.totalCents,
        description: `Thanh toan ${order.orderNo}`,
        buyerName: user?.name || user?.email || 'Customer',
        buyerEmail: user?.email || 'no-reply@audiotailoc.com',
        buyerPhone: user?.phone || undefined,
        returnUrl: baseReturn,
        cancelUrl: baseReturn,
        userId: order.userId || undefined,
        idempotencyKey: params.idempotencyKey,
      });

      // Update the intent created by this service with PayOS identifiers/checkoutUrl
      const updatedMeta = {
        idempotencyKey: params.idempotencyKey,
        checkoutUrl: payosResult.checkoutUrl,
        payosPaymentRequestId: payosResult.paymentRequestId,
        payosOrderCode: String(payosResult.orderCode),
      };
      await this.prisma.payment_intents.update({
        where: { id: intent.id },
        data: {
          status: 'PROCESSING',
          metadata: JSON.stringify(updatedMeta),
          updatedAt: new Date(),
        },
      });

      return { intentId: intent.id, redirectUrl: payosResult.checkoutUrl };
    } catch (e) {
      this.logger.error(`PAYOS create intent failed: ${(e as Error).message}`);
      // fallback
      const redirectUrl = await this.buildRedirectUrl(
        { ...intent, provider: intent.provider as 'PAYOS' },
        order,
      );
      return { intentId: intent.id, redirectUrl };
    }
  }

  private async buildRedirectUrl(
    intent: { id: string; provider: string; amountCents: number; returnUrl: string | null },
    order: { id: string; orderNo: string; totalCents: number },
  ): Promise<string> {
    const baseReturn =
      intent.returnUrl ||
      this.config.get<string>('PAYMENT_RETURN_URL') ||
      'http://localhost:3000/return';
    if (intent.provider === 'VNPAY') {
      const tmnCode = this.config.get<string>('VNPAY_TMN_CODE') || 'TEST';
      const secret = this.config.get<string>('VNPAY_HASH_SECRET') || 'secret';
      const params: Record<string, string> = {
        vnp_Amount: String(intent.amountCents),
        vnp_TmnCode: tmnCode,
        vnp_TxnRef: intent.id,
        vnp_ReturnUrl: baseReturn,
      };
      const signData = Object.keys(params)
        .sort()
        .map(k => `${k}=${params[k]}`)
        .join('&');
      const vnp_SecureHash = crypto.createHmac('sha256', secret).update(signData).digest('hex');
      return `${this.config.get('VNPAY_PAY_URL') || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'}?${signData}&vnp_SecureHash=${vnp_SecureHash}`;
    }
    if (intent.provider === 'PAYOS') {
      const apiUrl = this.config.get<string>('PAYOS_API_URL') || 'https://api.payos.vn';
      const clientId = this.config.get<string>('PAYOS_CLIENT_ID') || '';
      const apiKey = this.config.get<string>('PAYOS_API_KEY') || '';
      const checksumKey = this.config.get<string>('PAYOS_CHECKSUM_KEY') || '';
      const partnerCode = this.config.get<string>('PAYOS_PARTNER_CODE') || '';
      try {
        const payload: any = {
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
        const sig = crypto.createHmac('sha256', checksumKey).update(dataStr).digest('hex');
        const headers: Record<string, string> = {
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
        const checkoutUrl =
          (out?.data?.checkoutUrl as string) || (out?.checkoutUrl as string) || '';
        if (checkoutUrl) return checkoutUrl;
      } catch {}
      // fallback
      return `${baseReturn}?payos_txn=${encodeURIComponent(intent.id)}`;
    }
    // MOMO integration
    if (intent.provider === 'MOMO') {
      return await this.createMomoPayment(intent, order, baseReturn);
    }

    // Fallback
    return `${baseReturn}?error=unsupported_provider`;
  }

  private async createMomoPayment(
    intent: { id: string; amountCents: number },
    order: { id: string; orderNo: string },
    returnUrl: string,
  ): Promise<string> {
    try {
      const partnerCode = this.config.get<string>('MOMO_PARTNER_CODE') || '';
      const accessKey = this.config.get<string>('MOMO_ACCESS_KEY') || '';
      const secretKey = this.config.get<string>('MOMO_SECRET_KEY') || '';
      const endpoint =
        this.config.get<string>('MOMO_ENDPOINT') ||
        'https://test-payment.momo.vn/v2/gateway/api/create';

      const requestId = `${intent.id}_${Date.now()}`;
      const orderId = order.orderNo || intent.id;
      const orderInfo = `Thanh toán đơn hàng ${order.orderNo}`;
      const redirectUrl = returnUrl;
      const ipnUrl = `${this.config.get('API_BASE_URL')}/webhooks/momo`;
      const amount = intent.amountCents;
      const requestType = 'payWithATM';
      const extraData = '';

      // Create signature
      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
      const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

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
        lang: 'vi',
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.resultCode === 0 && result.payUrl) {
        this.logger.log(`MOMO payment created for order ${orderId}: ${result.payUrl}`);
        return result.payUrl;
      } else {
        this.logger.error(`MOMO payment creation failed: ${result.message}`);
        return `${returnUrl}?error=momo_creation_failed`;
      }
    } catch (error) {
      this.logger.error(`MOMO payment error: ${(error as any)?.message}`);
      return `${returnUrl}?error=momo_error`;
    }
  }

  async markPaid(
    provider: 'VNPAY' | 'MOMO' | 'PAYOS',
    txnRef: string,
    transactionId?: string,
    amountCents?: number,
  ) {
    const intent = await this.prisma.payment_intents.findUnique({ where: { id: txnRef } });
    if (!intent) throw new BadRequestException('Intent not found');

    const order = await this.prisma.orders.findUnique({ where: { id: intent.orderId } });
    if (!order) throw new BadRequestException('Order not found');

    // SECURITY: Verify that the paid amount matches the intended amount
    if (amountCents !== undefined && amountCents !== null) {
      if (amountCents !== intent.amountCents) {
        this.logger.error(
          `Payment amount mismatch for intent ${intent.id}: expected ${intent.amountCents}, received ${amountCents}`,
        );
        throw new BadRequestException('Payment amount mismatch');
      }
    }

    await this.prisma.$transaction(async tx => {
      await tx.payments.create({
        data: {
          id: randomUUID(),
          provider,
          orderId: intent.orderId,
          intentId: intent.id,
          amountCents: amountCents || intent.amountCents,
          status: 'SUCCEEDED',
          transactionId: transactionId || txnRef,
          updatedAt: new Date(),
        },
      });
      // ✅ Change status to CONFIRMED instead of PAID
      await tx.orders.update({ where: { id: intent.orderId }, data: { status: 'CONFIRMED' } });
      await tx.payment_intents.update({ where: { id: intent.id }, data: { status: 'SUCCEEDED' } });
    });

    this.logger.log(`Payment marked as paid: ${provider} - ${txnRef}`);
    return { ok: true };
  }

  async createRefund(paymentId: string, amountCents?: number, reason?: string) {
    const payment = await this.prisma.payments.findUnique({
      where: { id: paymentId },
      include: { orders: true },
    });

    if (!payment) throw new BadRequestException('Payment not found');
    if (payment.status !== 'SUCCEEDED') throw new BadRequestException('Payment not succeeded');

    // ✅ Validate refund amount properly
    if (amountCents === undefined || amountCents === null || amountCents <= 0) {
      throw new BadRequestException('Refund amount must be a positive number');
    }

    if (amountCents > payment.amountCents) {
      throw new BadRequestException('Refund amount cannot exceed payment amount');
    }

    // Check existing refunds
    const existingRefunds = await this.prisma.refunds.findMany({
      where: { paymentId: payment.id },
    });
    const totalRefunded = existingRefunds.reduce((sum, refund) => sum + refund.amountCents, 0);

    if (totalRefunded + amountCents > payment.amountCents) {
      throw new BadRequestException('Total refund amount would exceed payment amount');
    }

    // Create refund record
    const refund = await this.prisma.refunds.create({
      data: {
        id: randomUUID(),
        paymentId: payment.id,
        amountCents: amountCents,
        reason: reason || 'Customer request',
        status: 'PENDING',
        updatedAt: new Date(),
      },
    });

    // Process refund based on provider
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

      // Update refund status
      await this.prisma.refunds.update({
        where: { id: refund.id },
        data: {
          status: refundResult.success ? 'SUCCEEDED' : 'FAILED',
          providerRefundId: refundResult.refundId,
          processedAt: new Date(),
        },
      });

      this.logger.log(
        `Refund processed: ${refund.id} - ${refundResult.success ? 'SUCCESS' : 'FAILED'}`,
      );

      // Send notification if order user exists
      if (payment.orderId) {
        try {
          const order = await this.prisma.orders.findUnique({
            where: { id: payment.orderId },
            include: { users: true },
          });
          if (order?.users?.email) {
            await this.mailService.send(
              order.users.email,
              `Hoàn tiền cho đơn hàng #${order.orderNo}`,
              `Chúng tôi đã thực hiện hoàn tiền ${amountCents / 100} cho đơn hàng #${order.orderNo}.`,
              `<h1>Thông báo hoàn tiền</h1>
               <p>Xin chào ${order.users.name || 'quý khách'},</p>
               <p>Chúng tôi đã thực hiện hoàn tiền cho đơn hàng <strong>#${order.orderNo}</strong>.</p>
               <p>Số tiền: <strong>${(amountCents / 100).toLocaleString('vi-VN')} VND</strong></p>
               <p>Lý do: ${reason || 'Yêu cầu từ khách hàng'}</p>
               <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>`,
            );
          }
        } catch (mailError) {
          this.logger.error(`Failed to send refund notification: ${(mailError as Error).message}`);
        }
        this.logger.log(`Refund notification sent for order ${payment.orderId}`);
      }

      return { refundId: refund.id, success: refundResult.success };
    } catch (error) {
      // Update refund status on error
      await this.prisma.refunds.update({
        where: { id: refund.id },
        data: {
          status: 'FAILED',
          errorMessage: (error as any)?.message || 'Unknown error',
          processedAt: new Date(),
        },
      });

      this.logger.error(`Refund processing failed: ${(error as any)?.message}`);

      // Throw appropriate exception based on error type
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        `Refund processing failed: ${(error as any)?.message || 'Unknown error'}`,
      );
    }
  }

  private async processVnpayRefund(payment: any, refund: any) {
    try {
      const vnpTmnCode = this.config.get<string>('VNPAY_TMN_CODE') || '';
      const vnpHashSecret = this.config.get<string>('VNPAY_HASH_SECRET') || '';
      const vnpRefundUrl =
        this.config.get<string>('VNPAY_REFUND_URL') ||
        'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction';

      const createDate = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const ipAddr = '127.0.0.1'; // In production, get from request

      // Create refund request parameters
      const params = {
        vnp_Command: 'refund',
        vnp_Version: '2.1.0',
        vnp_TmnCode: vnpTmnCode,
        vnp_TransactionType: '02', // 02 for full refund, 03 for partial
        vnp_TxnRef: payment.transactionId,
        vnp_Amount: refund.amountCents, // ✅ Already in cents, don't multiply by 100
        vnp_OrderInfo: `Refund for transaction ${payment.transactionId}`,
        vnp_TransactionNo: payment.transactionId,
        vnp_TransactionDate: payment.createdAt.toISOString().slice(0, 19).replace(/[:-]/g, ''),
        vnp_CreateDate: createDate,
        vnp_IpAddr: ipAddr,
        vnp_CreateBy: 'system',
      };

      // Create secure hash
      const sortedParams = Object.keys(params).sort();
      const queryString = sortedParams
        .map(key => `${key}=${encodeURIComponent((params as any)[key])}`)
        .join('&');
      const secureHash = crypto
        .createHmac('sha512', vnpHashSecret)
        .update(queryString)
        .digest('hex');

      const requestBody = queryString + `&vnp_SecureHash=${secureHash}`;

      const response = await fetch(vnpRefundUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody,
      });

      const result = await response.text();
      const resultParams = new URLSearchParams(result);

      if (resultParams.get('vnp_ResponseCode') === '00') {
        const refundTransactionNo =
          resultParams.get('vnp_TransactionNo') || `vnpay_refund_${refund.id}`;
        this.logger.log(`VNPay refund successful: ${refundTransactionNo}`);
        return { success: true, refundId: refundTransactionNo };
      } else {
        const errorCode = resultParams.get('vnp_ResponseCode');
        this.logger.error(`VNPay refund failed: ${errorCode} - ${resultParams.get('vnp_Message')}`);
        return { success: false, refundId: null };
      }
    } catch (error) {
      this.logger.error(`VNPay refund error: ${(error as any)?.message}`);
      return { success: false, refundId: null };
    }
  }

  private async processMomoRefund(payment: any, refund: any) {
    try {
      const partnerCode = this.config.get<string>('MOMO_PARTNER_CODE') || '';
      const accessKey = this.config.get<string>('MOMO_ACCESS_KEY') || '';
      const secretKey = this.config.get<string>('MOMO_SECRET_KEY') || '';
      const endpoint =
        this.config.get<string>('MOMO_REFUND_ENDPOINT') ||
        'https://test-payment.momo.vn/v2/gateway/api/refund';

      const requestId = `refund_${refund.id}_${Date.now()}`;
      const orderId = payment.transactionId;
      const amount = refund.amountCents;
      const transId = payment.transactionId;
      const description = refund.reason || 'Refund request';

      // Create signature for refund
      const rawSignature = `accessKey=${accessKey}&amount=${amount}&description=${description}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}&transId=${transId}`;
      const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

      const requestBody = {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        transId,
        description,
        signature,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.resultCode === 0) {
        return { success: true, refundId: result.transId };
      } else {
        this.logger.error(`MOMO refund failed: ${result.message}`);
        return { success: false, refundId: null };
      }
    } catch (error) {
      this.logger.error(`MOMO refund error: ${(error as any)?.message}`);
      return { success: false, refundId: null };
    }
  }

  private async processPayosRefund(payment: any, refund: any) {
    try {
      const result = await this.payos.processRefund({
        transactionId: String(payment.transactionId || ''),
        amount: refund.amountCents,
        description: refund.reason || `Refund for transaction ${payment.transactionId}`,
        cancelReason: 'Customer request',
      });

      return { success: !!result.success, refundId: result.refundId || null };
    } catch (error) {
      this.logger.error(`PayOS refund error: ${(error as any)?.message}`);
      return { success: false, refundId: null };
    }
  }

  async handleWebhook(provider: 'VNPAY' | 'MOMO' | 'PAYOS', payload: any) {
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
    } catch (error) {
      this.logger.error(`Webhook handling failed: ${(error as any)?.message}`);
      throw error;
    }
  }

  private async handleVnpayWebhook(payload: any) {
    // VNPay webhook handling
    const { vnp_TxnRef, vnp_ResponseCode, vnp_TransactionNo, vnp_SecureHash, vnp_Amount } = payload;

    // SECURITY: Validate VNPay signature
    const secret = this.config.get<string>('VNPAY_HASH_SECRET') || 'secret';
    const sortedPayload = Object.keys(payload)
      .filter(key => key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType')
      .sort()
      .reduce((obj: any, key) => {
        obj[key] = payload[key];
        return obj;
      }, {});

    const signData = Object.keys(sortedPayload)
      .map(key => `${key}=${encodeURIComponent(sortedPayload[key]).replace(/%20/g, '+')}`)
      .join('&');

    const calculatedHash = crypto.createHmac('sha512', secret).update(signData).digest('hex');

    if (calculatedHash.toLowerCase() !== (vnp_SecureHash || '').toLowerCase()) {
      this.logger.error(
        `VNPay webhook: invalid signature. Expected ${calculatedHash}, got ${vnp_SecureHash}`,
      );
      throw new BadRequestException('Invalid signature');
    }

    if (vnp_ResponseCode === '00') {
      await this.markPaid('VNPAY', vnp_TxnRef, vnp_TransactionNo, Number(vnp_Amount));
      return { RspCode: '00', Message: 'success' };
    } else {
      // Handle failed payment
      await this.markFailed('VNPAY', vnp_TxnRef);
      return { RspCode: '00', Message: 'success' };
    }
  }

  private async handleMomoWebhook(payload: any) {
    // MOMO webhook handling
    const { orderId, resultCode, transId, amount, signature } = payload;

    // SECURITY: Validate MOMO signature
    const secretKey = this.config.get<string>('MOMO_SECRET_KEY') || '';
    const rawSignature = `accessKey=${this.config.get('MOMO_ACCESS_KEY')}&amount=${amount}&extraData=${payload.extraData || ''}&message=${payload.message || ''}&orderId=${orderId}&orderInfo=${payload.orderInfo || ''}&orderType=${payload.orderType || ''}&partnerCode=${payload.partnerCode || ''}&payType=${payload.payType || ''}&requestId=${payload.requestId || ''}&responseTime=${payload.responseTime || ''}&resultCode=${resultCode}&transId=${transId}`;

    const calculatedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    if (calculatedSignature !== signature) {
      this.logger.error(
        `MOMO webhook: invalid signature. Expected ${calculatedSignature}, got ${signature}`,
      );
      throw new BadRequestException('Invalid signature');
    }

    // MOMO sends orderId as our orderNo. Resolve to latest intent for this order
    const order = await this.prisma.orders.findUnique({ where: { orderNo: orderId } });
    if (!order) {
      this.logger.error(`MOMO webhook: order not found for orderNo=${orderId}`);
      return { resultCode: 0, message: 'ignored' };
    }

    const intent = await this.prisma.payment_intents.findFirst({
      where: { orderId: order.id, provider: 'MOMO' },
      orderBy: { createdAt: 'desc' },
    });

    if (!intent) {
      this.logger.error(`MOMO webhook: intent not found for order=${order.id}`);
      return { resultCode: 0, message: 'ignored' };
    }

    if (resultCode === 0) {
      await this.markPaid('MOMO', intent.id, transId, Number(amount));
      return { resultCode: 0, message: 'success' };
    } else {
      await this.markFailed('MOMO', intent.id);
      return { resultCode: 0, message: 'success' };
    }
  }

  private async handlePayosWebhook(payload: any) {
    // Delegate to SDK-based handler which validates signature and resolves intents
    return await this.payos.handleWebhook(payload);
  }

  private async markFailed(provider: 'VNPAY' | 'MOMO' | 'PAYOS', txnRef: string) {
    // Validate txnRef parameter
    if (!txnRef) {
      this.logger.error('markFailed: missing txnRef parameter');
      return;
    }

    const intent = await this.prisma.payment_intents.findUnique({ where: { id: txnRef } });
    if (!intent) return;

    await this.prisma.payment_intents.update({
      where: { id: intent.id },
      data: { status: 'FAILED' },
    });

    const _order = await this.prisma.orders.findUnique({ where: { id: intent.orderId } });
    // if (order?.userId) {
    //   this.websocketGateway.notifyOrderUpdate(order.id, order.userId, 'PAYMENT_FAILED', {
    //     orderNo: order.orderNo,
    //     provider,
    //     reason: 'Payment failed'
    //   });
    // }

    this.logger.log(`Payment marked as failed: ${provider} - ${txnRef}`);
  }
}
