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
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description: 'Khám phá bộ sưu tập đầy đủ các sản phẩm audio chất lượng cao. Tai nghe, loa, ampli và phụ kiện âm thanh chính hãng với nhiều lựa chọn giá cả.',
  openGraph: {
    title: 'Sản phẩm Audio - Audio Tài Lộc',
    description: 'Khám phá bộ sưu tập đầy đủ các sản phẩm audio chất lượng cao.',
    url: '/products',
  },
};
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Danh sách sản phẩm</h1>
        <form className="flex flex-wrap gap-4 items-center p-4 bg-gray-50 rounded-lg">
          <input
            type="text"
            name="q"
            placeholder="Tìm kiếm..."
            defaultValue={q}
            className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="categoryId"
            defaultValue={categoryId ?? ''}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Chọn danh mục sản phẩm"
          >
            <option value="">Tất cả danh mục</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            name="minPrice"
            type="number"
            min={0}
            placeholder="Giá từ"
            defaultValue={minPrice ?? ''}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="maxPrice"
            type="number"
            min={0}
            placeholder="Giá đến"
            defaultValue={maxPrice ?? ''}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Lọc
          </button>
        </form>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {items.map((p) => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="aspect-square relative overflow-hidden">
              {p.imageUrl ? (
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">🎵</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                <Link href={`/products/${p.slug}`} className="hover:text-blue-600 transition-colors">
                  {p.name}
                </Link>
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {p.description ?? 'Không có mô tả'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">
                  {(p.priceCents / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-center space-x-4">
        {page > 1 ? (
          <Link
            href={`/products?${new URLSearchParams({ q, page: String(page - 1), categoryId: categoryId ?? '', minPrice: String(minPrice ?? ''), maxPrice: String(maxPrice ?? '') }).toString()}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ← Trang trước
          </Link>
        ) : (
          <div className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
            ← Trang trước
          </div>
        )}

        <span className="px-4 py-2 bg-gray-100 rounded-md font-medium">
          Trang {page}/{totalPages}
        </span>

        {page < totalPages ? (
          <Link
            href={`/products?${new URLSearchParams({ q, page: String(page + 1), categoryId: categoryId ?? '', minPrice: String(minPrice ?? ''), maxPrice: String(maxPrice ?? '') }).toString()}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Trang sau →
          </Link>
        ) : (
          <div className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
            Trang sau →
          </div>
        )}
      </div>
    </div>
  );
}
