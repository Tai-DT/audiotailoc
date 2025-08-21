import { apiFetch } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice, formatDate } from '@/lib/utils';

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
  type ProductsResponse = { totalCount: number };
  type OrdersResponse = { totalCount: number; items: Array<{ totalCents?: number }> };
  type UsersResponse = { totalCount: number };
  try {
    // Fetch basic stats
    const [products, orders, users] = await Promise.all([
      apiFetch<ProductsResponse>('/catalog/products?pageSize=1').catch((): ProductsResponse => ({ totalCount: 0 })),
      apiFetch<OrdersResponse>('/orders?pageSize=100').catch((): OrdersResponse => ({ totalCount: 0, items: [] })),
      apiFetch<UsersResponse>('/admin/users?pageSize=1').catch((): UsersResponse => ({ totalCount: 0 }))
    ]);

    const orderItems = orders.items || [];
    const totalRevenue = orderItems.reduce((sum: number, order: any) => sum + (order.totalCents || 0), 0);

    // Mock data for charts (in real app, this would come from analytics API)
    const revenueByMonth = [
      { month: 'T1', revenue: 15000000, orders: 45 },
      { month: 'T2', revenue: 18000000, orders: 52 },
      { month: 'T3', revenue: 22000000, orders: 68 },
      { month: 'T4', revenue: 25000000, orders: 75 },
      { month: 'T5', revenue: 28000000, orders: 82 },
      { month: 'T6', revenue: 32000000, orders: 95 }
    ];

    const topProducts = [
      { name: 'Sony WH-1000XM4', sales: 45, revenue: 13500000 },
      { name: 'Audio-Technica ATH-M50x', sales: 38, revenue: 7600000 },
      { name: 'Sennheiser HD 660S', sales: 25, revenue: 12500000 },
      { name: 'Beyerdynamic DT 770 Pro', sales: 32, revenue: 6400000 },
      { name: 'Focal Clear', sales: 15, revenue: 22500000 }
    ];

    const ordersByStatus = [
      { status: 'PENDING', count: 12 },
      { status: 'CONFIRMED', count: 25 },
      { status: 'SHIPPED', count: 18 },
      { status: 'DELIVERED', count: 45 },
      { status: 'CANCELLED', count: 3 }
    ];

    const recentActivity = [
      { type: 'order', description: 'Đơn hàng mới #12345', timestamp: new Date().toISOString() },
      { type: 'product', description: 'Sản phẩm mới được thêm', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { type: 'user', description: 'Người dùng mới đăng ký', timestamp: new Date(Date.now() - 7200000).toISOString() }
    ];

    return {
      totalRevenue,
      totalOrders: orders.totalCount || 0,
      totalProducts: products.totalCount || 0,
      totalUsers: users.totalCount || 0,
      revenueByMonth,
      topProducts,
      ordersByStatus,
      recentActivity
    };
  } catch {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalUsers: 0,
      revenueByMonth: [],
      topProducts: [],
      ordersByStatus: [],
      recentActivity: []
    };
  }
}

export default async function AnalyticsPage() {
  const analytics = await fetchAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Thống kê & Phân tích</h1>
        <p className="text-gray-600">Báo cáo chi tiết về hoạt động kinh doanh</p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(analytics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <span className="text-2xl">🛒</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+8% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <span className="text-2xl">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm đang bán</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+15% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
            <CardDescription>6 tháng gần đây</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.revenueByMonth.map((item) => (
                <div key={item.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 text-sm font-medium">{item.month}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.revenue / 35000000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatPrice(item.revenue)}</div>
                    <div className="text-xs text-gray-500">{item.orders} đơn</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <CardDescription>Top 5 sản phẩm có doanh thu cao nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} đã bán</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(product.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái đơn hàng</CardTitle>
            <CardDescription>Phân bố đơn hàng theo trạng thái</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.ordersByStatus.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status.status === 'DELIVERED' ? 'bg-green-500' :
                      status.status === 'SHIPPED' ? 'bg-blue-500' :
                      status.status === 'CONFIRMED' ? 'bg-yellow-500' :
                      status.status === 'CANCELLED' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm">{status.status}</span>
                  </div>
                  <span className="font-medium">{status.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các sự kiện mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'order' ? 'bg-green-500' :
                    activity.type === 'product' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
