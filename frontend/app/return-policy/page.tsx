'use client';

import React from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ReturnPolicyPage() {
  const returnConditions = [
    {
      icon: CheckCircle,
      title: 'Được đổi trả',
      items: [
        'Sản phẩm còn nguyên tem mác, bao bì',
        'Sản phẩm không bị hư hỏng, trầy xước',
        'Còn đầy đủ phụ kiện, tài liệu đi kèm',
        'Trong thời hạn quy định',
        'Có phiếu mua hàng hoặc hóa đơn'
      ],
      color: 'text-green-600'
    },
    {
      icon: XCircle,
      title: 'Không đổi trả',
      items: [
        'Sản phẩm đã qua sử dụng',
        'Sản phẩm bị hư hỏng do tác động ngoại lực',
        'Đã tháo rời, sửa chữa bởi bên thứ ba',
        'Quá thời hạn đổi trả',
        'Không có phiếu mua hàng'
      ],
      color: 'text-red-600'
    }
  ];

  const returnProcess = [
    {
      step: 1,
      title: 'Liên hệ',
      description: 'Gọi hotline hoặc mang sản phẩm đến showroom',
      time: 'Trong giờ hành chính'
    },
    {
      step: 2,
      title: 'Kiểm tra',
      description: 'Kỹ thuật viên kiểm tra tình trạng sản phẩm',
      time: 'Ngay khi tiếp nhận'
    },
    {
      step: 3,
      title: 'Xử lý',
      description: 'Xác nhận đổi trả và tiến hành thủ tục',
      time: 'Trong 24h'
    },
    {
      step: 4,
      title: 'Hoàn thành',
      description: 'Đổi sản phẩm mới hoặc hoàn tiền',
      time: 'Trong 3-5 ngày'
    }
  ];

  const returnFees = [
    { period: '7 ngày đầu', fee: 'Miễn phí', condition: 'Sản phẩm lỗi do nhà sản xuất' },
    { period: '8-30 ngày', fee: '10% giá trị', condition: 'Lỗi do nhà sản xuất' },
    { period: '31-90 ngày', fee: '20% giá trị', condition: 'Lỗi do nhà sản xuất' },
    { period: 'Sau 90 ngày', fee: 'Không đổi trả', condition: 'Trừ trường hợp đặc biệt' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Chính sách đổi trả
              </h1>
              <p className="text-xl text-muted-foreground">
                Audio Tài Lộc cam kết quyền lợi khách hàng với chính sách đổi trả
                linh hoạt và minh bạch, đảm bảo sự hài lòng tối đa.
              </p>
            </div>
          </div>
        </section>

        {/* Return Conditions */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Điều kiện đổi trả</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Để đảm bảo quyền lợi cho cả hai bên, chúng tôi quy định rõ ràng các điều kiện đổi trả
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {returnConditions.map((condition, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${condition.color}`}>
                      <condition.icon className="h-5 w-5" />
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

        {/* Return Time & Fees */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Thời hạn và phí đổi trả</h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-4 font-semibold">Thời hạn</th>
                          <th className="text-center p-4 font-semibold">Phí đổi trả</th>
                          <th className="text-left p-4 font-semibold">Điều kiện</th>
                        </tr>
                      </thead>
                      <tbody>
                        {returnFees.map((fee, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-4 font-medium">{fee.period}</td>
                            <td className="p-4 text-center">
                              <Badge variant={fee.fee === 'Miễn phí' ? 'default' : 'secondary'}>
                                {fee.fee}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">{fee.condition}</td>
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

        {/* Return Process */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Quy trình đổi trả</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Chúng tôi cam kết xử lý yêu cầu đổi trả của bạn một cách nhanh chóng và chuyên nghiệp
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {returnProcess.map((step, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                        {step.step}
                      </div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      <Badge variant="outline" className="text-xs">{step.time}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Lưu ý quan trọng</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <FileText className="h-5 w-5" />
                      Quyền lợi khách hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">• Đổi sản phẩm cùng loại hoặc nâng cấp với chi phí chênh lệch</p>
                    <p className="text-sm">• Hoàn tiền 100% nếu không còn sản phẩm thay thế</p>
                    <p className="text-sm">• Hỗ trợ kỹ thuật miễn phí trong quá trình đổi trả</p>
                    <p className="text-sm">• Tư vấn sử dụng và hướng dẫn chi tiết</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="h-5 w-5" />
                      Lưu ý đặc biệt
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">• Thời hạn đổi trả tính từ ngày nhận hàng</p>
                    <p className="text-sm">• Sản phẩm phải còn trong tình trạng ban đầu</p>
                    <p className="text-sm">• Không áp dụng cho sản phẩm giảm giá đặc biệt</p>
                    <p className="text-sm">• Khách hàng chịu phí vận chuyển đổi trả</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Cần đổi trả sản phẩm?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng
              hỗ trợ bạn với quy trình đổi trả đơn giản và nhanh chóng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Yêu cầu đổi trả
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