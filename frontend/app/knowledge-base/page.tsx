'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Search,
  BookOpen,
  ThumbsUp,
  Eye,
  Tag,
  Grid,
  List,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useArticles, useArticleCategories } from '@/lib/hooks/use-api';
import { KnowledgeBaseArticle } from '@/lib/types';

// Categories will be fetched from API

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'helpful'>('newest');

  // Use real hooks - no fallback to mock data
  const { data: articlesData } = useArticles({
    published: true,
    pageSize: 50
  });

  const { data: articleCategories } = useArticleCategories();

  const articles = articlesData?.items || [];
  const availableCategories = ['Tất cả', ...(articleCategories || [])];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'Tất cả' || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.viewCount - a.viewCount;
      case 'helpful':
        return (b.helpful - b.notHelpful) - (a.helpful - a.notHelpful);
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const renderArticleCard = (article: KnowledgeBaseArticle) => {
    const helpfulness = article.helpful + article.notHelpful;
    const helpfulPercentage = helpfulness > 0 ? Math.round((article.helpful / helpfulness) * 100) : 0;

    if (viewMode === 'list') {
      return (
        <Card key={article.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/knowledge-base/${article.id}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        <span>{article.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{helpfulPercentage}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {format(new Date(article.createdAt), 'dd/MM/yyyy', { locale: vi })}
                  </div>
                </div>

                <p className="text-muted-foreground line-clamp-2">{article.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/knowledge-base/${article.id}`}>
                    <Button variant="ghost" size="sm">
                      Đọc thêm
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={article.id} className="hover:shadow-lg transition-shadow h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Badge variant="secondary" className="mb-2">{article.category}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>{article.viewCount}</span>
            </div>
          </div>
          <Link href={`/knowledge-base/${article.id}`}>
            <CardTitle className="hover:text-primary transition-colors line-clamp-2 text-lg">
              {article.title}
            </CardTitle>
          </Link>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{article.content}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3 text-success" />
                <span className="text-success">{helpfulPercentage}% hữu ích</span>
              </div>
              <span className="text-muted-foreground">
                {format(new Date(article.createdAt), 'dd/MM/yyyy', { locale: vi })}
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <Link href={`/knowledge-base/${article.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                Đọc bài viết
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main role="main" aria-labelledby="knowledge-hero-title">
      {/* Compact Page Header */}
      <header className="bg-gradient-to-b from-primary/5 to-background border-b" role="banner">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Kiến thức</div>
            <h1 id="knowledge-hero-title" className="text-2xl sm:text-3xl font-bold mb-2">
              Kiến thức âm thanh
            </h1>
            <p className="text-sm text-muted-foreground">
              Khám phá các bài viết hướng dẫn, mẹo vặt và kiến thức chuyên môn từ đội ngũ kỹ thuật viên Audio Tài Lộc
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm bài viết..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    aria-label="Tìm kiếm trong kho kiến thức"
                  />
                </div>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: 'newest' | 'popular' | 'helpful') => setSortBy(value)}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="popular">Phổ biến nhất</SelectItem>
                  <SelectItem value="helpful">Hữu ích nhất</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  aria-label="Xem dạng lưới"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  aria-label="Xem dạng danh sách"
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{articles.length}</div>
              <div className="text-sm text-muted-foreground">Bài viết</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {articles.reduce((sum, article) => sum + article.viewCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Lượt xem</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ThumbsUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {articles.reduce((sum, article) => sum + article.helpful, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Đánh giá tốt</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Tag className="h-8 w-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold">{availableCategories.length}</div>
              <div className="text-sm text-muted-foreground">Danh mục</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            {availableCategories.slice(0, 7).map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Articles Grid/List */}
        <div className="mb-6 flex items-center justify-between text-sm" role="status" aria-live="polite">
          <p className="text-muted-foreground" id="articles-count">
            Hiển thị <span className="font-medium text-foreground">{sortedArticles.length}</span> bài viết
          </p>
        </div>
        {sortedArticles.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {sortedArticles.map(renderArticleCard)}
          </div>
        ) : (
          <div className="text-center py-16" role="alert" aria-live="polite">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <HelpCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy bài viết</h3>
            <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác hoặc danh mục khác</p>
          </div>
        )}

        {/* Popular Tags */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Tags phổ biến</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(articles.flatMap(article => article.tags)))
                .slice(0, 20)
                .map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </main>
    </div>
  );
}