'use client';

import React from 'react';
import { Users, Package, Star, Award } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: '1000+',
      label: 'Khách hàng hài lòng',
      description: 'Được tin tưởng bởi hàng nghìn khách hàng'
    },
    {
      icon: Package,
      value: '500+',
      label: 'Sản phẩm chất lượng',
      description: 'Đa dạng thiết bị âm thanh chuyên nghiệp'
    },
    {
      icon: Star,
      value: '4.9/5',
      label: 'Đánh giá trung bình',
      description: 'Chất lượng dịch vụ được đánh giá cao'
    },
    {
      icon: Award,
      value: '5+',
      label: 'Năm kinh nghiệm',
      description: 'Uy tín và kinh nghiệm trong ngành'
    }
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tại sao chọn Audio Tài Lộc?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Chúng tôi tự hào mang đến những giá trị vượt trội cho khách hàng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <h3 className="text-lg font-semibold">
                  {stat.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


