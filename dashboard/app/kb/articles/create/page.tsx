"use client";
import React, { useState } from 'react';

export default function CreateKBArticlePage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      const res = await fetch('/api/admin/kb/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
          published,
        })
      });
      if (!res.ok) throw new Error('Tạo thất bại');
      const json = await res.json();
      window.location.href = `/kb/articles/${json.id}/edit`;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(msg);
    } finally { setSaving(false); }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Tạo bài viết mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tiêu đề</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Chuyên mục</label>
          <input value={category} onChange={e=>setCategory(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nội dung (HTML hoặc Markdown convert trước)</label>
          <textarea value={content} onChange={e=>setContent(e.target.value)} rows={10} required className="w-full border rounded px-3 py-2 font-mono text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (phân tách bằng dấu phẩy)</label>
          <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="tag1, tag2" className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input id="published" type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)} />
          <label htmlFor="published">Xuất bản ngay</label>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-3">
          <button disabled={saving} type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-50">
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
          <a href="/kb/articles" className="text-sm text-slate-600">Huỷ</a>
        </div>
      </form>
    </div>
  );
}
