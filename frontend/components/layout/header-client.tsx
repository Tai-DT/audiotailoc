'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, Phone, Sparkles, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/providers/cart-provider';
import type { ContactInfo } from '@/lib/contact-info';
import { ThemeToggle } from './theme-toggle';
import HeaderSubNav from './header-sub-nav';

export function AppHeader({ contactInfo }: { contactInfo?: ContactInfo }) {
    const [hasMounted, setHasMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [shouldRenderMobileMenu, setShouldRenderMobileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { itemCount } = useCart();
    const pathname = usePathname();

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            setShouldRenderMobileMenu(true);
            return;
        }

        if (shouldRenderMobileMenu) {
            const timer = setTimeout(() => setShouldRenderMobileMenu(false), 280);
            return () => clearTimeout(timer);
        }
    }, [isMobileMenuOpen, shouldRenderMobileMenu]);

    const hotlineDisplay = contactInfo?.phone?.display || '0768 426 262';
    const hotlineNumber = hotlineDisplay.replace(/\s+/g, '');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Trang chủ', href: '/' },
        { name: 'Sản phẩm', href: '/products' },
        { name: 'Phần mềm', href: '/software' },
        { name: 'Dịch vụ', href: '/services' },
        { name: 'Dự án', href: '/projects' },
        { name: 'Tin tức', href: '/blog' },
        { name: 'Liên hệ', href: '/contact' },
    ];

    return (
        <header
            suppressHydrationWarning
            className={cn(
                "sticky top-0 left-0 right-0 z-50 transition-all duration-500 flex flex-col",
                isScrolled
                    ? "bg-background/80 backdrop-blur-xl border-b border-primary/10 shadow-lg"
                    : "bg-transparent"
            )}
        >
            {/* Premium Top Line - High-end feel */}
            {!isScrolled && (
                <div className="bg-primary/5 border-b border-white/5 py-1 hidden lg:block" translate="no">
                    {hasMounted ? (
                        <div className="container mx-auto px-6 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            <div className="flex items-center gap-6">
                                <a href={`tel:${hotlineNumber}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <Phone className="w-3 h-3 text-primary" />
                                    <span>Hotline: <span className="text-foreground">{hotlineDisplay}</span></span>
                                </a>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-accent" />
                                    <span className="notranslate">Đặc quyền thành viên Elite</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <Link href="/shipping" className="hover:text-primary transition-colors">Giao hàng toàn quốc</Link>
                                <Link href="/warranty" className="hover:text-primary transition-colors">Bảo hành 24 tháng</Link>
                            </div>
                        </div>
                    ) : (
                        <div className="container mx-auto px-6 h-4 bg-transparent" />
                    )}
                </div>
            )}

            <div className={cn(
                "container mx-auto px-4 lg:px-6 flex items-center justify-between gap-4 sm:gap-6 lg:gap-8 transition-all duration-500",
                isScrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
            )}>
                {/* Logo Section */}
                <Link href="/" className="flex flex-shrink-0 relative z-50 transition-transform active:scale-95 group">
                    <div className={cn(
                        "relative transition-all duration-500",
                        isScrolled
                            ? "h-[32px] w-[100px] sm:h-[48px] sm:w-[140px] lg:h-[52px] lg:w-[148px]"
                            : "h-[40px] w-[120px] sm:h-[58px] sm:w-[176px] lg:h-[68px] lg:w-[212px]"
                    )}>
                        <Image
                            src="/images/logo/logo-dark.svg"
                            alt="Audio Tài Lộc"
                            width={212}
                            height={68}
                            className="h-full w-full object-contain dark:hidden"
                            priority
                            unoptimized
                        />
                        <Image
                            src="/images/logo/logo-light.svg"
                            alt="Audio Tài Lộc"
                            width={212}
                            height={68}
                            className="h-full w-full object-contain hidden dark:block"
                            priority
                            unoptimized
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden xl:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-xs font-black uppercase tracking-[0.2em] transition-all relative py-2 group",
                                pathname === link.href ? "text-primary" : "text-foreground/70 hover:text-primary"
                            )}
                        >
                            {link.name}
                            <span className={cn(
                                "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-500",
                                pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                            )} />
                        </Link>
                    ))}
                </nav>

                {/* Integrated Search Bar (Featured Hero Style) */}
                {!isScrolled && (
                    <div className="hidden lg:flex flex-1 max-w-md relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full opacity-20 blur group-focus-within:opacity-40 transition-opacity" />
                        <div className="relative w-full flex items-center bg-card/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
                            <Search className="w-4 h-4 text-muted-foreground mr-3" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="bg-transparent border-none outline-none text-xs font-medium w-full placeholder:text-muted-foreground/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary ml-2 hover:scale-105 transition-transform">
                                Tìm ngay
                            </button>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3 relative z-50">
                    <a href={`tel:${hotlineNumber}`} className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary sm:hidden uppercase tracking-tighter">
                        Hotline
                    </a>

                    <button className="p-2 rounded-full hover:bg-primary/5 transition-colors">
                        <Search className="w-5 h-5 text-foreground/70" />
                    </button>

                    <div className="hidden xs:block">
                        <ThemeToggle />
                    </div>

                    <Link prefetch={false} href="/wishlist" className="p-2 rounded-full hover:bg-primary/5 transition-colors relative hidden sm:block">
                        <Heart className="w-5 h-5 text-foreground/70" />
                    </Link>

                    <Link href="/cart" className="p-2 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all relative">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-lg">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    <div className="h-5 w-px bg-border/40 mx-0.5 hidden sm:block" />

                    <Link prefetch={false} href="/account" className="hidden xs:flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:border-primary transition-all">
                            <User className="w-4 h-4 text-accent group-hover:text-primary transition-colors" />
                        </div>
                    </Link>

                    <button
                        className="xl:hidden p-2 rounded-lg bg-foreground/5 active:scale-95 transition-transform"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="w-5 h-5 text-foreground" />
                    </button>
                </div>

            </div>

            {/* Sub-Navbar (Categories) - Always Visible */}
            <div suppressHydrationWarning className="w-full border-t border-white/5 h-11 sm:h-12 bg-black/20 backdrop-blur-md">
                <HeaderSubNav />
            </div>

            {/* Mobile Menu Overlay */}
            {shouldRenderMobileMenu && (
                <div
                    className={cn(
                        "fixed inset-0 z-[60] bg-background/98 backdrop-blur-2xl p-8 flex flex-col transition-all duration-300 ease-out",
                        isMobileMenuOpen
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-full pointer-events-none"
                    )}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile menu"
                >
                    <div className="flex justify-between items-center mb-16">
                        <div className="relative h-10 w-32 translate-y-2">
                            <Image
                                src="/images/logo/logo-dark.svg"
                                alt="Logo"
                                width={128}
                                height={40}
                                className="h-full w-full object-contain dark:hidden"
                            />
                            <Image
                                src="/images/logo/logo-light.svg"
                                alt="Logo"
                                width={128}
                                height={40}
                                className="h-full w-full object-contain hidden dark:block brightness-110"
                            />
                        </div>
                        <button
                            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Menu className="w-6 h-6 rotate-90" />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-8">
                        {navLinks.map((link, idx) => (
                            <div
                                key={link.name}
                                className={cn(
                                    "transition-all duration-300 ease-out",
                                    isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                                )}
                                style={{ transitionDelay: `${idx * 60}ms` }}
                            >
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "text-4xl font-black uppercase tracking-tighter transition-all active:text-primary active:translate-x-2 py-2",
                                        pathname === link.href ? "text-primary" : "text-foreground"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            </div>
                        ))}
                    </nav>

                    <div className="mt-auto space-y-8">
                        <div className="p-8 rounded-[2.5rem] bg-primary/[0.08] border border-primary/20 relative overflow-hidden">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-3">Hotline Hỗ Trợ 24/7</p>
                            <a href={`tel:${hotlineNumber}`} className="text-3xl font-black text-primary tracking-tighter block">{hotlineDisplay}</a>
                        </div>

                        <div className="flex justify-between items-center px-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Tai Loc Elite Heritage</span>
                            <div className="flex gap-4">
                                <ThemeToggle />
                                <Link href="/account" className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                                    <User className="w-5 h-5 text-accent" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header >
    );
}

export default AppHeader;
