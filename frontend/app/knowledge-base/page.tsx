'use client';

import React, { useState } from 'react';
import { PageBanner } from '@/components/ui/page-banner';
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

const categories = [
  'Tất cả',
  'Thiết lập hệ thống',
  'Tư vấn sản phẩm',
  'Bảo trì',
  'Sửa chữa',
  'Kỹ thuật',
  'Câu hỏi thường gặp'
];

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'helpful'>('newest');

  // Mock data for demonstration
  const mockArticles: KnowledgeBaseArticle[] = [
    {
      id: '1',
      title: 'Hướng dẫn thiết lập hệ thống âm thanh gia đình',
      content: 'Bài viết chi tiết về cách thiết lập hệ thống âm thanh gia đình chuyên nghiệp...',
      category: 'Thiết lập hệ thống',
      tags: ['âm thanh', 'gia đình', 'thiết lập'],
      published: true,
      viewCount: 1250,
      helpful: 45,
      notHelpful: 3,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Cách chọn loa phù hợp với không gian',
      content: 'Hướng dẫn chi tiết về cách chọn loa phù hợp với từng loại không gian...',
      category: 'Tư vấn sản phẩm',
      tags: ['loa', 'không gian', 'tư vấn'],
      published: true,
      viewCount: 890,
      helpful: 32,
      notHelpful: 2,
      createdAt: '2024-01-12T14:30:00Z',
      updatedAt: '2024-01-12T14:30:00Z',
    },
    {
      id: '3',
      title: 'Bảo trì và vệ sinh thiết bị âm thanh',
      content: 'Hướng dẫn bảo trì định kỳ cho các thiết bị âm thanh...',
      category: 'Bảo trì',
      tags: ['bảo trì', 'vệ sinh', 'thiết bị'],
      published: true,
      viewCount: 675,
      helpful: 28,
      notHelpful: 1,
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-10T09:15:00Z',
    },
    {
      id: '4',
      title: 'Khắc phục sự cố thường gặp với micro',
      content: 'Các vấn đề thường gặp với micro và cách khắc phục...',
      category: 'Sửa chữa',
      tags: ['micro', 'sửa chữa', 'khắc phục'],
      published: true,
      viewCount: 543,
      helpful: 21,
      notHelpful: 4,
      createdAt: '2024-01-08T16:45:00Z',
      updatedAt: '2024-01-08T16:45:00Z',
    }
  ];

  // Use real hooks when available, fallback to mock data
  const { data: articlesData } = useArticles({
    published: true,
    pageSize: 50
  });

  const { data: articleCategories } = useArticleCategories();

  const articles = articlesData?.items || mockArticles;
  const availableCategories = articleCategories || categories;  const filteredArticles = articles.filter(article => {
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
                      <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Eye className="h-3 w-3" />
                        <span>{article.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{helpfulPercentage}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {format(new Date(article.createdAt), 'dd/MM/yyyy', { locale: vi })}
                  </div>
                </div>

                <p className="text-gray-600 line-clamp-2">{article.content}</p>

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
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Eye className="h-3 w-3" />
              <span>{article.viewCount}</span>
            </div>
          </div>
          <Link href={`/knowledge-base/${article.id}`}>
            <CardTitle className="hover:text-blue-600 transition-colors line-clamp-2 text-lg">
              {article.title}
            </CardTitle>
          </Link>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.content}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">{helpfulPercentage}% hữu ích</span>
              </div>
              <span className="text-gray-500">
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
      {/* Page Banner */}
      <PageBanner
        page="knowledge-base"
        title="Kiến thức âm thanh"
        subtitle="Học hỏi và phát triển"
        description="Nơi chia sẻ kiến thức chuyên sâu về âm thanh, kỹ thuật, công nghệ và xu hướng mới nhất trong ngành. Cập nhật liên tục những bài viết hữu ích từ đội ngũ chuyên gia."
        showStats={true}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Kiến thức âm thanh</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá các bài viết hướng dẫn, mẹo vặt và kiến thức chuyên môn về âm thanh
            từ đội ngũ kỹ thuật viên giàu kinh nghiệm của Audio Tài Lộc
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm bài viết..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
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
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
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
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{articles.length}</div>
              <div className="text-sm text-gray-600">Bài viết</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {articles.reduce((sum, article) => sum + article.viewCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Lượt xem</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ThumbsUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {articles.reduce((sum, article) => sum + article.helpful, 0)}
              </div>
              <div className="text-sm text-gray-600">Đánh giá tốt</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Tag className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{availableCategories.length}</div>
              <div className="text-sm text-gray-600">Danh mục</div>
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
        {sortedArticles.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {sortedArticles.map(renderArticleCard)}
          </div>
        ) : (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-600">
              Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác
            </p>
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
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}