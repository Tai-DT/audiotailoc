'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomerAnalytics, useUserStats } from '@/lib/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserPlus, UserCheck, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

export function CustomerAnalytics() {
 const [period, setPeriod] = useState(30);
 const [startDate, setStartDate] = useState<string>();
 const [endDate, setEndDate] = useState<string>();
  const { data: analytics, isLoading: isLoadingAnalytics } = useCustomerAnalytics({
 startDate,
 endDate
 });
 const { data: userStats, isLoading: isLoadingStats } = useUserStats(period);

 const isLoading = isLoadingAnalytics || isLoadingStats;

 // Set date ranges based on period selection
 React.useEffect(() => {
 const now = new Date();
 const start = new Date(now.getTime() - period * 24 * 60 * 60 * 1000);
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
 <div className="flex items-center justify-between">
 <CardTitle className="flex items-center gap-2">
 <Users className="h-5 w-5" />
 Phân tích khách hàng
 </CardTitle>
 <div className="flex items-center gap-2">
 <Calendar className="h-4 w-4 text-muted-foreground" />
 <Select value={period.toString()} onValueChange={(value) => setPeriod(parseInt(value))}>
 <SelectTrigger className="w-32">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="7">7 ngày</SelectItem>
 <SelectItem value="30">30 ngày</SelectItem>
 <SelectItem value="90">90 ngày</SelectItem>
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
 <div className="flex items-center justify-center gap-1 mb-2">
 <Users className="h-4 w-4 text-primary" />
 <p className="text-sm text-muted-foreground">Tổng khách hàng</p>
 </div>
 <p className="text-2xl font-bold">
 {userStats?.totalUsers || 0}
 </p>
 </div>
 <div className="text-center p-4 bg-muted/50 rounded-lg">
 <div className="flex items-center justify-center gap-1 mb-2">
 <UserPlus className="h-4 w-4 text-success" />
 <p className="text-sm text-muted-foreground">Khách hàng mới</p>
 </div>
 <p className="text-2xl font-bold text-success">
 {analytics?.newCustomers || 0}
 </p>
 </div>
 <div className="text-center p-4 bg-muted/50 rounded-lg">
 <div className="flex items-center justify-center gap-1 mb-2">
 <UserCheck className="h-4 w-4 text-warning" />
 <p className="text-sm text-muted-foreground">Hoạt động</p>
 </div>
 <p className="text-2xl font-bold">
 {userStats?.activeUsers || 0}
 </p>
 </div>
 <div className="text-center p-4 bg-muted/50 rounded-lg">
 <div className="flex items-center justify-center gap-1 mb-2">
 <TrendingUp className="h-4 w-4 text-purple-600" />
 <p className="text-sm text-muted-foreground">Giá trị CLV</p>
 </div>
 <p className="text-2xl font-bold">
 {formatCurrency(analytics?.customerLifetimeValue || 0)}
 </p>
 </div>
 </div>

 {/* Engagement Metrics */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 <div className="space-y-4">
 <h4 className="font-medium">Hiệu suất khách hàng</h4>
 <div className="space-y-3">
 <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
 <span className="text-sm">Tỷ lệ giữ chân</span>
 <div className="flex items-center gap-2">
 <TrendingUp className="h-4 w-4 text-success" />
 <span className="font-medium text-success">
 {analytics?.retentionRate || 85}%
 </span>
 </div>
 </div>
 <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
 <span className="text-sm">Tỷ lệ rời bỏ</span>
 <div className="flex items-center gap-2">
 <TrendingDown className="h-4 w-4 text-destructive" />
 <span className="font-medium text-destructive">
 {analytics?.churnRate || 15}%
 </span>
 </div>
 </div>
 <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
 <span className="text-sm">Khách quay lại</span>
 <span className="font-medium">
 {analytics?.returningCustomers || 0}
 </span>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <h4 className="font-medium">Phân bố theo vai trò</h4>
 <div className="space-y-3">
 {userStats?.usersByRole && Object.entries(userStats.usersByRole).map(([role, count]) => (
 <div key={role} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
 <span className="text-sm capitalize">
 {role === 'USER' ? 'Người dùng' :  role === 'ADMIN' ? 'Quản trị viên' :  role === 'MODERATOR' ? 'Điều hành viên' : role}
 </span>
 <span className="font-medium">{count}</span>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Customer Growth Chart Placeholder */}
 <div className="space-y-4">
 <h4 className="font-medium">Biểu đồ tăng trưởng khách hàng</h4>
 <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
 <div className="text-center text-muted-foreground">
 <Users className="h-12 w-12 mx-auto mb-2" />
 <p className="text-sm">Biểu đồ khách hàng sẽ hiển thị tại đây</p>
 <p className="text-xs">Hiển thị xu hướng tăng trưởng theo thời gian</p>
 </div>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>
 );
}


