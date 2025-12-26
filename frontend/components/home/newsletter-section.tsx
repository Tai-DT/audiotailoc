'use client';

import React from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useSubscribeNewsletter } from '@/lib/hooks/use-api';
import { toast } from 'react-hot-toast';
import { MagicCard } from '@/components/ui/magic-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';

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
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="section-shell">
        <div className="relative rounded-3xl border border-border/60 bg-card/50 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-[0_24px_120px_-60px_rgba(0,0,0,0.55)] overflow-hidden">
          <DotPattern
            width={20}
            height={20}
            cx={1}
            cy={1}
            cr={1}
            className={cn(
              '[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]',
              'absolute inset-0 h-full w-full fill-foreground/10'
            )}
          />
          <MagicCard
            className="bg-background/60 border border-border/60 backdrop-blur-sm relative z-10"
            gradientSize={360}
            gradientColor="oklch(0.60 0.26 25 / 0.25)"
            gradientFrom="oklch(0.60 0.26 25)"
            gradientTo="oklch(0.72 0.20 35)"
          >
            <Card className="relative bg-background/80 border-border/60 backdrop-blur-sm">
              <BorderBeam
                size={120}
                duration={12}
                colorFrom="oklch(0.72 0.20 35)"
                colorTo="oklch(0.60 0.26 25)"
                borderWidth={2}
              />
              <CardContent className="p-8 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 text-primary mb-2">
                  <Mail className="w-8 h-8" />
                </div>
                <AnimatedGradientText
                  className="text-3xl md:text-4xl font-bold"
                  speed={1.1}
                  colorFrom="oklch(0.60 0.26 25)"
                  colorTo="oklch(0.72 0.20 35)"
                >
                  Đăng ký nhận tin tức
                </AnimatedGradientText>
                <p className="text-lg text-muted-foreground">
                  Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và mẹo sử dụng thiết bị âm thanh từ chuyên gia.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <div className="flex-1 space-y-2">
                    <Input
                      type="email"
                      placeholder="Nhập email của bạn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Tên của bạn (tùy chọn)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <Button type="submit" size="lg" className="whitespace-nowrap sm:w-auto" disabled={subscribeMutation.isPending}>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Tin tức sản phẩm mới</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Khuyến mãi đặc biệt</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Mẹo sử dụng chuyên nghiệp</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Chúng tôi cam kết không spam. Bạn có thể hủy đăng ký bất kỳ lúc nào.
                </p>
              </CardContent>
            </Card>
          </MagicCard>
        </div>
      </div>
    </section>
  );
}

