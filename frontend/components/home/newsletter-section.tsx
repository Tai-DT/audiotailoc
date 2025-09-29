'use client';

import React from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useSubscribeNewsletter } from '@/lib/hooks/use-api';
import { toast } from 'react-hot-toast';

export function NewsletterSection() {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const subscribeMutation = useSubscribeNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        await subscribeMutation.mutateAsync({ email, name: name || undefined });
        toast.success('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi thông tin mới nhất đến email của bạn.');
        setEmail('');
        setName('');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : '';
        if (message.includes('already subscribed')) {
          toast.error('Email này đã được đăng ký trước đó.');
        } else {
          toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
      }
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
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1 space-y-2">
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background text-foreground"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Tên của bạn (tùy chọn)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background text-foreground"
                  />
                </div>
                <Button
                  type="submit"
                  className="whitespace-nowrap sm:w-auto"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? (
                    'Đang xử lý...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Đăng ký
                    </>
                  )}
                </Button>
              </form>

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

