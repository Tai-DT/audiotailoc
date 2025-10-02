'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProduct } from '@/lib/hooks/use-products';
import { useIsInWishlist, useToggleWishlist } from '@/lib/hooks/use-wishlist';
import { useProductReviews } from '@/lib/hooks/use-api';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';
import ProductReviews from '@/components/products/product-reviews';
import CreateReviewForm from '@/components/products/create-review-form';
import { ProductStructuredData } from '@/components/seo/product-structured-data';
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
  const { data: wishlistData, isLoading: isWishlistLoading } = useIsInWishlist(product?.id || '');
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
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (isProductLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Skeleton */}
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            
            {/* Content Skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (productError) {
    console.error('Product fetch error for', { slug, productError });
  }

  if (!isProductLoading && (!product || productError)) {
    // Use Next.js notFound for better SEO 404 signaling
    return notFound();
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              Không tìm thấy sản phẩm
            </h1>
            <p className="text-muted-foreground">
              Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Button className="mt-4" onClick={() => window.history.back()}>
              Quay lại
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProductStructuredData product={product} />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link href="/san-pham" className="hover:text-primary">Sản phẩm</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg border bg-gray-50 overflow-hidden relative">
              {product.images && product.images.length > 0 ? (
                <Image 
                  src={product.images[0]} 
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : product.imageUrl ? (
                <Image 
                  src={product.imageUrl} 
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Không có hình ảnh
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.categoryId || 'Chưa phân loại'}
              </Badge>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.0 • 12 đánh giá)</span>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="text-3xl font-bold text-primary">
                {formatPrice(product.priceCents)}
              </div>
              {product.originalPriceCents && product.originalPriceCents > product.priceCents && (
                <div className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPriceCents)}
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Đã bao gồm VAT
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Hết hàng'}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    disabled={quantity >= product.stockQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity <= 0 || isAdding}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleAddToWishlist} 
                  disabled={isTogglingWishlist || isWishlistLoading}
                  title={isInWishlist ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
                >
                  <Heart className={`h-4 w-4 transition-colors ${isInWishlist ? 'fill-red-500 text-red-500' : 'hover:text-red-500'}`} />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Miễn phí ship</div>
                  <div className="text-xs text-muted-foreground">Từ 1tr</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Bảo hành</div>
                  <div className="text-xs text-muted-foreground">12 tháng</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Đổi trả</div>
                  <div className="text-xs text-muted-foreground">7 ngày</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
              <TabsTrigger value="reviews">
                Đánh giá ({reviewsData?.stats?.totalReviews || 0})
              </TabsTrigger>
              <TabsTrigger value="shipping">Giao hàng & Bảo hành</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông số kỹ thuật</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium capitalize">{key}:</span>
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                    ))}
                    {(!product.specifications || Object.keys(product.specifications).length === 0) && (
                      <p className="text-muted-foreground">Chưa có thông số kỹ thuật chi tiết.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Create Review Button */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Đánh giá từ khách hàng</h3>
                  <Button
                    onClick={() => setShowCreateReview(!showCreateReview)}
                    variant={showCreateReview ? "outline" : "default"}
                  >
                    {showCreateReview ? 'Hủy' : 'Viết đánh giá'}
                  </Button>
                </div>

                {/* Create Review Form */}
                {showCreateReview && (
                  <CreateReviewForm
                    productId={product?.id || ''}
                    onSuccess={() => setShowCreateReview(false)}
                    onCancel={() => setShowCreateReview(false)}
                  />
                )}

                {/* Reviews List */}
                <ProductReviews productId={product?.id || ''} />
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin giao hàng & Bảo hành</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Giao hàng</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Miễn phí giao hàng cho đơn hàng từ 1.000.000₫</li>
                      <li>• Giao hàng nhanh trong 2-3 ngày tại TP.HCM</li>
                      <li>• Giao hàng toàn quốc trong 3-7 ngày</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Bảo hành</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Bảo hành chính hãng 12 tháng</li>
                      <li>• Hỗ trợ kỹ thuật miễn phí</li>
                      <li>• Đổi trả trong 7 ngày nếu có lỗi</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

    </div>
  );
}