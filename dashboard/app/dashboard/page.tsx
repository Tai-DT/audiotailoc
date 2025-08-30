"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { MainLayout } from "../../components/layout/main-layout"
import { Users, Music, TrendingUp, DollarSign, Calendar, MessageSquare, Package, ShoppingCart } from "lucide-react"
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - will connect to real API later
    const mockData = {
      sales: {
        totalRevenue: 125000000, // 125M VND
        totalOrders: 156,
        averageOrderValue: 800000, // 800K VND
        conversionRate: 0.032
      },
      customers: {
        totalCustomers: 1234,
        newCustomers: 45,
        returningCustomers: 89,
        customerRetention: 0.78
      },
      inventory: {
        totalProducts: 89,
        lowStockProducts: 5,
        outOfStockProducts: 2,
        inventoryValue: 450000000 // 450M VND
      },
      recentOrders: [
        { id: '1', orderNo: 'ATL-001', customerName: 'Nguyễn Văn A', totalCents: 299000000, status: 'COMPLETED', createdAt: new Date() },
        { id: '2', orderNo: 'ATL-002', customerName: 'Trần Thị B', totalCents: 199000000, status: 'PENDING', createdAt: new Date() }
      ]
    };
    
    setTimeout(() => {
      setDashboardData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(priceCents / 100);
  };
  return (
    <MainLayout>
      <div className="flex-1 space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Tổng quan về hoạt động của AudioTailoc
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.customers?.totalCustomers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardData?.customers?.newCustomers || 0} khách mới
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.inventory?.totalProducts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.inventory?.lowStockProducts || 0} sắp hết hàng
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(dashboardData?.sales?.totalRevenue * 100 || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Trung bình {formatPrice(dashboardData?.sales?.averageOrderValue * 100 || 0)}/đơn
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.sales?.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Tỷ lệ chuyển đổi {((dashboardData?.sales?.conversionRate || 0) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
              <CardDescription>
                Biểu đồ doanh thu trong 12 tháng gần đây
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chart component sẽ được thêm vào đây
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>
                Các hoạt động mới nhất trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">User mới đăng ký</p>
                    <p className="text-xs text-muted-foreground">2 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Booking mới</p>
                    <p className="text-xs text-muted-foreground">5 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Thanh toán thành công</p>
                    <p className="text-xs text-muted-foreground">10 phút trước</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Danh sách các hoạt động mới nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center space-x-4 rounded-lg border p-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Hoạt động #{item}</p>
                    <p className="text-xs text-muted-foreground">
                      Mô tả chi tiết về hoạt động này
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item * 5} phút trước
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
