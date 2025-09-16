'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomerAnalytics } from '@/lib/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';

export function CustomerAnalytics() {
  const { data: analytics, isLoading } = useCustomerAnalytics();

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
          <CardTitle>Phân tích khách hàng</CardTitle>
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
        <CardTitle>Phân tích khách hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tổng khách hàng</p>
              <p className="text-2xl font-bold">
                {analytics?.totalCustomers || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Khách hàng mới</p>
              <p className="text-2xl font-bold text-green-600">
                {analytics?.newCustomers || 0}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Khách quay lại</p>
              <p className="text-xl font-semibold">
                {analytics?.returningCustomers || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Giá trị khách hàng</p>
              <p className="text-xl font-semibold">
                {formatCurrency(analytics?.customerLifetimeValue || 0)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tỷ lệ giữ chân</p>
              <p className="text-xl font-semibold text-green-600">
                {analytics?.retentionRate || 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tỷ lệ rời bỏ</p>
              <p className="text-xl font-semibold text-red-600">
                {analytics?.churnRate || 0}%
              </p>
            </div>
          </div>

          {/* Placeholder for chart */}
          <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Biểu đồ khách hàng</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


