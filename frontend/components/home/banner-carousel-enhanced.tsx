'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanners } from '@/lib/hooks/use-banners';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionWrapper, HoverMotionWrapper } from '@/components/ui/motion-wrapper';

interface HeroStat {
  label: string;
  value: string;
  description: string;
}

export function BannerCarousel() {
  const { data: banners, isLoading } = useBanners({ page: 'home', activeOnly: true });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activeBanners = banners || [];

  // Auto-play carousel with pause on hover
  useEffect(() => {
    if (activeBanners.length <= 1 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [activeBanners.length, isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? activeBanners.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === activeBanners.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <MotionWrapper className="space-y-6">
              <motion.div
                className="h-6 w-40 bg-muted rounded animate-pulse"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="h-16 w-full max-w-xl bg-muted rounded animate-pulse"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="h-12 w-full max-w-2xl bg-muted rounded animate-pulse"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
              <div className="flex gap-4">
                <motion.div
                  className="h-12 w-40 bg-muted rounded animate-pulse"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                />
                <motion.div
                  className="h-12 w-32 bg-muted rounded animate-pulse"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                />
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="h-12 bg-muted rounded animate-pulse"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 * i }}
                  />
                ))}
              </div>
            </MotionWrapper>
            <motion.div
              className="h-[320px] w-full bg-muted rounded-2xl animate-pulse"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
          </div>
        </div>
      </section>
    );
  }

  if (!activeBanners.length) {
    return (
      <MotionWrapper>
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4 py-16 lg:py-28">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1 text-sm font-medium text-primary border-primary/30 backdrop-blur">
                    <Sparkles className="h-4 w-4" />
                    Giải pháp âm thanh toàn diện
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                    Thiết bị âm thanh chất lượng cao
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                    Chuyên cung cấp thiết bị âm thanh chuyên nghiệp, dịch vụ kỹ thuật và giải pháp âm thanh toàn diện cho mọi nhu cầu.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products">
                    <Button size="lg" className="w-full sm:w-auto">
                      Khám phá sản phẩm
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      <Play className="mr-2 h-4 w-4" />
                      Xem dịch vụ
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                  {[
                    { label: 'Sản phẩm', value: '500+', description: 'Đa dạng thiết bị âm thanh chuyên nghiệp' },
                    { label: 'Khách hàng', value: '1000+', description: 'Đối tác tin tưởng và đồng hành' },
                    { label: 'Kinh nghiệm', value: '5+ năm', description: 'Thiết kế và thi công giải pháp âm thanh' }
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border bg-background/80 backdrop-blur-sm p-5 text-center shadow-sm">
                      <div className="text-3xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm font-medium text-foreground mt-1">{stat.label}</div>
                      <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {stat.description}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Hơn 98% khách hàng hài lòng với dịch vụ của Audio Tài Lộc
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-[28px] bg-gradient-to-br from-primary/15 via-secondary/10 to-background p-5 overflow-hidden shadow-lg">
                  <div className="h-full w-full rounded-xl bg-background/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold">Hệ thống âm thanh</h3>
                      <p className="text-sm text-muted-foreground">
                        Chuyên nghiệp & Chất lượng cao
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-background/95 border shadow-xl rounded-2xl p-4 min-w-[180px] flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Hỗ trợ 24/7</div>
                    <div className="text-xs text-muted-foreground">Đội ngũ kỹ thuật viên luôn sẵn sàng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </MotionWrapper>
    );
  }

  const currentBanner = activeBanners[currentIndex];
  const stats: HeroStat[] = (() => {
    if (currentBanner?.stats) {
      try {
        const parsedStats = typeof currentBanner.stats === 'string'
          ? JSON.parse(currentBanner.stats)
          : currentBanner.stats;
        return Array.isArray(parsedStats) ? parsedStats : [];
      } catch {
        return [];
      }
    }
    return [
      { label: 'Sản phẩm', value: '500+', description: 'Đa dạng thiết bị âm thanh chuyên nghiệp' },
      { label: 'Khách hàng', value: '1000+', description: 'Đối tác tin tưởng và đồng hành' },
      { label: 'Kinh nghiệm', value: '5+ năm', description: 'Thiết kế và thi công giải pháp âm thanh' }
    ];
  })();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            {currentBanner?.imageUrl && (
              <Image
                src={currentBanner.imageUrl}
                alt={currentBanner.title ?? 'Audio Tài Lộc'}
                fill
                priority
                className="object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80" />
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <motion.button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border rounded-full p-3 shadow-lg hover:bg-background transition-colors"
            aria-label="Previous banner"
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          <motion.button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border rounded-full p-3 shadow-lg hover:bg-background transition-colors"
            aria-label="Next banner"
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </>
      )}

      <div className="relative container mx-auto px-4 py-16 lg:py-28">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          {/* Content */}
          <motion.div
            className="space-y-8"
            onHoverStart={() => setIsAutoPlaying(false)}
            onHoverEnd={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-5"
              >
                <motion.div
                  className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1 text-sm font-medium text-primary border-primary/30 backdrop-blur"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="h-4 w-4" />
                  {currentBanner?.subtitle ?? 'Giải pháp âm thanh toàn diện'}
                </motion.div>
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentBanner?.title ?? 'Thiết bị âm thanh chất lượng cao'}
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentBanner?.description ?? 'Chuyên cung cấp thiết bị âm thanh chuyên nghiệp, dịch vụ kỹ thuật và giải pháp âm thanh toàn diện cho mọi nhu cầu.'}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <HoverMotionWrapper>
                <Link href={currentBanner?.linkUrl ?? '/products'}>
                  <Button size="lg" className="w-full sm:w-auto">
                    {currentBanner?.buttonLabel ?? 'Khám phá sản phẩm'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </HoverMotionWrapper>
              {currentBanner?.secondaryButtonLabel && (
                <HoverMotionWrapper>
                  <Link href={currentBanner?.secondaryButtonUrl ?? '/services'}>
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      <Play className="mr-2 h-4 w-4" />
                      {currentBanner.secondaryButtonLabel}
                    </Button>
                  </Link>
                </HoverMotionWrapper>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <HoverMotionWrapper key={index} scale={1.02} y={-2}>
                  <div className="rounded-xl border bg-background/80 backdrop-blur-sm p-5 text-center shadow-sm">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm font-medium text-foreground mt-1">{stat.label}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {stat.description}
                    </div>
                  </div>
                </HoverMotionWrapper>
              ))}
            </motion.div>

            <motion.div
              className="flex items-center gap-3 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <ShieldCheck className="h-4 w-4 text-primary" />
              Hơn 98% khách hàng hài lòng với dịch vụ của Audio Tài Lộc
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              className="aspect-square rounded-[28px] bg-gradient-to-br from-primary/15 via-secondary/10 to-background p-5 overflow-hidden shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative h-full w-full overflow-hidden rounded-xl"
                >
                  {currentBanner?.imageUrl ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={currentBanner.imageUrl}
                        alt={currentBanner.title ?? 'Audio Tài Lộc banner'}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="h-full w-full rounded-xl bg-background/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold">Hệ thống âm thanh</h3>
                        <p className="text-sm text-muted-foreground">
                          Chuyên nghiệp & Chất lượng cao
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="absolute -bottom-6 -left-6 bg-background/95 border shadow-xl rounded-2xl p-4 min-w-[180px] flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <ChevronRight className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Hỗ trợ 24/7</div>
                <div className="text-xs text-muted-foreground">Đội ngũ kỹ thuật viên luôn sẵn sàng</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Indicators */}
        {activeBanners.length > 1 && (
          <motion.div
            className="flex justify-center mt-8 space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {activeBanners.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to banner ${index + 1}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
