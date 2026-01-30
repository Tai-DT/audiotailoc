'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Newspaper,
    Calendar,
    ArrowRight,
    Search,
    Tag,
    Clock,
    ChevronRight
} from 'lucide-react';
import { apiClient, handleApiResponse } from '@/lib/api';

interface NewsItem {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    category: 'news' | 'event' | 'announcement';
    imageUrl?: string;
    publishedAt: string;
    author?: string;
}

const categoryLabels = {
    news: 'Tin tức',
    event: 'Sự kiện',
    announcement: 'Thông báo',
};

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await apiClient.get('/blog/articles');
                const data = handleApiResponse<NewsItem[]>(response);
                if (data) {
                    setNews(data);
                    setFilteredNews(data);
                }
            } catch {
                // Sample data
                const samples: NewsItem[] = [
                    {
                        id: '1',
                        title: 'Audio Tài Lộc khai trương showroom mới tại Quận 7',
                        slug: 'khai-truong-showroom-quan-7',
                        excerpt: 'Với không gian trưng bày hiện đại, showroom mới mang đến trải nghiệm âm thanh cao cấp cho khách hàng khu vực phía Nam.',
                        category: 'news',
                        publishedAt: new Date().toISOString(),
                        author: 'Audio Tài Lộc',
                    },
                    {
                        id: '2',
                        title: 'Workshop: Trải nghiệm dàn Karaoke cao cấp tháng 2/2026',
                        slug: 'workshop-karaoke-thang-2-2026',
                        excerpt: 'Sự kiện trải nghiệm miễn phí các sản phẩm karaoke mới nhất từ JBL, Bose, Yamaha tại showroom Audio Tài Lộc.',
                        category: 'event',
                        publishedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        author: 'Audio Tài Lộc',
                    },
                    {
                        id: '3',
                        title: 'Thông báo lịch nghỉ Tết Nguyên Đán 2026',
                        slug: 'lich-nghi-tet-2026',
                        excerpt: 'Audio Tài Lộc xin thông báo lịch nghỉ Tết và các chính sách hỗ trợ khách hàng trong dịp lễ.',
                        category: 'announcement',
                        publishedAt: new Date().toISOString(),
                        author: 'Audio Tài Lộc',
                    },
                    {
                        id: '4',
                        title: 'Review: Loa JBL PartyBox 710 - Đỉnh cao âm bass',
                        slug: 'review-jbl-partybox-710',
                        excerpt: 'Đánh giá chi tiết về sản phẩm loa di động mạnh mẽ nhất của JBL năm 2026.',
                        category: 'news',
                        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                        author: 'Audio Tài Lộc',
                    },
                    {
                        id: '5',
                        title: 'Cập nhật chính sách bảo hành mới 2026',
                        slug: 'chinh-sach-bao-hanh-moi-2026',
                        excerpt: 'Audio Tài Lộc nâng cấp chính sách bảo hành lên đến 36 tháng cho các sản phẩm cao cấp.',
                        category: 'announcement',
                        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                        author: 'Audio Tài Lộc',
                    },
                ];
                setNews(samples);
                setFilteredNews(samples);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    const filterNews = useCallback(() => {
        let result = news;

        if (activeTab !== 'all') {
            result = result.filter(n => n.category === activeTab);
        }

        if (searchQuery) {
            result = result.filter(n =>
                n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredNews(result);
    }, [news, activeTab, searchQuery]);

    useEffect(() => {
        filterNews();
    }, [filterNews]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const featuredNews = news[0];
    const recentNews = news.slice(1, 4);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
            <div className="container max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30">
                        <Newspaper className="w-3 h-3 mr-1" />
                        Tin Tức & Sự Kiện
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                        Tin Tức <span className="text-primary">Audio</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Cập nhật những tin tức mới nhất về sản phẩm, sự kiện và các chương trình khuyến mãi từ Audio Tài Lộc.
                    </p>
                </div>

                {/* Featured + Recent Grid */}
                {!isLoading && featuredNews && (
                    <div className="grid lg:grid-cols-2 gap-6 mb-12">
                        {/* Featured */}
                        <Card className="overflow-hidden group">
                            <div className="relative aspect-video bg-muted/30 overflow-hidden">
                                {featuredNews.imageUrl ? (
                                    <Image
                                        src={featuredNews.imageUrl}
                                        alt={featuredNews.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                        <Newspaper className="w-16 h-16 text-primary/40" />
                                    </div>
                                )}
                                <Badge className="absolute top-4 left-4">
                                    {categoryLabels[featuredNews.category]}
                                </Badge>
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(featuredNews.publishedAt)}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {featuredNews.title}
                                </h2>
                                <p className="text-muted-foreground mb-4">{featuredNews.excerpt}</p>
                                <Link
                                    href={`/news/${featuredNews.slug}`}
                                    className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                                >
                                    Đọc thêm
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Recent News */}
                        <div className="space-y-4">
                            {recentNews.map((item) => (
                                <Card key={item.id} className="group flex overflow-hidden">
                                    <div className="relative w-40 shrink-0 bg-muted/30">
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Newspaper className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="flex-1 p-4">
                                        <Badge variant="secondary" className="mb-2">
                                            {categoryLabels[item.category]}
                                        </Badge>
                                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                                            {item.title}
                                        </h3>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(item.publishedAt)}
                                        </span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* All News with Tabs */}
                <div className="space-y-6">
                    {/* Search & Tabs */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList>
                                <TabsTrigger value="all">Tất cả</TabsTrigger>
                                <TabsTrigger value="news">Tin tức</TabsTrigger>
                                <TabsTrigger value="event">Sự kiện</TabsTrigger>
                                <TabsTrigger value="announcement">Thông báo</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm tin tức..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* News List */}
                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-64 bg-card animate-pulse rounded-xl" />
                            ))}
                        </div>
                    ) : filteredNews.length === 0 ? (
                        <div className="text-center py-16">
                            <Newspaper className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-bold mb-2">Không tìm thấy tin tức</h3>
                            <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredNews.map((item) => (
                                <Card key={item.id} className="group overflow-hidden hover:border-primary/50 transition-all">
                                    <div className="relative aspect-video bg-muted/30 overflow-hidden">
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                                <Newspaper className="w-10 h-10 text-primary/40" />
                                            </div>
                                        )}
                                        <Badge className="absolute top-2 left-2">
                                            <Tag className="w-3 h-3 mr-1" />
                                            {categoryLabels[item.category]}
                                        </Badge>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                            {item.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {item.excerpt && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {item.excerpt}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(item.publishedAt)}
                                            </span>
                                            <Link
                                                href={`/news/${item.slug}`}
                                                className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all"
                                            >
                                                Đọc thêm
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Newsletter CTA */}
                <Card className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="py-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">Đăng ký nhận tin tức</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Nhận thông tin về sản phẩm mới và ưu đãi độc quyền
                        </p>
                        <Button asChild size="lg">
                            <Link href="/newsletter">
                                Đăng ký ngay
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
