'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProduct } from '@/lib/hooks/use-products';
import { useIsInWishlist, useToggleWishlist } from '@/lib/hooks/use-wishlist';
import { useProductReviews } from '@/lib/hooks/use-api';
import {
    Heart, ShoppingCart, Star, Truck, Shield,
    Plus, Minus, Share2, ChevronRight, Package,
    Sparkles, Zap, SlidersHorizontal, Download, Headphones
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';
import ProductReviews from '@/components/products/product-reviews';
import CreateReviewForm from '@/components/products/create-review-form';
import { ProductStructuredData } from '@/components/seo/product-structured-data';
import { BlurFade } from '@/components/ui/blur-fade';
import { ProductGallery } from '@/components/products/product-gallery';
import { RelatedProducts } from '@/components/products/related-products';
import { formatPrice, cn, parseImages } from '@/lib/utils';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ProductDetailPage() {
    const params = useParams<{ slug?: string | string[] }>();
    const slugParam = params?.slug;
    const slug = Array.isArray(slugParam) ? slugParam[0] : (slugParam || '');

    const router = useRouter();
    const pathname = usePathname();
    const isSoftwareRoute = pathname.startsWith('/software');

    const [quantity, setQuantity] = React.useState(1);
    const [isAdding, setIsAdding] = React.useState(false);
    const [showCreateReview, setShowCreateReview] = React.useState(false);
    const [digitalEmail, setDigitalEmail] = React.useState('');
    const [digitalName, setDigitalName] = React.useState('');
    const [isPayingDigital, setIsPayingDigital] = React.useState(false);

    const { data: product, isLoading: isProductLoading, error: productError } = useProduct(slug);
    const { data: wishlistData, isLoading: _isWishlistLoading } = useIsInWishlist(product?.id || '');
    const { data: reviewsData } = useProductReviews(product?.id || '');
    const { toggleWishlist, isLoading: isTogglingWishlist } = useToggleWishlist();
    const { addItem: addCartItem } = useCart();

    const isInWishlist = wishlistData?.isInWishlist ?? false;

    React.useEffect(() => {
        if (!product?.slug) return;
        if (product.isDigital && !isSoftwareRoute) {
            router.replace(`/software/${product.slug}`);
            return;
        }
        if (!product.isDigital && isSoftwareRoute) {
            router.replace(`/products/${product.slug}`);
        }
    }, [product?.slug, product?.isDigital, isSoftwareRoute, router]);

    const handleAddToCart = () => {
        if (!product) return;

        setIsAdding(true);
        try {
            addCartItem(
                {
                    id: product.id,
                    name: product.name,
                    price: product.priceCents ?? 0,
                    image: product.images?.[0] ?? product.imageUrl ?? '/placeholder-product.svg',
                    category: product.category?.name ?? 'Sản phẩm',
                    description: product.shortDescription ?? undefined,
                },
                quantity,
            );
            toast.success('Đã thêm sản phẩm vào giỏ hàng');
        } catch (err) {
            console.error('Add to cart error:', err);
            toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
        } finally {
            setIsAdding(false);
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        // Navigate to checkout after adding
        setTimeout(() => {
            window.location.href = '/checkout';
        }, 500);
    };

    const handleAddToWishlist = async () => {
        if (!product) return;

        try {
            await toggleWishlist(product.id, isInWishlist);
            toast.success(isInWishlist ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
        } catch (err) {
            console.error('Wishlist toggle error:', err);
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, Math.min(prev + delta, product?.stockQuantity || 99)));
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product?.name,
                    text: product?.shortDescription || '',
                    url: window.location.href,
                });
            } catch (_err) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast.success('Đã sao chép link sản phẩm');
        }
    };

    const handlePayDigital = async () => {
        if (!product) return;

        const email = digitalEmail.trim().toLowerCase();
        if (!email || !email.includes('@')) {
            toast.error('Vui lòng nhập email hợp lệ để nhận link tải');
            return;
        }

        setIsPayingDigital(true);
        try {
            const response = await fetch('/api/payment/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentMethod: 'payos',
                    successPath: '/software/download',
                    orderData: {
                        customerName: (digitalName || email.split('@')[0] || 'Customer').trim(),
                        customerEmail: email,
                        notes: `Digital download: ${product.name}`,
                        shippingAddress: 'DIGITAL_DOWNLOAD',
                        finalTotal: 0,
                        items: [
                            {
                                productId: product.id,
                                name: product.name,
                                quantity: 1,
                                unitPrice: product.priceCents ?? 0,
                            },
                        ],
                    },
                }),
            });

            const result = await response.json();
            if (!result?.success || !result?.paymentUrl) {
                throw new Error(result?.error || 'Không thể khởi tạo thanh toán PayOS');
            }

            const orderId = typeof result?.orderId === 'string' ? result.orderId : '';
            const intentId = typeof result?.intentId === 'string' ? result.intentId : '';
            if (orderId && intentId) {
                try {
                    localStorage.setItem(`atl_payos_intent_${orderId}`, intentId);
                    localStorage.setItem('atl_last_payos_order', orderId);
                    localStorage.setItem('atl_last_payos_intent', intentId);
                } catch (_err) {
                    // ignore storage errors (private mode, quota, etc.)
                }
            }

            toast.success('Đang chuyển đến PayOS…');
            window.location.href = result.paymentUrl;
        } catch (err) {
            console.error('Digital payment error:', err);
            const message = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo thanh toán';
            toast.error(message);
        } finally {
            setIsPayingDigital(false);
        }
    };

    if (isProductLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
                {/* Hero Skeleton */}
                <div className="relative py-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                    <div className="container mx-auto px-4">
                        <div className="h-6 bg-muted/50 rounded-lg animate-pulse w-64 mb-8" />
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="aspect-square bg-muted/30 rounded-2xl animate-pulse" />
                            <div className="space-y-6">
                                <div className="h-8 bg-muted/50 rounded-lg animate-pulse w-24" />
                                <div className="h-12 bg-muted/50 rounded-lg animate-pulse w-3/4" />
                                <div className="h-6 bg-muted/50 rounded-lg animate-pulse w-1/2" />
                                <div className="h-10 bg-muted/50 rounded-lg animate-pulse w-40" />
                                <div className="h-32 bg-muted/50 rounded-lg animate-pulse" />
                                <div className="flex gap-4">
                                    <div className="h-14 bg-muted/50 rounded-xl animate-pulse flex-1" />
                                    <div className="h-14 bg-muted/50 rounded-xl animate-pulse w-14" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (productError || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
                <div className="text-center space-y-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-muted/30 flex items-center justify-center">
                        <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h1>
                        <p className="text-muted-foreground">Sản phẩm này có thể đã bị xóa hoặc đường dẫn không đúng</p>
                    </div>
                    <Link href={isSoftwareRoute ? "/software" : "/products"}>
                        <Button size="lg" className="gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Quay lại cửa hàng
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const images = parseImages(product.images, product.imageUrl);
    const isSoftwareContext = isSoftwareRoute || Boolean(product.isDigital);
    const collectionHref = isSoftwareContext ? '/software' : '/products';
    const collectionLabel = isSoftwareContext ? 'Phần mềm' : 'Bộ sưu tập';
    if (images.length === 0) {
        images.push('/placeholder-product.svg');
    }

    const discount = product.originalPriceCents && product.originalPriceCents > product.priceCents
        ? Math.round(((product.originalPriceCents - product.priceCents) / product.originalPriceCents) * 100)
        : 0;

    const averageRating = reviewsData?.stats?.averageRating ?? 0;
    const totalReviews = reviewsData?.stats?.totalReviews ?? 0;
    const specifications = (() => {
        if (!product) return [];
        const specs: Array<{ label: string; value: string }> = [];

        if (product.brand) specs.push({ label: 'Thương hiệu', value: product.brand });
        if (product.model) specs.push({ label: 'Model', value: product.model });
        if (product.sku) specs.push({ label: 'SKU', value: product.sku });
        if (product.warranty) specs.push({ label: 'Bảo hành', value: product.warranty });
        if (product.dimensions) specs.push({ label: 'Kích thước', value: product.dimensions });
        if (typeof product.weight === 'number') {
            specs.push({ label: 'Trọng lượng', value: `${product.weight} kg` });
        }
        if (product.category?.name) specs.push({ label: 'Danh mục', value: product.category.name });

        const extraSpecs = product.specifications;
        if (Array.isArray(extraSpecs)) {
            extraSpecs.forEach((spec) => {
                if (spec?.name && spec?.value) {
                    specs.push({ label: spec.name, value: spec.value });
                }
            });
        } else if (extraSpecs && typeof extraSpecs === 'object') {
            Object.entries(extraSpecs).forEach(([label, value]) => {
                if (label && value) {
                    specs.push({ label, value: String(value) });
                }
            });
        }

        const seen = new Set<string>();
        return specs.filter((spec) => {
            if (!spec.value) return false;
            if (seen.has(spec.label)) return false;
            seen.add(spec.label);
            return true;
        });
    })();

    const isDigitalProduct = Boolean(product.isDigital);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative">
            <ProductStructuredData product={product} />

            {/* Product Hero Section */}
            <section className="relative pt-4 lg:pt-12 pb-8 lg:pb-16 z-10">
                <div className="container mx-auto px-4 md:px-6">
	                    {/* Breadcrumb - Minimalist Style */}
	                    <BlurFade delay={0.05} inView>
	                        <Breadcrumb className="mb-4 md:mb-8">
	                            <BreadcrumbList className="text-[11px] font-medium tracking-wide text-muted-foreground">
	                                <BreadcrumbItem>
	                                    <BreadcrumbLink asChild>
	                                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
	                                    </BreadcrumbLink>
	                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={collectionHref} className="hover:text-primary transition-colors">{collectionLabel}</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {product.category && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink asChild>
                                                <Link
                                                    href={`${collectionHref}?category=${product.category.slug || product.category.id}`}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    {product.category.name}
                                                </Link>
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </>
                                )}
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-muted-foreground truncate max-w-[150px] sm:max-w-none">
                                        {product.name}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </BlurFade>

                    <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-16">
                        {/* Left Column: Gallery (Spans 7 columns on Desktop) */}
                        <div className="lg:col-span-7">
	                            <BlurFade delay={0.1} inView>
	                                <div className="relative group">
	                                    <div className="absolute -inset-2 md:-inset-4 bg-primary/10 rounded-[1.5rem] md:rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
	                                    <div className="relative bg-muted/40 border border-border rounded-2xl md:rounded-[2rem] p-3 md:p-4 backdrop-blur-xl">
	                                        <ProductGallery images={images} productName={product.name} />
	                                    </div>
	                                </div>
	                            </BlurFade>
	                        </div>

                        {/* Right Column: Product Info (Spans 5 columns on Desktop) */}
                        <div className="lg:col-span-5">
                            <BlurFade delay={0.2} inView>
                                <div className="space-y-5 md:space-y-7 lg:sticky lg:top-32">
                                    {/* Category & Status */}
	                                    <div className="flex items-center justify-between">
	                                        <div className="flex items-center gap-3">
	                                            {product.category && (
	                                                <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
	                                                    <span className="text-[11px] font-semibold tracking-wide text-primary">{product.category.name}</span>
	                                                </div>
	                                            )}
	                                            {product.featured && (
	                                                <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-1.5">
	                                                    <Sparkles className="w-3 h-3 text-primary" />
	                                                    <span className="text-[11px] font-semibold tracking-wide text-primary">Phiên bản Elite</span>
	                                                </div>
	                                            )}
	                                        </div>
	                                        <div className={cn(
	                                            "flex items-center gap-2 text-[11px] font-semibold tracking-wide",
	                                            isDigitalProduct
	                                                ? "text-primary"
	                                                : product.stockQuantity > 0
	                                                    ? "text-green-500"
                                                    : "text-red-500"
                                        )}>
	                                            <div
	                                                className={cn(
	                                                    "w-1.5 h-1.5 rounded-full",
	                                                    isDigitalProduct
	                                                        ? "bg-primary"
	                                                        : product.stockQuantity > 0
	                                                            ? "bg-green-500"
	                                                            : "bg-red-500",
	                                                )}
	                                            />
	                                            {isDigitalProduct
	                                                ? 'Tải ngay sau thanh toán'
                                                : product.stockQuantity > 0
                                                    ? `Còn hàng (${product.stockQuantity})`
                                                    : 'Hết hàng'}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="space-y-2">
                                        <h1 className="text-2xl md:text-4xl xl:text-5xl font-black tracking-tight leading-[1.1]">
                                            {product.name}
                                        </h1>
                                        {product.brand && (
                                            <p className="text-primary font-bold italic tracking-wide text-lg opacity-80">{product.brand}</p>
                                        )}
                                    </div>

	                                    {/* Ratings */}
	                                    <div className="flex items-center gap-6 py-2 border-y border-border">
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className={cn(
                                                            "w-4 h-4",
                                                            s <= averageRating ? "fill-primary text-primary" : "text-muted-foreground"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-bold">{averageRating.toFixed(1)}</span>
                                        </div>
	                                        <div className="h-4 w-px bg-border" />
	                                        <span className="text-muted-foreground text-xs font-semibold tracking-wide">{totalReviews} đánh giá</span>
	                                    </div>

                                    {/* Price Block - High Impact */}
                                    <div className="relative p-4 md:p-8 rounded-[1.25rem] md:rounded-[2rem] bg-gradient-to-br from-card to-muted/20 border border-primary/20 overflow-hidden group hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_50px_-20px_rgba(220,38,38,0.3)]">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all duration-500" />
	                                        <div className="relative flex flex-col gap-2">
	                                            {/* Label for Price */}
	                                            <span className="text-[11px] font-semibold tracking-wide text-primary/80">Giá niêm yết</span>

                                            <div className="flex items-baseline gap-3 mt-1">
                                                <span className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-primary drop-shadow-sm">
                                                    {formatPrice(product.priceCents)}
                                                </span>
                                                {product.originalPriceCents && product.originalPriceCents > product.priceCents && (
                                                    <span className="text-base sm:text-lg md:text-xl text-muted-foreground line-through decoration-primary/40 font-bold decoration-2 opacity-60">
                                                        {formatPrice(product.originalPriceCents)}
                                                    </span>
                                                )}
                                            </div>
	                                            {discount > 0 && (
	                                                <div className="flex items-center gap-3 mt-2">
	                                                    <Badge className="bg-red-600 text-foreground dark:text-white font-semibold text-xs tracking-wide px-3 py-1 rounded-sm shadow-md">
	                                                        Giảm {discount}%
	                                                    </Badge>
	                                                    <span className="text-xs font-semibold text-green-500 tracking-wide italic">Tiết kiệm {formatPrice(product.originalPriceCents! - product.priceCents)}</span>
	                                                </div>
	                                            )}
	                                        </div>
	                                    </div>

                                    {/* Actions Area */}
                                    <div className="space-y-4">
                                        {isDigitalProduct ? (
                                            <div className="space-y-4">
	                                                <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-3">
	                                                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
	                                                        Sản phẩm tải về (phần mềm)
	                                                    </p>
	                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
	                                                        <div className="space-y-2">
	                                                            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">
	                                                                Email nhận link *
	                                                            </span>
                                                            <Input
                                                                value={digitalEmail}
                                                                onChange={(e) => setDigitalEmail(e.target.value)}
                                                                placeholder="you@example.com"
                                                                type="email"
                                                            />
                                                        </div>
	                                                        <div className="space-y-2">
	                                                            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">
	                                                                Tên (tuỳ chọn)
	                                                            </span>
                                                            <Input
                                                                value={digitalName}
                                                                onChange={(e) => setDigitalName(e.target.value)}
                                                                placeholder="Nguyễn Văn A"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

	                                                <Button
	                                                    size="lg"
	                                                    className={cn(
	                                                        "h-12 md:h-14 rounded-xl md:rounded-2xl font-semibold text-[11px] md:text-sm tracking-wide",
	                                                        "bg-white text-black hover:bg-slate-50 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)]",
	                                                        "transition-all active:scale-95 border border-border"
	                                                    )}
                                                    onClick={handlePayDigital}
                                                    disabled={isPayingDigital}
                                                >
                                                    <Download className="w-5 h-5 mr-3 text-primary" />
                                                    {isPayingDigital ? 'Đang tạo thanh toán…' : 'Thanh toán & Tải'}
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
	                                                <div className="flex items-center gap-4 p-3 rounded-2xl border border-border bg-card/40">
	                                                    <span className="text-[11px] font-semibold tracking-wide text-muted-foreground w-20">Số lượng:</span>
	                                                    <div className="flex items-center bg-background border border-border rounded-xl h-10 w-full max-w-[140px] shadow-sm">
                                                        <button
                                                            onClick={() => handleQuantityChange(-1)}
                                                            disabled={quantity <= 1}
                                                            className="flex-1 flex justify-center items-center text-muted-foreground hover:text-primary disabled:opacity-20 transition-colors active:scale-90"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-10 text-center font-black text-lg select-none">{quantity}</span>
                                                        <button
                                                            onClick={() => handleQuantityChange(1)}
                                                            disabled={quantity >= product.stockQuantity}
                                                            className="flex-1 flex justify-center items-center text-muted-foreground hover:text-primary disabled:opacity-20 transition-colors active:scale-90"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

	                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
	                                                    <Button
	                                                        size="lg"
	                                                        className={cn(
	                                                            "h-12 md:h-14 rounded-xl md:rounded-2xl font-semibold text-[11px] md:text-sm tracking-wide",
	                                                            "bg-gradient-to-r from-red-600 to-primary hover:from-red-500 hover:to-red-600 text-foreground dark:text-white shadow-[0_10px_30px_-10px_rgba(220,38,38,0.5)]",
	                                                            "transition-all active:scale-95 group hover:-translate-y-1"
	                                                        )}
                                                        onClick={handleAddToCart}
                                                        disabled={isAdding || product.stockQuantity === 0}
                                                    >
                                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12" />
                                                        <ShoppingCart className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform relative z-10" />
                                                        <span className="relative z-10">Thêm vào giỏ</span>
                                                    </Button>
	                                                    <Button
	                                                        size="lg"
	                                                        className={cn(
	                                                            "h-12 md:h-14 rounded-xl md:rounded-2xl font-semibold text-[11px] md:text-sm tracking-wide",
	                                                            "bg-white text-black hover:bg-slate-50 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)]",
	                                                            "transition-all active:scale-95 border border-border"
	                                                        )}
	                                                        onClick={handleBuyNow}
	                                                        disabled={isAdding || product.stockQuantity === 0}
	                                                    >
	                                                        <Zap className="w-5 h-5 mr-3 fill-primary text-primary" />
	                                                        Mua ngay
	                                                    </Button>
	                                                </div>
                                            </>
                                        )}

	                                        <div className="flex gap-4 pt-2">
	                                            <button
                                                onClick={handleAddToWishlist}
                                                disabled={isTogglingWishlist}
	                                                className={cn(
	                                                    "flex-1 flex items-center justify-center gap-3 h-12 rounded-xl border border-border text-[11px] font-semibold tracking-wide transition-all hover:bg-muted/40",
	                                                    isInWishlist ? "bg-primary/5 border-primary/30 text-primary" : ""
	                                                )}
	                                            >
                                                <Heart className={cn("w-4 h-4", isInWishlist && "fill-current")} />
                                                {isInWishlist ? 'Đã yêu thích' : 'Yêu thích'}
                                            </button>
	                                            <button
	                                                onClick={handleShare}
	                                                className="flex-1 flex items-center justify-center gap-3 h-12 rounded-2xl border border-border text-[11px] font-semibold tracking-wide hover:bg-muted/40 transition-all"
	                                            >
                                                <Share2 className="w-4 h-4" />
                                                Chia sẻ
                                            </button>
                                        </div>
                                    </div>

                                    {/* Trust Footer */}
                                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                                        {isDigitalProduct ? (
                                            <>
	                                                <div className="flex items-center gap-4 group">
                                                    <div className="p-3 rounded-xl bg-muted/40 border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                                        <Download className="h-4 w-4 text-primary" />
                                                    </div>
	                                                    <div>
	                                                        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">Tải xuống</p>
	                                                        <p className="text-xs font-bold leading-tight">Link gửi qua email</p>
	                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 group">
                                                    <div className="p-3 rounded-xl bg-muted/40 border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                                        <Headphones className="h-4 w-4 text-primary" />
                                                    </div>
	                                                    <div>
	                                                        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">Hỗ trợ</p>
	                                                        <p className="text-xs font-bold leading-tight">Kỹ thuật 24/7</p>
	                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-4 group">
                                                    <div className="p-3 rounded-xl bg-muted/40 border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                                        <Truck className="h-4 w-4 text-primary" />
                                                    </div>
	                                                    <div>
	                                                        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">Giao hàng</p>
	                                                        <p className="text-xs font-bold leading-tight">Vận chuyển toàn quốc</p>
	                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 group">
                                                    <div className="p-3 rounded-xl bg-muted/40 border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                                        <Shield className="h-4 w-4 text-primary" />
                                                    </div>
	                                                    <div>
	                                                        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">Bảo hành</p>
	                                                        <p className="text-xs font-bold leading-tight">Chính hãng 24 tháng</p>
	                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </BlurFade>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs Section - Technical Aesthetics */}
            <section className="relative py-12 lg:py-20 z-10 border-t border-border bg-muted/30">
                <div className="container mx-auto px-4 md:px-6">
                    <BlurFade delay={0.3} inView>
                        <Tabs defaultValue="description" className="w-full">
	                            <div className="flex justify-center mb-12">
	                                <TabsList className="bg-muted/40 border border-border p-1 md:p-1.5 rounded-xl md:rounded-2xl h-12 md:h-16 w-full max-w-2xl">
	                                    {[
	                                        { value: 'description', label: 'Tổng quan' },
	                                        { value: 'specifications', label: 'Thông số kỹ thuật' },
	                                        { value: 'reviews', label: `Đánh giá (${totalReviews})` },
	                                    ].map((tab) => (
	                                        <TabsTrigger
                                            key={tab.value}
                                            value={tab.value}
	                                            className={cn(
	                                                "flex-1 h-full rounded-lg md:rounded-xl text-[10px] font-semibold tracking-[0.14em] leading-none",
	                                                "data-[state=active]:bg-primary data-[state=active]:text-foreground dark:text-white data-[state=active]:shadow-xl",
	                                                "transition-all duration-500"
	                                            )}
	                                        >
                                            {tab.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            <div className="max-w-5xl mx-auto">
	                                <TabsContent value="description" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
	                                    <div className="p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] bg-card border border-border backdrop-blur-xl prose prose-slate max-w-none">
	                                        {product.description ? (
	                                            <div className="leading-relaxed text-muted-foreground italic text-base md:text-lg" dangerouslySetInnerHTML={{ __html: product.description }} />
	                                        ) : (
	                                            <div className="flex flex-col items-center py-20 text-muted-foreground">
	                                                <Package className="w-12 h-12 mb-4 opacity-50" />
	                                                <p className="font-semibold tracking-wide text-xs">Đang cập nhật mô tả</p>
	                                            </div>
	                                        )}
	                                    </div>
	                                </TabsContent>

	                                <TabsContent value="specifications" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700 focus-visible:outline-none">
	                                    <div className="p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] bg-card border border-border backdrop-blur-xl focus-visible:outline-none">
	                                        <h3 className="text-lg md:text-xl font-semibold tracking-wide mb-6 md:mb-8 border-l-4 border-primary pl-4 md:pl-6">Kiến trúc kỹ thuật</h3>
	                                        {specifications.length > 0 ? (
	                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                                                {specifications.map((spec, index) => (
	                                                    <div
	                                                        key={`${spec.label}-${index}`}
	                                                        className="flex items-center justify-between py-4 border-b border-border group hover:bg-muted/40 transition-colors rounded-lg px-4"
	                                                    >
	                                                        <span className="text-[11px] font-semibold tracking-wide text-muted-foreground group-hover:text-primary transition-colors">{spec.label}</span>
	                                                        <span className="text-sm font-bold text-foreground">{spec.value}</span>
	                                                    </div>
	                                                ))}
	                                            </div>
	                                        ) : (
	                                            <div className="flex flex-col items-center py-20 text-muted-foreground">
	                                                <SlidersHorizontal className="w-12 h-12 mb-4 opacity-50" />
	                                                <p className="font-semibold tracking-wide text-xs">Thông số đang cập nhật</p>
	                                            </div>
	                                        )}
	                                    </div>
	                                </TabsContent>

	                                <TabsContent value="reviews" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
	                                    <div className="p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] bg-card border border-border backdrop-blur-xl">
	                                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between mb-8 md:mb-12 border-b border-border pb-8 md:pb-10">
	                                            <div>
	                                                <h3 className="text-2xl font-bold tracking-tight">Xác thực khách hàng</h3>
	                                                <p className="text-muted-foreground text-sm font-semibold mt-2 tracking-wide">
	                                                    {totalReviews > 0
	                                                        ? `Đã nhận ${totalReviews} phản hồi từ chuyên gia`
	                                                        : 'Hãy là người đầu tiên đánh giá'}
	                                                </p>
	                                            </div>
	                                            <Button
	                                                onClick={() => setShowCreateReview(!showCreateReview)}
	                                                className="h-12 px-8 rounded-xl bg-white text-slate-950 font-semibold text-[11px] tracking-wide hover:bg-white/90"
	                                            >
	                                                {showCreateReview ? 'Đóng' : 'Viết đánh giá'}
	                                            </Button>
                                        </div>

                                        {showCreateReview && (
                                            <div className="mb-12 p-8 border border-primary/20 bg-primary/5 rounded-[2rem] animate-in zoom-in-95 duration-500">
                                                <CreateReviewForm
                                                    productId={product.id}
                                                    onSuccess={() => setShowCreateReview(false)}
                                                />
                                            </div>
                                        )}

                                        <ProductReviews productId={product.id} />
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </BlurFade>
                </div>
            </section>

	            {/* Featured Recommendations */}
	            <section className="relative py-12 md:py-24 z-10">
                <div className="container mx-auto px-4 md:px-6">
	                    <BlurFade delay={0.4} inView>
	                        <div className="flex items-center justify-between mb-12">
	                            <div>
	                                <p className="text-primary font-semibold tracking-[0.14em] text-[11px] mb-2">Gợi ý từ chuyên gia</p>
	                                <h2 className="text-3xl font-black tracking-tight">
	                                    {isSoftwareContext ? 'Phần mềm' : 'Sản phẩm'}{' '}
	                                    <span className="text-muted-foreground">{isSoftwareContext ? 'Liên quan' : 'Tương thích'}</span>
	                                </h2>
	                            </div>
	                            <Link href={collectionHref} className="group flex items-center gap-3 text-[11px] font-semibold tracking-wide text-muted-foreground hover:text-foreground transition-all">
	                                Xem tất cả
	                                <div className="p-2 rounded-lg bg-muted/40 border border-border group-hover:bg-primary transition-all">
	                                    <ChevronRight className="w-3 h-3 text-foreground group-hover:text-foreground dark:text-white" />
	                                </div>
	                            </Link>
	                        </div>
                        <RelatedProducts
                            categoryId={product.categoryId}
                            currentProductId={product.id}
                            isDigital={Boolean(product.isDigital)}
                            basePath={collectionHref}
                        />
                    </BlurFade>
                </div>
            </section>
        </div>

    );
}
