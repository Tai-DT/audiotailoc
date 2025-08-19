import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {}

  async createIntent(params: { orderId: string; provider: 'VNPAY' | 'MOMO' | 'PAYOS'; idempotencyKey: string; returnUrl?: string }) {
    const order = await this.prisma.order.findUnique({ where: { id: params.orderId } });
    if (!order) throw new BadRequestException('Order not found');
    const existing = await this.prisma.paymentIntent.findUnique({ where: { idempotencyKey: params.idempotencyKey } });
    if (existing) return { intentId: existing.id, redirectUrl: existing.returnUrl || '' };
    const intent = await this.prisma.paymentIntent.create({
      data: { orderId: order.id, provider: params.provider, amountCents: order.totalCents, status: 'PENDING', idempotencyKey: params.idempotencyKey, returnUrl: params.returnUrl ?? null },
    });
    const redirectUrl = await this.buildRedirectUrl(intent, order);
    return { intentId: intent.id, redirectUrl };
  }

  private async buildRedirectUrl(
    intent: { id: string; provider: 'VNPAY' | 'MOMO' | 'PAYOS'; amountCents: number; returnUrl: string | null },
    order: { id: string; orderNo: string; totalCents: number },
  ): Promise<string> {
    const baseReturn = intent.returnUrl || this.config.get<string>('PAYMENT_RETURN_URL') || 'http://localhost:3000/return';
    if (intent.provider === 'VNPAY') {
      const tmnCode = this.config.get<string>('VNPAY_TMN_CODE') || 'TEST';
      const secret = this.config.get<string>('VNPAY_HASH_SECRET') || 'secret';
      const params: Record<string, string> = {
        vnp_Amount: String(intent.amountCents),
        vnp_TmnCode: tmnCode,
        vnp_TxnRef: intent.id,
        vnp_ReturnUrl: baseReturn,
      };
      const signData = Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join('&');
      const vnp_SecureHash = crypto.createHmac('sha256', secret).update(signData).digest('hex');
      return `${this.config.get('VNPAY_PAY_URL') || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'}?${signData}&vnp_SecureHash=${vnp_SecureHash}`;
    }
    if (intent.provider === 'PAYOS') {
      const apiUrl = this.config.get<string>('PAYOS_API_URL') || 'https://api.payos.vn';
      const clientId = this.config.get<string>('PAYOS_CLIENT_ID') || '';
      const apiKey = this.config.get<string>('PAYOS_API_KEY') || '';
      const checksumKey = this.config.get<string>('PAYOS_CHECKSUM_KEY') || '';
      try {
        const payload: any = {
          orderCode: order.orderNo || intent.id,
          amount: intent.amountCents,
          currency: 'VND',
          returnUrl: baseReturn,
          cancelUrl: baseReturn,
          description: `Thanh toan don hang ${order.orderNo}`,
          items: [{ name: 'Audio Tai Loc', quantity: 1, price: intent.amountCents }],
        };
        const dataStr = JSON.stringify(payload);
        const sig = crypto.createHmac('sha256', checksumKey).update(dataStr).digest('hex');
        const res = await fetch(`${apiUrl}/v2/checkout/create`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-client-id': clientId,
            'x-api-key': apiKey,
          },
          body: JSON.stringify({ ...payload, signature: sig }),
        });
        const out = await res.json().catch(() => ({}));
        const checkoutUrl = (out?.data?.checkoutUrl as string) || (out?.checkoutUrl as string) || '';
        if (checkoutUrl) return checkoutUrl;
      } catch {}
      // fallback
      return `${baseReturn}?payos_txn=${encodeURIComponent(intent.id)}`;
    }
    // MOMO stub: simply redirect back with tx id
    const momoBase = this.config.get('MOMO_PAY_URL') || baseReturn;
    return `${momoBase}?momo_txn=${intent.id}&amount=${intent.amountCents}`;
  }

  async markPaid(provider: 'VNPAY' | 'MOMO' | 'PAYOS', txnRef: string) {
    const intent = await this.prisma.paymentIntent.findUnique({ where: { id: txnRef } });
    if (!intent) throw new BadRequestException('Intent not found');
    await this.prisma.$transaction(async (tx) => {
      await tx.payment.create({ data: { provider, orderId: intent.orderId, intentId: intent.id, amountCents: intent.amountCents, status: 'SUCCEEDED', transactionId: txnRef } });
      await tx.order.update({ where: { id: intent.orderId }, data: { status: 'PAID' } });
      await tx.paymentIntent.update({ where: { id: intent.id }, data: { status: 'SUCCEEDED' } });
    });
    return { ok: true };
  }
}
