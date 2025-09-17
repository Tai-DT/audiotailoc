'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProductBySlug } from '@/lib/hooks/use-api';
import { useCart } from '@/components/providers/cart-provider';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);

  const { data: product, isLoading, error } = useProductBySlug(slug);
  const { addItem, isInCart } = useCart();

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.maxOrderQuantity || 99)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.priceCents / 100,
      image: product.imageUrl || '/placeholder-product.svg',
      category: product.category?.name || 'Uncategorized',
      description: product.shortDescription
    });

    toast.success('Đã thêm vào giỏ hàng');
  };

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    toast.success('Đã thêm vào yêu thích');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép liên kết');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg" />
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-muted rounded" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Không tìm thấy sản phẩm
            </h1>
            <p className="text-muted-foreground mb-8">
              Sản phẩm bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.
            </p>
            <Link href="/products">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách sản phẩm
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl || '/placeholder-product.svg'];

  const discountPercentage = product.originalPriceCents && product.priceCents < product.originalPriceCents
    ? Math.round(((product.originalPriceCents - product.priceCents) / product.originalPriceCents) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Sản phẩm</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category?.slug}`} className="hover:text-primary">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg border">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 relative rounded border-2 overflow-hidden ${
                      selectedImage === index ? 'border-primary' : 'border-muted'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">(4.5)</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Đã bán: {product.viewCount || 0}
                </span>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {(product.priceCents / 100).toLocaleString('vi-VN')}₫
                </span>
                {product.originalPriceCents && product.originalPriceCents > product.priceCents && (
                  <span className="text-lg text-muted-foreground line-through">
                    {(product.originalPriceCents / 100).toLocaleString('vi-VN')}₫
                  </span>
                )}
              </div>

              {product.brand && (
                <p className="text-sm text-muted-foreground mb-2">
                  Thương hiệu: <span className="font-medium">{product.brand}</span>
                </p>
              )}

              {product.sku && (
                <p className="text-sm text-muted-foreground mb-4">
                  SKU: {product.sku}
                </p>
              )}
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Số lượng:</span>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.maxOrderQuantity || 99)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Còn lại: {product.stockQuantity} sản phẩm
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1"
                  size="lg"
                  disabled={product.stockQuantity < 1}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isInCart(product.id) ? 'Đã có trong giỏ' : 'Thêm vào giỏ hàng'}
                </Button>
                <Button variant="outline" size="lg" onClick={handleAddToWishlist}>
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {product.stockQuantity < 1 && (
                <p className="text-sm text-destructive text-center">
                  Sản phẩm này hiện đã hết hàng
                </p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Miễn phí vận chuyển</p>
                <p className="text-xs text-muted-foreground">Đơn hàng trên 500k</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Bảo hành chính hãng</p>
                <p className="text-xs text-muted-foreground">{product.warranty || '12 tháng'}</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Đổi trả dễ dàng</p>
                <p className="text-xs text-muted-foreground">Trong 7 ngày</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Mô tả</TabsTrigger>
              <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    {product.description ? (
                      <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    ) : (
                      <p className="text-muted-foreground">
                        Chưa có mô tả chi tiết cho sản phẩm này.
                      </p>
                    )}
                  </div>

                  {product.features && product.features.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Tính năng nổi bật:</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {product.specifications && product.specifications.length > 0 ? (
                    <div className="grid gap-4">
                      {product.specifications?.map((spec, index) => (
                        <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                          <span className="font-medium">{spec.name}:</span>
                          <span className="text-muted-foreground">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Chưa có thông số kỹ thuật cho sản phẩm này.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Chưa có đánh giá cho sản phẩm này.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Hãy là người đầu tiên đánh giá sản phẩm!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for related products */}
            <div className="text-center py-8 text-muted-foreground">
              Sản phẩm liên quan sẽ được hiển thị ở đây
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}