'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Search,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useBookings, useCancelBooking } from '@/lib/hooks/use-bookings';
import { useAuth } from '@/lib/hooks/use-auth';
import { ServiceBooking } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function BookingHistoryPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);
  
  const filters = {
    ...(statusFilter !== 'all' && { status: statusFilter as any }),
  };
  
  const { data: bookingsData, isLoading, error } = useBookings(filters);
  const cancelBookingMutation = useCancelBooking();
  
  const bookings = bookingsData?.items || [];

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent('/booking-history'));
    }
  }, [authLoading, isAuthenticated, router]);

  const filteredBookings = bookings.filter(booking => {
    const serviceName = booking.service?.name || '';
    const location = booking.address || '';
    const matchesSearch = serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  
  const handleCancelBooking = async (id: string) => {
    try {
      await cancelBookingMutation.mutateAsync(id);
      toast.success('Đã hủy lịch hẹn thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi hủy lịch hẹn');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case 'CONFIRMED':
        return <Badge className="bg-blue-500">Đã xác nhận</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-yellow-500">Đang thực hiện</Badge>;
      case 'PENDING':
        return <Badge className="bg-orange-500">Chờ xác nhận</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Đang tải...</h1>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Đang tải lịch hẹn...</h1>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Có lỗi xảy ra</h1>
          <p className="text-muted-foreground">Không thể tải lịch sử đặt lịch</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const completedBookings = filteredBookings.filter(b => b.status === 'COMPLETED').length;
  const totalBookings = filteredBookings.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Lịch sử đặt lịch</h1>
        <p className="text-gray-600">
          Theo dõi và quản lý tất cả lịch hẹn dịch vụ của bạn
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng lịch hẹn</p>
                <p className="text-2xl font-bold">{totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold">{completedBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
                <p className="text-2xl font-bold">
                  {filteredBookings.filter(b => ['PENDING', 'CONFIRMED'].includes(b.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên dịch vụ hoặc địa điểm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                <SelectItem value="IN_PROGRESS">Đang thực hiện</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Xuất Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lịch hẹn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Địa điểm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Chi phí</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div>
                          <p className="font-medium line-clamp-1">{booking.service?.name || 'Dịch vụ'}</p>
                          <p className="text-sm text-gray-600">{booking.service?.duration || 0} phút</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">
                            {booking.scheduledAt ? format(new Date(booking.scheduledAt), 'dd/MM/yyyy', { locale: vi }) : 'Chưa xác định'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.scheduledAt ? format(new Date(booking.scheduledAt), 'HH:mm', { locale: vi }) : ''}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <p className="text-sm line-clamp-2">{booking.address || 'Chưa cập nhật'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        {getStatusBadge(booking.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {booking.actualCosts ? (
                          <p className="font-medium">{booking.actualCosts.toLocaleString('vi-VN')}₫</p>
                        ) : booking.estimatedCosts ? (
                          <p className="text-sm text-gray-600">
                            Dự kiến: {booking.estimatedCosts.toLocaleString('vi-VN')}₫
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600">Chưa cập nhật</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
                            </DialogHeader>
                            {selectedBooking && (
                              <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{selectedBooking.service?.name || 'Dịch vụ'}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                      {getStatusIcon(selectedBooking.status)}
                                      {getStatusBadge(selectedBooking.status)}
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Thời gian hẹn</label>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium">
                                          {selectedBooking.scheduledAt ? format(new Date(selectedBooking.scheduledAt), 'dd/MM/yyyy HH:mm', { locale: vi }) : 'Chưa xác định'}
                                        </span>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Thời lượng</label>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span>{selectedBooking.service?.duration || 0} phút</span>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Địa điểm</label>
                                      <div className="flex items-center gap-2 mt-1">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{selectedBooking.address || 'Chưa cập nhật'}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    {selectedBooking.estimatedCosts && (
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Chi phí dự kiến</label>
                                        <p className="font-medium text-lg mt-1">
                                          {selectedBooking.estimatedCosts.toLocaleString('vi-VN')}₫
                                        </p>
                                      </div>
                                    )}

                                    {selectedBooking.actualCosts && (
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Chi phí thực tế</label>
                                        <p className="font-medium text-lg mt-1 text-green-600">
                                          {selectedBooking.actualCosts.toLocaleString('vi-VN')}₫
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {selectedBooking.notes && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Ghi chú</label>
                                    <p className="mt-1 p-3 bg-gray-50 rounded-md">{selectedBooking.notes}</p>
                                  </div>
                                )}

                                <Separator />

                                <div className="flex justify-between items-center text-sm text-gray-600">
                                  <span>Ngày tạo: {format(new Date(selectedBooking.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                                  <span>Cập nhật: {format(new Date(selectedBooking.updatedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                                </div>
                                
                                {['PENDING', 'CONFIRMED'].includes(selectedBooking.status) && (
                                  <>
                                    <Separator />
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleCancelBooking(selectedBooking.id)}
                                      disabled={cancelBookingMutation.isPending}
                                      className="w-full"
                                    >
                                      {cancelBookingMutation.isPending ? 'Đang hủy...' : 'Hủy lịch hẹn'}
                                    </Button>
                                  </>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancelBookingMutation.isPending}
                          >
                            Hủy
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Không có lịch hẹn nào</h3>
              <p className="text-gray-600">
                Bạn chưa có lịch hẹn dịch vụ nào.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}