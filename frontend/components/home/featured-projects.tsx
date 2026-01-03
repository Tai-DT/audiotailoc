'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useFeaturedProjects } from '@/lib/hooks/use-projects';
import { MagicCard } from '@/components/ui/magic-card';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { BlurFade } from '@/components/ui/blur-fade';
import type { Project } from '@/lib/types';

export function FeaturedProjects() {
  const { data: projects, isLoading, error: _error } = useFeaturedProjects(6);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-[400px] rounded-xl overflow-hidden border bg-card">
                <Skeleton className="h-1/2 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Fallback data if API fails or returns empty (for demo purposes matching screenshot)
  const fallbackProjects: Project[] = [
    {
      id: '1',
      name: 'Karaoke System - Luxury Lounge',
      slug: 'karaoke-luxury-lounge',
      description: 'VIP Karaoke system for Sky Bar.',
      shortDescription: 'VIP Karaoke system for Sky Bar.',
      client: 'Sky Bar HCMC',
      category: 'Commercial Audio',
      status: 'COMPLETED',
      isActive: true,
      isFeatured: true,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: ['/projects/karaoke-lounge.jpg'],
      thumbnailImage: '/projects/karaoke-lounge.jpg',
    },
    {
      id: '2',
      name: 'Home Audio Setup - Modern Villa',
      slug: 'home-audio-villa',
      description: 'High-end audio setup for luxury villa.',
      shortDescription: 'High-end audio setup for luxury villa.',
      client: 'Mr. Nguyen Van A',
      category: 'Home Audio',
      status: 'COMPLETED',
      isActive: true,
      isFeatured: true,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: ['/projects/villa-setup.jpg'],
      thumbnailImage: '/projects/villa-setup.jpg',
    },
  ];

  const displayProjects: Project[] = (projects && projects.length > 0) ? projects : fallbackProjects;

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <AnimatedGradientText
                className="text-3xl md:text-4xl lg:text-5xl font-bold"
                speed={1.2}
                colorFrom="#ff4d4d"
                colorTo="#f9cb28"
              >
                Dự án tiêu biểu
              </AnimatedGradientText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Khám phá những dự án âm thanh xuất sắc nhất mà chúng tôi đã thực hiện
              cho các khách hàng uy tín, thể hiện sự chuyên nghiệp và chất lượng.
            </p>
          </div>
        </BlurFade>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16 max-w-5xl mx-auto">
          {displayProjects.map((project, index) => (
            <BlurFade key={project.id} delay={0.2 + (index * 0.1)} inView>
              <MagicCard
                className="group h-full overflow-hidden border-gray-800 bg-gray-900/50"
                gradientColor="#ff4d4d20"
              >
                <div className="flex flex-col h-full">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-800">
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className="bg-gray-900/80 hover:bg-gray-900/90 text-white border-gray-700 backdrop-blur-sm">
                        {project.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang thực hiện'}
                      </Badge>
                    </div>

                    {/* Project Title Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <h3 className="text-2xl font-bold text-white text-center px-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {project.name}
                      </h3>
                    </div>

                    {/* Image */}
                    <Image
                      src={project.thumbnailImage || project.coverImage || project.images?.[0] || '/placeholder-project.jpg'}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <div className="space-y-2">
                      <Badge variant="outline" className="text-xs border-gray-700 text-muted-foreground">
                        {project.category || 'Dự án'}
                      </Badge>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {project.shortDescription || project.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-auto border-t border-gray-800">
                      {project.client && (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Khách hàng</p>
                          <p className="text-sm text-muted-foreground/60">{project.client}</p>
                        </div>
                      )}
                      
                      <Link href="/du-an" className="block">
                        <Button 
                          variant="outline" 
                          className="w-full border-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group/btn"
                        >
                          Xem chi tiết
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        {/* View All Button */}
        <BlurFade delay={0.4} inView>
          <div className="text-center">
            <Link href="/du-an">
              <RainbowButton className="px-8 py-3 text-base font-bold">
                Xem tất cả dự án <ArrowRight className="ml-2 h-5 w-5" />
              </RainbowButton>
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
