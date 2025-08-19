type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
};

async function fetchProduct(slug: string): Promise<Product> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  const res = await fetch(`${base}/catalog/products/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải sản phẩm');
  const data = (await res.json()) as Product;
  return data;
}

import Link from 'next/link';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const product = await fetchProduct(p.slug);
  async function addToCart(formData: FormData) {
    'use server';
    const slug = String(formData.get('slug') || '');
    const qty = parseInt(String(formData.get('quantity') || '1'), 10) || 1;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const { cookies } = await import('next/headers');
    const c = await cookies();
    const token = c.get('accessToken')?.value;
    await fetch(`${base}/cart/items`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ slug, quantity: qty }),
      cache: 'no-store',
    });
    const { redirect } = await import('next/navigation');
    redirect('/cart');
  }
  return (
    <main style={{ padding: 24, maxWidth: 840, margin: '0 auto' }}>
      <Link href="/products">← Quay lại</Link>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16 }}>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.imageUrl ?? 'https://placehold.co/800x600?text=No+Image'} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
        </div>
        <div>
          <h1 style={{ marginTop: 0 }}>{product.name}</h1>
          <p style={{ color: '#555' }}>{product.description ?? 'Không có mô tả'}</p>
          <div style={{ fontSize: 20, fontWeight: 700, margin: '12px 0' }}>
            {(product.priceCents / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </div>
          <form action={addToCart} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="hidden" name="slug" value={product.slug} />
            <input type="number" name="quantity" min={1} defaultValue={1} style={{ width: 80 }} />
            <button type="submit" style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid #222' }}>Thêm vào giỏ</button>
          </form>
        </div>
      </div>
    </main>
  );
}
