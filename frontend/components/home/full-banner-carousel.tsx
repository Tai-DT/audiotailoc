'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanners } from '@/lib/hooks/use-banners';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { demoBanners } from '@/lib/demo-banners';

export function FullBannerCarousel() {
  const { data: banners, isLoading } = useBanners({ page: 'home', activeOnly: true });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activeBanners = banners && banners.length > 0 ? banners : demoBanners;

  // Auto-play carousel
  useEffect(() => {
    if (activeBanners.length <= 1 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [activeBanners.length, isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-4xl mx-auto px-4">
            <Skeleton className="h-12 md:h-16 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <Skeleton className="h-10 w-32 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (!activeBanners || activeBanners.length === 0) {
    // This shouldn't happen now since we have demo data
    return null;
  }

  const currentBanner = activeBanners[currentIndex];

  return (
    <section 
      className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Desktop Image */}
          <div className="hidden md:block relative w-full h-full">
            <Image
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          
          {/* Mobile Image */}
          <div className="block md:hidden relative w-full h-full">
            <Image
              src={currentBanner.mobileImageUrl || currentBanner.imageUrl}
              alt={currentBanner.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="text-center text-white space-y-6 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                {currentBanner.title}
              </h1>

              {/* Subtitle */}
              {currentBanner.subtitle && (
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-white/90">
                  {currentBanner.subtitle}
                </h2>
              )}

              {/* Description */}
              {currentBanner.description && (
                <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed px-4">
                  {currentBanner.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                {currentBanner.buttonLabel && currentBanner.linkUrl && (
                  <Button asChild size="lg" className="text-lg px-8 py-3">
                    <Link href={currentBanner.linkUrl}>
                      {currentBanner.buttonLabel}
                    </Link>
                  </Button>
                )}
                
                {currentBanner.secondaryButtonLabel && currentBanner.secondaryButtonUrl && (
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Link href={currentBanner.secondaryButtonUrl}>
                      {currentBanner.secondaryButtonLabel}
                    </Link>
                  </Button>
                )}
              </div>

              {/* Stats */}
              {currentBanner.stats && (
                <div className="pt-8">
                  <p className="text-white/70 text-sm md:text-base">
                    {currentBanner.stats}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      {activeBanners.length > 1 && (
        <>
          {/* Dot Indicators - Centered */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3 justify-center items-center bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white/50 hover:bg-white/80 hover:scale-110'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Play/Pause Auto-play Button */}
      {activeBanners.length > 1 && (
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white transition-all duration-200"
          aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          <Play className={`h-4 w-4 ${isAutoPlaying ? 'opacity-50' : 'opacity-100'}`} />
        </button>
      )}
    </section>
  );
}