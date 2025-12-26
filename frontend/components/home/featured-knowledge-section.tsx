"use client";

import React from 'react';
import { useArticles } from '@/lib/hooks/use-api';
import Link from 'next/link';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeaturedKnowledgeSection() {
  const { data, isLoading } = useArticles({ page: 1, pageSize: 3, published: true });

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20">
        <div className="section-shell">
          <div className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-[0_24px_120px_-60px_rgba(0,0,0,0.55)] text-center space-y-3">
            <h2 className="text-3xl font-bold text-foreground">Kiến thức & Hướng dẫn</h2>
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      </section>
    );
  }

  const articles = data?.items || [];
  if (articles.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="section-shell">
        <div className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-[0_24px_120px_-60px_rgba(0,0,0,0.55)] space-y-8">
          <div className="text-center space-y-3">
            <AnimatedGradientText
              className="text-3xl font-bold"
              speed={1.2}
              colorFrom="oklch(0.60 0.26 25)"
              colorTo="oklch(0.72 0.20 35)"
            >
              Kiến thức & Hướng dẫn
            </AnimatedGradientText>
            <p className="text-muted-foreground">Tài liệu hữu ích giúp bạn hiểu rõ hơn về sản phẩm và dịch vụ.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {articles.map(article => (
              <Link
                key={article.id}
                href={`/knowledge/${article.id}`}
                className="block rounded-2xl border border-border/60 bg-card/80 p-6 ring-1 ring-border/30 shadow-[0_30px_100px_-70px_rgba(0,0,0,0.75)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_40px_120px_-70px_rgba(0,0,0,0.85)]"
              >
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/20 text-accent-foreground rounded-full border border-accent/30">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-secondary/60 px-2 py-1 rounded text-secondary-foreground">
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
            <Link href="/knowledge">
              <Button size="lg" className="px-8">
                <span className="flex items-center gap-2">
                  Xem tất cả bài viết
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
