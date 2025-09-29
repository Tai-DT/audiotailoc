'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInventoryAnalytics, useProductStats } from '@/lib/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, AlertTriangle, TrendingDown, TrendingUp, BarChart3, Boxes } from 'lucide-react';

export function InventoryAnalytics() {
  const { data: analytics, isLoading: isLoadingAnalytics } = useInventoryAnalytics();
  const { data: productStats, isLoading: isLoadingStats } = useProductStats();

  const isLoading = isLoadingAnalytics || isLoadingStats;

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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Boxes className="h-5 w-5" />
            Phân tích tồn kho
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <BarChart3 className="h-4 w-4" />
            Chi tiết
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Package className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
              </div>
              <p className="text-2xl font-bold">
                {productStats?.totalProducts || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-sm text-muted-foreground">Đang hoạt động</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {productStats?.activeProducts || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-muted-foreground">Sắp hết hàng</p>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {productStats?.lowStockProducts || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-2">
                <TrendingDown className="h-4 w-4 text-purple-600" />
                <p className="text-sm text-muted-foreground">Giá trị kho</p>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(analytics?.stockValue || 0)}
              </p>
            </div>
          </div>

          {/* Stock Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Tình trạng tồn kho</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Hết hàng</span>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {analytics?.outOfStockItems || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Sắp hết hàng</span>
                  </div>
                  <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                    {analytics?.lowStockItems || productStats?.lowStockProducts || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Vòng quay kho</span>
                  </div>
                  <span className="font-medium">{analytics?.inventoryTurnover || 0}x</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Phân bố theo danh mục</h4>
              <div className="space-y-3">
                {productStats?.productsByCategory && Object.entries(productStats.productsByCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm capitalize">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{count}</span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ 
                            width: `${Math.min(100, (count / (productStats?.totalProducts || 1)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {(!productStats?.productsByCategory || Object.keys(productStats.productsByCategory).length === 0) && (
                  <div className="text-center p-4 text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chưa có dữ liệu phân loại</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Movement Chart Placeholder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Biến động tồn kho</h4>
              <Button variant="ghost" size="sm">
                Xem chi tiết
              </Button>
            </div>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
              <div className="text-center text-muted-foreground">
                <Boxes className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Biểu đồ biến động tồn kho sẽ hiển thị tại đây</p>
                <p className="text-xs">Hiển thị xu hướng nhập-xuất kho theo thời gian</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1">
                <Package className="h-3 w-3" />
                Quản lý kho
              </Button>
              <Button size="sm" variant="outline" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Cảnh báo
              </Button>
              <Button size="sm" variant="outline" className="gap-1">
                <BarChart3 className="h-3 w-3" />
                Báo cáo
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


