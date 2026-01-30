import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PayOSService } from './payos.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';
import { IsIn, IsOptional, IsString, MinLength, IsNumber, Min } from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';

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
  constructor(
    private readonly payments: PaymentsService,
    private readonly prisma: PrismaService,
    private readonly payos: PayOSService,
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

  @UseGuards(JwtGuard)
  @Get('my-payments')
  async getMyPayments(@Req() req: any) {
    const userId = req.user?.sub;
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
        paidAt: payment.status === 'SUCCEEDED' ? payment.updatedAt : null,
        user: payment.orders.users,
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
        where: { status: 'SUCCEEDED' },
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

  @UseGuards(OptionalJwtGuard)
  @Post('intents')
  createIntent(
    @Body() dto: CreateIntentDto,
    @Req() req: any,
    @Headers('x-admin-key') adminKey?: string,
  ) {
    const userId = req.user?.sub || req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;
    const isAdminKey = Boolean(adminKey && adminKey === process.env.ADMIN_API_KEY);

    if (!userId && !isAdminKey && dto.provider !== 'PAYOS') {
      throw new ForbiddenException('Authentication required for this payment method');
    }

    return this.payments.createIntent(dto, { userId, isAdmin, isAdminKey });
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
    // Important: do NOT mark paid based on redirect alone.
    // Webhook is the source of truth; this endpoint is just for client redirects.
    const _id = String(orderCode || ref || '');
    return { ok: true, received: !!_id };
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
  async payosWebhook(@Req() req: any, @Body() body: any, @Headers('x-signature') xsig?: string) {
    // Delegate to PayOS SDK verification + handler
    // Note: PayOS signature is included in payload; header can be ignored.
    void req;
    void xsig;
    return this.payments.handleWebhook('PAYOS', body);
  }
}
