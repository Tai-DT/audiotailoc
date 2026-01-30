'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, User, Phone, MapPin, Wrench, FileText } from 'lucide-react';

interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  technicianId?: string | null;
  users: {
    id: string;
    name: string;
    email?: string;
    phone?: string | null;
  };
  services: {
    id: string;
    name: string;
    slug: string;
    basePriceCents?: number;
    type?: {
      name: string;
    } | null;
  };
  technicians?: {
    id: string;
    name: string;
  } | null;
  scheduledAt: string;
  scheduledTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string | null;
  address?: string | null;
  coordinates?: { lat: number; lng: number } | null;
  estimatedCosts?: number | null;
  actualCosts?: number | null;
  createdAt: string;
  updatedAt: string;
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

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');

  const fetchBooking = useCallback(async () => {
    try {
      const response = await fetch(`/api/bookings/${params.id}`);
      if (response.ok) {
        const json = await response.json();
        // Handle wrapped response { success, data } or direct data
        const data = json.data || json;
        setBooking(data);
        setNotes(data.notes || '');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchBooking();
    }
  }, [params.id, fetchBooking]);

  const updateBookingStatus = async (newStatus: string) => {
    if (!booking) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, notes }),
      });

      if (response.ok) {
        await fetchBooking(); // Refresh the booking data
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setUpdating(false);
    }
  };

  const updateNotes = async () => {
    if (!booking) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        await fetchBooking(); // Refresh the booking data
      }
    } catch (error) {
      console.error('Error updating notes:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy đặt lịch</h1>
          <Button onClick={() => router.push('/dashboard/bookings')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router.push('/dashboard/bookings')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold">Chi tiết đặt lịch</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin chính */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Thông tin đặt lịch
                <Badge className={statusColors[booking.status]}>
                  {statusLabels[booking.status]}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Thời gian đặt lịch</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {booking.scheduledTime || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Dịch vụ</Label>
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    {booking.services?.name || 'N/A'}
                  </div>
                  {booking.services?.type?.name && (
                    <div className="text-sm text-gray-600">
                      Loại: {booking.services.type.name}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Kỹ thuật viên</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {booking.technicians?.name || 'Chưa phân công'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin khách hàng */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tên khách hàng</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {booking.users?.name || 'N/A'}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Số điện thoại</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {booking.users?.phone || 'N/A'}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Địa chỉ</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {booking.address || 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ghi chú */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Ghi chú
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Thêm ghi chú cho đặt lịch này..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <Button
                onClick={updateNotes}
                disabled={updating}
                className="w-full"
              >
                {updating ? 'Đang cập nhật...' : 'Cập nhật ghi chú'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Thao tác */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thao tác</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {booking.status === 'PENDING' && (
                <Button
                  onClick={() => updateBookingStatus('CONFIRMED')}
                  disabled={updating}
                  className="w-full"
                >
                  {updating ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
                </Button>
              )}

              {booking.status === 'CONFIRMED' && (
                <Button
                  onClick={() => updateBookingStatus('IN_PROGRESS')}
                  disabled={updating}
                  className="w-full"
                >
                  {updating ? 'Đang xử lý...' : 'Bắt đầu thực hiện'}
                </Button>
              )}

              {booking.status === 'IN_PROGRESS' && (
                <Button
                  onClick={() => updateBookingStatus('COMPLETED')}
                  disabled={updating}
                  className="w-full"
                  variant="default"
                >
                  {updating ? 'Đang xử lý...' : 'Hoàn thành dịch vụ'}
                </Button>
              )}

              {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                <Button
                  onClick={() => updateBookingStatus('CANCELLED')}
                  disabled={updating}
                  variant="destructive"
                  className="w-full"
                >
                  {updating ? 'Đang xử lý...' : 'Hủy đặt lịch'}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <Label className="text-xs text-gray-600">ID đặt lịch</Label>
                <div className="font-mono">{booking.id}</div>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Ngày tạo</Label>
                <div>{new Date(booking.createdAt).toLocaleString('vi-VN')}</div>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Cập nhật lần cuối</Label>
                <div>{new Date(booking.updatedAt).toLocaleString('vi-VN')}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}