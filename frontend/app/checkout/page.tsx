import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { apiFetch, getApiBase } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Fetch cart data for checkout summary
async function fetchCart() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return null;
    const res = await fetch(`${base}/cart`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function CheckoutPage() {
  const cartData = await fetchCart();
  async function action(form: FormData) {
    'use server';
    const promo = String(form.get('promotionCode') || '');
    // Ensure logged in
    const { cookies } = await import('next/headers');
    const c = await cookies();
    if (!c.get('accessToken')) {
      redirect('/login');
    }
    // 1) Create order
    const orderRes = await apiFetch<{ order: { id: string; orderNo: string; totalCents: number } }>(
      '/checkout/create-order',
      { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ promotionCode: promo || undefined }) },
    );
    const order = orderRes.order;
    // 2) Create payment intent with PayOS
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const returnUrl = `${origin}/checkout/return?orderNo=${encodeURIComponent(order.orderNo)}`;
    const intent = await apiFetch<{ intentId: string; redirectUrl: string }>('/payments/intents', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderId: order.id, provider: 'PAYOS', idempotencyKey: `${order.id}`, returnUrl }),
    });
    redirect(intent.redirectUrl);
  }

  // Redirect to cart if no items
  if (!cartData || cartData.items.length === 0) {
    redirect('/cart');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Thanh toán</h1>
        <Link href="/cart" className="text-blue-600 hover:text-blue-800 transition-colors">
          ← Quay lại giỏ hàng
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartData.items.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center relative overflow-hidden">
                    {item.product?.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                        sizes="48px"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">🎵</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product?.name || item.productId}</h4>
                    <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {(item.unitPrice / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{(cartData.subtotalCents / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">
                    {(cartData.subtotalCents / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={action} className="space-y-6">
                <div>
                  <label htmlFor="promotionCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Mã khuyến mãi (tùy chọn)
                  </label>
                  <Input
                    name="promotionCode"
                    id="promotionCode"
                    placeholder="VD: WELCOME10"
                    className="w-full"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Phương thức thanh toán</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <span className="text-blue-900">PayOS - Thanh toán trực tuyến an toàn</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    Hỗ trợ thanh toán qua thẻ ATM, Visa, MasterCard, QR Code
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Lưu ý:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Đơn hàng sẽ được xử lý sau khi thanh toán thành công</li>
                    <li>• Thời gian giao hàng: 2-5 ngày làm việc</li>
                    <li>• Miễn phí vận chuyển cho đơn hàng trên 500.000đ</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Tiến hành thanh toán
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

