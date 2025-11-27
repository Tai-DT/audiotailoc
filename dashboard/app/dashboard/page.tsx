"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ProtectedRoute } from "@/components/auth/protected-route"
import {
  Package,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowRight,
  Calendar,
  FileText,
  Target,
  Plus,
  Eye,
  Package2,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Activity,
  CreditCard,
  RefreshCw,
  BarChart3,
  Download
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

import {
  DashboardStats,
  Order,
  Product,
  Service,
  User,
  RevenueResponse,
  RevenueChartResponse,
  GrowthMetricsResponse,
  TopProductResponse,
  BookingsResponse,
  OrdersResponse,
  ProductsResponse
} from "@/types/dashboard"
import { ApiResponse } from "@/lib/api-client"

function DashboardPage() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("today")
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf')
  const [isExporting, setIsExporting] = useState(false)

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!token) return

    try {
      setRefreshing(true)

      // Parallel data fetching with error handling wrapper
      const fetchData = async <T,>(promise: Promise<ApiResponse<T>>, fallback: T): Promise<T> => {
        try {
          const response = await promise
          return response.data
        } catch (err) {
          console.warn('Data fetch failed:', err)
          return fallback
        }
      }

      // 1. Fetch core lists
      const [ordersData, productsData, servicesData, usersData] = await Promise.all([
        fetchData<OrdersResponse>(apiClient.getOrders({ limit: 10, page: 1 }) as Promise<ApiResponse<OrdersResponse>>, { items: [], total: 0, page: 1, pageSize: 10 }),
        fetchData<ProductsResponse>(apiClient.getProducts({ limit: 100, page: 1 }) as Promise<ApiResponse<ProductsResponse>>, { items: [], total: 0, page: 1, pageSize: 100 }),
        fetchData<{ services: Service[] }>(apiClient.getServices({ limit: 100, page: 1 }) as Promise<ApiResponse<{ services: Service[] }>>, { services: [] }),
        fetchData<{ items: User[] }>(apiClient.getUsers({ limit: 100, role: 'USER' }) as Promise<ApiResponse<{ items: User[] }>>, { items: [] })
      ])

      // 2. Fetch analytics data
      const [revenueData, chartData, growthData, topProductsData, bookingsData] = await Promise.all([
        fetchData<RevenueResponse>(apiClient.getRevenue('all') as Promise<ApiResponse<RevenueResponse>>, { totalRevenue: 0, revenueGrowth: 0 }),
        fetchData<RevenueChartResponse>(apiClient.getRevenueChart(7) as Promise<ApiResponse<RevenueChartResponse>>, { dates: [], values: [] }),
        fetchData<GrowthMetricsResponse>(apiClient.getGrowthMetrics() as Promise<ApiResponse<GrowthMetricsResponse>>, { ordersGrowth: 0, customersGrowth: 0 }),
        fetchData<TopProductResponse[]>(apiClient.getTopSellingProductsReal(5) as Promise<ApiResponse<TopProductResponse[]>>, []),
        fetchData<BookingsResponse>(apiClient.getBookingsTodayReal() as Promise<ApiResponse<BookingsResponse>>, { bookingsToday: 0 })
      ])

      // Extract data safely
      const orders = ordersData.items || []
      const products = productsData.items || []
      const services = servicesData.services || []
      const users = usersData.items || []

      // Process Revenue
      const totalRevenue = revenueData.totalRevenue || 0
      const revenueGrowth = revenueData.revenueGrowth || 0

      // Process Revenue Chart
      let revenueChart = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return {
          date: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
          value: 0
        }
      })

      if (chartData?.dates && chartData?.values && Array.isArray(chartData.values)) {
        revenueChart = chartData.dates.map((date: string, i: number) => ({
          date: new Date(date).toLocaleDateString('vi-VN', { weekday: 'short' }),
          value: chartData.values[i] || 0
        }))
      }

      // Process Growth
      const ordersGrowth = growthData.ordersGrowth || 0
      const customersGrowth = growthData.customersGrowth || 0

      // Process Top Products
      const topSellingProducts = topProductsData.length > 0 ? topProductsData.map((p) => ({
        id: p.id,
        name: p.name,
        sales: p.salesCount,
        revenue: p.revenue,
        stock: p.stock
      })) : products.slice(0, 5).map((p: Product) => {
        const stock = p.inventory?.stock ?? p.stockQuantity ?? 0
        return {
          id: p.id,
          name: p.name,
          sales: 0,
          revenue: 0,
          stock: stock
        }
      })

      // Process Bookings
      const bookings = bookingsData.bookingsToday || 0

      // Calculate derived stats
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const newCustomers = users.filter((u: User) => new Date(u.createdAt) >= thirtyDaysAgo).length
      
      const outOfStock = products.filter((p: Product) => {
        const stock = p.inventory?.stock ?? p.stockQuantity ?? 0
        return stock === 0
      }).length

      const lowStock = products.filter((p: Product) => {
        const stock = p.inventory?.stock ?? p.stockQuantity ?? 0
        const threshold = p.inventory?.lowStockThreshold ?? 10
        return stock > 0 && stock < threshold
      }).length
      
      const activeServices = services.filter((s: Service) => s.isActive).length
      const pendingOrders = orders.filter((o: Order) => o.status === 'PENDING').length
      const completedOrders = orders.filter((o: Order) => o.status === 'COMPLETED').length

      const recentOrders = orders.slice(0, 5).map((order: Order) => ({
        id: order.id,
        customer: order.user?.name || order.customer?.name || 'Khách hàng',
        amount: (order.totalCents || 0) / 100,
        status: order.status || 'PENDING',
        createdAt: order.createdAt
      }))

      setStats({
        revenue: {
          total: totalRevenue,
          growth: revenueGrowth,
          chart: revenueChart
        },
        orders: {
          total: orders.length,
          pending: pendingOrders,
          completed: completedOrders,
          growth: ordersGrowth,
          recent: recentOrders
        },
        customers: {
          total: users.length,
          new: newCustomers,
          growth: customersGrowth
        },
        products: {
          total: products.length,
          outOfStock,
          lowStock,
          topSelling: topSellingProducts
        },
        services: {
          total: services.length,
          active: activeServices,
          bookings
        }
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error("Không thể tải dữ liệu dashboard")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [token])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Chờ xử lý", variant: "secondary" as const, icon: Clock },
      PROCESSING: { label: "Đang xử lý", variant: "default" as const, icon: AlertCircle },
      COMPLETED: { label: "Hoàn thành", variant: "success" as const, icon: CheckCircle },
      CANCELLED: { label: "Đã hủy", variant: "destructive" as const, icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const handleExportReport = async (type: 'sales' | 'inventory' | 'customers') => {
    try {
      setIsExporting(true)
      toast.loading(`Đang xuất báo cáo ${type}...`)

      let blob: Blob
      const filename = `bao-cao-${type}-${new Date().toISOString().split('T')[0]}`
      const extensions = { pdf: 'pdf', excel: 'xlsx', csv: 'csv' }

      switch (type) {
        case 'sales':
          blob = await apiClient.exportSalesReport(reportFormat)
          break
        case 'inventory':
          blob = await apiClient.exportInventoryReport(reportFormat)
          break
        case 'customers':
          blob = await apiClient.exportCustomersReport(reportFormat)
          break
        default:
          throw new Error('Invalid report type')
      }

      // Download the file
      apiClient.downloadBlob(blob, `${filename}.${extensions[reportFormat]}`)
      toast.dismiss()
      toast.success(`Xuất báo cáo ${type} thành công`)
    } catch (error) {
      toast.dismiss()
      console.error('Export error:', error)
      toast.error(`Lỗi khi xuất báo cáo ${type}`)
    } finally {
      setIsExporting(false)
    }
  }

  const handleQuickExportComprehensive = async () => {
    try {
      setIsExporting(true)
      toast.loading('Đang tạo báo cáo tổng hợp...')

      const blob = await apiClient.exportComprehensiveReport()
      const filename = `bao-cao-tong-hop-${new Date().toISOString().split('T')[0]}.xlsx`

      apiClient.downloadBlob(blob, filename)
      toast.dismiss()
      toast.success('Xuất báo cáo tổng hợp thành công')
    } catch (error) {
      toast.dismiss()
      console.error('Export comprehensive error:', error)
      toast.error('Lỗi khi xuất báo cáo tổng hợp')
    } finally {
      setIsExporting(false)
    }
  }

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      title: "Doanh thu",
      value: formatCurrency(stats?.revenue.total || 0),
      change: `${(stats?.revenue.growth || 0) > 0 ? '+' : ''}${(stats?.revenue.growth || 0).toFixed(1)}%`,
      trend: (stats?.revenue.growth || 0) > 0 ? "up" : "down",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Đơn hàng",
      value: stats?.orders.total.toString() || "0",
      change: `${stats?.orders.pending} chờ xử lý`,
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Khách hàng",
      value: stats?.customers.total.toString() || "0",
      change: `+${stats?.customers.new} mới`,
      trend: "up",
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Sản phẩm",
      value: stats?.products.total.toString() || "0",
      change: `${stats?.products.outOfStock || 0} hết hàng`,
      trend: (stats?.products.outOfStock || 0) > 0 ? "down" : "up",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    }
  ]

  const quickActions = [
    { title: "Thêm sản phẩm", icon: Plus, href: "/dashboard/products", color: "bg-blue-500" },
    { title: "Xem đơn hàng", icon: Eye, href: "/dashboard/orders", color: "bg-green-500" },
    { title: "Quản lý kho", icon: Package2, href: "/dashboard/inventory", color: "bg-purple-500" },
    { title: "Tạo khuyến mãi", icon: Target, href: "/dashboard/promotions", color: "bg-orange-500" },
  ]

  // Chart colors


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Xin chào, {user?.name || 'Admin'}!
          </h1>
          <p className="text-muted-foreground">
            Dưới đây là tổng quan hoạt động của cửa hàng hôm nay.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData()}
            disabled={refreshing}
            className="rounded-xl"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Làm mới
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-xl"
            onClick={() => {
              const today = new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
              toast.success(`Hiển thị dữ liệu: ${today}`)
            }}
          >
            <Calendar className="h-4 w-4" />
            Hôm nay
          </Button>
          <Button
            className="gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            onClick={handleQuickExportComprehensive}
            disabled={isExporting}
          >
            <FileText className="h-4 w-4" />
            {isExporting ? 'Đang xuất...' : 'Xuất báo cáo'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="rounded-2xl border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</CardTitle>
                <div className={cn("p-2.5 rounded-xl", stat.bgColor)}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold tracking-tight">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Revenue Chart */}
      {stats?.revenue.chart && (
        <Card className="rounded-2xl border-gray-200/60 dark:border-gray-700/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Doanh thu 7 ngày qua</CardTitle>
                <CardDescription>Biểu đồ doanh thu theo ngày</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant={selectedPeriod === 'today' ? 'default' : 'outline'} className="rounded-xl" onClick={() => setSelectedPeriod('today')}>Hôm nay</Button>
                <Button size="sm" variant={selectedPeriod === 'week' ? 'default' : 'outline'} className="rounded-xl" onClick={() => setSelectedPeriod('week')}>7 ngày</Button>
                <Button size="sm" variant={selectedPeriod === 'month' ? 'default' : 'outline'} className="rounded-xl" onClick={() => setSelectedPeriod('month')}>30 ngày</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.revenue.chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip formatter={(value: number | string) => formatCurrency(Number(value))} contentStyle={{ borderRadius: 12 }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <Link key={index} href={action.href}>
              <Card className="hover:shadow-md transition-all cursor-pointer rounded-2xl border-gray-200/60 dark:border-gray-700/60">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className={cn("p-3 rounded-xl mb-2 shadow-sm", action.color)}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-center">{action.title}</span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="rounded-2xl border-gray-200/60 dark:border-gray-700/60">
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>
              Có {stats?.orders.pending || 0} đơn hàng chờ xử lý
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.orders.recent.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium">#{order.id.slice(-8)}</p>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(order.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 rounded-xl" asChild>
              <Link href="/dashboard/orders">
                Xem tất cả đơn hàng
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="rounded-2xl border-gray-200/60 dark:border-gray-700/60">
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <CardDescription>Top 5 sản phẩm trong tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.products.topSelling.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sales} đã bán - Còn {product.stock} trong kho
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                  <Progress value={(product.sales / 150) * 100} className="h-2 rounded-full" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 rounded-xl" asChild>
              <Link href="/dashboard/products">
                Quản lý sản phẩm
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-gray-200/60 dark:border-gray-700/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dịch vụ</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.services.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.services.active || 0} đang hoạt động
            </p>
            <p className="text-xs text-green-600 mt-1">
              +{stats?.services.bookings || 0} lượt đặt hôm nay
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200/60 dark:border-gray-700/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tồn kho</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.products.lowStock || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Sản phẩm sắp hết hàng
            </p>
            <p className="text-xs text-red-600 mt-1">
              {stats?.products.outOfStock || 0} đã hết hàng
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200/60 dark:border-gray-700/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thanh toán</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.orders.completed || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Giao dịch thành công
            </p>
            <p className="text-xs text-green-600 mt-1">
              98.5% tỷ lệ thành công
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Section */}
      <Card className="rounded-2xl border-gray-200/60 dark:border-gray-700/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Báo cáo & Phân tích
            </CardTitle>
            <CardDescription>
              Tạo và quản lý báo cáo kinh doanh
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-1.5 border rounded-md text-xs"
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value as 'pdf' | 'excel' | 'csv')}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
            <Button asChild variant="default" size="sm">
              <Link href="/dashboard/reports">
                <FileText className="h-4 w-4 mr-2" />
                Xem tất cả
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Sales Report */}
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="text-green-600">
                  <DollarSign className="h-6 w-6" />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleExportReport('sales')}
                  disabled={isExporting}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
              <h4 className="font-semibold text-sm">Báo cáo Doanh số</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Tổng hợp doanh số bán hàng
              </p>
              <p className="text-xs text-green-600 mt-2">
                {formatCurrency(stats?.revenue.total || 0)} tháng này
              </p>
            </div>

            {/* Inventory Report */}
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="text-blue-600">
                  <Package2 className="h-6 w-6" />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleExportReport('inventory')}
                  disabled={isExporting}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
              <h4 className="font-semibold text-sm">Báo cáo Tồn kho</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Tình trạng tồn kho sản phẩm
              </p>
              <p className="text-xs text-blue-600 mt-2">
                {stats?.products.total || 0} sản phẩm
              </p>
            </div>

            {/* Customers Report */}
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="text-purple-600">
                  <UserCheck className="h-6 w-6" />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleExportReport('customers')}
                  disabled={isExporting}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
              <h4 className="font-semibold text-sm">Báo cáo Khách hàng</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Thống kê khách hàng
              </p>
              <p className="text-xs text-purple-600 mt-2">
                +{stats?.customers.new || 0} khách hàng mới
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPageWrapper() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  )
}
