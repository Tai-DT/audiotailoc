'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
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
import { LocationPicker } from '@/components/LocationPicker';

interface Booking {
  id: string;
  user?: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
  };
  service?: {
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
  address?: string;
  coordinates?: string;
  goongPlaceId?: string;
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
  address?: string;
  coordinates?: string;
  goongPlaceId?: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchBookings();
    fetchServices();
    fetchTechnicians();
    fetchUsers();
  }, [debouncedSearch, filterStatus, bookingsData.page]); // Re-fetch when search or filter changes

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getBookings({
        page: bookingsData.page,
        limit: bookingsData.pageSize,
        status: filterStatus === 'all' ? undefined : filterStatus,
        customerName: debouncedSearch || undefined,
      });

      if (response.success && response.data) {
        const data = response.data as any;
        setBookingsData({
          bookings: data.bookings || [],
          total: data.total || 0,
          page: data.page || 1,
          pageSize: data.pageSize || 20,
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await apiClient.getServices();
      if (response.success && response.data) {
        const data = response.data as any;
        if (Array.isArray(data)) {
          setServices(data);
        } else if (data.services) {
          setServices(data.services);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await apiClient.getTechnicians();
      if (response.success && response.data) {
        const data = response.data as any;
        if (Array.isArray(data)) {
          setTechnicians(data);
        } else if (data.technicians) {
          setTechnicians(data.technicians);
        }
      }
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiClient.getUsers();
      if (response.success && response.data) {
        const data = response.data as any;
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          // Handle paginated response if necessary
          setUsers((data as any).data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await apiClient.updateBookingStatus(bookingId, newStatus);
      fetchBookings();
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      alert('Lỗi: ' + (error?.response?.data?.message || error?.message || 'Không thể cập nhật trạng thái đặt lịch'));
    }
  };

  const updateBooking = async (id: string, bookingData: BookingFormData) => {
    try {
      await apiClient.updateBooking(id, {
        ...bookingData,
        scheduledDate: bookingData.scheduledAt,
      } as any);
      fetchBookings();
      setIsEditDialogOpen(false);
      setEditingBooking(null);
    } catch (error: any) {
      console.error('Error updating booking:', error);
      alert('Lỗi: ' + (error?.response?.data?.message || error?.message || 'Không thể cập nhật đặt lịch'));
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đặt lịch này?')) return;

    try {
      await apiClient.deleteBooking(id);
      fetchBookings();
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      alert('Lỗi: ' + (error?.response?.data?.message || error?.message || 'Không thể xóa đặt lịch'));
    }
  };

  const createBooking = async (bookingData: BookingFormData) => {
    try {
      // Use generic post because specific createBooking signature might mismatch
      await apiClient.post('/bookings', bookingData as any);
      fetchBookings();
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      alert('Lỗi: ' + (error?.response?.data?.message || error?.message || 'Không thể tạo đặt lịch'));
    }
  };

  const viewBookingDetail = (booking: Booking) => {
    router.push(`/dashboard/bookings/${booking.id}`);
  };

  const openEditDialog = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditDialogOpen(true);
  };

  const filteredBookings = bookingsData.bookings || [];

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

          <div className="flex gap-4">
            <div className="relative w-64">
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <div className="absolute left-2.5 top-2.5 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>

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
                      {booking.user ? (
                        <>
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
                        </>
                      ) : (
                        <span className="text-sm text-gray-500 italic">Khách hàng không tìm thấy</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        <span>{booking.service?.name || 'Dịch vụ không tìm thấy'}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.service?.serviceType?.name || 'Loại dịch vụ'}
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
    address: booking?.address || '',
    coordinates: booking?.coordinates || '',
    goongPlaceId: booking?.goongPlaceId || '',
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
          <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
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
          <Select value={formData.serviceId} onValueChange={(value) => setFormData({ ...formData, serviceId: value })}>
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
          <Select value={formData.technicianId} onValueChange={(value) => setFormData({ ...formData, technicianId: value })}>
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
          <Select value={formData.status} onValueChange={(value: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') => setFormData({ ...formData, status: value })}>
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
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="scheduledTime">Giờ thực hiện</Label>
          <Input
            id="scheduledTime"
            type="time"
            value={formData.scheduledTime}
            onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="estimatedCosts">Chi phí dự kiến (VNĐ)</Label>
          <Input
            id="estimatedCosts"
            type="number"
            value={formData.estimatedCosts}
            onChange={(e) => setFormData({ ...formData, estimatedCosts: e.target.value })}
            placeholder="0"
          />
        </div>

        <div>
          <Label htmlFor="actualCosts">Chi phí thực tế (VNĐ)</Label>
          <Input
            id="actualCosts"
            type="number"
            value={formData.actualCosts}
            onChange={(e) => setFormData({ ...formData, actualCosts: e.target.value })}
            placeholder="0"
          />
        </div>

        <div className="col-span-2">
          <Label>Địa chỉ thực hiện</Label>
          <LocationPicker
            value={formData.address}
            onChange={(address, coordinates, placeId) => {
              setFormData({
                ...formData,
                address: address || '',
                coordinates: coordinates || '',
                goongPlaceId: placeId || ''
              });
            }}
            placeholder="Nhập địa chỉ khách hàng..."
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Ghi chú</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
