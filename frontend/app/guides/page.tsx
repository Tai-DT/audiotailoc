'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    Video,
    FileText,
    Download,
    Search,
    ArrowRight,
    PlayCircle,
    ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { apiClient, handleApiResponse } from '@/lib/api';

interface Guide {
    id: string;
    title: string;
    slug: string;
    description?: string;
    category: string;
    type: 'article' | 'video' | 'pdf';
    thumbnailUrl?: string;
    videoUrl?: string;
    pdfUrl?: string;
    readTime?: string;
    createdAt: string;
}

const categories = [
    { id: 'all', label: 'Tất cả', icon: BookOpen },
    { id: 'karaoke', label: 'Karaoke', icon: Video },
    { id: 'speaker', label: 'Loa & Ampli', icon: FileText },
    { id: 'setup', label: 'Lắp đặt', icon: Download },
    { id: 'maintenance', label: 'Bảo trì', icon: FileText },
];

export default function GuidesPage() {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await apiClient.get('/support/guides');
                const data = handleApiResponse<Guide[]>(response);
                if (data) {
                    setGuides(data);
                    setFilteredGuides(data);
                }
            } catch {
                // Sample data
                const samples: Guide[] = [
                    {
                        id: '1',
                        title: 'Hướng dẫn chọn dàn Karaoke phù hợp',
                        slug: 'huong-dan-chon-dan-karaoke',
                        description: 'Các tiêu chí quan trọng khi lựa chọn dàn karaoke cho gia đình hoặc kinh doanh.',
                        category: 'karaoke',
                        type: 'article',
                        readTime: '10 phút',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: '2',
                        title: 'Cách căn chỉnh âm thanh karaoke chuẩn',
                        slug: 'cach-can-chinh-am-thanh-karaoke',
                        description: 'Hướng dẫn chi tiết cách điều chỉnh các thông số để có âm thanh karaoke hoàn hảo.',
                        category: 'karaoke',
                        type: 'video',
                        readTime: '15 phút',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: '3',
                        title: 'Cách bảo dưỡng loa đúng cách',
                        slug: 'cach-bao-duong-loa',
                        description: 'Mẹo và kỹ thuật giúp loa của bạn luôn hoạt động tốt và bền bỉ.',
                        category: 'speaker',
                        type: 'article',
                        readTime: '8 phút',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: '4',
                        title: 'Hướng dẫn lắp đặt hệ thống âm thanh phòng khách',
                        slug: 'huong-dan-lap-dat-am-thanh-phong-khach',
                        description: 'Video hướng dẫn từ A-Z cách lắp đặt hệ thống âm thanh cho không gian gia đình.',
                        category: 'setup',
                        type: 'video',
                        readTime: '20 phút',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: '5',
                        title: 'Ampli bị nóng - Nguyên nhân và cách xử lý',
                        slug: 'ampli-bi-nong-nguyen-nhan-cach-xu-ly',
                        description: 'Tìm hiểu nguyên nhân ampli nóng bất thường và hướng dẫn khắc phục.',
                        category: 'maintenance',
                        type: 'article',
                        readTime: '6 phút',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: '6',
                        title: 'Catalog sản phẩm Audio Tài Lộc 2026',
                        slug: 'catalog-san-pham-2026',
                        description: 'Download catalog đầy đủ các sản phẩm của Audio Tài Lộc.',
                        category: 'karaoke',
                        type: 'pdf',
                        createdAt: new Date().toISOString(),
                    },
                ];
                setGuides(samples);
                setFilteredGuides(samples);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGuides();
    }, []);

    const filterGuides = useCallback(() => {
        let result = guides;

        if (activeCategory !== 'all') {
            result = result.filter(g => g.category === activeCategory);
        }

        if (searchQuery) {
            result = result.filter(g =>
                g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                g.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredGuides(result);
    }, [guides, activeCategory, searchQuery]);

    useEffect(() => {
        filterGuides();
    }, [filterGuides]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return <PlayCircle className="w-4 h-4" />;
            case 'pdf': return <Download className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'video': return 'Video';
            case 'pdf': return 'PDF';
            default: return 'Bài viết';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
            <div className="container max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Tài liệu hướng dẫn
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                        Hướng Dẫn <span className="text-primary">Sử Dụng</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Tổng hợp các bài viết, video và tài liệu hướng dẫn từ cơ bản đến nâng cao
                        về thiết bị âm thanh.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm hướng dẫn..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={activeCategory === cat.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setActiveCategory(cat.id)}
                                className="whitespace-nowrap"
                            >
                                <cat.icon className="w-4 h-4 mr-1" />
                                {cat.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Guides Grid */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-card animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : filteredGuides.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-bold mb-2">Không tìm thấy hướng dẫn</h3>
                        <p className="text-muted-foreground">
                            Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGuides.map((guide) => (
                            <Card key={guide.id} className="group overflow-hidden hover:border-primary/50 transition-all">
                                <div className="relative aspect-video bg-muted/30 overflow-hidden">
                                    {guide.thumbnailUrl ? (
                                        <Image
                                            src={guide.thumbnailUrl}
                                            alt={guide.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                            {getTypeIcon(guide.type)}
                                        </div>
                                    )}
                                    {guide.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <PlayCircle className="w-10 h-10 text-primary" />
                                            </div>
                                        </div>
                                    )}
                                    <Badge className="absolute top-2 left-2">
                                        {getTypeIcon(guide.type)}
                                        <span className="ml-1">{getTypeLabel(guide.type)}</span>
                                    </Badge>
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                        {guide.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {guide.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {guide.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        {guide.readTime && (
                                            <span className="text-xs text-muted-foreground">
                                                ⏱️ {guide.readTime}
                                            </span>
                                        )}
                                        <Link
                                            href={`/guides/${guide.slug}`}
                                            className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all"
                                        >
                                            Xem chi tiết
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <Card className="mt-16 bg-primary/5 border-primary/20">
                    <CardContent className="py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Cần hỗ trợ thêm?</h3>
                            <p className="text-muted-foreground">
                                Đội ngũ kỹ thuật của chúng tôi sẵn sàng hỗ trợ bạn
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button asChild size="lg">
                                <Link href="/technical-support">
                                    Hỗ trợ kỹ thuật
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/contact">Liên hệ</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
