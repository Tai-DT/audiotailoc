"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { CreditCard, Wallet, QrCode, Truck, Shield, Clock } from 'lucide-react';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  priceCents: number;
  quantity: number;
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
}

interface CheckoutForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingWard: string;
  notes: string;
  paymentMethod: 'VNPAY' | 'MOMO' | 'PAYOS' | 'COD';
}

const paymentMethods = [
  {
    id: 'VNPAY',
    name: 'VNPAY',
    icon: <CreditCard className="h-5 w-5" />,
    description: 'Thanh toán qua thẻ ngân hàng',
    color: 'bg-blue-500'
  },
  {
    id: 'MOMO',
    name: 'MOMO',
    icon: <QrCode className="h-5 w-5" />,
    description: 'Thanh toán qua ví MOMO',
    color: 'bg-pink-500'
  },
  {
    id: 'PAYOS',
    name: 'PAYOS',
    icon: <Wallet className="h-5 w-5" />,
    description: 'Thanh toán qua PayOS',
    color: 'bg-green-500'
  },
  {
    id: 'COD',
    name: 'Thanh toán khi nhận hàng',
    icon: <Truck className="h-5 w-5" />,
    description: 'Thanh toán tiền mặt khi nhận hàng',
    color: 'bg-gray-500'
  }
];

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CheckoutForm>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingDistrict: '',
    shippingWard: '',
    notes: '',
    paymentMethod: 'VNPAY'
  });

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!base) {
          setError('API không khả dụng');
          setLoading(false);
          return;
        }

        const response = await fetch(`${base}/cart`, {
          credentials: 'include'
        });

        if (response.ok) {
          const cartData = await response.json();
          setCart(cartData);
        } else {
          setError('Không thể tải giỏ hàng');
        }
      } catch (error) {
        setError('Lỗi kết nối');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) throw new Error('API không khả dụng');

      // Create order
      const orderResponse = await fetch(`${base}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          shippingAddress: `${formData.shippingAddress}, ${formData.shippingWard}, ${formData.shippingDistrict}, ${formData.shippingCity}`,
          notes: formData.notes,
          items: cart?.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceCents: item.priceCents
          })) || []
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Không thể tạo đơn hàng');
      }

      const orderData = await orderResponse.json();

      // Handle payment based on method
      if (formData.paymentMethod === 'COD') {
        // Cash on delivery - redirect to success page
        router.push(`/orders/${orderData.id}/success`);
      } else {
        // Online payment - create payment intent
        const paymentResponse = await fetch(`${base}/payments/intents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            orderId: orderData.id,
            amountCents: cart?.totalCents || 0,
            provider: formData.paymentMethod,
            returnUrl: `${window.location.origin}/orders/${orderData.id}/success`,
            cancelUrl: `${window.location.origin}/checkout`
          }),
        });

        if (!paymentResponse.ok) {
          throw new Error('Không thể tạo thanh toán');
        }

        const paymentData = await paymentResponse.json();
        
        // Redirect to payment gateway
        if (paymentData.redirectUrl) {
          window.location.href = paymentData.redirectUrl;
        } else {
          router.push(`/orders/${orderData.id}/success`);
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <a href="/cart">
            <Button>Quay lại giỏ hàng</Button>
          </a>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-4">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
          <Link href="/products">
            <Button>Mua sắm ngay</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Thanh toán</h1>
          <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
          <Card>
            <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
                <CardDescription>
                  Điền thông tin để hoàn tất đơn hàng
                </CardDescription>
            </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Họ tên *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="Nhập họ tên"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Số điện thoại *</Label>
                      <Input
                        id="customerPhone"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      placeholder="Nhập email (không bắt buộc)"
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-2">
                    <Label htmlFor="shippingAddress">Địa chỉ *</Label>
                    <Input
                      id="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingWard">Phường/Xã *</Label>
                      <Input
                        id="shippingWard"
                        value={formData.shippingWard}
                        onChange={(e) => handleInputChange('shippingWard', e.target.value)}
                        placeholder="Phường/Xã"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingDistrict">Quận/Huyện *</Label>
                      <Input
                        id="shippingDistrict"
                        value={formData.shippingDistrict}
                        onChange={(e) => handleInputChange('shippingDistrict', e.target.value)}
                        placeholder="Quận/Huyện"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingCity">Tỉnh/Thành phố *</Label>
                      <Input
                        id="shippingCity"
                        value={formData.shippingCity}
                        onChange={(e) => handleInputChange('shippingCity', e.target.value)}
                        placeholder="Tỉnh/Thành phố"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                      rows={3}
                    />
                </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <Label>Phương thức thanh toán *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            formData.paymentMethod === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleInputChange('paymentMethod', method.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full text-white ${method.color}`}>
                              {method.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold">{method.name}</h3>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                </div>
                </div>
                      ))}
                </div>
              </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={processing}
                  >
                    {processing ? 'Đang xử lý...' : `Thanh toán ${formatPrice(cart.totalCents)}`}
                  </Button>
                </form>
            </CardContent>
          </Card>
        </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
          <Card>
            <CardHeader>
                <CardTitle>Đơn hàng của bạn</CardTitle>
            </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.productName}</h4>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.priceCents * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
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
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(cart.totalCents)}</span>
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Thanh toán an toàn</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Giao hàng trong 24-48h</span>
                  </div>
                </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

