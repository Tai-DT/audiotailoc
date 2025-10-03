"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';

interface KBArticleRow {
  id: string;
  title: string;
  category: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

interface ListResponse {
  items: KBArticleRow[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function KBArticlesAdminPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [published, setPublished] = useState<string>('');
  const pageSize = 20;

  const [data, setData] = useState<ListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryParams = useMemo(() => {
    const q = new URLSearchParams();
    q.set('page', String(page));
    q.set('pageSize', String(pageSize));
    if (search) q.set('search', search);
    if (category) q.set('category', category);
    if (published) q.set('published', published);
    return q.toString();
  }, [page, pageSize, search, category, published]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/kb/articles?${queryParams}`);
      if (!res.ok) throw new Error('Không tải được dữ liệu');
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Xoá bài viết này?')) return;
    const res = await fetch(`/api/admin/kb/articles/${id}`, { method: 'DELETE' });
    if (res.ok) loadData(); // Reload data after delete
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lý Kiến thức</h1>
        <a href="/kb/articles/create" className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-500">+ Bài mới</a>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <input placeholder="Tìm kiếm" value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }} className="border rounded px-2 py-1" />
        <input placeholder="Chuyên mục" value={category} onChange={e=>{ setCategory(e.target.value); setPage(1); }} className="border rounded px-2 py-1" />
        <select value={published} onChange={e=>{ setPublished(e.target.value); setPage(1); }} className="border rounded px-2 py-1">
          <option value="">-- Trạng thái --</option>
          <option value="true">Đã xuất bản</option>
          <option value="false">Nháp / Ẩn</option>
        </select>
        <div className="text-sm text-slate-500 flex items-center">Tổng: {data?.totalCount ?? '-'}</div>
      </div>

      {isLoading && <div>Đang tải...</div>}
      {error && <div className="text-red-600">Lỗi tải dữ liệu</div>}

      {data && (
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-2">Tiêu đề</th>
                <th className="p-2">Chuyên mục</th>
                <th className="p-2">Tags</th>
                <th className="p-2">Trạng thái</th>
                <th className="p-2">Cập nhật</th>
                <th className="p-2 w-32">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((a: KBArticleRow) => (
                <tr key={a.id} className="border-t hover:bg-slate-50">
                  <td className="p-2">
                    <a href={`/kb/articles/${a.id}/edit`} className="text-blue-600 hover:underline">{a.title}</a>
                  </td>
                  <td className="p-2">{a.category}</td>
                  <td className="p-2">
                    <div className="flex gap-1 flex-wrap">
                      {a.tags?.map((t: string) => <span key={t} className="px-1 py-0.5 bg-slate-200 rounded text-[10px]">{t}</span>)}
                    </div>
                  </td>
                  <td className="p-2">{a.published ? '✔️' : '—'}</td>
                  <td className="p-2 whitespace-nowrap">{new Date(a.updatedAt).toLocaleDateString()}</td>
                  <td className="p-2 space-x-2">
                    <a href={`/kb/articles/${a.id}/edit`} className="text-blue-600">Sửa</a>
                    <button onClick={()=>handleDelete(a.id)} className="text-red-600 hover:underline">Xoá</button>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr><td colSpan={6} className="p-4 text-center text-slate-500">Không có bài viết</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex gap-2 items-center">
          <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded disabled:opacity-40">Trước</button>
          <span>Trang {page} / {data.totalPages}</span>
          <button disabled={page>=data.totalPages} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded disabled:opacity-40">Sau</button>
        </div>
      )}
    </div>
  );
}
