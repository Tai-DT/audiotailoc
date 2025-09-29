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

// Mock data - in real app this would come from API
interface BookingRecord {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceImage?: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledAt: string;
  duration: number;
  location: string;
  notes?: string;
  estimatedCosts?: number;
  actualCosts?: number;
  technicianName?: string;
  technicianPhone?: string;
  createdAt: string;
  updatedAt: string;
}

const mockBookings: BookingRecord[] = [
  {
    id: '1',
    serviceId: 'service-1',
    serviceName: 'Thiết lập hệ thống âm thanh gia đình',
    serviceImage: '/placeholder-service.jpg',
    status: 'COMPLETED',
    scheduledAt: '2024-01-20T14:00:00Z',
    duration: 120,
    location: '123 Đường ABC, Quận 1, TP.HCM',
    notes: 'Khách hàng yêu cầu kiểm tra toàn bộ hệ thống loa và micro',
    estimatedCosts: 1500000,
    actualCosts: 1450000,
    technicianName: 'Nguyễn Văn A',
    technicianPhone: '0987654321',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
  },
  {
    id: '2',
    serviceId: 'service-2',
    serviceName: 'Sửa chữa loa Bluetooth',
    serviceImage: '/placeholder-service.jpg',
    status: 'CONFIRMED',
    scheduledAt: '2024-01-25T09:00:00Z',
    duration: 60,
    location: '456 Đường XYZ, Quận 2, TP.HCM',
    notes: 'Loa không kết nối được với điện thoại',
    estimatedCosts: 300000,
    technicianName: 'Trần Thị B',
    technicianPhone: '0987654322',
    createdAt: '2024-01-18T14:20:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
  },
  {
    id: '3',
    serviceId: 'service-3',
    serviceName: 'Lắp đặt micro karaoke',
    serviceImage: '/placeholder-service.jpg',
    status: 'PENDING',
    scheduledAt: '2024-01-30T16:00:00Z',
    duration: 90,
    location: '789 Đường DEF, Quận 3, TP.HCM',
    notes: 'Cần lắp đặt hệ thống micro cho phòng karaoke gia đình',
    estimatedCosts: 800000,
    createdAt: '2024-01-22T11:15:00Z',
    updatedAt: '2024-01-22T11:15:00Z',
  }
];

export default function BookingHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
                          <p className="font-medium line-clamp-1">{booking.serviceName}</p>
                          <p className="text-sm text-gray-600">{booking.duration} phút</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">
                            {format(new Date(booking.scheduledAt), 'dd/MM/yyyy', { locale: vi })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(booking.scheduledAt), 'HH:mm', { locale: vi })}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <p className="text-sm line-clamp-2">{booking.location}</p>
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
                                  <h3 className="font-semibold text-lg">{selectedBooking.serviceName}</h3>
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
                                        {format(new Date(selectedBooking.scheduledAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                      </span>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Thời lượng</label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Clock className="h-4 w-4 text-gray-400" />
                                      <span>{selectedBooking.duration} phút</span>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Địa điểm</label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <MapPin className="h-4 w-4 text-gray-400" />
                                      <span className="text-sm">{selectedBooking.location}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Chi phí dự kiến</label>
                                    <p className="font-medium text-lg mt-1">
                                      {selectedBooking.estimatedCosts?.toLocaleString('vi-VN')}₫
                                    </p>
                                  </div>

                                  {selectedBooking.actualCosts && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Chi phí thực tế</label>
                                      <p className="font-medium text-lg mt-1 text-green-600">
                                        {selectedBooking.actualCosts.toLocaleString('vi-VN')}₫
                                      </p>
                                    </div>
                                  )}

                                  {selectedBooking.technicianName && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Kỹ thuật viên</label>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Avatar className="h-8 w-8">
                                          <AvatarFallback>
                                            <User className="h-4 w-4" />
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium">{selectedBooking.technicianName}</p>
                                          {selectedBooking.technicianPhone && (
                                            <p className="text-sm text-gray-600">{selectedBooking.technicianPhone}</p>
                                          )}
                                        </div>
                                      </div>
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