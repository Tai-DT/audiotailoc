'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateServiceBooking } from '@/lib/hooks/use-api';
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

const bookingSchema = z.object({
  customerName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  address: z.string().optional(),
  preferredDate: z.string().min(1, 'Vui lòng chọn ngày'),
  preferredTime: z.string().min(1, 'Vui lòng chọn giờ'),
  notes: z.string().optional()
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function ServiceBookingModal({ service, isOpen, onClose }: ServiceBookingModalProps) {
  const createBooking = useCreateServiceBooking();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      phone: '',
      email: '',
      address: '',
      preferredDate: '',
      preferredTime: '',
      notes: ''
    }
  });

  const onSubmit = async (data: BookingFormValues) => {
    try {
      await createBooking.mutateAsync({
        serviceId: service.id,
        customerName: data.customerName,
        customerPhone: data.phone,
        customerEmail: data.email,
        customerAddress: data.address || '',
        scheduledDate: data.preferredDate,
        scheduledTime: data.preferredTime,
        notes: data.notes
      });

      toast.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      onClose();
      reset();
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  {...register('customerName')}
                  placeholder="Nhập họ và tên"
                />
                {errors.customerName && (
                  <p className="text-sm text-destructive">{errors.customerName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Nhập địa chỉ email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="Nhập địa chỉ thực hiện dịch vụ"
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
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
                  {...register('preferredDate')}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.preferredDate && (
                  <p className="text-sm text-destructive">{errors.preferredDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Giờ thực hiện *</Label>
                <Controller
                  name="preferredTime"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  )}
                />
                {errors.preferredTime && (
                  <p className="text-sm text-destructive">{errors.preferredTime.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú thêm</Label>
            <Textarea
              id="notes"
              {...register('notes')}
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