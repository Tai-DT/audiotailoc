'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts, useCategories } from '@/lib/hooks/use-api';
import { ProductFilters } from '@/lib/types';
import { ProductGrid } from '@/components/products/product-grid';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';
import { parseImages, cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Search, Grid3X3, LayoutGrid, ArrowUpDown,
    Package, Music4
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { BlurFade } from '@/components/ui/blur-fade';

function ProductsPageContent() {
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get('category');

    const { addItem: addCartItem } = useCart();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [_categoryNotFound, setCategoryNotFound] = React.useState(false);
    const [gridView, setGridView] = React.useState<'grid' | 'large'>('grid');
    const [filters, setFilters] = React.useState<ProductFilters>({
        page: 1,
        pageSize: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const { data, isLoading } = useProducts(filters);
    const { data: categories, isLoading: categoriesLoading } = useCategories();

    // Set category filter based on URL parameter
    React.useEffect(() => {
        if (!categories) return;

        if (categorySlug) {
            const category = categories.find((cat: { slug: string; id: string }) => cat.slug === categorySlug);
            if (category) {
                setFilters((prev: ProductFilters) => ({ ...prev, categoryId: category.id, page: 1 }));
                setCategoryNotFound(false);
            } else {
                setCategoryNotFound(true);
                setFilters((prev: ProductFilters) => ({ ...prev, categoryId: undefined, page: 1 }));
            }
        } else {
            setFilters((prev: ProductFilters) => ({ ...prev, categoryId: undefined, page: 1 }));
            setCategoryNotFound(false);
        }
    }, [categorySlug, categories]);

    const handleFiltersChange = (newFilters: Partial<ProductFilters>) => {
        setFilters((prev: ProductFilters) => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handleAddToCart = async (productId: string) => {
        const product = data?.items.find((item: { id: string }) => item.id === productId);

        if (!product) {
            toast.error('Không tìm thấy sản phẩm để thêm vào giỏ hàng');
            return;
        }

        try {
            const images = parseImages(product.images, product.imageUrl);
            addCartItem({
                id: product.id,
                name: product.name,
                price: product.priceCents / 100,
                image: images[0] || '/placeholder-product.svg',
                category: product.category?.name || 'Uncategorized',
                description: product.shortDescription || product.description,
            }, 1);
            toast.success('Đã thêm sản phẩm vào giỏ hàng');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
        }
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleFiltersChange({ q: searchQuery.trim() || undefined });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setCategoryNotFound(false);
        setFilters({
            page: 1,
            pageSize: 20,
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('category');
            window.history.replaceState({}, '', url.toString());
        }
    };

    const handleCategoryChange = (categoryId: string | undefined) => {
        handleFiltersChange({ categoryId });
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (categoryId) {
                const category = categories?.find((cat: { id: string; slug: string }) => cat.id === categoryId);
                if (category) {
                    url.searchParams.set('category', category.slug);
                }
            } else {
                url.searchParams.delete('category');
            }
            window.history.replaceState({}, '', url.toString());
        }
    };

    const currentCategory = categories?.find((cat: { id: string }) => cat.id === filters.categoryId);
    const _activeFiltersCount = [filters.categoryId, filters.q, filters.brand].filter(Boolean).length;

    // Filter categories for sidebar (top-level only)
    const topLevelCategories = categories?.filter((cat: { parentId?: string | null }) => !cat.parentId) || [];

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-primary/30" role="main" aria-labelledby="products-title">
            {/* Cinematic Hero Banner */}
            <section className="relative py-24 md:py-32 overflow-hidden border-b border-white/5">
                {/* Dynamic Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-[150px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                    <div className="absolute inset-0 bg-studio-grid opacity-20" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <BlurFade delay={0.1} inView>
                        <div className="flex flex-col items-center text-center space-y-8">
                            {/* Specialized Tag */}
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
                                <Music4 className="w-4 h-4 text-primary animate-pulse" />
                                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/80">Elite Collection</span>
                            </div>

                            <h1 id="products-title" className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] md:leading-[1] max-w-5xl">
                                {currentCategory ? (
                                    <>
                                        <span className="text-primary italic inline-block mr-4 italic">Elite</span>
                                        {currentCategory.name}
                                    </>
                                ) : (
                                    <>
                                        Hệ Thống <span className="text-primary italic">Âm Thanh</span><br />
                                        Tầm Cỡ <span className="bg-gradient-to-br from-primary via-red-500 to-red-800 bg-clip-text text-transparent italic inline-block">Quốc Tế</span>
                                    </>
                                )}
                            </h1>

                            <p className="text-zinc-300 text-base md:text-xl max-w-3xl font-medium leading-relaxed italic px-4">
                                {currentCategory?.description || 'Tuyển tập những thiết bị trình diễn đỉnh cao, mang tinh hoa âm nhạc vào không gian sống của bạn.'}
                            </p>

                            <div className="flex flex-wrap justify-center gap-6 pt-4">
                                <div className="flex items-center gap-2 group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Professional Gear</span>
                                </div>
                                <div className="flex items-center gap-2 group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Verified Quality</span>
                                </div>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </section>

            {/* Advanced Filter & Search Bar */}
            <section className="sticky top-[64px] sm:top-[80px] z-40 bg-slate-950/80 backdrop-blur-3xl border-b border-white/10">
                <div className="container mx-auto px-4 md:px-6 py-4">
                    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-stretch lg:items-center justify-between">
                        {/* Search */}
                        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-all" />
                                <Input
                                    type="text"
                                    placeholder="Tìm kiếm dòng máy, thương hiệu..."
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                    className="pl-12 bg-white/5 border-white/10 h-12 rounded-2xl text-white placeholder:text-zinc-600 focus:border-primary/50 transition-all font-medium ring-0"
                                />
                            </div>
                        </form>

                        {/* Elite Controls */}
                        <div className="flex items-center gap-4">
                            {/* Desktop & Mobile Filters Selection */}
                            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                                <Select
                                    value={filters.categoryId || 'all'}
                                    onValueChange={(value: string) => handleCategoryChange(value === 'all' ? undefined : value)}
                                >
                                    <SelectTrigger className="w-[140px] sm:w-52 h-10 sm:h-11 bg-white/5 border-white/10 text-white font-bold uppercase text-[9px] sm:text-[10px] tracking-widest rounded-xl hover:bg-white/10">
                                        <SelectValue placeholder="Chuyên mục" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                                        {topLevelCategories.map((category: { id: string; name: string }) => (
                                            <SelectItem key={category.id} value={category.id} className="focus:bg-primary/20">
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={`${filters.sortBy}-${filters.sortOrder}`}
                                    onValueChange={(value: string) => {
                                        const [sortByRaw, sortOrder] = value.split('-');
                                        handleFiltersChange({
                                            sortBy: sortByRaw as ProductFilters['sortBy'],
                                            sortOrder: sortOrder as ProductFilters['sortOrder']
                                        });
                                    }}
                                >
                                    <SelectTrigger className="w-[140px] sm:w-52 h-10 sm:h-11 bg-white/5 border-white/10 text-white font-bold uppercase text-[9px] sm:text-[10px] tracking-widest rounded-xl hover:bg-white/10">
                                        <ArrowUpDown className="w-3 h-3 mr-2 text-primary" />
                                        <SelectValue placeholder="Sắp xếp" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
                                        <SelectItem value="price-asc">Giá: Thấp → Cao</SelectItem>
                                        <SelectItem value="price-desc">Giá: Cao → Thấp</SelectItem>
                                        <SelectItem value="viewCount-desc">Phổ biến</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden p-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn("h-9 w-9 p-0 rounded-lg", gridView === 'grid' ? "bg-primary text-white" : "text-zinc-400")}
                                    onClick={() => setGridView('grid')}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn("h-9 w-9 p-0 rounded-lg", gridView === 'large' ? "bg-primary text-white" : "text-zinc-400")}
                                    onClick={() => setGridView('large')}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Status Indicator */}
                            <div className="hidden md:flex flex-col justify-center text-right pl-4 border-l border-white/10">
                                <span className="text-[10px] font-black uppercase text-primary tracking-widest">Live Status</span>
                                <span className="text-sm font-black text-white">{data?.total || 0} Sản phẩm</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Display */}
            <section className="py-10 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <BlurFade delay={0.2} inView>
                        <ProductGrid
                            products={data?.items || []}
                            loading={isLoading || categoriesLoading}
                            onAddToCart={handleAddToCart}
                            columns={gridView === 'large' ? 3 : undefined}
                        />
                    </BlurFade>

                    {/* Luxury Pagination */}
                    {!isLoading && data?.items && data.items.length > 0 && (
                        <div className="mt-24 flex flex-col items-center gap-6">
                            <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <div className="flex items-center gap-8">
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Audio Tài Lộc Gallery</span>
                            </div>
                        </div>
                    )}

                    {/* Empty State Redesign */}
                    {!isLoading && data?.items?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-40 text-center space-y-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                <Package className="w-24 h-24 text-zinc-500 relative z-10" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black tracking-tight">Không tìm thấy kiệt tác nào</h3>
                                <p className="text-zinc-300 max-w-md mx-auto font-medium">
                                    Chúng tôi không tìm thấy sản phẩm nào khớp với tiêu chí của bạn. Vui lòng làm mới bộ lọc hoặc liên hệ chuyên gia để được tư vấn.
                                </p>
                            </div>
                            <Button onClick={handleClearFilters} className="h-12 px-8 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:bg-white/90">
                                Làm mới Bộ sưu tập
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center gap-8">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center animate-pulse">
                    <Music4 className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.5em] text-zinc-500">Loading Elite Gallery</p>
                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-progress" style={{ width: '60%' }} />
                    </div>
                </div>
            </div>
        }>
            <ProductsPageContent />
        </Suspense>
    );
}
