'use client';

import React from 'react';
import { useSiteStats } from '@/lib/hooks/use-site-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { NumberTicker } from '@/components/ui/number-ticker';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { MagicCard } from '@/components/ui/magic-card';
import { BlurFade } from '@/components/ui/blur-fade';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Package, 
  Star, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Activity,
  CheckCircle,
  Music
} from 'lucide-react';

export function StatsSection() {
  const { data: stats, isLoading, error } = useSiteStats();

  // Icon mapping for API data
  const iconMap: Record<string, React.ElementType> = {
    users: Users,
    package: Package,
    star: Star,
    award: Award,
    trendingup: TrendingUp,
    activity: Activity,
    briefcase: Briefcase,
    calendar: Calendar,
    shieldcheck: ShieldCheck,
    checkcircle: CheckCircle,
    music: Music,
  };

  const getIconForStat = (icon?: string): React.ElementType => {
    const key = (icon ?? '').trim().toLowerCase().replace(/[^a-z]/g, '');
    return iconMap[key] ?? Activity;
  };

  // Default stats matching the screenshot
  const defaultStats: Array<{ label: string; value: string; description?: string; icon: React.ElementType }> = [
    {
      label: 'Khách hàng hài lòng',
      value: '500+',
      description: 'Số lượng khách hàng đã sử dụng dịch vụ',
      icon: Users
    },
    {
      label: 'Dự án hoàn thành',
      value: '300+',
      description: 'Số lượng dự án âm thanh đã triển khai thành công',
      icon: Briefcase
    },
    {
      label: 'Năm kinh nghiệm',
      value: '5+',
      description: 'Kinh nghiệm trong lĩnh vực âm thanh chuyên nghiệp',
      icon: Calendar
    },
    {
      label: 'Sản phẩm',
      value: '1,000+',
      description: 'Đa dạng sản phẩm âm thanh chất lượng cao',
      icon: Package
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-6 w-40 mx-auto mb-6" />
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl border bg-card/80 backdrop-blur p-5 h-48"
              >
                <div className="space-y-6">
                  <Skeleton className="h-12 w-12" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Determine which stats to show
  const displayStats = (error || !stats || stats.length === 0)
    ? defaultStats
    : stats.map(stat => ({
        label: stat.label,
        value: stat.value,
        description: stat.description,
        icon: getIconForStat(stat.icon),
      }));

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-background">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-4 border border-primary/20">
              Tại sao chọn chúng tôi
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <AnimatedGradientText
                className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                speed={1.2}
                colorFrom="oklch(0.58 0.28 20)"
                colorTo="oklch(0.70 0.22 40)"
              >
                Audio Tài Lộc - Đối tác âm thanh tin cậy
              </AnimatedGradientText>
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 max-w-3xl mx-auto">
              Thiết bị chất lượng cao, giá cạnh tranh, bảo hành chính hãng và đội ngũ hỗ trợ tận tâm
            </p>
          </div>
        </BlurFade>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <BlurFade key={index} delay={0.2 + (index * 0.1)} inView>
                <MagicCard
                  className="h-full p-6 flex flex-col justify-between min-h-[200px]"
                  gradientColor="#D9D9D920"
                >
                  <div className="flex flex-col h-full">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-6">
                      {typeof Icon === 'function' || typeof Icon === 'object' ? (
                        <Icon className="w-6 h-6" />
                      ) : (
                        <span className="text-2xl">{Icon}</span>
                      )}
                    </div>
                    
                    {/* Value */}
                    <div className="text-4xl font-bold text-white mb-2 tracking-tight">
                      {(() => {
                        // Extract number from value string
                        const valueStr = String(stat.value);
                        const numMatch = valueStr.match(/([\d,]+\.?\d*)/);
                        
                        if (numMatch) {
                          const numStr = numMatch[1].replace(/,/g, '');
                          const num = parseFloat(numStr);
                          if (!isNaN(num)) {
                            return (
                              <div className="flex items-baseline">
                                <NumberTicker value={num} delay={0.5 + (index * 0.1)} className="text-white" />
                                <span className="text-primary ml-1">
                                  {valueStr.includes('+') && '+'}
                                  {valueStr.includes('/') && `/${valueStr.split('/')[1]}`}
                                </span>
                              </div>
                            );
                          }
                        }
                        return valueStr;
                      })()}
                    </div>
                    
                    {/* Label */}
                    <div className="text-lg font-semibold text-foreground mb-2">
                      {stat.label}
                    </div>

                    {/* Description */}
                    {stat.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {stat.description}
                      </p>
                    )}
                  </div>
                </MagicCard>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
