'use client';

import React from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { Music4, ShieldCheck, AlertCircle } from 'lucide-react';

interface PolicyData {
    title: string;
    content: string;
    updatedAt: string;
}

interface PremiumPolicyPageProps {
    data: PolicyData | null | undefined;
    isLoading: boolean;
    error: any;
    fallbackTitle: string;
}

export function PremiumPolicyPage({ data, isLoading, error, fallbackTitle }: PremiumPolicyPageProps) {
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 sm:p-12">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center animate-pulse mb-6">
                    <Music4 className="w-8 h-8 text-primary" />
                </div>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-progress" style={{ width: '40%' }} />
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-card border border-border rounded-full flex items-center justify-center mb-8 shadow-sm">
                    <AlertCircle className="w-10 h-10 text-primary/40" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight mb-4 text-foreground">
                    {fallbackTitle}
                </h1>
                <p className="text-muted-foreground max-w-md italic mb-10 leading-relaxed">
                    Nội dung hiện chưa được tải hoặc đang trong quá trình cập nhật kỹ thuật. Vui lòng liên hệ hỗ trợ nếu cần gấp.
                </p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 pb-32">
            {/* Cinematic Header */}
            <section className="relative pt-24 sm:pt-32 pb-14 sm:pb-20 overflow-hidden border-b border-border/50">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-1/4 w-[1000px] h-[1000px] bg-primary/5 blur-[150px] animate-pulse" />
                    <div className="absolute inset-0 bg-studio-grid opacity-10" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
                    <BlurFade delay={0.1} inView>
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-full shadow-sm backdrop-blur-xl">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-foreground/70">Quyền lợi & Chính sách</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none font-display text-foreground">
                                {data.title}
                            </h1>
                            <div className="w-12 h-1 bg-primary/50" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/40 italic">
                                Cập nhật lần cuối: {new Date(data.updatedAt).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </BlurFade>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6">
                    <BlurFade delay={0.2} inView>
                        <div className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-20 bg-card border border-border rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                            <div
                                className="prose prose-gray dark:prose-invert prose-lg max-w-none prose-p:text-foreground/70 prose-p:leading-[1.8] prose-p:italic prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-5 sm:prose-blockquote:p-10 prose-blockquote:rounded-[2rem] prose-li:text-foreground/70"
                                dangerouslySetInnerHTML={{ __html: data.content }}
                            />

                            <div className="mt-20 pt-10 border-t border-border flex flex-col items-center gap-6 text-center">
                                <p className="text-[11px] text-muted-foreground italic font-medium">Bản quyền chính sách thuộc về Audio Tài Lộc. Mọi thắc mắc vui lòng liên hệ bộ phận CSKH.</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Elite Service Standard</span>
                                </div>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </section>
        </main>
    );
}
