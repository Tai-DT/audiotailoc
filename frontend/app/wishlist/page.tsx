'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthGuard } from '@/components/auth/auth-guard';
import {
  Heart,
  ShoppingCart,
  Eye,
  Trash2,
  ShoppingBag,
  Star,
  Package
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useWishlist, useRemoveFromWishlist, WishlistItem } from '@/lib/hooks/use-wishlist';
import { useAddToCart } from '@/lib/hooks/use-api';

function WishlistPageContent() {
  // Use real API hooks
  const { data: wishlistData, isLoading, error } = useWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  const wishlist = wishlistData?.items || [];

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlistMutation.mutateAsync(productId);
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch {
      toast.error('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      toast.success('Đã thêm vào giỏ hàng');
    } catch {
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Đang tải danh sách yêu thích...</h1>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Có lỗi xảy ra</h1>
            <p className="text-muted-foreground">Không thể tải danh sách yêu thích</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Danh sách yêu thích</h1>
              <p className="text-muted-foreground">
                {wishlist?.length || 0} sản phẩm trong danh sách yêu thích của bạn
              </p>
            </div>
            <Button asChild>
              <Link href="/products">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Tiếp tục mua sắm
              </Link>
            </Button>
          </div>

          {/* Wishlist Items */}
          {!wishlist || wishlist.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Danh sách trống</h3>
                <p className="text-muted-foreground mb-6">
                  Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.
                  Hãy khám phá sản phẩm của chúng tôi!
                </p>
                <Button asChild size="lg">
                  <Link href="/products">
                    Khám phá sản phẩm
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item: WishlistItem) => {
                const itemId = item?.id || '';
                const productId = item?.productId || '';
                const product = item?.product;
                const productSlug = product?.slug;
                const productName = product?.name || 'Sản phẩm';
                const productImageUrl = product?.imageUrl;
                const productPriceCents = product?.priceCents || 0;
                const productOriginalPriceCents = product?.originalPriceCents;
                const productStockQuantity = product?.stockQuantity || 0;
                
                return (
                <Card key={itemId} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <Image
                        src={productImageUrl || '/placeholder-product.svg'}
                        alt={productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-product.svg';
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <Button
                          size="icon"
                          variant="destructive"
                          className="w-8 h-8 rounded-full"
                          onClick={() => handleRemoveFromWishlist(productId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {productSlug ? (
                        <Link href={`/products/${productSlug}`}>
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                            {productName}
                          </h3>
                        </Link>
                      ) : (
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {productName}
                        </h3>
                      )}

                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">
                            4.5
                          </span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          0 đánh giá
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-green-600">
                            {formatPrice((productPriceCents || 0) / 100)}
                          </span>
                          {productOriginalPriceCents && productPriceCents && productOriginalPriceCents > productPriceCents && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(productOriginalPriceCents / 100)}
                            </span>
                          )}
                        </div>
                        {productStockQuantity > 0 ? (
                          <Badge variant="secondary" className="text-green-600">
                            <Package className="w-3 h-3 mr-1" />
                            Còn hàng
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            Hết hàng
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button
                          className="flex-1"
                          onClick={() => handleAddToCart(productId)}
                          disabled={productStockQuantity === 0}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Thêm vào giỏ
                        </Button>
                        {productSlug && (
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/products/${productSlug}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Recommendations */}
          {wishlist && wishlist.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Sản phẩm bạn có thể thích</h2>
              <div className="text-center py-8">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Đang tải gợi ý...</h3>
                <p className="text-muted-foreground">
                  Chúng tôi sẽ gợi ý sản phẩm phù hợp với sở thích của bạn
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <AuthGuard>
      <WishlistPageContent />
    </AuthGuard>
  );
}
