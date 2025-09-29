'use client';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArrowRight, Calendar, Eye, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBlogArticles } from '@/lib/hooks/use-api';
import type { BlogArticle } from '@/lib/types';

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

export function FeaturedBlogSection() {
  const { data: articlesResponse, isLoading } = useBlogArticles({
    published: true,
    limit: 3,
  });

  const articles = articlesResponse?.data ?? [];

  const getCategoryColor = (category: any) => {
    const slug = category?.slug;
    const colors: Record<string, string> = {
      'huong-dan-mua-hang': 'bg-blue-100 text-blue-800',
      'chinh-sach': 'bg-green-100 text-green-800',
      'ky-thuat': 'bg-purple-100 text-purple-800',
      'thanh-toan': 'bg-orange-100 text-orange-800',
      'giao-hang': 'bg-cyan-100 text-cyan-800',
      'bao-hanh': 'bg-red-100 text-red-800',
    };
    if (slug && colors[slug]) {
      return colors[slug];
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Kiến thức & Hướng dẫn
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá các bài viết hữu ích về âm thanh, hướng dẫn sử dụng
            và những mẹo hay từ đội ngũ chuyên gia của Audio Tài Lộc.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.slice(0, 3).map((article: BlogArticle) => {
                const publishedDate = article.publishedAt ?? article.createdAt;
                const summary = article.excerpt || stripHtml(article.content).substring(0, 120);

                return (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category?.name || 'Chưa phân loại'}
                        </Badge>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.viewCount}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {article.commentCount}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-xl line-clamp-2 hover:text-primary cursor-pointer">
                        <Link href={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {summary}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(publishedDate), 'dd/MM/yyyy', { locale: vi })}
                        </div>
                      </div>

                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/blog/${article.slug}`}>
                          Đọc thêm
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button size="lg" asChild>
                <Link href="/blog">
                  Xem tất cả bài viết
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg mb-4">Chưa có bài viết nào được xuất bản.</p>
              <p>Hãy quay lại sau để xem các bài viết hữu ích từ Audio Tài Lộc!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
