'use client';

import React from 'react';
import { PageBanner } from '@/components/ui/page-banner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

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
      content: '123 Đường ABC, Quận XYZ, TP.HCM, Việt Nam',
      details: 'Gần trung tâm thương mại, dễ dàng tiếp cận'
    },
    {
      icon: Phone,
      title: 'Điện thoại',
      content: '+84 123 456 789',
      details: 'Hỗ trợ 24/7 cho khách hàng'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@audiotailoc.com',
      details: 'Phản hồi trong vòng 24 giờ'
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      content: '8:00 - 18:00 (Thứ 2 - Thứ 7)',
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
        {/* Page Banner */}
        <PageBanner
          page="contact"
          title="Liên hệ Audio Tài Lộc"
          subtitle="Chúng tôi luôn sẵn sàng hỗ trợ"
          description="Hãy liên hệ với chúng tôi để được tư vấn miễn phí về giải pháp âm thanh phù hợp nhất với nhu cầu của bạn. Đội ngũ chuyên nghiệp luôn sẵn sàng hỗ trợ 24/7."
          showStats={true}
        />

        {/* Contact Info Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <info.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">{info.title}</h3>
                    <p className="text-primary font-medium mb-1">{info.content}</p>
                    <p className="text-sm text-muted-foreground">{info.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Services */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
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

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Đang gửi...'
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Gửi tin nhắn
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

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
