'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Calendar, 
  Eye, 
  Heart, 
  Share2, 
  ArrowLeft, 
  User, 
  Tag,
  Clock,
  BookOpen,
  Facebook,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useBlogArticle, useRelatedArticles } from '@/lib/hooks/use-blog';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { sanitizeProseHtml } from '@/lib/utils/sanitize';

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [isLiking, setIsLiking] = useState(false);

  const { data: article, isLoading, error } = useBlogArticle(slug);
  const { data: relatedArticles } = useRelatedArticles(slug, 3);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title || 'Blog Audio Tài Lộc',
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Đã sao chép link bài viết!');
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const response = await apiClient.post(`/blog/articles/${slug}/like`);
      const newLikeCount = response.data?.likeCount;
      if (newLikeCount !== undefined) {
        setLikeCount(newLikeCount);
      }
      toast.success('Cảm ơn bạn đã thích bài viết!');
    } catch {
      toast.error('Không thể thích bài viết. Vui lòng thử lại!');
    } finally {
      setIsLiking(false);
    }
  };

  // Get the display like count (from state or article data)
  const displayLikeCount = likeCount ?? article?.likeCount ?? 0;

  // Fallback article for demo
  const fallbackArticle = {
    id: '1',
    title: 'Hướng dẫn chọn dàn karaoke gia đình chất lượng cao',
    slug: 'huong-dan-chon-dan-karaoke-gia-dinh',
    content: `
      <h2>1. Xác định nhu cầu sử dụng</h2>
      <p>Trước khi chọn mua dàn karaoke, bạn cần xác định rõ nhu cầu sử dụng của mình:</p>
      <ul>
        <li>Sử dụng cho gia đình nhỏ hay tổ chức tiệc tùng?</li>
        <li>Diện tích phòng karaoke bao nhiêu m2?</li>
        <li>Ngân sách dự kiến là bao nhiêu?</li>
      </ul>
      
      <h2>2. Các thành phần cơ bản của dàn karaoke</h2>
      <p>Một dàn karaoke hoàn chỉnh thường bao gồm:</p>
      <ul>
        <li><strong>Loa karaoke:</strong> Là thành phần quan trọng nhất, quyết định chất lượng âm thanh.</li>
        <li><strong>Amply:</strong> Khuếch đại tín hiệu âm thanh.</li>
        <li><strong>Micro:</strong> Thu âm giọng hát của bạn.</li>
        <li><strong>Đầu karaoke:</strong> Phát nhạc và hiển thị lời bài hát.</li>
      </ul>
      
      <h2>3. Lựa chọn công suất phù hợp</h2>
      <p>Công suất loa cần phù hợp với diện tích phòng:</p>
      <ul>
        <li>Phòng dưới 20m2: Loa 100-200W</li>
        <li>Phòng 20-40m2: Loa 200-400W</li>
        <li>Phòng trên 40m2: Loa từ 400W trở lên</li>
      </ul>
      
      <h2>4. Chất lượng âm thanh</h2>
      <p>Khi thử loa, bạn nên chú ý đến:</p>
      <ul>
        <li>Tiếng bass có chắc và ấm không?</li>
        <li>Tiếng treble có trong và không bị chói không?</li>
        <li>Tiếng mid có rõ ràng và tự nhiên không?</li>
      </ul>
      
      <h2>5. Kết luận</h2>
      <p>Việc chọn dàn karaoke gia đình không quá khó nếu bạn nắm rõ nhu cầu và hiểu các thông số kỹ thuật cơ bản. Hãy liên hệ Audio Tài Lộc để được tư vấn miễn phí!</p>
    `,
    excerpt: 'Tìm hiểu cách lựa chọn dàn karaoke phù hợp với không gian và ngân sách của gia đình bạn.',
    imageUrl: '/placeholder-product.svg',
    viewCount: 1250,
    likeCount: 89,
    commentCount: 12,
    publishedAt: '2024-12-20T08:00:00Z',
    createdAt: '2024-12-20T08:00:00Z',
    category: { id: '1', name: 'Hướng dẫn', slug: 'huong-dan' },
    author: { id: '1', name: 'Audio Tài Lộc', email: 'admin@audiotailoc.com' },
    tags: ['karaoke', 'loa', 'âm thanh', 'hướng dẫn'],
  };

  const displayArticle = article || fallbackArticle;

  const fallbackRelated = [
    {
      id: '2',
      title: 'Top 10 loa kéo bán chạy nhất 2024',
      slug: 'top-10-loa-keo-ban-chay-nhat-2024',
      excerpt: 'Danh sách những mẫu loa kéo được ưa chuộng nhất.',
      imageUrl: '/placeholder-product.svg',
      viewCount: 2340,
      publishedAt: '2024-12-18T10:00:00Z',
    },
    {
      id: '3',
      title: 'Cách bảo dưỡng thiết bị âm thanh đúng cách',
      slug: 'cach-bao-duong-thiet-bi-am-thanh',
      excerpt: 'Tips hữu ích để bảo dưỡng thiết bị.',
      imageUrl: '/placeholder-product.svg',
      viewCount: 890,
      publishedAt: '2024-12-15T14:00:00Z',
    },
  ];

  const displayRelated = (relatedArticles && relatedArticles.length > 0) ? relatedArticles : fallbackRelated;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !fallbackArticle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy bài viết</h1>
          <p className="text-muted-foreground mb-6">Bài viết này có thể đã bị xóa hoặc không tồn tại.</p>
          <Link href="/blog">
            <Button>Quay lại Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Estimate reading time (assuming 200 words per minute)
  const wordCount = displayArticle.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <header className="py-12 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {displayArticle.category && (
              <Badge className="mb-4">{displayArticle.category.name}</Badge>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {displayArticle.title}
            </h1>

            {displayArticle.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {displayArticle.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              {displayArticle.author && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={displayArticle.author.name || 'Author'} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span>{displayArticle.author.name}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{displayArticle.publishedAt ? formatDate(displayArticle.publishedAt) : ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{readingTime} phút đọc</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{displayArticle.viewCount} lượt xem</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {displayArticle.imageUrl && (
        <div className="container mx-auto px-4 -mt-4 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
              <Image
                src={displayArticle.imageUrl}
                alt={displayArticle.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="lg:flex gap-12">
            {/* Main Content */}
            <div className="flex-1">
              <div 
                className="prose prose-lg max-w-none dark:prose-invert
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground
                  prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                  prose-li:marker:text-primary"
                dangerouslySetInnerHTML={{ __html: sanitizeProseHtml(displayArticle.content || '') }}
              />

              {/* Tags */}
              {displayArticle.tags && displayArticle.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {displayArticle.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={handleLike} disabled={isLiking}>
                      <Heart className="h-4 w-4 mr-2" />
                      Thích ({displayLikeCount})
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Chia sẻ
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Chia sẻ:</span>
                    <Button variant="ghost" size="icon" asChild>
                      <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Chia sẻ lên Facebook"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={`https://zalo.me/share?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Chia sẻ lên Zalo"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Author Bio */}
              {displayArticle.author && (
                <Card className="mt-8">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="" alt={displayArticle.author.name || 'Author'} />
                        <AvatarFallback className="text-lg">
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-lg">{displayArticle.author.name}</h4>
                        <p className="text-muted-foreground text-sm mt-1">
                          Chuyên gia âm thanh tại Audio Tài Lộc với nhiều năm kinh nghiệm trong lĩnh vực 
                          tư vấn và lắp đặt hệ thống âm thanh chuyên nghiệp.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {displayRelated.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Bài viết liên quan</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {displayRelated.map((related) => (
                  <Link key={related.id} href={`/blog/${related.slug}`}>
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                      <div className="flex gap-4 p-4">
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={related.imageUrl || '/placeholder-product.svg'}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                            {related.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {related.viewCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {related.publishedAt ? formatDate(related.publishedAt) : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Cần tư vấn thêm?</h2>
            <p className="text-muted-foreground mb-6">
              Liên hệ ngay để được hỗ trợ bởi đội ngũ chuyên gia âm thanh
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">Liên hệ ngay</Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline">Xem thêm bài viết</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
