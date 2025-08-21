import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: { name: string; slug: string; imageUrl?: string | null };
};

export default async function CartPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/cart`, { cache: 'no-store', headers: {} });
  if (!res.ok) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Giỏ hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 py-8">
              Vui lòng đăng nhập để xem giỏ hàng.
            </p>
            <div className="text-center">
              <Button asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  const data = (await res.json()) as { items: (CartItem & { product: any })[]; subtotalCents: number };

  async function updateItem(formData: FormData) {
    'use server';
    const id = String(formData.get('id') || '');
    const qty = parseInt(String(formData.get('quantity') || '1'), 10) || 1;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const { cookies } = await import('next/headers');
    const c = await cookies();
    const token = c.get('accessToken')?.value;
    await fetch(`${base}/cart/items/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ quantity: qty }),
    });
  }

  async function removeItem(formData: FormData) {
    'use server';
    const id = String(formData.get('id') || '');
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const { cookies } = await import('next/headers');
    const c = await cookies();
    const token = c.get('accessToken')?.value;
    await fetch(`${base}/cart/items/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Giỏ hàng</h1>
        <Link href="/products" className="text-blue-600 hover:text-blue-800 transition-colors">
          ← Tiếp tục mua sắm
        </Link>
      </div>

      {data.items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold mb-2">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-600 mb-6">Hãy thêm một số sản phẩm tuyệt vời vào giỏ hàng của bạn!</p>
            <Button asChild>
              <Link href="/products">Khám phá sản phẩm</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm trong giỏ ({data.items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.items.map((it) => (
                  <div key={it.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center relative overflow-hidden">
                      {it.product?.imageUrl ? (
                        <Image
                          src={it.product.imageUrl}
                          alt={it.product.name}
                          fill
                          className="object-cover rounded-md"
                          sizes="64px"
                        />
                      ) : (
                        <span className="text-gray-400">🎵</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">
                        <Link href={`/products/${it.product?.slug}`} className="hover:text-blue-600">
                          {it.product?.name || it.productId}
                        </Link>
                      </h3>
                      <p className="text-lg font-bold text-blue-600">
                        {(it.unitPrice / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <form action={updateItem} className="flex items-center space-x-2">
                        <input type="hidden" name="id" value={it.id} />
                        <Input
                          type="number"
                          name="quantity"
                          min={0}
                          defaultValue={it.quantity}
                          className="w-20"
                        />
                        <Button type="submit" variant="outline" size="sm">
                          Cập nhật
                        </Button>
                      </form>

                      <form action={removeItem}>
                        <input type="hidden" name="id" value={it.id} />
                        <Button type="submit" variant="destructive" size="sm">
                          Xóa
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Tạm tính:</span>
                  <span className="font-bold">
                    {(data.subtotalCents / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <hr />
                <div className="flex justify-between text-xl font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">
                    {(data.subtotalCents / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </span>
                </div>
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">Tiến hành thanh toán</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

