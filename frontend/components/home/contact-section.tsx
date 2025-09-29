'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { CONTACT_CONFIG } from '@/lib/contact-config';
import { useZaloChat } from '@/hooks/use-zalo-chat';

export function ContactSection() {
  const { openZaloChat } = useZaloChat();
  const [isHovered, setIsHovered] = useState(false);

  const handleZaloClick = () => {
    openZaloChat(CONTACT_CONFIG.zalo.phoneNumber);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Liên Hệ Với Chúng Tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn với các giải pháp âm thanh chuyên nghiệp.
            Hãy liên hệ ngay để được tư vấn miễn phí!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Phone Contact */}
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Điện Thoại</CardTitle>
              <CardDescription>
                Gọi ngay để được tư vấn trực tiếp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-blue-600 mb-4">
                {CONTACT_CONFIG.phone.display}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(`tel:${CONTACT_CONFIG.phone.number}`, '_self')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Gọi Ngay
              </Button>
            </CardContent>
          </Card>

          {/* Zalo Chat */}
          <Card
            className="text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleZaloClick}
          >
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className={`w-6 h-6 text-white transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
              </div>
              <CardTitle className="text-xl">Chat Zalo</CardTitle>
              <CardDescription>
                Nhắn tin nhanh chóng qua Zalo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-blue-600 mb-4">
                {CONTACT_CONFIG.zalo.displayName}
              </p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat Zalo
              </Button>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Email</CardTitle>
              <CardDescription>
                Gửi email để được hỗ trợ chi tiết
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-green-600 mb-4">
                {CONTACT_CONFIG.email}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(`mailto:${CONTACT_CONFIG.email}`, '_self')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Gửi Email
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Business Hours */}
        <div className="mt-12 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Giờ Làm Việc</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thứ 2 - Thứ 6:</span>
                  <span className="font-semibold">8:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thứ 7:</span>
                  <span className="font-semibold">8:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chủ Nhật:</span>
                  <span className="font-semibold">Đóng cửa</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Address */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span>
              {CONTACT_CONFIG.address.street}, {CONTACT_CONFIG.address.city}, {CONTACT_CONFIG.address.country}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}