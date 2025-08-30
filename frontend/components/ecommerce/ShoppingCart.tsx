'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart as CartIcon, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  Truck,
  CreditCard,
  Shield,
  RotateCcw,
  Heart,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  stock: number;
  brand: string;
  category: string;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onMoveToWishlist: (item: CartItem) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export default function ShoppingCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist,
  onCheckout,
  onContinueShopping
}: ShoppingCartProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon 
    ? appliedCoupon.type === 'percentage' 
      ? subtotal * (appliedCoupon.discount / 100)
      : appliedCoupon.discount
    : 0;
  const shipping = subtotal > 500000 ? 0 : 30000; // Free shipping over 500k
  const total = subtotal - discount + shipping;

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + change));
    onUpdateQuantity(itemId, newQuantity);
  };

  const handleApplyCoupon = () => {
    // Mock coupon validation
    const coupons = {
      'AUDIO10': { discount: 10, type: 'percentage' as const },
      'FREESHIP': { discount: 30000, type: 'fixed' as const },
      'NEWCUSTOMER': { discount: 15, type: 'percentage' as const }
    };

    const coupon = coupons[couponCode.toUpperCase() as keyof typeof coupons];
    if (coupon) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
      toast.success(`Mã giảm giá "${couponCode.toUpperCase()}" đã được áp dụng!`);
    } else {
      toast.error('Mã giảm giá không hợp lệ');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Đã xóa mã giảm giá');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <CartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
            <p className="text-muted-foreground mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Button onClick={onContinueShopping}>
              Tiếp tục mua sắm
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CartIcon className="h-5 w-5" />
                Giỏ hàng ({items.length} sản phẩm)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    {/* Product Image */}
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded"
                    />
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{item.brand}</Badge>
                            <Badge variant="outline">{item.category}</Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-600">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.quantity} x {formatPrice(item.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stock Warning */}
                      {item.quantity >= item.stock && (
                        <div className="text-sm text-orange-600 mt-2">
                          ⚠️ Chỉ còn {item.stock} sản phẩm trong kho
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMoveToWishlist(item)}
                        >
                          <Heart className="h-3 w-3 mr-1" />
                          Chuyển vào yêu thích
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Continue Shopping */}
          <Card>
            <CardContent className="p-4">
              <Button variant="outline" onClick={onContinueShopping}>
                ← Tiếp tục mua sắm
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính ({items.length} sản phẩm)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá ({appliedCoupon.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                  </span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Mã giảm giá</label>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    disabled={!!appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveCoupon}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim()}
                    >
                      Áp dụng
                    </Button>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="text-sm text-green-600">
                    ✓ Mã giảm giá &ldquo;{appliedCoupon.code}&rdquo; đã được áp dụng
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={onCheckout}
              >
                Tiến hành thanh toán
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-blue-500" />
                <span>Miễn phí vận chuyển cho đơn hàng trên 500k</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Bảo hành chính hãng 12 tháng</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-4 w-4 text-orange-500" />
                <span>Đổi trả miễn phí trong 30 ngày</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-purple-500" />
                <span>Thanh toán an toàn, bảo mật</span>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Có thể bạn thích</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Image
                      src={`/api/placeholder/60/60?text=Product+${i}`}
                      alt={`Recommended ${i}`}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Sản phẩm đề xuất {i}</h4>
                      <div className="text-sm text-green-600 font-medium">
                        {formatPrice(500000 + i * 100000)}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
