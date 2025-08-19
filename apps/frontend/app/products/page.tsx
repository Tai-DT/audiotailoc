type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
};

type ProductList = { items: Product[]; total: number; page: number; pageSize: number };

async function fetchProducts(params: { page?: number; pageSize?: number }): Promise<ProductList> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  const u = new URL(`${base}/catalog/products`);
  if (params.page) u.searchParams.set('page', String(params.page));
  if (params.pageSize) u.searchParams.set('pageSize', String(params.pageSize));
  const res = await fetch(u.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải danh sách sản phẩm');
  const data = (await res.json()) as ProductList;
  return data;
}

import Link from 'next/link';

export default async function ProductsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, parseInt(String(searchParams?.page ?? '1'), 10) || 1);
  const pageSize = 12;
  const { items, total } = await fetchProducts({ page, pageSize });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <main style={{ padding: 24 }}>
      <h1>Danh sách sản phẩm</h1>
      <ul style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', listStyle: 'none', padding: 0 }}>
        {items.map((p) => (
          <li key={p.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
            {p.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6 }} />
            ) : null}
            <h3 style={{ margin: '8px 0' }}>
              <Link href={`/products/${p.slug}`}>{p.name}</Link>
            </h3>
            <p style={{ margin: '4px 0', color: '#666' }}>{p.description ?? 'Không có mô tả'}</p>
            <strong>{(p.priceCents / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</strong>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        {page > 1 ? <Link href={`/products?page=${page - 1}`}>← Trang trước</Link> : <span />}
        <span>
          Trang {page}/{totalPages}
        </span>
        {page < totalPages ? <Link href={`/products?page=${page + 1}`}>Trang sau →</Link> : <span />}
      </div>
    </main>
  );
}
