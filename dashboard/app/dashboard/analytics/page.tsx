"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Activity,
  RefreshCw,
  Target,
  Zap,
  Clock
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAnalytics } from "@/hooks/use-analytics"

export default function AnalyticsPage() {
  const {
    overview,
    topServices,
    topProducts,
    userActivity,
    loading,
    fetchOverview,
    fetchTrends,
    fetchTopServices,
    fetchTopProducts,
    fetchUserActivity
  } = useAnalytics()

  const [dateRange, setDateRange] = useState("7days")
  const [refreshing, setRefreshing] = useState(false)

  const loadAllData = useCallback(async () => {
    await Promise.all([
      fetchOverview(dateRange),
      fetchTrends(dateRange),
      fetchTopServices(),
      fetchTopProducts(),
      fetchUserActivity(dateRange)
    ])
  }, [dateRange, fetchOverview, fetchTrends, fetchTopServices, fetchTopProducts, fetchUserActivity])

  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await loadAllData()
    } finally {
      setRefreshing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getDateRangeLabel = (range: string) => {
    switch (range) {
      case '7days': return '7 ngày qua'
      case '30days': return '30 ngày qua'
      case '90days': return '3 tháng qua'
      case '1year': return '1 năm qua'
      default: return '7 ngày qua'
    }
  }

  if (loading && !overview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Phân tích & Thống kê</h1>
              <p className="text-muted-foreground">
                Tổng quan về hiệu suất kinh doanh và dữ liệu người dùng
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 ngày qua</SelectItem>
                  <SelectItem value="30days">30 ngày qua</SelectItem>
                  <SelectItem value="90days">3 tháng qua</SelectItem>
                  <SelectItem value="1year">1 năm qua</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview ? formatCurrency(overview.totalRevenue) : '...'}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {overview && overview.revenueGrowth > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  <span className={overview && overview.revenueGrowth > 0 ? "text-green-500" : "text-red-500"}>
                    {overview ? `${overview.revenueGrowth > 0 ? '+' : ''}${overview.revenueGrowth.toFixed(1)}%` : '...'}
                  </span>
                  <span className="ml-1">so với kỳ trước</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Số đơn hàng</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview ? overview.totalOrders.toLocaleString() : '...'}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {overview && overview.ordersGrowth > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  <span className={overview && overview.ordersGrowth > 0 ? "text-green-500" : "text-red-500"}>
                    {overview ? `${overview.ordersGrowth > 0 ? '+' : ''}${overview.ordersGrowth.toFixed(1)}%` : '...'}
                  </span>
                  <span className="ml-1">so với kỳ trước</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview ? overview.totalCustomers.toLocaleString() : '...'}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {overview ? `${overview.newCustomers}` : '...'} mới
                  </Badge>
                  <span className="ml-2">trong {getDateRangeLabel(dateRange)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ chuyển đổi</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview ? `${overview.conversionRate.toFixed(1)}%` : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Từ lượt xem sang đơn hàng
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and detailed analytics */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Dịch vụ phổ biến nhất
                </CardTitle>
                <CardDescription>
                  Các dịch vụ được đặt nhiều nhất trong {getDateRangeLabel(dateRange)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topServices?.map((service, index) => (
                    <div key={service.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{service.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {service.bookings} lượt đặt
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(service.revenue)}
                      </div>
                    </div>
                  )) || (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Sản phẩm bán chạy
                </CardTitle>
                <CardDescription>
                  Các sản phẩm có doanh số cao nhất trong {getDateRangeLabel(dateRange)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts?.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.sold} đã bán
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(product.revenue)}
                      </div>
                    </div>
                  )) || (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Hoạt động người dùng
              </CardTitle>
              <CardDescription>
                Thống kê hoạt động của người dùng trong {getDateRangeLabel(dateRange)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Lượt truy cập</p>
                  <p className="text-2xl font-bold">
                    {userActivity ? userActivity.pageViews.toLocaleString() : '...'}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Eye className="h-3 w-3 mr-1" />
                    Trang được xem
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Phiên truy cập</p>
                  <p className="text-2xl font-bold">
                    {userActivity ? userActivity.sessions.toLocaleString() : '...'}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    Phiên duy nhất
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Thời gian trung bình</p>
                  <p className="text-2xl font-bold">
                    {userActivity ? `${Math.round(userActivity.avgSessionDuration / 60)}m` : '...'}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Mỗi phiên truy cập
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
  )
}
