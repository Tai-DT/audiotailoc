'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth, useUpdateProfile } from '@/lib/hooks/use-auth';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  ShoppingBag,
  Heart,
  Settings
} from 'lucide-react';

export default function ProfilePage() {
  const { data: user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const isAuthenticated = !!user;
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: ''
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Initialize form data when user data is available
  React.useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: '', // TODO: Add address field to user model
        dateOfBirth: '', // TODO: Add dateOfBirth field to user model
        gender: '' // TODO: Add gender field to user model
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        name: formData.fullName,
        phone: formData.phone
      });
      setIsEditing(false);
    } catch {
      // Error handling is managed inside the mutation
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        fullName: user.name || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: '',
        dateOfBirth: '',
        gender: ''
      });
    }
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Đang tải...</h1>
          </div>
        </main>
      </div>
    );
  }

  const displayName = user.name || user.name || user.email || 'Khách hàng';
  const avatarFallback = (displayName.charAt(0) || '?').toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar || undefined} alt={displayName} />
                    <AvatarFallback className="text-2xl">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                    <h1 className="text-2xl font-bold">{displayName}</h1>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{user.email}</p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Tham gia {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {user.role === 'ADMIN' && (
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4" />
                        <span>Quyền quản trị</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Lưu
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        <X className="w-4 h-4 mr-2" />
                        Hủy
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Thông tin</TabsTrigger>
              <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
              <TabsTrigger value="wishlist">Yêu thích</TabsTrigger>
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên</Label>
                      {isEditing ? (
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border rounded">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{user.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center space-x-2 p-2 border rounded bg-muted">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email không thể thay đổi
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border rounded">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{user.phone || 'Chưa cập nhật'}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Địa chỉ</Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Nhập địa chỉ của bạn"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border rounded">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{formData.address || 'Chưa cập nhật'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-muted-foreground mb-4">
                      Bạn chưa đặt đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!
                    </p>
                    <Button>
                      Khám phá sản phẩm
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist */}
            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách yêu thích</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Danh sách trống</h3>
                    <p className="text-muted-foreground mb-4">
                      Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.
                    </p>
                    <Button>
                      Khám phá sản phẩm
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt tài khoản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Bảo mật</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Đổi mật khẩu
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Cài đặt bảo mật
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Thông báo</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-orders">Email thông báo đơn hàng</Label>
                        <input 
                          type="checkbox" 
                          id="notify-orders"
                          defaultChecked 
                          className="rounded"
                          aria-label="Nhận email thông báo đơn hàng"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-promotions">Khuyến mãi và ưu đãi</Label>
                        <input 
                          type="checkbox" 
                          id="notify-promotions"
                          defaultChecked 
                          className="rounded"
                          aria-label="Nhận thông báo về khuyến mãi và ưu đãi"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-updates">Cập nhật sản phẩm</Label>
                        <input 
                          type="checkbox" 
                          id="notify-updates"
                          className="rounded"
                          aria-label="Nhận thông báo về cập nhật sản phẩm mới"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
