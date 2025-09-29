'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  MessageSquare,
  CheckCircle,
  Wrench,
  Star,
  ArrowRight,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useServices, useServiceTypes, useCreateServiceBooking } from '@/lib/hooks/use-api';
import { Service } from '@/lib/types';

// Form validation schema
const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Vui lòng chọn dịch vụ'),
  customerName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  customerPhone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 ký tự'),
  customerEmail: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  customerAddress: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  scheduledDate: z.string().min(1, 'Vui lòng chọn ngày'),
  scheduledTime: z.string().min(1, 'Vui lòng chọn giờ'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function ServiceBookingPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data: servicesData, isLoading: servicesLoading } = useServices({
    isActive: true,
    pageSize: 50
  });
  const { data: serviceTypes } = useServiceTypes();
  const createBookingMutation = useCreateServiceBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerAddress: '',
      scheduledDate: '',
      scheduledTime: '',
      notes: '',
    }
  });

  const watchedServiceId = watch('serviceId');

  // Update selected service when serviceId changes
  React.useEffect(() => {
    if (watchedServiceId && servicesData?.items) {
      const service = servicesData.items.find(s => s.id === watchedServiceId);
      setSelectedService(service || null);
    }
  }, [watchedServiceId, servicesData]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      await createBookingMutation.mutateAsync({
        serviceId: data.serviceId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || undefined,
        customerAddress: data.customerAddress,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        notes: data.notes,
      });

      toast.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      reset();
      setSelectedService(null);
    } catch {
      toast.error('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
    }
  };

  const formatPrice = (service: Service) => {
    switch (service.priceType) {
      case 'FIXED':
        return `${service.price.toLocaleString('vi-VN')}đ`;
      case 'RANGE':
        return `${service.minPrice?.toLocaleString('vi-VN')}đ - ${service.maxPrice?.toLocaleString('vi-VN')}đ`;
      case 'NEGOTIABLE':
        return 'Thỏa thuận';
      case 'CONTACT':
        return 'Liên hệ';
      default:
        return 'Liên hệ';
    }
  };

  const getServiceTypeName = (typeId?: string) => {
    if (!typeId || !serviceTypes) return 'Dịch vụ';
    const type = serviceTypes.find(t => t.id === typeId);
    return type?.name || 'Dịch vụ';
  };
  const servicesByType = React.useMemo(() => {
    if (!servicesData?.items || !serviceTypes) return {};

    const getServiceTypeName = (typeId?: string) => {
      if (!typeId || !serviceTypes) return 'Dịch vụ';
      const type = serviceTypes.find(t => t.id === typeId);
      return type?.name || 'Dịch vụ';
    };

    const grouped: Record<string, Service[]> = {};
    servicesData.items.forEach(service => {
      const typeName = getServiceTypeName(service.typeId);
      if (!grouped[typeName]) {
        grouped[typeName] = [];
      }
      grouped[typeName].push(service);
    });

    return grouped;
  }, [servicesData, serviceTypes]);

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Đặt lịch dịch vụ
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Dễ dàng đặt lịch dịch vụ kỹ thuật âm thanh chuyên nghiệp.
                Đội ngũ kỹ thuật viên giàu kinh nghiệm sẽ đến tận nơi phục vụ bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="text-lg px-8"
                >
                  <Link href="#booking-form">
                    <Calendar className="mr-2 h-5 w-5" />
                    Đặt lịch ngay
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="text-lg px-8"
                >
                  <Link href="tel:+84987654321">
                    <Phone className="mr-2 h-5 w-5" />
                    Gọi ngay: 0987 654 321
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Chọn dịch vụ cần đặt lịch</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Khám phá các dịch vụ chuyên nghiệp từ Audio Tài Lộc,
                được thiết kế để đáp ứng mọi nhu cầu âm thanh của bạn.
              </p>
            </div>

            {servicesLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted rounded mb-4"></div>
                      <div className="h-10 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : Object.keys(servicesByType).length > 0 ? (
              <div className="space-y-12">
                {Object.entries(servicesByType).map(([typeName, services]) => (
                  <div key={typeName}>
                    <h3 className="text-2xl font-semibold mb-6 text-center">{typeName}</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {services.map((service) => (
                        <Card key={service.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary">
                                {getServiceTypeName(service.typeId)}
                              </Badge>
                              {service.isFeatured && (
                                <Badge variant="default">
                                  <Star className="h-3 w-3 mr-1" />
                                  Nổi bật
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl">{service.name}</CardTitle>
                            <div className="text-2xl font-bold text-primary">
                              {formatPrice(service)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4 line-clamp-3">
                              {service.description}
                            </p>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span>Thời gian: {service.duration} phút</span>
                              </div>
                              {service.features && service.features.length > 0 && (
                                <div className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                  <div>
                                    <span className="font-medium">Tính năng:</span>
                                    <ul className="list-disc list-inside ml-2 mt-1">
                                      {service.features.slice(0, 2).map((feature, idx) => (
                                        <li key={idx} className="text-xs">{feature}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>

                            <Button
                              className="w-full"
                              onClick={() => {
                                setValue('serviceId', service.id);
                                setSelectedService(service);
                                document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                            >
                              Chọn dịch vụ này
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wrench className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Không có dịch vụ nào</h3>
                <p className="text-muted-foreground mb-6">
                  Hiện tại chưa có dịch vụ nào được cung cấp.
                  Hãy quay lại sau để được phục vụ!
                </p>
                <Link href="/">
                  <Button>Về trang chủ</Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Booking Form */}
        <section id="booking-form" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Thông tin đặt lịch</h2>
                <p className="text-muted-foreground">
                  Vui lòng điền đầy đủ thông tin để chúng tôi sắp xếp kỹ thuật viên đến đúng thời gian và địa điểm.
                </p>
              </div>

              {selectedService && (
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{selectedService.name}</h3>
                        <p className="text-muted-foreground mb-2">{selectedService.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium text-primary">{formatPrice(selectedService)}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {selectedService.duration} phút
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin khách hàng</CardTitle>
                  <CardDescription>
                    Thông tin của bạn sẽ được bảo mật và chỉ sử dụng để phục vụ dịch vụ.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Service Selection */}
                    <div>
                      <Label htmlFor="serviceId">Chọn dịch vụ *</Label>
                      <select
                        {...register('serviceId')}
                        className="w-full mt-1 p-3 border border-input rounded-md bg-background"
                      >
                        <option value="">-- Chọn dịch vụ --</option>
                        {servicesData?.items?.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name} - {formatPrice(service)}
                          </option>
                        ))}
                      </select>
                      {errors.serviceId && (
                        <p className="text-red-500 text-sm mt-1">{errors.serviceId.message}</p>
                      )}
                    </div>

                    {/* Customer Information */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customerName">Họ tên *</Label>
                        <Input
                          {...register('customerName')}
                          placeholder="Nhập họ tên đầy đủ"
                        />
                        {errors.customerName && (
                          <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="customerPhone">Số điện thoại *</Label>
                        <Input
                          {...register('customerPhone')}
                          placeholder="Ví dụ: 0987654321"
                        />
                        {errors.customerPhone && (
                          <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="customerEmail">Email (tùy chọn)</Label>
                      <Input
                        {...register('customerEmail')}
                        type="email"
                        placeholder="example@email.com"
                      />
                      {errors.customerEmail && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="customerAddress">Địa chỉ thực hiện dịch vụ *</Label>
                      <Textarea
                        {...register('customerAddress')}
                        placeholder="Nhập địa chỉ chi tiết để kỹ thuật viên đến đúng nơi"
                        rows={3}
                      />
                      {errors.customerAddress && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerAddress.message}</p>
                      )}
                    </div>

                    {/* Schedule */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="scheduledDate">Ngày thực hiện *</Label>
                        <Input
                          {...register('scheduledDate')}
                          type="date"
                          min={format(new Date(), 'yyyy-MM-dd')}
                        />
                        {errors.scheduledDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.scheduledDate.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="scheduledTime">Giờ thực hiện *</Label>
                        <select
                          {...register('scheduledTime')}
                          className="w-full mt-1 p-3 border border-input rounded-md bg-background"
                        >
                          <option value="">-- Chọn giờ --</option>
                          <option value="08:00">08:00</option>
                          <option value="09:00">09:00</option>
                          <option value="10:00">10:00</option>
                          <option value="11:00">11:00</option>
                          <option value="13:00">13:00</option>
                          <option value="14:00">14:00</option>
                          <option value="15:00">15:00</option>
                          <option value="16:00">16:00</option>
                          <option value="17:00">17:00</option>
                        </select>
                        {errors.scheduledTime && (
                          <p className="text-red-500 text-sm mt-1">{errors.scheduledTime.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Ghi chú thêm (tùy chọn)</Label>
                      <Textarea
                        {...register('notes')}
                        placeholder="Mô tả thêm về vấn đề cần sửa chữa hoặc yêu cầu đặc biệt..."
                        rows={3}
                      />
                    </div>

                    <Separator />

                    <div className="text-center">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={createBookingMutation.isPending}
                        className="px-12"
                      >
                        {createBookingMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Xác nhận đặt lịch
                          </>
                        )}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-4">
                        Sau khi đặt lịch thành công, chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Liên hệ hỗ trợ</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nếu bạn cần hỗ trợ khẩn cấp hoặc có câu hỏi về dịch vụ,
                đừng ngần ngại liên hệ với đội ngũ Audio Tài Lộc.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Hotline 24/7</h3>
                  <p className="text-muted-foreground mb-4">0987 654 321</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="tel:+84987654321">Gọi ngay</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Địa chỉ</h3>
                  <p className="text-muted-foreground mb-4">
                    123 Đường ABC, Quận XYZ<br />
                    TP. Hồ Chí Minh
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/contact">Xem bản đồ</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Hỗ trợ online</h3>
                  <p className="text-muted-foreground mb-4">
                    Chat trực tiếp với<br />
                    chuyên gia tư vấn
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/contact">Liên hệ</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}