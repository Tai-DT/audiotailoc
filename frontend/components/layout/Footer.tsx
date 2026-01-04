'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { DotPattern } from '@/components/ui/dot-pattern';
import { useCategories } from '@/lib/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Optimized Footer - Uses CSS animations instead of framer-motion
 * This significantly reduces TBT as framer-motion is heavy
 */
export function Footer() {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  // Get top 5 categories for display
  const displayCategories = categories?.slice(0, 5) || [];
  
  return (
    <footer className="relative bg-gradient-to-b from-background via-muted/50 to-background dark:from-muted/20 dark:via-background dark:to-muted/20 text-foreground overflow-hidden border-t border-border">
      {/* Background Pattern */}
      <DotPattern
        className="absolute inset-0 opacity-10 dark:opacity-20"
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative container mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0s' }}>
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold shadow-lg transition-transform hover:scale-110">
                AT
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Audio Tài Lộc
              </span>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xs">
              Chuyên cung cấp thiết bị âm thanh chất lượng cao và dịch vụ kỹ thuật chuyên nghiệp.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-all touch-manipulation p-2 rounded-lg hover:bg-primary/10 hover:scale-110"
                title="Facebook"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-accent transition-all touch-manipulation p-2 rounded-lg hover:bg-accent/10 hover:scale-110"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-destructive transition-all touch-manipulation p-2 rounded-lg hover:bg-destructive/10 hover:scale-110"
                title="YouTube"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-semibold text-base sm:text-lg text-foreground mb-4">Liên kết nhanh</h3>
            <nav className="space-y-2.5">
              {[
                { href: '/about', label: 'Giới thiệu' },
                { href: '/products', label: 'Sản phẩm' },
                { href: '/services', label: 'Dịch vụ' },
                { href: '/du-an', label: 'Dự án' },
                { href: '/contact', label: 'Liên hệ' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-muted-foreground hover:text-primary transition-all text-sm sm:text-base py-1 touch-manipulation hover:translate-x-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories - Dynamic from API */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-semibold text-base sm:text-lg text-foreground mb-4">Danh mục</h3>
            <nav className="space-y-2.5">
              {categoriesLoading ? (
                // Loading skeleton
                [...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-5 w-24 bg-muted" />
                ))
              ) : displayCategories.length > 0 ? (
                displayCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="block text-muted-foreground hover:text-accent transition-all text-sm sm:text-base py-1 touch-manipulation hover:translate-x-1"
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                // Fallback to hardcoded if no categories from API
                [
                  { href: '/products?category=amply-cuc-day', label: 'Amply' },
                  { href: '/products?category=loa-loa-sub', label: 'Loa' },
                  { href: '/products?category=micro-karaoke-khong-day', label: 'Micro' },
                  { href: '/products?category=mixer-vang-so', label: 'Mixer' },
                  { href: '/products?category=hang-thanh-ly-hang-cu', label: 'Thanh lý' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-muted-foreground hover:text-accent transition-all text-sm sm:text-base py-1 touch-manipulation hover:translate-x-1"
                  >
                    {link.label}
                  </Link>
                ))
              )}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-semibold text-base sm:text-lg text-foreground">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 touch-manipulation group hover:translate-x-1 transition-transform">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 group-hover:text-accent transition-colors" />
                <span className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors">
                  123 Đường ABC, Quận 1, TP.HCM
                </span>
              </div>
              <a
                href="tel:02812345678"
                className="flex items-center space-x-3 touch-manipulation hover:text-primary transition-all group hover:translate-x-1"
              >
                <Phone className="h-5 w-5 text-primary flex-shrink-0 group-hover:text-accent transition-colors" />
                <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                  (028) 1234 5678
                </span>
              </a>
              <a
                href="mailto:info@audiotailoc.com"
                className="flex items-center space-x-3 touch-manipulation hover:text-primary transition-all group hover:translate-x-1"
              >
                <Mail className="h-5 w-5 text-primary flex-shrink-0 group-hover:text-accent transition-colors" />
                <span className="text-muted-foreground text-sm break-all group-hover:text-foreground transition-colors">
                  info@audiotailoc.com
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 sm:mt-12 pt-6 sm:pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 gap-4">
            <p className="text-muted-foreground text-xs sm:text-sm text-center md:text-left">
              © 2024 Audio Tài Lộc. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 md:gap-6">
              {[
                { href: '/privacy', label: 'Chính sách bảo mật' },
                { href: '/terms', label: 'Điều khoản sử dụng' },
                { href: '/shipping-policy', label: 'Chính sách giao hàng' },
                { href: '/warranty', label: 'Chính sách bảo hành' },
                { href: '/return-policy', label: 'Chính sách đổi trả', className: 'hidden sm:inline' },
                { href: '/technical-support', label: 'Hỗ trợ kỹ thuật', className: 'hidden sm:inline' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-muted-foreground hover:text-primary text-xs sm:text-sm transition-colors touch-manipulation whitespace-nowrap hover:underline ${link.className || ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
