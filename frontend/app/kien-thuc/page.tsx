"use client";
import React from 'react';
import { useArticles } from '@/lib/hooks/use-api';

export default function KienThucPage() {
  const { data, isLoading, error } = useArticles({ page: 1, pageSize: 12, published: true });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Kiến thức & Hướng dẫn</h1>
        <div>Đang tải bài viết...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Kiến thức & Hướng dẫn</h1>
        <div className="text-red-600">Lỗi tải dữ liệu: {error instanceof Error ? error.message : 'Không xác định'}</div>
      </div>
    );
  }

  const articles = data?.items || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Kiến thức & Hướng dẫn</h1>
      
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Chưa có bài viết nào.</p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {articles.map(article => (
            <li key={article.id} className="border rounded-md p-4 hover:shadow-sm transition">
              <a href={`/kien-thuc/${article.id}`} className="block">
                <h2 className="font-semibold text-lg line-clamp-2 mb-2">{article.title}</h2>
                <p className="text-xs text-slate-500 mb-2">Chuyên mục: {article.category}</p>
                <div className="text-xs flex flex-wrap gap-2 text-slate-500">
                  {article.tags?.map(tag => (
                    <span key={tag} className="bg-slate-100 px-2 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
