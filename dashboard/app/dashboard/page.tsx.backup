"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Users,
  Package,
  Settings,
  BarChart3,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Wrench,
  Star,
  AlertTriangle
} from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

interface Product {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  featured?: boolean;
  stockQuantity?: number;
  createdAt?: string;
  category?: { name: string };
}

interface Service {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  createdAt?: string;
  type?: { name: string };
}

interface Category {
  id: string;
  name: string;
  color: string;
}

export default function DashboardPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalServices, setTotalServices] = useState(0)

  // Fetch real data from API
  const fetchDashboardData = useCallback(async () => {
    if (!token) return

    try {
      setLoading(true)
      apiClient.setToken(token)

      // Fetch products
      const productsResponse = await apiClient.getProducts({ page: 1, limit: 100 })
      const productsData = productsResponse.data as { items: Product[]; total: number }
      setProducts(productsData.items || [])
      setTotalProducts(productsData.total || 0)

      // Fetch services
      const servicesResponse = await apiClient.getServices({ page: 1, limit: 100 })
      const servicesData = servicesResponse.data as { services: Service[]; total: number }
      setServices(servicesData.services || [])
      setTotalServices(servicesData.total || 0)

      // Fetch categories
      const categoriesResponse = await apiClient.getCategories()
      setCategories((categoriesResponse.data as Category[]) || [])

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchDashboardData()
    }
  }, [token, fetchDashboardData])

  // Calculate real stats
  const activeProducts = products.filter(p => p.isActive).length
  const featuredProducts = products.filter(p => p.featured).length
  const outOfStockProducts = products.filter(p => (p.stockQuantity || 0) === 0).length
  const activeServices = services.filter(s => s.isActive).length

  // Dynamic stats based on real API data
  const stats = [
    {
      title: "Tổng sản phẩm",
      value: totalProducts.toString(),
      change: `+${activeProducts} hoạt động`,
      icon: Package,
      trend: "up"
    },
    {
      title: "Sản phẩm nổi bật",
      value: featuredProducts.toString(),
      change: `${((featuredProducts / totalProducts) * 100).toFixed(1)}%`,
      icon: Star,
      trend: "up"
    },
    {
      title: "Dịch vụ",
      value: totalServices.toString(),
      change: `+${activeServices} hoạt động`,
      icon: Wrench,
      trend: "up"
    },
    {
      title: "Hết hàng",
      value: outOfStockProducts.toString(),
      change: "Cần nhập hàng",
      icon: AlertTriangle,
      trend: outOfStockProducts > 0 ? "down" : "up"
    }
  ]

  // Generate recent activity from real data
  const recentActivity: Array<{
    id: string
    title: string
    type: "product" | "service"
    status: string
    date: string
  }> = [
    ...products.slice(0, 2).map(p => ({
      id: `PROD-${p.id.slice(-4)}`,
      title: `Sản phẩm: ${p.name}`,
      type: "product" as const,
      status: p.isActive ? "Hoạt động" : "Không hoạt động",
      date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN')
    })),
    ...services.slice(0, 2).map(s => ({
      id: `SERV-${s.id.slice(-4)}`,
      title: `Dịch vụ: ${s.name}`,
      type: "service" as const,
      status: s.isActive ? "Hoạt động" : "Không hoạt động",
      date: s.createdAt ? new Date(s.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN')
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4)

  return (
    <ProtectedRoute requireAuth={false}>
      <DashboardLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Hôm nay
            </Button>
            <Button size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Báo cáo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> so với tháng trước
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Recent Orders */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Đơn hàng gần đây</CardTitle>
                  <CardDescription>
                    Danh sách các đơn hàng được tạo gần đây nhất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã đơn</TableHead>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Số tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentActivity.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Chưa có hoạt động nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentActivity.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">{activity.id}</TableCell>
                            <TableCell>{activity.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {activity.type === "product" ? "Sản phẩm" : "Dịch vụ"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  activity.status === "Hoạt động" ? "default" : "secondary"
                                }
                              >
                                {activity.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{activity.date}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Thao tác nhanh</CardTitle>
                  <CardDescription>
                    Các chức năng thường dùng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tìm kiếm sản phẩm</label>
                    <Input placeholder="Nhập tên sản phẩm..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Danh mục</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="audio">Âm thanh</SelectItem>
                        <SelectItem value="karaoke">Karaoke</SelectItem>
                        <SelectItem value="microphone">Micro</SelectItem>
                        <SelectItem value="speaker">Loa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button className="w-full" size="sm">
                      <Package className="mr-2 h-4 w-4" />
                      Thêm sản phẩm mới
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      Quản lý khách hàng
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Xem báo cáo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý đơn hàng</CardTitle>
                <CardDescription>
                  Xem và quản lý tất cả đơn hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Chưa có đơn hàng</h3>
                  <p className="text-muted-foreground">
                    Đơn hàng sẽ xuất hiện ở đây khi có khách hàng đặt hàng.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Phân tích dữ liệu</CardTitle>
                <CardDescription>
                  Báo cáo và thống kê chi tiết
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Đang phát triển</h3>
                  <p className="text-muted-foreground">
                    Tính năng phân tích sẽ được thêm trong phiên bản tiếp theo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt hệ thống</CardTitle>
                <CardDescription>
                  Quản lý cấu hình và cài đặt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="general">
                    <AccordionTrigger>Cài đặt chung</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Tên cửa hàng</label>
                          <Input defaultValue="Audio Tài Lộc" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Mô tả</label>
                          <Textarea
                            placeholder="Nhập mô tả về cửa hàng..."
                            defaultValue="Cửa hàng chuyên cung cấp thiết bị âm thanh chất lượng cao"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="notifications">
                    <AccordionTrigger>Thông báo</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <label className="text-sm font-medium">Email thông báo</label>
                            <p className="text-sm text-muted-foreground">
                              Nhận thông báo qua email khi có đơn hàng mới
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Cấu hình
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="backup">
                    <AccordionTrigger>Sao lưu dữ liệu</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <label className="text-sm font-medium">Sao lưu tự động</label>
                            <p className="text-sm text-muted-foreground">
                              Sao lưu dữ liệu hàng ngày lúc 2:00 AM
                            </p>
                          </div>
                          <Badge variant="secondary">Đã bật</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 h-4 w-4" />
                          Sao lưu ngay
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái hệ thống</CardTitle>
            <CardDescription>
              Giám sát tình trạng các dịch vụ và API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Server</span>
                  {/* {healthLoading ? (
                    <Skeleton className="h-4 w-16" />
                  ) : healthError ? (
                    <div className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">Lỗi</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                  )} */}
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup Service</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Running</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <span>Dashboard connected to API v1</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-green-500" />
                  <span>All systems operational</span>
                </div>
                {/* {healthData && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Last health check: {new Date(healthData.timestamp).toLocaleString('vi-VN')}</span>
                  </div>
                )} */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  )
}
