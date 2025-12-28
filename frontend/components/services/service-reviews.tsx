'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Star, ThumbsUp, MessageCircle, User, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useServiceReviews, useMarkServiceReviewHelpful, ServiceReview } from '@/lib/hooks/use-api';
import { toast } from 'react-hot-toast';

interface ServiceReviewsProps {
  serviceId: string;
  serviceName?: string;
}

export default function ServiceReviews({ serviceId, serviceName }: ServiceReviewsProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useServiceReviews(serviceId, page, 10);
  const markHelpfulMutation = useMarkServiceReviewHelpful();

  const handleMarkHelpful = async (reviewId: string, helpful: boolean) => {
    try {
      await markHelpfulMutation.mutateAsync({ reviewId, helpful });
      toast.success('Cảm ơn bạn đã đánh giá!');
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Đang tải đánh giá...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-red-500">
            Không thể tải đánh giá. Vui lòng thử lại sau.
          </div>
        </CardContent>
      </Card>
    );
  }

  const reviews = data?.items || [];
  const stats = data?.stats;

  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có đánh giá nào</h3>
            <p className="text-muted-foreground">
              Hãy là người đầu tiên đánh giá dịch vụ này sau khi sử dụng.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Đánh giá {serviceName ? `"${serviceName}"` : 'dịch vụ'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-8">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-5xl font-bold text-primary">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stats.totalReviews} đánh giá
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution[star] || 0;
                  const percentage = stats.totalReviews > 0 
                    ? (count / stats.totalReviews) * 100 
                    : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm w-8">{star} sao</span>
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground w-12">
                        ({count})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review: ServiceReview) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <Avatar className="h-10 w-10">
                  {review.user?.avatarUrl && (
                    <AvatarImage src={review.user.avatarUrl} alt={review.user?.name || 'User'} />
                  )}
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>

                {/* Review Content */}
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">
                        {review.user?.name || 'Người dùng ẩn danh'}
                      </span>
                      {review.isVerified && (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Đã sử dụng dịch vụ
                        </Badge>
                      )}
                      <div className="flex items-center gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(review.createdAt), 'dd/MM/yyyy', { locale: vi })}
                    </div>
                  </div>

                  {/* Title */}
                  {review.title && (
                    <h4 className="font-medium">{review.title}</h4>
                  )}

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-muted-foreground">{review.comment}</p>
                  )}

                  {/* Images */}
                  {review.images && (() => {
                    try {
                      const imageUrls = JSON.parse(review.images);
                      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
                        return (
                          <div className="flex gap-2 overflow-x-auto">
                            {imageUrls.map((image: string, index: number) => (
                              <Image
                                key={index}
                                src={image}
                                alt={`Review image ${index + 1}`}
                                width={80}
                                height={80}
                                className="object-cover rounded-md border"
                              />
                            ))}
                          </div>
                        );
                      }
                    } catch {
                      // Invalid JSON, skip images
                    }
                    return null;
                  })()}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkHelpful(review.id, true)}
                      disabled={markHelpfulMutation.isPending}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Hữu ích ({review.upvotes || 0})
                    </Button>
                  </div>

                  {/* Admin Response */}
                  {review.response && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Phản hồi từ Audio Tài Lộc</Badge>
                      </div>
                      <p className="text-sm">{review.response}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Trang trước
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {page} / {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}