'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { cn, formatVND } from '@/lib/utils';
import { WatermarkedImage } from '@/components/ui/watermarked-image';

interface EliteProductCardProps {
 product: Product;
 className?: string;
}

export function EliteProductCard({ product, className }: EliteProductCardProps) {
 const discount = product.originalPriceCents
 ? Math.round(((Number(product.originalPriceCents) - Number(product.priceCents)) / Number(product.originalPriceCents)) * 100)
 : 0;

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className={cn("red-elite-card group", className)}
 >
 {/* Badge container - Compact on mobile */}
 <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex flex-col gap-1 md:gap-2">
 {discount > 0 && (
 <div className="bg-yellow-400 text-red-600 dark:text-red-500 text-[8px] md:text-[10px] font-black px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg shadow-yellow-400/20">
 -{discount}%
 </div>
 )}
 {product.featured && (
 <div className="bg-accent text-black text-[8px] md:text-[10px] font-black px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg shadow-accent/20 flex items-center gap-1">
 <Star className="w-2 h-2 md:w-2.5 md:h-2.5 fill-black" />
 ELITE
 </div>
 )}
 </div>

 {/* Image Section */}
 <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
 <Link href={`/products/${product.slug}`} className="block h-full w-full relative">
 <div className="absolute inset-0 bg-noise opacity-5" />
 <div className="p-4 md:p-8 h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
 <WatermarkedImage
 src={product.imageUrl || '/images/product-placeholder.png'}
 alt={product.name}
 fill
 className="object-contain"
 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 />
 </div>
 </Link>

 {/* Quick Action Overlay - Hidden on mobile */}
      <div className="hidden md:flex absolute inset-0 bg-foreground/40 dark:bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 items-center justify-center gap-4 pointer-events-none group-hover:pointer-events-auto">
 <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-primary hover:text-foreground dark:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-500">
 <ShoppingCart className="w-5 h-5" />
 </button>
 <Link href={`/products/${product.slug}`} className="w-12 h-12 rounded-full bg-primary text-foreground dark:text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75">
 <Eye className="w-5 h-5" />
 </Link>
 </div>
 </div>

 {/* Info Section */}
 <div className="p-6 space-y-3">
 <div className="space-y-1">
 <p className="text-[10px] font-black tracking-widest text-primary uppercase opacity-70">
 {product.brand || 'Professional Audio'}
 </p>
 <Link href={`/products/${product.slug}`}>
 <h3 className="font-display text-lg font-bold line-clamp-2 hover:text-primary transition-colors min-h-[3.5rem]">
 {product.name}
 </h3>
 </Link>
 </div>

 <div className="flex items-end justify-between pt-2 border-t border-white/5">
 <div className="space-y-1">
 {product.originalPriceCents && (
 <p className="text-xs text-muted-foreground line-through decoration-primary/50">
 {formatVND(Number(product.originalPriceCents) / 100)}
 </p>
 )}
 <p className="text-xl font-black text-primary tracking-tighter">
 {formatVND(Number(product.priceCents) / 100)}
 </p>
 </div>

 <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
 {product.stockQuantity > 0 ? 'Sẵn hàng' : 'Liên hệ'}
 </div>
 </div>
 </div>
 </motion.div>
 );
}
