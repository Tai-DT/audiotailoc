'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Calendar,
  Headphones
} from 'lucide-react';
import { ContactSection } from '@/components/home/contact-section';
import { toast } from 'react-hot-toast';
import { MagicCard } from '@/components/ui/magic-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { apiClient, handleApiResponse } from '@/lib/api';
import { PageBanner } from '@/components/shared/page-banner';

interface SiteSettings {
  general?: {
    siteName?: string;
    tagline?: string;
    logoUrl?: string;
    primaryEmail?: string;
    primaryPhone?: string;
    address?: string;
    workingHours?: string;
  };
  socials?: {
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    instagram?: string;
    zalo?: string;
  };
  store?: {
    address?: string;
    phone?: string;
    email?: string;
    workingHours?: string;
  };
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get('/content/settings');
      const data = handleApiResponse<SiteSettings>(response);
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send to support tickets API
      await apiClient.post('/support/tickets', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || `Liên hệ từ ${formData.name}`,
        description: `Số điện thoại: ${formData.phone}\n\n${formData.message}`,
        priority: 'MEDIUM',
      });

      toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Địa chỉ',
      content: settings?.general?.address || settings?.store?.address || '123 Đường ABC, Quận 1, TP.HCM',
      details: 'Gần trung tâm thương mại, dễ dàng tiếp cận'
    },
    {
      icon: Phone,
      title: 'Điện thoại',
      content: settings?.general?.primaryPhone || settings?.store?.phone || '0901 234 567',
      details: 'Hỗ trợ 24/7 cho khách hàng'
    },
    {
      icon: Mail,
      title: 'Email',
      content: settings?.general?.primaryEmail || settings?.store?.email || 'info@audiotailoc.com',
      details: 'Phản hồi trong vòng 24 giờ'
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      content: settings?.general?.workingHours || settings?.store?.workingHours || 'Thứ 2 - Thứ 7: 8:00 - 20:00',
      details: 'Nghỉ Chủ nhật và các ngày lễ'
    }
  ];

  const services = [
    {
      icon: Headphones,
      title: 'Tư vấn kỹ thuật',
      description: 'Đội ngũ kỹ thuật viên giàu kinh nghiệm sẵn sàng tư vấn giải pháp âm thanh phù hợp.'
    },
    {
      icon: Calendar,
      title: 'Lịch hẹn',
      description: 'Đặt lịch tư vấn trực tiếp tại showroom hoặc khảo sát tại hiện trường.'
    },
    {
      icon: MessageSquare,
      title: 'Hỗ trợ trực tuyến',
      description: 'Chat trực tuyến và hotline hỗ trợ kỹ thuật 24/7.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Banner */}
        <PageBanner 
          page="contact" 
          fallbackTitle={`Liên hệ ${settings?.general?.siteName || 'Audio Tài Lộc'}`}
          fallbackSubtitle="Hãy liên hệ với chúng tôi để được tư vấn miễn phí về giải pháp âm thanh. Đội ngũ chuyên nghiệp luôn sẵn sàng hỗ trợ 24/7."
        />

        {/* Contact Info Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {contactInfo.map((info, index) => (
                <MagicCard key={index} gradientColor="oklch(0.97 0.008 45)" className="p-0 border-none shadow-none">
                  <Card className="text-center border-0 shadow-lg relative overflow-hidden">
                    <BorderBeam
                      size={80}
                      duration={10}
                      colorFrom="oklch(0.58 0.28 20)"
                      colorTo="oklch(0.70 0.22 40)"
                      borderWidth={1.5}
                    />
                    <CardContent className="pt-6">
                      <info.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <h3 className="font-semibold mb-2">{info.title}</h3>
                      <p className="text-primary font-medium mb-1">{info.content}</p>
                      <p className="text-sm text-muted-foreground">{info.details}</p>
                    </CardContent>
                  </Card>
                </MagicCard>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Services */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <MagicCard gradientColor="oklch(0.97 0.008 45)" className="p-0 border-none shadow-none">
                <Card className="border-0 shadow-xl relative overflow-hidden">
                  <BorderBeam
                    size={150}
                    duration={12}
                    colorFrom="oklch(0.58 0.28 20)"
                    colorTo="oklch(0.70 0.22 40)"
                    borderWidth={2}
                  />
                  <CardHeader>
                    <CardTitle className="text-2xl">Gửi tin nhắn</CardTitle>
                    <p className="text-muted-foreground">
                      Điền thông tin và chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ tên *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Nhập họ tên của bạn"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập địa chỉ email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Tiêu đề</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Tiêu đề tin nhắn"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Nội dung *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="Mô tả yêu cầu hoặc câu hỏi của bạn..."
                      />
                    </div>

                      <ShimmerButton
                        type="submit"
                        className="w-full h-12 text-base font-semibold"
                        disabled={isSubmitting}
                        shimmerColor="oklch(0.99 0.005 45)"
                        shimmerSize="0.1em"
                        borderRadius="0.5rem"
                        background="oklch(0.58 0.28 20)"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center text-white">
                            <span className="mr-2">Đang gửi...</span>
                          </span>
                        ) : (
                          <span className="flex items-center text-white">
                            <Send className="mr-2 h-4 w-4" />
                            Gửi tin nhắn
                          </span>
                        )}
                      </ShimmerButton>
                    </form>
                  </CardContent>
                </Card>
              </MagicCard>

              {/* Services & FAQ */}
              <div className="space-y-8">
                {/* Services */}
                <Card>
                  <CardHeader>
                    <CardTitle>Dịch vụ hỗ trợ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {services.map((service, index) => (
                      <div key={index} className="flex space-x-4">
                        <service.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold mb-1">{service.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* FAQ */}
                <Card>
                  <CardHeader>
                    <CardTitle>Câu hỏi thường gặp</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Thời gian phản hồi?</h4>
                      <p className="text-sm text-muted-foreground">
                        Chúng tôi cam kết phản hồi trong vòng 24 giờ làm việc.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Có hỗ trợ kỹ thuật không?</h4>
                      <p className="text-sm text-muted-foreground">
                        Có, đội ngũ kỹ thuật viên giàu kinh nghiệm sẵn sàng hỗ trợ.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Có bảo hành không?</h4>
                      <p className="text-sm text-muted-foreground">
                        Tất cả sản phẩm đều có chế độ bảo hành chính hãng.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section with Zalo Chat */}
        <ContactSection />

        {/* Map Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Tìm đường đến Audio Tài Lộc</h2>
              <p className="text-muted-foreground">
                Showroom của chúng tôi nằm tại vị trí thuận tiện, dễ dàng tiếp cận
              </p>
            </div>
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Bản đồ sẽ được hiển thị tại đây
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
