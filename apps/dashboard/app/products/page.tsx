import { apiFetch } from '../lib/api';
import AdminNotice from '../AdminNotice';

type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  priceCents: number;
};

async function fetchProducts(): Promise<Product[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  const res = await fetch(`${base}/catalog/products`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải danh sách sản phẩm');
  const data = (await res.json()) as Product[];
  return data;
}

export default async function DashboardProductsPage({ searchParams }: { searchParams: { q?: string; page?: string; pageSize?: string; sortBy?: string; sortOrder?: string } }) {
  const q = searchParams?.q ?? '';
  const page = Math.max(1, parseInt(String(searchParams?.page ?? '1'), 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(String(searchParams?.pageSize ?? '20'), 10) || 20));
  const sortBy = (searchParams?.sortBy ?? 'createdAt') as 'createdAt' | 'name' | 'priceCents';
  const sortOrder = (searchParams?.sortOrder ?? 'desc') as 'asc' | 'desc';
  let products: Product[] = [];
  let total = 0;
  if (q) {
    const res = await (await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/catalog/search?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`, { cache: 'no-store' })).json();
    const out = res as { hits: Product[]; estimatedTotalHits?: number };
    products = out.hits;
    total = out.estimatedTotalHits ?? out.hits.length;
  } else {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/catalog/products`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('pageSize', String(pageSize));
    url.searchParams.set('sortBy', sortBy);
    url.searchParams.set('sortOrder', sortOrder);
    const res = await (await fetch(url.toString(), { cache: 'no-store' })).json();
    const out = res as { items: Product[]; total: number };
    products = out.items;
    total = out.total;
  }
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const me = await apiFetch<{ userId: string | null; role?: string | null }>('/auth/me').catch(() => null);
  const isAdmin = me?.role === 'ADMIN';
  const mkHref = (params: Partial<{ page: number; pageSize: number; sortBy: string; sortOrder: string }>) => {
    const u = new URL('http://dummy');
    u.searchParams.set('q', q);
    u.searchParams.set('page', String(params.page ?? page));
    u.searchParams.set('pageSize', String(params.pageSize ?? pageSize));
    u.searchParams.set('sortBy', String(params.sortBy ?? sortBy));
    u.searchParams.set('sortOrder', String(params.sortOrder ?? sortOrder));
    const s = u.search.toString();
    return `?${s.startsWith('?') ? s.slice(1) : s}`;
  };
  const nextOrderFor = (col: 'createdAt' | 'name' | 'priceCents') => (sortBy === col ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
  async function deleteProductAction(formData: FormData) {
    'use server';
    const slug = String(formData.get('slug') || '');
    const returnTo = String(formData.get('returnTo') || '/products');
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const token = (await import('next/headers')).cookies().get('accessToken')?.value;
    const res = await fetch(`${base}/catalog/products/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const { cookies } = await import('next/headers');
    const { redirect } = await import('next/navigation');
    if (!res.ok) {
      cookies().set('flash', JSON.stringify({ type: 'error', message: 'Xóa thất bại' }), { path: '/', httpOnly: true, maxAge: 10 });
      redirect(returnTo);
    }
    cookies().set('flash', JSON.stringify({ type: 'success', message: 'Đã xóa sản phẩm' }), { path: '/', httpOnly: true, maxAge: 10 });
    redirect(returnTo);
  }
  async function bulkDeleteAction(formData: FormData) {
    'use server';
    const { cookies } = await import('next/headers');
    const { redirect } = await import('next/navigation');
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const token = (await import('next/headers')).cookies().get('accessToken')?.value;
    const slugs = new Set<string>(formData.getAll('slugs').map((v) => String(v)));
    // Merge with cookie selection across pages
    const cookieSel = cookies().get('adminSel')?.value;
    if (cookieSel) {
      try {
        const arr = JSON.parse(cookieSel) as string[];
        arr.forEach((s) => slugs.add(s));
      } catch {}
    }
    const returnTo = String(formData.get('returnTo') || '/products');
    if (slugs.size === 0) {
      cookies().set('flash', JSON.stringify({ type: 'error', message: 'Chưa chọn sản phẩm nào' }), { path: '/', httpOnly: true, maxAge: 10 });
      redirect(returnTo);
    }
    // Use backend batch endpoint
    const res = await fetch(`${base}/catalog/products`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ slugs: Array.from(slugs) }),
    });
    if (!res.ok) {
      cookies().set('flash', JSON.stringify({ type: 'error', message: 'Xóa thất bại' }), { path: '/', httpOnly: true, maxAge: 10 });
      redirect(returnTo);
    }
    const data = (await res.json()) as { deleted: number };
    cookies().set('flash', JSON.stringify({ type: 'success', message: `Đã xóa ${data.deleted} sản phẩm` }), { path: '/', httpOnly: true, maxAge: 10 });
    // Clear selection cookie after batch action
    cookies().set('adminSel', '', { path: '/', httpOnly: true, maxAge: 0 });
    redirect(returnTo);
  }
  const ConfirmDeleteButton = (await import('./ConfirmDeleteButton')).default;
  const SelectAll = (await import('./SelectAll')).default;
  const RowSelect = (await import('./RowSelect')).default;
  const { SelectedIndicator } = await import('./RowSelect');
  return (
    <main style={{ padding: 24 }}>
      <h1>Sản phẩm (Admin)</h1>
      {!isAdmin ? <AdminNotice /> : null}
      <form style={{ margin: '12px 0', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input type="text" name="q" placeholder="Tìm kiếm..." defaultValue={q} />
        <label>
          Kích thước trang:{' '}
          <select name="pageSize" defaultValue={String(pageSize)}>
            {[10, 20, 50, 100].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sắp xếp theo:{' '}
          <select name="sortBy" defaultValue={sortBy} disabled={!!q}>
            <option value="createdAt">Ngày tạo</option>
            <option value="name">Tên</option>
            <option value="priceCents">Giá</option>
          </select>
        </label>
        <label>
          Thứ tự:{' '}
          <select name="sortOrder" defaultValue={sortOrder} disabled={!!q}>
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </label>
        <button type="submit">Áp dụng</button>
      </form>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>Tổng số: {total}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {page > 1 ? (
            <a href={mkHref({ page: page - 1 })}>
              ← Trang trước
            </a>
          ) : (
            <span />
          )}
          <span>
            Trang {page}/{totalPages}
          </span>
          {page < totalPages ? (
            <a href={mkHref({ page: page + 1 })}>
              Trang sau →
            </a>
          ) : (
            <span />
          )}
        </div>
      </div>
      {isAdmin ? (
      <form action={bulkDeleteAction}>
        <input type="hidden" name="returnTo" value={mkHref({})} />
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ConfirmDeleteButton>Xóa đã chọn</ConfirmDeleteButton>
          <SelectedIndicator />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center', borderBottom: '1px solid #ddd', padding: 8, width: 36 }}>
                <SelectAll name="slugs" />
              </th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>
                <a href={mkHref({ sortBy: 'name', sortOrder: nextOrderFor('name'), page: 1 })} title="Sắp xếp theo tên">
                  Tên {sortBy === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </a>
              </th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Slug</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>
                <a href={mkHref({ sortBy: 'priceCents', sortOrder: nextOrderFor('priceCents'), page: 1 })} title="Sắp xếp theo giá">
                  Giá {sortBy === 'priceCents' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </a>
              </th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: 8, textAlign: 'center' }}>
                  <RowSelect slug={p.slug} name="slugs" />
                </td>
                <td style={{ padding: 8 }}>{p.name}</td>
                <td style={{ padding: 8 }}>{p.slug}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{(p.priceCents / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                <td style={{ padding: 8 }}>
                  <a href={`/products/${encodeURIComponent(p.slug)}/edit`} style={{ marginRight: 8 }}>
                    Chỉnh sửa
                  </a>
                  <form action={deleteProductAction} style={{ display: 'inline' }}>
                    <input type="hidden" name="slug" value={p.slug} />
                    <input type="hidden" name="returnTo" value={mkHref({})} />
                    <ConfirmDeleteButton>Xóa</ConfirmDeleteButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
import { apiFetch } from '../lib/api';
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>
                <a href={mkHref({ sortBy: 'name', sortOrder: nextOrderFor('name'), page: 1 })} title="Sắp xếp theo tên">
                  Tên {sortBy === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </a>
              </th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Slug</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>
                <a href={mkHref({ sortBy: 'priceCents', sortOrder: nextOrderFor('priceCents'), page: 1 })} title="Sắp xếp theo giá">
                  Giá {sortBy === 'priceCents' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: 8 }}>{p.name}</td>
                <td style={{ padding: 8 }}>{p.slug}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{(p.priceCents / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
