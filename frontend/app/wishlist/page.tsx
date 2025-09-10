'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

// Mock wishlist data - in real app, this would come from API/store
const mockWishlist = [
  {
    id: '1',
    name: 'Loa JBL PartyBox 310',
    price: 15990000,
    imageUrl: '/images/products/jbl-partybox.jpg',
    slug: 'jbl-partybox-310',
    inStock: true,
  },
  {
    id: '2',
    name: 'Tai nghe Sony WH-1000XM5',
    price: 8990000,
    imageUrl: '/images/products/sony-wh1000xm5.jpg',
    slug: 'sony-wh-1000xm5',
    inStock: true,
  },
  {
    id: '3',
    name: 'Micro Shure SM58',
    price: 2490000,
    imageUrl: '/images/products/shure-sm58.jpg',
    slug: 'shure-sm58',
    inStock: false,
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlist);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleRemove = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    toast.success('Đã xóa khỏi danh sách yêu thích');
  };

  const handleAddToCart = (item: any) => {
    toast.success(`Đã thêm ${item.name} vào giỏ hàng`);
  };

  const handleShare = () => {
    toast.info('Tính năng chia sẻ sẽ sớm ra mắt');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Danh sách yêu thích trống</h1>
          <p className="text-gray-600 mb-6">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích</p>
          <Button asChild>
            <Link href="/products">Khám phá sản phẩm</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Danh sách yêu thích</h1>
          <p className="text-gray-600">{wishlistItems.length} sản phẩm</p>
        </div>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Chia sẻ
        </Button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => handleRemove(item.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <CardContent className="p-4">
              <Link href={`/products/${item.slug}`}>
                <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors mb-2">
                  {item.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-orange-600">
                  {formatPrice(item.price)}
                </span>
                {!item.inStock && (
                  <span className="text-sm text-red-600">Hết hàng</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  disabled={!item.inStock}
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Thêm giỏ hàng
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
