"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { formatDate, formatRelativeTime, isValidDate } from "@/lib/date-utils"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

// Analytics data types

interface Order {
  id: string
  status: string
  createdAt: string
  totalCents: number
  totalAmount: number
  user?: {
    name?: string
    email: string
  }
  customer?: {
    name?: string
    email: string
  }
}

interface RecentOrder {
  id: string
  customer: string
  amount: number
  status: string
  createdAt: string
  createdAtFormatted?: string
}

interface Product {
  id: string
  name: string
  stockQuantity: number
  price: number
  imageUrl?: string
}

interface Service {
  id: string
  name: string
  isActive: boolean
  price: number
}

interface User {
  id: string
  name?: string
  email: string
  createdAt: string
  role: string
}

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
    recent: Array<RecentOrder>
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

const PERIOD_CONFIG = {
  today: { label: "Hôm nay", short: "Today", days: 1 },
  week: { label: "7 ngày", short: "7d", days: 7 },
  month: { label: "30 ngày", short: "30d", days: 30 },
} as const

type PeriodKey = keyof typeof PERIOD_CONFIG

function DashboardPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("today")

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!token) return

    try {
      setRefreshing(true)
      
      // Fetch multiple data sources in parallel with individual error handling
      const [ordersRes, productsRes, servicesRes, usersRes] = await Promise.allSettled([
        apiClient.getOrders({ limit: 10, page: 1 }).catch(err => {
          console.warn('Failed to fetch orders:', err.message)
          return { data: { items: [] } }
        }),
        apiClient.getProducts({ limit: 100, page: 1 }).catch(err => {
          console.warn('Failed to fetch products:', err.message)
          return { data: { items: [] } }
        }),
        apiClient.getServices({ limit: 100, page: 1 }).catch(err => {
          console.warn('Failed to fetch services:', err.message)
          return { data: { services: [] } }
        }),
        apiClient.getUsers({ limit: 100, role: 'USER' }).catch(err => {
          console.warn('Failed to fetch users:', err.message)
          return { data: { items: [] } }
        })
      ])

      // Extract data from settled promises
      const orders = (ordersRes.status === 'fulfilled' ? 
        (ordersRes.value.data as { items?: Order[] })?.items : []) || []
      const products = (productsRes.status === 'fulfilled' ? 
        (productsRes.value.data as { items?: Product[] })?.items : []) || []
      const services = (servicesRes.status === 'fulfilled' ? 
        (servicesRes.value.data as { services?: Service[] })?.services : []) || []
      const users = (usersRes.status === 'fulfilled' ? 
        (usersRes.value.data as { items?: User[] })?.items : []) || []

      // Calculate stats
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const days = PERIOD_CONFIG[selectedPeriod].days

      // Revenue calculation
      const totalRevenue = orders.reduce((sum: number, order: Order) => 
        sum + (order.totalCents || 0), 0) / 100

      const lastMonthRevenue = orders
        .filter((order: Order) => new Date(order.createdAt) < thirtyDaysAgo)
        .reduce((sum: number, order: Order) => sum + (order.totalCents || 0), 0) / 100

      const revenueGrowth = lastMonthRevenue > 0 
        ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 100

      // Fetch real revenue chart data from analytics API
      let revenueChart = Array.from({ length: days }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - ((days - 1) - i))
        return {
          date: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
          value: 0
        }
      })

      try {
        const revenueChartRes = await apiClient.getRevenueChart(days)
        const chartData = (revenueChartRes.data as { dates?: string[], values?: number[] })
        if (chartData?.dates && chartData?.values && Array.isArray(chartData.values)) {
          revenueChart = chartData.dates.map((date: string, i: number) => ({
            date: new Date(date).toLocaleDateString('vi-VN', { weekday: 'short' }),
            value: (chartData.values as number[])[i] || 0
          }))
        }
      } catch (error) {
        console.warn('Failed to fetch revenue chart:', error instanceof Error ? error.message : 'Unknown error')
      }

      // Orders stats
      const pendingOrders = orders.filter((o: Order) => o.status === 'PENDING').length
      const completedOrders = orders.filter((o: Order) => o.status === 'COMPLETED').length

      // Fetch real growth metrics from analytics API
      let ordersGrowth = 0
      let customersGrowth = 0
      try {
        const growthRes = await apiClient.getGrowthMetrics()
        const growthData = (growthRes.data as { ordersGrowth?: number, customersGrowth?: number })
        ordersGrowth = growthData?.ordersGrowth || 0
        customersGrowth = growthData?.customersGrowth || 0
      } catch (error) {
        console.warn('Failed to fetch growth metrics:', error instanceof Error ? error.message : 'Unknown error')
      }

      // Customer stats
      const newCustomers = users.filter((u: User) => {
        const createdDate = new Date(u.createdAt)
        return createdDate >= thirtyDaysAgo
      }).length

      // Product stats
      const outOfStock = products.filter((p: Product) => p.stockQuantity === 0).length
      const lowStock = products.filter((p: Product) => 
        p.stockQuantity > 0 && p.stockQuantity < 10).length

      // Fetch real top selling products from analytics API
      let topSellingProducts: Array<{ id: string; name: string; sales: number; revenue: number; stock: number }> = []
      try {
        const topProductsRes = await apiClient.getTopSellingProductsReal(5)
        const topProductsData = (topProductsRes.data as Array<{
          id: string;
          name: string;
          salesCount: number;
          revenue: number;
          stock: number
        }>) || []
        topSellingProducts = topProductsData.map(p => ({
          id: p.id,
          name: p.name,
          sales: p.salesCount,
          revenue: p.revenue,
          stock: p.stock
        }))
      } catch (error) {
        console.warn('Failed to fetch top products:', error instanceof Error ? error.message : 'Unknown error')
        // Fallback to products list if API fails
        topSellingProducts = products.slice(0, 5).map((p: Product) => ({
          id: p.id,
          name: p.name,
          sales: 0,
          revenue: 0,
          stock: p.stockQuantity || 0
        }))
      }

      // Service stats
      const activeServices = services.filter((s: Service) => s.isActive).length

      // Fetch real bookings count from analytics API
      let bookings = 0
      try {
        const bookingsRes = await apiClient.getBookingsTodayReal()
        const bookingsData = (bookingsRes.data as { bookingsToday?: number })
        bookings = bookingsData?.bookingsToday || 0
      } catch (error) {
        console.warn('Failed to fetch bookings:', error instanceof Error ? error.message : 'Unknown error')
      }

      // Recent orders
      const recentOrders = orders.slice(0, 5).map((order: Order) => ({
        id: order.id,
        customer: order.user?.name || order.customer?.name || 'Khách hàng',
        amount: (order.totalCents || 0) / 100,
        status: order.status || 'PENDING',
        createdAt: order.createdAt,
        // Ensure createdAt is valid
        createdAtFormatted: isValidDate(order.createdAt) 
          ? formatDate(order.createdAt) 
          : 'N/A'
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
      }

      setStats(dashboardStats)
    } catch (error) {
      console.warn('Error fetching dashboard data:', error instanceof Error ? error.message : 'Unknown error')
      toast.error("Không thể tải dữ liệu dashboard")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [selectedPeriod, token])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value)
  }

  const exportDashboardReport = () => {
    if (!stats) {
      toast.error("Chưa có dữ liệu để xuất báo cáo")
      return
    }

    const escapeCsv = (value: string) => {
      const needsQuotes = /[",\n\r]/.test(value)
      const escaped = value.replaceAll('"', '""')
      return needsQuotes ? `"${escaped}"` : escaped
    }

    const now = new Date()
    const datePart = now.toISOString().slice(0, 10)
    const rows: string[][] = []

    rows.push(["Audio Tài Lộc - Dashboard Report"])
    rows.push(["Period", PERIOD_CONFIG[selectedPeriod].label])
    rows.push(["Generated At", now.toISOString()])
    rows.push([])

    rows.push(["Metric", "Value"])
    rows.push(["Doanh thu", formatCurrency(stats.revenue.total)])
    rows.push(["Tăng trưởng doanh thu", `${stats.revenue.growth.toFixed(1)}%`])
    rows.push(["Tổng đơn hàng", stats.orders.total.toString()])
    rows.push(["Đơn hàng chờ xử lý", stats.orders.pending.toString()])
    rows.push(["Đơn hàng hoàn thành", stats.orders.completed.toString()])
    rows.push(["Tăng trưởng đơn hàng", `${stats.orders.growth.toFixed(1)}%`])
    rows.push(["Tổng khách hàng", stats.customers.total.toString()])
    rows.push(["Khách hàng mới", stats.customers.new.toString()])
    rows.push(["Tăng trưởng khách hàng", `${stats.customers.growth.toFixed(1)}%`])
    rows.push(["Tổng sản phẩm", stats.products.total.toString()])
    rows.push(["Sản phẩm hết hàng", stats.products.outOfStock.toString()])
    rows.push(["Sản phẩm sắp hết", stats.products.lowStock.toString()])
    rows.push(["Tổng dịch vụ", stats.services.total.toString()])
    rows.push(["Dịch vụ đang hoạt động", stats.services.active.toString()])
    rows.push(["Lượt đặt dịch vụ", stats.services.bookings.toString()])

    rows.push([])
    rows.push(["Revenue Chart"])
    rows.push(["Date", "Value"])
    stats.revenue.chart.forEach(point => rows.push([point.date, point.value.toString()]))

    rows.push([])
    rows.push(["Recent Orders"])
    rows.push(["Order ID", "Customer", "Amount", "Status", "Created At"])
    stats.orders.recent.forEach(order => {
      rows.push([
        order.id,
        order.customer,
        formatCurrency(order.amount),
        order.status,
        order.createdAtFormatted || order.createdAt,
      ])
    })

    rows.push([])
    rows.push(["Top Selling Products"])
    rows.push(["Product", "Sales", "Revenue", "Stock"])
    stats.products.topSelling.forEach(p => {
      rows.push([p.name, p.sales.toString(), formatCurrency(p.revenue), p.stock.toString()])
    })

    const csv = rows.map(r => r.map(cell => escapeCsv(cell ?? "")).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `dashboard-report-${selectedPeriod}-${datePart}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)

    toast.success("Đã xuất báo cáo")
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
      <div className="space-y-4 animate-in fade-in-50 duration-500">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-xl" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Skeleton */}
        <Card className="rounded-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[260px] w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Quick Actions Skeleton */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="py-0 gap-0">
              <CardContent className="flex items-center gap-3 px-3 py-3 sm:px-4">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <Skeleton className="h-4 w-24" />
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
    {
      title: "Thêm sản phẩm",
      icon: Plus,
      href: "/dashboard/products",
      iconClassName:
        "bg-blue-50 text-blue-600 ring-blue-600/10 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-300/10",
    },
    {
      title: "Xem đơn hàng",
      icon: Eye,
      href: "/dashboard/orders",
      iconClassName:
        "bg-emerald-50 text-emerald-600 ring-emerald-600/10 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-300/10",
    },
    {
      title: "Quản lý kho",
      icon: Package2,
      href: "/dashboard/inventory",
      iconClassName:
        "bg-purple-50 text-purple-600 ring-purple-600/10 dark:bg-purple-900/20 dark:text-purple-300 dark:ring-purple-300/10",
    },
    {
      title: "Tạo khuyến mãi",
      icon: Target,
      href: "/dashboard/promotions",
      iconClassName:
        "bg-orange-50 text-orange-600 ring-orange-600/10 dark:bg-orange-900/20 dark:text-orange-300 dark:ring-orange-300/10",
    },
  ]

  // Chart colors

  const revenueChartTitle =
    selectedPeriod === "today"
      ? "Doanh thu hôm nay"
      : `Doanh thu ${PERIOD_CONFIG[selectedPeriod].label} qua`


  return (
    <div className="space-y-4 animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3">
        <div className="flex flex-wrap items-center gap-2 rounded-xl p-1 bg-background/70 border border-border/60 backdrop-blur-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData()}
            disabled={refreshing}
            className="h-8 rounded-lg"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            <span className="hidden sm:inline">Làm mới</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">{PERIOD_CONFIG[selectedPeriod].label}</span>
                <span className="sm:hidden">{PERIOD_CONFIG[selectedPeriod].short}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => setSelectedPeriod("today")}
                className={cn(selectedPeriod === "today" && "font-semibold")}
              >
                Hôm nay
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedPeriod("week")}
                className={cn(selectedPeriod === "week" && "font-semibold")}
              >
                7 ngày gần đây
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedPeriod("month")}
                className={cn(selectedPeriod === "month" && "font-semibold")}
              >
                30 ngày gần đây
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            onClick={exportDashboardReport}
            disabled={!stats || refreshing}
            className="h-8 gap-2 rounded-lg"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Xuất báo cáo</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card 
              key={index} 
              className="rounded-xl"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[13px] font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn("p-1.5 rounded-lg", stat.bgColor)}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl font-semibold tracking-tight">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                  )}
                  <span className={cn(
                    "font-medium",
                    stat.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Revenue Chart */}
      {stats?.revenue.chart && stats.revenue.chart.length > 0 ? (
        <Card className="rounded-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{revenueChartTitle}</CardTitle>
                <CardDescription>Biểu đồ doanh thu theo ngày</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={stats.revenue.chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  className="dark:text-gray-400"
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  className="dark:text-gray-400"
                />
                <Tooltip 
                  formatter={(value: number | string) => formatCurrency(Number(value))} 
                  contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>{revenueChartTitle}</CardTitle>
            <CardDescription>Biểu đồ doanh thu theo ngày</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[260px] text-muted-foreground">
              <p className="text-sm">Chưa có dữ liệu doanh thu</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <Link
              key={index}
              href={action.href}
              title={action.title}
              aria-label={action.title}
              className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
              <Card className="py-0 gap-0 hover:bg-muted/30">
                <CardContent className="flex items-center gap-3 px-3 py-3 sm:px-4">
                  <div className={cn("grid place-items-center size-9 rounded-lg ring-1 shrink-0", action.iconClassName)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[13px] sm:text-sm font-medium leading-tight">
                    {action.title}
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hidden sm:block" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>
              Có {stats?.orders.pending || 0} đơn hàng chờ xử lý
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/60">
              {stats?.orders.recent.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">#{order.id.slice(-8)}</p>
                    <p className="text-[13px] text-muted-foreground truncate">{order.customer}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(order.amount)}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {order.createdAtFormatted || formatDate(order.createdAt)}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 rounded-lg" asChild>
              <Link href="/dashboard/orders">
                Xem tất cả đơn hàng
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Top Products */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <CardDescription>Top 5 sản phẩm trong tháng</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.products.topSelling && stats.products.topSelling.length > 0 ? (
              <div className="divide-y divide-border/60">
                {stats.products.topSelling.map((product, index) => (
                  <div key={index} className="py-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {product.sales} đã bán - Còn {product.stock} trong kho
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium">{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                    <Progress 
                      value={product.sales > 0 ? Math.min((product.sales / 150) * 100, 100) : 0} 
                      className="h-1.5 rounded-full" 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Chưa có dữ liệu sản phẩm bán chạy</p>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4 rounded-lg" asChild>
              <Link href="/dashboard/products">
                Quản lý sản phẩm
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[13px] font-medium">Dịch vụ</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{stats?.services.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.services.active || 0} đang hoạt động
            </p>
            <p className="text-xs text-green-600 mt-1">
              +{stats?.services.bookings || 0} lượt đặt hôm nay
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[13px] font-medium">Tồn kho</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
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

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[13px] font-medium">Thanh toán</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
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

export default function DashboardPageWrapper() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  )
}
