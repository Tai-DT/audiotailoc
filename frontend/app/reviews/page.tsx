'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Star,
    ThumbsUp,
    MessageSquare,
    Filter,
    ChevronLeft,
    ChevronRight,
    Quote
} from 'lucide-react';
import { apiClient, handleApiResponse } from '@/lib/api';

interface Review {
    id: string;
    productId: string;
    productName: string;
    productSlug: string;
    productImage?: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    title?: string;
    content: string;
    helpfulCount: number;
    verified: boolean;
    createdAt: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ratingFilter, setRatingFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);
    const perPage = 9;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await apiClient.get('/reviews');
                const data = handleApiResponse<Review[]>(response);
                if (data) {
                    setReviews(data);
                    setFilteredReviews(data);
                }
            } catch {
                // Sample data
                const samples: Review[] = [
                    {
                        id: '1',
                        productId: 'p1',
                        productName: 'Loa JBL PartyBox 310',
                        productSlug: 'loa-jbl-partybox-310',
                        userId: 'u1',
                        userName: 'Nguyễn Minh Tuấn',
                        rating: 5,
                        title: 'Âm thanh cực chất!',
                        content: 'Mua về dùng cho các buổi tiệc gia đình, âm bass rất mạnh, karaoke hát cực hay. Rất hài lòng với sản phẩm.',
                        helpfulCount: 24,
                        verified: true,
                        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                    {
                        id: '2',
                        productId: 'p2',
                        productName: 'Micro Shure SM58',
                        productSlug: 'micro-shure-sm58',
                        userId: 'u2',
                        userName: 'Trần Thị Hạnh',
                        rating: 5,
                        title: 'Micro huyền thoại',
                        content: 'Sử dụng cho studio nhỏ tại nhà, chất lượng âm thanh tuyệt vời. Đúng là micro huyền thoại.',
                        helpfulCount: 18,
                        verified: true,
                        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                    {
                        id: '3',
                        productId: 'p3',
                        productName: 'Ampli Denon PMA-600NE',
                        productSlug: 'ampli-denon-pma-600ne',
                        userId: 'u3',
                        userName: 'Lê Văn Hùng',
                        rating: 4,
                        title: 'Chất lượng tốt, giá hợp lý',
                        content: 'Ampli chạy rất êm, âm thanh ấm áp. Chỉ tiếc là không có Bluetooth. Tổng thể rất hài lòng.',
                        helpfulCount: 12,
                        verified: true,
                        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                    {
                        id: '4',
                        productId: 'p4',
                        productName: 'Dàn Karaoke Gia Đình Pro',
                        productSlug: 'dan-karaoke-gia-dinh-pro',
                        userId: 'u4',
                        userName: 'Phạm Đức Long',
                        rating: 5,
                        title: 'Setup xong là hát ngay!',
                        content: 'Mua bộ combo karaoke, đội ngũ kỹ thuật đến lắp đặt rất chuyên nghiệp. Cả nhà ai cũng thích.',
                        helpfulCount: 31,
                        verified: true,
                        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                    {
                        id: '5',
                        productId: 'p5',
                        productName: 'Loa Bose S1 Pro+',
                        productSlug: 'loa-bose-s1-pro-plus',
                        userId: 'u5',
                        userName: 'Võ Thị Kim',
                        rating: 5,
                        title: 'Nhỏ gọn nhưng cực mạnh',
                        content: 'Loa nhỏ nhưng công suất không hề nhỏ. Mang đi biểu diễn rất tiện, pin dùng được cả ngày.',
                        helpfulCount: 15,
                        verified: false,
                        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                    {
                        id: '6',
                        productId: 'p6',
                        productName: 'Mixer Yamaha MG10XU',
                        productSlug: 'mixer-yamaha-mg10xu',
                        userId: 'u6',
                        userName: 'Hoàng Anh',
                        rating: 4,
                        content: 'Mixer tốt trong tầm giá, effect phong phú, USB recording rất tiện.',
                        helpfulCount: 8,
                        verified: true,
                        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                ];
                setReviews(samples);
                setFilteredReviews(samples);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const applyFilters = useCallback(() => {
        let result = [...reviews];

        // Rating filter
        if (ratingFilter !== 'all') {
            const rating = parseInt(ratingFilter);
            result = result.filter(r => r.rating === rating);
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case 'highest':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                result.sort((a, b) => a.rating - b.rating);
                break;
            case 'helpful':
                result.sort((a, b) => b.helpfulCount - a.helpfulCount);
                break;
        }

        setFilteredReviews(result);
        setPage(1);
    }, [reviews, ratingFilter, sortBy]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const paginatedReviews = filteredReviews.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(filteredReviews.length / perPage);

    // Calculate stats
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0';
    const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
        rating: r,
        count: reviews.filter(rev => rev.rating === r).length,
        percent: reviews.length > 0 ? (reviews.filter(rev => rev.rating === r).length / reviews.length * 100) : 0,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
            <div className="container max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30">
                        <Star className="w-3 h-3 mr-1" />
                        Đánh Giá Sản Phẩm
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                        Khách Hàng <span className="text-primary">Đánh Giá</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Xem đánh giá thực tế từ khách hàng đã mua và sử dụng sản phẩm tại Audio Tài Lộc.
                    </p>
                </div>

                {/* Stats Overview */}
                <Card className="mb-8 bg-card/80 backdrop-blur border-border/60">
                    <CardContent className="py-6">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                    <span className="text-6xl font-black text-primary">{avgRating}</span>
                                    <div>
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i <= Math.round(parseFloat(avgRating))
                                                            ? 'text-yellow-500 fill-yellow-500'
                                                            : 'text-muted-foreground'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Dựa trên {reviews.length} đánh giá
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {ratingCounts.map(({ rating, count, percent }) => (
                                    <div key={rating} className="flex items-center gap-3">
                                        <span className="text-sm w-8">{rating} ⭐</span>
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-500 transition-all"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-muted-foreground w-8">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-muted-foreground" />
                        <Select value={ratingFilter} onValueChange={setRatingFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Lọc theo sao" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="5">5 sao</SelectItem>
                                <SelectItem value="4">4 sao</SelectItem>
                                <SelectItem value="3">3 sao</SelectItem>
                                <SelectItem value="2">2 sao</SelectItem>
                                <SelectItem value="1">1 sao</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Sắp xếp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Mới nhất</SelectItem>
                            <SelectItem value="oldest">Cũ nhất</SelectItem>
                            <SelectItem value="highest">Sao cao nhất</SelectItem>
                            <SelectItem value="lowest">Sao thấp nhất</SelectItem>
                            <SelectItem value="helpful">Hữu ích nhất</SelectItem>
                        </SelectContent>
                    </Select>

                    <span className="text-sm text-muted-foreground self-center ml-auto">
                        Hiển thị {filteredReviews.length} đánh giá
                    </span>
                </div>

                {/* Reviews Grid */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-card animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : paginatedReviews.length === 0 ? (
                    <div className="text-center py-16">
                        <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-bold mb-2">Không có đánh giá</h3>
                        <p className="text-muted-foreground">
                            Chưa có đánh giá nào phù hợp với bộ lọc đã chọn.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedReviews.map((review) => (
                            <Card key={review.id} className="bg-card/80 backdrop-blur border-border/60 hover:border-primary/30 transition-all">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                {review.userAvatar ? (
                                                    <Image
                                                        src={review.userAvatar}
                                                        alt={review.userName}
                                                        width={40}
                                                        height={40}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="font-bold text-primary">
                                                        {review.userName.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{review.userName}</p>
                                                {review.verified && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        ✓ Đã mua hàng
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <Quote className="w-6 h-6 text-primary/20" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {/* Rating */}
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i <= review.rating
                                                        ? 'text-yellow-500 fill-yellow-500'
                                                        : 'text-muted-foreground'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Title & Content */}
                                    {review.title && (
                                        <h4 className="font-semibold">{review.title}</h4>
                                    )}
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {review.content}
                                    </p>

                                    {/* Product Link */}
                                    <Link
                                        href={`/products/${review.productSlug}`}
                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                        📦 {review.productName}
                                    </Link>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                                            <ThumbsUp className="w-3 h-3 mr-1" />
                                            Hữu ích ({review.helpfulCount})
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm">
                            Trang {page} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
