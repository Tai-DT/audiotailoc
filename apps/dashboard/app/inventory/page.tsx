type InvItem = { productId: string; stock: number; reserved: number; lowStockThreshold: number; product: { name: string; slug: string } };

async function fetchInventory(params: { page?: number; pageSize?: number }) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  const u = new URL(`${base}/inventory`);
  if (params.page) u.searchParams.set('page', String(params.page));
  if (params.pageSize) u.searchParams.set('pageSize', String(params.pageSize));
  const res = await fetch(u.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải tồn kho');
  return (await res.json()) as { total: number; page: number; pageSize: number; items: InvItem[] };
}

export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(String(sp?.page ?? '1'), 10) || 1);
  const pageSize = 20;
  const data = await fetchInventory({ page, pageSize });
  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  async function adjust(form: FormData) {
    'use server';
    const productId = String(form.get('productId') || '');
    const delta = parseInt(String(form.get('stockDelta') || '0'), 10) || 0;
    const low = parseInt(String(form.get('lowStockThreshold') || ''), 10);
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    await fetch(`${base}/inventory/${encodeURIComponent(productId)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ stockDelta: delta, lowStockThreshold: isNaN(low) ? undefined : low }),
    });
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Tồn kho</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Sản phẩm</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #eee', padding: 8 }}>Tồn</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #eee', padding: 8 }}>Giữ chỗ</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #eee', padding: 8 }}>Cảnh báo</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Điều chỉnh</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((i) => (
            <tr key={i.productId}>
              <td style={{ padding: 8 }}>{i.product.name}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{i.stock}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{i.reserved}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{i.lowStockThreshold}</td>
              <td style={{ padding: 8 }}>
                <form action={adjust} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="hidden" name="productId" value={i.productId} />
                  <input name="stockDelta" type="number" placeholder="± số lượng" style={{ width: 120 }} />
                  <input name="lowStockThreshold" type="number" placeholder="Ngưỡng cảnh báo" style={{ width: 160 }} />
                  <button type="submit">Lưu</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {page > 1 ? <a href={`?page=${page - 1}`}>← Trước</a> : <span />}
        <span>
          Trang {page}/{totalPages}
        </span>
        {page < totalPages ? <a href={`?page=${page + 1}`}>Sau →</a> : <span />}
      </div>
    </main>
  );
}

