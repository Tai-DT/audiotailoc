'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BlurFade } from '@/components/ui/blur-fade';
import { Award, Users, ShieldCheck, Zap, Briefcase, Package, Music4, Sparkles, ChevronRight, type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { useSiteStats } from '@/lib/hooks/use-site-stats';

const statIconMap: Record<string, LucideIcon> = {
 users: Users,
 briefcase: Briefcase,
 award: Award,
 package: Package,
 zap: Zap,
 shield: ShieldCheck,
 shieldcheck: ShieldCheck,
 happy_customers: Users,
 projects_completed: Briefcase,
 years_experience: Award,
 products_available: Package,
};

export default function AboutPage() {
 const { data: siteStats } = useSiteStats();

 const stats = (siteStats || [])
 .filter((stat) => stat.isActive)
 .sort((a, b) => a.displayOrder - b.displayOrder)
 .map((stat) => {
 const iconKey = (stat.icon || stat.key || '').toLowerCase();
 const Icon = statIconMap[iconKey] || Award;
 return { label: stat.label, value: stat.value, icon: Icon };
 });

 return (
 <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
 {/* Hero Section */}
 <section className="relative overflow-hidden pt-16 sm:pt-24 md:pt-40 pb-10 sm:pb-16 md:pb-28">
 <div className="absolute inset-0 z-0">
 <div className="absolute top-0 right-1/4 w-[1000px] h-[1000px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[150px] animate-pulse" />
 <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
 <div className="absolute inset-0 bg-studio-grid opacity-20 dark:opacity-30" />
 <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
 </div>

 <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6 sm:space-y-10">
 <BlurFade delay={0.1} inView>
 <div className="flex flex-col items-center space-y-4 sm:space-y-8">
 <div className="section-badge mx-auto">
 <Music4 className="w-4 h-4 text-primary animate-pulse" />
 <span>Tầm nhìn & Sứ mệnh</span>
 </div>
 <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] sm:leading-[0.85] font-display">
 Đánh thức <span className="premium-text-gradient italic">Cảm xúc</span><br />
 Chinh phục <span className="text-foreground/40 italic">Thính giác</span>
 </h1>
 <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-4xl mx-auto font-medium leading-relaxed italic border-x-4 border-primary/20 px-4 sm:px-6 md:px-10">
 Audio Tài Lộc không chỉ kiến tạo những bộ dàn âm thanh. Chúng tôi mang tâm hồn vào từng nốt nhạc, kiến tạo không gian thịnh vượng và hạnh phúc cho mọi gia đình Việt.
 </p>
 </div>
 </BlurFade>
 </div>
 </section>

 {/* Stats Section: Elite Console Style */}
 {stats.length > 0 && (
 <section className="py-10 sm:py-16 relative overflow-hidden">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
 {stats.map((stat, index) => (
 <BlurFade key={index} delay={0.1 * index} inView>
 <div className="group relative p-4 sm:p-6 md:p-8 red-elite-card rounded-[2rem] overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
 <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-foreground dark:text-white transition-all duration-500">
 <stat.icon size={28} />
 </div>
 <div className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground mb-2 tracking-tighter tabular-nums drop-shadow-sm group-hover:text-primary transition-colors">{stat.value}</div>
 <div className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 group-hover:text-primary transition-colors font-display">{stat.label}</div>
 </div>
 </BlurFade>
 ))}
 </div>
 </div>
 </section>
 )}

 {/* Story Section: Cinematic Redesign */}
 <section className="py-12 sm:py-20 md:py-28 relative">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
 <BlurFade delay={0.2} direction="right" inView>
 <div className="space-y-6 md:space-y-10">
 <div className="space-y-6">
 <div className="inline-flex items-center gap-2 text-primary">
 <Sparkles size={16} />
 <span className="font-black uppercase tracking-[0.4em] text-[11px] font-display">Lịch sử hình thành</span>
 </div>
 <h2 className="text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] sm:leading-[0.85] font-display uppercase italic">Di sản <br /><span className="text-foreground/40">Âm thanh Elite</span></h2>
 </div>

 <div className="space-y-4 sm:space-y-6 text-muted-foreground text-sm sm:text-base md:text-lg font-medium leading-relaxed italic border-l-4 border-primary/20 pl-4 sm:pl-8">
 <p>
 Khởi nguồn từ niềm đam mê thuần khiết với nghệ thuật âm học, Audio Tài Lộc đã kiến tạo một hành trình hơn 10 năm chuyển mình đầy kiêu hãnh.
 </p>
 <p>
 Chúng tôi tự hào là đơn vị tiên phong mang các giải pháp âm thanh High-End toàn cầu tích hợp vào không gian kiến trúc Á Đông, phục vụ hàng vạn khách hàng thượng lưu khắp Việt Nam.
 </p>
 </div>

 <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border/40">
 {[
 { title: "Kỹ nghệ Thượng tầng", desc: "Showroom tiêu chuẩn Studio chuyên nghiệp" },
 { title: "Tinh hoa Chính hãng", desc: "Đối tác chiến lược của JBL, Bose, Shure" },
 { title: "Hậu mãi Platinum", desc: "Bảo trì định kỳ trọn đời sản phẩm" },
 { title: "Giải pháp Cá nhân", desc: "Thiết kế âm âm học theo cấu trúc phòng" }
 ].map((item, idx) => (
 <div key={idx} className="space-y-3 group">
 <div className="flex items-center gap-3">
 <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
 <span className="text-[10px] font-black uppercase tracking-widest text-foreground font-display">{item.title}</span>
 </div>
 <p className="text-xs text-muted-foreground italic pl-6 group-hover:text-primary transition-colors">{item.desc}</p>
 </div>
 ))}
 </div>
 </div>
 </BlurFade>

 <BlurFade delay={0.4} direction="left" inView>
 <div className="relative group">
 {/* Decorative Glow */}
 <div className="absolute -inset-10 bg-primary/20 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

 <div className="relative rounded-[4rem] overflow-hidden border border-white/10 dark:border-white/5 shadow-3xl aspect-[4/5] red-elite-card">
 <Image
 src="/images/banners/home-hero.png"
 alt="Audio Tài Lộc Showroom"
 fill
 className="object-cover transition-transform duration-[4000ms] group-hover:scale-110 opacity-80"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
 <div className="absolute inset-0 gold-royal-grain opacity-10" />

 <div className="absolute bottom-8 left-8 right-8 space-y-4">
 <div className="w-20 h-1.5 bg-primary/60 rounded-full" />
 <p className="text-xl sm:text-2xl md:text-4xl font-black italic text-foreground dark:text-white leading-tight uppercase tracking-tighter font-display drop-shadow-2xl">
 &ldquo;Âm thanh đỉnh cao -<br />
 <span className="text-accent">Nâng tầm cuộc sống</span>&rdquo;
 </p>
 <div className="flex items-center gap-4 pt-4">
 <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-xl">
 <Sparkles className="w-5 h-5 text-accent animate-pulse" />
 </div>
 <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 dark:text-zinc-200 font-display">Since 2014 • Elite Experience</span>
 </div>
 </div>
 </div>
 </div>
 </BlurFade>
 </div>
 </div>
 </section>

 {/* Call to Action Bar */}
 <section className="py-16 sm:py-24 border-y border-border/40 bg-primary/[0.03] relative overflow-hidden">
 <div className="absolute inset-0 gold-royal-grain opacity-5 pointer-events-none" />
 <div className="container mx-auto px-4 sm:px-6 relative z-10">
 <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left">
 <div className="space-y-6">
 <h3 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter italic font-display">Trải nghiệm <br /><span className="premium-text-gradient">Tinh hoa Trực tiếp</span></h3>
 <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium italic max-w-lg">Khám phá không gian âm nhạc đích thực tại hệ thống showroom hiện đại nhất Việt Nam.</p>
 </div>
 <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
 <Link href="/contact">
 <Button className="h-12 md:h-16 px-6 md:px-10 bg-foreground text-background hover:bg-primary hover:text-foreground dark:text-white rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-widest transition-all text-[10px] flex items-center gap-3 shadow-2xl">
 Khám phá Showroom
 <ChevronRight className="w-5 h-5" />
 </Button>
 </Link>
 <Link href="/contact">
 <Button variant="outline" className="h-12 md:h-16 px-6 md:px-10 border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-foreground dark:text-white rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-widest transition-all text-[10px] shadow-xl">
 Liên hệ Chuyên gia
 </Button>
 </Link>
 </div>
 </div>
 </div>
 </section>
 </main>
 );
}
