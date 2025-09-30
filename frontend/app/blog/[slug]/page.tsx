'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ArrowLeft,
  Calendar,
  Tag,
  Eye,
  ThumbsUp,
  Share2,
  Clock,
  User,
  MessageCircle,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useBlogArticleBySlug, useBlogArticles } from '@/lib/hooks/use-api';
import { toast } from 'react-hot-toast';
import { BlogStructuredData } from '@/components/seo/blog-structured-data';
import type { BlogArticle } from '@/lib/types';

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, '');

const getCategoryColor = (slug?: string | null) => {
  const colors: Record<string, string> = {
    'huong-dan-mua-hang': 'bg-blue-100 text-blue-800',
    'chinh-sach': 'bg-green-100 text-green-800',
    'ky-thuat': 'bg-purple-100 text-purple-800',
    'thanh-toan': 'bg-orange-100 text-orange-800',
    'giao-hang': 'bg-cyan-100 text-cyan-800',
    'bao-hanh': 'bg-red-100 text-red-800',
  };
  return slug && colors[slug] ? colors[slug] : 'bg-gray-100 text-gray-800';
};

const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = stripHtml(content).trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: article, isLoading, error } = useBlogArticleBySlug(slug);

  const relatedFilters = React.useMemo(
    () => ({
      published: true,
      page: 1,
      limit: 3,
      categoryId: article?.categoryId,
    }),
    [article?.categoryId],
  );

  const { data: relatedArticlesResponse } = useBlogArticles(relatedFilters);
  const relatedArticles = (relatedArticlesResponse?.data ?? []).filter((related) => related.id !== article?.id);

  const handleShare = async () => {
    if (!article) return;

    const shareData = {
      title: article.title,
      text: (article.excerpt || stripHtml(article.content)).substring(0, 100),
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // fallthrough to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      toast.success('Đã sao chép liên kết!');
    } catch {
      toast.error('Không thể sao chép liên kết, vui lòng thử lại.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-12 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Không tìm thấy bài viết
            </h1>
            <p className="text-muted-foreground mb-8">
              Bài viết bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại blog
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const publishedDate = article.publishedAt ?? article.createdAt;
  const keywords = article.seoKeywords
    ? article.seoKeywords.split(',').map((keyword) => keyword.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <BlogStructuredData article={article} />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          <span>/</span>
          <span className="text-foreground">{article.title}</span>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article>
              <header className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getCategoryColor(article.category?.slug)}>
                    {article.category?.name || 'Chưa phân loại'}
                  </Badge>
                  {article.status === 'PUBLISHED' && (
                    <Badge variant="secondary">Đã xuất bản</Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold mb-4 leading-tight">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(publishedDate), 'dd/MM/yyyy', { locale: vi })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {calculateReadingTime(article.content)} phút đọc
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {article.viewCount} lượt xem
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {article.likeCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {article.commentCount} bình luận
                  </div>
                </div>

                {article.author && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <User className="h-4 w-4" />
                    {article.author.name || article.author.email}
                  </div>
                )}

                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs capitalize">
                        <Tag className="h-3 w-3 mr-1" />
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ
                  </Button>
                </div>
              </header>

              {article.imageUrl && (
                <div className="mb-8">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={800}
                    height={400}
                    className="w-full rounded-lg object-cover"
                  />
                </div>
              )}

              <div className="prose prose-neutral max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.content}
                </ReactMarkdown>
              </div>
            </article>

            <Separator className="my-12" />

            {relatedArticles.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Bài viết liên quan</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedArticles.map((related: BlogArticle) => (
                    <Card key={related.id}>
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2">
                          <Link href={`/blog/${related.slug}`} className="hover:text-primary">
                            {related.title}
                          </Link>
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(related.publishedAt ?? related.createdAt), 'dd/MM/yyyy', { locale: vi })}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {related.excerpt || stripHtml(related.content).substring(0, 140)}...
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bài viết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start justify-between">
                  <span>Trạng thái</span>
                  <Badge variant={article.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                    {article.status === 'PUBLISHED' ? 'Đã xuất bản' : article.status}
                  </Badge>
                </div>
                <div className="flex items-start justify-between">
                  <span>Ngày đăng</span>
                  <span>{format(new Date(publishedDate), 'dd/MM/yyyy', { locale: vi })}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span>Cập nhật</span>
                  <span>{format(new Date(article.updatedAt), 'dd/MM/yyyy', { locale: vi })}</span>
                </div>
              </CardContent>
            </Card>

            {article.category && (
              <Card>
                <CardHeader>
                  <CardTitle>Chuyên mục</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium mb-2">{article.category.name}</p>
                  {article.category.description && (
                    <p className="text-sm text-muted-foreground">
                      {article.category.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
