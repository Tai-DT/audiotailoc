'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth, useUpdateProfile } from '@/lib/hooks/use-auth';
import { authStorage } from '@/lib/auth-storage';
import { useOrders, useAddToCart } from '@/lib/hooks/use-api';
import { useWishlist, useRemoveFromWishlist } from '@/lib/hooks/use-wishlist';
import { Order, OrderItem, WishlistItem } from '@/lib/types';
import { toast } from 'react-hot-toast';
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
  Settings,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  DollarSign,
  ShoppingCart,
  Trash2,
  Star
} from 'lucide-react';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-500', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-500', icon: Package },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-orange-500', icon: Package },
  SHIPPED: { label: 'Đang giao', color: 'bg-purple-500', icon: Truck },
  DELIVERED: { label: 'Đã giao', color: 'bg-green-500', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-500', icon: XCircle },
};

export default function ProfilePage() {
  const { user, isLoading: authLoading, refetch } = useAuth();
  
  // DEBUG LOGS
  React.useEffect(() => {
    console.log('[DEBUG_PROFILE] Auth State:', {
      user,
      authLoading,
      isAuthenticated: !!user,
      token: authStorage.getAccessToken() ? 'Present' : 'Missing'
    });
  }, [user, authLoading]);

  const updateProfileMutation = useUpdateProfile();
  const isAuthenticated = !!user;
  const router = useRouter();

  // Force refetch of user data if we have token but no user yet
  // This handles the case where page navigated directly to /profile with token in localStorage
  React.useEffect(() => {
    const hasToken = Boolean(authStorage.getAccessToken());
    if (hasToken && !user && !authLoading && refetch) {
      console.log('[DEBUG_PROFILE] Triggering manual refetch...');
      refetch().catch(err => console.error('[DEBUG_PROFILE] Refetch failed:', err));
    }
  }, [user, authLoading, refetch]);

  // Track if we've already attempted redirect to avoid multiple redirects
  const hasRedirectedRef = React.useRef(false);
  const [isEditing, setIsEditing] = React.useState(false);

  // Data fetching hooks
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useOrders();
  const orders = ordersData?.items || [];

  const { data: wishlistData, isLoading: wishlistLoading, error: wishlistError } = useWishlist();
  const wishlist = wishlistData?.items || [];
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  // Helper functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Wishlist handlers
  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlistMutation.mutateAsync(productId);
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch {
      toast.error('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      toast.success('Đã thêm vào giỏ hàng');
    } catch {
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: ''
  });

  // Use ref to track retry interval and current user state
  const retryIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const userRef = React.useRef(user);

  // Update user ref when user changes
  React.useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Redirect if not authenticated (only after auth check is complete)
  React.useEffect(() => {
    // Reset redirect flag when auth state changes
    if (isAuthenticated) {
      hasRedirectedRef.current = false;
      // Clear any existing interval when authenticated
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
      return;
    }

    // Clear any existing interval
    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }

    // Only redirect if:
    // 1. Auth check is complete (not loading)
    // 2. User is not authenticated
    // 3. We haven't already redirected
    if (!authLoading && !isAuthenticated && !hasRedirectedRef.current) {
      // Check token in storage as a fallback
      const hasToken = Boolean(authStorage.getAccessToken());

      // If no token, definitely redirect
      if (!hasToken) {
        hasRedirectedRef.current = true;
        const timer = setTimeout(() => {
          router.push('/login?redirect=' + encodeURIComponent('/profile'));
        }, 100);
        return () => clearTimeout(timer);
      }

      // If token exists but user is null, wait a bit more for query to complete
      // This handles the case where token was just set but query hasn't completed yet
      // Give it up to 5 seconds for the query to complete (allows React Query retry to work)
      let retryCount = 0;
      const maxRetries = 25; // 25 retries * 200ms = 5 seconds max wait

      retryIntervalRef.current = setInterval(() => {
        retryCount++;
        // Check current user state from ref (always up-to-date)
        const currentUser = userRef.current;
        const currentToken = authStorage.getAccessToken();

        // If user is now available, stop retrying
        if (currentUser) {
          if (retryIntervalRef.current) {
            clearInterval(retryIntervalRef.current);
            retryIntervalRef.current = null;
          }
          hasRedirectedRef.current = false;
          return;
        }

        // If token is gone, redirect immediately
        if (!currentToken) {
          if (retryIntervalRef.current) {
            clearInterval(retryIntervalRef.current);
            retryIntervalRef.current = null;
          }
          if (!hasRedirectedRef.current) {
            hasRedirectedRef.current = true;
            router.push('/login?redirect=' + encodeURIComponent('/profile'));
          }
          return;
        }

        // If max retries reached and still no user, redirect
        if (retryCount >= maxRetries) {
          if (retryIntervalRef.current) {
            clearInterval(retryIntervalRef.current);
            retryIntervalRef.current = null;
          }
          if (!hasRedirectedRef.current) {
            hasRedirectedRef.current = true;
            router.push('/login?redirect=' + encodeURIComponent('/profile'));
          }
        }
      }, 200);

      return () => {
        if (retryIntervalRef.current) {
          clearInterval(retryIntervalRef.current);
          retryIntervalRef.current = null;
        }
      };
    }
  }, [authLoading, isAuthenticated, router, user]);

  // Initialize form data when user data is available
  React.useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || ''
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
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender
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
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || ''
      });
    }
    setIsEditing(false);
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Đang tải...</h1>
            <p className="text-muted-foreground">Đang kiểm tra xác thực...</p>
          </div>
        </main>
      </div>
    );
  }

  // Redirect if not authenticated (this should be handled by useEffect, but show message as fallback)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Đang chuyển hướng...</h1>
            <p className="text-muted-foreground">Vui lòng đăng nhập để truy cập trang này</p>
          </div>
        </main>
      </div>
    );
  }

  const displayName = user.name || user.email || 'Khách hàng';
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
                    {user.createdAt && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Tham gia {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
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

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                      {isEditing ? (
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border rounded">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Giới tính</Label>
                      {isEditing ? (
                        <select
                          id="gender"
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border rounded">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {formData.gender === 'male' ? 'Nam' :
                              formData.gender === 'female' ? 'Nữ' :
                                formData.gender === 'other' ? 'Khác' : 'Chưa cập nhật'}
                          </span>
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
                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
                      <h3 className="text-lg font-semibold mb-2">Đang tải đơn hàng...</h3>
                    </div>
                  ) : ordersError ? (
                    <div className="text-center py-8">
                      <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-red-600">Có lỗi xảy ra</h3>
                      <p className="text-muted-foreground mb-4">
                        Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.
                      </p>
                    </div>
                  ) : !orders || orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng nào</h3>
                      <p className="text-muted-foreground mb-4">
                        Bạn chưa đặt đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!
                      </p>
                      <Button asChild>
                        <Link href="/products">
                          Khám phá sản phẩm
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order: Order) => {
                        const normalizedStatus = (order.status?.toUpperCase?.() || 'PENDING') as OrderStatus;
                        const status = statusConfig[normalizedStatus] ?? statusConfig.PENDING;
                        const StatusIcon = status.icon;

                        return (
                          <Card key={order.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <StatusIcon className={`w-5 h-5 ${status.color} text-white rounded-full p-1`} />
                                    <Badge variant="outline" className="flex items-center space-x-1">
                                      <span>{status.label}</span>
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    {formatDate(order.createdAt)}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-semibold text-green-600">
                                    {formatPrice(order.totalCents / 100)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Mã đơn: #{order.orderNo || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent>
                              {/* Order Items */}
                              <div className="space-y-4 mb-6">
                                {order.items?.map((item: OrderItem) => (
                                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                      <Package className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold">{item.product?.name || 'Sản phẩm'}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        Số lượng: {item.quantity}
                                      </p>
                                      <p className="text-sm font-medium">
                                        {formatPrice(Number(item.price))}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <Separator className="mb-4" />

                              {/* Order Actions */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  {order.shippingAddress && (
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="w-4 h-4" />
                                      <span>{order.shippingAddress}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>Thanh toán khi nhận hàng</span>
                                  </div>
                                </div>

                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/orders/${order.id}`}>
                                      <Eye className="w-4 h-4 mr-1" />
                                      Chi tiết
                                    </Link>
                                  </Button>
                                  {order.status === 'COMPLETED' && (
                                    <Button variant="outline" size="sm">
                                      Đánh giá
                                    </Button>
                                  )}
                                  {['PENDING', 'PROCESSING'].includes(order.status) && (
                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                      Hủy đơn
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
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
                  {wishlistLoading ? (
                    <div className="text-center py-8">
                      <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
                      <h3 className="text-lg font-semibold mb-2">Đang tải danh sách yêu thích...</h3>
                    </div>
                  ) : wishlistError ? (
                    <div className="text-center py-8">
                      <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-red-600">Có lỗi xảy ra</h3>
                      <p className="text-muted-foreground mb-4">
                        Không thể tải danh sách yêu thích. Vui lòng thử lại sau.
                      </p>
                    </div>
                  ) : !wishlist || wishlist.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Danh sách trống</h3>
                      <p className="text-muted-foreground mb-4">
                        Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.
                      </p>
                      <Button asChild>
                        <Link href="/products">
                          Khám phá sản phẩm
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((item: WishlistItem) => (
                        <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                          <CardContent className="p-0">
                            {/* Product Image */}
                            <div className="relative aspect-square overflow-hidden rounded-t-lg">
                              <Image
                                src={item.product?.imageUrl || '/placeholder-product.svg'}
                                alt={item.product?.name || 'Sản phẩm'}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-3 right-3">
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  className="w-8 h-8 rounded-full"
                                  onClick={() => handleRemoveFromWishlist(item.productId)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                              <Link href={`/products/${item.product?.slug}`}>
                                <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                                  {item.product?.name || 'Sản phẩm'}
                                </h3>
                              </Link>

                              <div className="flex items-center space-x-2 mb-3">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm text-muted-foreground">
                                    4.5
                                  </span>
                                </div>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">
                                  0 đánh giá
                                </span>
                              </div>

                              <div className="flex items-center justify-between mb-4">
                                <div className="flex flex-col">
                                  <span className="text-lg font-bold text-green-600">
                                    {formatPrice((item.product?.priceCents || 0) / 100)}
                                  </span>
                                  {item.product?.originalPriceCents && item.product.priceCents && item.product.originalPriceCents > item.product.priceCents && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      {formatPrice(item.product.originalPriceCents / 100)}
                                    </span>
                                  )}
                                </div>
                                {(item.product?.stockQuantity || 0) > 0 ? (
                                  <Badge variant="secondary" className="text-green-600">
                                    <Package className="w-3 h-3 mr-1" />
                                    Còn hàng
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">
                                    Hết hàng
                                  </Badge>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex space-x-2">
                                <Button
                                  className="flex-1"
                                  onClick={() => handleAddToCart(item.productId)}
                                  disabled={item.product?.stockQuantity === 0}
                                >
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Thêm vào giỏ
                                </Button>
                                <Button variant="outline" size="icon" asChild>
                                  <Link href={`/products/${item.product?.slug}`}>
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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
