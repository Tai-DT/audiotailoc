'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { CartItem } from '@/components/cart/CartItem';

export default function CartPage() {
  const { items, getTotal, getItemCount, clearCart, guestId, createGuestCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Create guest cart if not authenticated and no guestId
    if (!isAuthenticated && !guestId) {
      createGuestCart();
    }
  }, [isAuthenticated, guestId, createGuestCart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleClearCart = () => {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h1>
            <p className="text-gray-600 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi!
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors inline-block"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng</h1>
          <p className="text-gray-600">
            Bạn có {getItemCount()} sản phẩm trong giỏ hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Sản phẩm ({items.length})
                </h2>
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>

              {/* Order Summary */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="text-gray-900">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-gray-900">Tính sau</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thuế:</span>
                  <span className="text-gray-900">Tính sau</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Tổng cộng:</span>
                    <span className="text-blue-600">{formatPrice(getTotal())}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center block"
              >
                Tiến hành thanh toán
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center block mt-4"
              >
                Tiếp tục mua sắm
              </Link>

              {/* Guest Checkout Notice */}
              {!isAuthenticated && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Đăng nhập để lưu giỏ hàng</p>
                      <p className="mt-1">
                        <Link href="/login" className="underline hover:no-underline">
                          Đăng nhập
                        </Link>{' '}
                        hoặc{' '}
                        <Link href="/register" className="underline hover:no-underline">
                          đăng ký
                        </Link>{' '}
                        để lưu giỏ hàng và theo dõi đơn hàng.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Thanh toán an toàn
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

