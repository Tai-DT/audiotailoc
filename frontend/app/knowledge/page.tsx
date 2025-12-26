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
        <div className="text-destructive">Lỗi tải dữ liệu: {error instanceof Error ? error.message : 'Không xác định'}</div>
      </div>
    );
  }

  const articles = data?.items || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-tertiary bg-clip-text text-transparent">Kiến thức & Hướng dẫn</h1>
      <p className="text-muted-foreground mb-8">Tài liệu hữu ích giúp bạn hiểu rõ hơn về sản phẩm và dịch vụ</p>
      
      {articles.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-xl border border-border">
          <p className="text-muted-foreground text-lg">Chưa có bài viết nào.</p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {articles.map(article => (
            <li key={article.id} className="border border-border rounded-lg p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 bg-card hover:bg-accent/5">
              <a href={`/knowledge/${article.id}`} className="block group">
                <h2 className="font-semibold text-lg line-clamp-2 mb-3 text-foreground group-hover:text-primary transition-colors">{article.title}</h2>
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent"></span>
                  {article.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {article.tags?.map(tag => (
                    <span key={tag} className="text-xs bg-secondary/80 text-secondary-foreground px-3 py-1 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">{tag}</span>
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
