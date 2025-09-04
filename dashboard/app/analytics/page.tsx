import { apiFetch } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { formatPrice, formatDate } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, Calendar, RefreshCw, Download } from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueByMonth: Array<{ month: string; revenue: number; orders: number }>;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
  recentActivity: Array<{ type: string; description: string; timestamp: string }>;
}

async function fetchAnalytics(): Promise<AnalyticsData> {
  // Mock analytics data - will replace with real API calls when backend is fixed
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate loading

  const mockData: AnalyticsData = {
    totalRevenue: 125000000, // 1.25 tỷ VND
    totalOrders: 67,
    totalProducts: 15,
    totalUsers: 23,
    revenueByMonth: [
      { month: 'Jan', revenue: 4500000, orders: 12 },
      { month: 'Feb', revenue: 5200000, orders: 15 },
      { month: 'Mar', revenue: 4800000, orders: 18 },
      { month: 'Apr', revenue: 6100000, orders: 22 },
      { month: 'May', revenue: 5500000, orders: 20 },
      { month: 'Jun', revenue: 6700000, orders: 25 },
    ],
    topProducts: [
      { name: 'Soundbar Tài Lộc 5.1', sales: 8, revenue: 39920000 },
      { name: 'Loa Bluetooth TL-200', sales: 12, revenue: 18000000 },
      { name: 'Tai nghe Gaming Pro', sales: 15, revenue: 22500000 },
      { name: 'Microphone Podcast', sales: 6, revenue: 12000000 },
      { name: 'Amply 100W', sales: 4, revenue: 8000000 },
    ],
    ordersByStatus: [
      { status: 'pending', count: 3 },
      { status: 'processing', count: 5 },
      { status: 'completed', count: 18 },
      { status: 'cancelled', count: 1 },
    ],
    recentActivity: [
      { type: 'order', description: 'Đơn hàng mới #ORD123456', timestamp: new Date().toISOString() },
      { type: 'user', description: 'Người dùng mới đăng ký: Nguyễn Văn A', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { type: 'order', description: 'Đơn hàng #ORD123455 đã hoàn thành', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { type: 'product', description: 'Sản phẩm mới: Soundbar 7.1', timestamp: new Date(Date.now() - 10800000).toISOString() },
      { type: 'order', description: 'Đơn hàng #ORD123454 đang xử lý', timestamp: new Date(Date.now() - 14400000).toISOString() },
    ]
  };

  return mockData;
}

// Chart Colors
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "blue"
}: {
  title: string;
  value: string;
  icon: any;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: string;
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    orange: 'text-orange-600 bg-orange-100',
    red: 'text-red-600 bg-red-100',
    purple: 'text-purple-600 bg-purple-100',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && trendValue && (
          <p className={`text-xs flex items-center gap-1 ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trendValue} so với tháng trước
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function RevenueChart({ data }: { data: Array<{ month: string; revenue: number; orders: number }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo tháng</CardTitle>
        <CardDescription>6 tháng gần đây</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => formatPrice(value)} />
            <Tooltip
              formatter={(value: number) => [formatPrice(value), 'Doanh thu']}
              labelFormatter={(label) => `Tháng ${label}`}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function TopProductsChart({ products }: { products: Array<{ name: string; sales: number; revenue: number }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm bán chạy</CardTitle>
        <CardDescription>Top 5 sản phẩm có doanh thu cao nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={products} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => formatPrice(value)} />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip
              formatter={(value: number) => [formatPrice(value), 'Doanh thu']}
              labelFormatter={(label) => `Sản phẩm: ${label}`}
            />
            <Bar dataKey="revenue" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function OrderStatusChart({ data }: { data: Array<{ status: string; count: number }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng thái đơn hàng</CardTitle>
        <CardDescription>Phân bố đơn hàng theo trạng thái</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function RecentActivity({ activities }: { activities: Array<{ type: string; description: string; timestamp: string }> }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-4 w-4 text-green-600" />;
      case 'product':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'user':
        return <Users className="h-4 w-4 text-purple-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
        <CardDescription>Các sự kiện mới nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="p-1 bg-gray-100 rounded-full">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AnalyticsPage() {
  const analytics = await fetchAnalytics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Thống kê & Phân tích</h1>
          <p className="text-gray-600">Báo cáo chi tiết về hoạt động kinh doanh</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Chọn khoảng thời gian
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Tổng doanh thu"
          value={formatPrice(analytics.totalRevenue)}
          icon={DollarSign}
          trend="up"
          trendValue="+12%"
          color="blue"
        />
        <KPICard
          title="Đơn hàng"
          value={analytics.totalOrders.toLocaleString('vi-VN')}
          icon={ShoppingCart}
          trend="up"
          trendValue="+8%"
          color="green"
        />
        <KPICard
          title="Sản phẩm"
          value={analytics.totalProducts.toLocaleString('vi-VN')}
          icon={Package}
          color="orange"
        />
        <KPICard
          title="Khách hàng"
          value={analytics.totalUsers.toLocaleString('vi-VN')}
          icon={Users}
          trend="up"
          trendValue="+15%"
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={analytics.revenueByMonth} />
        <TopProductsChart products={analytics.topProducts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart data={analytics.ordersByStatus} />
        <RecentActivity activities={analytics.recentActivity} />
      </div>
    </div>
  );
}
