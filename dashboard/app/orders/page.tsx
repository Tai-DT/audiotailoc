import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { formatPrice, formatDate } from '../lib/utils';
import { ArrowLeft, ArrowRight, Eye, Package, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

type Order = {
  id: string;
  orderNo: string;
  status: string;
  totalCents: number;
  createdAt: string;
  customerEmail?: string;
  customerName?: string;
};

async function fetchOrders(params: { page?: number; pageSize?: number; status?: string }) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  const u = new URL(`${base}/orders`);
  if (params.page) u.searchParams.set('page', String(params.page));
  if (params.pageSize) u.searchParams.set('pageSize', String(params.pageSize));
  if (params.status) u.searchParams.set('status', params.status);
  const res = await fetch(u.toString(), { cache: 'no-store', headers: {} });
  if (!res.ok) throw new Error('Không thể tải đơn hàng');
  return (await res.json()) as { total: number; page: number; pageSize: number; items: Order[] };
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'paid':
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

function OrderFilters({ currentStatus }: { currentStatus: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bộ lọc đơn hàng</CardTitle>
        <CardDescription>Lọc đơn hàng theo trạng thái</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Trạng thái</label>
            <Select name="status" defaultValue={currentStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="PAID">Đã thanh toán</SelectItem>
                <SelectItem value="FULFILLED">Đã hoàn thành</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">
            <RefreshCw className="h-4 w-4 mr-2" />
            Áp dụng
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách đơn hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Tổng tiền</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNo}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customerName || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail || 'N/A'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(order.status)} border`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(order.totalCents)}
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/orders/${order.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Chi tiết
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function Pagination({
  currentPage,
  totalPages,
  status
}: {
  currentPage: number;
  totalPages: number;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Trang {currentPage} / {totalPages}
      </div>
      <div className="flex gap-2">
        {currentPage > 1 ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/orders?page=${currentPage - 1}&status=${encodeURIComponent(status)}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Trước
            </Link>
          </Button>
        ) : null}
        {currentPage < totalPages ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/orders?page=${currentPage + 1}&status=${encodeURIComponent(status)}`}>
              Sau
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(String(sp?.page ?? '1'), 10) || 1);
  const status = sp?.status ?? '';
  const pageSize = 20;

  let data;
  try {
    data = await fetchOrders({ page, pageSize, status: status || undefined });
  } catch (error) {
    data = { total: 0, page: 1, pageSize: 20, items: [] };
  }

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Xem và quản lý tất cả đơn hàng của cửa hàng</p>
        </div>
      </div>

      <OrderFilters currentStatus={status} />

      {data.items.length > 0 ? (
        <>
          <OrdersTable orders={data.items} />
          <Pagination currentPage={page} totalPages={totalPages} status={status} />
        </>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-gray-500">
                {status ? `Không có đơn hàng nào với trạng thái "${status}"` : 'Chưa có đơn hàng nào được tạo.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

