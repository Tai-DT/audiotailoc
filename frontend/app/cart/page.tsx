'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCartStore, useAuthStore } from '@/lib/store';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, total, isLoading, getCart, updateCartItem, removeCartItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    getCart();
  }, [getCart]);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(cents / 100);
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(productId, newQuantity);
      toast.success('Đã cập nhật giỏ hàng');
    } catch (error) {
      toast.error('Không thể cập nhật giỏ hàng');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeCartItem(productId);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      toast.error('Không thể xóa sản phẩm khỏi giỏ hàng');
    }
  };

  const calculateItemTotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item.price, item.quantity), 0);
  };

  const shippingCost = 0; // Free shipping
  const taxRate = 0.1; // 10% VAT
  const subtotal = calculateSubtotal();
  const tax = Math.round(subtotal * taxRate);
  const grandTotal = subtotal + shippingCost + tax;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Chưa có sản phẩm nào trong giỏ hàng của bạn. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Tiếp tục mua sắm
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">
                Về trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tiếp tục mua sắm
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>
        <p className="text-gray-600">{items.length} sản phẩm</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                      <Image
                        src={item.product.imageUrl || '/images/product-placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            <Link href={`/products/${item.product.slug}`} className="hover:text-orange-600 transition-colors">
                              {item.product.name}
                            </Link>
                          </h3>
                          {item.product.brand && (
                            <p className="text-sm text-orange-600 font-medium">
                              {item.product.brand}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatPrice(calculateItemTotal(item.price, item.quantity))}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(item.price)} x {item.quantity}
                          </div>
                        </div>
                      </div>

                      {/* Stock Status */}
                      <div className="mt-2">
                        {item.product.stockQuantity > 10 ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Còn hàng
                          </Badge>
                        ) : item.product.stockQuantity > 0 ? (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Chỉ còn {item.product.stockQuantity} sản phẩm
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Hết hàng
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between">
                <span>Tạm tính ({items.length} sản phẩm)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="text-green-600">
                  {shippingCost === 0 ? 'Miễn phí' : formatPrice(shippingCost)}
                </span>
              </div>

              {/* Tax */}
              <div className="flex justify-between">
                <span>VAT (10%)</span>
                <span>{formatPrice(tax)}</span>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-orange-600">{formatPrice(grandTotal)}</span>
              </div>

              {/* Promotions */}
              <div className="space-y-2">
                <div className="text-sm text-green-600">
                  ✅ Miễn phí vận chuyển cho đơn hàng trên 1.000.000đ
                </div>
                <div className="text-sm text-blue-600">
                  🎁 Tặng phụ kiện cho đơn hàng trên 5.000.000đ
                </div>
              </div>

              <Separator />

              {/* Checkout Buttons */}
              <div className="space-y-3">
                {isAuthenticated ? (
                  <Button size="lg" className="w-full" asChild>
                    <Link href="/checkout">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Thanh toán ngay
                    </Link>
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button size="lg" className="w-full" asChild>
                      <Link href="/login?redirect=/checkout">
                        Đăng nhập để thanh toán
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <Link href="/checkout">
                        Thanh toán không cần tài khoản
                      </Link>
                    </Button>
                  </div>
                )}
                
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link href="/products">
                    Tiếp tục mua sắm
                  </Link>
                </Button>
              </div>

              {/* Security Info */}
              <div className="text-xs text-gray-500 text-center mt-4">
                <p>🔒 Thanh toán an toàn & bảo mật</p>
                <p>✅ Chính sách đổi trả 30 ngày</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products or Recommendations */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Có thể bạn quan tâm</h2>
        <div className="text-center text-gray-500 py-8">
          <p>Sản phẩm gợi ý sẽ được hiển thị ở đây</p>
        </div>
      </div>
    </div>
  );
}

