'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  useAuth,
  useUpdateProfile,
  useChangePassword,
  useExportUserData,
  useDeleteAccount,
  useUserBookings,
  useUserPayments,
  useUploadAvatar
} from '@/lib/hooks/use-auth';
import { useWishlist } from '@/lib/hooks/use-wishlist';
import { AuthGuard } from '@/components/auth/auth-guard';
import Link from 'next/link';
import {
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Camera,
  ShoppingBag,
  Heart,
  Lock,
  Download,
  Trash2,
  Package,
  CreditCard,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

function ProfilePageContent() {
  const { data: user, isLoading: userLoading } = useAuth();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const exportData = useExportUserData();
  const deleteAccount = useDeleteAccount();
  const uploadAvatar = useUploadAvatar();

  const { data: wishlistData } = useWishlist();
  const { data: bookings } = useUserBookings();
  const { data: payments } = useUserPayments();

  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    emailNotifications: true,
    smsNotifications: false,
    promoNotifications: true
  });

  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [deleteConfirmPassword, setDeleteConfirmPassword] = React.useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false);

  const wishlist = wishlistData?.items || [];

  // Initialize form data
  React.useEffect(() => {
    if (user) {
      // Cast user to include optional notification fields that may come from API
      const userData = user as typeof user & {
        emailNotifications?: boolean;
        smsNotifications?: boolean;
        promoNotifications?: boolean;
      };
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        address: userData.address || '',
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
        gender: userData.gender || '',
        emailNotifications: userData.emailNotifications ?? true,
        smsNotifications: userData.smsNotifications ?? false,
        promoNotifications: userData.promoNotifications ?? true
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      setIsEditing(false);
    } catch (_error) {
      // Error handled by mutation
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAvatar.mutateAsync(file);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    try {
      await changePassword.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setIsPasswordDialogOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (_error) { }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount.mutateAsync(deleteConfirmPassword);
      setIsDeleteDialogOpen(false);
    } catch (_error) { }
  };

  if (userLoading || !user) {
    return (
      <div 
        className="flex items-center justify-center min-h-[60vh]"
        role="status"
        aria-label="Đang tải thông tin hồ sơ"
      >
        <Clock className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Đang tải...</span>
      </div>
    );
  }

  const displayName = user.name || user.email || 'Khách hàng';
  const avatarFallback = (displayName.charAt(0) || '?').toUpperCase();
  const completionPercent =
    (Object.values(formData).filter(Boolean).length / Object.values(formData).length) * 100;
  const completionWidthClass =
    completionPercent >= 87.5
      ? 'w-full'
      : completionPercent >= 62.5
        ? 'w-3/4'
        : completionPercent >= 37.5
          ? 'w-1/2'
          : completionPercent >= 12.5
            ? 'w-1/4'
            : 'w-0';

  return (
    <div className="min-h-screen bg-background/50 pb-20">
      <main className="container mx-auto px-4 py-8" aria-labelledby="profile-title">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <header className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-background border p-8">
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start md:space-x-8">
              <div className="relative group cursor-pointer mb-6 md:mb-0">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  <AvatarImage src={user.avatarUrl || user.avatar} alt={displayName} />
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-bold">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    aria-label="Tải ảnh đại diện"
                  />
                </label>
                {uploadAvatar.isPending && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                    <Clock className="w-8 h-8 animate-spin text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h1 id="profile-title" className="text-3xl font-bold tracking-tight">{displayName}</h1>
                  <Badge variant="outline" className="w-fit mx-auto md:mx-0 bg-background/50">
                    {user.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
                  </Badge>
                </div>
                <p className="text-muted-foreground font-medium">{user.email}</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm pt-4">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2" />
                      {user.phone}
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {user.address}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 md:mt-0">
                {!isEditing ? (
                  <Button size="lg" onClick={() => setIsEditing(true)} className="rounded-full shadow-lg" aria-label="Chỉnh sửa thông tin hồ sơ">
                    <Edit className="w-4 h-4 mr-2" aria-hidden="true" />
                    Chỉnh sửa hồ sơ
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button size="lg" onClick={handleSaveProfile} disabled={updateProfile.isPending} className="rounded-full shadow-lg" aria-label="Lưu thay đổi hồ sơ">
                      <Save className="w-4 h-4 mr-2" aria-hidden="true" />
                      {updateProfile.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setIsEditing(false)} className="rounded-full">
                      Hủy
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-background/50 border backdrop-blur p-1 h-14 rounded-xl flex w-full md:w-fit overflow-x-auto no-scrollbar">
              <TabsTrigger value="overview" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Tổng quan
              </TabsTrigger>
              <TabsTrigger value="info" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Hồ sơ chi tiết
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Lịch sử & Đơn hàng
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Bảo mật & Cài đặt
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Chào mừng trở lại, {displayName}!</CardTitle>
                    <CardDescription>Cập nhật những hoạt động gần đây của bạn.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50">
                      <Package className="w-8 h-8 text-orange-600 mb-2" />
                      <div className="text-2xl font-bold">{bookings?.length || 0}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Đơn dịch vụ</div>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                      <ShoppingBag className="w-8 h-8 text-blue-600 mb-2" />
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Đơn hàng</div>
                    </div>
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50">
                      <Heart className="w-8 h-8 text-red-600 mb-2" />
                      <div className="text-2xl font-bold">{wishlist.length}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Yêu thích</div>
                    </div>
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50">
                      <CreditCard className="w-8 h-8 text-green-600 mb-2" />
                      <div className="text-2xl font-bold">{payments?.length || 0}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Thanh toán</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hoàn thành hồ sơ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-primary transition-all duration-500 ${completionWidthClass}`}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hãy cập nhật đầy đủ thông tin để chúng tôi phục vụ bạn tốt hơn!
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        {user.name ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-muted-foreground" />}
                        Họ và tên
                      </li>
                      <li className="flex items-center gap-2">
                        {user.phone ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-muted-foreground" />}
                        Số điện thoại
                      </li>
                      <li className="flex items-center gap-2">
                        {user.avatarUrl || user.avatar ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-muted-foreground" />}
                        Ảnh đại diện
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Recent Wishlist Overview */}
                <Card className="md:col-span-3">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Sản phẩm yêu thích</CardTitle>
                    <Button variant="ghost" asChild>
                      <Link href="/wishlist">Xem tất cả</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {wishlist.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground italic">
                        Bạn chưa có sản phẩm yêu thích nào.
                      </div>
                    ) : (
                      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {wishlist.slice(0, 5).map((item: { id: string; product?: { imageUrl?: string; name?: string; priceCents?: number } }) => (
                          <div key={item.id} className="min-w-[200px] border rounded-xl p-3 bg-muted/30">
                            <div className="aspect-square relative rounded-lg overflow-hidden mb-2 bg-white">
                              <Image
                                src={item.product?.imageUrl || '/placeholder-product.svg'}
                                alt={item.product?.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <h5 className="font-semibold line-clamp-1">{item.product?.name}</h5>
                            <p className="text-primary font-bold">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product?.priceCents / 100)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                  <CardDescription>Các thông tin này được sử dụng cho việc đặt hàng và hỗ trợ khách hàng.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Họ và tên</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Nhập họ và tên"
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Số điện thoại</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Nhập số điện thoại"
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email (Bắt buộc)</Label>
                        <Input value={user.email} disabled className="h-12 bg-muted/50" />
                        <p className="text-xs text-muted-foreground italic pl-1">Bạn không thể thay đổi địa chỉ email chính.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Giới tính</Label>
                        <select
                          id="gender"
                          name="gender"
                          aria-label="Giới tính"
                          className="w-full h-12 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          disabled={!isEditing}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="MALE">Nam</option>
                          <option value="FEMALE">Nữ</option>
                          <option value="OTHER">Khác</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Ngày sinh</Label>
                        <Input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          disabled={!isEditing}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Địa chỉ</Label>
                        <Input
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Địa chỉ giao hàng mặc định"
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lịch sử đặt lịch kỹ thuật</CardTitle>
                    <CardDescription>Danh sách các dịch vụ lắp đặt và sửa chữa bạn đã đặt.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookings && bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking: { id: string; status: string; createdAt: string; service?: { name?: string } }) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h5 className="font-semibold">{booking.service?.name || 'Dịch vụ kỹ thuật'}</h5>
                                <p className="text-sm text-muted-foreground">
                                  Ngày đặt: {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                            </div>
                            <Badge variant={booking.status === 'COMPLETED' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h4 className="font-bold">Chưa có bản ghi nào</h4>
                        <p className="text-muted-foreground">Bạn chưa thực hiện bất kỳ giao dịch nào.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Lịch sử thanh toán</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {payments && payments.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                              <th className="pb-3 px-2">Ngày</th>
                              <th className="pb-3 px-2">Mã GD</th>
                              <th className="pb-3 px-2">Số tiền</th>
                              <th className="pb-3 px-2">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((payment: { id: string; amountCents: number; status: string; createdAt: string; transactionId?: string }) => (
                              <tr key={payment.id} className="border-b last:border-0 hover:bg-muted/20 text-sm">
                                <td className="py-4 px-2">{new Date(payment.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td className="py-4 px-2 font-mono">{payment.transactionId || payment.id.slice(0, 8)}</td>
                                <td className="py-4 px-2 font-bold text-primary">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amountCents / 100)}
                                </td>
                                <td className="py-4 px-2">
                                  <Badge className={payment.status === 'SUCCEEDED' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500'}>
                                    {payment.status === 'SUCCEEDED' ? 'Thành công' : 'Thất bại'}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground italic">
                        Không tìm thấy dữ liệu thanh toán.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Security Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Bảo mật tài khoản
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-xl flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold">Mật khẩu đăng nhập</h5>
                        <p className="text-sm text-muted-foreground">Thay đổi mật khẩu thường xuyên để bảo vệ tài khoản.</p>
                      </div>
                      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline">Đổi mật khẩu</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Thay đổi mật khẩu</DialogTitle>
                            <DialogDescription>Nhập mật khẩu hiện tại và mật khẩu mới của bạn.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="current">Mật khẩu hiện tại</Label>
                              <Input
                                id="current"
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new">Mật khẩu mới</Label>
                              <Input
                                id="new"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm">Xác nhận mật khẩu mới</Label>
                              <Input
                                id="confirm"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Hủy</Button>
                            <Button onClick={handleChangePassword} disabled={changePassword.isPending}>
                              {changePassword.isPending ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="p-4 border rounded-xl flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold">Dữ liệu cá nhân (GDPR)</h5>
                        <p className="text-sm text-muted-foreground">Xuất tất cả dữ liệu tài khoản của bạn ra tệp JSON.</p>
                      </div>
                      <Button variant="outline" onClick={() => exportData.mutate()} disabled={exportData.isPending}>
                        <Download className="w-4 h-4 mr-2" />
                        Xuất dữ liệu
                      </Button>
                    </div>

                    <Separator className="my-2" />

                    <div className="pt-4">
                      <h5 className="font-semibold text-destructive mb-2">Vùng nguy hiểm</h5>
                      <p className="text-sm text-muted-foreground mb-4">
                        Khi bạn xóa tài khoản, toàn bộ dữ liệu sẽ bị gỡ vĩnh viễn và không thể khôi phục.
                      </p>
                      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa tài khoản của tôi
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-destructive">Xác nhận xóa tài khoản</DialogTitle>
                            <DialogDescription>
                              Hành động này không thể hoàn tác. Vui lòng nhập mật khẩu để xác nhận.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Label htmlFor="confirm-pass">Mật khẩu xác nhận</Label>
                            <Input
                              id="confirm-pass"
                              type="password"
                              value={deleteConfirmPassword}
                              onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                              placeholder="Nhập mật khẩu của bạn"
                            />
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteAccount}
                              disabled={!deleteConfirmPassword || deleteAccount.isPending}
                            >
                              {deleteAccount.isPending ? 'Đang thực hiện...' : 'Tôi hiểu, hãy xóa tài khoản'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                {/* Notifications Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Cài đặt thông báo
                    </CardTitle>
                    <CardDescription>Tùy chỉnh các loại thông báo bạn muốn nhận.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="email-notifications" className="font-semibold cursor-pointer">Thông báo qua Email</Label>
                        <p id="email-notifications-desc" className="text-sm text-muted-foreground">Nhận tin nhắn về trạng thái đơn hàng và cập nhật hệ thống.</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={formData.emailNotifications}
                        onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                        aria-describedby="email-notifications-desc"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="promo-notifications" className="font-semibold cursor-pointer">Khuyến mãi & Ưu đãi</Label>
                        <p id="promo-notifications-desc" className="text-sm text-muted-foreground">Nhận thông tin về các chương trình giảm giá và quà tặng mới.</p>
                      </div>
                      <Switch
                        id="promo-notifications"
                        checked={formData.promoNotifications}
                        onCheckedChange={(checked) => handleInputChange('promoNotifications', checked)}
                        aria-describedby="promo-notifications-desc"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="sms-notifications" className="font-semibold cursor-pointer">Thông báo qua SMS</Label>
                        <p id="sms-notifications-desc" className="text-sm text-muted-foreground">Nhận mã xác thực và thông báo khẩn cấp (có thể tính phí).</p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={formData.smsNotifications}
                        onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                        aria-describedby="sms-notifications-desc"
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        size="lg"
                        onClick={handleSaveProfile}
                        className="w-full"
                        disabled={updateProfile.isPending}
                      >
                        Lưu cài đặt thông báo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfilePageContent />
    </AuthGuard>
  );
}
