"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Calendar, Clock, MapPin, Phone, Mail, User } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description?: string;
  basePriceCents: number;
  estimatedDuration: number;
  category: string;
  type: string;
}

interface BookingForm {
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  scheduledDate: string;
  scheduledTime: string;
  notes: string;
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const preSelectedServiceId = searchParams.get('service');
  
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const [formData, setFormData] = useState<BookingForm>({
    serviceId: preSelectedServiceId || '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: ''
  });

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!base) return;

        const response = await fetch(`${base}/services?isActive=true`);
        if (response.ok) {
          const data = await response.json();
          setServices(data.items || []);
          
          // Auto-select service if pre-selected
          if (preSelectedServiceId) {
            const service = data.items?.find((s: Service) => s.id === preSelectedServiceId);
            if (service) {
              setSelectedService(service);
              setFormData(prev => ({ ...prev, serviceId: service.id }));
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, [preSelectedServiceId]);

  // Update selected service when serviceId changes
  useEffect(() => {
    if (formData.serviceId) {
      const service = services.find(s => s.id === formData.serviceId);
      setSelectedService(service || null);
    } else {
      setSelectedService(null);
    }
  }, [formData.serviceId, services]);

  const handleInputChange = (field: keyof BookingForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) throw new Error('API base URL not configured');

      const response = await fetch(`${base}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          scheduledDate: `${formData.scheduledDate}T${formData.scheduledTime}:00.000Z`
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          serviceId: '',
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          customerAddress: '',
          scheduledDate: '',
          scheduledTime: '',
          notes: ''
        });
        setSelectedService(null);
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitStatus('error');
    }
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Đặt lịch dịch vụ</h1>
          <p className="text-xl text-gray-600">
            Chọn dịch vụ và thời gian phù hợp với bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Thông tin đặt lịch
                </CardTitle>
                <CardDescription>
                  Điền thông tin để đặt lịch dịch vụ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="service">Chọn dịch vụ *</Label>
                    <Select value={formData.serviceId} onValueChange={(value) => handleInputChange('serviceId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn dịch vụ bạn cần" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            <div className="flex justify-between items-center w-full">
                              <span>{service.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {formatPrice(service.basePriceCents)}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Họ tên *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="customerName"
                          value={formData.customerName}
                          onChange={(e) => handleInputChange('customerName', e.target.value)}
                          placeholder="Nhập họ tên"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Số điện thoại *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="customerPhone"
                          value={formData.customerPhone}
                          onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                          placeholder="Nhập số điện thoại"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        placeholder="Nhập email (không bắt buộc)"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerAddress">Địa chỉ *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="customerAddress"
                        value={formData.customerAddress}
                        onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                        placeholder="Nhập địa chỉ"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate">Ngày *</Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                        min={today}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scheduledTime">Thời gian *</Label>
                      <Select value={formData.scheduledTime} onValueChange={(value) => handleInputChange('scheduledTime', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thời gian" />
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

                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Mô tả thêm về yêu cầu của bạn (không bắt buộc)"
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={submitStatus === 'loading'}
                  >
                    {submitStatus === 'loading' ? 'Đang đặt lịch...' : 'Đặt lịch ngay'}
                  </Button>

                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp.</p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Service Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết dịch vụ</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedService ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedService.name}</h3>
                      <p className="text-gray-600 text-sm">{selectedService.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giá dịch vụ:</span>
                        <span className="font-semibold text-lg">{formatPrice(selectedService.basePriceCents)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thời gian ước tính:</span>
                        <span>{selectedService.estimatedDuration} phút</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loại dịch vụ:</span>
                        <Badge variant="outline">{selectedService.type}</Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Chọn dịch vụ để xem chi tiết</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Liên hệ hỗ trợ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>024.1234.5678</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>booking@audiotailoc.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>123 Đường ABC, Hà Nội</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
