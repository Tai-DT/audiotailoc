'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Flame,
    Clock,
    Tag,
    ArrowRight,
    Percent,
    Gift,
    Sparkles,
    ShoppingCart
} from 'lucide-react';
import { apiClient, handleApiResponse } from '@/lib/api';
import { useAddToCart } from '@/lib/hooks/use-cart';

interface Product {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    priceCents: number;
    originalPriceCents?: number;
    discountPercent?: number;
    stock?: number;
}

interface Deal {
    id: string;
    title: string;
    description?: string;
    code?: string;
    discountPercent: number;
    endDate: string;
    products?: Product[];
}

export default function DealsPage() {
    const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const addToCart = useAddToCart();

    // Countdown timer for flash sale
    useEffect(() => {
        const endTime = new Date();
        endTime.setHours(23, 59, 59, 999);

        const timer = setInterval(() => {
            const now = new Date();
            const diff = endTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    hours: Math.floor(diff / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                // Fetch promotions/deals
                const promoResponse = await apiClient.get('/promotions');
                const promoData = handleApiResponse<Deal[]>(promoResponse);
                if (promoData) setDeals(promoData);

                // Fetch sale products
                const productsResponse = await apiClient.get('/catalog/products', {
                    params: { onSale: true, limit: 12, isDigital: false }
                });
                const productsData = handleApiResponse<{ items: Product[] }>(productsResponse);
                if (productsData?.items) setFlashSaleProducts(productsData.items);
            } catch {
                // Sample data
                setFlashSaleProducts([
                    { id: '1', name: 'Loa JBL PartyBox 310', slug: 'loa-jbl-partybox-310', priceCents: 1290000000, originalPriceCents: 1590000000, discountPercent: 19 },
                    { id: '2', name: 'Micro Shure SM58', slug: 'micro-shure-sm58', priceCents: 350000000, originalPriceCents: 420000000, discountPercent: 17 },
                    { id: '3', name: 'Ampli Denon PMA-600NE', slug: 'ampli-denon-pma-600ne', priceCents: 890000000, originalPriceCents: 1050000000, discountPercent: 15 },
                ]);
                setDeals([
                    { id: '1', title: 'Giảm 10% Dàn Karaoke', description: 'Áp dụng cho tất cả combo karaoke gia đình', code: 'KARAOKE10', discountPercent: 10, endDate: '2026-02-28' },
                    { id: '2', title: 'Ưu đãi Lắp đặt miễn phí', description: 'Miễn phí lắp đặt cho đơn hàng trên 20 triệu', discountPercent: 0, endDate: '2026-03-31' },
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDeals();
    }, []);

    const formatPrice = (cents: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cents);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
            {/* Flash Sale Banner */}
            <section className="relative bg-gradient-to-r from-primary via-red-600 to-primary py-8 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
                <div className="container max-w-6xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-white text-center md:text-left">
                            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                                <Flame className="w-6 h-6 animate-pulse" />
                                <Badge className="bg-white text-primary font-bold">FLASH SALE</Badge>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                                Siêu Sale Hôm Nay
                            </h1>
                            <p className="text-white/80">Giảm giá sốc chỉ trong hôm nay!</p>
                        </div>

                        {/* Countdown */}
                        <div className="flex gap-3 text-white">
                            {[
                                { value: timeLeft.hours, label: 'Giờ' },
                                { value: timeLeft.minutes, label: 'Phút' },
                                { value: timeLeft.seconds, label: 'Giây' },
                            ].map((item, i) => (
                                <div key={i} className="text-center">
                                    <div className="bg-white/20 backdrop-blur rounded-lg p-3 min-w-[60px]">
                                        <div className="text-3xl font-black">{String(item.value).padStart(2, '0')}</div>
                                    </div>
                                    <span className="text-xs text-white/80 mt-1 block">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="container max-w-7xl mx-auto px-4 py-12">
                {/* Flash Sale Products */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <Clock className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-black uppercase">Sản Phẩm Flash Sale</h2>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-square bg-card animate-pulse rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {flashSaleProducts.map((product) => (
                                <Card key={product.id} className="group overflow-hidden hover:border-primary/50 transition-all">
                                    <div className="relative aspect-square bg-muted/30">
                                        {product.imageUrl ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Sparkles className="w-12 h-12 text-muted-foreground" />
                                            </div>
                                        )}
                                        {/* Discount Badge - Compact on mobile */}
                                        {product.discountPercent && (
                                            <Badge className="absolute top-1 left-1 md:top-2 md:left-2 bg-primary text-white text-[8px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1">
                                                -{product.discountPercent}%
                                            </Badge>
                                        )}
                                    </div>
                                    <CardContent className="p-4 space-y-3">
                                        <Link href={`/products/${product.slug}`}>
                                            <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <div className="space-y-1">
                                            <div className="text-base sm:text-lg font-black text-primary">
                                                {formatPrice(product.priceCents)}
                                            </div>
                                            {product.originalPriceCents && (
                                                <div className="text-xs sm:text-sm text-muted-foreground line-through">
                                                    {formatPrice(product.originalPriceCents)}
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            className="w-full"
                                            onClick={() => addToCart.mutate({ productId: product.id, quantity: 1 })}
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Thêm vào giỏ
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-8">
                        <Button asChild variant="outline" size="lg">
                            <Link href="/products?onSale=true">
                                Xem tất cả sản phẩm giảm giá
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Promotion Codes */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <Tag className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-black uppercase">Mã Khuyến Mãi</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {deals.map((deal) => (
                            <Card key={deal.id} className="bg-gradient-to-br from-card to-primary/5 border-primary/20 overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <Gift className="w-5 h-5 text-primary" />
                                                {deal.title}
                                            </CardTitle>
                                            <p className="text-muted-foreground mt-1">{deal.description}</p>
                                        </div>
                                        {deal.discountPercent > 0 && (
                                            <Badge className="bg-primary text-white text-lg px-3 py-1">
                                                <Percent className="w-4 h-4 mr-1" />
                                                {deal.discountPercent}%
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        {deal.code ? (
                                            <div
                                                className="bg-primary/10 border-2 border-dashed border-primary/30 px-4 py-2 rounded-lg font-mono font-bold text-lg cursor-pointer hover:bg-primary/20 transition-colors"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(deal.code!);
                                                }}
                                                title="Click để copy"
                                            >
                                                {deal.code}
                                            </div>
                                        ) : (
                                            <Badge variant="secondary">Tự động áp dụng</Badge>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            HSD: {new Date(deal.endDate).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Benefits */}
                <section className="bg-card/80 rounded-2xl p-8 border border-border/60">
                    <h2 className="text-2xl font-black uppercase text-center mb-8">
                        Quyền Lợi Khi Mua Hàng
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { icon: Percent, title: 'Giá tốt nhất', desc: 'Cam kết giá cạnh tranh' },
                            { icon: Gift, title: 'Quà tặng hấp dẫn', desc: 'Nhiều ưu đãi đi kèm' },
                            { icon: Clock, title: 'Giao hàng nhanh', desc: 'Toàn quốc 2-5 ngày' },
                            { icon: Sparkles, title: 'Chính hãng 100%', desc: 'Bảo hành chính hãng' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-bold mb-1">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
