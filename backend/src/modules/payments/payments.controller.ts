import { Body, Controller, Get, Param, Post, Query, Req, UseGuards, Logger } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PayOSService } from './payos.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { IsIn, IsOptional, IsString, MinLength, IsNumber, Min } from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';
import { PayOSCreatePaymentDto, PayOSRefundDto } from './dto/payos-webhook.dto';

class CreateIntentDto {
  @IsString()
  orderId!: string;

  @IsIn(['PAYOS', 'COD'])
  provider!: 'PAYOS' | 'COD';

  @IsString()
  @MinLength(8)
  idempotencyKey!: string;

  @IsOptional()
  @IsString()
  returnUrl?: string;
}

class CreateRefundDto {
  @IsString()
  paymentId!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  amountCents?: number;

  @IsOptional()
  @IsString()
  reason?: string;
}

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly payments: PaymentsService,
    private readonly payosService: PayOSService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('methods')
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

  @Get('status')
  getPaymentStatus() {
    return {
      status: 'active',
      message: 'Payment system is operational',
      timestamp: new Date().toISOString(),
      supportedProviders: ['COD', 'PAYOS'],
    };
  }

  @Get('my-payments')
  async getMyPayments(@Req() req: any) {
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

    return payments.map((payment: any) => ({
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

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Get()
  async getPayments(@Query() query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by status
    if (query.status) {
      where.status = query.status;
    }

    // Filter by provider
    if (query.provider) {
      where.provider = query.provider;
    }

    // Search by order number or payment ID
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
      payments: payments.map((payment: any) => ({
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

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Get('stats')
  async getPaymentStats() {
    const [
      totalPayments,
      totalRevenue,
      pendingPayments,
      failedPayments,
      refundedPayments,
      refundedAmount,
    ] = await Promise.all([
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

  @Post('intents')
  createIntent(@Body() dto: CreateIntentDto) {
    return this.payments.createIntent(dto);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('refunds')
  createRefund(@Body() dto: CreateRefundDto) {
    return this.payments.createRefund(dto.paymentId, dto.amountCents, dto.reason);
  }

  // VNPay/MoMo callbacks (simplified)
  @Get('vnpay/callback')
  async vnpayCallback(@Query('vnp_TxnRef') ref: string) {
    await this.payments.markPaid('VNPAY', String(ref));
    return { ok: true };
  }

  @Get('momo/callback')
  async momoCallback(@Query('momo_txn') ref: string) {
    await this.payments.markPaid('MOMO', String(ref));
    return { ok: true };
  }

  @Get('payos/callback')
  async payosCallback(@Query('orderCode') orderCode?: string, @Query('payos_txn') ref?: string) {
    const id = String(orderCode || ref || '');
    if (!id) return { ok: false };
    await this.payments.markPaid('PAYOS', id);
    return { ok: true };
  }

  // PayOS specific endpoints

  @Post('payos/create-payment')
  async createPayOSPayment(@Body() createPaymentDto: PayOSCreatePaymentDto, @Req() req: any) {
    const userId = req.user?.sub;

    let buyerName = createPaymentDto.buyerName;
    let buyerEmail = createPaymentDto.buyerEmail;
    let buyerPhone = createPaymentDto.buyerPhone;

    // Nếu user được xác thực và chưa có buyer info từ request, lấy từ database
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

    // Nếu là guest user và không có buyer info, sử dụng giá trị mặc định
    if (!userId && !buyerName) {
      buyerName = 'Guest User';
    }
    if (!userId && !buyerEmail) {
      buyerEmail = `guest_${Date.now()}@example.com`; // Email tạm thời cho guest
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

  @Get('payos/payment-status/:orderCode')
  async getPayOSPaymentStatus(@Param('orderCode') orderCode: string) {
    return this.payosService.checkPaymentStatus(orderCode);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('payos/refund')
  async createPayOSRefund(@Body() refundDto: PayOSRefundDto) {
    return this.payosService.processRefund(refundDto);
  }

  // Webhook endpoints
  @Post('vnpay/webhook')
  async vnpayWebhook(@Body() body: any) {
    return this.payments.handleWebhook('VNPAY', body);
  }

  @Post('momo/webhook')
  async momoWebhook(@Body() body: any) {
    return this.payments.handleWebhook('MOMO', body);
  }

  @Post('payos/webhook')
  async payosWebhook(@Req() req: any, @Body() body: any) {
    try {
      // ✅ FIX: Verify webhook signature với x-signature header
      // PayOS SDK tự động verify signature trong webhookData
      const isValid = this.payosService.verifyWebhookSignature(body);
      if (!isValid) {
        this.logger.error('Invalid PayOS webhook signature');
        return { error: 1, message: 'Invalid signature' };
      }

      // Log webhook data cho debugging
      this.logger.log(`PayOS webhook verified, processing...`);

      const result = await this.payosService.handleWebhook(body);

      // Clear cart sau khi payment thành công
      if (result.error === 0 && result.message === 'Payment successful') {
        // Webhook đã xử lý thành công, frontend sẽ clear cart dựa vào localStorage flag
        this.logger.log('Payment successful, cart should be cleared on frontend');
      }

      return result;
    } catch (error) {
      this.logger.error(`PayOS webhook error: ${(error as Error).message}`);
      return { error: 1, message: 'Webhook processing failed' };
    }
  }
}
