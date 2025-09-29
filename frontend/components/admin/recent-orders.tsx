'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/lib/hooks/use-api';
import { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Eye, ShoppingCart, Clock, User } from 'lucide-react';

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'secondary' as const, text: 'Chờ xử lý', color: 'text-yellow-700' },
      PROCESSING: { variant: 'default' as const, text: 'Đang xử lý', color: 'text-blue-700' },
      COMPLETED: { variant: 'default' as const, text: 'Hoàn thành', color: 'text-green-700' },
      CANCELLED: { variant: 'destructive' as const, text: 'Đã hủy', color: 'text-red-700' },
      PAID: { variant: 'default' as const, text: 'Đã thanh toán', color: 'text-green-700' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { 
      variant: 'secondary' as const, 
      text: status,
      color: 'text-muted-foreground'
    };
    
    return (
      <Badge variant={config.variant} className={config.color}>
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
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <CardTitle>Đơn hàng gần đây</CardTitle>
            {ordersData && (
              <Badge variant="outline" className="ml-2">
                {ordersData.total}
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders" className="gap-1">
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">Không có đơn hàng nào</p>
            <p className="text-xs text-muted-foreground">Đơn hàng mới sẽ hiển thị tại đây</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: Order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 hover:shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">#{order.orderNo || order.id.slice(-8)}</p>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{order.user?.name || order.user?.email || 'Khách hàng'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {order.items?.length || 0} sản phẩm • {order.shippingAddress}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <p className="font-semibold text-lg">
                    {formatCurrency(order.totalCents / 100)}
                  </p>
                  
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {orders.length >= 10 && (
              <div className="pt-4 border-t">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/admin/orders">
                    Xem tất cả {ordersData?.total || 'các'} đơn hàng
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


