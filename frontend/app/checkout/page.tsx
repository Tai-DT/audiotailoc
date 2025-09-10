'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useCartStore } from '@/lib/store';
import { api } from '@/lib/api-client';

const CheckoutSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ tên hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(9, 'Số điện thoại không hợp lệ'),
  province: z.string().min(1, 'Vui lòng chọn Tỉnh/TP'),
  district: z.string().min(1, 'Vui lòng nhập Quận/Huyện'),
  ward: z.string().min(1, 'Vui lòng nhập Phường/Xã'),
  address: z.string().min(5, 'Vui lòng nhập địa chỉ chi tiết'),
  paymentMethod: z.enum(['COD', 'PAYOS']).default('COD')
});

type CheckoutFormValues = z.infer<typeof CheckoutSchema>;

function formatVND(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const [submitting, setSubmitting] = useState(false);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it: any) => sum + (Number(it.price) * Number(it.quantity)), 0);
  }, [items]);
  const shippingFee = 0; // miễn phí giao hàng cho dev demo
  const total = subtotal + shippingFee;

  const form = useForm({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      province: '',
      district: '',
      ward: '',
      address: '',
      paymentMethod: 'COD'
    }
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }
    setSubmitting(true);
    try {
      const orderPayload: any = {
        customer: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
        },
        shippingAddress: {
          fullName: values.fullName,
          phoneNumber: values.phone,
          province: values.province,
          district: values.district,
          ward: values.ward,
          streetAddress: values.address,
        },
        paymentMethod: values.paymentMethod,
        items: items.map((it: any) => ({ productId: it.productId ?? it.id, quantity: it.quantity })),
        totals: {
          subtotal,
          shipping: shippingFee,
          total,
        },
      };

      const res = await api.orders.create(orderPayload);
      if (res.success && res.data) {
        const orderId = res.data.id || res.data.orderId;
        
        // Xử lý thanh toán
        if (values.paymentMethod === 'PAYOS') {
          try {
            const paymentRes = await api.payment.createIntent({
              orderId,
              provider: 'PAYOS',
              idempotencyKey: `order_${orderId}_${Date.now()}`,
              returnUrl: `${window.location.origin}/payment/success`
            });
            
            if (paymentRes.success && paymentRes.data?.redirectUrl) {
              toast.success('Đang chuyển đến trang thanh toán...');
              window.location.href = paymentRes.data.redirectUrl;
              return;
            } else {
              toast.error('Không thể tạo liên kết thanh toán');
            }
          } catch (err) {
            toast.error('Lỗi khi tạo thanh toán PayOS');
          }
        } else if (values.paymentMethod === 'COD') {
          // COD - xác nhận đơn hàng
          await api.payment.createIntent({
            orderId,
            provider: 'COD',
            idempotencyKey: `order_${orderId}_${Date.now()}`
          });
        }
        
        // COD hoặc PayOS failed, chuyển đến trang success
        toast.success('Đặt hàng thành công');
        router.push(`/checkout/success?id=${encodeURIComponent(orderId)}`);
      } else {
        toast.error(res.message || 'Không thể tạo đơn hàng');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Lỗi khi tạo đơn hàng');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin nhận hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Họ tên</Label>
                    <Input id="fullName" {...form.register('fullName')} placeholder="Nguyễn Văn A" />
                    {form.formState.errors.fullName && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" {...form.register('phone')} placeholder="09xxxxxxxx" />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...form.register('email')} placeholder="ban@vidu.com" />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="province">Tỉnh/Thành phố</Label>
                    <Input id="province" {...form.register('province')} placeholder="TP. Hồ Chí Minh" />
                    {form.formState.errors.province && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.province.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="district">Quận/Huyện</Label>
                    <Input id="district" {...form.register('district')} placeholder="Quận 1" />
                    {form.formState.errors.district && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.district.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="ward">Phường/Xã</Label>
                    <Input id="ward" {...form.register('ward')} placeholder="Phường Bến Nghé" />
                    {form.formState.errors.ward && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.ward.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input id="address" {...form.register('address')} placeholder="Số 1, Nguyễn Huệ" />
                  {form.formState.errors.address && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.address.message}</p>
                  )}
                </div>

                <Separator className="my-2" />

                <div>
                  <Label>Phương thức thanh toán</Label>
                  <div className="mt-2">
                    <Select
                      value={form.watch('paymentMethod')}
onValueChange={(v) => form.setValue('paymentMethod', v as 'COD' | 'PAYOS')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn phương thức" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COD">Thanh toán khi nhận hàng (COD)</SelectItem>
                        <SelectItem value="PAYOS">Thanh toán qua PayOS (Chuyển khoản, QR, Thẻ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? 'Đang xử lý...' : 'Đặt hàng'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-auto pr-1">
                  {items.length === 0 ? (
                    <p className="text-sm text-gray-500">Giỏ hàng trống</p>
                  ) : (
                    items.map((it: any) => (
                      <div key={(it.productId ?? it.id) + '-' + it.quantity} className="flex items-center justify-between">
                        <div className="text-sm">
                          <div className="font-medium line-clamp-1">{it.name || it.product?.name || 'Sản phẩm'}</div>
                          <div className="text-gray-500">x{it.quantity}</div>
                        </div>
                        <div className="text-sm font-medium">{formatVND(Number(it.price) * Number(it.quantity))}</div>
                      </div>
                    ))
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <span>Tạm tính</span>
                  <span className="font-medium">{formatVND(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium">{shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Tổng</span>
                  <span className="text-orange-600">{formatVND(total)}</span>
                </div>

                <Button className="w-full" onClick={() => (document.querySelector('form') as HTMLFormElement)?.requestSubmit()} disabled={submitting || items.length === 0}>
                  {submitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

