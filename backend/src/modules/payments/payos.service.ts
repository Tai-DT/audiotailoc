import { Injectable, Logger, OnModuleInit, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import { TelegramService } from '../notifications/telegram.service';

// PayOS SDK type declaration
type PayOSType = new (
  clientId: string,
  apiKey: string,
  checksumKey: string,
  partnerCode: string,
) => any;

@Injectable()
export class PayOSService implements OnModuleInit {
  private readonly logger = new Logger(PayOSService.name);
  private payos: any;
  private enabled = false;

  private generatePayosOrderCode(): number {
    // PayOS requires a positive integer orderCode. Keep it well within JS safe integer range.
    // Use millisecond timestamp * 1000 + random suffix to avoid collisions.
    const suffix = crypto.randomInt(0, 1000); // 0..999
    const candidate = Date.now() * 1000 + suffix; // ~1e15, safe
    return Math.min(Math.max(candidate, 1), 9007199254740990);
  }

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    @Optional() private readonly telegramService?: TelegramService,
  ) {}

  async onModuleInit() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { PayOS } = require('@payos/node') as { PayOS: PayOSType };

      const { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY, PAYOS_PARTNER_CODE } =
        this.getPayOSConfig();

      // Allow booting without PayOS config (e.g., local dev)
      if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
        this.enabled = false;
        this.logger.warn(
          'PayOS disabled: Missing PAYOS_CLIENT_ID/PAYOS_API_KEY/PAYOS_CHECKSUM_KEY',
        );
        return;
      }

      // PayOS SDK constructor requires clientId, apiKey, checksumKey, and partnerCode
      this.payos = new PayOS(
        PAYOS_CLIENT_ID,
        PAYOS_API_KEY,
        PAYOS_CHECKSUM_KEY,
        PAYOS_PARTNER_CODE,
      );

      this.enabled = true;

      this.logger.log('PayOS SDK initialized successfully');
    } catch (error) {
      this.enabled = false;
      this.logger.error('Failed to initialize PayOS SDK (PayOS disabled)', error);
      // Do not throw: app should still start without PayOS
    }
  }

  private assertEnabled() {
    if (!this.enabled || !this.payos) {
      throw new Error(
        'PayOS is not configured. Please set PAYOS_CLIENT_ID/PAYOS_API_KEY/PAYOS_CHECKSUM_KEY.',
      );
    }
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
    idempotencyKey?: string;
  }) {
    this.assertEnabled();
    const makeDescription = (orderCode: number) => {
      let rawDescription = (paymentData.description || `Thanh toán ${orderCode}`).toString();
      rawDescription = rawDescription
        .replace(/[\r\n\t]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return rawDescription.substring(0, 25);
    };

    const isPayosAlreadyExists = (error: any) => {
      const errMsg = String(error?.message || '');
      const errData = error?.response?.data || error?.data || null;
      const code = errData?.code;
      return (
        code === 231 ||
        errMsg.includes('231') ||
        errMsg.includes('Đơn thanh toán đã tồn tại') ||
        String(errData?.desc || '').includes('Đơn thanh toán đã tồn tại')
      );
    };

    let lastError: any = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const finalOrderCode = this.generatePayosOrderCode();
      this.logger.log(
        `[PayOS] Generated orderCode for PayOS: ${finalOrderCode} (attempt ${attempt}/3)`,
      );

      try {
        const result = await this.payos.paymentRequests.create({
          orderCode: finalOrderCode,
          amount: paymentData.amount,
          description: makeDescription(finalOrderCode),
          buyerName: paymentData.buyerName,
          buyerEmail: paymentData.buyerEmail,
          buyerPhone: paymentData.buyerPhone || '',
          returnUrl: paymentData.returnUrl,
          cancelUrl: paymentData.cancelUrl,
        });

        this.logger.log(`PayOS payment link created: ${result.checkoutUrl}`);
        return {
          success: true,
          checkoutUrl: result.checkoutUrl,
          paymentRequestId: result.paymentRequestId,
          orderCode: result.orderCode || finalOrderCode,
          intentId: null,
        };
      } catch (error: any) {
        lastError = error;
        if (isPayosAlreadyExists(error) && attempt < 3) {
          this.logger.warn(
            '[PayOS] orderCode collision on PayOS (code 231). Retrying with a new orderCode.',
          );
          continue;
        }
        this.logger.error(`PayOS payment link creation error: ${String(error?.message || error)}`);
        break;
      }
    }

    throw lastError;
  }

  /**
   * Kiểm tra trạng thái thanh toán PayOS sử dụng SDK
   */
  async checkPaymentStatus(paymentRequestId: string) {
    this.assertEnabled();
    try {
      const result = await this.payos.paymentRequests.get(paymentRequestId);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(`PayOS status check error: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Xác thực webhook signature từ PayOS sử dụng SDK
   * Cho phép bypass trong môi trường phát triển khi gửi webhook thử nghiệm (webhookData._test === true)
   */
  verifyWebhookSignature(webhookData: any): boolean {
    try {
      this.assertEnabled();
      // ✅ FIX: Chỉ bypass khi có explicit test flag VÀ env variable cho phép
      const isTestWebhook = webhookData._test === true || webhookData.test === true;
      const allowTestBypass = process.env.PAYOS_ALLOW_TEST_WEBHOOK === 'true';

      if (isTestWebhook && allowTestBypass) {
        this.logger.warn('[PayOS] Webhook verification BYPASSED (test mode)');
        return true;
      }

      // Sử dụng SDK để verify webhook signature
      const isValid = this.payos.verifyPaymentWebhookData(webhookData);

      if (!isValid) {
        this.logger.error('[PayOS] Webhook signature verification FAILED', {
          orderCode: webhookData.orderCode || webhookData.data?.orderCode,
          hasSignature: !!webhookData.signature,
          timestamp: new Date().toISOString(),
        });
      }

      return isValid;
    } catch (error) {
      this.logger.error(`[PayOS] Webhook verification exception:`, error);

      // ✅ FIX: Trong development, cho phép webhook đi qua để debug
      if (process.env.NODE_ENV === 'development') {
        this.logger.warn('[PayOS] Allowing webhook in development mode despite error');
        return true;
      }

      return false;
    }
  }

  /**
   * Xử lý webhook từ PayOS sử dụng SDK
   */
  async handleWebhook(webhookData: any) {
    this.assertEnabled();
    // ✅ FIX: Log full payload để debug
    this.logger.log(`[PayOS Webhook] Received:`, JSON.stringify(webhookData));

    try {
      // Nếu là test webhook trên môi trường dev, chấp nhận payload trực tiếp
      let verifiedWebhookData;
      const isTestWebhook = webhookData._test === true || webhookData.test === true;
      const allowTestBypass = process.env.PAYOS_ALLOW_TEST_WEBHOOK === 'true';

      if (isTestWebhook && allowTestBypass) {
        verifiedWebhookData = webhookData;
        this.logger.log('[PayOS Webhook] Using test mode data');
      } else {
        // Sử dụng SDK để verify webhook
        verifiedWebhookData = this.payos.verifyPaymentWebhookData(webhookData);
      }

      const {
        orderCode,
        code,
        id: transactionId,
      } = verifiedWebhookData.data || verifiedWebhookData;
      // Coerce orderCode to string for internal lookups (PayOS may send numeric codes)
      const orderCodeStr = orderCode !== undefined && orderCode !== null ? String(orderCode) : null;

      // ✅ FIX: Validate orderCode presence
      if (!orderCodeStr) {
        this.logger.error('[PayOS Webhook] Invalid orderCode format:', orderCode);
        return { error: 1, message: 'Invalid orderCode format' };
      }

      // Validate code field
      if (!code) {
        this.logger.error('[PayOS Webhook] Missing code field');
        return { error: 1, message: 'Invalid webhook data: missing code' };
      }

      // Resolve via payment_intents first (PayOS orderCode is numeric and does not match our orderNo)
      let resolvedIntent: any = null;
      const paymentRequestIdCandidate =
        verifiedWebhookData.paymentRequestId ||
        verifiedWebhookData.data?.paymentRequestId ||
        transactionId;

      try {
        // Prefer matching by payosOrderCode stored by PaymentsService
        resolvedIntent = await this.prisma.payment_intents.findFirst({
          where: {
            provider: 'PAYOS',
            metadata: { contains: `\"payosOrderCode\":\"${orderCodeStr}\"` },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (!resolvedIntent && paymentRequestIdCandidate) {
          resolvedIntent = await this.prisma.payment_intents.findFirst({
            where: {
              provider: 'PAYOS',
              metadata: { contains: String(paymentRequestIdCandidate) },
            },
            orderBy: { createdAt: 'desc' },
          });
        }
      } catch (resolveErr) {
        this.logger.error(
          `[PayOS Webhook] Error while resolving payment_intent: ${(resolveErr as Error).message}`,
        );
        resolvedIntent = null;
      }

      if (!resolvedIntent) {
        this.logger.error(
          `[PayOS Webhook] No related payment_intent found for orderCode/paymentRequestId: ${orderCodeStr}`,
        );
        return { error: 1, message: 'Order not found' };
      }

      const order = await this.prisma.orders.findUnique({ where: { id: resolvedIntent.orderId } });
      if (!order) {
        this.logger.error(
          `[PayOS Webhook] Order not found for resolved intent ${resolvedIntent.id}`,
        );
        return { error: 1, message: 'Order not found' };
      }

      this.logger.log(
        `[PayOS Webhook] Resolved order ${order.id} via payment_intent ${resolvedIntent.id}`,
      );

      // ✅ FIX: Tìm payment intent và validate status (chỉ xử lý intent chưa hoàn thành)
      let intent = null;
      if (typeof resolvedIntent !== 'undefined' && resolvedIntent && resolvedIntent.id) {
        // If we resolved an intent earlier, use it (but ensure status is pending/processing)
        intent = resolvedIntent;
        if (!['PENDING', 'PROCESSING'].includes(intent.status)) {
          // If resolved intent is already final, set to null so we search by orderId
          intent = null;
        }
      }

      if (!intent) {
        intent = await this.prisma.payment_intents.findFirst({
          where: {
            orderId: order.id,
            provider: 'PAYOS',
            status: { in: ['PENDING', 'PROCESSING'] }, // Chỉ xử lý intent chưa hoàn thành
          },
          orderBy: { createdAt: 'desc' },
        });
      }

      if (!intent) {
        this.logger.warn(
          `[PayOS Webhook] No pending intent for order ${order.id} - may be already processed`,
        );
        // Có thể là webhook duplicate hoặc đã xử lý rồi
        return { error: 0, message: 'Already processed or no pending intent' };
      }

      // Xử lý và trả về chỉ thị cho PaymentsService
      if (code === '00') {
        return {
          status: 'PAID',
          intentId: intent.id,
          transactionId: transactionId || String(orderCode),
          amount: verifiedWebhookData.amount || intent.amountCents,
        };
      } else if (code === '01' || code === '02') {
        return {
          status: code === '02' ? 'CANCELLED' : 'FAILED',
          intentId: intent.id,
        };
      } else {
        return { status: 'UNKNOWN', code };
      }
    } catch (error) {
      this.logger.error(`PayOS webhook processing error: ${(error as Error).message}`);
      return { status: 'ERROR', message: (error as Error).message };
    }
  }

  // --- INTERNAL HELPER METHODS REMOVED AS THEY ARE NOW HANDLED BY PAYMENTSSERVICE ---

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
      let cancelReason =
        typeof cancelReasonRaw === 'string' ? cancelReasonRaw : JSON.stringify(cancelReasonRaw);
      // Loại bỏ control chars, gộp nhiều whitespace thành một khoảng, trim và giới hạn 255 ký tự
      cancelReason = cancelReason
        .replace(/[\u0000-\u001F\u007F]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 255);

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
        cancellation_reason: cancelReason,
      };

      // Debug: log payload được gửi tới PayOS (development only)
      this.logger.debug(`PayOS refund payload: ${JSON.stringify(refundDataPayload)}`);
      const result = await this.payos.paymentRequests.cancel(
        refundDataPayload.paymentRequestId,
        refundDataPayload,
      );

      this.logger.log(`PayOS refund successful: ${result.id}`);
      return {
        success: true,
        refundId: result.id,
        message: 'Refund processed successfully',
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
    const clientId = this.config.get<string>('PAYOS_CLIENT_ID') || '';
    const apiKey = this.config.get<string>('PAYOS_API_KEY') || '';
    const checksumKey = this.config.get<string>('PAYOS_CHECKSUM_KEY') || '';
    const partnerCode = this.config.get<string>('PAYOS_PARTNER_CODE') || '';
    const apiUrl = this.config.get<string>('PAYOS_API_URL') || '';

    return {
      PAYOS_CLIENT_ID: clientId,
      PAYOS_API_KEY: apiKey,
      PAYOS_CHECKSUM_KEY: checksumKey,
      PAYOS_PARTNER_CODE: partnerCode,
      PAYOS_API_URL:
        apiUrl ||
        (process.env.NODE_ENV === 'production'
          ? 'https://api.payos.vn'
          : 'https://api-merchant.payos.vn'),
    };
  }
}
