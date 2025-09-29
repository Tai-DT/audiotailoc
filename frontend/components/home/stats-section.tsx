'use client';

import React from 'react';
import { useSiteStats, SiteStat } from '@/lib/hooks/use-site-stats';
import { Skeleton } from '@/components/ui/skeleton';

export function StatsSection() {
  const { data: stats, isLoading, error } = useSiteStats();

  // Loading state
  if (isLoading) {
    return (
      <section className="py-24">
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
                className="relative overflow-hidden rounded-2xl border bg-card/80 backdrop-blur p-5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                <div className="relative space-y-6">
                  <Skeleton className="h-12 w-12 mx-auto" />
                  <div className="space-y-1 text-center">
                    <Skeleton className="h-8 w-16 mx-auto" />
                    <Skeleton className="h-5 w-20 mx-auto" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state - fallback to default stats
  if (error || !stats || stats.length === 0) {
    // Default fallback stats
    const defaultStats = [
      {
        label: 'Khách hàng hài lòng',
        value: '1.2K+',
        description: 'Được tin tưởng bởi các doanh nghiệp, studio và nhà hát lớn'
      },
      {
        label: 'Thiết bị & giải pháp',
        value: '650+',
        description: 'Danh mục sản phẩm chuyên sâu cho mọi nhu cầu âm thanh'
      },
      {
        label: 'Đánh giá trung bình',
        value: '4.9/5',
        description: 'Chất lượng dịch vụ vượt mong đợi từ khách hàng'
      },
      {
        label: 'Năm kinh nghiệm',
        value: '7+',
        description: 'Đồng hành cùng hơn 300 dự án âm thanh toàn quốc'
      }
    ];

    return (
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium text-primary border-primary/30">
              Giá trị chúng tôi mang lại
            </span>
            <h2 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight">
              Audio Tài Lộc – đối tác âm thanh đáng tin cậy của bạn
            </h2>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Từ tư vấn, thiết kế hệ thống đến cung cấp thiết bị, chúng tôi luôn đặt trải nghiệm khách hàng lên hàng đầu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {defaultStats.map((stat, index) => {
              const icons = ['Users', 'Package', 'Star', 'Award'];
              const iconComponents = {
                Users: '👥',
                Package: '📦',
                Star: '⭐',
                Award: '🏆'
              };

              return (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl border bg-card/80 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                  <div className="relative p-6 space-y-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                      <span className="text-2xl">{iconComponents[icons[index] as keyof typeof iconComponents]}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-4xl font-bold tracking-tight text-foreground">
                        {stat.value}
                      </div>
                      <h3 className="text-base font-semibold text-foreground/90">
                        {stat.label}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-6">
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Render with real data from API
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium text-primary border-primary/30">
            Giá trị chúng tôi mang lại
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight">
            Audio Tài Lộc – đối tác âm thanh đáng tin cậy của bạn
          </h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Từ tư vấn, thiết kế hệ thống đến cung cấp thiết bị, chúng tôi luôn đặt trải nghiệm khách hàng lên hàng đầu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat: SiteStat) => {
            const iconComponents = {
              Users: '👥',
              Package: '📦',
              Star: '⭐',
              Award: '🏆',
              TrendingUp: '📈',
              Activity: '⚡'
            };

            return (
              <div
                key={stat.id}
                className="relative overflow-hidden rounded-2xl border bg-card/80 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                <div className="relative p-6 space-y-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                    <span className="text-2xl">
                      {stat.icon && iconComponents[stat.icon as keyof typeof iconComponents]
                        ? iconComponents[stat.icon as keyof typeof iconComponents]
                        : '📊'
                      }
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </div>
                    <h3 className="text-base font-semibold text-foreground/90">
                      {stat.label}
                    </h3>
                  </div>
                  {stat.description && (
                    <p className="text-sm text-muted-foreground leading-6">
                      {stat.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


