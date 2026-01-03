'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  Download,
  Loader2,
  Phone as PhoneIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMyBookings } from '@/lib/hooks/use-bookings';
import { ServiceBooking } from '@/lib/types';

export default function BookingHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);

  const { data: bookings, isLoading } = useMyBookings();

  if (isLoading) {
    return (
      <div 
        className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]"
        role="status"
        aria-label="Đang tải lịch sử đặt lịch"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Đang tải...</span>
      </div>
    );
  }

  // Handle error state gracefully? For now just showing empty if error or empty
  const bookingData = bookings || [];

  const filteredBookings = bookingData.filter(booking => {
    const serviceName = booking.service?.name || 'Dịch vụ';
    const _location = ''; // Location is not strictly in ServiceBooking type on frontend yet
    // Backend ServiceBooking has 'address' field? Let's check types.ts again. 
    // It seems ServiceBooking in types.ts DOES NOT have address. 
    // But checking Prisma schema: model service_bookings has 'address', 'coordinates'.
    // We should probably add address to ServiceBooking type too, but for now let's safely handle missing location.

    // Quick fix: match against service Name
    const matchesSearch = serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-success">Hoàn thành</Badge>;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const completedBookings = filteredBookings.filter(b => b.status === 'COMPLETED').length;
  const totalBookings = filteredBookings.length;

  return (
    <main className="container mx-auto px-4 py-8" role="main" aria-labelledby="page-title">
      {/* Header */}
      <div className="mb-8">
        <h1 id="page-title" className="text-3xl font-bold mb-4">Lịch sử đặt lịch</h1>
        <p className="text-muted-foreground">
          Theo dõi và quản lý tất cả lịch hẹn dịch vụ của bạn
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng lịch hẹn</p>
                <p className="text-2xl font-bold">{totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đã hoàn thành</p>
                <p className="text-2xl font-bold">{completedBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chờ xử lý</p>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên dịch vụ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  aria-label="Tìm kiếm lịch hẹn"
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
                        <div className="w-10 h-10 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
                          {booking.service?.images && booking.service.images.length > 0 && (
                            <Image src={booking.service.images[0]} alt="" fill className="object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{booking.service?.name}</p>
                          <p className="text-sm text-muted-foreground">{booking.service?.duration} phút</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {booking.scheduledAt ? format(new Date(booking.scheduledAt), 'dd/MM/yyyy', { locale: vi }) : 'Chưa xếp lịch'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.scheduledAt ? format(new Date(booking.scheduledAt), 'HH:mm', { locale: vi }) : '--:--'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <p className="text-sm line-clamp-2">{booking.address || 'N/A'}</p>
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
                          <p className="text-sm text-muted-foreground">
                            Dự kiến: {booking.estimatedCosts.toLocaleString('vi-VN')}₫
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Chưa cập nhật</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
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
                                <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                                  {selectedBooking.service?.images && selectedBooking.service.images.length > 0 && (
                                    <Image src={selectedBooking.service.images[0]} alt="" fill className="object-cover" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{selectedBooking.service?.name}</h3>
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
                                    <label className="text-sm font-medium text-muted-foreground">Thời gian hẹn</label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">
                                        {selectedBooking.scheduledAt ? format(new Date(selectedBooking.scheduledAt), 'dd/MM/yyyy HH:mm', { locale: vi }) : 'Chưa xác định'}
                                      </span>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Thời lượng</label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span>{selectedBooking.service?.duration || 60} phút</span>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Địa điểm</label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm">{selectedBooking.address || 'Tại nhà'}</span>
                                    </div>
                                  </div>

                                  {selectedBooking.phoneNumber && (
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Số điện thoại liên hệ</label>
                                      <div className="flex items-center gap-2 mt-1">
                                        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{selectedBooking.phoneNumber}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Chi phí dự kiến</label>
                                    <p className="font-medium text-lg mt-1">
                                      {selectedBooking.estimatedCosts?.toLocaleString('vi-VN')}₫
                                    </p>
                                  </div>

                                  {selectedBooking.actualCosts && (
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Chi phí thực tế</label>
                                      <p className="font-medium text-lg mt-1 text-success">
                                        {selectedBooking.actualCosts.toLocaleString('vi-VN')}₫
                                      </p>
                                    </div>
                                  )}

                                  {selectedBooking.technician && (
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Kỹ thuật viên</label>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage src={selectedBooking.technician.avatarUrl} />
                                          <AvatarFallback>
                                            <User className="h-4 w-4" />
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium">{selectedBooking.technician.name}</p>
                                          {selectedBooking.technician.phone && (
                                            <p className="text-sm text-muted-foreground">{selectedBooking.technician.phone}</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {selectedBooking.notes && (
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Ghi chú</label>
                                  <p className="mt-1 p-3 bg-gray-50 rounded-md">{selectedBooking.notes}</p>
                                </div>
                              )}

                              <Separator />

                              <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Ngày tạo: {format(new Date(selectedBooking.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                                <span>Cập nhật: {format(new Date(selectedBooking.updatedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12" role="alert" aria-live="polite">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Không có lịch hẹn nào</h3>
              <p className="text-muted-foreground">
                Bạn chưa có lịch hẹn dịch vụ nào.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}