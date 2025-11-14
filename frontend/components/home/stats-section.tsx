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
        value: '10,000+',
        icon: '👥'
      },
      {
        label: 'Năm kinh nghiệm',
        value: '15+',
        icon: '🏆'
      },
      {
        label: 'Đánh giá trung bình',
        value: '4.9/5',
        icon: '⭐'
      },
      {
        label: 'Bảo hành chính hãng',
        value: '100%',
        icon: '🔒'
      }
    ];

    return (
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        
        <div className="container relative mx-auto px-4">
          {/* Compact header */}
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-4">
              Tại sao chọn chúng tôi
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent mb-4">
              Audio Tài Lộc - Đối tác âm thanh tin cậy
            </h2>
            <p className="text-base sm:text-lg text-gray-300/80 max-w-3xl mx-auto">
              Thiết bị chất lượng cao, giá cạnh tranh, bảo hành chính hãng và đội ngũ hỗ trợ tận tâm
            </p>
          </div>

          {/* Stats grid - compact */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {defaultStats.map((stat, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 transition-all duration-300 hover:bg-gray-800/60 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 text-primary mb-4 transition-transform group-hover:scale-110">
                    <span className="text-2xl sm:text-3xl">{stat.icon}</span>
                  </div>
                  
                  {/* Value */}
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-1 tracking-tight">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm sm:text-base text-gray-300/90 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Render with real data from API
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-center" />
      
      <div className="container relative mx-auto px-4">
        {/* Compact header */}
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-4">
            Tại sao chọn chúng tôi
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent mb-4">
            Audio Tài Lộc - Đối tác âm thanh tin cậy
          </h2>
          <p className="text-base sm:text-lg text-gray-300/80 max-w-3xl mx-auto">
            Thiết bị chất lượng cao, giá cạnh tranh, bảo hành chính hãng và đội ngũ hỗ trợ tận tâm
          </p>
        </div>

        {/* Stats grid - compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 transition-all duration-300 hover:bg-gray-800/60 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 text-primary mb-4 transition-transform group-hover:scale-110">
                    <span className="text-2xl sm:text-3xl">
                      {stat.icon && iconComponents[stat.icon as keyof typeof iconComponents]
                        ? iconComponents[stat.icon as keyof typeof iconComponents]
                        : '📊'
                      }
                    </span>
                  </div>
                  
                  {/* Value */}
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-1 tracking-tight">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm sm:text-base text-gray-300/90 font-medium">
                    {stat.label}
                  </div>

                  {/* Description - optional */}
                  {stat.description && (
                    <p className="text-xs text-gray-400/80 mt-2 line-clamp-2">
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


