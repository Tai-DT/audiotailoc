"use client";
import React, { useState, useEffect, useCallback } from 'react';

interface KBArticleDetail {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditKBArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = React.useState<string>('');

  React.useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);
  const [data, setData] = useState<KBArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true); setLoadError(null);
    try {
      const res = await fetch(`/api/admin/kb/articles/${id}`);
      if (!res.ok) throw new Error('Không tải được dữ liệu');
      const json = await res.json();
      setData(json);
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : 'Lỗi không xác định');
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { if (id) load(); }, [id, load]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string|null>(null);

  useEffect(() => {
    if (!data) return;
    setTitle(data.title);
    setCategory(data.category);
    setContent(data.content);
    setTags(data.tags?.join(', ') || '');
    setPublished(data.published);
  }, [data]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setSaveError(null);
    try {
      const res = await fetch(`/api/admin/kb/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
          published,
        })
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');
  await load();
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (loadError) return <div className="p-6 text-red-600">{loadError}</div>;
  if (!data) return <div className="p-6">Không tìm thấy bài viết</div>;

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sửa bài viết</h1>
        <a href="/kb/articles" className="text-sm text-slate-600">← Quay lại danh sách</a>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tiêu đề</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Chuyên mục</label>
          <input value={category} onChange={e=>setCategory(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nội dung</label>
          <textarea value={content} onChange={e=>setContent(e.target.value)} rows={12} required className="w-full border rounded px-3 py-2 font-mono text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (phân tách phẩy)</label>
          <input value={tags} onChange={e=>setTags(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input id="published" type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)} />
          <label htmlFor="published">Xuất bản</label>
        </div>
        {saveError && <div className="text-red-600 text-sm">{saveError}</div>}
        <div className="flex gap-3">
          <button disabled={saving} type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-50">
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <a href={`/kien-thuc/${id}`} className="text-sm text-slate-600" target="_blank">Xem công khai</a>
        </div>
      </form>
      <div className="text-xs text-slate-500">Tạo: {new Date(data.createdAt).toLocaleString()} • Cập nhật: {new Date(data.updatedAt).toLocaleString()}</div>
    </div>
  );
}
