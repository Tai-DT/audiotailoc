'use client';

import React from 'react';
import Link from 'next/link';
import {
  Headphones,
  Speaker,
  Mic,
  Radio,
  Settings,
  Volume2,
  Music,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCategories } from '@/lib/hooks/use-api';

export function CategoryNavbar() {
  const { data: categories, isLoading } = useCategories();

  // Default categories with icons for Audio Tài Lộc
  const defaultCategories = [
    {
      id: 'speakers',
      name: 'Loa',
      slug: 'loa',
      icon: Speaker,
      description: 'Loa âm thanh chất lượng cao'
    },
    {
      id: 'headphones',
      name: 'Tai nghe',
      slug: 'tai-nghe',
      icon: Headphones,
      description: 'Tai nghe không dây và có dây'
    },
    {
      id: 'microphones',
      name: 'Micro',
      slug: 'micro',
      icon: Mic,
      description: 'Micro thu âm chuyên nghiệp'
    },
    {
      id: 'amplifiers',
      name: 'Amply',
      slug: 'amply',
      icon: Volume2,
      description: 'Bộ khuếch đại âm thanh'
    },
    {
      id: 'audio-systems',
      name: 'Hệ thống âm thanh',
      slug: 'he-thong-am-thanh',
      icon: Music,
      description: 'Hệ thống âm thanh gia đình'
    },
    {
      id: 'accessories',
      name: 'Phụ kiện',
      slug: 'phu-kien',
      icon: Settings,
      description: 'Phụ kiện âm thanh'
    },
    {
      id: 'wireless',
      name: 'Không dây',
      slug: 'khong-day',
      icon: Radio,
      description: 'Thiết bị âm thanh không dây'
    },
    {
      id: 'professional',
      name: 'Chuyên nghiệp',
      slug: 'chuyen-nghiep',
      icon: Zap,
      description: 'Thiết bị âm thanh chuyên nghiệp'
    }
  ];

  // Use API data if available, otherwise use default categories
  const displayCategories = categories?.length > 0
    ? categories.map((cat, index) => ({
        ...cat,
        icon: defaultCategories[index]?.icon || Settings
      }))
    : defaultCategories;

  if (isLoading) {
    return (
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 py-4 overflow-x-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 min-w-[100px]">
                <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                <div className="w-16 h-3 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 py-4 overflow-x-auto scrollbar-hide">
          {displayCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="flex flex-col items-center space-y-2 min-w-[100px] group hover:text-primary transition-colors"
              >
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow border">
                  <IconComponent className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </p>
                  {category.description && (
                    <p className="text-xs text-muted-foreground/70 mt-1 hidden sm:block">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile scroll indicator */}
        <div className="md:hidden flex justify-center mt-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}