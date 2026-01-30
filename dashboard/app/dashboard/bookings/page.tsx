'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GoongMapAddressPicker } from '@/components/ui/goong-map-address-picker';
import { Calendar, Clock, User, Phone, MapPin, Wrench, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

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
  address?: string;
  addressCoordinates?: { lat: number; lng: number } | null;
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

// Helper function to safely format date
const formatDate = (dateValue: string | object | null | undefined): string => {
  if (!dateValue) return 'N/A';
  // Check if it's an empty object (API sometimes returns {} for dates)
  if (typeof dateValue === 'object' && Object.keys(dateValue).length === 0) return 'N/A';
  try {
    const date = new Date(dateValue as string);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('vi-VN');
  } catch {
    return 'N/A';
  }
};

export default function BookingsPage() {
  const router = useRouter();
  const { token } = useAuth();
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

  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  useEffect(() => {
    fetchBookings();
    fetchServices();
    fetchTechnicians();
    fetchUsers();
  }, [token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings', {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();

        // API route already transforms the response to consistent format:
        // { bookings: [...], total, page, pageSize }
        if (data && typeof data === 'object') {
          setBookingsData({
            bookings: Array.isArray(data.bookings) ? data.bookings : [],
            total: data.total || 0,
            page: data.page || 1,
            pageSize: data.pageSize || 20,
          });

          if (process.env.NODE_ENV === 'development') {
            console.log('[Bookings] Fetched bookings:', {
              count: data.bookings?.length || 0,
              total: data.total,
              page: data.page,
              pageSize: data.pageSize,
            });
          }
        } else {
          console.warn('[Bookings] Unexpected response format:', data);
          setBookingsData({
            bookings: [],
            total: 0,
            page: 1,
            pageSize: 20,
          });
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch bookings:', response.status, response.statusText, errorText);
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
      const response = await fetch('/api/services?limit=100', {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        let servicesList: Service[] = [];

        if (data.success && data.data) {
          if (data.data.services && Array.isArray(data.data.services)) {
            servicesList = data.data.services;
          } else if (Array.isArray(data.data)) {
            servicesList = data.data;
          } else if (data.data.items && Array.isArray(data.data.items)) {
            servicesList = data.data.items;
          } else if (data.data.results && Array.isArray(data.data.results)) {
            servicesList = data.data.results;
          }
        } else if (Array.isArray(data)) {
          servicesList = data;
        } else if (data.data && Array.isArray(data.data)) {
          servicesList = data.data;
        } else if (data.items && Array.isArray(data.items)) {
          servicesList = data.items;
        } else if (data.results && Array.isArray(data.results)) {
          servicesList = data.results;
        }

        const validServices = servicesList.filter((service: any) =>
          service && service.id && service.name
        ).map((service: any) => ({
          id: service.id,
          name: service.name,
          slug: service.slug || ''
        }));

        setServices(validServices);

        if (validServices.length === 0 && servicesList.length === 0 && data.success !== false) {
          if (process.env.NODE_ENV === 'development') {
            console.info('[Bookings] No services in database. This is normal if no services have been created yet.');
          }
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch services:', response.status, errorText);
        setServices([]);
      }
    } catch (error) {
      console.error('Error fetching services:', error instanceof Error ? error.message : 'Unknown error');
      setServices([]);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await fetch('/api/technicians?pageSize=100', {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        let techniciansList: Technician[] = [];

        // Debug: Log the response structure
        if (process.env.NODE_ENV === 'development') {
          const dataKeys = data.data ? Object.keys(data.data) : [];
          console.log('[Bookings] Technicians API response:', {
            hasSuccess: !!data.success,
            hasData: !!data.data,
            dataType: typeof data.data,
            isArray: Array.isArray(data.data),
            dataKeys: dataKeys,
            actualDataKeys: dataKeys.join(', '),
            hasTechniciansAtRoot: !!data.technicians,
            hasTechniciansInData: !!(data.data && data.data.technicians),
            techniciansValue: data.data?.technicians,
            techniciansType: typeof data.data?.technicians,
            techniciansIsArray: Array.isArray(data.data?.technicians),
            techniciansCount: Array.isArray(data.data?.technicians) ? data.data.technicians.length : 'N/A',
            fullDataStructure: JSON.stringify(data, null, 2).substring(0, 500)
          });
        }

        // Handle different response formats:
        // Priority 1: { success: true, data: { technicians: [...] } } or { data: { technicians: [...] } }
        if (data.data?.technicians && Array.isArray(data.data.technicians)) {
          techniciansList = data.data.technicians;
        }
        // Priority 2: Direct format: { technicians: [...] }
        else if (data.technicians && Array.isArray(data.technicians)) {
          techniciansList = data.technicians;
        }
        // Priority 3: Wrapped format with array data
        else if (data.success && data.data && Array.isArray(data.data)) {
          techniciansList = data.data;
        }
        // Priority 4: Other nested formats
        else if (data.data) {
          if (data.data.items && Array.isArray(data.data.items)) {
            techniciansList = data.data.items;
          } else if (data.data.results && Array.isArray(data.data.results)) {
            techniciansList = data.data.results;
          }
        } else if (Array.isArray(data)) {
          // Direct array response
          techniciansList = data;
        } else if (data.data && Array.isArray(data.data)) {
          // Format: { data: [...] }
          techniciansList = data.data;
        } else if (data.items && Array.isArray(data.items)) {
          techniciansList = data.items;
        } else if (data.results && Array.isArray(data.results)) {
          techniciansList = data.results;
        }

        const validTechnicians = techniciansList.filter((tech: any) =>
          tech && tech.id && tech.name
        ).map((tech: any) => ({
          id: tech.id,
          name: tech.name,
          email: tech.email || ''
        }));

        setTechnicians(validTechnicians);

        // Log warning only if we couldn't parse technicians from the response (parsing issue, not empty data)
        if (validTechnicians.length === 0 && techniciansList.length === 0) {
          // Check if we actually found a technicians array but it was empty (valid state)
          const foundEmptyArray =
            (data.success && data.data && data.data.technicians && Array.isArray(data.data.technicians) && data.data.technicians.length === 0) ||
            (data.technicians && Array.isArray(data.technicians) && data.technicians.length === 0);

          if (!foundEmptyArray && process.env.NODE_ENV === 'development') {
            console.warn('[Bookings] No technicians found in API response - possible parsing issue', {
              responseKeys: Object.keys(data),
              hasTechnicians: !!data.technicians,
              hasData: !!data.data,
              hasSuccess: !!data.success,
              dataDataKeys: data.data ? Object.keys(data.data) : [],
              techniciansValue: data.data?.technicians,
              techniciansType: typeof data.data?.technicians,
              techniciansIsArray: Array.isArray(data.data?.technicians),
              techniciansLength: Array.isArray(data.data?.technicians) ? data.data.technicians.length : 'N/A',
              rawResponse: JSON.stringify(data).substring(0, 500)
            });
          } else if (foundEmptyArray && process.env.NODE_ENV === 'development') {
            console.info('[Bookings] No technicians in database. This is normal if no technicians have been created yet.');
          }
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch technicians:', response.status, errorText);
        setTechnicians([]);
      }
    } catch (error) {
      console.error('Error fetching technicians:', error instanceof Error ? error.message : 'Unknown error');
      setTechnicians([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users?limit=100', {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        // Handle different response formats from backend
        let usersList: User[] = [];

        if (data.success && data.data) {
          // Format: { success: true, data: [...] }
          if (Array.isArray(data.data)) {
            usersList = data.data;
          } else if (data.data.users && Array.isArray(data.data.users)) {
            // Format: { success: true, data: { users: [...] } }
            usersList = data.data.users;
          } else if (data.data.data && Array.isArray(data.data.data)) {
            // Nested format
            usersList = data.data.data;
          } else if (data.data.items && Array.isArray(data.data.items)) {
            usersList = data.data.items;
          } else if (data.data.results && Array.isArray(data.data.results)) {
            usersList = data.data.results;
          }
        } else if (Array.isArray(data)) {
          // Direct array response
          usersList = data;
        } else if (data.data && Array.isArray(data.data)) {
          // Format: { data: [...] }
          usersList = data.data;
        } else if (data.items && Array.isArray(data.items)) {
          usersList = data.items;
        } else if (data.results && Array.isArray(data.results)) {
          usersList = data.results;
        }

        // Filter out admin users if needed, or include all users
        const validUsers = usersList.filter((user: any) =>
          user && user.id && user.name
        ).map((user: any) => ({
          id: user.id,
          name: user.name || user.fullName || 'Unknown',
          email: user.email || '',
          phone: user.phone || user.phoneNumber || '',
          address: user.address || ''
        }));

        setUsers(validUsers);

        if (validUsers.length === 0 && usersList.length === 0 && data.success !== false) {
          if (process.env.NODE_ENV === 'development') {
            console.info('[Bookings] No users in database. This is normal if no users have been created yet.');
          }
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch users:', response.status, errorText);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const statusLabel = statusLabels[newStatus as keyof typeof statusLabels] || newStatus;
        toast.success(`Đã cập nhật trạng thái thành: ${statusLabel}`);
        fetchBookings(); // Refresh the list
      } else {
        const errorText = await response.text();
        let errorMessage = 'Không thể cập nhật trạng thái đặt lịch. Vui lòng thử lại.';
        try {
          const errorData = errorText ? JSON.parse(errorText) : {};
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Keep default error message
        }
        console.error('Failed to update booking status:', response.status, errorText);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  const updateBooking = async (id: string, bookingData: BookingFormData) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        fetchBookings();
        setIsEditDialogOpen(false);
        setEditingBooking(null);
        toast.success('Cập nhật đặt lịch thành công!');
      } else {
        const errorText = await response.text();
        let errorMessage = 'Không thể cập nhật đặt lịch. Vui lòng thử lại.';
        try {
          const errorData = errorText ? JSON.parse(errorText) : {};
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Keep default error message
        }
        console.error('Failed to update booking:', response.status, errorText);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật đặt lịch. Vui lòng thử lại.');
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đặt lịch này?')) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setBookingsData(prev => ({
          ...prev,
          bookings: prev.bookings.filter((booking) => booking.id !== id),
          total: Math.max(0, prev.total - 1),
        }));
        fetchBookings();
        toast.success('Xóa đặt lịch thành công!');
      } else {
        const errorText = await response.text();
        let errorMessage = 'Không thể xóa đặt lịch. Vui lòng thử lại.';
        try {
          const errorData = errorText ? JSON.parse(errorText) : {};
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Keep default error message
        }
        console.error('Failed to delete booking:', response.status, errorText);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Đã xảy ra lỗi khi xóa đặt lịch. Vui lòng thử lại.');
    }
  };

  const createBooking = async (bookingData: BookingFormData) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        fetchBookings();
        setIsCreateDialogOpen(false);
        toast.success('Tạo đặt lịch thành công!');
      } else {
        const errorText = await response.text();
        let errorMessage = 'Không thể tạo đặt lịch. Vui lòng thử lại.';
        try {
          const errorData = errorText ? JSON.parse(errorText) : {};
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Keep default error message
        }
        console.error('Failed to create booking:', response.status, errorText);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Đã xảy ra lỗi khi tạo đặt lịch. Vui lòng thử lại.');
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
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm đặt lịch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm đặt lịch mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin để tạo đặt lịch mới cho khách hàng.
                </DialogDescription>
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
                <DialogDescription>
                  Cập nhật thông tin đặt lịch cho khách hàng.
                </DialogDescription>
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
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Không có đặt lịch nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{booking.user?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          {booking.user?.phone || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {booking.user?.address || 'N/A'}
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
                          {formatDate(booking.scheduledAt)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          {booking.scheduledTime || 'N/A'}
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
                ))
              )}
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
  // Safe date parsing helper
  const parseScheduledAt = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    userId: booking?.user?.id || '',
    serviceId: booking?.service?.id || '',
    technicianId: booking?.technician?.id || 'unassigned',
    scheduledAt: parseScheduledAt(booking?.scheduledAt),
    scheduledTime: booking?.scheduledTime || '',
    status: (booking?.status || 'PENDING') as 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    notes: booking?.notes || '',
    estimatedCosts: booking?.estimatedCosts?.toString() || '',
    actualCosts: booking?.actualCosts?.toString() || '',
    address: booking?.user?.address || '',
    addressCoordinates: null as { lat: number; lng: number } | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.userId) {
      toast.error('Vui lòng chọn khách hàng');
      return;
    }

    if (!formData.serviceId) {
      toast.error('Vui lòng chọn dịch vụ');
      return;
    }

    if (!formData.scheduledAt) {
      toast.error('Vui lòng chọn ngày thực hiện');
      return;
    }

    if (!formData.scheduledTime) {
      toast.error('Vui lòng chọn giờ thực hiện');
      return;
    }

    // Format scheduledAt to ISO string if date is provided
    let scheduledAtISO = formData.scheduledAt;
    if (formData.scheduledAt) {
      const date = new Date(formData.scheduledAt);
      if (isNaN(date.getTime())) {
        toast.error('Ngày thực hiện không hợp lệ');
        return;
      }
      scheduledAtISO = date.toISOString();
    }

    onSubmit({
      ...formData,
      scheduledAt: scheduledAtISO,
      technicianId: formData.technicianId === 'unassigned' ? null : formData.technicianId,
      estimatedCosts: formData.estimatedCosts ? parseInt(formData.estimatedCosts as string) : null,
      actualCosts: formData.actualCosts ? parseInt(formData.actualCosts as string) : null,
      address: formData.address,
      addressCoordinates: formData.addressCoordinates,
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
              {users && users.length > 0 ? (
                users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} {user.email ? `(${user.email})` : ''}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Không có khách hàng nào
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {users && users.length === 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Vui lòng tạo khách hàng trước khi đặt lịch
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="serviceId">Dịch vụ</Label>
          <Select value={formData.serviceId} onValueChange={(value) => setFormData({ ...formData, serviceId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn dịch vụ" />
            </SelectTrigger>
            <SelectContent>
              {services && services.length > 0 ? (
                services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Không có dịch vụ nào
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {services && services.length === 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Vui lòng tạo dịch vụ trước khi đặt lịch
            </p>
          )}
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
          <Label htmlFor="address">Địa chỉ thực hiện dịch vụ</Label>
          <GoongMapAddressPicker
            value={formData.address}
            onChange={(address, coordinates) => setFormData({ ...formData, address: address || '', addressCoordinates: coordinates || null })}
            placeholder="Nhập địa chỉ thực hiện dịch vụ (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
            className="focus-visible:ring-primary/50"
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
