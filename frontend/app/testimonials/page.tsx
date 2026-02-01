'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Quote, ArrowRight, Award, Users, ThumbsUp } from 'lucide-react';
import { apiClient, handleApiResponse } from '@/lib/api';

interface Testimonial {
    id: string;
    name: string;
    role?: string;
    company?: string;
    avatarUrl?: string;
    content: string;
    rating: number;
    projectType?: string;
    createdAt: string;
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await apiClient.get('/testimonials');
                const data = handleApiResponse<Testimonial[]>(response);
                if (data) {
                    setTestimonials(data);
                }
            } catch {
                // Use sample testimonials if API not available
                const samples: Testimonial[] = [
                    {
                        id: '1',
                        name: 'Nguyễn Văn Minh',
                        role: 'Chủ quán',
                        company: 'Karaoke Hoàng Gia',
                        content: 'Đội ngũ Audio Tài Lộc rất chuyên nghiệp, tư vấn nhiệt tình và lắp đặt đúng tiến độ. Hệ thống âm thanh cho quán karaoke của tôi hoạt động xuất sắc, khách hàng rất hài lòng.',
                        rating: 5,
                        projectType: 'Karaoke',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: '2',
                        name: 'Trần Thị Hương',
                        role: 'Giám đốc',
                        company: 'Công ty XYZ',
                        content: 'Chúng tôi đã sử dụng dịch vụ lắp đặt phòng họp của Audio Tài Lộc. Chất lượng âm thanh rất tốt, hỗ trợ kỹ thuật nhanh chóng. Rất hài lòng!',
                        rating: 5,
                        projectType: 'Phòng họp',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: '3',
                        name: 'Lê Hoàng Nam',
                        role: 'Chủ nhà',
                        content: 'Mua dàn karaoke gia đình tại Audio Tài Lộc, được tư vấn rất kỹ về các thiết bị phù hợp với không gian nhà. Giá cả hợp lý, bảo hành chu đáo.',
                        rating: 5,
                        projectType: 'Gia đình',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: '4',
                        name: 'Phạm Đức Anh',
                        role: 'Quản lý',
                        company: 'Nhà hàng Luxury',
                        content: 'Hệ thống âm thanh background cho nhà hàng chạy rất mượt. Khách hàng khen không gian thêm sang trọng. Cảm ơn Audio Tài Lộc!',
                        rating: 4,
                        projectType: 'Nhà hàng',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: '5',
                        name: 'Võ Thị Mai',
                        role: 'Nghệ sĩ',
                        content: 'Là khách hàng thường xuyên của Audio Tài Lộc trong nhiều năm. Sản phẩm chất lượng, nhân viên nhiệt tình. Luôn tin tưởng mua sắm tại đây.',
                        rating: 5,
                        projectType: 'Studio',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: '6',
                        name: 'Hoàng Minh Tuấn',
                        role: 'Chủ villa',
                        company: 'Villa Ocean View',
                        content: 'Lắp đặt hệ thống âm thanh cho toàn bộ villa nghỉ dưỡng. Kỹ thuật viên làm việc cẩn thận, chuyên nghiệp. Kết quả vượt mong đợi.',
                        rating: 5,
                        projectType: 'Villa',
                        createdAt: new Date().toISOString(),
                    },
                ];
                setTestimonials(samples);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const stats = [
        { icon: Users, value: '500+', label: 'Khách hàng hài lòng' },
        { icon: Award, value: '200+', label: 'Dự án hoàn thành' },
        { icon: ThumbsUp, value: '4.9/5', label: 'Đánh giá trung bình' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />
                <div className="container max-w-6xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-12">
                        <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30">
                            <Quote className="w-3 h-3 mr-1" />
                            Khách Hàng Nói Gì
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                            Nhận Xét <span className="text-primary">Khách Hàng</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Hàng trăm khách hàng đã tin tưởng Audio Tài Lộc cho các dự án âm thanh của họ.
                            Đây là những phản hồi thực tế từ khách hàng.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center p-6 bg-card/80 backdrop-blur rounded-2xl border border-border/60">
                                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                                <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-12 container max-w-7xl mx-auto px-4">
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-card animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <Card
                                key={testimonial.id}
                                className={`bg-card/80 backdrop-blur border-border/60 hover:border-primary/30 transition-all duration-300 ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                                    }`}
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                {testimonial.avatarUrl ? (
                                                    <Image
                                                        src={testimonial.avatarUrl}
                                                        alt={testimonial.name}
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-lg font-bold text-primary">
                                                        {testimonial.name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">{testimonial.name}</CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    {testimonial.role}
                                                    {testimonial.company && ` • ${testimonial.company}`}
                                                </p>
                                            </div>
                                        </div>
                                        <Quote className="w-8 h-8 text-primary/20" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Rating */}
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < testimonial.rating
                                                        ? 'text-yellow-500 fill-yellow-500'
                                                        : 'text-muted-foreground'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Content */}
                                    <p className="text-muted-foreground leading-relaxed">
                                        &ldquo;{testimonial.content}&rdquo;
                                    </p>

                                    {/* Project Type */}
                                    {testimonial.projectType && (
                                        <Badge variant="secondary" className="mt-2">
                                            {testimonial.projectType}
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-16 text-center">
                    <Card className="bg-primary/5 border-primary/20 p-8 inline-block">
                        <h3 className="text-2xl font-bold mb-4">Bạn đã sử dụng dịch vụ của chúng tôi?</h3>
                        <p className="text-muted-foreground mb-6">
                            Hãy chia sẻ trải nghiệm của bạn để giúp chúng tôi phục vụ tốt hơn
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button asChild size="lg">
                                <Link href="/contact">
                                    Gửi Đánh Giá
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/projects">Xem Dự Án</Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
}
