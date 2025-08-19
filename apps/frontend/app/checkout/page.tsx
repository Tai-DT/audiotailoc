import { redirect } from 'next/navigation';
import { apiFetch, getApiBase } from '../lib/api';

export default function CheckoutPage() {
  async function action(form: FormData) {
    'use server';
    const promo = String(form.get('promotionCode') || '');
    // Ensure logged in
    const { cookies } = await import('next/headers');
    const c = await cookies();
    if (!c.get('accessToken')) {
      redirect('/login');
    }
    // 1) Create order
    const orderRes = await apiFetch<{ order: { id: string; orderNo: string; totalCents: number } }>(
      '/checkout/create-order',
      { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ promotionCode: promo || undefined }) },
    );
    const order = orderRes.order;
    // 2) Create payment intent with PayOS
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const returnUrl = `${origin}/checkout/return?orderNo=${encodeURIComponent(order.orderNo)}`;
    const intent = await apiFetch<{ intentId: string; redirectUrl: string }>('/payments/intents', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderId: order.id, provider: 'PAYOS', idempotencyKey: `${order.id}`, returnUrl }),
    });
    redirect(intent.redirectUrl);
  }

  return (
    <form action={action} style={{ display: 'grid', gap: 12, maxWidth: 480, padding: 24 }}>
      <h1>Thanh toán</h1>
      <label>
        Mã khuyến mãi
        <input name="promotionCode" placeholder="VD: WELCOME10" />
      </label>
      <button type="submit">Tạo đơn và thanh toán (PayOS)</button>
    </form>
  );
}

