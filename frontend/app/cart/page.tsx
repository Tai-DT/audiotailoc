"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';

type CartItem = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productImageUrl?: string | null;
  priceCents: number;
  quantity: number;
  inStock: boolean;
};

type Cart = {
  items: CartItem[];
  totalItems: number;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) throw new Error('API base URL not configured');

      const res = await fetch(`${base}/cart`, {
        credentials: 'include',
      });

      if (res.ok) {
        const cartData = await res.json();
        setCart(cartData);
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return;
    
    setUpdating(itemId);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) throw new Error('API base URL not configured');

      const res = await fetch(`${base}/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity }),
      });

      if (res.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdating(null);
    }
  }

  async function removeItem(itemId: string) {
    setUpdating(itemId);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) throw new Error('API base URL not configured');

      const res = await fetch(`${base}/cart/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdating(null);
    }
  }

  async function clearCart() {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) throw new Error('API base URL not configured');

      const res = await fetch(`${base}/cart`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h1>
          <p className="text-gray-600 mb-8">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg">
                🛍️ Tiếp tục mua sắm
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" size="lg">
                📂 Xem danh mục
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sản phẩm ({cart.totalItems})</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  Xóa tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    {/* Product Image */}
                    <div className="w-20 h-20 relative flex-shrink-0">
                      {item.productImageUrl ? (
                        <Image
                          src={item.productImageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover rounded"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No img</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/products/${item.productSlug}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {item.productName}
                      </Link>
                      <div className="text-lg font-bold text-blue-600 mt-1">
                        {formatPrice(item.priceCents)}
                      </div>
                      {!item.inStock && (
                        <Badge variant="destructive" className="mt-1">
                          Hết hàng
                        </Badge>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id || item.quantity <= 1}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value > 0) {
                            updateQuantity(item.id, value);
                          }
                        }}
                        className="w-16 text-center"
                        min="1"
                        disabled={updating === item.id}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id || !item.inStock}
                      >
                        +
                      </Button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right min-w-0">
                      <div className="font-bold text-gray-900">
                        {formatPrice(item.priceCents * item.quantity)}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={updating === item.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(cart.subtotalCents)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{formatPrice(cart.shippingCents)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thuế:</span>
                  <span>{formatPrice(cart.taxCents)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(cart.totalCents)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Link href="/checkout" className="w-full">
                    <Button className="w-full" size="lg">
                      🛒 Tiến hành thanh toán
                    </Button>
                  </Link>
                  <Link href="/products" className="w-full">
                    <Button variant="outline" className="w-full">
                      🛍️ Tiếp tục mua sắm
                    </Button>
                  </Link>
                </div>

                {/* Promo Code */}
                <div className="pt-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Mã giảm giá"
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      Áp dụng
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>🔒</span>
                <span>Thanh toán an toàn</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                <span>🚚</span>
                <span>Giao hàng toàn quốc</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                <span>🔄</span>
                <span>Đổi trả 30 ngày</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

