type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
};

type ProductList = { items: Product[]; total: number; page: number; pageSize: number };
type Category = { id: string; slug: string; name: string };

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
async function fetchCategories(): Promise<Category[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  const res = await fetch(`${base}/catalog/categories`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải danh mục');
  return (await res.json()) as Category[];
}

async function searchProducts(params: { q?: string; page?: number; pageSize?: number; categoryId?: string; minPrice?: number; maxPrice?: number }) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  // Try AI semantic search first
  if (params.q) {
    try {
      const u1 = new URL(`${base}/ai/search`);
      u1.searchParams.set('q', String(params.q));
      const ai = await fetch(u1.toString(), { cache: 'no-store' }).then((r) => r.json());
      const items = Array.isArray(ai.items) ? ai.items : ai;
      const hits = (items || []).map((it: any) => ({
        id: it.product?.id || it.id,
        slug: it.product?.slug || it.slug,
        name: it.product?.name || it.title || 'Kết quả',
        description: it.product?.description || it.content || null,
        priceCents: it.product?.priceCents || 0,
        imageUrl: it.product?.imageUrl || null,
      })) as Product[];
      return { hits, estimatedTotalHits: hits.length, page: params.page || 1, pageSize: params.pageSize || hits.length } as any;
    } catch {}
  }
  // Fallback keyword search
  const u = new URL(`${base}/catalog/search`);
  if (params.q) u.searchParams.set('q', String(params.q));
  if (params.page) u.searchParams.set('page', String(params.page));
  if (params.pageSize) u.searchParams.set('pageSize', String(params.pageSize));
  if (params.categoryId) u.searchParams.set('categoryId', params.categoryId);
  if (typeof params.minPrice === 'number') u.searchParams.set('minPrice', String(params.minPrice));
  if (typeof params.maxPrice === 'number') u.searchParams.set('maxPrice', String(params.maxPrice));
  const res = await fetch(u.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tìm kiếm');
  return (await res.json()) as { hits: Product[]; estimatedTotalHits?: number; page: number; pageSize: number; facetDistribution?: { categoryId?: Record<string, number> } };
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; categoryId?: string; minPrice?: string; maxPrice?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(String(sp?.page ?? '1'), 10) || 1);
  const pageSize = 12;
  const q = sp?.q ?? '';
  const categoryId = sp?.categoryId || undefined;
  const minPrice = sp?.minPrice ? Number(sp.minPrice) : undefined;
  const maxPrice = sp?.maxPrice ? Number(sp.maxPrice) : undefined;
  const cats = await fetchCategories();
  let items: Product[] = [];
  let total = 0;
  if (q || categoryId || typeof minPrice === 'number' || typeof maxPrice === 'number') {
    const res = await searchProducts({ q, page, pageSize, categoryId, minPrice, maxPrice });
    items = res.hits;
    total = res.estimatedTotalHits ?? res.hits.length;
  } else {
    const list = await fetchProducts({ page, pageSize });
    items = list.items;
    total = list.total;
  }
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <main style={{ padding: 24 }}>
      <h1>Danh sách sản phẩm</h1>
      <form style={{ margin: '12px 0', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input type="text" name="q" placeholder="Tìm kiếm..." defaultValue={q} />
        <select name="categoryId" defaultValue={categoryId ?? ''}>
          <option value="">Tất cả danh mục</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input name="minPrice" type="number" min={0} placeholder="Giá từ" defaultValue={minPrice ?? ''} />
        <input name="maxPrice" type="number" min={0} placeholder="Giá đến" defaultValue={maxPrice ?? ''} />
        <button type="submit">Lọc</button>
      </form>
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
        {page > 1 ? (
          <Link href={`/products?${new URLSearchParams({ q, page: String(page - 1), categoryId: categoryId ?? '', minPrice: String(minPrice ?? ''), maxPrice: String(maxPrice ?? '') }).toString()}`}>
            ← Trang trước
          </Link>
        ) : (
          <span />
        )}
        <span>
          Trang {page}/{totalPages}
        </span>
        {page < totalPages ? (
          <Link href={`/products?${new URLSearchParams({ q, page: String(page + 1), categoryId: categoryId ?? '', minPrice: String(minPrice ?? ''), maxPrice: String(maxPrice ?? '') }).toString()}`}>
            Trang sau →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
