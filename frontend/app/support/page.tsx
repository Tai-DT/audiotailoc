"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Mail, MapPin, Clock, HelpCircle, FileText, Send } from 'lucide-react';

const faqData = [
  {
    category: 'Đặt hàng',
    items: [
      {
        question: 'Làm thế nào để đặt hàng?',
        answer: 'Bạn có thể đặt hàng bằng cách thêm sản phẩm vào giỏ hàng, sau đó tiến hành thanh toán qua các phương thức thanh toán được hỗ trợ.'
      },
      {
        question: 'Thời gian giao hàng là bao lâu?',
        answer: 'Thời gian giao hàng từ 2-5 ngày làm việc tùy thuộc vào địa điểm giao hàng và phương thức vận chuyển.'
      },
      {
        question: 'Có thể hủy đơn hàng không?',
        answer: 'Bạn có thể hủy đơn hàng trong vòng 24 giờ sau khi đặt hàng và trước khi đơn hàng được xử lý.'
      }
    ]
  },
  {
    category: 'Thanh toán',
    items: [
      {
        question: 'Các phương thức thanh toán nào được chấp nhận?',
        answer: 'Chúng tôi chấp nhận thanh toán qua VNPAY, MOMO, PAYOS và thanh toán khi nhận hàng (COD).'
      },
      {
        question: 'Thanh toán có an toàn không?',
        answer: 'Tất cả các giao dịch thanh toán đều được mã hóa và bảo mật theo tiêu chuẩn quốc tế.'
      }
    ]
  },
  {
    category: 'Dịch vụ',
    items: [
      {
        question: 'Làm thế nào để đặt lịch dịch vụ?',
        answer: 'Bạn có thể đặt lịch dịch vụ thông qua trang "Đặt lịch" trên website hoặc liên hệ trực tiếp với chúng tôi.'
      },
      {
        question: 'Dịch vụ có bảo hành không?',
        answer: 'Tất cả dịch vụ đều có bảo hành theo chính sách của chúng tôi. Thời gian bảo hành tùy thuộc vào loại dịch vụ.'
      }
    ]
  }
];

const contactInfo = [
  {
    icon: <Phone className="h-5 w-5" />,
    title: 'Điện thoại',
    value: '0901 234 567',
    description: 'Hỗ trợ 24/7'
  },
  {
    icon: <Mail className="h-5 w-5" />,
    title: 'Email',
    value: 'support@audiotailoc.com',
    description: 'Phản hồi trong 24h'
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: 'Địa chỉ',
    value: '123 Đường ABC, Quận 1, TP.HCM',
    description: 'Văn phòng chính'
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: 'Giờ làm việc',
    value: '8:00 - 18:00',
    description: 'Thứ 2 - Thứ 7'
  }
];

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState('Đặt hàng');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });

  const handleFaqToggle = (question: string) => {
    setExpandedFaq(expandedFaq === question ? null : question);
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement ticket submission to backend
    console.log('Ticket submitted:', ticketForm);
    alert('Yêu cầu hỗ trợ đã được gửi. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất!');
    setTicketForm({
      name: '',
      email: '',
      phone: '',
      subject: '',
      category: '',
      message: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setTicketForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Hỗ trợ khách hàng</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Tìm câu trả lời nhanh hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Câu hỏi thường gặp (FAQ)
                </CardTitle>
                <CardDescription>
                  Tìm câu trả lời cho các câu hỏi phổ biến
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {faqData.map((category) => (
                    <Button
                      key={category.category}
                      variant={activeCategory === category.category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(category.category)}
                    >
                      {category.category}
                    </Button>
                  ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                  {faqData
                    .find(cat => cat.category === activeCategory)
                    ?.items.map((item, index) => (
                      <div key={index} className="border rounded-lg">
                        <button
                          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          onClick={() => handleFaqToggle(item.question)}
                        >
                          <span className="font-medium">{item.question}</span>
                          <span className="text-gray-400">
                            {expandedFaq === item.question ? '−' : '+'}
                          </span>
                        </button>
                        {expandedFaq === item.question && (
                          <div className="px-4 pb-3 text-gray-600">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact & Ticket Section */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-blue-600 mt-0.5">
                      {contact.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{contact.title}</h4>
                      <p className="text-sm font-medium">{contact.value}</p>
                      <p className="text-xs text-gray-500">{contact.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Support Ticket Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Gửi yêu cầu hỗ trợ
                </CardTitle>
                <CardDescription>
                  Điền form bên dưới để gửi yêu cầu hỗ trợ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ tên *</Label>
                      <Input
                        id="name"
                        value={ticketForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Nhập họ tên"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        value={ticketForm.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={ticketForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Nhập email (không bắt buộc)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Tiêu đề *</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Nhập tiêu đề yêu cầu"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục *</Label>
                    <Select
                      value={ticketForm.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">Đặt hàng</SelectItem>
                        <SelectItem value="payment">Thanh toán</SelectItem>
                        <SelectItem value="service">Dịch vụ</SelectItem>
                        <SelectItem value="technical">Kỹ thuật</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Nội dung *</Label>
                    <Textarea
                      id="message"
                      value={ticketForm.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Mô tả chi tiết vấn đề của bạn"
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Gửi yêu cầu hỗ trợ
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Support Options */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Hỗ trợ khác</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">📞</div>
                  <h3 className="font-semibold mb-2">Gọi điện trực tiếp</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Liên hệ trực tiếp với nhân viên hỗ trợ
                  </p>
                  <Button asChild>
                    <a href="tel:0901234567">Gọi ngay</a>
                  </Button>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="font-semibold mb-2">Chat trực tuyến</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Chat với bot hỗ trợ 24/7
                  </p>
                  <Button variant="outline">
                    Bắt đầu chat
                  </Button>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="font-semibold mb-2">Email hỗ trợ</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Gửi email chi tiết cho chúng tôi
                  </p>
                  <Button asChild variant="outline">
                    <a href="mailto:support@audiotailoc.com">Gửi email</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
