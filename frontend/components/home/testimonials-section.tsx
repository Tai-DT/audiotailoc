'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function TestimonialsSection() {
  const testimonials = [
    {
      id: '1',
      content: 'Audio Tài Lộc đã cung cấp cho chúng tôi hệ thống âm thanh tuyệt vời cho sân khấu. Chất lượng âm thanh rất tốt và dịch vụ hỗ trợ chuyên nghiệp.',
      author: 'Nguyễn Văn A',
      role: 'Giám đốc Trung tâm Văn hóa',
      company: 'Trung tâm Văn hóa ABC',
      avatar: '/avatar-1.jpg',
      rating: 5
    },
    {
      id: '2',
      content: 'Đội ngũ kỹ thuật rất chuyên nghiệp, lắp đặt nhanh chóng và chính xác. Hệ thống hoạt động ổn định từ ngày đầu tiên.',
      author: 'Trần Thị B',
      role: 'Quản lý Sự kiện',
      company: 'Công ty Giải trí XYZ',
      avatar: '/avatar-2.jpg',
      rating: 5
    },
    {
      id: '3',
      content: 'Giá cả hợp lý, chất lượng sản phẩm tốt. Đặc biệt là dịch vụ bảo hành và hỗ trợ kỹ thuật rất tận tình.',
      author: 'Lê Văn C',
      role: 'Chủ Studio',
      company: 'Studio Thu âm DEF',
      avatar: '/avatar-3.jpg',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Những phản hồi chân thực từ khách hàng đã tin tưởng và sử dụng 
            dịch vụ của chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback>
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


