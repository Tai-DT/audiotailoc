'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Phone, MapPin, Wrench, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Booking {
  id: string;
  user: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
  };
  service: {
    id: string;
    name: string;
    serviceType?: {
      name: string;
    };
  };
  technician?: {
    id: string;
    name: string;
  };
  scheduledAt: string;
  scheduledTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  estimatedCosts?: number;
  actualCosts?: number;
}

interface Service {
  id: string;
  name: string;
  slug: string;
}

interface Technician {
  id: string;
  name: string;
  email?: string;
}

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface BookingFormData {
  userId: string;
  serviceId: string;
  technicianId: string | null;
  scheduledAt: string;
  scheduledTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  estimatedCosts?: number | null;
  actualCosts?: number | null;
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
  const router = useRouter();
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchBookings();
    fetchServices();
    fetchTechnicians();
    fetchUsers();
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

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.services) {
          setServices(data.data.services);
        } else if (data.success && Array.isArray(data.data)) {
          // Fallback for direct array response
          setServices(data.data);
        } else {
          // Use mock services if API response is unexpected
          setServices([
            { id: 'service-1', name: 'Dịch Vụ Cho Thuê Thiết Bị Karaoke', slug: 'karaoke-rental' },
            { id: 'service-2', name: 'Dịch Vụ Lắp Đặt Hệ Thống Karaoke', slug: 'karaoke-installation' },
            { id: 'service-3', name: 'Dịch Vụ Sửa Chữa Âm Thanh', slug: 'audio-repair' },
            { id: 'service-4', name: 'Dịch Vụ Thanh Lý Thiết Bị', slug: 'equipment-liquidation' }
          ]);
        }
      } else {
        console.error('Failed to fetch services:', response.statusText);
        // Use mock services as fallback
        setServices([
          { id: 'service-1', name: 'Dịch Vụ Cho Thuê Thiết Bị Karaoke', slug: 'karaoke-rental' },
          { id: 'service-2', name: 'Dịch Vụ Lắp Đặt Hệ Thống Karaoke', slug: 'karaoke-installation' },
          { id: 'service-3', name: 'Dịch Vụ Sửa Chữa Âm Thanh', slug: 'audio-repair' },
          { id: 'service-4', name: 'Dịch Vụ Thanh Lý Thiết Bị', slug: 'equipment-liquidation' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      // Use mock services as fallback
      setServices([
        { id: 'service-1', name: 'Dịch Vụ Cho Thuê Thiết Bị Karaoke', slug: 'karaoke-rental' },
        { id: 'service-2', name: 'Dịch Vụ Lắp Đặt Hệ Thống Karaoke', slug: 'karaoke-installation' },
        { id: 'service-3', name: 'Dịch Vụ Sửa Chữa Âm Thanh', slug: 'audio-repair' },
        { id: 'service-4', name: 'Dịch Vụ Thanh Lý Thiết Bị', slug: 'equipment-liquidation' }
      ]);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await fetch('/api/technicians');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.technicians) {
          setTechnicians(data.data.technicians);
        } else if (data.success && Array.isArray(data.data)) {
          // Fallback for direct array response
          setTechnicians(data.data);
        } else {
          // Use mock technicians if API response is unexpected
          setTechnicians([
            { id: 'tech-1', name: 'Nguyễn Văn A', email: 'nguyenvana@audio-tailoc.com' },
            { id: 'tech-2', name: 'Trần Thị B', email: 'tranthib@audio-tailoc.com' },
            { id: 'tech-3', name: 'Lê Văn C', email: 'levanc@audio-tailoc.com' },
            { id: 'tech-4', name: 'Phạm Thị D', email: 'phamthid@audio-tailoc.com' }
          ]);
        }
      } else {
        console.error('Failed to fetch technicians:', response.statusText);
        // Use mock technicians as fallback
        setTechnicians([
          { id: 'tech-1', name: 'Nguyễn Văn A', email: 'nguyenvana@audio-tailoc.com' },
          { id: 'tech-2', name: 'Trần Thị B', email: 'tranthib@audio-tailoc.com' },
          { id: 'tech-3', name: 'Lê Văn C', email: 'levanc@audio-tailoc.com' },
          { id: 'tech-4', name: 'Phạm Thị D', email: 'phamthid@audio-tailoc.com' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching technicians:', error);
      // Use mock technicians as fallback
      setTechnicians([
        { id: 'tech-1', name: 'Nguyễn Văn A', email: 'nguyenvana@audio-tailoc.com' },
        { id: 'tech-2', name: 'Trần Thị B', email: 'tranthib@audio-tailoc.com' },
        { id: 'tech-3', name: 'Lê Văn C', email: 'levanc@audio-tailoc.com' },
        { id: 'tech-4', name: 'Phạm Thị D', email: 'phamthid@audio-tailoc.com' }
      ]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setUsers(data.data);
        } else {
          // Use mock users if API returns empty
          setUsers([
            { id: 'mock-1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567' },
            { id: 'mock-2', name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0909876543' },
            { id: 'mock-3', name: 'Lê Văn C', email: 'levanc@example.com', phone: '0912345678' },
            { id: 'admin-user', name: 'Administrator', email: 'admin@audiotailoc.com', phone: undefined }
          ]);
        }
      } else {
        // Use mock users if API fails
        setUsers([
          { id: 'mock-1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567' },
          { id: 'mock-2', name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0909876543' },
          { id: 'mock-3', name: 'Lê Văn C', email: 'levanc@example.com', phone: '0912345678' },
          { id: 'admin-user', name: 'Administrator', email: 'admin@audiotailoc.com', phone: undefined }
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Use mock users as fallback
      setUsers([
        { id: 'mock-1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567' },
        { id: 'mock-2', name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0909876543' },
        { id: 'mock-3', name: 'Lê Văn C', email: 'levanc@example.com', phone: '0912345678' },
        { id: 'admin-user', name: 'Administrator', email: 'admin@audiotailoc.com', phone: undefined }
      ]);
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

  const updateBooking = async (id: string, bookingData: BookingFormData) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        fetchBookings();
        setIsEditDialogOpen(false);
        setEditingBooking(null);
      } else {
        const errorText = await response.text();
        console.error('Failed to update booking:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đặt lịch này?')) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBookings();
      } else {
        const errorText = await response.text();
        console.error('Failed to delete booking:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const createBooking = async (bookingData: BookingFormData) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        fetchBookings();
        setIsCreateDialogOpen(false);
      } else {
        const errorText = await response.text();
        console.error('Failed to create booking:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const viewBookingDetail = (booking: Booking) => {
    router.push(`/dashboard/bookings/${booking.id}`);
  };

  const openEditDialog = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditDialogOpen(true);
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm đặt lịch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm đặt lịch mới</DialogTitle>
              </DialogHeader>
              <BookingForm
                services={services}
                technicians={technicians}
                users={users}
                onSubmit={createBooking}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Chỉnh sửa đặt lịch</DialogTitle>
              </DialogHeader>
              {editingBooking && (
                <BookingForm
                  services={services}
                  technicians={technicians}
                  users={users}
                  booking={editingBooking}
                  onSubmit={(data) => updateBooking(editingBooking.id, data)}
                  onCancel={() => {
                    setIsEditDialogOpen(false);
                    setEditingBooking(null);
                  }}
                />
              )}
            </DialogContent>
          </Dialog>

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
                        {booking.service?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.service?.serviceType?.name || 'Dịch vụ'}
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewBookingDetail(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(booking)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteBooking(booking.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

function BookingForm({
  services,
  technicians,
  users,
  booking,
  onSubmit,
  onCancel
}: {
  services: Service[];
  technicians: Technician[];
  users: User[];
  booking?: Booking;
  onSubmit: (data: BookingFormData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    userId: booking?.user?.id || '',
    serviceId: booking?.service?.id || '',
    technicianId: booking?.technician?.id || 'unassigned',
    scheduledAt: booking ? new Date(booking.scheduledAt).toISOString().split('T')[0] : '',
    scheduledTime: booking?.scheduledTime || '',
    status: (booking?.status || 'PENDING') as 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    notes: booking?.notes || '',
    estimatedCosts: booking?.estimatedCosts?.toString() || '',
    actualCosts: booking?.actualCosts?.toString() || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      technicianId: formData.technicianId === 'unassigned' ? null : formData.technicianId,
      estimatedCosts: formData.estimatedCosts ? parseInt(formData.estimatedCosts as string) : null,
      actualCosts: formData.actualCosts ? parseInt(formData.actualCosts as string) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="userId">Khách hàng</Label>
          <Select value={formData.userId} onValueChange={(value) => setFormData({...formData, userId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn khách hàng" />
            </SelectTrigger>
            <SelectContent>
              {(users || []).map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="serviceId">Dịch vụ</Label>
          <Select value={formData.serviceId} onValueChange={(value) => setFormData({...formData, serviceId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn dịch vụ" />
            </SelectTrigger>
            <SelectContent>
              {(services || []).map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="technicianId">Kỹ thuật viên</Label>
          <Select value={formData.technicianId} onValueChange={(value) => setFormData({...formData, technicianId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn kỹ thuật viên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Chưa phân công</SelectItem>
              {(technicians || []).map((technician) => (
                <SelectItem key={technician.id} value={technician.id}>
                  {technician.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Trạng thái</Label>
          <Select value={formData.status} onValueChange={(value: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
              <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
              <SelectItem value="IN_PROGRESS">Đang thực hiện</SelectItem>
              <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="scheduledAt">Ngày thực hiện</Label>
          <Input
            id="scheduledAt"
            type="date"
            value={formData.scheduledAt}
            onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="scheduledTime">Giờ thực hiện</Label>
          <Input
            id="scheduledTime"
            type="time"
            value={formData.scheduledTime}
            onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="estimatedCosts">Chi phí dự kiến (VNĐ)</Label>
          <Input
            id="estimatedCosts"
            type="number"
            value={formData.estimatedCosts}
            onChange={(e) => setFormData({...formData, estimatedCosts: e.target.value})}
            placeholder="0"
          />
        </div>

        <div>
          <Label htmlFor="actualCosts">Chi phí thực tế (VNĐ)</Label>
          <Input
            id="actualCosts"
            type="number"
            value={formData.actualCosts}
            onChange={(e) => setFormData({...formData, actualCosts: e.target.value})}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Ghi chú</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Nhập ghi chú..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">
          {booking ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}
