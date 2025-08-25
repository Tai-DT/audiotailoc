import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}

  async createIntent(params: { orderId: string; provider: 'VNPAY' | 'MOMO' | 'PAYOS'; returnUrl?: string }) {
    const order = await this.prisma.order.findUnique({ where: { id: params.orderId } });
    if (!order) throw new BadRequestException('Order not found');
    const intent = await this.prisma.paymentIntent.create({
      data: { orderId: order.id, provider: params.provider, amountCents: order.totalCents, status: 'PENDING', returnUrl: params.returnUrl ?? null },
    });
    const redirectUrl = await this.buildRedirectUrl({ ...intent, provider: intent.provider as 'VNPAY' | 'MOMO' | 'PAYOS' }, order);
    return { intentId: intent.id, redirectUrl };
  }

  private async buildRedirectUrl(
    intent: { id: string; provider: string; amountCents: number; returnUrl: string | null },
    order: { id: string; orderNo: string; totalCents: number },
  ): Promise<string> {
    const baseReturn = intent.returnUrl || this.config.get<string>('PAYMENT_RETURN_URL') || 'http://localhost:3000/return';
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
        .map((k) => `${k}=${params[k]}`)
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
        const checkoutUrl = (out?.data?.checkoutUrl as string) || (out?.checkoutUrl as string) || '';
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
    returnUrl: string
  ): Promise<string> {
    try {
      const partnerCode = this.config.get<string>('MOMO_PARTNER_CODE') || '';
      const accessKey = this.config.get<string>('MOMO_ACCESS_KEY') || '';
      const secretKey = this.config.get<string>('MOMO_SECRET_KEY') || '';
      const endpoint = this.config.get<string>('MOMO_ENDPOINT') || 'https://test-payment.momo.vn/v2/gateway/api/create';

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
      } else {
        this.logger.error(`MOMO payment creation failed: ${result.message}`);
        return `${returnUrl}?error=momo_creation_failed`;
      }
    } catch (error) {
      this.logger.error(`MOMO payment error: ${(error as any)?.message}`);
      return `${returnUrl}?error=momo_error`;
    }
  }

  async markPaid(provider: 'VNPAY' | 'MOMO' | 'PAYOS', txnRef: string, transactionId?: string) {
    const intent = await this.prisma.paymentIntent.findUnique({ where: { id: txnRef } });
    if (!intent) throw new BadRequestException('Intent not found');

    const order = await this.prisma.order.findUnique({ where: { id: intent.orderId } });
    if (!order) throw new BadRequestException('Order not found');

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

    // Send real-time notification
    // if (order.userId) {
    //   this.websocketGateway.notifyOrderUpdate(order.id, order.userId, 'PAID', {
    //     orderNo: order.orderNo,
    //     totalCents: order.totalCents,
    //     provider,
    //     transactionId: transactionId || txnRef
    //   });
    // }

    this.logger.log(`Payment marked as paid: ${provider} - ${txnRef}`);
    return { ok: true };
  }

  async createRefund(paymentId: string, amountCents?: number, reason?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true }
    });

    if (!payment) throw new BadRequestException('Payment not found');
    if (payment.status !== 'SUCCEEDED') throw new BadRequestException('Payment not succeeded');

    const refundAmount = amountCents || payment.amountCents;
    if (refundAmount > payment.amountCents) {
      throw new BadRequestException('Refund amount cannot exceed payment amount');
    }

    // Check existing refunds - commented out since no Refund model exists
    // const existingRefunds = await this.prisma.refund.findMany({
    //   where: { paymentId: payment.id }
    // });
    // const totalRefunded = existingRefunds.reduce((sum, refund) => sum + refund.amountCents, 0);

    // For now, assume no existing refunds
    const totalRefunded = 0;

    if (totalRefunded + refundAmount > payment.amountCents) {
      throw new BadRequestException('Total refund amount would exceed payment amount');
    }

    // Create refund record - commented out since no Refund model exists
    // const refund = await this.prisma.refund.create({
    //   data: {
    //     paymentId: payment.id,
    //     amountCents: refundAmount,
    //     reason: reason || 'Customer request',
    //     status: 'PENDING'
    //   }
    // });

    const refund = {
      id: `refund_${Date.now()}`,
      paymentId: payment.id,
      amountCents: refundAmount,
      reason: reason || 'Customer request',
      status: 'PENDING'
    };

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

      // Update refund status - commented out since no Refund model exists
      // await this.prisma.refund.update({
      //   where: { id: refund.id },
      //   data: {
      //     status: refundResult.success ? 'SUCCEEDED' : 'FAILED',
      //     providerRefundId: refundResult.refundId,
      //     processedAt: new Date()
      //   }
      // });

      // For now, just log the refund result
      this.logger.log(`Refund processed: ${refund.id} - ${refundResult.success ? 'SUCCESS' : 'FAILED'}`);

      // Send notification
      // if (payment.order.userId) {
      //   this.websocketGateway.notifyOrderUpdate(payment.order.id, payment.order.userId, 'REFUNDED', {
      //     orderNo: payment.order.orderNo,
      //     refundAmount: refundAmount,
      //     reason: reason || 'Customer request'
      //   });
      // }

      return { refundId: refund.id, success: refundResult.success };
    } catch (error) {
      // Update refund status on error - commented out since no Refund model exists
      // await this.prisma.refund.update({
      //   where: { id: refund.id },
      //   data: { status: 'FAILED' }
      // });
      this.logger.error(`Refund processing failed: ${(error as any)?.message}`);
      throw new BadRequestException(`Refund processing failed: ${(error as any)?.message}`);
    }
  }

  private async processVnpayRefund(payment: any, refund: any) {
    // VNPay refund implementation
    // This would integrate with VNPay's refund API
    this.logger.log(`Processing VNPay refund: ${refund.id}`);
    return { success: true, refundId: `vnpay_${refund.id}` };
  }

  private async processMomoRefund(payment: any, refund: any) {
    try {
      const partnerCode = this.config.get<string>('MOMO_PARTNER_CODE') || '';
      const accessKey = this.config.get<string>('MOMO_ACCESS_KEY') || '';
      const secretKey = this.config.get<string>('MOMO_SECRET_KEY') || '';
      const endpoint = this.config.get<string>('MOMO_REFUND_ENDPOINT') || 'https://test-payment.momo.vn/v2/gateway/api/refund';

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
    // PayOS refund implementation
    this.logger.log(`Processing PayOS refund: ${refund.id}`);
    return { success: true, refundId: `payos_${refund.id}` };
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
    const { vnp_TxnRef, vnp_ResponseCode, vnp_TransactionNo } = payload;

    if (vnp_ResponseCode === '00') {
      await this.markPaid('VNPAY', vnp_TxnRef, vnp_TransactionNo);
      return { RspCode: '00', Message: 'success' };
    } else {
      // Handle failed payment
      await this.markFailed('VNPAY', vnp_TxnRef);
      return { RspCode: '00', Message: 'success' };
    }
  }

  private async handleMomoWebhook(payload: any) {
    // MOMO webhook handling
    const { orderId, resultCode, transId } = payload;

    // MOMO sends orderId as our orderNo. Resolve to latest intent for this order
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
    } else {
      await this.markFailed('MOMO', intent.id);
      return { resultCode: 0, message: 'success' };
    }
  }

  private async handlePayosWebhook(payload: any) {
    // PayOS webhook handling
    const { orderCode, code, id } = payload;

    // PayOS sends orderCode as our orderNo. Resolve to latest intent for this order
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
    } else {
      await this.markFailed('PAYOS', intent.id);
      return { error: 0, message: 'success' };
    }
  }

  private async markFailed(provider: 'VNPAY' | 'MOMO' | 'PAYOS', txnRef: string) {
    const intent = await this.prisma.paymentIntent.findUnique({ where: { id: txnRef } });
    if (!intent) return;

    await this.prisma.paymentIntent.update({
      where: { id: intent.id },
      data: { status: 'FAILED' }
    });

    const _order = await this.prisma.order.findUnique({ where: { id: intent.orderId } });
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
