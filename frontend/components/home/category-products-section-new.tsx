'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/lib/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';

export function CategoryProductsSection() {
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  if (categoriesLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-6 w-40 mx-auto mb-4" />
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Lấy tối đa 4 danh mục đầu tiên
  const displayCategories = categories?.slice(0, 4) || [];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Categories Grid */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium text-primary border-primary/30 mb-4">
            <Grid3X3 className="w-4 h-4 mr-2" />
            Danh mục sản phẩm
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Khám phá theo danh mục
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Tìm kiếm thiết bị âm thanh phù hợp với nhu cầu của bạn qua các danh mục chuyên biệt
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {displayCategories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <div className="group relative overflow-hidden rounded-xl border bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="aspect-square relative overflow-hidden">
                  {category.imageUrl ? (
                    <Image 
                      src={category.imageUrl} 
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <div className="text-4xl">{getCategoryIcon(category.name)}</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-white/80 text-sm">{category.description || `Khám phá ${category.name.toLowerCase()}`}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
                    <Link href="/danh-muc">
            <Button variant="outline" size="lg">
              Xem tất cả danh mục
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Helper function for category icons
function getCategoryIcon(categoryName: string): string {
  const name = categoryName.toLowerCase();
  if (name.includes('loa')) return '🔊';
  if (name.includes('micro')) return '🎤';
  if (name.includes('mixer')) return '🎛️';
  if (name.includes('amp')) return '🔌';
  if (name.includes('cable') || name.includes('dây')) return '🔗';
  if (name.includes('phụ kiện')) return '🔧';
  return '🎵';
}