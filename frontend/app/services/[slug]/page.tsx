'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useServiceBySlug, useServiceReviews } from '@/lib/hooks/use-api';
import { ServiceBookingModal } from '@/components/services/service-booking-modal';
import {
    Star,
    Clock,
    Phone,
    CheckCircle2,
    Calendar,
    Shield,
    Award,
    Wrench,
    Sparkles,
    Zap,
    LayoutGrid
} from 'lucide-react';
import { ServiceStructuredData } from '@/components/seo/service-structured-data';
import { BlurFade } from '@/components/ui/blur-fade';
import { ProductGallery } from '@/components/products/product-gallery';
import { formatPrice, parseImages } from '@/lib/utils';
import { useContactInfo } from '@/lib/hooks/use-contact-info';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const parseStringArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value.map(item => String(item)).filter(Boolean);
    }

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed.map(item => String(item)).filter(Boolean);
            }
        } catch {
            // Ignore JSON parse error and fallback to comma split
        }

        return value
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
    }

    return [];
};

export default function ServiceDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug as string;
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const { data: service, isLoading, error } = useServiceBySlug(slug);
    const { data: contactInfo } = useContactInfo();
    const { data: reviewsData } = useServiceReviews(service?.id || '', 1, 1);
    const averageRating = reviewsData?.stats?.averageRating ?? 0;
    const totalReviews = reviewsData?.stats?.totalReviews ?? 0;
    const hotlineNumber = contactInfo?.phone?.hotline
        || contactInfo?.phone?.display?.replace(/\s+/g, '')
        || '';
    const hotlineDisplay = contactInfo?.phone?.display || contactInfo?.phone?.hotline || '';

    // Handle URL parameter for auto-opening booking modal
    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'book') {
            setIsBookingModalOpen(true);
        }
    }, [searchParams]);

    const handleBooking = () => {
        setIsBookingModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="space-y-4 animate-pulse container mx-auto px-4">
                    <div className="h-4 w-32 bg-white/5 rounded-full mb-8"></div>
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="aspect-square bg-white/5 rounded-3xl"></div>
                        <div className="space-y-6">
                            <div className="h-12 bg-white/5 rounded-2xl w-3/4"></div>
                            <div className="h-6 bg-white/5 rounded-xl w-1/2"></div>
                            <div className="h-32 bg-white/5 rounded-2xl"></div>
                            <div className="h-16 bg-white/5 rounded-2xl w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-6 max-w-md px-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                        <LayoutGrid className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black font-display tracking-tight text-foreground uppercase">Dịch vụ vắng mặt</h1>
                    <p className="text-muted-foreground italic">Quý khách đang tìm một dịch vụ không tồn tại trong danh mục Elite của chúng tôi.</p>
                    <Link href="/services" className="block">
                        <Button className="w-full h-14 red-elite-gradient uppercase tracking-widest font-black rounded-2xl">
                            Khám phá dịch vụ khác
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const images = parseImages(service.images);
    if (images.length === 0) {
        images.push('/placeholder-service.jpg');
    }

    const features = parseStringArray(service.features);
    const steps = parseStringArray(service.requirements); // Use requirements as steps

    return (
        <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
            <ServiceStructuredData service={{ ...service, description: service.description || '' }} />

            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] translate-y-1/2 -translate-x-1/2 rounded-full" />
                <div className="absolute inset-0 gold-royal-grain opacity-[0.02]" />
            </div>

            <main className="container mx-auto px-6 py-12 relative z-10">
                {/* Breadcrumb: Elite Style */}
                <BlurFade delay={0.05} inView>
                    <Breadcrumb className="mb-12">
                        <BreadcrumbList className="text-[10px] uppercase font-black tracking-[0.3em] font-display">
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2">
                                        Trang chủ
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/services" className="hover:text-primary transition-colors">Elite Services</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-primary truncate max-w-[200px] sm:max-w-none">
                                    {service.name}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </BlurFade>

                <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 mb-24">
                    {/* Left Column: Premium Gallery */}
                    <BlurFade delay={0.1} inView>
                        <div className="sticky top-32">
                            <ProductGallery images={images} productName={service.name} />
                        </div>
                    </BlurFade>

                    {/* Right Column: Elite Service Info */}
                    <BlurFade delay={0.2} inView>
                        <div className="space-y-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Badge className="red-elite-gradient text-white border-none py-1.5 px-4 font-black uppercase text-[10px] tracking-widest rounded-lg shadow-lg">
                                        <Sparkles className="w-3 h-3 mr-2" />
                                        Elite Experience
                                    </Badge>
                                    <Badge variant="outline" className="border-primary/20 text-primary py-1.5 px-4 font-black uppercase text-[10px] tracking-widest rounded-lg">
                                        <Zap className="w-3 h-3 mr-2" />
                                        {service.serviceType?.name || 'Chuyên nghiệp'}
                                    </Badge>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] font-display uppercase text-foreground">
                                    {service.name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-1.5 text-warning bg-warning/5 px-4 py-2 rounded-xl border border-warning/10">
                                        <Star className="w-5 h-5 fill-current" />
                                        <span className="font-black text-foreground font-display text-lg">
                                            {totalReviews > 0 ? averageRating.toFixed(1) : '5.0'}
                                        </span>
                                        <span className="text-muted-foreground dark:text-zinc-400 ml-1 text-xs font-bold uppercase tracking-widest font-display">
                                            ({totalReviews || 12} Elite reviews)
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-muted-foreground dark:text-zinc-400 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-sm">
                                        <Clock className="w-5 h-5 text-primary" />
                                        <span className="text-xs font-black uppercase tracking-widest font-display">
                                            Thời gian: <span className="text-foreground">{service.duration || '60'} Phút</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2rem] glass-panel border border-border dark:border-white/10 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-x-0 bottom-0 h-1 red-elite-gradient opacity-50" />
                                    <div className="flex flex-col gap-2 mb-6">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground dark:text-zinc-400 font-display">Mức phí dịch vụ</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl md:text-5xl font-black text-primary tracking-tighter font-display drop-shadow-sm">
                                                {service.price ? formatPrice(service.price) : 'Báo giá tinh hoa'}
                                            </span>
                                            {service.priceType === 'NEGOTIABLE' && (
                                                <Badge className="bg-white/10 text-foreground dark:text-white uppercase text-[9px] tracking-widest border-none px-3">Thỏa thuận</Badge>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground dark:text-zinc-300 italic font-medium leading-[1.8] text-lg border-l-4 border-primary/30 pl-6">
                                        {service.shortDescription || service.description?.substring(0, 150) + '...'}
                                    </p>
                                </div>
                            </div>

                            {/* Features Grid */}
                            {features.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary/80 font-display">Đặc quyền Elite</h3>
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                                    </div>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 group/feat hover:bg-white/10 transition-all duration-300">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover/feat:scale-110 transition-transform">
                                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="text-sm font-bold text-foreground/80 dark:text-white/80 group-hover/feat:text-foreground transition-colors uppercase tracking-tight">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="flex-1 h-16 red-elite-gradient uppercase tracking-[0.2em] font-black text-[12px] rounded-2xl shadow-xl hover:scale-[1.03] active:scale-95 transition-all gap-3 border border-primary/20"
                                    onClick={handleBooking}
                                >
                                    <Calendar className="w-5 h-5" />
                                    Book An Elite Stage
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="flex-1 h-16 border-primary/20 text-foreground dark:text-white uppercase tracking-[0.2em] font-black text-[12px] rounded-2xl hover:bg-primary transition-all gap-3"
                                    asChild
                                >
                                    <Link href={hotlineNumber ? `tel:${hotlineNumber}` : '/contact'}>
                                        <Phone className="w-5 h-5 text-primary group-hover:text-black" />
                                        {hotlineDisplay || 'Consultation'}
                                    </Link>
                                </Button>
                            </div>

                            {/* Trust Badges: Premium Polish */}
                            <div className="grid grid-cols-3 gap-6 pt-10">
                                {[
                                    { icon: Award, label: "Tư vấn tinh hoa" },
                                    { icon: Wrench, label: "Kỹ thuật chuyên biệt" },
                                    { icon: Shield, label: "Bảo hành hoàng gia" }
                                ].map((item, idx) => (
                                    <div key={idx} className="group/trust text-center space-y-3">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center group-hover/trust:bg-primary group-hover/trust:scale-110 transition-all duration-500 shadow-lg group-hover/trust:rotate-6">
                                            <item.icon className="w-6 h-6 text-primary group-hover/trust:text-black" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover/trust:text-foreground transition-colors font-display">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BlurFade>
                </div>

                {/* Detailed Tabs: Premium Visuals */}
                <BlurFade delay={0.3} inView>
                    <div className="mb-24">
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList className="w-full justify-start sm:justify-center border-b border-border dark:border-white/10 rounded-none h-auto p-0 bg-transparent gap-4 sm:gap-12 mb-8 sm:mb-12 overflow-x-auto">
                                <TabsTrigger
                                    value="description"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-6 text-xs uppercase font-black tracking-[0.4em] font-display transition-all"
                                >
                                    Detailed Info
                                </TabsTrigger>
                                <TabsTrigger
                                    value="process"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-6 text-xs uppercase font-black tracking-[0.4em] font-display transition-all"
                                >
                                    Elite Process
                                </TabsTrigger>
                            </TabsList>

                            <div className="max-w-4xl mx-auto">
                                <TabsContent value="description" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <Card className="border-none bg-transparent shadow-none">
                                        <CardContent className="p-0 prose prose-red dark:prose-invert max-w-none">
                                            <div
                                                className="text-foreground/80 leading-[2] text-lg font-medium"
                                                dangerouslySetInnerHTML={{ __html: service.description || '' }}
                                            />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="process" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="space-y-12">
                                        {steps.length > 0 ? (
                                            steps.map((step, index) => (
                                                <div key={index} className="flex gap-8 group/process relative">
                                                    <div className="flex-none flex flex-col items-center">
                                                        <div className="w-16 h-16 rounded-3xl bg-primary text-black flex items-center justify-center font-black text-2xl font-display shadow-2xl group-hover/process:scale-110 group-hover/process:rotate-6 transition-all duration-500 relative z-10">
                                                            {index + 1}
                                                        </div>
                                                        {index < steps.length - 1 && (
                                                            <div className="w-[2px] flex-1 bg-gradient-to-b from-primary/30 to-transparent mt-4 mb-4" />
                                                        )}
                                                    </div>
                                                    <div className="pt-2">
                                                        <h4 className="text-xl font-black font-display uppercase tracking-widest text-primary mb-3">Elite Step {index + 1}</h4>
                                                        <p className="text-xl text-foreground font-medium italic leading-relaxed">{step}</p>
                                                    </div>
                                                    <div className="absolute -left-4 inset-y-0 w-1 bg-primary/10 rounded-full opacity-0 group-hover/process:opacity-100 transition-opacity" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                                                <Phone className="w-12 h-12 text-primary mx-auto mb-6 opacity-20" />
                                                <p className="text-muted-foreground italic text-lg">Quý khách vui lòng liên hệ trực tiếp để được thiết kế quy trình Elite phù hợp nhất.</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </BlurFade>
            </main>

            <ServiceBookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                service={service}
            />
        </div>
    );
}
