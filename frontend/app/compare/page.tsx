'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCompareStore } from '@/store/compare-store';

export default function ComparePage() {
  const items = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);

  const allKeys = Array.from(
    new Set(
      items.flatMap((i) => Object.keys(i.specs || {}))
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">So sánh sản phẩm</h1>
          <div className="flex items-center gap-2">
            <Link href="/products" className="text-sm text-blue-600 hover:underline">Thêm sản phẩm</Link>
            {items.length > 0 && (
              <button onClick={clear} className="text-sm text-red-600 hover:underline">Xoá tất cả</button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border">
            <div className="text-6xl mb-3">📊</div>
            <p className="text-gray-600 mb-4">Chưa có sản phẩm nào để so sánh.</p>
            <Link href="/products" className="text-blue-600 hover:underline">Chọn sản phẩm</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 border-r w-48">Thông tin</th>
                  {items.map((p) => (
                    <th key={p.id} className="px-4 py-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded bg-gray-100 overflow-hidden">
                          <Image src={p.imageUrl || '/images/placeholder-product.jpg'} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <Link href={`/products/${p.slug}`} className="font-medium hover:text-blue-600">{p.name}</Link>
                          <div className="text-xs text-gray-500">{(p.priceCents/100).toLocaleString('vi-VN')} ₫</div>
                        </div>
                        <button className="text-xs text-red-600" onClick={() => remove(p.id)}>Xoá</button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allKeys.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3 border-r text-sm text-gray-600">Thông số</td>
                    <td className="px-4 py-3 text-sm" colSpan={items.length}>Chưa có thông số chi tiết</td>
                  </tr>
                ) : (
                  allKeys.map((k) => (
                    <tr key={k} className="odd:bg-gray-50/50">
                      <td className="px-4 py-3 border-r text-sm text-gray-600">{k}</td>
                      {items.map((p) => (
                        <td key={p.id} className="px-4 py-3 text-sm">
                          {String(p.specs?.[k] ?? '-')}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

