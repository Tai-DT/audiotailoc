import Link from 'next/link';
import { redirect } from 'next/navigation';
import { apiFetch, fetchProduct, updateProduct, uploadFile } from '../../../lib/api';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const me = await apiFetch<{ role?: string }>('/auth/me').catch(() => null);
  if (me?.role !== 'ADMIN') {
    const c = await cookies();
    c.set('flash', JSON.stringify({ type: 'error', message: 'Bạn không có quyền truy cập' }), { path: '/', httpOnly: true, maxAge: 10 });
    redirect('/products');
  }
  const product = await fetchProduct(p.slug);

  async function action(form: FormData) {
    'use server';
    try {
      const name = String(form.get('name') || '').trim();
      const slug = String(form.get('slug') || '').trim();
      const description = String(form.get('description') || '').trim() || null;
      const priceVnd = parseFloat(String(form.get('price') || '0')) || 0;
      const priceCents = Math.round(priceVnd * 100);
      let imageUrl: string | undefined = product.imageUrl ?? undefined;

      const file = form.get('image') as File | null;
      if (file && (file as any).size > 0) {
        const up = await uploadFile(file);
        imageUrl = up.url;
      }

      await updateProduct(p.slug, { name, slug, description, priceCents, imageUrl });
      const c = await cookies();
      c.set('flash', JSON.stringify({ type: 'success', message: 'Cập nhật sản phẩm thành công' }), { path: '/', httpOnly: true, maxAge: 10 });
      redirect(`/products`);
    } catch (e) {
      const c = await cookies();
      c.set('flash', JSON.stringify({ type: 'error', message: 'Cập nhật sản phẩm thất bại' }), { path: '/', httpOnly: true, maxAge: 10 });
      redirect(`/products/${encodeURIComponent(p.slug)}/edit`);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 640 }}>
      <h1>Chỉnh sửa: {p.slug}</h1>
      <form action={action} style={{ display: 'grid', gap: 12 }}>
        <label>
          Tên
          <input name="name" required minLength={2} defaultValue={product.name} />
        </label>
        <label>
          Slug
          <input name="slug" required pattern="[a-z0-9-]+" title="Chỉ chữ thường, số và dấu gạch ngang" defaultValue={product.slug} />
        </label>
        <label>
          Mô tả
          <textarea name="description" rows={4} defaultValue={product.description ?? ''} />
        </label>
        <label>
          Giá (VND)
          <input name="price" type="number" min="0" step="1000" required defaultValue={(product.priceCents / 100).toFixed(0)} />
        </label>
        <label>
          Ảnh (chọn để thay đổi)
          <input name="image" type="file" accept="image/*" />
        </label>
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} style={{ maxWidth: 240, borderRadius: 6 }} />
        ) : null}
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">Lưu</button>
          <Link href="/products">Hủy</Link>
        </div>
      </form>
    </main>
  );
}
