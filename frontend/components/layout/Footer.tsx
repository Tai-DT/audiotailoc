'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Facebook, Instagram, Youtube, Mail, Phone, MapPin,
    Clock, Headphones, Shield, Truck, ArrowUpRight,
    MessageCircle, CreditCard, Wallet, Landmark,
    ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { BlurFade } from '@/components/ui/blur-fade';
import type { Category } from '@/lib/types';
import type { ContactInfo } from '@/lib/contact-info';

/**
 * Premium Footer - Modern design with gradients, glassmorphism, and animations
 */
export function Footer({ categories, contactInfo }: { categories: Category[]; contactInfo?: ContactInfo }) {
    const [email, setEmail] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Get top 5 categories for display
    const displayCategories = categories?.slice(0, 5) || [];
    const hotlineNumber = contactInfo?.phone?.hotline
        || contactInfo?.phone?.display?.replace(/\s+/g, '')
        || '';
    const hotlineDisplay = contactInfo?.phone?.display || contactInfo?.phone?.hotline || '';
    const contactEmail = contactInfo?.email || '';
    const contactAddress = contactInfo?.address?.full || '';
    const contactHours = contactInfo?.businessHours?.display || '';
    const socialLinks = [
        { icon: Facebook, href: contactInfo?.social?.facebook, label: 'Facebook', color: 'hover:bg-blue-600' },
        { icon: Instagram, href: contactInfo?.social?.instagram, label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500' },
        { icon: Youtube, href: contactInfo?.social?.youtube, label: 'YouTube', color: 'hover:bg-red-600' },
        { icon: MessageCircle, href: contactInfo?.social?.zalo || (hotlineNumber ? `https://zalo.me/${hotlineNumber}` : undefined), label: 'Zalo', color: 'hover:bg-blue-500' },
    ].filter((link) => Boolean(link.href));

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            toast.error('Vui lòng nhập email');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            toast.error('Email không hợp lệ');
            return;
        }

        try {
            setIsSubmitting(true);
            await apiClient.post('/site/newsletter/subscribe', { email: trimmedEmail });
            toast.success('Đăng ký nhận tin thành công!');
            setEmail('');
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Không thể đăng ký nhận tin. Vui lòng thử lại.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer suppressHydrationWarning className="relative bg-background text-foreground overflow-hidden border-t-2 border-primary/20">
            {/* Background Effects - Deep & Atmospheric */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Gradient Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/15 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[180px]" />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    suppressHydrationWarning
                    style={{
                        backgroundImage: `linear-gradient(rgba(220,38,38,0.1) 1px, transparent 1px),
 linear-gradient(90deg, rgba(220,38,38,0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Trust Features Bar - High Impact */}
            <div className="relative border-b border-primary/10 bg-primary/[0.08] backdrop-blur-xl">
                <div className="container mx-auto px-4 py-10 md:py-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                        {[
                            { icon: Truck, title: 'Giao hàng hỏa tốc', desc: 'Toàn quốc trong 24h - 48h' },
                            { icon: Shield, title: 'Bảo hành tối cao', desc: 'Chính hãng từ các siêu thương hiệu' },
                            { icon: Headphones, title: 'Chuyên gia âm thanh', desc: 'Tư vấn giải pháp Hi-End trọn gói' },
                            { icon: Clock, title: 'Kỹ thuật tận nơi', desc: 'Hỗ trợ trọn vòng đời sản phẩm' },
                        ].map((item, index) => (
                            <BlurFade key={index} delay={index * 0.1} inView direction="up">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 group">
                                    <div className={cn(
                                        "flex-shrink-0 p-4 rounded-[2rem]",
                                        "bg-gradient-to-br from-primary/30 to-primary/10",
                                        "border border-primary/10 shadow-lg shadow-primary/5",
                                        "group-hover:scale-110 group-hover:from-primary/30 group-hover:to-primary/10",
                                        "transition-all duration-700 active:scale-95"
                                    )}>
                                        <item.icon className="w-7 h-7 text-primary group-hover:rotate-12 transition-transform duration-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[11px] font-bold text-foreground uppercase tracking-[0.2em] font-display group-hover:text-primary transition-colors">{item.title}</h4>
                                        <p className="text-[10px] text-muted-foreground/80 leading-relaxed font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="relative container mx-auto px-6 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Company Info */}
                    <div className="lg:col-span-4 space-y-10">
                        <BlurFade delay={0.1} inView>
                            <div className="space-y-8">
                                {/* Logo */}
                                <Link href="/" className="inline-block group transition-all duration-500 hover:scale-105 active:scale-95">
                                    <div className="relative h-[60px] w-[200px] md:h-[74px] md:w-[260px]">
                                        <Image
                                            src="/images/logo/logo-dark.svg"
                                            alt="Audio Tài Lộc"
                                            width={260}
                                            height={74}
                                            className="h-full w-full object-contain dark:hidden"
                                            unoptimized
                                            priority
                                        />
                                        <Image
                                            src="/images/logo/logo-light.svg"
                                            alt="Audio Tài Lộc"
                                            width={260}
                                            height={74}
                                            className="h-full w-full object-contain hidden dark:block brightness-110 drop-shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                                            unoptimized
                                            priority
                                        />
                                    </div>
                                </Link>

                                <p className="text-muted-foreground text-[13px] leading-relaxed font-medium max-w-sm">
                                    Đỉnh cao công nghệ âm thanh chuyên nghiệp. Audio Tài Lộc kiến tạo không gian âm nhạc đẳng cấp Hi-End, mang đến trải nghiệm thính giác tuyệt đỉnh cho mọi công trình.
                                </p>

                                {/* Social Links - Premium Glassy Circles */}
                                <div className="flex items-center gap-4">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href as string}
                                            className={cn(
                                                "p-4 rounded-full bg-muted/50 border border-border/60",
                                                "text-muted-foreground hover:text-foreground dark:text-white transition-all duration-700",
                                                social.color,
                                                "hover:scale-110 hover:border-transparent hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]"
                                            )}
                                            title={social.label}
                                            aria-label={social.label}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <social.icon className="h-4.5 w-4.5" />
                                        </a>
                                    ))}
                                </div>

                                {/* Newsletter - High-end Membership Feel */}
                                <div className="p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] bg-primary/[0.08] border border-primary/20 backdrop-blur-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                                    <h4 className="text-[10px] font-black mb-5 uppercase tracking-[0.3em] text-primary font-display flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        Bản tin đặc quyền
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground/80 mb-6 font-medium">Nhận thông báo về các sản phẩm giới hạn và ưu đãi dành riêng cho VIP.</p>
                                    <form onSubmit={handleSubscribe} className="flex gap-2">
                                        <Input
                                            type="email"
                                            id="footer-newsletter-email"
                                            placeholder="Email của bạn..."
                                            suppressHydrationWarning
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-background border-border/60 text-foreground placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-2xl h-14 text-xs font-bold px-5 transition-all"
                                            disabled={isSubmitting}
                                        />
                                        <Button
                                            type="submit"
                                            className="h-14 w-14 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 rounded-2xl shadow-xl shadow-primary/20 transition-all flex-shrink-0"
                                            disabled={isSubmitting}
                                        >
                                            <ArrowUpRight className="h-6 w-6 font-black" />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </BlurFade>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-2 space-y-8">
                        <BlurFade delay={0.2} inView>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-6 md:mb-10 font-display border-b border-primary/10 pb-2">Khám phá</h3>
                            <nav className="flex flex-col gap-5">
                                {[
                                    { href: '/about', label: 'Giới thiệu' },
                                    { href: '/products', label: 'Sản phẩm' },
                                    { href: '/services', label: 'Dịch vụ' },
                                    { href: '/du-an', label: 'Dự án' },
                                    { href: '/blog', label: 'Blog' },
                                    { href: '/lien-he', label: 'Liên hệ' },
                                ].map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "group flex items-center gap-3 text-muted-foreground/70 hover:text-primary",
                                            "text-[11px] font-black uppercase tracking-widest transition-all duration-500",
                                            "hover:translate-x-2"
                                        )}
                                    >
                                        <span className="h-[2px] w-0 bg-primary group-hover:w-4 transition-all duration-500" />
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </BlurFade>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <BlurFade delay={0.25} inView>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-6 md:mb-10 font-display border-b border-primary/10 pb-2">Danh mục</h3>
                            <nav className="flex flex-col gap-5">
                                {displayCategories.length > 0 ? (
                                    displayCategories.map((category: { id: string; name: string; slug: string }) => (
                                        <Link
                                            key={category.id}
                                            href={`/products?category=${category.slug}`}
                                            className={cn(
                                                "group flex items-center gap-3 text-muted-foreground/70 hover:text-primary",
                                                "text-[11px] font-black uppercase tracking-widest transition-all duration-500",
                                                "hover:translate-x-2"
                                            )}
                                        >
                                            <span className="h-[2px] w-0 bg-primary group-hover:w-4 transition-all duration-500" />
                                            {category.name}
                                        </Link>
                                    ))
                                ) : (
                                    [
                                        { href: '/products?category=amply-cuc-day', label: 'Amplifiers' },
                                        { href: '/products?category=loa-karaoke', label: 'Loa Karaoke' },
                                        { href: '/products?category=microphone', label: 'Microphones' },
                                        { href: '/products?category=vang-so-mixer', label: 'Processors' },
                                    ].map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={cn(
                                                "group flex items-center gap-3 text-muted-foreground/70 hover:text-primary",
                                                "text-[11px] font-black uppercase tracking-widest transition-all duration-500",
                                                "hover:translate-x-2"
                                            )}
                                        >
                                            <span className="h-[2px] w-0 bg-primary group-hover:w-4 transition-all duration-500" />
                                            {link.label}
                                        </Link>
                                    ))
                                )}
                            </nav>
                        </BlurFade>
                    </div>

                    {/* Contact Details - Elegant & Clear */}
                    <div className="lg:col-span-4 space-y-10">
                        <BlurFade delay={0.3} inView>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-6 md:mb-10 font-display border-b border-primary/10 pb-2">Hub & Support</h3>
                            <div className="space-y-6">
                                <a
                                    href={`tel:${hotlineNumber}`}
                                    className={cn(
                                        "flex items-center gap-5 md:gap-6 p-5 md:p-6 rounded-3xl md:rounded-[2.5rem]",
                                        "bg-gradient-to-r from-primary via-primary/5 to-transparent",
                                        "border border-primary/20",
                                        "transition-all duration-700 group relative overflow-hidden active:scale-95"
                                    )}
                                >
                                    <div className="absolute inset-0 bg-primary/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-1000" />
                                    <div className="relative flex-shrink-0 p-3.5 md:p-4 rounded-2xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        <Phone className="h-5 w-5 md:h-6 md:w-6" />
                                    </div>
                                    <div className="relative">
                                        <p className="text-foreground font-black text-xl md:text-2xl tracking-tighter group-hover:text-primary transition-colors">{hotlineDisplay}</p>
                                        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-muted-foreground/70">Hotline Exclusive</p>
                                    </div>
                                </a>

                                <div className="grid grid-cols-1 gap-6 pt-4">
                                    <div className="flex flex-col gap-6">
                                        <a
                                            href={`mailto:${contactEmail}`}
                                            className="flex items-center gap-5 text-muted-foreground/70 hover:text-foreground transition-all group"
                                        >
                                            <div className="p-3.5 rounded-2xl bg-muted/50 border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                                                <Mail className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email tư vấn</span>
                                                <span className="text-sm font-bold">{contactEmail}</span>
                                            </div>
                                        </a>

                                        <div className="flex items-center gap-5 text-muted-foreground/70 group">
                                            <div className="p-3.5 rounded-2xl bg-muted/50 border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                                                <Clock className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Thời gian phục vụ</span>
                                                <span className="text-sm font-bold">{contactHours}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-5 text-muted-foreground/70 group">
                                            <div className="p-3.5 rounded-2xl bg-muted/50 border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 flex-shrink-0">
                                                <MapPin className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Hệ thống Showroom</span>
                                                <span className="text-sm font-bold leading-relaxed max-w-[200px]">{contactAddress}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BlurFade>
                    </div>
                </div>
            </div>

            {/* Legacy & Legal Bottom Bar */}
            <div className="relative border-t border-border/40 bg-muted/20 backdrop-blur-md">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8" suppressHydrationWarning>
                        <div className="flex flex-col items-center md:items-start gap-2" suppressHydrationWarning>
                            <p className="text-muted-foreground/60 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.08em] sm:tracking-[0.2em] leading-relaxed" suppressHydrationWarning>
                                © 2026 Audio Tài Lộc Heritage. All rights reserved.
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-[9px] text-muted-foreground/50 uppercase tracking-[0.12em] sm:tracking-[0.3em] font-bold" suppressHydrationWarning>
                                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                                <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                                <Link href="/sitemap.xml" className="hover:text-primary transition-colors">Sitemap</Link>
                            </div>
                        </div>

                        {/* Premium Trust Badges & Payment */}
                        <div className="flex flex-wrap justify-center items-center gap-10">
                            <div className="flex items-center gap-4">
                                {[
                                    { icon: Landmark, label: 'Swift Transfer' },
                                    { icon: CreditCard, label: 'Global Cards' },
                                    { icon: Wallet, label: 'Flexible COD' }
                                ].map((method, index) => (
                                    <div
                                        key={index}
                                        className="p-3 bg-muted/60 border border-border/80 rounded-2xl flex items-center gap-3 hover:bg-muted transition-all cursor-default group shadow-sm"
                                        title={method.label}
                                    >
                                        <method.icon className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                                        <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover:text-foreground transition-colors">{method.label}</span>
                                    </div>
                                ))}
                            </div>

                            {mounted && (
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="h-14 w-14 rounded-[1.5rem] bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110 active:scale-90 transition-all duration-500 shadow-xl shadow-primary/20 flex items-center justify-center group"
                                    aria-label="Về đầu trang"
                                >
                                    <ArrowUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
