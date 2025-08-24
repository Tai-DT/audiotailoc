"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Eye,
  Settings,
  Calendar,
  Activity
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface DashboardData {
  sales: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  customers: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    customerRetention: number;
  };
  inventory: {
    totalProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    inventoryValue: number;
  };
  recentOrders: any[];
  topProducts: any[];
  salesChart: any[];
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) {
        setError('API không khả dụng');
        setLoading(false);
        return;
      }

      const response = await fetch(`${base}/analytics/dashboard`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else if (response.status === 401) {
        setError('Không có quyền truy cập. Vui lòng đăng nhập với tài khoản admin.');
      } else {
        setError('Không thể tải dữ liệu dashboard');
      }
    } catch (error) {
      setError('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Truy cập bị từ chối</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.history.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Quản trị</h1>
            <p className="text-gray-600">Tổng quan hệ thống và báo cáo kinh doanh</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Activity className="h-3 w-3 mr-1" />
              Hệ thống hoạt động
            </Badge>
            <Button onClick={fetchDashboardData} variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="sales">Doanh số</TabsTrigger>
          <TabsTrigger value="customers">Khách hàng</TabsTrigger>
          <TabsTrigger value="inventory">Kho hàng</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.sales?.totalRevenue ?
                    formatPrice(dashboardData.sales.totalRevenue) :
                    '0 VND'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  +20.1% so với tháng trước
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.sales?.totalOrders || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +180 đơn hàng mới
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.customers?.totalCustomers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardData?.customers?.newCustomers || 0} khách mới
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.inventory?.totalProducts || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.inventory?.lowStockProducts || 0} sản phẩm sắp hết
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng gần đây</CardTitle>
                <CardDescription>
                  Đơn hàng mới nhất cần xử lý
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentOrders.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">#{order.orderNo}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.createdAt)} - {order.customerName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(order.totalCents)}</p>
                          <Badge variant={order.status === 'PENDING' ? 'destructive' : 'default'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">Không có đơn hàng nào</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm bán chạy</CardTitle>
                <CardDescription>
                  Top sản phẩm có doanh số cao nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData?.topProducts && dashboardData.topProducts.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.topProducts.slice(0, 5).map((product: any, index: number) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              Đã bán: {product.totalSold || 0}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(product.revenue || 0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">Chưa có dữ liệu</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Doanh số theo tháng</CardTitle>
                <CardDescription>
                  Biểu đồ doanh thu 6 tháng gần nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Biểu đồ doanh số</p>
                    <p className="text-sm">Tính năng đang được phát triển</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tỷ lệ chuyển đổi</CardTitle>
                <CardDescription>
                  Tỷ lệ khách hàng thực hiện mua hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {dashboardData?.sales?.conversionRate || 0}%
                </div>
                <p className="text-sm text-gray-500">
                  Trung bình đơn hàng: {formatPrice(dashboardData?.sales?.averageOrderValue || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
                <CardDescription>
                  Phân tích theo phương thức thanh toán
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">VNPay</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">MOMO</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">COD</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê khách hàng</CardTitle>
                <CardDescription>
                  Phân tích hành vi khách hàng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Tổng khách hàng:</span>
                  <span className="font-medium">{dashboardData?.customers?.totalCustomers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Khách hàng mới (tháng):</span>
                  <span className="font-medium">{dashboardData?.customers?.newCustomers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Khách hàng quay lại:</span>
                  <span className="font-medium">{dashboardData?.customers?.returningCustomers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tỷ lệ giữ chân:</span>
                  <span className="font-medium">{dashboardData?.customers?.customerRetention || 0}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Địa điểm khách hàng</CardTitle>
                <CardDescription>
                  Phân bố khách hàng theo khu vực
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hồ Chí Minh</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hà Nội</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Đà Nẵng</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Khác</span>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tình trạng kho</CardTitle>
                <CardDescription>
                  Tổng quan hàng tồn kho
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Tổng sản phẩm:</span>
                  <span className="font-medium">{dashboardData?.inventory?.totalProducts || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sắp hết hàng:</span>
                  <span className="font-medium text-orange-600">
                    {dashboardData?.inventory?.lowStockProducts || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Hết hàng:</span>
                  <span className="font-medium text-red-600">
                    {dashboardData?.inventory?.outOfStockProducts || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Giá trị tồn kho:</span>
                  <span className="font-medium">
                    {formatPrice(dashboardData?.inventory?.inventoryValue || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cảnh báo tồn kho</CardTitle>
                <CardDescription>
                  Sản phẩm cần nhập thêm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-4">
                  <Package className="h-12 w-12 mx-auto mb-2" />
                  <p>Không có cảnh báo</p>
                  <p className="text-sm">Tất cả sản phẩm đều đủ số lượng</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quản lý kho</CardTitle>
                <CardDescription>
                  Công cụ quản lý kho hàng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Xem chi tiết kho
                </Button>
                <Button className="w-full" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Báo cáo tồn kho
                </Button>
                <Button className="w-full" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt kho
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
