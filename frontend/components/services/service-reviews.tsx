'use client';

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Star, ThumbsUp, MessageCircle, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useMarkReviewHelpful } from '@/lib/hooks/use-api';
import { ProductReview } from '@/lib/types';
import { toast } from 'react-hot-toast';

export default function ServiceReviews() {
  const markHelpfulMutation = useMarkReviewHelpful();

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markHelpfulMutation.mutateAsync(reviewId);
      toast.success('Cảm ơn bạn đã đánh giá!');
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  // For now, show placeholder content since service reviews API might not be implemented yet
  const reviews: ProductReview[] = [];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/60'}`}
      />
    ));
  };

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
      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>

                {/* Review Content */}
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {review.user?.name || 'Người dùng ẩn danh'}
                      </span>
                      <div className="flex items-center gap-1">
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
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {review.images.map((image, index) => (
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
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkHelpful(review.id)}
                      disabled={markHelpfulMutation.isPending}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Hữu ích ({review.helpfulCount || 0})
                    </Button>

                    {/* Admin Response */}
                    {review.response && (
                      <div className="flex-1 mt-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">Phản hồi từ Audio Tài Lộc</Badge>
                        </div>
                        <p className="text-sm">{review.response}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}