'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/components/providers/cart-provider';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  // detect cancelled / failed payment redirects from provider
  const isCancelled =
    searchParams.get('cancel') === 'true' ||
    /CANCELLED/i.test(searchParams.get('status') || '') ||
    Boolean(searchParams.get('error'));

  useEffect(() => {
    // Do NOT clear cart on cancelled payments — preserve pending order so user can retry
    if (isCancelled) {
      console.log('[OrderSuccess] Payment cancelled — preserving cart and pending-payos-order');
      return;
    }

    // ✅ Clear cart ONLY when payment is confirmed
    const pendingOrder = localStorage.getItem('pending-payos-order');
    const orderId = searchParams.get('orderId');

    if (pendingOrder && orderId === pendingOrder) {
      // Webhook đã confirm payment thành công
      clearCart();
      localStorage.removeItem('pending-payos-order');
      console.log('[OrderSuccess] Cart cleared after PayOS payment confirmation');
    } else if (searchParams.get('method') === 'cod') {
      // COD payment - clear immediately
      clearCart();
      console.log('[OrderSuccess] Cart cleared after COD order');
    }
  }, [searchParams, clearCart, isCancelled]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          {isCancelled ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Thanh toán đã huỷ</h1>
              <p className="text-muted-foreground mb-4">
                Giao dịch chưa hoàn tất. Đơn hàng và giỏ hàng của bạn vẫn được lưu — bạn có thể thử thanh toán lại hoặc kiểm tra thông tin bên dưới.
              </p>

              <div className="bg-muted rounded-lg p-4 mb-4 text-left">
                {searchParams.get('orderId') && (
                  <p className="text-sm">
                    <strong>Mã đơn:</strong> {searchParams.get('orderId')}
                  </p>
                )}
                {searchParams.get('orderCode') && (
                  <p className="text-sm">
                    <strong>Mã nội bộ (orderCode):</strong> {searchParams.get('orderCode')}
                  </p>
                )}
                {searchParams.get('status') && (
                  <p className="text-sm">
                    <strong>Trạng thái:</strong> {searchParams.get('status')}
                  </p>
                )}
                {searchParams.get('code') && (
                  <p className="text-sm">
                    <strong>Mã trả về:</strong> {searchParams.get('code')}
                  </p>
                )}
                {searchParams.get('id') && (
                  <p className="text-sm">
                    <strong>Transaction ID:</strong> {searchParams.get('id')}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Đặt hàng thành công!
              </h1>
              <p className="text-muted-foreground">
                Cảm ơn bạn đã đặt hàng tại Audio Tài Lộc
              </p>
            </>
          )}
        </div>

        {searchParams.get('orderId') && (
          <div className="bg-muted rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Mã đơn hàng</p>
            <p className="text-lg font-semibold text-foreground">
              {searchParams.get('orderId')}
            </p>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-6">
          Chúng tôi sẽ gửi email xác nhận đơn hàng và thông tin vận chuyển đến địa chỉ email của bạn.
        </p>

        <div className="space-y-3">
          {isCancelled ? (
            <>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 px-4 rounded-md transition-colors"
              >
                Thanh toán lại
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium py-3 px-4 rounded-md transition-colors"
              >
                Xem giỏ hàng
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/products')}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 px-4 rounded-md transition-colors"
              >
                Tiếp tục mua sắm
              </button>
              <button
                onClick={() => router.push('/booking-history')}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium py-3 px-4 rounded-md transition-colors"
              >
                Xem đơn hàng của tôi
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
