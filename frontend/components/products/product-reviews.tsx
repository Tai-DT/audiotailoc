'use client';

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Star, ThumbsUp, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProductReviews, useMarkReviewHelpful } from '@/lib/hooks/use-api';
import { ProductReview } from '@/lib/types';
import { toast } from 'react-hot-toast';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: reviewsData, isLoading, error } = useProductReviews(productId);
  const markHelpfulMutation = useMarkReviewHelpful();

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markHelpfulMutation.mutateAsync(reviewId);
      toast.success('Cảm ơn bạn đã đánh giá!');
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/60'
        }`}
      />
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge variant="default" className="text-xs">Đã duyệt</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-xs">Chờ duyệt</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-xs">Từ chối</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Không thể tải đánh giá. Vui lòng thử lại sau.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reviewsData?.reviews || reviewsData.reviews.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            <p className="text-sm mt-2">Hãy là người đầu tiên đánh giá!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { reviews, stats } = reviewsData;

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      {stats && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {renderStars(Math.round(stats.averageRating))}
                  </div>
                  <span className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Dựa trên {stats.totalReviews} đánh giá
                </p>
              </div>
              <div className="text-right">
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center space-x-1">
                      <span>{star}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <div className="w-12 bg-muted rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[star] / stats.totalReviews) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-muted-foreground w-6 text-right">
                        {stats.ratingDistribution[star] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review: ProductReview) => (
          <Card key={review.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={review.user?.name || 'User'} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">
                        {review.user?.name || review.user?.email || 'Người dùng'}
                      </p>
                      {review.isVerified && (
                        <Badge variant="outline" className="text-xs">
                          Đã mua
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(review.createdAt), 'dd/MM/yyyy', { locale: vi })}
                      </span>
                      {getStatusBadge(review.status)}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {review.title && (
                  <h4 className="font-medium">{review.title}</h4>
                )}
                {review.comment && (
                  <p className="text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                )}

                {/* Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {review.images.map((image: string, index: number) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover rounded border flex-shrink-0"
                      />
                    ))}
                  </div>
                )}

                {/* Response from admin */}
                {review.response && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs bg-blue-100">
                        Phản hồi từ Audio Tài Lộc
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-800">{review.response}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{review.helpfulCount || 0} người thấy hữu ích</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkHelpful(review.id)}
                    disabled={markHelpfulMutation.isPending}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Hữu ích
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}