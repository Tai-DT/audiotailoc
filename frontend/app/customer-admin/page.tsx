'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  User,
  Settings,
  CreditCard,
  Calendar,
  Bell,
  Shield,
  Key,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import toast from 'react-hot-toast';

// Mock user data
const mockUser = {
  id: '1',
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '+84 123 456 789',
  avatar: null,
  address: '123 Đường ABC, Quận 1, TP.HCM',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  createdAt: '2023-01-15T10:00:00Z',
  lastLogin: '2024-01-20T14:30:00Z',
  emailVerified: true,
  phoneVerified: true,
  preferences: {
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh'
  }
};

export default function CustomerAdminPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: ''
  });

  // Mock data for now - replace with real hooks when available
  const user = mockUser;
  const bookings: { id: string; serviceName: string; date: string; technicianName: string; status: string; price: number }[] = [];
  const payments: { id: string; description: string; createdAt: string; transactionId: string; status: string; amount: number }[] = [];

  React.useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || ''
    });
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      // TODO: Implement profile update API call
      setIsEditing(false);
      toast.success('Thông tin đã được cập nhật thành công!');
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || ''
    });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    // TODO: Implement password change
    toast.success('Mật khẩu đã được thay đổi thành công!');
  };

  const handleExportData = () => {
    // TODO: Implement data export
    toast.success('Dữ liệu của bạn sẽ được gửi đến email trong vài phút!');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with confirmation
    toast.error('Tính năng này đang được phát triển!');
  };

  const recentBookings = bookings.slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quản lý tài khoản</h1>
        <p className="text-gray-600">
          Quản lý thông tin cá nhân, cài đặt và hoạt động tài khoản của bạn
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Hồ sơ</span>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Đặt lịch</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Thanh toán</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Cài đặt</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Bảo mật</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin cá nhân
                </CardTitle>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Lưu
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Hủy
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="text-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Thay đổi ảnh
                    </Button>
                    <p className="text-sm text-gray-600 mt-1">
                      JPG, PNG hoặc GIF. Tối đa 2MB.
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={!isEditing}
                    />
                    {user.emailVerified && (
                      <Badge variant="secondary" className="text-green-600">
                        ✓ Đã xác thực
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                    {user.phoneVerified && (
                      <Badge variant="secondary" className="text-green-600">
                        ✓ Đã xác thực
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({...formData, gender: value})}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Account Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Ngày tạo tài khoản:</span>
                  <p className="font-medium">
                    {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: vi })}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Đăng nhập lần cuối:</span>
                  <p className="font-medium">
                    {format(new Date(user.lastLogin), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Trạng thái tài khoản:</span>
                  <p className="font-medium text-green-600">Hoạt động</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Lịch sử đặt lịch
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{booking.serviceName}</h4>
                        <p className="text-sm text-gray-600">
                          {format(new Date(booking.date), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </p>
                        <p className="text-sm text-gray-600">{booking.technicianName}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          booking.status === 'confirmed' ? 'default' :
                          booking.status === 'completed' ? 'secondary' :
                          booking.status === 'cancelled' ? 'destructive' : 'outline'
                        }>
                          {booking.status === 'confirmed' ? 'Đã xác nhận' :
                           booking.status === 'completed' ? 'Hoàn thành' :
                           booking.status === 'cancelled' ? 'Đã hủy' : 'Chờ xác nhận'}
                        </Badge>
                        <p className="text-sm font-medium mt-1">
                          {booking.price?.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Link href="/booking-history">
                      <Button variant="outline">Xem tất cả đặt lịch</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Chưa có lịch đặt nào</h3>
                  <p className="text-gray-600 mb-4">
                    Bạn chưa có lịch đặt dịch vụ nào.
                  </p>
                  <Link href="/services">
                    <Button>Đặt lịch ngay</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Lịch sử thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentPayments.length > 0 ? (
                <div className="space-y-4">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{payment.description}</h4>
                        <p className="text-sm text-gray-600">
                          {format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </p>
                        <p className="text-sm text-gray-600">Mã giao dịch: {payment.transactionId}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          payment.status === 'completed' ? 'secondary' :
                          payment.status === 'pending' ? 'outline' :
                          payment.status === 'failed' ? 'destructive' : 'outline'
                        }>
                          {payment.status === 'completed' ? 'Thành công' :
                           payment.status === 'pending' ? 'Đang xử lý' :
                           payment.status === 'failed' ? 'Thất bại' : payment.status}
                        </Badge>
                        <p className="text-sm font-medium mt-1">
                          {payment.amount?.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Link href="/payment-history">
                      <Button variant="outline">Xem tất cả thanh toán</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Chưa có thanh toán nào</h3>
                  <p className="text-gray-600">
                    Lịch sử thanh toán của bạn sẽ hiển thị ở đây.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Thông báo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Thông báo qua email</Label>
                  <p className="text-sm text-gray-600">
                    Nhận thông báo về đặt lịch, thanh toán và cập nhật dịch vụ
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={user.preferences?.notifications?.email}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-notifications">Thông báo qua SMS</Label>
                  <p className="text-sm text-gray-600">
                    Nhận thông báo khẩn cấp qua tin nhắn
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={user.preferences?.notifications?.sms}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Thông báo đẩy</Label>
                  <p className="text-sm text-gray-600">
                    Nhận thông báo trên trình duyệt và ứng dụng
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={user.preferences?.notifications?.push}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tùy chọn chung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Ngôn ngữ</Label>
                  <Select defaultValue={user.preferences?.language || 'vi'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Múi giờ</Label>
                  <Select defaultValue={user.preferences?.timezone || 'Asia/Ho_Chi_Minh'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">(GMT+7) Asia/Ho_Chi_Minh</SelectItem>
                      <SelectItem value="Asia/Hanoi">(GMT+7) Asia/Hanoi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Đổi mật khẩu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input
                  id="new-password"
                  type="password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirm-password"
                  type="password"
                />
              </div>

              <Button onClick={handleChangePassword} className="w-full">
                Đổi mật khẩu
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Xuất dữ liệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Tải xuống tất cả dữ liệu cá nhân của bạn bao gồm hồ sơ, lịch sử đặt lịch và thanh toán.
              </p>
              <Button onClick={handleExportData} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Xuất dữ liệu
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Xóa tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
              </p>
              <Button onClick={handleDeleteAccount} variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tài khoản
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}