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
import { Separator } from '@/components/ui/separator';
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
 className={`h-4 w-4 ${i < rating ? 'text-accent fill-accent' : 'text-foreground/10 /10 dark:text-white/10'
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
 <div className="space-y-12">
 {/* Reviews Summary */}
 {stats && (
 <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-card/40 to-card/10">
 <CardContent className="p-8">
 <div className="flex flex-col md:flex-row items-center gap-12">
 <div className="text-center md:text-left space-y-4">
 <div className="section-badge mb-2">Tổng quan</div>
 <div className="flex items-center justify-center md:justify-start gap-4">
 <span className="text-7xl font-black font-display text-primary drop-shadow-sm leading-none">
 {stats.averageRating.toFixed(1)}
 </span>
 <div className="space-y-1">
 <div className="flex items-center gap-1 text-accent">
 {renderStars(Math.round(stats.averageRating))}
 </div>
 <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
 {stats.totalReviews} đánh giá chuyên nghiệp
 </p>
 </div>
 </div>
 <Button variant="premium" className="w-full md:w-auto">Viết đánh giá mới</Button>
 </div>

 <Separator orientation="vertical" className="hidden md:block h-32 opacity-20" />

 <div className="flex-1 w-full max-w-md space-y-3">
 {[5, 4, 3, 2, 1].map((star) => (
 <div key={star} className="flex items-center gap-4 group">
 <div className="flex items-center gap-2 min-w-[40px]">
 <span className="text-xs font-bold font-display">{star}</span>
 <Star className="h-3 w-3 text-accent fill-accent" />
 </div>
 <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
 <div
 className="h-full premium-gradient transition-all duration-1000 ease-out"
 style={{
 width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[star] / stats.totalReviews) * 100 : 0}%`
 }}
 />
 </div>
 <span className="text-[10px] font-black w-8 text-right text-muted-foreground group-hover:text-primary transition-colors">
 {stats.ratingDistribution[star] || 0}
 </span>
 </div>
 ))}
 </div>
 </div>
 </CardContent>
 </Card>
 )}

 {/* Reviews List */}
 <div className="space-y-8">
 <div className="flex items-center justify-between">
 <h3 className="text-xl font-bold font-display uppercase tracking-widest">
 Đánh giá từ <span className="text-primary">Khách hàng</span>
 </h3>
 </div>

 <div className="grid gap-6">
 {reviews.map((review: ProductReview) => {
 const avatarSrc = review.user?.avatarUrl || review.user?.avatar || '';
 const reviewImages = Array.isArray(review.images)
 ? review.images.filter((image) => typeof image === 'string' && image.trim().length > 0)
 : [];

 return (
 <div
 key={review.id}
 className="group relative surface-card p-6 md:p-8 rounded-3xl"
 >
 <div className="flex flex-col md:flex-row gap-6">
 <div className="flex md:flex-col items-center gap-3 min-w-[120px]">
 <Avatar className="h-14 w-14 ring-accent/20">
 {avatarSrc ? (
 <AvatarImage src={avatarSrc} alt={review.user?.name || 'User'} />
 ) : null}
 <AvatarFallback className="bg-primary/5 text-primary">
 <User className="h-6 w-6" />
 </AvatarFallback>
 </Avatar>
 <div className="md:text-center space-y-1">
 <p className="text-sm font-bold font-display leading-tight truncate max-w-[120px]">
 {review.user?.name || review.user?.email || 'Người dùng'}
 </p>
 {review.isVerified && (
 <Badge variant="premium" className="px-2 py-0.5 text-[8px]">Đã trải nghiệm</Badge>
 )}
 </div>
 </div>

 <div className="flex-1 space-y-4">
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div className="flex items-center gap-1.5">
 <div className="flex items-center gap-0.5 text-accent">
 {renderStars(review.rating)}
 </div>
 <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 ml-2">
 • {format(new Date(review.createdAt), 'dd MMMM, yyyy', { locale: vi })}
 </span>
 </div>
 {getStatusBadge(review.status)}
 </div>

 <div className="space-y-3">
 {review.title && (
 <h4 className="text-lg font-bold font-display tracking-tight text-foreground/90 leading-tight">
 {review.title}
 </h4>
 )}
 {review.comment && (
 <p className="text-sm text-muted-foreground/90 leading-relaxed font-medium line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
 {review.comment}
 </p>
 )}
 </div>

 {/* Images */}
 {reviewImages.length > 0 && (
 <div className="flex flex-wrap gap-3 pt-2">
 {reviewImages.map((image: string, index: number) => (
 <div
 key={index}
 className="relative h-20 w-20 rounded-xl overflow-hidden border border-border/40 hover:border-primary/40 transition-all duration-300 group/img cursor-pointer"
 >
 <Image
 src={image}
 alt={`Review image ${index + 1}`}
 fill
 className="object-cover transition-transform duration-500 group-hover/img:scale-110"
 />
 </div>
 ))}
 </div>
 )}

 {/* Response from admin */}
 {review.response && (
 <div className="relative mt-6 p-5 rounded-2xl bg-primary/5 border border-primary/10 overflow-hidden">
 <div className="absolute top-0 left-0 w-1 h-full premium-gradient" />
 <div className="flex items-center gap-2 mb-2">
 <Badge variant="default" className="text-[8px] bg-primary/20 hover:bg-primary/30">Phản hồi từ Audio Tài Lộc</Badge>
 </div>
 <p className="text-sm text-foreground/80 leading-relaxed italic font-medium">&quot;{review.response}&quot;</p>
 </div>
 )}

 {/* Actions */}
 <div className="flex items-center justify-between pt-6 border-t border-border/40">
 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
 <ThumbsUp className="h-3 w-3" />
 <span>{review.helpfulCount || 0} người thấy hữu ích</span>
 </div>
 <Button
 variant="ghost"
 size="sm"
 onClick={() => handleMarkHelpful(review.id)}
 disabled={markHelpfulMutation.isPending}
 className="h-8 px-4 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all duration-300"
 >
 Hữu ích
 </Button>
 </div>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 );
}
