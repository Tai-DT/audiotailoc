'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useDashboardOverview } from '@/lib/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardOverview() {
  const { data: dashboard, isLoading } = useDashboardOverview();

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(cents);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const overviewCards = [
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(dashboard?.overview.totalRevenue || 0),
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      description: 'So với tháng trước'
    },
    {
      title: 'Tổng đơn hàng',
      value: formatNumber(dashboard?.overview.totalOrders || 0),
      change: '+8.2%',
      trend: 'up' as const,
      icon: ShoppingCart,
      description: 'So với tháng trước'
    },
    {
      title: 'Khách hàng',
      value: formatNumber(dashboard?.overview.totalUsers || 0),
      change: '+15.3%',
      trend: 'up' as const,
      icon: Users,
      description: 'Tổng số người dùng'
    },
    {
      title: 'Sản phẩm',
      value: formatNumber(dashboard?.overview.totalProducts || 0),
      change: '+3.1%',
      trend: 'up' as const,
      icon: Package,
      description: 'Sản phẩm trong kho'
    }
  ];

  const recentStats = [
    {
      title: 'Đơn hàng mới',
      value: dashboard?.overview.newOrders || 0,
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Khách hàng mới',
      value: dashboard?.overview.newUsers || 0,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Đơn chờ xử lý',
      value: dashboard?.overview.pendingOrders || 0,
      icon: ShoppingCart,
      color: 'text-orange-600'
    },
    {
      title: 'Sản phẩm sắp hết',
      value: dashboard?.overview.lowStockProducts || 0,
      icon: Package,
      color: 'text-red-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {card.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <span className={card.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {card.change}
                </span>
                <span>{card.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recentStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hành động nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors">
              <Package className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Thêm sản phẩm</span>
            </button>
            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Xem khách hàng</span>
            </button>
            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors">
              <ShoppingCart className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Đơn hàng mới</span>
            </button>
            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors">
              <DollarSign className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Báo cáo doanh thu</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


