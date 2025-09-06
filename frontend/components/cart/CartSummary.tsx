'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  Shield, 
  RotateCcw,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';

interface CartSummaryProps {
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export default function CartSummary({ onCheckout, onContinueShopping }: CartSummaryProps) {
  const { items, total, itemCount } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const subtotal = total;
  const discount = appliedCoupon 
    ? appliedCoupon.type === 'percentage' 
      ? subtotal * (appliedCoupon.discount / 100)
      : appliedCoupon.discount
    : 0;
  const shipping = subtotal > 500000 ? 0 : 30000; // Free shipping over 500k
  const finalTotal = subtotal - discount + shipping;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    // Mock coupon validation
    const coupons = {
      'AUDIO10': { discount: 10, type: 'percentage' as const },
      'FREESHIP': { discount: 30000, type: 'fixed' as const },
      'NEWCUSTOMER': { discount: 15, type: 'percentage' as const },
      'WELCOME20': { discount: 20, type: 'percentage' as const }
    };

    const coupon = coupons[couponCode.toUpperCase() as keyof typeof coupons];
    if (coupon) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
      toast.success(`Mã giảm giá "${couponCode.toUpperCase()}" đã được áp dụng!`);
      setCouponCode('');
    } else {
      toast.error('Mã giảm giá không hợp lệ');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Đã xóa mã giảm giá');
  };

  const handleCheckout = () => {
    if (itemCount === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }
    onCheckout();
  };

  if (itemCount === 0) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Giỏ hàng trống
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <ShoppingCart className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-600 mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Button onClick={onContinueShopping} className="w-full">
            Tiếp tục mua sắm
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Tóm tắt đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coupon Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Mã giảm giá</label>
          <div className="flex gap-2">
            <Input
              placeholder="Nhập mã giảm giá"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
            />
            <Button 
              onClick={handleApplyCoupon}
              variant="outline"
              size="sm"
            >
              Áp dụng
            </Button>
          </div>
          {appliedCoupon && (
            <div className="flex items-center justify-between bg-green-50 p-2 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">
                  {appliedCoupon.code}: -{appliedCoupon.discount}
                  {appliedCoupon.type === 'percentage' ? '%' : '₫'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCoupon}
                className="text-red-600 hover:text-red-700"
              >
                ✕
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>Tạm tính ({itemCount} sản phẩm)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          {appliedCoupon && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Giảm giá</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span>Phí vận chuyển</span>
            <span className={shipping === 0 ? 'text-green-600' : ''}>
              {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
            </span>
          </div>
          
          <div className="flex justify-between text-lg font-bold border-t pt-3">
            <span>Tổng cộng</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Truck className="w-4 h-4" />
            <span>Giao hàng miễn phí cho đơn hàng trên 500k</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Bảo hành chính hãng 12-24 tháng</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <RotateCcw className="w-4 h-4" />
            <span>Đổi trả trong 30 ngày</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button 
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            Tiến hành thanh toán
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button 
            onClick={onContinueShopping}
            variant="outline"
            className="w-full"
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}