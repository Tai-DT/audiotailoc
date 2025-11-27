'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';
import {
  Search,
  Calendar,
  Tag,
  Eye,
  ThumbsUp,
  MessageCircle,
  BookOpen,
  Filter,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBlogArticles, useBlogCategories } from '@/lib/hooks/use-api';
import type { BlogArticle, BlogCategory } from '@/lib/types';

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, '');

const getCategoryColor = (category: BlogCategory | undefined) => {
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

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      published: true,
      page: 1,
      limit: 12,
      search: searchQuery.trim() ? searchQuery.trim() : undefined,
      categoryId: selectedCategory || undefined,
    }),
    [searchQuery, selectedCategory],
  );

  const { data: articlesResponse, isLoading: articlesLoading } = useBlogArticles(filters);
  const { data: categories } = useBlogCategories({ published: true, limit: 100 });

  const articles = articlesResponse?.data ?? [];
  const pagination = articlesResponse?.pagination;

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Blog & Kiến thức
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Khám phá kiến thức âm thanh, hướng dẫn sử dụng,
                và những thông tin hữu ích từ Audio Tài Lộc.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg"
                  />
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Danh mục
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant={selectedCategory === null ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Tất cả bài viết
                    </Button>
                    {categories?.map((category: BlogCategory) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Highlighted tags from SEO keywords */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Chủ đề nổi bật
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {(articles
                        .flatMap((article) => (article.seoKeywords ? article.seoKeywords.split(',') : []))
                        .map((keyword) => keyword.trim())
                        .filter((keyword, index, array) => keyword && array.indexOf(keyword) === index)
                        .slice(0, 8)
                      ).map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="capitalize">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {articlesLoading ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, index) => (
                      <Card key={index} className="animate-pulse overflow-hidden flex flex-col h-full">
                        <div className="h-48 bg-muted flex-shrink-0 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                        <CardHeader>
                          <div className="h-6 bg-muted rounded mb-2 w-20"></div>
                          <div className="h-6 bg-muted rounded mb-2"></div>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-20 bg-muted rounded mb-4"></div>
                          <div className="flex gap-4">
                            <div className="h-4 bg-muted rounded w-20"></div>
                            <div className="h-4 bg-muted rounded w-16"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : articles.length > 0 ? (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-2">
                        {searchQuery.trim() ? `Kết quả cho "${searchQuery.trim()}"` : 'Bài viết mới nhất'}
                      </h2>
                      <p className="text-muted-foreground">
                        {pagination?.total ?? articles.length} bài viết
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {articles.map((article: BlogArticle) => {
                        const publishedDate = article.publishedAt ?? article.createdAt;
                        const summary = article.excerpt || stripHtml(article.content).substring(0, 160);

                        return (
                          <Card key={article.id} className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
                            <div className="relative h-48 w-full flex-shrink-0 bg-muted">
                              {article.imageUrl ? (
                                <Image
                                  src={article.imageUrl}
                                  alt={article.title}
                                  fill
                                  className="object-cover transition-transform hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                  <BookOpen className="h-12 w-12" />
                                </div>
                              )}
                            </div>
                            <CardHeader className="flex-grow">
                              <div className="flex items-start justify-between mb-2">
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
                            <CardContent className="mt-auto">
                              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(publishedDate), 'dd/MM/yyyy', { locale: vi })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  {article.likeCount}
                                </div>
                              </div>

                              <Button variant="outline" className="w-full" asChild>
                                <Link href={`/blog/${article.slug}`}>
                                  Đọc thêm
                                  <ChevronRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {searchQuery ? 'Không tìm thấy bài viết nào' : 'Chưa có bài viết nào'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery
                        ? 'Hãy thử tìm kiếm với từ khóa khác hoặc đổi bộ lọc.'
                        : 'Chúng tôi đang chuẩn bị nội dung hữu ích cho bạn. Hãy quay lại sau!'}
                    </p>
                    {searchQuery && (
                      <Button onClick={() => setSearchQuery('')}>
                        Xem tất cả bài viết
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Theo dõi tin tức mới nhất</h2>
              <p className="text-muted-foreground mb-8">
                Đăng ký nhận bản tin để không bỏ lỡ những bài viết hữu ích
                và ưu đãi đặc biệt từ Audio Tài Lộc.
              </p>
              <div className="flex gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1"
                />
                <Button>Đăng ký</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
