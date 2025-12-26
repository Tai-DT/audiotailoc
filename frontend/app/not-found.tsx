'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Search className="h-24 w-24 text-muted-foreground" />
              <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                404
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl">Không tìm thấy trang</CardTitle>
          <CardDescription className="text-base">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button variant="default" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Về trang chủ
              </Button>
            </Link>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">Gợi ý cho bạn:</p>
            <div className="space-y-2">
              <Link href="/products" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  📦 Sản phẩm
                </Button>
              </Link>
              <Link href="/services" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  🔧 Dịch vụ
                </Button>
              </Link>
              <Link href="/blog" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  📰 Blog
                </Button>
              </Link>
              <Link href="/support" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  💬 Hỗ trợ
                </Button>
              </Link>
              <Link href="/contact" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  📞 Liên hệ
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
