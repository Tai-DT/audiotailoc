"use client";

import React from 'react';
import { useArticles } from '@/lib/hooks/use-api';
import Link from 'next/link';

export function FeaturedKnowledgeSection() {
  const { data, isLoading } = useArticles({ page: 1, pageSize: 3, published: true });

  if (isLoading) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Kiến thức & Hướng dẫn</h2>
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      </section>
    );
  }

  const articles = data?.items || [];
  if (articles.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Kiến thức & Hướng dẫn</h2>
          <p className="text-muted-foreground">Tài liệu hữu ích giúp bạn hiểu rõ hơn về sản phẩm và dịch vụ</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {articles.map(article => (
            <Link
              key={article.id}
              href={`/knowledge/${article.id}`}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-3">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                  {article.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {article.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {article.viewCount || 0} lượt xem
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xem tất cả bài viết
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
