'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';

interface Service {
  id: string;
  name: string;
  description: string;
  basePriceCents: number;
  items: Array<{
    id: string;
    name: string;
    priceCents: number;
  }>;
}

interface BookingFormData {
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>();

  const serviceId = watch('serviceId');
  const selectedItems = searchParams.get('items')?.split(',').filter(Boolean) || [];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        // TODO: Implement API call
        // const response = await api.services.getAll({ isActive: true });
        // const servicesData = response.data.data;

        // Mock data for now
        const mockServices: Service[] = [
          {
            id: '1',
            name: 'Tư vấn âm thanh gia đình',
            description: 'Tư vấn và thiết kế hệ thống âm thanh cho gia đình',
            basePriceCents: 300000,
            items: [
              { id: 'item1', name: 'Loa bookshelf', priceCents: 200000 },
              { id: 'item2', name: 'Amply', priceCents: 150000 }
            ]
          },
          {
            id: '2',
            name: 'Lắp đặt hệ thống karaoke',
            description: 'Lắp đặt và cấu hình hệ thống karaoke chuyên nghiệp',
            basePriceCents: 500000,
            items: [
              { id: 'item3', name: 'Micro không dây', priceCents: 100000 },
              { id: 'item4', name: 'Mixer', priceCents: 300000 }
            ]
          }
        ];
        setServices(mockServices);

        const preSelectedServiceId = searchParams.get('serviceId');
        if (preSelectedServiceId) {
          const service = mockServices.find((s: Service) => s.id === preSelectedServiceId);
          if (service) {
            setSelectedService(service);
            setValue('serviceId', service.id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
        toast.error('Không thể tải danh sách dịch vụ');
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [searchParams, setValue]);

  useEffect(() => {
    if (serviceId) {
      const service = services.find(s => s.id === serviceId);
      setSelectedService(service || null);
    } else {
      setSelectedService(null);
    }
  }, [serviceId, services]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true);

      const bookingData = {
        ...data,
        items: selectedItems.map(itemId => ({ itemId, quantity: 1 }))
      };

      // TODO: Implement API call
      // await api.bookings.create(bookingData);

      toast.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      router.push('/account/bookings');
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Đặt lịch thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedService) return 0;
    
    const basePrice = selectedService.basePriceCents;
    const itemsPrice = selectedService.items
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.priceCents, 0);
    
    return basePrice + itemsPrice;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt lịch dịch vụ</h1>
            <p className="text-gray-600">Điền thông tin để đặt lịch dịch vụ của chúng tôi</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đặt lịch</CardTitle>
                <CardDescription>Vui lòng điền đầy đủ thông tin bên dưới</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Service Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="serviceId">Chọn dịch vụ *</Label>
                    <Select value={serviceId} onValueChange={(value) => setValue('serviceId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn dịch vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.serviceId && (
                      <p className="text-sm text-red-600">{errors.serviceId.message}</p>
                    )}
                  </div>

                  {/* Customer Name */}
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Họ và tên *</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        {...register('customerName', { required: 'Vui lòng nhập họ và tên' })}
                        placeholder="Nhập họ và tên"
                        className="pl-10"
                      />
                    </div>
                    {errors.customerName && (
                      <p className="text-sm text-red-600">{errors.customerName.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Số điện thoại *</Label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        {...register('customerPhone', { required: 'Vui lòng nhập số điện thoại' })}
                        placeholder="Nhập số điện thoại"
                        className="pl-10"
                      />
                    </div>
                    {errors.customerPhone && (
                      <p className="text-sm text-red-600">{errors.customerPhone.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email</Label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        {...register('customerEmail')}
                        type="email"
                        placeholder="Nhập email (tùy chọn)"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="customerAddress">Địa chỉ *</Label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        {...register('customerAddress', { required: 'Vui lòng nhập địa chỉ' })}
                        placeholder="Nhập địa chỉ"
                        className="pl-10"
                      />
                    </div>
                    {errors.customerAddress && (
                      <p className="text-sm text-red-600">{errors.customerAddress.message}</p>
                    )}
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate">Ngày *</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          {...register('scheduledDate', { required: 'Vui lòng chọn ngày' })}
                          type="date"
                          className="pl-10"
                        />
                      </div>
                      {errors.scheduledDate && (
                        <p className="text-sm text-red-600">{errors.scheduledDate.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scheduledTime">Giờ *</Label>
                      <div className="relative">
                        <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          {...register('scheduledTime', { required: 'Vui lòng chọn giờ' })}
                          type="time"
                          className="pl-10"
                        />
                      </div>
                      {errors.scheduledTime && (
                        <p className="text-sm text-red-600">{errors.scheduledTime.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú</Label>
                    <div className="relative">
                      <DocumentTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Textarea
                        {...register('notes')}
                        placeholder="Ghi chú thêm (tùy chọn)"
                        className="pl-10"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Đang xử lý...' : 'Đặt lịch ngay'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Service Details */}
            <div className="space-y-6">
              {selectedService && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Chi tiết dịch vụ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedService.name}</h3>
                        {selectedService.description && (
                          <p className="text-gray-600 text-sm mt-1">{selectedService.description}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Thời gian ước tính:</span>
                        <span className="font-medium">120 phút</span>
                      </div>

                      {selectedService.items && selectedService.items.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Hạng mục dịch vụ:</h4>
                          <div className="space-y-2">
                            {selectedService.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={item.id}
                                    checked={selectedItems.includes(item.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        selectedItems.push(item.id);
                                      } else {
                                        const index = selectedItems.indexOf(item.id);
                                        if (index > -1) {
                                          selectedItems.splice(index, 1);
                                        }
                                      }
                                    }}
                                    className="rounded border-gray-300"
                                  />
                                  <Label htmlFor={item.id} className="text-sm">
                                    {item.name}
                                  </Label>
                                </div>
                                <span className="text-sm font-medium">
                                  {item.priceCents.toLocaleString()} VND
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between text-lg font-bold">
                          <span>Tổng cộng:</span>
                          <span className="text-primary-600">
                            {calculateTotalPrice().toLocaleString()} VND
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Booking Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin đặt lịch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Xác nhận đặt lịch</h4>
                        <p className="text-sm text-gray-600">Chúng tôi sẽ liên hệ xác nhận trong vòng 24h</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CurrencyDollarIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Thanh toán</h4>
                        <p className="text-sm text-gray-600">Thanh toán sau khi hoàn thành dịch vụ</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Bảo hành</h4>
                        <p className="text-sm text-gray-600">Bảo hành 12 tháng cho tất cả dịch vụ</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
