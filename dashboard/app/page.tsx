import AdminNotice from './AdminNotice';
import { apiFetch } from './lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

// Fetch dashboard analytics
async function fetchAnalytics() {
  type CountResponse = { totalCount: number };
  type OrdersResponse = { totalCount: number; items: Array<{ id: string; totalCents?: number; createdAt: string; status?: string }> };
  try {
    const [products, orders, users] = await Promise.all([
      apiFetch<CountResponse>('/catalog/products?pageSize=1').catch((): CountResponse => ({ totalCount: 0 })),
      apiFetch<CountResponse>('/orders?pageSize=1').catch((): CountResponse => ({ totalCount: 0 })),
      apiFetch<CountResponse>('/users?pageSize=1').catch((): CountResponse => ({ totalCount: 0 }))
    ]);

    // Calculate revenue from recent orders
    const recentOrders = await apiFetch<OrdersResponse>('/orders?pageSize=100').catch(() => ({ totalCount: 0, items: [] }));
    const totalRevenue = recentOrders.items?.reduce((sum: number, order: any) =>
      sum + (order.totalCents || 0), 0) || 0;

    return {
      totalProducts: products.totalCount || 0,
      totalOrders: orders.totalCount || 0,
      totalUsers: users.totalCount || 0,
      totalRevenue,
      recentOrders: recentOrders.items?.slice(0, 5) || []
    };
  } catch {
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      recentOrders: []
    };
  }
}

export default async function AdminHome() {
  const me = await apiFetch<{ role?: string }>('/auth/me').catch(() => null);
  const isAdmin = me?.role === 'ADMIN';
  const analytics = await fetchAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hoạt động cửa hàng Audio Tài Lộc</p>
      </div>

      {!isAdmin && (
        <AdminNotice>Đây là khu vực quản trị. Bạn đang ở chế độ xem chỉ đọc.</AdminNotice>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <span className="text-2xl">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm trong kho</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <span className="text-2xl">🛒</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Đơn hàng đã tạo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Người dùng đăng ký</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(analytics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Tổng doanh thu</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng gần đây</CardTitle>
          <CardDescription>5 đơn hàng mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Đơn hàng #{order.id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(order.totalCents || 0)}</p>
                    <p className="text-sm text-gray-600">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Chưa có đơn hàng nào</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

