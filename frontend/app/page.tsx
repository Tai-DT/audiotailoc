'use client';

import { useEffect, useState } from 'react';
import {
    fetchBanners,
    fetchNewArrivals,
    fetchBestSellers,
    fetchFeaturedServices,
    fetchFeaturedCategories,
    fetchSoftware
} from '@/lib/api/home';

import { HeroCarousel } from '@/components/home/hero-carousel';
import { ProductGrid } from '@/components/home/product-grid';
import { ServicesSection } from '@/components/home/services-section';
import { WhyChooseUsSection } from '@/components/home/why-choose-us-section';
import { CTASection } from '@/components/home/cta-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { EliteSectionHeading } from '@/components/ui/elite-section-heading';
import { ElitePolicyBar } from '@/components/home/elite-policy-bar';
import { Banner, Product, Service, Category } from '@/lib/types';

export default function Home() {
    const [data, setData] = useState<{
        banners: Banner[];
        newArrivals: Product[];
        bestSellers: Product[];
        software: Product[];
        featuredServices: Service[];
        featuredCategories: Category[];
    } | null>(null);

    useEffect(() => {
        async function loadData() {
            const [
                banners,
                newArrivals,
                bestSellers,
                software,
                featuredServices,
                featuredCategories
            ] = await Promise.all([
                fetchBanners('home'),
                fetchNewArrivals(12),
                fetchBestSellers(12),
                fetchSoftware(8),
                fetchFeaturedServices(),
                fetchFeaturedCategories()
            ]);
            setData({ banners, newArrivals, bestSellers, software, featuredServices, featuredCategories });
        }
        loadData();
    }, []);

    if (!data) return <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-20 h-20 border-t-2 border-primary rounded-full animate-spin" />
    </div>;

    return (
        <main className="bg-background min-h-screen overflow-x-hidden">
            {/* 1. Elite Hero Carousel */}
            <HeroCarousel banners={data.banners} />

            {/* Elite Policy Bar */}
            <ElitePolicyBar />

            {/* 2. Featured Showcase - New Arrivals */}
            <section className="py-10 md:py-24 bg-background relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="container mx-auto px-4 md:px-6">
                    <EliteSectionHeading
                        badge="Sưu tập mới nhất"
                        title="Curated Selection"
                        subtitle="Khám phá những thiết bị âm thanh đỉnh cao vừa có mặt tại showroom của chúng tôi."
                    />
                    <ProductGrid products={data.newArrivals} />
                </div>
            </section>

            {/* 3. Showrooms (Categories) Section */}
            <section className="bg-black/5 dark:bg-black/5 dark:bg-black/40 dark:bg-black/40">
                <CategoriesSection categories={data?.featuredCategories || []} />
            </section>

            {/* 4. Best Sellers Showcase */}
            <section className="py-10 md:py-24 bg-background relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
                        <EliteSectionHeading
                            badge="Sản phẩm tiêu biểu"
                            title="Hall of Fame"
                            subtitle="Những thiết bị được giới chuyên môn và khách hàng đánh giá cao nhất."
                            className="mb-0"
                        />
                    </div>
                    <ProductGrid products={data.bestSellers} />
                </div>
            </section>

            {/* 4.5 Digital Software Section (Separate from physical products) */}
            {data.software.length > 0 && (
                <section className="py-10 md:py-24 bg-muted/10 relative overflow-hidden border-y border-border/60">
                    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="container mx-auto px-4 md:px-6">
                        <EliteSectionHeading
                            badge="Digital"
                            title="Phần mềm"
                            subtitle="Thanh toán PayOS và tải xuống ngay sau khi giao dịch hoàn tất."
                        />
                        <ProductGrid products={data.software} basePath="/software" />
                    </div>
                </section>
            )}

            {/* 5. Professional Services */}
            <ServicesSection services={data.featuredServices} />

            {/* 6. Why Audio Tai Loc? */}
            <WhyChooseUsSection />

            {/* 7. Call To Action */}
            <CTASection />
        </main>
    );
}
