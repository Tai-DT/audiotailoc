'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useProduct } from '@/lib/hooks/use-products';
import { useIsInWishlist, useToggleWishlist } from '@/lib/hooks/use-wishlist';
import { useProductReviews } from '@/lib/hooks/use-api';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Plus, Minus, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';
import ProductReviews from '@/components/products/product-reviews';
import CreateReviewForm from '@/components/products/create-review-form';
import { ProductStructuredData } from '@/components/seo/product-structured-data';
import { BlurFade } from '@/components/ui/blur-fade';
import { ProductGallery } from '@/components/products/product-gallery';
import { RelatedProducts } from '@/components/products/related-products';
import { formatPrice, cn, parseImages } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Handle both Promise params (new pattern) and direct object
  const isPromise = typeof (params as unknown as { then?: unknown }).then === 'function';
  const resolvedParams = isPromise ? React.use(params as Promise<{ slug: string }>) : (params as { slug: string });
  const slug = resolvedParams.slug;

  const [quantity, setQuantity] = React.useState(1);
  const [isAdding, setIsAdding] = React.useState(false);
  const [showCreateReview, setShowCreateReview] = React.useState(false);
  
  const { data: product, isLoading: isProductLoading, error: productError } = useProduct(slug);
  const { data: wishlistData, isLoading: _isWishlistLoading } = useIsInWishlist(product?.id || '');
  const { data: reviewsData } = useProductReviews(product?.id || '');
  const { toggleWishlist, isLoading: isTogglingWishlist } = useToggleWishlist();
  const { addItem: addCartItem } = useCart();

  const isInWishlist = wishlistData?.isInWishlist ?? false;

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

  if (isProductLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              <div className="h-24 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
          <Link href="/products">
            <Button>Quay lại cửa hàng</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = parseImages(product.images, product.imageUrl);
  if (images.length === 0) {
    images.push('/placeholder-product.svg');
  }

  const discount = product.originalPriceCents && product.originalPriceCents > product.priceCents
    ? Math.round(((product.originalPriceCents - product.priceCents) / product.originalPriceCents) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <ProductStructuredData product={product} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Sản phẩm</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column: Gallery */}
          <BlurFade delay={0.1} inView>
            <ProductGallery images={images} productName={product.name} />
          </BlurFade>

          {/* Right Column: Product Info */}
          <BlurFade delay={0.2} inView>
            <div className="space-y-6">
              <div>
                {product.category && (
                  <Badge variant="secondary" className="mb-3 hover:bg-secondary/80">
                    {product.category.name}
                  </Badge>
                )}
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center text-warning">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="ml-1 font-medium text-foreground">4.8</span>
                    <span className="text-muted-foreground ml-1 text-sm">(128 đánh giá)</span>
                  </div>
                  <Separator orientation="vertical" className="h-5" />
                  <span className={cn(
                    "text-sm font-medium",
                    product.stockQuantity > 0 ? "text-success" : "text-destructive"
                  )}>
                    {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </div>

                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.priceCents)}
                  </span>
                  {product.originalPriceCents && product.originalPriceCents > product.priceCents && (
                    <>
                      <span className="text-lg text-muted-foreground line-through mb-1">
                        {formatPrice(product.originalPriceCents)}
                      </span>
                      <Badge variant="destructive" className="mb-2">
                        -{discount}%
                      </Badge>
                    </>
                  )}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {product.shortDescription || product.description?.substring(0, 150) + '...'}
                </p>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="h-10 w-10 rounded-none"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stockQuantity}
                      className="h-10 w-10 rounded-none"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {product.stockQuantity} sản phẩm có sẵn
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    className="flex-1 gap-2 text-base h-12"
                    onClick={handleAddToCart}
                    disabled={isAdding || product.stockQuantity === 0}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="h-12 w-12 p-0"
                    onClick={handleAddToWishlist}
                    disabled={isTogglingWishlist}
                  >
                    <Heart className={cn("w-5 h-5", isInWishlist && "fill-red-500 text-destructive")} />
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 w-12 p-0">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Features / Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <Truck className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Giao hàng miễn phí</h4>
                    <p className="text-xs text-muted-foreground">Cho đơn hàng trên 500k</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Bảo hành chính hãng</h4>
                    <p className="text-xs text-muted-foreground">Cam kết 100% chính hãng</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <RotateCcw className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Đổi trả dễ dàng</h4>
                    <p className="text-xs text-muted-foreground">Trong vòng 7 ngày</p>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 text-base"
              >
                Mô tả sản phẩm
              </TabsTrigger>
              <TabsTrigger 
                value="specifications" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 text-base"
              >
                Thông số kỹ thuật
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 text-base"
              >
                Đánh giá ({reviewsData?.stats?.totalReviews || 0})
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-8">
              <TabsContent value="description" className="animate-in fade-in-50 duration-300">
                <Card className="border-none shadow-none">
                  <CardContent className="p-0 prose prose-neutral dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: product.description || '' }} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="specifications" className="animate-in fade-in-50 duration-300">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Mock specifications if none exist */}
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-muted-foreground">Thương hiệu</span>
                        <span className="font-medium">Audiotailoc</span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-muted-foreground">Xuất xứ</span>
                        <span className="font-medium">Việt Nam</span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-muted-foreground">Bảo hành</span>
                        <span className="font-medium">12 Tháng</span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-muted-foreground">Tình trạng</span>
                        <span className="font-medium">Mới 100%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="animate-in fade-in-50 duration-300">
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Đánh giá từ khách hàng</h3>
                    <Button onClick={() => setShowCreateReview(!showCreateReview)}>
                      {showCreateReview ? 'Hủy đánh giá' : 'Viết đánh giá'}
                    </Button>
                  </div>
                  
                  {showCreateReview && (
                    <div className="mb-8 p-6 border rounded-lg bg-secondary/10">
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
        </div>

        {/* Related Products */}
        <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
      </main>
    </div>
  );
}
