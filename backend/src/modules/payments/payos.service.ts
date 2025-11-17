import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

// Import PayOS SDK using require
const { PayOS } = require('@payos/node');

@Injectable()
export class PayOSService implements OnModuleInit {
  private readonly logger = new Logger(PayOSService.name);
  private payos: any;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async onModuleInit() {
    const { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY, PAYOS_PARTNER_CODE } = this.getPayOSConfig();
    
    // PayOS SDK constructor requires clientId, apiKey, checksumKey, and partnerCode
    this.payos = new PayOS(
      PAYOS_CLIENT_ID,
      PAYOS_API_KEY,
      PAYOS_CHECKSUM_KEY,
      PAYOS_PARTNER_CODE
    );
    
    this.logger.log('PayOS SDK initialized successfully');
  }

  /**
   * Tạo payment link với PayOS sử dụng SDK
   */
  async createPaymentLink(paymentData: {
    orderCode: string | number;
    amount: number;
    description: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone?: string;
    returnUrl: string;
    cancelUrl: string;
    userId?: string;
  }) {
    try {
      // Chuyển orderCode thành số nguyên dương
      const orderCodeNumber = typeof paymentData.orderCode === 'string'
        ? parseInt(paymentData.orderCode.replace(/\D/g, ''), 10) || Date.now()
        : paymentData.orderCode;
      
      // Đảm bảo orderCode là số nguyên dương và không quá lớn
      const finalOrderCode = Math.min(Math.max(orderCodeNumber, 1), 9007199254740990);

      // Sử dụng PayOS SDK để tạo payment link
      const paymentLinkData = {
        orderCode: finalOrderCode,
        amount: paymentData.amount,
        description: paymentData.description,
        buyerName: paymentData.buyerName,
        buyerEmail: paymentData.buyerEmail,
        buyerPhone: paymentData.buyerPhone || '',
        returnUrl: paymentData.returnUrl,
        cancelUrl: paymentData.cancelUrl
      };

      const result = await this.payos.paymentRequests.create(paymentLinkData);
      
      this.logger.log(`PayOS payment link created: ${result.checkoutUrl}`);
      return {
        success: true,
        checkoutUrl: result.checkoutUrl,
        paymentRequestId: result.paymentRequestId,
        orderCode: result.orderCode
      };

    } catch (error) {
      this.logger.error(`PayOS payment link creation error: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán PayOS sử dụng SDK
   */
  async checkPaymentStatus(paymentRequestId: string) {
    try {
      const result = await this.payos.paymentRequests.get(paymentRequestId);
      
      return {
        success: true,
        data: result
      };

    } catch (error) {
      this.logger.error(`PayOS status check error: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Xác thực webhook signature từ PayOS sử dụng SDK
   */
  verifyWebhookSignature(webhookData: any): boolean {
    try {
      // Sử dụng SDK để verify webhook signature
      const isValid = this.payos.verifyPaymentWebhookData(webhookData);
      return isValid;
    } catch (error) {
      this.logger.error(`PayOS webhook signature verification error: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Xử lý webhook từ PayOS sử dụng SDK
   */
  async handleWebhook(webhookData: any) {
    this.logger.log(`PayOS webhook received:`, webhookData);

    try {
      // Sử dụng SDK để verify webhook
      const verifiedWebhookData = this.payos.verifyPaymentWebhookData(webhookData);
      
      const { orderCode, code, description, id: transactionId } = verifiedWebhookData.data || verifiedWebhookData;

      // Validate required fields
      if (!orderCode || !code) {
        this.logger.error('PayOS webhook: missing required fields');
        return { error: 1, message: 'Invalid webhook data' };
      }

      // Tìm order theo orderCode
      const order = await this.prisma.orders.findUnique({
        where: { orderNo: orderCode }
      });

      if (!order) {
        this.logger.error(`PayOS webhook: order not found for orderCode=${orderCode}`);
        return { error: 0, message: 'Order not found' };
      }

      // Tìm payment intent
      const intent = await this.prisma.payment_intents.findFirst({
        where: { orderId: order.id, provider: 'PAYOS' },
        orderBy: { createdAt: 'desc' }
      });

      if (!intent) {
        this.logger.error(`PayOS webhook: payment intent not found for order=${order.id}`);
        return { error: 0, message: 'Payment intent not found' };
      }

      // Xử lý theo status
      if (code === '00') {
        // Thanh toán thành công
        await this.markPaymentAsPaid(intent, transactionId);
        return { error: 0, message: 'Payment successful' };
      } else if (code === '01') {
        // Thanh toán thất bại
        await this.markPaymentAsFailed(intent);
        return { error: 0, message: 'Payment failed' };
      } else if (code === '02') {
        // Thanh toán bị hủy
        await this.markPaymentAsCancelled(intent);
        return { error: 0, message: 'Payment cancelled' };
      } else {
        // Status khác
        this.logger.warn(`PayOS webhook: unknown status code=${code}`);
        return { error: 0, message: 'Unknown status' };
      }

    } catch (error) {
      this.logger.error(`PayOS webhook processing error: ${(error as Error).message}`);
      return { error: 1, message: 'Webhook processing failed' };
    }
  }

  /**
   * Hoàn tiền với PayOS sử dụng SDK
   */
  async processRefund(refundData: {
    transactionId: string;
    amount: number;
    description?: string;
    cancelReason?: string;
  }) {
    try {
      // Giới hạn và chuẩn hoá cancelReason để tránh lỗi validation từ PayOS
      const cancelReasonRaw = refundData.cancelReason ?? 'Customer request';
      let cancelReason = typeof cancelReasonRaw === 'string' ? cancelReasonRaw : JSON.stringify(cancelReasonRaw);
      // Loại bỏ control chars, gộp nhiều whitespace thành một khoảng, trim và giới hạn 255 ký tự
      cancelReason = cancelReason.replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 255);

      // Đảm bảo amount là số nguyên (PayOS có thể yêu cầu integer)
      const amountValue = Number(refundData.amount) || 0;
      const normalizedAmount = Math.round(amountValue);

      const refundDataPayload = {
        paymentRequestId: refundData.transactionId,
        amount: normalizedAmount,
        description: refundData.description || `Refund for transaction ${refundData.transactionId}`,
        // Gửi nhiều biến thể tên trường để tương thích với các phiên bản API/SDK khác nhau
        cancellationReason: cancelReason,
        cancelReason: cancelReason,
        cancellation_reason: cancelReason
      };

      // Debug: log payload được gửi tới PayOS (development only)
      this.logger.debug(`PayOS refund payload: ${JSON.stringify(refundDataPayload)}`);
      const result = await this.payos.paymentRequests.cancel(refundDataPayload.paymentRequestId, refundDataPayload);
      
      this.logger.log(`PayOS refund successful: ${result.id}`);
      return {
        success: true,
        refundId: result.id,
        message: 'Refund processed successfully'
      };

    } catch (error) {
      this.logger.error(`PayOS refund processing error: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Lấy cấu hình PayOS
   */
  private getPayOSConfig() {
    const clientId = this.config.get<string>('PAYOS_CLIENT_ID');
    const apiKey = this.config.get<string>('PAYOS_API_KEY');
    const checksumKey = this.config.get<string>('PAYOS_CHECKSUM_KEY');
    const partnerCode = this.config.get<string>('PAYOS_PARTNER_CODE');
    const apiUrl = this.config.get<string>('PAYOS_API_URL');

    if (!clientId || !apiKey || !checksumKey) {
      throw new Error('PayOS configuration is missing. Please check environment variables.');
    }

    return {
      PAYOS_CLIENT_ID: clientId,
      PAYOS_API_KEY: apiKey,
      PAYOS_CHECKSUM_KEY: checksumKey,
      PAYOS_PARTNER_CODE: partnerCode,
      PAYOS_API_URL: apiUrl || (process.env.NODE_ENV === 'production' ? 'https://api.payos.vn' : 'https://api-merchant.payos.vn')
    };
  }

  /**
   * Đánh dấu thanh toán thành công
   */
  private async markPaymentAsPaid(intent: any, transactionId: string) {
    await this.prisma.$transaction(async (tx) => {
      // Tạo payment record
      await tx.payments.create({
        data: {
          id: crypto.randomUUID(),
          provider: 'PAYOS',
          orderId: intent.orderId,
          intentId: intent.id,
          amountCents: intent.amountCents,
          status: 'SUCCEEDED',
          transactionId: transactionId,
          updatedAt: new Date()
        }
      });

      // Cập nhật order status
      await tx.orders.update({
        where: { id: intent.orderId },
        data: { status: 'CONFIRMED' }
      });

      // Cập nhật payment intent status
      await tx.payment_intents.update({
        where: { id: intent.id },
        data: { status: 'SUCCEEDED' }
      });
    });

    this.logger.log(`PayOS payment marked as paid: ${intent.id} - ${transactionId}`);
  }

  /**
   * Đánh dấu thanh toán thất bại
   */
  private async markPaymentAsFailed(intent: any) {
    await this.prisma.payment_intents.update({
      where: { id: intent.id },
      data: { status: 'FAILED' }
    });

    this.logger.log(`PayOS payment marked as failed: ${intent.id}`);
  }

  /**
   * Đánh dấu thanh toán bị hủy
   */
  private async markPaymentAsCancelled(intent: any) {
    await this.prisma.payment_intents.update({
      where: { id: intent.id },
      data: { status: 'CANCELLED' }
    });

    this.logger.log(`PayOS payment marked as cancelled: ${intent.id}`);
  }
}