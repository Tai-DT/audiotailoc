'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Phone, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroProductFocused() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Thiết bị âm thanh
                </span>
                <br />
                chuyên nghiệp
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Khám phá bộ sưu tập thiết bị âm thanh cao cấp và dịch vụ thi công chuyên nghiệp. 
                Giải pháp hoàn hảo cho mọi không gian.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/products" className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Xem sản phẩm
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/services" className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Dịch vụ thi công
                </Link>
              </Button>
            </div>

            {/* Contact info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>Tư vấn miễn phí: <strong className="text-foreground">0123 456 789</strong></span>
            </div>
          </motion.div>

          {/* Product categories quick access */}
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
                { title: 'Loa chuyên nghiệp', href: '/danh-muc?category=speakers', icon: '🔊' },
                { title: 'Micro & Thu âm', href: '/danh-muc?category=microphones', icon: '🎤' },
                { title: 'Mixer & Amplifier', href: '/danh-muc?category=mixers', icon: '🎛️' },
                { title: 'Phụ kiện âm thanh', href: '/danh-muc?category=accessories', icon: '🔌' }
            ].map((category, index) => (
              <Link key={index} href={category.href}>
                <div className="group p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Featured services banner */}
        <motion.div 
          className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Dịch vụ thi công âm thanh</h3>
              <p className="text-muted-foreground">Thiết kế, lắp đặt và bảo hành hệ thống âm thanh chuyên nghiệp</p>
            </div>
            <Button asChild variant="secondary">
              <Link href="/service-booking">
                Đặt lịch tư vấn
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}