'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ArrowLeft,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Tag,
  User,
  Calendar,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useArticle, useArticles } from '@/lib/hooks/use-api';
import toast from 'react-hot-toast';
import { sanitizeProseHtml } from '@/lib/utils/sanitize';

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  const [userFeedback, setUserFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [comment, setComment] = useState('');

  // Use real hooks - no fallback to mock data
  const { data: article, isLoading, error } = useArticle(articleId);

  // Fetch related articles based on category
  const { data: relatedArticlesData } = useArticles({
    category: article?.category,
    published: true,
    pageSize: 4
  });

  const relatedArticles = (relatedArticlesData?.items || []).filter(a => a.id !== articleId);

  const comments: { id: string; author: string; content: string; createdAt: string }[] = []; // NOTE: Comments feature pending backend API integration

  const handleFeedback = async (feedback: 'helpful' | 'not-helpful') => {
    if (userFeedback) return; // Prevent multiple votes

    try {
      // NOTE: Feedback is stored locally. Backend API integration pending for persistence
      setUserFeedback(feedback);
      toast.success('Cảm ơn phản hồi của bạn!');
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `Đọc bài viết: ${article.title}`,
          url: window.location.href,
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success('Đã sao chép liên kết!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép liên kết!');
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    try {
      // NOTE: Comment submission pending backend API integration
      toast.success('Bình luận đã được gửi!');
      setComment('');
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/knowledge-base">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại Kiến thức âm thanh
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h1>
          <p className="text-muted-foreground">Bài viết này không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    );
  }

  const readingTime = Math.ceil((article.content || '').split(' ').length / 200); // Rough estimate

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link href="/knowledge-base">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại Kiến thức âm thanh
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Article Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{article.category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>{article.viewCount} lượt xem</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{readingTime} phút đọc</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Cập nhật: {format(new Date(article.updatedAt), 'dd/MM/yyyy', { locale: vi })}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Audio Tài Lộc</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-6">
              <Button
                variant={userFeedback === 'helpful' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFeedback('helpful')}
                disabled={!!userFeedback}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Hữu ích ({article.helpful})
              </Button>
              <Button
                variant={userFeedback === 'not-helpful' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFeedback('not-helpful')}
                disabled={!!userFeedback}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Không hữu ích ({article.notHelpful})
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Chia sẻ
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-1" />
                Lưu
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: sanitizeProseHtml(
                    article.content
                      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.+?)\*/g, '<em>$1</em>')
                      .replace(/^- (.+)$/gm, '<li>$1</li>')
                      .replace(/<li>.*<\/li>/g, (match) => `<ul>${match}</ul>`)
                      .replace(/\n\n/g, '</p><p>')
                      .replace(/\n/g, '<br>')
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Link key={index} href={`/knowledge-base?search=${encodeURIComponent(tag)}`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Bình luận ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Comment Form */}
              <div className="space-y-4">
                <Textarea
                  placeholder="Viết bình luận của bạn..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleSubmitComment} disabled={!comment.trim()}>
                  Gửi bình luận
                </Button>
              </div>

              <Separator />

              {/* Comments List */}
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-l-2 border-border pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </span>
                      </div>
                      <p className="text-foreground">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Related Articles */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Bài viết liên quan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedArticles.map((relatedArticle) => (
                <Link key={relatedArticle.id} href={`/knowledge-base/${relatedArticle.id}`}>
                  <div className="hover:bg-gray-50 p-3 rounded-lg transition-colors">
                    <h4 className="font-medium text-sm line-clamp-2 mb-1">
                      {relatedArticle.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {relatedArticle.category}
                      </Badge>
                      <span>{relatedArticle.viewCount} lượt xem</span>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Thống kê bài viết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Lượt xem</span>
                <span className="font-semibold">{article.viewCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Đánh giá tốt</span>
                <span className="font-semibold text-success">{article.helpful}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Đánh giá kém</span>
                <span className="font-semibold text-destructive">{article.notHelpful}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tỷ lệ hài lòng</span>
                <span className="font-semibold">
                  {article.helpful + article.notHelpful > 0
                    ? Math.round((article.helpful / (article.helpful + article.notHelpful)) * 100)
                    : 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cần hỗ trợ thêm?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Nếu bạn vẫn còn thắc mắc sau khi đọc bài viết này, đội ngũ kỹ thuật viên của chúng tôi sẵn sàng hỗ trợ.
              </p>
              <Button className="w-full" asChild>
                <Link href="/contact">
                  Liên hệ hỗ trợ
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}