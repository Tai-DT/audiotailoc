'use client';

import React from 'react';
import { Service } from '@/lib/types';
import { ServiceCard } from './service-card';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';

interface ServiceGridProps {
    services: Service[];
    isLoading: boolean;
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
}

function ServiceCardSkeleton() {
    return (
        <div className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden animate-pulse">
            <div className="aspect-square w-full bg-white/5" />
            <div className="p-8 space-y-6">
                <div className="space-y-3">
                    <div className="h-4 bg-white/10 rounded-full w-1/4" />
                    <div className="h-8 bg-white/10 rounded-2xl w-3/4" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded-full w-full" />
                    <div className="h-4 bg-white/5 rounded-full w-2/3" />
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <div className="h-10 w-32 bg-white/10 rounded-xl" />
                    <div className="h-10 w-10 bg-white/10 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

export function ServiceGrid({
    services,
    isLoading,
    totalPages,
    currentPage,
    onPageChange,
    totalItems: _totalItems = 0
}: ServiceGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <ServiceCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <div className="text-center py-24 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-xl">
                    <Package className="w-10 h-10 text-foreground/10 dark:text-white/10" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground dark:text-white mb-3 font-display">Dịch vụ vắng mặt</h3>
                <p className="text-foreground/40 dark:text-zinc-300 italic text-sm max-w-sm mx-auto">
                    Hệ thống không tìm thấy dịch vụ nào phù hợp với các tiêu chí tìm kiếm của quý khách.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <BlurFade key={service.id} delay={index * 0.05} inView>
                        <ServiceCard service={service} index={index} />
                    </BlurFade>
                ))}
            </div>

            {/* Pagination: Elite Navigation Style */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 pt-12 border-t border-white/5">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground dark:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:border-primary/50 transition-all group"
                    >
                        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Stage</span>
                            <span className="text-lg font-black tracking-tighter tabular-nums">
                                {currentPage} <span className="text-foreground/20 /20 dark:text-white/20 mx-1 font-medium">/</span> {totalPages}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground dark:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:border-primary/50 transition-all group"
                    >
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
}
