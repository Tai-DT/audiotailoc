'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';
import { ProductGrid } from '@/components/products/product-grid';
import type { Category, Product } from '@/lib/types';
import { parseImages, cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Grid3X3, LayoutGrid, ArrowUpDown, Package } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BlurFade } from '@/components/ui/blur-fade';

type GridView = 'grid' | 'large';

type ProductSort = 'createdAt-desc' | 'price-asc' | 'price-desc' | 'viewCount-desc';

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function buildProductsUrl(next: {
  category?: string;
  q?: string;
  sort?: ProductSort;
  view?: GridView;
}): string {
  const params = new URLSearchParams();
  if (next.category) params.set('category', next.category);
  if (next.q) params.set('q', next.q);
  if (next.sort) params.set('sort', next.sort);
  if (next.view && next.view !== 'grid') params.set('view', next.view);
  const qs = params.toString();
  return `/products${qs ? `?${qs}` : ''}`;
}

export interface ProductsPageClientProps {
  products: Product[];
  total: number;
  categories: Category[];
  initialSearchParams: {
    category?: string | string[];
    q?: string | string[];
    sort?: string | string[];
    view?: string | string[];
  };
}

export default function ProductsPageClient({
  products,
  total,
  categories,
  initialSearchParams,
}: ProductsPageClientProps) {
  const router = useRouter();
  const { addItem: addCartItem } = useCart();

  const initialCategory = first(initialSearchParams.category);
  const initialQ = first(initialSearchParams.q) ?? '';
  const initialSort = (first(initialSearchParams.sort) as ProductSort | undefined) ?? 'createdAt-desc';
  const initialView = (first(initialSearchParams.view) as GridView | undefined) ?? 'grid';

  const [searchQuery, setSearchQuery] = React.useState(initialQ);
  const [categorySlug, setCategorySlug] = React.useState<string | undefined>(initialCategory);
  const [sort, setSort] = React.useState<ProductSort>(initialSort);
  const [gridView, setGridView] = React.useState<GridView>(initialView);

  React.useEffect(() => {
    setSearchQuery(initialQ);
    setCategorySlug(initialCategory);
    setSort(initialSort);
    setGridView(initialView);
  }, [initialCategory, initialQ, initialSort, initialView]);

  const topLevelCategories = React.useMemo(() => {
    return (categories || [])
      .filter((cat) => !cat.parentId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const currentCategory = React.useMemo(() => {
    if (!categorySlug) return undefined;
    return categories.find((cat) => cat.slug === categorySlug);
  }, [categories, categorySlug]);

  const handleAddToCart = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      toast.error('Không tìm thấy sản phẩm để thêm vào giỏ hàng');
      return;
    }

    try {
      const images = parseImages(product.images, product.imageUrl);
      addCartItem(
        {
          id: product.id,
          name: product.name,
          price: product.priceCents,
          image: images[0] || '/placeholder-product.svg',
          category: product.category?.name || 'Sản phẩm',
          description: product.shortDescription || product.description,
        },
        1,
      );
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.replace(
      buildProductsUrl({
        category: categorySlug,
        q: q.length > 0 ? q : undefined,
        sort,
        view: gridView,
      }),
      { scroll: false },
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategorySlug(undefined);
    setSort('createdAt-desc');
    setGridView('grid');
    router.replace('/products', { scroll: false });
  };

  const handleCategoryChange = (nextSlug: string | undefined) => {
    setCategorySlug(nextSlug);
    router.replace(
      buildProductsUrl({
        category: nextSlug,
        q: searchQuery.trim() || undefined,
        sort,
        view: gridView,
      }),
      { scroll: false },
    );
  };

  const handleSortChange = (nextSort: ProductSort) => {
    setSort(nextSort);
    router.replace(
      buildProductsUrl({
        category: categorySlug,
        q: searchQuery.trim() || undefined,
        sort: nextSort,
        view: gridView,
      }),
      { scroll: false },
    );
  };

  return (
    <main className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white selection:bg-primary/30">
      {/* Cinematic Hero Banner */}
      <section className="relative py-20 md:py-28 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-[110px]" />
          <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[90px]" />
          <div className="absolute inset-0 bg-studio-grid opacity-20" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <BlurFade delay={0.1} inView>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-semibold tracking-[0.14em] text-foreground/60 dark:text-zinc-200">
                  Elite Collection
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] md:leading-[1] max-w-5xl">
                {currentCategory ? (
                  <>
                    <span className="text-primary italic inline-block mr-4">Elite</span>
                    {currentCategory.name}
                  </>
                ) : (
                  <>
                    Hệ Thống <span className="text-primary italic">Âm Thanh</span>
                    <br />
                    Tầm Cỡ{' '}
                    <span className="bg-gradient-to-br from-primary via-red-500 to-red-800 bg-clip-text text-transparent italic inline-block">
                      Quốc Tế
                    </span>
                  </>
                )}
              </h1>

              <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-3xl font-medium leading-relaxed italic px-4">
                {currentCategory?.description ||
                  'Tuyển tập những thiết bị trình diễn đỉnh cao, mang tinh hoa âm nhạc vào không gian sống của bạn.'}
              </p>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Advanced Filter & Search Bar */}
      <section className="sticky top-[64px] sm:top-[80px] z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-3">
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
                  className="pl-12 bg-white/5 border-white/10 h-10 rounded-2xl text-white placeholder:text-zinc-600 focus:border-primary/50 transition-all font-medium ring-0"
                />
              </div>
            </form>

            {/* Elite Controls */}
            <div className="flex items-center gap-4">
              {/* Desktop & Mobile Filters Selection */}
              <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                <Select value={categorySlug || 'all'} onValueChange={(value: string) => handleCategoryChange(value === 'all' ? undefined : value)}>
                  <SelectTrigger className="w-[140px] sm:w-52 h-10 sm:h-11 bg-white/5 border-white/10 text-white font-semibold text-[9px] sm:text-[10px] tracking-wide rounded-xl hover:bg-white/10">
                    <SelectValue placeholder="Chuyên mục" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                    {topLevelCategories.map((category) => (
                      <SelectItem key={category.id} value={category.slug || category.id} className="focus:bg-primary/20">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sort} onValueChange={(value: string) => handleSortChange(value as ProductSort)}>
                  <SelectTrigger className="w-[140px] sm:w-52 h-10 sm:h-11 bg-white/5 border-white/10 text-white font-semibold text-[9px] sm:text-[10px] tracking-wide rounded-xl hover:bg-white/10">
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
                  className={cn('h-9 w-9 p-0 rounded-lg', gridView === 'grid' ? 'bg-primary text-white' : 'text-zinc-400')}
                  onClick={() => {
                    setGridView('grid');
                    router.replace(
                      buildProductsUrl({
                        category: categorySlug,
                        q: searchQuery.trim() || undefined,
                        sort,
                        view: 'grid',
                      }),
                      { scroll: false },
                    );
                  }}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn('h-9 w-9 p-0 rounded-lg', gridView === 'large' ? 'bg-primary text-white' : 'text-zinc-400')}
                  onClick={() => {
                    setGridView('large');
                    router.replace(
                      buildProductsUrl({
                        category: categorySlug,
                        q: searchQuery.trim() || undefined,
                        sort,
                        view: 'large',
                      }),
                      { scroll: false },
                    );
                  }}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>

              {/* Status Indicator */}
              <div className="hidden md:flex flex-col justify-center text-right pl-4 border-l border-white/10">
                <span className="text-[10px] font-semibold text-primary tracking-wide">Live status</span>
                <span className="text-sm font-black text-white">{total} Sản phẩm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Display */}
      <section className="py-8 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <BlurFade delay={0.2} inView>
            <ProductGrid
              products={products}
              onAddToCart={handleAddToCart}
              columns={gridView === 'large' ? 3 : undefined}
            />
          </BlurFade>

          {/* Empty State Redesign */}
          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <Package className="w-16 h-16 md:w-24 md:h-24 text-zinc-500 relative z-10" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl md:text-3xl font-black tracking-tight">Không tìm thấy kiệt tác nào</h3>
                <p className="text-zinc-300 text-sm md:text-base max-w-md mx-auto font-medium">
                  Chúng tôi không tìm thấy sản phẩm nào khớp với tiêu chí của bạn. Vui lòng làm mới bộ lọc hoặc liên hệ chuyên gia để được tư vấn.
                </p>
              </div>
              <Button onClick={handleClearFilters} className="h-12 px-8 bg-white text-slate-950 rounded-2xl font-semibold tracking-wide hover:bg-white/90">
                Làm mới Bộ sưu tập
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
