'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSalesAnalytics } from '@/lib/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';

export function SalesAnalytics() {
  const { data: analytics, isLoading } = useSalesAnalytics();

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(cents);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Phân tích doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân tích doanh thu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
              <p className="text-2xl font-bold">
                {formatCurrency(analytics?.totalSales || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tăng trưởng</p>
              <p className="text-2xl font-bold text-green-600">
                +{analytics?.salesGrowth || 0}%
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
              <p className="text-xl font-semibold">
                {analytics?.totalOrders || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Giá trị đơn trung bình</p>
              <p className="text-xl font-semibold">
                {formatCurrency(analytics?.averageOrderValue || 0)}
              </p>
            </div>
          </div>

          {/* Placeholder for chart */}
          <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Biểu đồ doanh thu</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


