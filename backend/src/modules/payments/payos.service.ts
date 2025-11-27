import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

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

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { PayOS } = require('@payos/node') as { PayOS: PayOSType };

      const { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY, PAYOS_PARTNER_CODE } =
        this.getPayOSConfig();

      // PayOS SDK constructor requires clientId, apiKey, checksumKey, and partnerCode
      this.payos = new PayOS(PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY, PAYOS_PARTNER_CODE);

      this.logger.log('PayOS SDK initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize PayOS SDK', error);
      throw error;
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
  }) {
    // ✅ FIX: Chuyển orderCode thành số nguyên dương với random suffix để tránh duplicate
    // Khai báo ngoài try để có thể dùng trong catch
    const baseTimestamp =
      typeof paymentData.orderCode === 'string'
        ? parseInt(paymentData.orderCode.replace(/\D/g, ''), 10) || Date.now()
        : paymentData.orderCode;

    // Thêm random 3 digits (000-999) để tránh duplicate khi nhiều order cùng lúc
    const randomSuffix = Math.floor(Math.random() * 1000);
    const orderCodeWithSuffix = parseInt(`${baseTimestamp}${randomSuffix}`);

    // Đảm bảo orderCode là số nguyên dương và không quá lớn
    const finalOrderCode = Math.min(Math.max(orderCodeWithSuffix, 1), 9007199254740990);

    this.logger.log(`[PayOS] OrderCode mapping: ${paymentData.orderCode} -> ${finalOrderCode}`);

    // Persist a payment_intent mapping before creating the PayOS payment link so webhooks can be resolved
    // createdIntent will be updated after PayOS returns identifiers
    let createdIntent: any = null;
    try {
      const orderRecord = await this.prisma.orders.findUnique({
        where: { orderNo: paymentData.orderCode.toString() },
      });

      if (orderRecord) {
        try {
          createdIntent = await this.prisma.payment_intents.create({
            data: {
              id: crypto.randomUUID(),
              provider: 'PAYOS',
              // amountCents is Int in schema
              amountCents: Math.round(Number(paymentData.amount) || 0),
              status: 'PENDING',
              // required by Prisma schema: updatedAt has no default
              updatedAt: new Date(),
              // Store mapping metadata as JSON string so webhook can resolve original orderNo
              metadata: JSON.stringify({
                originalOrderNo: paymentData.orderCode,
                payosOrderCode: finalOrderCode.toString(),
              }),
              // Connect relation to existing order
              orders: {
                connect: { id: orderRecord.id },
              },
            },
          });
          this.logger.log(
            `[PayOS] Created payment_intent ${createdIntent.id} for order ${orderRecord.id}`,
          );
        } catch (intentErr) {
          this.logger.error(
            `[PayOS] Failed to create payment_intent: ${(intentErr as Error).message}`,
          );
          createdIntent = null;
        }
      } else {
        this.logger.warn(
          `[PayOS] No order found for ${paymentData.orderCode} while creating payment_intent`,
        );
      }
    } catch (e) {
      this.logger.error(
        `[PayOS] Error while attempting to persist payment_intent: ${(e as Error).message}`,
      );
    }

    try {
      // Sanitize và giới hạn description để hợp lệ với PayOS (max 25 ký tự)
      let rawDescription = (paymentData.description || `Thanh toán ${finalOrderCode}`).toString();
      rawDescription = rawDescription
        .replace(/[\r\n\t]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const description = rawDescription.substring(0, 25);

      // Sử dụng PayOS SDK để tạo payment link
      const paymentLinkData = {
        orderCode: finalOrderCode,
        amount: paymentData.amount,
        description,
        buyerName: paymentData.buyerName,
        buyerEmail: paymentData.buyerEmail,
        buyerPhone: paymentData.buyerPhone || '',
        returnUrl: paymentData.returnUrl,
        cancelUrl: paymentData.cancelUrl,
      };

      const result = await this.payos.paymentRequests.create(paymentLinkData);

      // If we created a local payment_intent, update it with PayOS identifiers
      if (createdIntent) {
        try {
          // Merge existing metadata (if any) and append PayOS identifiers, storing as JSON string
          let existingMeta: any = {};
          try {
            existingMeta = createdIntent.metadata ? JSON.parse(createdIntent.metadata) : {};
          } catch {
            existingMeta = {};
          }
          const updatedMeta = {
            ...existingMeta,
            payosPaymentRequestId: result.paymentRequestId,
            payosOrderCode: (result.orderCode || finalOrderCode).toString(),
          };
          await this.prisma.payment_intents.update({
            where: { id: createdIntent.id },
            data: {
              status: 'PROCESSING',
              metadata: JSON.stringify(updatedMeta),
              // keep updatedAt in sync with update
              updatedAt: new Date(),
            },
          });
          this.logger.log(
            `[PayOS] Updated payment_intent ${createdIntent.id} with PayOS identifiers`,
          );
        } catch (updateErr) {
          this.logger.error(
            `[PayOS] Failed to update payment_intent with PayOS data: ${(updateErr as Error).message}`,
          );
        }
      }

      this.logger.log(`PayOS payment link created: ${result.checkoutUrl}`);
      return {
        success: true,
        checkoutUrl: result.checkoutUrl,
        paymentRequestId: result.paymentRequestId,
        orderCode: result.orderCode || finalOrderCode,
      };
    } catch (error: any) {
      // Cố gắng xử lý trường hợp "Đơn thanh toán đã tồn tại (code: 231)" trả về từ PayOS
      try {
        const errMsg = error?.message || '';
        const errData = error?.response?.data || error?.data || null;

        this.logger.error(`PayOS payment link creation error: ${errMsg}`);
        if (errData) this.logger.debug(`PayOS error data: ${JSON.stringify(errData)}`);

        // Nếu API trả về checkoutUrl hoặc paymentRequestId trong payload, re-use nó
        const possibleCheckoutUrl =
          errData?.checkoutUrl ||
          errData?.checkout_url ||
          errData?.redirectUrl ||
          errData?.redirect_url;
        const possiblePaymentRequestId =
          errData?.paymentRequestId || errData?.payment_request_id || errData?.id;

        if (possibleCheckoutUrl || possiblePaymentRequestId) {
          this.logger.log(
            'PayOS create returned existing payment — returning existing checkoutUrl/paymentRequestId',
          );
          return {
            success: true,
            checkoutUrl: possibleCheckoutUrl,
            paymentRequestId: possiblePaymentRequestId,
            orderCode: finalOrderCode,
          };
        }

        // Heuristic: nếu message chứa mã lỗi 231 (Đơn thanh toán đã tồn tại), trả về thông tin nhẹ cho caller thay vì ném lỗi 500
        if (
          (typeof errMsg === 'string' && errMsg.includes('231')) ||
          (typeof errMsg === 'string' && errMsg.includes('Đơn thanh toán đã tồn tại'))
        ) {
          this.logger.log(
            'PayOS indicates payment already exists (code 231). Returning orderCode for caller to handle.',
          );
          return {
            success: false,
            message: 'Payment already exists on PayOS (code 231)',
            orderCode: finalOrderCode,
          };
        }
      } catch (innerErr) {
        this.logger.error(
          `Error while handling PayOS create error: ${(innerErr as Error).message}`,
        );
      }

      // Nếu không thể xử lý đặc biệt, forward exception lên caller
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

      // Tìm order theo orderCode
      let order = await this.prisma.orders.findUnique({
        where: { orderNo: orderCode },
      });

      // Nếu không tìm thấy order trực tiếp theo orderNo, cố gắng resolve qua payment_intents (paymentRequestId hoặc metadata)
      let resolvedIntent: any = null;
      if (!order) {
        this.logger.warn(
          `[PayOS Webhook] Order not found by orderNo: ${orderCode}. Attempting to resolve via payment_intents.`,
        );

        // Try paymentRequestId present in webhook payload
        const paymentRequestIdCandidate =
          verifiedWebhookData.paymentRequestId ||
          verifiedWebhookData.data?.paymentRequestId ||
          transactionId;

        try {
          if (paymentRequestIdCandidate) {
            resolvedIntent = await this.prisma.payment_intents.findFirst({
              where: {
                provider: 'PAYOS',
                metadata: { contains: String(paymentRequestIdCandidate) },
              },
              orderBy: { createdAt: 'desc' },
            });
          }

          // If not found by paymentRequestId, look through recent PAYOS intents and match metadata textually
          if (!resolvedIntent) {
            const candidates = await this.prisma.payment_intents.findMany({
              where: { provider: 'PAYOS' },
              orderBy: { createdAt: 'desc' },
              take: 50,
            });

            resolvedIntent =
              candidates.find((c: any) => {
                try {
                  const meta = c.metadata ?? {};
                  const metaStr = typeof meta === 'string' ? meta : JSON.stringify(meta);
                  return (
                    metaStr.includes(String(orderCode)) ||
                    (paymentRequestIdCandidate &&
                      metaStr.includes(String(paymentRequestIdCandidate)))
                  );
                } catch {
                  return false;
                }
              }) || null;
          }
        } catch (resolveErr) {
          this.logger.error(
            `[PayOS Webhook] Error while resolving payment_intent: ${(resolveErr as Error).message}`,
          );
          resolvedIntent = null;
        }

        if (!resolvedIntent) {
          this.logger.error(
            `[PayOS Webhook] Order not found and no related payment_intent found for orderCode/paymentRequestId: ${orderCode}`,
          );
          return { error: 1, message: 'Order not found' };
        }

        // Resolve order via intent.orderId
        order = await this.prisma.orders.findUnique({ where: { id: resolvedIntent.orderId } });
        if (!order) {
          this.logger.error(
            `[PayOS Webhook] Order not found for resolved intent ${resolvedIntent.id}`,
          );
          return { error: 1, message: 'Order not found' };
        }

        this.logger.log(
          `[PayOS Webhook] Resolved order ${order.id} via payment_intent ${resolvedIntent.id}`,
        );
      }

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
      PAYOS_API_URL:
        apiUrl ||
        (process.env.NODE_ENV === 'production'
          ? 'https://api.payos.vn'
          : 'https://api-merchant.payos.vn'),
    };
  }

  /**
   * Đánh dấu thanh toán thành công
   */
  private async markPaymentAsPaid(intent: any, transactionId: string) {
    await this.prisma.$transaction(async tx => {
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
          updatedAt: new Date(),
        },
      });

      // Cập nhật order status
      await tx.orders.update({
        where: { id: intent.orderId },
        data: { status: 'CONFIRMED' },
      });

      // Cập nhật payment intent status
      await tx.payment_intents.update({
        where: { id: intent.id },
        data: { status: 'SUCCEEDED' },
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
      data: { status: 'FAILED' },
    });

    this.logger.log(`PayOS payment marked as failed: ${intent.id}`);
  }

  /**
   * Đánh dấu thanh toán bị hủy
   */
  private async markPaymentAsCancelled(intent: any) {
    await this.prisma.payment_intents.update({
      where: { id: intent.id },
      data: { status: 'CANCELLED' },
    });

    this.logger.log(`PayOS payment marked as cancelled: ${intent.id}`);
  }
}
