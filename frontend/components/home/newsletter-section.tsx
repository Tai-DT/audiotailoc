'use client';

import React from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export function NewsletterSection() {
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Implement newsletter subscription
      console.log('Subscribe email:', email);
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <Card className="bg-primary/10 border-primary/20 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary-foreground mb-4">
                <Mail className="w-8 h-8" />
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold">
                Đăng ký nhận tin tức
              </h2>
              <p className="text-lg text-primary-foreground/80">
                Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và 
                các mẹo sử dụng thiết bị âm thanh từ chuyên gia.
              </p>

              {/* Form */}
              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background text-foreground"
                    required
                  />
                  <Button type="submit" className="whitespace-nowrap">
                    <Send className="w-4 h-4 mr-2" />
                    Đăng ký
                  </Button>
                </form>
              ) : (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-400 font-medium">
                    ✓ Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi thông tin mới nhất đến email của bạn.
                  </p>
                </div>
              )}

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-foreground/60 rounded-full"></div>
                  <span>Tin tức sản phẩm mới</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-foreground/60 rounded-full"></div>
                  <span>Khuyến mãi đặc biệt</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-foreground/60 rounded-full"></div>
                  <span>Mẹo sử dụng chuyên nghiệp</span>
                </div>
              </div>

              <p className="text-xs text-primary-foreground/60">
                Chúng tôi cam kết không spam. Bạn có thể hủy đăng ký bất kỳ lúc nào.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


