'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/lib/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Eye } from 'lucide-react';

export function RecentOrders() {
  const { data: ordersData, isLoading } = useOrders({ 
    page: 1, 
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(cents);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'secondary' as const, text: 'Chờ xử lý' },
      PROCESSING: { variant: 'default' as const, text: 'Đang xử lý' },
      COMPLETED: { variant: 'default' as const, text: 'Hoàn thành' },
      CANCELLED: { variant: 'destructive' as const, text: 'Đã hủy' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { 
      variant: 'secondary' as const, 
      text: status 
    };
    
    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const orders = ordersData?.items || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Đơn hàng gần đây</CardTitle>
        <Button variant="outline" size="sm">
          Xem tất cả
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không có đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">#{order.orderNo}</p>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.user.name || order.user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                
                <div className="text-right space-y-1">
                  <p className="font-semibold">
                    {formatCurrency(order.totalCents)}
                  </p>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


