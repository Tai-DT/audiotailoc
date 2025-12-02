'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Search,
  Calendar,
  Eye,
  ThumbsUp,
  BookOpen,
  Filter,
  ChevronRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBlogArticles, useBlogCategories } from '@/lib/hooks/use-api';
import { BlogArticle } from '@/lib/types';

export default function BlogNewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: articlesData, isLoading: articlesLoading } = useBlogArticles({
    published: true,
    page: 1,
    limit: 20,
    categoryId: selectedCategory || undefined,
    search: searchQuery || undefined,
  });

  const { data: categoriesData } = useBlogCategories({ published: true });

  const articles = articlesData?.data || [];
  const categories = categoriesData?.data || [];
  const isLoading = articlesLoading;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useBlogArticles hook
  };

  const getCategoryColor = (categoryName: string) => {
    const colors = {
      'Hướng dẫn': 'bg-blue-100 text-blue-800',
      'Chính sách': 'bg-green-100 text-green-800',
      'Kiến thức': 'bg-purple-100 text-purple-800',
      'Tin tức': 'bg-orange-100 text-orange-800',
      'Sản phẩm': 'bg-red-100 text-red-800',
    };
    return colors[categoryName as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Blog & Kiến thức
            </h1>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto">
              Khám phá kiến thức âm thanh, hướng dẫn sử dụng, và những thông tin hữu ích từ Audio Tài Lộc
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Tìm kiếm bài viết..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full h-9 text-sm"
                    />
                  </div>
                </form>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === '' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('')}
                    className="whitespace-nowrap h-9 text-sm px-3"
                    size="sm"
                  >
                    Tất cả
                  </Button>
                  {categories.slice(0, 5).map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category.id)}
                      className="whitespace-nowrap h-9 text-sm px-3"
                      size="sm"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy bài viết nào
                </h3>
                <p className="text-gray-500">
                  Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article: BlogArticle) => (
                  <Card key={article.id} className="group hover:shadow-lg transition-shadow duration-300">
                    <div className="relative overflow-hidden rounded-t-lg">
                      {article.imageUrl ? (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          width={400}
                          height={192}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge className={getCategoryColor(article.category?.name || 'Uncategorized')}>
                          {article.category?.name || 'Uncategorized'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        <Link href={`/blog-new/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>
                      {article.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {truncateText(article.excerpt, 120)}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.viewCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{article.likeCount}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {article.publishedAt
                              ? format(new Date(article.publishedAt), 'dd/MM/yyyy', { locale: vi })
                              : format(new Date(article.createdAt), 'dd/MM/yyyy', { locale: vi })
                            }
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link
                          href={`/blog-new/${article.slug}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Đọc thêm
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {articlesData && articlesData.pagination.totalPages > 1 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Xem thêm bài viết
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            {/* Categories */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Danh mục
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === '' ? 'default' : 'ghost'}
                    onClick={() => setSelectedCategory('')}
                    className="w-full justify-start"
                  >
                    Tất cả bài viết
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'ghost'}
                      onClick={() => setSelectedCategory(category.id)}
                      className="w-full justify-start"
                    >
                      {category.name}
                      {category._count && (
                        <span className="ml-auto text-xs text-gray-500">
                          ({category._count.articles})
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5" />
                  Bài viết nổi bật
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles.slice(0, 5).map((article: BlogArticle) => (
                    <div key={article.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                        {article.imageUrl ? (
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          <Link
                            href={`/blog-new/${article.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {article.title}
                          </Link>
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Eye className="h-3 w-3" />
                          <span>{article.viewCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}