'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/ui/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Package,
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  Edit
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';

interface Order {
  id: string;
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  totalCents: number;
  items: Array<{
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    priceCents: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(selectedStatus && { status: selectedStatus }),
      });

      const response = await fetch(`/api/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status/${newStatus}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        toast.success('Cập nhật trạng thái thành công');
        fetchOrders();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Cập nhật trạng thái thất bại');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'Chờ xử lý', variant: 'secondary' as const, icon: Clock },
      CONFIRMED: { label: 'Đã xác nhận', variant: 'default' as const, icon: CheckCircle },
      SHIPPING: { label: 'Đang giao hàng', variant: 'default' as const, icon: Truck },
      COMPLETED: { label: 'Hoàn thành', variant: 'default' as const, icon: CheckCircle },
      CANCELLED: { label: 'Đã hủy', variant: 'destructive' as const, icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getStatusOptions = (currentStatus: string) => {
    const allStatuses = ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'];
    const statusFlow = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['SHIPPING', 'CANCELLED'],
      SHIPPING: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    return statusFlow[currentStatus as keyof typeof statusFlow] || [];
  };

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Mã đơn hàng',
      render: (value) => (
        <span className="font-mono text-sm">#{value.slice(-8)}</span>
      ),
    },
    {
      key: 'customerName',
      header: 'Khách hàng',
      render: (value, item) => (
        <div>
          <div className="font-medium">{value || 'Khách vãng lai'}</div>
          <div className="text-sm text-gray-500">{item.customerEmail}</div>
        </div>
      ),
    },
    {
      key: 'totalCents',
      header: 'Tổng tiền',
      sortable: true,
      render: (value) => formatPrice(value),
    },
    {
      key: 'items',
      header: 'Sản phẩm',
      render: (value: Order['items']) => (
        <div className="flex items-center gap-2">
          <span>{value.length} sản phẩm</span>
          <div className="flex -space-x-2">
            {value.slice(0, 3).map((item, index) => (
              <div key={index} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    width={24}
                    height={24}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Package className="w-3 h-3" />
                )}
              </div>
            ))}
            {value.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium">
                +{value.length - 3}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (value, item) => (
        <Select
          value={value}
          onValueChange={(newStatus) => handleStatusChange(item.id, newStatus)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {getStatusOptions(value).map((status) => (
              <SelectItem key={status} value={status}>
                {getStatusBadge(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'createdAt',
      header: 'Ngày đặt',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ];

  const stats = [
    {
      title: 'Tổng đơn hàng',
      value: total.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      title: 'Chờ xử lý',
      value: orders.filter(o => o.status === 'PENDING').length.toString(),
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Đang giao hàng',
      value: orders.filter(o => o.status === 'SHIPPING').length.toString(),
      icon: Truck,
      color: 'text-purple-600',
    },
    {
      title: 'Hoàn thành',
      value: orders.filter(o => o.status === 'COMPLETED').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
    },
  ];

  const totalRevenue = orders
    .filter(order => order.status === 'COMPLETED')
    .reduce((sum, order) => sum + order.totalCents, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Xem và cập nhật trạng thái đơn hàng</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                <SelectItem value="SHIPPING">Đang giao hàng</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSelectedStatus('')}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={orders}
            columns={columns}
            loading={loading}
            onView={(order) => {
              setSelectedOrder(order);
              setShowOrderDetail(true);
            }}
            pagination={{
              page: currentPage,
              pageSize,
              total,
              onPageChange: setCurrentPage,
              onPageSizeChange: setPageSize,
            }}
            emptyMessage="Không có đơn hàng nào"
          />
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Chi tiết đơn hàng #{selectedOrder.id.slice(-8)}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOrderDetail(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
                    <p><strong>Tên:</strong> {selectedOrder.customerName || 'Khách vãng lai'}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerEmail || 'N/A'}</p>
                    <p><strong>SĐT:</strong> {selectedOrder.customerPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Thông tin đơn hàng</h3>
                    <p><strong>Trạng thái:</strong> {getStatusBadge(selectedOrder.status)}</p>
                    <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Tổng tiền:</strong> {formatPrice(selectedOrder.totalCents)}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-medium mb-2">Địa chỉ giao hàng</h3>
                  <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-medium mb-4">Sản phẩm</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex gap-3 p-3 border rounded">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          {item.productImage ? (
                            <Image
                              src={item.productImage}
                              alt={item.productName}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Package className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-gray-600">
                            Số lượng: {item.quantity} × {formatPrice(item.priceCents)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.quantity * item.priceCents)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-medium mb-2">Ghi chú</h3>
                    <p className="text-gray-600">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}