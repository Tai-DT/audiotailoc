'use client';

import React from 'react';
import { Shield, Wrench, Clock, CheckCircle, AlertTriangle, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function WarrantyPage() {
  const warrantyTypes = [
    {
      icon: Shield,
      title: 'Bảo hành chính hãng',
      period: '12-24 tháng',
      description: 'Bảo hành chính hãng từ nhà sản xuất với đầy đủ quyền lợi'
    },
    {
      icon: Wrench,
      title: 'Bảo hành Audio Tài Lộc',
      period: '6-12 tháng',
      description: 'Bảo hành bởi đội ngũ kỹ thuật chuyên nghiệp của chúng tôi'
    },
    {
      icon: Clock,
      title: 'Hỗ trợ trọn đời',
      period: 'Vĩnh viễn',
      description: 'Hỗ trợ kỹ thuật và tư vấn sử dụng trọn đời sản phẩm'
    }
  ];

  const warrantyConditions = [
    {
      title: 'Điều kiện bảo hành',
      items: [
        'Có phiếu bảo hành chính hãng',
        'Tem bảo hành còn nguyên vẹn',
        'Sản phẩm không bị tác động ngoại lực',
        'Không tự ý tháo rời, sửa chữa',
        'Không sử dụng sai mục đích'
      ]
    },
    {
      title: 'Không bảo hành',
      items: [
        'Hư hỏng do tác động ngoại lực',
        'Lỗi do thiên tai, hỏa hoạn',
        'Sử dụng sai cách dẫn đến hỏng hóc',
        'Tự ý tháo rời, sửa chữa',
        'Hết hạn bảo hành'
      ]
    }
  ];

  const productCategories = [
    { name: 'Amplifier', warranty: '24 tháng', support: 'Trọn đời' },
    { name: 'Loa', warranty: '18 tháng', support: 'Trọn đời' },
    { name: 'Micro', warranty: '12 tháng', support: 'Trọn đời' },
    { name: 'Mixer', warranty: '24 tháng', support: 'Trọn đời' },
    { name: 'Thiết bị thu âm', warranty: '18 tháng', support: 'Trọn đời' },
    { name: 'Phụ kiện', warranty: '6 tháng', support: '12 tháng' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Chính sách bảo hành
              </h1>
              <p className="text-xl text-muted-foreground">
                Audio Tài Lộc cam kết cung cấp dịch vụ bảo hành chuyên nghiệp
                với đội ngũ kỹ thuật giàu kinh nghiệm và trang thiết bị hiện đại.
              </p>
            </div>
          </div>
        </section>

        {/* Warranty Types */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Các loại bảo hành</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Chúng tôi cung cấp nhiều hình thức bảo hành phù hợp với từng loại sản phẩm
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {warrantyTypes.map((type, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <type.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-2xl font-bold text-primary">{type.period}</p>
                    </div>
                    <p className="text-sm">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Product Warranty Table */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Thời hạn bảo hành theo sản phẩm</h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-4 font-semibold">Loại sản phẩm</th>
                          <th className="text-center p-4 font-semibold">Bảo hành</th>
                          <th className="text-center p-4 font-semibold">Hỗ trợ kỹ thuật</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productCategories.map((product, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-4 font-medium">{product.name}</td>
                            <td className="p-4 text-center">
                              <Badge variant="secondary">{product.warranty}</Badge>
                            </td>
                            <td className="p-4 text-center">
                              <Badge variant="outline">{product.support}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Warranty Conditions */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8">
              {warrantyConditions.map((condition, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${
                      index === 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {index === 0 ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                      {condition.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {condition.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <span className={`mt-1 block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            index === 0 ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Warranty Process */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Quy trình bảo hành</h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Liên hệ</h3>
                  <p className="text-sm text-muted-foreground">
                    Gọi hotline hoặc mang sản phẩm đến showroom
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Kiểm tra</h3>
                  <p className="text-sm text-muted-foreground">
                    Kỹ thuật viên kiểm tra và xác nhận lỗi
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Sửa chữa</h3>
                  <p className="text-sm text-muted-foreground">
                    Tiến hành sửa chữa trong thời gian quy định
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Hoàn thành</h3>
                  <p className="text-sm text-muted-foreground">
                    Trả sản phẩm và hướng dẫn sử dụng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Cần bảo hành sản phẩm?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Đội ngũ kỹ thuật chuyên nghiệp của chúng tôi luôn sẵn sàng
              hỗ trợ bạn với dịch vụ bảo hành nhanh chóng và chất lượng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  <Phone className="mr-2 h-4 w-4" />
                  Liên hệ bảo hành
                </Button>
              </Link>
              <Link href="tel:0987654321">
                <Button variant="outline" size="lg">
                  Hotline: 0987 654 321
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}