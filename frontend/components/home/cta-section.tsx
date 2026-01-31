'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Mail, ArrowRight, MapPin, Clock, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useContactInfo } from '@/lib/hooks/use-contact-info';

export function CTASection() {
    const { data: contactInfo } = useContactInfo();
    const hotlineNumber = contactInfo?.phone?.hotline
        || contactInfo?.phone?.display?.replace(/\s+/g, '')
        || '';
    const hotlineDisplay = contactInfo?.phone?.display || contactInfo?.phone?.hotline || '';
    const email = contactInfo?.email || '';
    const address = contactInfo?.address?.full || '';
    const hours = contactInfo?.businessHours?.display || '';
    const zaloLink = contactInfo?.social?.zalo || (hotlineNumber ? `https://zalo.me/${hotlineNumber}` : '');

    return (
        <section className="py-16 md:py-32 relative overflow-hidden bg-background">
            {/* Cinematic Background Layer */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.08),transparent_70%)]" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/5 blur-[180px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 dark:bg-accent/5 blur-[150px] animate-pulse" style={{ animationDelay: '3s' }} />
                <div className="absolute inset-0 bg-noise opacity-[0.02] dark:opacity-[0.03]" />

                {/* Kinetic Audio Wave */}
                <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20 dark:opacity-15 overflow-hidden">
                    <svg viewBox="0 0 1440 120" className="w-[200%] h-full animate-[shimmer-slide_12s_linear_infinite]" preserveAspectRatio="none">
                        <path
                            d="M0,60 Q180,110 360,60 T720,60 T1080,60 T1440,60 T1800,60 T2160,60 T2520,60 T2880,60"
                            fill="none"
                            stroke="url(#cta-wave-premium)"
                            strokeWidth="2"
                        />
                        <defs>
                            <linearGradient id="cta-wave-premium" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="var(--primary)" />
                                <stop offset="50%" stopColor="oklch(0.65 0.25 25)" />
                                <stop offset="100%" stopColor="oklch(0.45 0.3 25)" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-center">
                    {/* Elite Content - Authority & Trust */}
                    <div className="space-y-12">
                        {/* Elite Badge */}
                        <div className="section-badge">
                            <Volume2 className="w-5 h-5 text-primary animate-pulse" />
                            <span>Đặc quyền Red Elite</span>
                        </div>

                        {/* Title with Dramatic Impact */}
                        <h2 className="text-4xl md:text-8xl font-black text-foreground tracking-tighter leading-[1.1] md:leading-[0.85] font-display">
                            Đặc quyền <br />
                            <span className="premium-text-gradient italic">Tư vấn</span> <br />
                            Đẳng Cấp
                        </h2>

                        {/* High-End Subtext */}
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-xl font-medium leading-relaxed border-l-4 border-primary/30 dark:border-accent/30 pl-10 italic">
                            Hãy để chuyên gia của chúng tôi thiết kế bản giao hưởng riêng cho không gian sống của bạn.
                        </p>

                        {/* Cinematic Info Grid */}
                        <div className="grid sm:grid-cols-2 gap-8">
                            <InfoCard
                                icon={MapPin}
                                title="Luxury Showroom"
                                content={address}
                            />
                            <InfoCard
                                icon={Clock}
                                title="Thời gian phục vụ"
                                content={hours}
                            />
                        </div>

                        {/* Command Buttons */}
                        <div className="flex flex-col sm:flex-row gap-8 pt-8">
                            <Link href={`tel:${hotlineNumber}`} className="w-full sm:w-auto overflow-hidden rounded-[2rem] group/btn">
                                <Button
                                    size="lg"
                                    className="w-full h-16 md:h-20 red-elite-gradient text-foreground dark:text-foreground dark:text-white px-8 md:px-14 text-sm font-black uppercase tracking-[0.3em] relative transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl font-display rounded-full sm:rounded-[2rem] border border-primary/20"
                                >
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                    <div className="absolute inset-0 gold-royal-grain opacity-10" />
                                    <Phone className="mr-4 h-6 w-6 relative z-10" />
                                    <span className="relative z-10">{hotlineDisplay}</span>
                                </Button>
                            </Link>
                            <Link href="/contact" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full h-16 md:h-20 border-border dark:border-white/10 bg-secondary dark:bg-white/5 backdrop-blur-2xl text-foreground dark:text-foreground dark:text-white hover:bg-primary hover:text-foreground dark:text-foreground dark:text-white dark:hover:bg-accent dark:hover:text-black px-8 md:px-14 text-sm font-black uppercase tracking-[0.3em] transition-all duration-500 rounded-full sm:rounded-[2rem] font-display hover:border-primary/40"
                                >
                                    <Mail className="mr-4 h-6 w-6 text-primary dark:text-accent group-hover:text-foreground dark:text-foreground dark:text-white transition-colors" />
                                    Để lại lời nhắn
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Elite Contact Console */}
                    <div className="relative">
                        <div className="absolute -inset-6 bg-gradient-to-br from-primary/30 to-accent/30 blur-[120px] opacity-20 dark:opacity-30 animate-pulse" />
                        <div className="relative space-y-10">
                            {/* Primary Contact Console */}
                            <div className="red-elite-card rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 group overflow-hidden">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 dark:bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
                                <div className="absolute inset-0 gold-royal-grain opacity-5 group-hover:opacity-10 transition-opacity" />

                                <div className="text-center space-y-12 relative z-10">
                                    <div className="space-y-6">
                                        <div className="text-[11px] font-black uppercase tracking-[0.5em] text-primary dark:text-accent font-display">Đường dây ưu tiên Elite</div>
                                        <a
                                            href={`tel:${hotlineNumber}`}
                                            className="block text-4xl md:text-8xl font-black text-foreground dark:text-foreground dark:text-white hover:text-primary transition-all duration-700 font-display tracking-tighter drop-shadow-sm group-hover:scale-105"
                                        >
                                            {hotlineDisplay}
                                        </a>
                                    </div>

                                    {/* Ornamental Divider */}
                                    <div className="flex items-center gap-8">
                                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border dark:via-white/10 to-transparent" />
                                        <div className="w-3 h-3 rounded-full border-2 border-primary/50 dark:border-accent/50 animate-ping" />
                                        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border dark:via-white/10 to-transparent" />
                                    </div>

                                    {/* Action Grid */}
                                    <div className="grid grid-cols-2 gap-4 md:gap-8">
                                        <ContactButton
                                            href={zaloLink}
                                            icon={MessageCircle}
                                            label="Zalo Tư Vấn"
                                            className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-foreground dark:text-foreground dark:text-white hover:shadow-primary/40"
                                        />
                                        <ContactButton
                                            href={`mailto:${email}`}
                                            icon={Mail}
                                            label="Email Trực"
                                            className="bg-secondary/50 dark:bg-white/5 border border-border dark:border-white/10 text-foreground/80 dark:text-foreground/80 dark:text-foreground dark:text-white/80 hover:bg-foreground dark:hover:bg-white hover:text-background dark:hover:text-black"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Navigation Grid */}
                            <div className="grid grid-cols-2 gap-4 md:gap-10">
                                <EliteNavLink href="/products" label="Bộ sưu tập" />
                                <EliteNavLink href="/services" label="Dịch vụ Elite" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function EliteNavLink({ href, label }: { href: string; label: string }) {
    return (
        <Link href={href}>
            <div className="group p-6 md:p-10 rounded-2xl md:rounded-[3rem] glass-panel hover:border-primary/50 dark:hover:border-accent/40 transition-all duration-700 hover:shadow-2xl overflow-hidden relative active:scale-95">
                <div className="absolute inset-0 gold-royal-grain opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 h-1.5 red-elite-gradient translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="flex items-center justify-between relative z-10">
                    <span className="text-foreground dark:text-foreground dark:text-white font-black uppercase tracking-[0.3em] text-[10px] font-display">{label}</span>
                    <ArrowRight className="w-6 h-6 text-primary dark:text-accent opacity-40 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-500" />
                </div>
            </div>
        </Link>
    );
}

interface InfoCardProps {
    icon: React.ElementType;
    title: string;
    content: string;
}

function InfoCard({ icon: Icon, title, content }: InfoCardProps) {
    return (
        <div className="flex items-center gap-4 md:gap-8 p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] glass-panel group hover:border-primary/40 dark:hover:border-accent/30 transition-all duration-700 shadow-sm hover:shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 gold-royal-grain opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
            <div className="w-16 h-16 rounded-2xl bg-secondary dark:bg-white/5 flex items-center justify-center flex-shrink-0 border border-border dark:border-white/10 text-primary dark:text-accent group-hover:scale-110 group-hover:bg-primary dark:group-hover:bg-accent group-hover:text-foreground dark:text-foreground dark:text-white dark:group-hover:text-black transition-all duration-700 shadow-lg relative z-10">
                <Icon size={30} />
            </div>
            <div className="space-y-1.5 relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 dark:text-foreground/20 dark:text-foreground dark:text-white/20 font-display">{title}</div>
                <div className="text-foreground dark:text-foreground dark:text-white font-black tracking-tight text-base md:text-lg leading-snug">{content}</div>
            </div>
        </div>
    );
}

interface ContactButtonProps {
    href: string;
    icon: React.ElementType;
    label: string;
    className?: string;
}

function ContactButton({ href, icon: Icon, label, className }: ContactButtonProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "flex flex-col items-center justify-center gap-3 md:gap-4 py-6 md:py-8 rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] font-display relative overflow-hidden group/cbtn",
                "transition-all duration-700 hover:scale-105 active:scale-95 shadow-lg",
                className
            )}
        >
            <div className="absolute inset-0 gold-royal-grain opacity-5 group-hover/cbtn:opacity-10 transition-opacity" />
            <Icon size={24} className="relative z-10" />
            <span className="relative z-10">{label}</span>
        </a>
    );
}
