
'use client';

import React from 'react';
import { PageBanner } from '@/components/shared/page-banner';
import { Card, CardContent } from '@/components/ui/card';
import { BlurFade } from '@/components/ui/blur-fade';
import { Award, Users, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';

const stats = [
  { label: 'Năm kinh nghiệm', value: '10+', icon: Award },
  { label: 'Dự án hoàn thành', value: '500+', icon: Zap },
  { label: 'Khách hàng hài lòng', value: '1000+', icon: Users },
  { label: 'Thiết bị chính hãng', value: '100%', icon: ShieldCheck },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Banner */}
        <PageBanner 
          page="about" 
          fallbackTitle="Về Audio Tài Lộc" 
          fallbackSubtitle="Hành trình đam mê mang những trải nghiệm âm thanh đỉnh cao đến với hàng ngàn gia đình Việt."
        />

        {/* Stats Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <BlurFade key={index} delay={0.1 * index}>
                  <Card className="text-center border-none shadow-sm bg-background">
                    <CardContent className="pt-6">
                      <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <BlurFade delay={0.2} direction="right">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold">Câu Chuyện Của Chúng Tôi</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Được thành lập từ những người đam mê âm thanh, Audio Tài Lộc đã trải qua hành trình hơn 10 năm phát triển để trở thành một trong những đơn vị cung cấp giải pháp âm thanh uy tín hàng đầu.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Chúng tôi tin rằng âm thanh không chỉ là những tần số, mà là cảm xúc và là linh hồn của kiến trúc. Vì vậy, mỗi dự án đều được chúng tôi khảo sát, tư vấn và lắp đặt bằng cả sự tận tâm và chuyên môn cao nhất.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">Thiết bị chính hãng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">Kỹ thuật chuyên sâu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">Bảo hành trọn đời</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">Tư vấn tận tâm</span>
                    </div>
                  </div>
                </div>
              </BlurFade>
              <BlurFade delay={0.2} direction="left">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <Image 
                    src="/images/banners/home-hero.png" 
                    alt="Audio Tài Lộc Showroom" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white text-lg font-semibold italic">
                    "Âm thanh đỉnh cao - Nâng tầm cuộc sống"
                  </div>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
