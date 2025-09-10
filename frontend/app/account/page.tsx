'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, Package, Heart, MapPin, Bell, ShieldCheck, LogOut, 
  ChevronRight, Edit, Plus, Trash2, Star, Clock, CreditCard,
  TrendingUp, Award, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useAuthStore, useOrderStore } from '@/lib/store';
import { toast } from 'sonner';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { orders, getOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account');
      return;
    }
    getOrders();
  }, [isAuthenticated, router, getOrders]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đã đăng xuất thành công');
      router.push('/');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Đơn hàng', value: orders.length, icon: Package, color: 'text-blue-600' },
    { label: 'Yêu thích', value: 12, icon: Heart, color: 'text-red-600' },
    { label: 'Điểm thưởng', value: 850, icon: Award, color: 'text-yellow-600' },
    { label: 'Cấp độ', value: 'Gold', icon: TrendingUp, color: 'text-orange-600' },
  ];

  const menuItems = [
    { label: 'Tổng quan', value: 'overview', icon: User },
    { label: 'Đơn hàng', value: 'orders', icon: Package },
    { label: 'Sản phẩm yêu thích', value: 'wishlist', icon: Heart },
    { label: 'Địa chỉ', value: 'addresses', icon: MapPin },
    { label: 'Phương thức thanh toán', value: 'payment', icon: CreditCard },
    { label: 'Thông báo', value: 'notifications', icon: Bell },
    { label: 'Bảo mật', value: 'security', icon: ShieldCheck },
    { label: 'Cài đặt', value: 'settings', icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tài khoản của tôi</h1>
        <p className="text-gray-600">Quản lý thông tin cá nhân và đơn hàng của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* User Profile Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/images/avatar-placeholder.jpg" alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <Badge className="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  Gold Member
                </Badge>
                
                {/* Member Progress */}
                <div className="w-full mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Tiến độ cấp độ</span>
                    <span className="font-medium">850/1000</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Còn 150 điểm để lên Platinum</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Menu */}
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1 p-2">
                {menuItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setActiveTab(item.value)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors ${
                      activeTab === item.value ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
                
                <Separator className="my-2" />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Đăng xuất
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="hidden">
              {menuItems.map((item) => (
                <TabsTrigger key={item.value} value={item.value}>{item.label}</TabsTrigger>
              ))}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Đơn hàng gần đây</CardTitle>
                  <CardDescription>5 đơn hàng mới nhất của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">#{order.orderNo}</span>
                              <Badge variant={order.status === 'DELIVERED' ? 'default' : order.status === 'PROCESSING' ? 'secondary' : order.status === 'CANCELLED' ? 'destructive' : 'outline'}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalCents / 100)}
                            </p>
                            <Link href={`/orders/${order.id}`} className="text-sm text-orange-600 hover:text-orange-700">Xem chi tiết →</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Bạn chưa có đơn hàng nào</p>
                      <Button asChild className="mt-4">
                        <Link href="/products">Mua sắm ngay</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Thao tác nhanh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-auto flex-col py-4" asChild>
                      <Link href="/orders">
                        <Package className="h-6 w-6 mb-2" />
                        <span className="text-xs">Đơn hàng</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto flex-col py-4" asChild>
                      <Link href="/wishlist">
                        <Heart className="h-6 w-6 mb-2" />
                        <span className="text-xs">Yêu thích</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto flex-col py-4" asChild>
                      <Link href="/support">
                        <Bell className="h-6 w-6 mb-2" />
                        <span className="text-xs">Hỗ trợ</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto flex-col py-4" asChild>
                      <Link href="/products">
                        <TrendingUp className="h-6 w-6 mb-2" />
                        <span className="text-xs">Mua sắm</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử đơn hàng</CardTitle>
                  <CardDescription>Quản lý và theo dõi tất cả đơn hàng của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-semibold text-lg">Đơn hàng #{order.orderNo}</span>
                              <p className="text-sm text-gray-600">Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                            <Badge variant={order.status === 'DELIVERED' ? 'default' : order.status === 'PROCESSING' ? 'secondary' : order.status === 'CANCELLED' ? 'destructive' : 'outline'}>
                              {order.status}
                            </Badge>
                          </div>
                          <Separator className="my-3" />
                          <div className="space-y-2">
                            {order.items.slice(0, 2).map((item) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <div className="flex-1">
                                  <p className="font-medium">{item.name || 'Sản phẩm'}</p>
                                  <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                </div>
                                <p className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price / 100)}</p>
                              </div>
                            ))}
                            {order.items.length > 2 && (<p className="text-sm text-gray-600">+{order.items.length - 2} sản phẩm khác</p>)}
                          </div>
                          <Separator className="my-3" />
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Tổng cộng</p>
                              <p className="text-lg font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalCents / 100)}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/orders/${order.id}`}>Xem chi tiết</Link>
                              </Button>
                              {order.status === 'DELIVERED' && (<Button variant="outline" size="sm">Đánh giá</Button>)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="mb-4">Bạn chưa có đơn hàng nào</p>
                      <Button asChild>
                        <Link href="/products">Bắt đầu mua sắm</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs - placeholder content */}
            {['wishlist', 'addresses', 'payment', 'notifications', 'security', 'settings'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <CardHeader>
                    <CardTitle>{menuItems.find(item => item.value === tab)?.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <p>Tính năng này đang được phát triển</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

