import { Body, Controller, Get, Headers, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { IsIn, IsOptional, IsString, MinLength, IsNumber, Min } from 'class-validator';

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
  constructor(private readonly payments: PaymentsService) {}

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

  @Get('intents')
  getPaymentIntents() {
    return {
      intents: [],
      message: 'Payment intents endpoint',
      timestamp: new Date().toISOString()
    };
  }

  @UseGuards(JwtGuard)
  @Post('intents')
  createIntent(@Body() dto: CreateIntentDto) {
    return this.payments.createIntent(dto);
  }

  @UseGuards(AdminGuard)
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
