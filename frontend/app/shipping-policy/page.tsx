'use client';

import React from 'react';
import { Truck, Clock, MapPin, Phone, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ShippingPolicyPage() {
  const shippingOptions = [
    {
      icon: Truck,
      title: 'Giao hàng tiêu chuẩn',
      time: '2-3 ngày',
      cost: 'Miễn phí cho đơn ≥ 5 triệu',
      description: 'Giao hàng trong khu vực TP.HCM và các tỉnh lân cận'
    },
    {
      icon: Clock,
      title: 'Giao hàng nhanh',
      time: '1 ngày',
      cost: '50,000đ',
      description: 'Giao hàng trong ngày tại TP.HCM, 1-2 ngày cho tỉnh lân cận'
    },
    {
      icon: MapPin,
      title: 'Giao hàng toàn quốc',
      time: '3-7 ngày',
      cost: 'Tính theo khoảng cách',
      description: 'Giao hàng đến tất cả 63 tỉnh thành trên toàn quốc'
    }
  ];

  const regions = [
    { name: 'TP.HCM', time: '1-2 ngày', cost: 'Miễn phí ≥ 3 triệu' },
    { name: 'Các tỉnh Đông Nam Bộ', time: '2-3 ngày', cost: 'Miễn phí ≥ 5 triệu' },
    { name: 'Các tỉnh miền Trung', time: '3-5 ngày', cost: 'Miễn phí ≥ 10 triệu' },
    { name: 'Các tỉnh miền Bắc', time: '4-7 ngày', cost: 'Miễn phí ≥ 15 triệu' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Chính sách giao hàng
              </h1>
              <p className="text-xl text-muted-foreground">
                Audio Tài Lộc cam kết giao hàng nhanh chóng, an toàn và đúng hẹn
                đến tay khách hàng trên toàn quốc.
              </p>
            </div>
          </div>
        </section>

        {/* Shipping Options */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Phương thức giao hàng</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Chúng tôi cung cấp nhiều lựa chọn giao hàng phù hợp với nhu cầu của bạn
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {shippingOptions.map((option, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <option.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-xl">{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-2xl font-bold text-primary">{option.time}</p>
                      <p className="text-sm text-muted-foreground">{option.cost}</p>
                    </div>
                    <p className="text-sm">{option.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Regional Shipping */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Thời gian giao hàng theo khu vực</h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-4">
                {regions.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                    <div className="flex items-center gap-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium">{region.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{region.time}</p>
                      <p className="text-sm text-muted-foreground">{region.cost}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Terms and Conditions */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Điều khoản và điều kiện</h2>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Quy trình giao hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="font-semibold">1. Xác nhận đơn hàng</p>
                      <p className="text-muted-foreground">Sau khi nhận đơn hàng, chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút.</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">2. Chuẩn bị hàng</p>
                      <p className="text-muted-foreground">Thời gian chuẩn bị hàng từ 1-2 ngày làm việc tùy thuộc vào sản phẩm.</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">3. Giao hàng</p>
                      <p className="text-muted-foreground">Đơn vị vận chuyển sẽ liên hệ trước khi giao hàng 30 phút.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Lưu ý quan trọng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Khách hàng cần có mặt tại địa chỉ giao hàng trong giờ hành chính</li>
                      <li>• Kiểm tra kỹ hàng hóa trước khi nhận và ký xác nhận</li>
                      <li>• Phí giao hàng sẽ được tính theo chính sách hiện hành</li>
                      <li>• Thời gian giao hàng có thể thay đổi do điều kiện khách quan</li>
                      <li>• Miễn phí giao hàng cho đơn hàng từ 5 triệu đồng trở lên</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Cần hỗ trợ?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Nếu bạn có bất kỳ câu hỏi nào về chính sách giao hàng,
              vui lòng liên hệ với chúng tôi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  <Phone className="mr-2 h-4 w-4" />
                  Liên hệ ngay
                </Button>
              </Link>
              <Link href="tel:0987654321">
                <Button variant="outline" size="lg">
                  0987 654 321
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}