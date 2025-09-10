'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Phone, MapPin, Wrench } from 'lucide-react';

interface Booking {
  id: string;
  user: {
    name: string;
    phone?: string;
    address?: string;
  };
  service: {
    name: string;
    serviceType: {
      name: string;
    };
  };
  technician?: {
    name: string;
  };
  scheduledAt: string;
  scheduledTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  IN_PROGRESS: 'Đang thực hiện',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

export default function BookingsPage() {
  const [bookingsData, setBookingsData] = useState<{
    bookings: Booking[];
    total: number;
    page: number;
    pageSize: number;
  }>({
    bookings: [],
    total: 0,
    page: 1,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        // Handle different response formats from backend
        if (Array.isArray(data)) {
          // If backend returns array directly
          setBookingsData({
            bookings: data,
            total: data.length,
            page: 1,
            pageSize: 20,
          });
        } else if (data && typeof data === 'object') {
          // If backend returns object with bookings property
          setBookingsData({
            bookings: data.bookings || [],
            total: data.total || (data.bookings ? data.bookings.length : 0),
            page: data.page || 1,
            pageSize: data.pageSize || 20,
          });
        } else {
          // Fallback for unexpected response
          setBookingsData({
            bookings: [],
            total: 0,
            page: 1,
            pageSize: 20,
          });
        }
      } else {
        console.error('Failed to fetch bookings:', response.statusText);
        setBookingsData({
          bookings: [],
          total: 0,
          page: 1,
          pageSize: 20,
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookingsData({
        bookings: [],
        total: 0,
        page: 1,
        pageSize: 20,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3010').replace(/\/$/, '');
      const response = await fetch(`${BACKEND_URL}/api/v1/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchBookings(); // Refresh the list
      } else {
        const errorText = await response.text();
        console.error('Failed to update booking status:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const filteredBookings = (bookingsData.bookings || []).filter((booking: Booking) =>
    filterStatus === 'all' || booking.status === filterStatus
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý đặt lịch</h1>
        <div className="flex gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
              <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
              <SelectItem value="IN_PROGRESS">Đang thực hiện</SelectItem>
              <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đặt lịch ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Dịch vụ</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Kỹ thuật viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{booking.user.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        {booking.user.phone || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {booking.user.address || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        {booking.service?.serviceType?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.service?.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(booking.scheduledAt).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        {booking.scheduledTime}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.technician?.name || 'Chưa phân công'}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[booking.status]}>
                      {statusLabels[booking.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {booking.status === 'PENDING' && (
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                        >
                          Xác nhận
                        </Button>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'IN_PROGRESS')}
                        >
                          Bắt đầu
                        </Button>
                      )}
                      {booking.status === 'IN_PROGRESS' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                        >
                          Hoàn thành
                        </Button>
                      )}
                      {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
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
        </CardContent>
      </Card>
    </div>
  );
}
