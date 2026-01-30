'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSalesAnalytics } from '@/lib/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

export function SalesAnalytics() {
 const [period, setPeriod] = useState('7d');
 const [startDate, setStartDate] = useState<string>();
 const [endDate, setEndDate] = useState<string>();
  const { data: analytics, isLoading } = useSalesAnalytics({
 startDate,
 endDate
 });

 // Set date ranges based on period selection
 React.useEffect(() => {
 const now = new Date();
 const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
 const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  setStartDate(start.toISOString().split('T')[0]);
 setEndDate(now.toISOString().split('T')[0]);
 }, [period]);

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
 <div className="flex items-center justify-between">
 <CardTitle className="flex items-center gap-2">
 <TrendingUp className="h-5 w-5" />
 Phân tích doanh thu
 </CardTitle>
 <div className="flex items-center gap-2">
 <Calendar className="h-4 w-4 text-muted-foreground" />
 <Select value={period} onValueChange={setPeriod}>
 <SelectTrigger className="w-32">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="7d">7 ngày</SelectItem>
 <SelectItem value="30d">30 ngày</SelectItem>
 <SelectItem value="90d">90 ngày</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 </CardHeader>
 <CardContent>
 <div className="space-y-6">
 {/* Key Metrics Grid */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 <div className="text-center p-4 bg-muted/50 rounded-lg">
 <p className="text-sm text-muted-foreground mb-1">Tổng doanh thu</p>
 <p className="text-2xl font-bold">
 {formatCurrency(analytics?.totalSales || 0)}
 </p>
 </div>
 <div className="text-center p-4 bg-muted/50 rounded-lg">
 <div className="flex items-center justify-center gap-1 mb-1">
 <p className="text-sm text-muted-foreground">Tăng trưởng</p>
 {(analytics?.salesGrowth || 0) >= 0 ? (
 <TrendingUp className="h-3 w-3 text-success" />
 ) : (
 <TrendingDown className="h-3 w-3 text-destructive" />
 )}
 </div>
 <p className={`text-2xl font-bold ${
 (analytics?.salesGrowth || 0) >= 0 ? 'text-success' : 'text-destructive'
 }`}>
 {analytics?.salesGrowth || 0}%
 </p>
 </div>
 <div className="text-center p-4 bg-muted/50 rounded-lg">
 <p className="text-sm text-muted-foreground mb-1">Tổng đơn hàng</p>
 <p className="text-2xl font-bold">
 {analytics?.totalOrders || 0}
 </p>
 </div>
 <div className="text-center p-4 bg-muted/50 rounded-lg">
 <p className="text-sm text-muted-foreground mb-1">Đơn trung bình</p>
 <p className="text-2xl font-bold">
 {formatCurrency(analytics?.averageOrderValue || 0)}
 </p>
 </div>
 </div>

 {/* Sales Chart Placeholder */}
 <div className="space-y-4">
 <h4 className="font-medium">Biểu đồ doanh thu theo thời gian</h4>
 <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
 <div className="text-center text-muted-foreground">
 <TrendingUp className="h-12 w-12 mx-auto mb-2" />
 <p className="text-sm">Biểu đồ doanh thu sẽ hiển thị tại đây</p>
 <p className="text-xs">Cần tích hợp thư viện chart (như Recharts)</p>
 </div>
 </div>
 </div>

 {/* Top Products */}
 {analytics?.topSellingProducts && analytics.topSellingProducts.length > 0 && (
 <div className="space-y-4">
 <h4 className="font-medium">Sản phẩm bán chạy nhất</h4>
 <div className="space-y-2">
 {analytics.topSellingProducts.map((product, index) => (
 <div key={product.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
 {index + 1}
 </div>
 <div>
 <p className="font-medium truncate max-w-48">{product.name}</p>
 <p className="text-sm text-muted-foreground">{product.sales} đã bán</p>
 </div>
 </div>
 <div className="text-right">
 <p className="font-medium">{formatCurrency(product.revenue)}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 </CardContent>
 </Card>
 );
}


