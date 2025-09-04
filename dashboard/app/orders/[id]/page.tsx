import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Separator } from '../../../components/ui/separator';
import { formatPrice, formatDate } from '../../lib/utils';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, RefreshCw, Truck, CreditCard, MapPin, Phone, Mail, User } from 'lucide-react';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  productId?: string;
};

type Order = {
  id: string;
  orderNo: string;
  status: string;
  totalCents: number;
  subtotalCents?: number;
  taxCents?: number;
  shippingCents?: number;
  createdAt: string;
  updatedAt: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  items: OrderItem[];
};

async function fetchOrder(id: string): Promise<Order> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  const res = await fetch(`${base}/orders/${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải đơn hàng');
  return (await res.json()) as Order;
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'paid':
      return <CreditCard className="h-4 w-4" />;
    case 'fulfilled':
      return <CheckCircle className="h-4 w-4" />;
    case 'cancelled':
    case 'refunded':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'paid':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'fulfilled':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'refunded':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function OrderHeader({ order }: { order: Order }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Đơn hàng {order.orderNo}</h1>
          <p className="text-gray-600">Đặt ngày {formatDate(order.createdAt)}</p>
        </div>
      </div>
      <Badge variant="outline" className={`${getStatusColor(order.status)} border`}>
        <span className="flex items-center gap-1">
          {getStatusIcon(order.status)}
          {order.status}
        </span>
      </Badge>
    </div>
  );
}

function CustomerInfo({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Thông tin khách hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{order.customerName || 'N/A'}</span>
        </div>
        {order.customerEmail && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{order.customerEmail}</span>
          </div>
        )}
        {order.customerPhone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{order.customerPhone}</span>
          </div>
        )}
        {order.shippingAddress && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
            <span>{order.shippingAddress}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OrderItems({ items }: { items: OrderItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết sản phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead className="text-right">Số lượng</TableHead>
              <TableHead className="text-right">Đơn giá</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.productId && (
                      <div className="text-sm text-gray-500">ID: {item.productId}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{formatPrice(item.unitPrice)}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(item.unitPrice * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function OrderSummary({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tóm tắt đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {order.subtotalCents && (
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span>{formatPrice(order.subtotalCents)}</span>
          </div>
        )}
        {order.shippingCents && order.shippingCents > 0 && (
          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span>{formatPrice(order.shippingCents)}</span>
          </div>
        )}
        {order.taxCents && order.taxCents > 0 && (
          <div className="flex justify-between">
            <span>Thuế:</span>
            <span>{formatPrice(order.taxCents)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Tổng cộng:</span>
          <span>{formatPrice(order.totalCents)}</span>
        </div>
        {order.paymentMethod && (
          <>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Phương thức thanh toán:
              </span>
              <span>{order.paymentMethod}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function OrderActions({ order }: { order: Order }) {
  async function updateStatus(formData: FormData) {
    'use server';
    const status = String(formData.get('status') || '');
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const res = await fetch(`${base}/orders/${encodeURIComponent(order.id)}/status/${encodeURIComponent(status)}`, {
      method: 'PATCH'
    });
    if (!res.ok) {
      throw new Error('Cập nhật thất bại');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hành động</CardTitle>
        <CardDescription>Cập nhật trạng thái đơn hàng</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updateStatus} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Trạng thái mới</label>
            <Select name="status" defaultValue={order.status}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="PAID">Đã thanh toán</SelectItem>
                <SelectItem value="FULFILLED">Đã hoàn thành</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Cập nhật trạng thái
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;

  let order: Order;
  try {
    order = await fetchOrder(p.id);
  } catch (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Đơn hàng không tồn tại</h1>
            <p className="text-gray-600">Không thể tải thông tin đơn hàng</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <XCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
              <p className="text-gray-500">Đơn hàng có thể đã bị xóa hoặc không tồn tại.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrderHeader order={order} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CustomerInfo order={order} />
          <OrderItems items={order.items} />
        </div>
        <div className="space-y-6">
          <OrderSummary order={order} />
          <OrderActions order={order} />
        </div>
      </div>
    </div>
  );
}

