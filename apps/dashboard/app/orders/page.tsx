import Link from 'next/link';

type Order = {
  id: string;
  orderNo: string;
  status: string;
  totalCents: number;
  createdAt: string;
};

async function fetchOrders(params: { page?: number; pageSize?: number; status?: string }) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  const u = new URL(`${base}/orders`);
  if (params.page) u.searchParams.set('page', String(params.page));
  if (params.pageSize) u.searchParams.set('pageSize', String(params.pageSize));
  if (params.status) u.searchParams.set('status', params.status);
  const res = await fetch(u.toString(), { cache: 'no-store', headers: {} });
  if (!res.ok) throw new Error('Không thể tải đơn hàng');
  return (await res.json()) as { total: number; page: number; pageSize: number; items: Order[] };
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(String(sp?.page ?? '1'), 10) || 1);
  const status = sp?.status ?? '';
  const pageSize = 20;
  const data = await fetchOrders({ page, pageSize, status: status || undefined });
  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));
  return (
    <main style={{ padding: 24 }}>
      <h1>Đơn hàng</h1>
      <form style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        <select name="status" defaultValue={status}>
          <option value="">Tất cả trạng thái</option>
          {['PENDING', 'PAID', 'FULFILLED', 'CANCELED', 'REFUNDED'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit">Lọc</button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Mã</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Trạng thái</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #eee', padding: 8 }}>Tổng</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Ngày</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((o) => (
            <tr key={o.id}>
              <td style={{ padding: 8 }}>{o.orderNo}</td>
              <td style={{ padding: 8 }}>{o.status}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{(o.totalCents / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
              <td style={{ padding: 8 }}>{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
              <td style={{ padding: 8 }}>
                <Link href={`/orders/${o.id}`}>Chi tiết</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {page > 1 ? <Link href={`/orders?page=${page - 1}&status=${encodeURIComponent(status)}`}>← Trước</Link> : <span />}
        <span>
          Trang {page}/{totalPages}
        </span>
        {page < totalPages ? <Link href={`/orders?page=${page + 1}&status=${encodeURIComponent(status)}`}>Sau →</Link> : <span />}
      </div>
    </main>
  );
}

