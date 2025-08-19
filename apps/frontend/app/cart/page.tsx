type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: { name: string; slug: string; imageUrl?: string | null };
};

export default async function CartPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/cart`, { cache: 'no-store', headers: {} });
  if (!res.ok) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Giỏ hàng</h1>
        <p>Vui lòng đăng nhập để xem giỏ hàng.</p>
      </main>
    );
  }
  const data = (await res.json()) as { items: (CartItem & { product: any })[]; subtotalCents: number };

  async function updateItem(formData: FormData) {
    'use server';
    const id = String(formData.get('id') || '');
    const qty = parseInt(String(formData.get('quantity') || '1'), 10) || 1;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const { cookies } = await import('next/headers');
    const c = await cookies();
    const token = c.get('accessToken')?.value;
    await fetch(`${base}/cart/items/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ quantity: qty }),
    });
  }

  async function removeItem(formData: FormData) {
    'use server';
    const id = String(formData.get('id') || '');
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const { cookies } = await import('next/headers');
    const c = await cookies();
    const token = c.get('accessToken')?.value;
    await fetch(`${base}/cart/items/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Giỏ hàng</h1>
      {data.items.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Sản phẩm</th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #eee', padding: 8 }}>Số lượng</th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #eee', padding: 8 }}>Đơn giá</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((it) => (
                <tr key={it.id}>
                  <td style={{ padding: 8 }}>{it.product?.name || it.productId}</td>
                  <td style={{ padding: 8, textAlign: 'right' }}>
                    <form action={updateItem} style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <input type="hidden" name="id" value={it.id} />
                      <input type="number" name="quantity" min={0} defaultValue={it.quantity} style={{ width: 80 }} />
                      <button type="submit">Cập nhật</button>
                    </form>
                  </td>
                  <td style={{ padding: 8, textAlign: 'right' }}>{(it.unitPrice / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                  <td style={{ padding: 8 }}>
                    <form action={removeItem} style={{ display: 'inline' }}>
                      <input type="hidden" name="id" value={it.id} />
                      <button type="submit">Xóa</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, textAlign: 'right' }}>
            <strong>Tạm tính: {(data.subtotalCents / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</strong>
          </div>
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <a href="/checkout" style={{ padding: '10px 16px', border: '1px solid #222', borderRadius: 6 }}>
              Thanh toán
            </a>
          </div>
        </>
      )}
    </main>
  );
}

