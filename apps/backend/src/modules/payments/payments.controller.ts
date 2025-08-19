import { Body, Controller, Get, Headers, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtGuard } from '../auth/jwt.guard';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

class CreateIntentDto {
  @IsString()
  orderId!: string;

  @IsIn(['VNPAY', 'MOMO'])
  provider!: 'VNPAY' | 'MOMO';

  @IsString() @MinLength(8)
  idempotencyKey!: string;

  @IsOptional() @IsString()
  returnUrl?: string;
}

@UseGuards(JwtGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('intents')
  createIntent(@Body() dto: CreateIntentDto) {
    return this.payments.createIntent(dto);
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

  // Webhook: PayOS can call with header x-signature or body.signature over JSON payload
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
      const ref = body?.data?.orderCode || body?.orderCode || body?.data?.reference || body?.reference;
      if (ref) await this.payments.markPaid('PAYOS', String(ref));
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }
}
