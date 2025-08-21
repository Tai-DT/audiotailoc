import Link from 'next/link';

async function fetchOrder(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  const res = await fetch(`${base}/orders/${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải đơn hàng');
  return (await res.json()) as any;
}

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const order = await fetchOrder(p.id);
  async function update(form: FormData) {
    'use server';
    const status = String(form.get('status') || '');
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    await fetch(`${base}/orders/${encodeURIComponent(order.id)}/status/${encodeURIComponent(status)}`, { method: 'PATCH' });
  }
  return (
    <main style={{ padding: 24 }}>
      <Link href="/orders">← Danh sách</Link>
      <h1>Đơn hàng {order.orderNo}</h1>
      <p>Trạng thái: {order.status}</p>
      <form action={update} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select name="status" defaultValue={order.status}>
          {['PENDING', 'PAID', 'FULFILLED', 'CANCELED', 'REFUNDED'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit">Cập nhật</button>
      </form>
      <h3>Mục</h3>
      <ul>
        {order.items?.map((it: any) => (
          <li key={it.id}>
            {it.name} × {it.quantity} — {(it.unitPrice / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </li>
        ))}
      </ul>
      <p>
        Tổng:{' '}
        <strong>{(order.totalCents / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</strong>
      </p>
    </main>
  );
}

