'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateServiceBooking } from '@/lib/hooks/use-api';
import { useAuth } from '@/lib/hooks/use-auth';
import { Service } from '@/lib/types';
import { CalendarIcon, Clock, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ServiceBookingModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export function ServiceBookingModal({ service, isOpen, onClose }: ServiceBookingModalProps) {
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  // Auto-fill user info when logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || prev.customerName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address
      }));
    }
  }, [isAuthenticated, user, isOpen]);

  const createBooking = useCreateServiceBooking();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.customerName || !formData.phone || !formData.email || !formData.preferredDate || !formData.preferredTime) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      toast.error('Số điện thoại không hợp lệ');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Email không hợp lệ');
      return;
    }

    try {
      await createBooking.mutateAsync({
        serviceId: service.id,
        customerName: formData.customerName,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        customerAddress: formData.address || '',
        scheduledDate: formData.preferredDate,
        scheduledTime: formData.preferredTime,
        notes: formData.notes,
        // Include userId if user is authenticated - this links booking to their account
        userId: isAuthenticated && user?.id ? user.id : undefined
      });

      toast.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      onClose();

      // Reset form
      setFormData({
        customerName: '',
        phone: '',
        email: '',
        address: '',
        preferredDate: '',
        preferredTime: '',
        notes: ''
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Đặt lịch dịch vụ: {service.name}
          </DialogTitle>
          <DialogDescription>
            Điền thông tin để đặt lịch dịch vụ
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{service.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {service.duration} phút
              </div>
              <div className="font-semibold text-primary">
                {service.priceType === 'FIXED' && `${service.price.toLocaleString('vi-VN')}₫`}
                {service.priceType === 'RANGE' && `Từ ${service.price.toLocaleString('vi-VN')}₫`}
                {service.priceType === 'NEGOTIABLE' && 'Giá thỏa thuận'}
                {service.priceType === 'CONTACT' && 'Liên hệ tư vấn'}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Thông tin khách hàng
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Họ và tên *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Nhập địa chỉ email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Nhập địa chỉ thực hiện dịch vụ"
                />
              </div>
            </div>
          </div>

          {/* Schedule Selection */}
          <div className="space-y-4">
            <h4 className="font-semibold">Chọn thời gian</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Ngày thực hiện *</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Giờ thực hiện *</Label>
                <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú thêm</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Mô tả chi tiết về vấn đề cần sửa chữa hoặc yêu cầu đặc biệt..."
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createBooking.isPending}
            >
              {createBooking.isPending ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}