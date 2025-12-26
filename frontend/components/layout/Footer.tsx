'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { DotPattern } from '@/components/ui/dot-pattern';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { motion } from 'framer-motion';
import { useCategories } from '@/lib/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold shadow-lg"
              >
                AT
              </motion.div>
              <AnimatedGradientText
                className="font-bold text-xl"
                speed={1.5}
                colorFrom="oklch(0.95 0.05 100)"
                colorTo="oklch(0.98 0.02 50)"
              >
                Audio Tài Lộc
              </AnimatedGradientText>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xs">
              Chuyên cung cấp thiết bị âm thanh chất lượng cao và dịch vụ kỹ thuật chuyên nghiệp.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors touch-manipulation p-2 rounded-lg hover:bg-primary/10"
                title="Facebook"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-muted-foreground hover:text-accent transition-colors touch-manipulation p-2 rounded-lg hover:bg-accent/10"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-muted-foreground hover:text-destructive transition-colors touch-manipulation p-2 rounded-lg hover:bg-destructive/10"
                title="YouTube"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-base sm:text-lg text-foreground mb-4">Liên kết nhanh</h3>
            <nav className="space-y-2.5">
              {[
                { href: '/products', label: 'Sản phẩm' },
                { href: '/services', label: 'Dịch vụ' },
                { href: '/du-an', label: 'Dự án' },
                { href: '/contact', label: 'Liên hệ' },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block text-muted-foreground hover:text-primary transition-all text-sm sm:text-base py-1 touch-manipulation hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          {/* Categories - Dynamic from API */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-base sm:text-lg text-foreground mb-4">Danh mục</h3>
            <nav className="space-y-2.5">
              {categoriesLoading ? (
                // Loading skeleton
                [...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-5 w-24 bg-muted" />
                ))
              ) : displayCategories.length > 0 ? (
                displayCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  >
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="block text-muted-foreground hover:text-accent transition-all text-sm sm:text-base py-1 touch-manipulation hover:translate-x-1 inline-block"
                    >
                      {category.name}
                    </Link>
                  </motion.div>
                ))
              ) : (
                // Fallback to hardcoded if no categories from API
                [
                  { href: '/products?category=amply-cuc-day', label: 'Amply' },
                  { href: '/products?category=loa-loa-sub', label: 'Loa' },
                  { href: '/products?category=micro-karaoke-khong-day', label: 'Micro' },
                  { href: '/products?category=mixer-vang-so', label: 'Mixer' },
                  { href: '/products?category=hang-thanh-ly-hang-cu', label: 'Thanh lý' },
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="block text-muted-foreground hover:text-accent transition-all text-sm sm:text-base py-1 touch-manipulation hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))
              )}
            </nav>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-base sm:text-lg text-foreground">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start space-x-3 touch-manipulation group"
              >
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 group-hover:text-accent transition-colors" />
                <span className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors">
                  123 Đường ABC, Quận 1, TP.HCM
                </span>
              </motion.div>
              <motion.a
                whileHover={{ x: 5 }}
                href="tel:02812345678"
                className="flex items-center space-x-3 touch-manipulation hover:text-primary transition-colors group"
              >
                <Phone className="h-5 w-5 text-primary flex-shrink-0 group-hover:text-accent transition-colors" />
                <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                  (028) 1234 5678
                </span>
              </motion.a>
              <motion.a
                whileHover={{ x: 5 }}
                href="mailto:info@audiotailoc.com"
                className="flex items-center space-x-3 touch-manipulation hover:text-primary transition-colors group"
              >
                <Mail className="h-5 w-5 text-primary flex-shrink-0 group-hover:text-accent transition-colors" />
                <span className="text-muted-foreground text-sm break-all group-hover:text-foreground transition-colors">
                  info@audiotailoc.com
                </span>
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-border mt-10 sm:mt-12 pt-6 sm:pt-8"
        >
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
        </motion.div>
      </div>
    </footer>
  );
}
