import Link from 'next/link';
import { redirect } from 'next/navigation';
import { apiFetch, createProduct, uploadFile } from '../../lib/api';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const me = await apiFetch<{ role?: string }>('/auth/me').catch(() => null);
  if (me?.role !== 'ADMIN') {
    cookies().set('flash', JSON.stringify({ type: 'error', message: 'Bạn không có quyền truy cập' }), { path: '/', httpOnly: true, maxAge: 10 });
    redirect('/products');
  }
  async function action(form: FormData) {
    'use server';
    try {
      const name = String(form.get('name') || '').trim();
      const slug = String(form.get('slug') || '').trim();
      const description = String(form.get('description') || '').trim() || null;
      const priceVnd = parseFloat(String(form.get('price') || '0')) || 0;
      const priceCents = Math.round(priceVnd * 100);
      let imageUrl: string | undefined;

      const file = form.get('image') as File | null;
      if (file && (file as any).size > 0) {
        const up = await uploadFile(file);
        imageUrl = up.url;
      }

      await createProduct({ name, slug, description, priceCents, imageUrl });
      cookies().set('flash', JSON.stringify({ type: 'success', message: 'Tạo sản phẩm thành công' }), { path: '/', httpOnly: true, maxAge: 10 });
      redirect('/products');
    } catch (e) {
      cookies().set('flash', JSON.stringify({ type: 'error', message: 'Tạo sản phẩm thất bại' }), { path: '/', httpOnly: true, maxAge: 10 });
      redirect('/products/new');
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 640 }}>
      <h1>Tạo sản phẩm</h1>
      <form action={action} style={{ display: 'grid', gap: 12 }}>
        <label>
          Tên
          <input name="name" required minLength={2} placeholder="VD: Loa bluetooth" />
        </label>
        <label>
          Slug
          <input name="slug" required pattern="[a-z0-9-]+" title="Chỉ chữ thường, số và dấu gạch ngang" placeholder="vd: loa-bluetooth" />
        </label>
        <label>
          Mô tả
          <textarea name="description" rows={4} placeholder="Mô tả ngắn" />
        </label>
        <label>
          Giá (VND)
          <input name="price" type="number" min="0" step="1000" required />
        </label>
        <label>
          Ảnh
          <input name="image" type="file" accept="image/*" />
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">Lưu</button>
          <Link href="/products">Hủy</Link>
        </div>
      </form>
    </main>
  );
}
