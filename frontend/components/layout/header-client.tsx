'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, Phone, Sparkles, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/providers/cart-provider';
import { useContactInfo } from '@/lib/hooks/use-contact-info';
import { ThemeToggle } from './theme-toggle';
import HeaderSubNav from './header-sub-nav';
import { motion, AnimatePresence } from 'framer-motion';

export function AppHeader() {
    const [hasMounted, setHasMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { itemCount } = useCart();
    const { data: contactInfo } = useContactInfo();
    const pathname = usePathname();

    useEffect(() => {
        setHasMounted(true);
    }, []);

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
        { name: 'Sản phẩm', href: '/products' },
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
                "container mx-auto px-4 lg:px-6 flex items-center justify-between gap-8 transition-all duration-500",
                isScrolled ? "h-16" : "h-20"
            )}>
                {/* Logo Section */}
                <Link href="/" className="relative z-50 transition-transform active:scale-95 group">
                    <div className={cn(
                        "relative transition-all duration-500",
                        isScrolled ? "h-[52px] w-[148px]" : "h-[68px] w-[212px]"
                    )}>
                        <Image
                            src="/images/logo/logo-dark.svg"
                            alt="Audio Tài Lộc"
                            fill
                            className="object-contain dark:hidden"
                            priority
                            unoptimized
                        />
                        <Image
                            src="/images/logo/logo-light.svg"
                            alt="Audio Tài Lộc"
                            fill
                            className="object-contain hidden dark:block"
                            priority
                            unoptimized
                        />
                    </div>
                    <div className="absolute -inset-4 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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
                <div className="flex items-center gap-2 sm:gap-4 relative z-50">
                    <button className="p-2.5 rounded-full hover:bg-primary/5 transition-colors hidden md:block">
                        <Search className="w-5 h-5 text-foreground/70" />
                    </button>

                    <ThemeToggle />

                    <Link prefetch={false} href="/wishlist" className="p-2.5 rounded-full hover:bg-primary/5 transition-colors relative hidden sm:block">
                        <Heart className="w-5 h-5 text-foreground/70" />
                    </Link>

                    <Link href="/cart" className="p-2.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all relative">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-foreground dark:text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    <div className="h-6 w-px bg-border/40 mx-1 hidden sm:block" />

                    <Link prefetch={false} href="/account" className="hidden sm:flex items-center gap-3 pl-2 group">
                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:border-primary transition-all">
                            <User className="w-5 h-5 text-accent group-hover:text-primary transition-colors" />
                        </div>
                    </Link>

                    {/* Mobile Menu Trigger */}
                    <button
                        className="xl:hidden p-2.5 rounded-full bg-foreground/5"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="w-5 h-5 text-foreground" />
                    </button>
                </div>

            </div>

            {/* Sub-Navbar (Categories) - Always Visible */}
            <div suppressHydrationWarning className="w-full border-t border-white/5 h-12 bg-black/20 backdrop-blur-md">
                <HeaderSubNav />
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-0 z-[60] bg-background p-6 pt-24"
                    >
                        <button
                            className="absolute top-6 right-6 p-4 text-primary font-black uppercase tracking-widest"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Đóng
                        </button>
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-2xl font-black uppercase tracking-tighter"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-20 pt-10 border-t border-border">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Hotline hỗ trợ</p>
                            <a href={`tel:${hotlineNumber}`} className="text-3xl font-black text-primary">{hotlineDisplay}</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default AppHeader;
