import Link from 'next/link';
import { apiFetch } from '../../lib/api';

export default async function CheckoutReturnPage({ searchParams }: { searchParams: Promise<{ orderNo?: string }> }) {
  const sp = await searchParams;
  const orderNo = sp?.orderNo || '';
  let status = 'unknown';
  try {
    const order = await apiFetch<{ status: string }>(`/checkout/order-by-no/${encodeURIComponent(orderNo)}`);
    status = order.status;
  } catch {}
  return (
    <main style={{ padding: 24 }}>
      <h1>Kết quả thanh toán</h1>
      <p>
        Mã đơn hàng: <strong>{orderNo || 'N/A'}</strong>
      </p>
      <p>
        Trạng thái: <strong>{status}</strong>
      </p>
      <p>
        <Link href="/products">Tiếp tục mua sắm</Link>
      </p>
    </main>
  );
}

