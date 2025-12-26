'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTestimonials } from '@/lib/hooks/use-testimonials';
import { Skeleton } from '@/components/ui/skeleton';
import { MagicCard } from '@/components/ui/magic-card';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { BlurFade } from '@/components/ui/blur-fade';

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
              <div key={index} className="h-64 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return null; // Hide section on error
  }

  // No testimonials state
  if (!testimonials || testimonials.length === 0) {
    return null; // Hide section if no testimonials
  }

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <AnimatedGradientText className="text-3xl md:text-4xl font-bold p-0">
                Khách hàng nói gì về chúng tôi
              </AnimatedGradientText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sự hài lòng của khách hàng là động lực phát triển của Audiotailoc
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <BlurFade key={testimonial.id} delay={0.2 + index * 0.1} inView>
              <MagicCard
                className="h-full"
                gradientColor="#D9D9D955"
              >
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-muted-foreground/40'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="relative mb-6 flex-grow">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10 rotate-180" />
                    <p className="text-muted-foreground relative z-10 italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 pt-4 border-t border-border/50">
                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                      <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                      <AvatarFallback className="bg-primary/5 text-primary font-medium">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.position || 'Khách hàng'}</p>
                    </div>
                  </div>
                </CardContent>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}


