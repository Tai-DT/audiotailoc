'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/components/providers/cart-provider';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Truck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      clearCart();
    }
  };

  const shippingFee = total > 500000 ? 0 : 30000; // Free shipping over 500k VND
  const finalTotal = total + shippingFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-3xl font-bold mb-4">Giỏ hàng trống</h1>
              <p className="text-muted-foreground mb-8">
                Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Khám phá sản phẩm
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Xem dịch vụ
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Giỏ hàng của bạn</h1>
              <p className="text-muted-foreground">
                {itemCount} sản phẩm trong giỏ hàng
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tiếp tục mua sắm
                </Button>
              </Link>
              {items.length > 0 && (
                <Button variant="outline" onClick={handleClearCart}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa tất cả
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary">{item.category}</Badge>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-3 py-1 text-center min-w-[3rem]">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toLocaleString('vi-VN')}₫ / sản phẩm
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tạm tính ({itemCount} sản phẩm)</span>
                    <span>{total.toLocaleString('vi-VN')}₫</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span className={shippingFee === 0 ? 'text-green-600' : ''}>
                      {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}₫`}
                    </span>
                  </div>

                  {shippingFee === 0 && (
                    <p className="text-xs text-green-600">
                      🎉 Miễn phí vận chuyển cho đơn hàng trên 500.000₫
                    </p>
                  )}

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng</span>
                    <span>{finalTotal.toLocaleString('vi-VN')}₫</span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Link href="/checkout" className="w-full">
                      <Button className="w-full" size="lg">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Tiến hành thanh toán
                      </Button>
                    </Link>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>Giao hàng tận nơi trong 2-3 ngày</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}