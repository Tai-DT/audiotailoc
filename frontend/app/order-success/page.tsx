'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  Home,
  ShoppingBag,
  Truck,
  Phone,
  Mail
} from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              Đặt hàng thành công!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Cảm ơn bạn đã tin tưởng và lựa chọn Audio Tài Lộc
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã đơn hàng:</span>
                  <span className="font-medium">#ATL{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thời gian đặt:</span>
                  <span className="font-medium">
                    {new Date().toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <span className="font-medium text-green-600">Đã xác nhận</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Các bước tiếp theo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Xác nhận đơn hàng</h4>
                    <p className="text-sm text-muted-foreground">
                      Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận đơn hàng
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Chuẩn bị hàng</h4>
                    <p className="text-sm text-muted-foreground">
                      Sản phẩm sẽ được kiểm tra và chuẩn bị trong 1-2 ngày làm việc
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Giao hàng</h4>
                    <p className="text-sm text-muted-foreground">
                      Đơn hàng sẽ được giao đến địa chỉ của bạn trong 2-3 ngày
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Cần hỗ trợ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Hotline: 1900 XXX XXX</p>
                    <p className="text-sm text-muted-foreground">Hỗ trợ 24/7</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Email: support@audiotailoc.com</p>
                    <p className="text-sm text-muted-foreground">Phản hồi trong 24h</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="h-5 w-5 mr-2" />
                Về trang chủ
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>
                Theo dõi đơn hàng của bạn qua email hoặc gọi hotline để được hỗ trợ
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}