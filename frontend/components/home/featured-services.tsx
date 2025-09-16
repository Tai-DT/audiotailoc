'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Settings, Headphones, Mic, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function FeaturedServices() {
  const services = [
    {
      icon: Settings,
      title: 'Lắp đặt hệ thống',
      description: 'Lắp đặt và cấu hình hệ thống âm thanh chuyên nghiệp cho sân khấu, hội trường, studio.',
      features: ['Thiết kế hệ thống', 'Lắp đặt chuyên nghiệp', 'Kiểm tra chất lượng']
    },
    {
      icon: Headphones,
      title: 'Bảo trì & Sửa chữa',
      description: 'Dịch vụ bảo trì định kỳ và sửa chữa thiết bị âm thanh với đội ngũ kỹ thuật viên giàu kinh nghiệm.',
      features: ['Bảo trì định kỳ', 'Sửa chữa chuyên nghiệp', 'Thay thế linh kiện']
    },
    {
      icon: Mic,
      title: 'Tư vấn kỹ thuật',
      description: 'Tư vấn và hỗ trợ kỹ thuật để lựa chọn thiết bị phù hợp với nhu cầu và ngân sách.',
      features: ['Tư vấn chuyên môn', 'Thiết kế giải pháp', 'Hỗ trợ 24/7']
    },
    {
      icon: Volume2,
      title: 'Cho thuê thiết bị',
      description: 'Cho thuê thiết bị âm thanh cho các sự kiện, hội nghị với giá cả cạnh tranh.',
      features: ['Thiết bị chất lượng', 'Giá thuê hợp lý', 'Hỗ trợ kỹ thuật']
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dịch vụ chuyên nghiệp
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Đội ngũ kỹ thuật viên giàu kinh nghiệm sẵn sàng phục vụ mọi nhu cầu 
            về âm thanh của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/services">
            <Button variant="outline" size="lg">
              Xem tất cả dịch vụ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}


