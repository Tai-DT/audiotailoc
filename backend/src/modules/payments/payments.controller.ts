import { Body, Controller, Get, Headers, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { IsIn, IsOptional, IsString, MinLength, IsNumber, Min } from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';

class CreateIntentDto {
  @IsString()
  orderId!: string;

  @IsIn(['PAYOS', 'COD'])
  provider!: 'PAYOS' | 'COD';

  @IsString() @MinLength(8)
  idempotencyKey!: string;

  @IsOptional() @IsString()
  returnUrl?: string;
}

class CreateRefundDto {
  @IsString()
  paymentId!: string;

  @IsOptional() @IsNumber() @Min(1)
  amountCents?: number;

  @IsOptional() @IsString()
  reason?: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly payments: PaymentsService,
    private readonly prisma: PrismaService
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
          enabled: true
        },
        {
          id: 'PAYOS',
          name: 'PayOS',
          description: 'Thanh toán qua PayOS (Chuyển khoản, QR, Thẻ)',
          logo: '/images/payment/payos.png',
          enabled: true
        }
      ]
    };
  }

  @Get('status')
  getPaymentStatus() {
    return {
      status: 'active',
      message: 'Payment system is operational',
      timestamp: new Date().toISOString(),
      supportedProviders: ['COD', 'PAYOS']
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
          userId: userId
        }
      },
      include: {
        orders: {
          select: {
            id: true,
            orderNo: true,
            totalCents: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
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
      updatedAt: payment.updatedAt
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
        { id: { contains: query.search, mode: 'insensitive' } }
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
                email: true
              }
            }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.payments.count({ where })
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
        user: payment.orders.user
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
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
      refundedAmount
    ] = await Promise.all([
      this.prisma.payments.count(),
      this.prisma.payments.aggregate({
        where: { status: 'PAID' },
        _sum: { amountCents: true }
      }),
      this.prisma.payments.count({ where: { status: 'PENDING' } }),
      this.prisma.payments.count({ where: { status: 'FAILED' } }),
      this.prisma.payments.count({ where: { status: 'REFUNDED' } }),
      this.prisma.payments.aggregate({
        where: { status: 'REFUNDED' },
        _sum: { amountCents: true }
      })
    ]);

    return {
      totalPayments,
      totalRevenue: totalRevenue._sum.amountCents || 0,
      pendingPayments,
      failedPayments,
      refundedPayments,
      refundedAmount: refundedAmount._sum.amountCents || 0
    };
  }

  @UseGuards(JwtGuard)
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
}
