import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { OrdersService } from '../orders/orders.service';
import { NotificationService } from '../notifications/notification.service';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';

export interface WebhookData {
  [key: string]: any;
}

export interface WebhookResult {
  success: boolean;
  message: string;
  orderId?: string;
  paymentId?: string;
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService,
    private readonly notificationService: NotificationService,
  ) {}

  async handleVNPAYWebhook(data: WebhookData): Promise<WebhookResult> {
    try {
      this.logger.log('Processing VNPAY webhook:', data);

      // Validate webhook signature
      const isValidSignature = this.validateVNPAYSignature(data);
      if (!isValidSignature) {
        throw new BadRequestException('Invalid VNPAY webhook signature');
      }

      const {
        vnp_TxnRef,
        vnp_ResponseCode,
        vnp_Amount,
        vnp_TransactionNo,
        vnp_OrderInfo: _vnp_OrderInfo,
        vnp_PayDate: _vnp_PayDate,
      } = data;

      // Find payment intent
      const paymentIntent = await this.prisma.payment_intents.findUnique({
        where: { id: vnp_TxnRef },
        include: { orders: true },
      });

      if (!paymentIntent) {
        throw new BadRequestException('Payment intent not found');
      }

      // Check if already processed
      if (paymentIntent.status !== 'PENDING') {
        this.logger.warn(
          `Payment intent ${vnp_TxnRef} already processed with status ${paymentIntent.status}`,
        );
        return {
          success: true,
          message: 'Payment already processed',
          orderId: paymentIntent.orderId,
          paymentId: paymentIntent.id,
        };
      }

      // Process payment result
      const isSuccess = vnp_ResponseCode === '00';
      const status = isSuccess ? 'COMPLETED' : 'FAILED';

      // Update payment intent
      await this.prisma.payment_intents.update({
        where: { id: vnp_TxnRef },
        data: { status: status as any },
      });

      // Create payment record
      const payment = await this.prisma.payments.create({
        data: {
          id: randomUUID(),
          orderId: paymentIntent.orderId,
          amountCents: parseInt(vnp_Amount),
          provider: 'VNPAY',
          status: status as any,
          transactionId: vnp_TransactionNo,
          updatedAt: new Date(),
          // metadata: {
          //   responseCode: vnp_ResponseCode,
          //   orderInfo: vnp_OrderInfo,
          //   payDate: vnp_PayDate,
          // },
        },
      });

      // Update order status
      if (isSuccess) {
        await this.ordersService.updateStatus(paymentIntent.orderId, 'PAID');

        // Send notification
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
    } catch (error) {
      this.logger.error('VNPAY webhook processing failed:', error);
      throw error;
    }
  }

  async handleMOMOWebhook(data: WebhookData): Promise<WebhookResult> {
    try {
      this.logger.log('Processing MOMO webhook:', data);

      // Validate webhook signature
      const isValidSignature = this.validateMOMOSignature(data);
      if (!isValidSignature) {
        throw new BadRequestException('Invalid MOMO webhook signature');
      }

      const { orderId, resultCode, amount, transId, message: _message } = data;

      // Find payment intent
      const paymentIntent = await this.prisma.payment_intents.findUnique({
        where: { id: orderId },
        include: { orders: true },
      });

      if (!paymentIntent) {
        throw new BadRequestException('Payment intent not found');
      }

      // Check if already processed
      if (paymentIntent.status !== 'PENDING') {
        return {
          success: true,
          message: 'Payment already processed',
          orderId: paymentIntent.orderId,
          paymentId: paymentIntent.id,
        };
      }

      // Process payment result
      const isSuccess = resultCode === 0;
      const status = isSuccess ? 'COMPLETED' : 'FAILED';

      // Update payment intent
      await this.prisma.payment_intents.update({
        where: { id: orderId },
        data: { status: status as any },
      });

      // Create payment record
      const payment = await this.prisma.payments.create({
        data: {
          id: randomUUID(),
          orderId: paymentIntent.orderId,
          amountCents: parseInt(amount),
          provider: 'MOMO',
          status: status as any,
          transactionId: transId,
          updatedAt: new Date(),
          // metadata: {
          //   resultCode,
          //   message,
          // },
        },
      });

      // Update order status
      if (isSuccess) {
        await this.ordersService.updateStatus(paymentIntent.orderId, 'PAID');

        // Send notification
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
    } catch (error) {
      this.logger.error('MOMO webhook processing failed:', error);
      throw error;
    }
  }

  async handlePAYOSWebhook(data: WebhookData): Promise<WebhookResult> {
    // PayOS payload format differs from the legacy WebhookData shape.
    // Delegate to SDK-based PayOS handler inside PaymentsModule.
    this.logger.log('Processing PAYOS webhook (delegated)');
    const result = await this.paymentsService.handleWebhook('PAYOS', data);
    return {
      success: true,
      message: (result as any)?.message || 'Processed',
    };
  }

  private validateVNPAYSignature(data: WebhookData): boolean {
    const secret = this.config.get<string>('VNPAY_HASH_SECRET');
    if (!secret) return false;

    const { vnp_SecureHash, ...params } = data;
    const signData = Object.keys(params)
      .filter(key => key !== 'vnp_SecureHash')
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    const expectedHash = crypto.createHmac('sha256', secret).update(signData).digest('hex');

    return vnp_SecureHash === expectedHash;
  }

  private validateMOMOSignature(data: WebhookData): boolean {
    const secret = this.config.get<string>('MOMO_SECRET_KEY');
    if (!secret) return false;

    const { signature, ...params } = data;
    const signData = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    const expectedHash = crypto.createHmac('sha256', secret).update(signData).digest('hex');

    return signature === expectedHash;
  }

  // PAYOS signature validation is handled by PayOSService via PaymentsService

  async handleOrderStatusWebhook(data: WebhookData): Promise<WebhookResult> {
    try {
      this.logger.log('Processing order status webhook:', data);

      const { orderId, status, reason } = data;

      // Update order status
      await this.ordersService.updateStatus(orderId, status);

      // Get order details
      const order = await this.prisma.orders.findUnique({
        where: { id: orderId },
        include: { users: true },
      });

      if (!order) {
        throw new BadRequestException('Order not found');
      }

      // Send notification
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
    } catch (error) {
      this.logger.error('Order status webhook processing failed:', error);
      throw error;
    }
  }

  async handleInventoryWebhook(data: WebhookData): Promise<WebhookResult> {
    try {
      this.logger.log('Processing inventory webhook:', data);

      const { productId, action, quantity, reason } = data;

      // Update inventory
      if (action === 'ADJUST') {
        await this.prisma.inventory.update({
          where: { productId },
          data: {
            stock: { increment: quantity },
          },
        });
      } else if (action === 'SET') {
        await this.prisma.inventory.update({
          where: { productId },
          data: {
            stock: quantity,
          },
        });
      }

      // Get product details
      const product = await this.prisma.products.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      // Send notification to admin
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
    } catch (error) {
      this.logger.error('Inventory webhook processing failed:', error);
      throw error;
    }
  }
}
