'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { formatPrice } from '../lib/utils';
import { useDashboard } from '../hooks/useDashboard';
import { RefreshCw, TrendingUp, ShoppingCart, Users, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import AdminNotice from '../AdminNotice';

interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    totalCents?: number;
    createdAt: string;
    status?: string;
  }>;
}

function DashboardCards({ data }: { data: DashboardData }) {
  const cards = [
    {
      title: 'Tổng sản phẩm',
      value: data.totalProducts.toLocaleString('vi-VN'),
      icon: TrendingUp,
      description: 'Sản phẩm trong kho',
      color: 'text-blue-600',
    },
    {
      title: 'Tổng đơn hàng',
      value: data.totalOrders.toLocaleString('vi-VN'),
      icon: ShoppingCart,
      description: 'Đơn hàng đã tạo',
      color: 'text-green-600',
    },
    {
      title: 'Tổng khách hàng',
      value: data.totalUsers.toLocaleString('vi-VN'),
      icon: Users,
      description: 'Người dùng đăng ký',
      color: 'text-purple-600',
    },
    {
      title: 'Doanh thu',
      value: formatPrice(data.totalRevenue),
      icon: DollarSign,
      description: 'Tổng doanh thu',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentOrders({ orders }: { orders: DashboardData['recentOrders'] }) {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng gần đây</CardTitle>
          <CardDescription>5 đơn hàng mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">Chưa có đơn hàng nào</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng gần đây</CardTitle>
        <CardDescription>5 đơn hàng mới nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium text-sm">#{order.id.slice(-8)}</p>
                <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right space-y-1">
                {order.totalCents && (
                  <p className="font-semibold text-sm">{formatPrice(order.totalCents)}</p>
                )}
                {order.status && (
                  <p className={`text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardContentProps {
  isAdmin?: boolean;
}

export default function DashboardContent({ isAdmin = false }: DashboardContentProps) {
  const { data, loading, error, refetch } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Tổng quan hoạt động cửa hàng Audio Tài Lộc</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải...</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Tổng quan hoạt động cửa hàng Audio Tài Lộc</p>
          </div>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Tổng quan hoạt động cửa hàng Audio Tài Lộc</p>
          </div>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tải lại
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Không thể tải dữ liệu dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hoạt động cửa hàng Audio Tài Lộc</p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Admin Notice */}
      {!isAdmin && (
        <AdminNotice>Đây là khu vực quản trị. Bạn đang ở chế độ xem chỉ đọc.</AdminNotice>
      )}

      {/* Dashboard Cards */}
      <DashboardCards data={data} />

      {/* Recent Orders */}
      <RecentOrders orders={data.recentOrders} />
    </div>
  );
}
