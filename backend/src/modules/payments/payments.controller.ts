import { Body, Controller, Get, Headers, Post, Query, Req, UseGuards, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiHeader } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { 
  CreateIntentDto, 
  CreateRefundDto, 
  ProcessWebhookDto,
  PaymentMethodDto 
} from './dto/payment.dto';
import {
  PaymentIntentResponseDto,
  PaymentMethodResponseDto,
  RefundResponseDto,
  PaymentStatusResponseDto,
  WebhookResponseDto,
} from './dto/response.dto';
import {
  ApiErrorResponses,
  ApiAuthRequired,
  ApiAdminRequired,
} from '../common/decorators/swagger.decorators';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Get('methods')
  @ApiOperation({
    summary: 'Get available payment methods',
    description: 'Retrieve list of all available payment methods with their configurations',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment methods retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            methods: {
              type: 'array',
              items: { $ref: '#/components/schemas/PaymentMethodResponseDto' },
            },
            defaultMethod: { type: 'string', example: 'VNPAY' },
            totalMethods: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  getPaymentMethods() {
    return {
      success: true,
      data: {
        methods: [
          {
            id: 'VNPAY',
            name: 'VNPAY',
            description: 'Thanh toán qua VNPAY - Hỗ trợ ATM, Visa, MasterCard',
            logo: '/images/payment/vnpay.png',
            enabled: true,
            minAmount: 10000,
            maxAmount: 50000000,
            feePercentage: 2.5,
            fixedFee: 2000,
            supportedCurrencies: ['VND'],
            processingTime: 'Instant',
            features: ['QR_CODE', 'INSTALLMENT', 'REFUND'],
          },
          {
            id: 'MOMO',
            name: 'MoMo',
            description: 'Thanh toán qua MoMo - Ví điện tử phổ biến',
            logo: '/images/payment/momo.png',
            enabled: true,
            minAmount: 5000,
            maxAmount: 20000000,
            feePercentage: 2.0,
            fixedFee: 1000,
            supportedCurrencies: ['VND'],
            processingTime: 'Instant',
            features: ['QR_CODE', 'REFUND'],
          },
          {
            id: 'PAYOS',
            name: 'PayOS',
            description: 'Thanh toán qua PayOS - Giải pháp thanh toán hiện đại',
            logo: '/images/payment/payos.png',
            enabled: true,
            minAmount: 1000,
            maxAmount: 100000000,
            feePercentage: 1.8,
            fixedFee: 500,
            supportedCurrencies: ['VND'],
            processingTime: 'Instant',
            features: ['QR_CODE', 'BANK_TRANSFER', 'REFUND'],
          },
          {
            id: 'BANK_TRANSFER',
            name: 'Bank Transfer',
            description: 'Chuyển khoản ngân hàng trực tiếp',
            logo: '/images/payment/bank.png',
            enabled: true,
            minAmount: 50000,
            maxAmount: 1000000000,
            feePercentage: 0,
            fixedFee: 0,
            supportedCurrencies: ['VND'],
            processingTime: '1-3 business days',
            features: ['MANUAL_VERIFICATION'],
          },
          {
            id: 'CASH_ON_DELIVERY',
            name: 'Cash on Delivery',
            description: 'Thanh toán khi nhận hàng (COD)',
            logo: '/images/payment/cod.png',
            enabled: true,
            minAmount: 10000,
            maxAmount: 5000000,
            feePercentage: 0,
            fixedFee: 15000,
            supportedCurrencies: ['VND'],
            processingTime: 'On delivery',
            features: ['CASH_COLLECTION'],
          },
        ],
        defaultMethod: 'VNPAY',
        totalMethods: 5,
      },
    };
  }

  @Get('status')
  @ApiOperation({
    summary: 'Get payment status summary',
    description: 'Get overall payment system status and statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment system status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            systemStatus: { type: 'string', example: 'operational' },
            providersStatus: {
              type: 'object',
              properties: {
                VNPAY: { type: 'string', example: 'operational' },
                MOMO: { type: 'string', example: 'operational' },
                PAYOS: { type: 'string', example: 'operational' },
              },
            },
            statistics: {
              type: 'object',
              properties: {
                totalPayments: { type: 'number', example: 1250 },
                successfulPayments: { type: 'number', example: 1180 },
                failedPayments: { type: 'number', example: 70 },
                successRate: { type: 'number', example: 94.4 },
                totalVolume: { type: 'number', example: 125000000 },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  getPaymentStatus() {
    return {
      success: true,
      data: {
        systemStatus: 'operational',
        providersStatus: {
          VNPAY: 'operational',
          MOMO: 'operational',
          PAYOS: 'operational',
          BANK_TRANSFER: 'operational',
          CASH_ON_DELIVERY: 'operational',
        },
        statistics: {
          totalPayments: 1250,
          successfulPayments: 1180,
          failedPayments: 70,
          successRate: 94.4,
          totalVolume: 125000000,
        },
        lastUpdated: new Date().toISOString(),
      },
    };
  }

  @Get('intents')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({
    summary: 'Get payment intents',
    description: 'Retrieve list of payment intents with filtering and pagination',
  })
  @ApiAuthRequired()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 20,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    description: 'Filter by payment status',
  })
  @ApiQuery({
    name: 'provider',
    required: false,
    enum: ['VNPAY', 'MOMO', 'PAYOS', 'BANK_TRANSFER', 'CASH_ON_DELIVERY'],
    description: 'Filter by payment provider',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment intents retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/PaymentIntentResponseDto' },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                pageSize: { type: 'number', example: 20 },
                total: { type: 'number', example: 150 },
                totalPages: { type: 'number', example: 8 },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  getPaymentIntents(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('status') status?: string,
    @Query('provider') provider?: string,
  ) {
    return {
      success: true,
      data: {
        items: [],
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total: 0,
          totalPages: 0,
        },
      },
    };
  }

  @UseGuards(JwtGuard)
  @Post('intents')
  @ApiOperation({
    summary: 'Create payment intent',
    description: 'Create a new payment intent for processing payment',
  })
  @ApiAuthRequired()
  @ApiBody({
    type: CreateIntentDto,
    description: 'Payment intent data',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment intent created successfully',
    type: PaymentIntentResponseDto,
  })
  @ApiErrorResponses()
  createIntent(@Body() dto: CreateIntentDto) {
    return this.payments.createIntent({
      orderId: dto.orderId,
      provider: dto.provider as any,
      idempotencyKey: crypto.randomUUID(),
      returnUrl: dto.returnUrl,
    });
  }

  @UseGuards(AdminGuard)
  @Post('refunds')
  @ApiOperation({
    summary: 'Create refund',
    description: 'Create a refund for an existing payment (Admin only)',
  })
  @ApiAdminRequired()
  @ApiBody({
    type: CreateRefundDto,
    description: 'Refund data',
  })
  @ApiResponse({
    status: 201,
    description: 'Refund created successfully',
    type: RefundResponseDto,
  })
  @ApiErrorResponses()
  createRefund(@Body() dto: CreateRefundDto) {
    return this.payments.createRefund(dto.paymentId, dto.amount, dto.reason);
  }

  // VNPay callback
  @Get('vnpay/callback')
  @ApiOperation({
    summary: 'VNPay payment callback',
    description: 'Handle VNPay payment callback after user completes payment',
  })
  @ApiQuery({
    name: 'vnp_TxnRef',
    description: 'VNPay transaction reference',
    example: 'ORDER_123456',
  })
  @ApiResponse({
    status: 200,
    description: 'VNPay callback processed successfully',
    type: PaymentStatusResponseDto,
  })
  @ApiErrorResponses()
  async vnpayCallback(@Query('vnp_TxnRef') ref: string) {
    await this.payments.markPaid('VNPAY', String(ref));
    return { ok: true };
  }

  // MoMo callback
  @Get('momo/callback')
  @ApiOperation({
    summary: 'MoMo payment callback',
    description: 'Handle MoMo payment callback after user completes payment',
  })
  @ApiQuery({
    name: 'momo_txn',
    description: 'MoMo transaction ID',
    example: 'MOMO_123456',
  })
  @ApiResponse({
    status: 200,
    description: 'MoMo callback processed successfully',
    type: PaymentStatusResponseDto,
  })
  @ApiErrorResponses()
  async momoCallback(@Query('momo_txn') ref: string) {
    await this.payments.markPaid('MOMO', String(ref));
    return { ok: true };
  }

  // PayOS callback
  @Get('payos/callback')
  @ApiOperation({
    summary: 'PayOS payment callback',
    description: 'Handle PayOS payment callback after user completes payment',
  })
  @ApiQuery({
    name: 'orderCode',
    required: false,
    description: 'PayOS order code',
    example: 'PAYOS_123456',
  })
  @ApiQuery({
    name: 'payos_txn',
    required: false,
    description: 'PayOS transaction ID',
    example: 'payos_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'PayOS callback processed successfully',
    type: PaymentStatusResponseDto,
  })
  @ApiErrorResponses()
  async payosCallback(
    @Query('orderCode') orderCode?: string, 
    @Query('payos_txn') ref?: string,
  ) {
    const id = String(orderCode || ref || '');
    if (!id) return { ok: false };
    await this.payments.markPaid('PAYOS', id);
    return { ok: true };
  }

  // Webhook endpoints
  @Post('vnpay/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'VNPay webhook endpoint',
    description: 'Receive VNPay payment status updates via webhook',
  })
  @ApiBody({
    description: 'VNPay webhook payload',
    schema: {
      type: 'object',
      properties: {
        vnp_TxnRef: { type: 'string', example: 'ORDER_123456' },
        vnp_ResponseCode: { type: 'string', example: '00' },
        vnp_TransactionStatus: { type: 'string', example: '00' },
        vnp_Amount: { type: 'number', example: 150000 },
        vnp_BankCode: { type: 'string', example: 'NCB' },
        vnp_PayDate: { type: 'string', example: '20240115103000' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'VNPay webhook processed successfully',
    type: WebhookResponseDto,
  })
  @ApiErrorResponses()
  async vnpayWebhook(@Body() body: any) {
    return this.payments.handleWebhook('VNPAY', body);
  }

  @Post('momo/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'MoMo webhook endpoint',
    description: 'Receive MoMo payment status updates via webhook',
  })
  @ApiBody({
    description: 'MoMo webhook payload',
    schema: {
      type: 'object',
      properties: {
        partnerCode: { type: 'string', example: 'MOMO' },
        orderId: { type: 'string', example: 'ORDER_123456' },
        requestId: { type: 'string', example: 'REQ_123456' },
        amount: { type: 'number', example: 150000 },
        resultCode: { type: 'number', example: 0 },
        message: { type: 'string', example: 'Success' },
        responseTime: { type: 'number', example: 1642234567890 },
        extraData: { type: 'string', example: '' },
        signature: { type: 'string', example: 'abc123...' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'MoMo webhook processed successfully',
    type: WebhookResponseDto,
  })
  @ApiErrorResponses()
  async momoWebhook(@Body() body: any) {
    return this.payments.handleWebhook('MOMO', body);
  }

  @Post('payos/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'PayOS webhook endpoint',
    description: 'Receive PayOS payment status updates via webhook',
  })
  @ApiHeader({
    name: 'x-signature',
    description: 'PayOS webhook signature for verification',
    required: false,
  })
  @ApiBody({
    description: 'PayOS webhook payload',
    schema: {
      type: 'object',
      properties: {
        orderCode: { type: 'string', example: 'PAYOS_123456' },
        amount: { type: 'number', example: 150000 },
        description: { type: 'string', example: 'Payment for order #123' },
        accountNumber: { type: 'string', example: '1234567890' },
        reference: { type: 'string', example: 'FT123456' },
        transactionDateTime: { type: 'string', example: '2024-01-15 10:30:00' },
        virtualAccountName: { type: 'string', example: 'NGUYEN VAN A' },
        virtualAccountNumber: { type: 'string', example: '9876543210' },
        counterAccountBankId: { type: 'string', example: 'BIDV' },
        counterAccountBankName: { type: 'string', example: 'BIDV' },
        counterAccountName: { type: 'string', example: 'NGUYEN VAN A' },
        counterAccountNumber: { type: 'string', example: '1234567890' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'PayOS webhook processed successfully',
    type: WebhookResponseDto,
  })
  @ApiErrorResponses()
  async payosWebhook(
    @Req() req: any, 
    @Body() body: any, 
    @Headers('x-signature') xsig?: string,
  ) {
    try {
      const checksum = (process.env.PAYOS_CHECKSUM_KEY as string) || '';
      const hmac = await import('crypto').then((m) => m.createHmac('sha256', checksum));
      const target = body?.data ? JSON.stringify(body.data) : JSON.stringify(body);
      const sig = hmac.update(target).digest('hex');
      const expected = body?.signature || xsig || '';
      if (expected && expected !== sig) {
        return { ok: false };
      }
      return this.payments.handleWebhook('PAYOS', body);
    } catch {
      return { ok: false };
    }
  }

  // Payment analytics
  @Get('analytics/summary')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({
    summary: 'Get payment analytics summary',
    description: 'Get comprehensive payment analytics and statistics',
  })
  @ApiAuthRequired()
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['day', 'week', 'month', 'quarter', 'year'],
    description: 'Analytics period',
    example: 'month',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment analytics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            summary: {
              type: 'object',
              properties: {
                totalTransactions: { type: 'number', example: 1250 },
                totalVolume: { type: 'number', example: 125000000 },
                successRate: { type: 'number', example: 94.4 },
                averageTransactionValue: { type: 'number', example: 100000 },
              },
            },
            byProvider: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  provider: { type: 'string', example: 'VNPAY' },
                  transactions: { type: 'number', example: 450 },
                  volume: { type: 'number', example: 45000000 },
                  successRate: { type: 'number', example: 96.2 },
                },
              },
            },
            trends: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string', example: '2024-01-15' },
                  transactions: { type: 'number', example: 125 },
                  volume: { type: 'number', example: 12500000 },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getPaymentAnalytics(@Query('period') period: string = 'month') {
    return {
      success: true,
      data: {
        summary: {
          totalTransactions: 1250,
          totalVolume: 125000000,
          successRate: 94.4,
          averageTransactionValue: 100000,
        },
        byProvider: [
          {
            provider: 'VNPAY',
            transactions: 450,
            volume: 45000000,
            successRate: 96.2,
          },
          {
            provider: 'MOMO',
            transactions: 380,
            volume: 38000000,
            successRate: 93.1,
          },
          {
            provider: 'PAYOS',
            transactions: 320,
            volume: 32000000,
            successRate: 95.8,
          },
        ],
        trends: [],
        period,
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
