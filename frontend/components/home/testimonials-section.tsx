'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTestimonials, Testimonial } from '@/lib/hooks/use-testimonials';
import { Skeleton } from '@/components/ui/skeleton';

export function TestimonialsSection() {
  const { data: testimonials, isLoading, error } = useTestimonials();

  // Loading state
  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-4" />
                    ))}
                  </div>
                  <Skeleton className="h-20 w-full mb-6" />
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Không thể tải dữ liệu đánh giá. Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // No testimonials state
  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Chưa có đánh giá nào được xuất bản. Hãy là khách hàng đầu tiên!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Những phản hồi chân thực từ khách hàng đã tin tưởng và sử dụng
            dịch vụ của chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial: Testimonial) => (
            <Card key={testimonial.id} className="relative">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-muted-foreground mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    {testimonial.position && (
                      <p className="text-xs text-muted-foreground">{testimonial.position}</p>
                    )}
                    {testimonial.company && (
                      <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


