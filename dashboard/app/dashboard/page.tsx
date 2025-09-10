"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
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
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts"

interface DashboardStats {
  revenue: {
    total: number
    growth: number
    chart: Array<{ date: string; value: number }>
  }
  orders: {
    total: number
    pending: number
    completed: number
    growth: number
    recent: Array<{
      id: string
      customer: string
      amount: number
      status: string
      createdAt: string
    }>
  }
  customers: {
    total: number
    new: number
    growth: number
  }
  products: {
    total: number
    outOfStock: number
    lowStock: number
    topSelling: Array<{
      id: string
      name: string
      sales: number
      revenue: number
      stock: number
    }>
  }
  services: {
    total: number
    active: number
    bookings: number
  }
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("today")

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!token) return

    try {
      setRefreshing(true)
      
      // Fetch multiple data sources in parallel
      const [ordersRes, productsRes, servicesRes, usersRes] = await Promise.all([
        apiClient.getOrders({ limit: 10, page: 1 }),
        apiClient.getProducts({ limit: 100, page: 1 }),
        apiClient.getServices({ limit: 100, page: 1 }),
        apiClient.getUsers({ limit: 100, role: 'USER' })
      ])

      // Process the data
      const orders = ordersRes.data?.items || []
      const products = productsRes.data?.items || []
      const services = servicesRes.data?.services || []
      const users = usersRes.data?.items || []

      // Calculate stats
      const now = new Date()
      const todayStart = new Date(now.setHours(0, 0, 0, 0))
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      // Revenue calculation
      const totalRevenue = orders.reduce((sum: number, order: any) => 
        sum + (order.totalCents || 0), 0) / 100

      const lastMonthRevenue = orders
        .filter((order: any) => new Date(order.createdAt) < thirtyDaysAgo)
        .reduce((sum: number, order: any) => sum + (order.totalCents || 0), 0) / 100

      const revenueGrowth = lastMonthRevenue > 0 
        ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 100

      // Generate revenue chart data (mock for now)
      const revenueChart = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return {
          date: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
          value: Math.floor(Math.random() * 10000000) + 5000000
        }
      })

      // Orders stats
      const pendingOrders = orders.filter((o: any) => o.status === 'PENDING').length
      const completedOrders = orders.filter((o: any) => o.status === 'COMPLETED').length
      const ordersGrowth = 23.5 // Mock growth

      // Customer stats
      const newCustomers = users.filter((u: any) => {
        const createdDate = new Date(u.createdAt)
        return createdDate >= thirtyDaysAgo
      }).length

      // Product stats
      const outOfStock = products.filter((p: any) => p.stockQuantity === 0).length
      const lowStock = products.filter((p: any) => 
        p.stockQuantity > 0 && p.stockQuantity < 10).length

      // Top selling products (mock sales data)
      const topSellingProducts = products.slice(0, 5).map((p: any) => ({
        id: p.id,
        name: p.name,
        sales: Math.floor(Math.random() * 100) + 20,
        revenue: p.price * (Math.floor(Math.random() * 100) + 20),
        stock: p.stockQuantity || 0
      }))

      // Service stats
      const activeServices = services.filter((s: any) => s.isActive).length
      const bookings = Math.floor(Math.random() * 50) + 10 // Mock bookings

      // Recent orders
      const recentOrders = orders.slice(0, 5).map((order: any) => ({
        id: order.id,
        customer: order.user?.name || 'Khách hàng',
        amount: (order.totalCents || 0) / 100,
        status: order.status || 'PENDING',
        createdAt: order.createdAt
      }))

      const dashboardStats: DashboardStats = {
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
          growth: 18.2
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
      }

      setStats(dashboardStats)
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
      change: `${stats?.revenue.growth > 0 ? '+' : ''}${stats?.revenue.growth.toFixed(1)}%`,
      trend: stats?.revenue.growth > 0 ? "up" : "down",
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
      change: `${stats?.products.outOfStock} hết hàng`,
      trend: stats?.products.outOfStock > 0 ? "down" : "up",
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
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

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
          <Button variant="outline" className="gap-2 rounded-xl">
            <Calendar className="h-4 w-4" />
            Hôm nay
          </Button>
          <Button className="gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <FileText className="h-4 w-4" />
            Xuất báo cáo
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
                <Tooltip formatter={(value: any) => formatCurrency(value)} contentStyle={{ borderRadius: 12 }} />
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
    </div>
  )
}
