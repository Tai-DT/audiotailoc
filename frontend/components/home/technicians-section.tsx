'use client';

import React from 'react';
import { useTechnicians } from '@/lib/hooks/use-technicians';
import { Skeleton } from '@/components/ui/skeleton';
import { MagicCard } from '@/components/ui/magic-card';
import { BlurFade } from '@/components/ui/blur-fade';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Technician } from '@/lib/types';

export function TechniciansSection() {
    const { data, isLoading, error } = useTechnicians({ isActive: true, pageSize: 4 });

    // Handle both paginated response and direct array
    const technicians: Technician[] = React.useMemo(() => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        return data.items || [];
    }, [data]);

    if (isLoading) {
        return (
            <section className="py-20 bg-background/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Skeleton className="h-10 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error || technicians.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-background/50 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <BlurFade delay={0.1} inView>
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-accent bg-accent/10 rounded-full mb-4 border border-accent/20">
                            Đội ngũ chuyên gia
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                            <AnimatedGradientText
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                                speed={1.2}
                                colorFrom="oklch(0.70 0.22 40)"
                                colorTo="oklch(0.58 0.28 20)"
                            >
                                Kỹ thuật viên chuyên nghiệp
                            </AnimatedGradientText>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Những chuyên gia giàu kinh nghiệm luôn sẵn sàng mang đến giải pháp âm thanh tốt nhất cho bạn
                        </p>
                    </div>
                </BlurFade>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {technicians.map((tech, index) => (
                        <BlurFade key={tech.id} delay={0.2 + index * 0.1} inView>
                            <MagicCard
                                className="h-full group hover:shadow-2xl transition-all duration-500"
                                gradientColor="rgba(217, 217, 217, 0.1)"
                            >
                                <div className="p-8 flex flex-col items-center text-center h-full">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors duration-500" />
                                        <Avatar className="h-32 w-32 border-4 border-background relative z-10 group-hover:scale-105 transition-transform duration-500">
                                            <AvatarImage src={tech.avatarUrl} alt={tech.name} className="object-cover" />
                                            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                                {tech.name.split(' ').pop()?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {tech.name}
                                    </h3>

                                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                                        {Array.isArray(tech.specialties) ? (
                                            tech.specialties.map((s, i) => (
                                                <Badge key={i} variant="secondary" className="text-[10px] uppercase tracking-wider">
                                                    {s}
                                                </Badge>
                                            ))
                                        ) : tech.specialties ? (
                                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                                                {tech.specialties}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                                Kỹ thuật viên
                                            </Badge>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-auto">
                                        Chuyên gia với nhiều năm kinh nghiệm trong lắp đặt và vận hành hệ thống âm thanh.
                                    </p>
                                </div>
                            </MagicCard>
                        </BlurFade>
                    ))}
                </div>
            </div>
        </section>
    );
}
