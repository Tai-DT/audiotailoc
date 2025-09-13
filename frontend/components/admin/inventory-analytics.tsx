'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInventoryAnalytics } from '@/lib/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';

export function InventoryAnalytics() {
  const { data: analytics, isLoading } = useInventoryAnalytics();

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
          <CardTitle>Phân tích tồn kho</CardTitle>
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
        <CardTitle>Phân tích tồn kho</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
              <p className="text-2xl font-bold">
                {analytics?.totalProducts || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Giá trị tồn kho</p>
              <p className="text-2xl font-bold">
                {formatCurrency(analytics?.stockValue || 0)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Hết hàng</p>
              <p className="text-xl font-semibold text-red-600">
                {analytics?.outOfStockItems || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Sắp hết hàng</p>
              <p className="text-xl font-semibold text-orange-600">
                {analytics?.lowStockItems || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Vòng quay kho</p>
              <p className="text-xl font-semibold">
                {analytics?.inventoryTurnover || 0}x
              </p>
            </div>
          </div>

          {/* Stock Alerts */}
          <div>
            <p className="text-sm font-medium mb-2">Cảnh báo tồn kho</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded">
                <span className="text-sm">Sản phẩm hết hàng</span>
                <Badge variant="destructive" className="text-xs">
                  {analytics?.outOfStockItems || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded">
                <span className="text-sm">Sản phẩm sắp hết hàng</span>
                <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                  {analytics?.lowStockItems || 0}
                </Badge>
              </div>
            </div>
          </div>

          {/* Placeholder for chart */}
          <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Biểu đồ tồn kho</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


