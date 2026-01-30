'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { cn, parseImages } from '@/lib/utils';
import { BlurFade } from '@/components/ui/blur-fade';
import { ChevronLeft, ChevronRight, ZoomIn, X, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WatermarkedImage } from '@/components/ui/watermarked-image';

interface ProductGalleryProps {
 images?: unknown;
 productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
 const [selectedIndex, setSelectedIndex] = useState(0);
 const [isZoomed, setIsZoomed] = useState(false);
 const [isLightboxOpen, setIsLightboxOpen] = useState(false);
 // Ensure we have at least one image or a placeholder
 const normalizedImages = parseImages(images);
 const displayImages = normalizedImages.length > 0 ? normalizedImages : ['/placeholder-product.svg'];

 const handlePrevious = useCallback(() => {
 setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
 }, [displayImages.length]);

 const handleNext = useCallback(() => {
 setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
 }, [displayImages.length]);

 // Handle keyboard navigation
 React.useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if (isLightboxOpen) {
 if (e.key === 'ArrowLeft') handlePrevious();
 if (e.key === 'ArrowRight') handleNext();
 if (e.key === 'Escape') setIsLightboxOpen(false);
 }
 };

 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, [isLightboxOpen, handlePrevious, handleNext]);

 return (
 <>
 <div className="flex flex-col gap-4">
 {/* Main Image */}
 <BlurFade key={displayImages[selectedIndex]} duration={0.4} inView>
 <div
 className={cn(
 "relative aspect-square w-full overflow-hidden rounded-2xl",
 "bg-gradient-to-br from-muted/30 via-background to-muted/50",
 "border border-border/50 shadow-xl shadow-primary/5",
 "group cursor-zoom-in transition-all duration-500",
 isZoomed && "cursor-zoom-out"
 )}
 onMouseEnter={() => setIsZoomed(true)}
 onMouseLeave={() => setIsZoomed(false)}
 onClick={() => setIsLightboxOpen(true)}
 >
 {/* Solid background for image container */}
 <div className="absolute inset-0 z-0 bg-card dark:bg-slate-900/50" />
 {/* Dynamic Inner Glow */}
 <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

 {/* Main Product Image */}
 <WatermarkedImage
 src={displayImages[selectedIndex]}
 alt={`${productName} - Image ${selectedIndex + 1}`}
 fill
 className={cn(
 "object-contain object-center transition-transform duration-500",
 "group-hover:scale-105"
 )}
 priority
 sizes="(max-width: 768px) 100vw, 50vw"
 logoSize="md"
 logoPosition="bottom-right"
 />

 {/* Zoom Indicator */}
 <div className={cn(
 "absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full",
            "bg-foreground/60 dark:bg-black/60 backdrop-blur-sm text-foreground dark:text-white text-xs font-medium",
 "flex items-center gap-1.5 transition-opacity duration-300",
 isZoomed ? "opacity-0" : "opacity-100 group-hover:opacity-100",
 "pointer-events-none"
 )}>
 <ZoomIn className="w-3.5 h-3.5" />
 <span>Di chuột để zoom</span>
 </div>

 {/* Fullscreen Button */}
 <Button
 variant="ghost"
 size="icon"
 className={cn(
 "absolute top-4 right-4 h-10 w-10 rounded-full",
                "bg-foreground/40 dark:bg-black/40 backdrop-blur-sm text-foreground dark:text-white hover:bg-foreground/60 dark:bg-black/60",
 "opacity-0 group-hover:opacity-100 transition-all duration-300",
 "hover:scale-110"
 )}
 onClick={(e) => {
 e.stopPropagation();
 setIsLightboxOpen(true);
 }}
 >
 <Expand className="w-4 h-4" />
 </Button>

 {/* Navigation Arrows */}
 {displayImages.length > 1 && (
 <>
 <Button
 variant="ghost"
 size="icon"
 className={cn(
 "absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full",
                    "bg-foreground/40 dark:bg-black/40 backdrop-blur-sm text-foreground dark:text-white hover:bg-foreground/60 dark:bg-black/60",
 "opacity-0 group-hover:opacity-100 transition-all duration-300",
 "hover:scale-110 hover:-translate-x-0.5"
 )}
 onClick={(e) => {
 e.stopPropagation();
 handlePrevious();
 }}
 >
 <ChevronLeft className="w-5 h-5" />
 </Button>
 <Button
 variant="ghost"
 size="icon"
 className={cn(
 "absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full",
                    "bg-foreground/40 dark:bg-black/40 backdrop-blur-sm text-foreground dark:text-white hover:bg-foreground/60 dark:bg-black/60",
 "opacity-0 group-hover:opacity-100 transition-all duration-300",
 "hover:scale-110 hover:translate-x-0.5"
 )}
 onClick={(e) => {
 e.stopPropagation();
 handleNext();
 }}
 >
 <ChevronRight className="w-5 h-5" />
 </Button>
 </>
 )}

 {/* Image Counter Badge */}
 {displayImages.length > 1 && (
 <div className={cn(
 "absolute bottom-4 left-4 px-3 py-1.5 rounded-full",
                "bg-foreground/60 dark:bg-black/60 backdrop-blur-sm text-foreground dark:text-white text-xs font-medium"
 )}>
 {selectedIndex + 1} / {displayImages.length}
 </div>
 )}
 </div>
 </BlurFade>

 {/* Thumbnails */}
 {displayImages.length > 1 && (
 <div className="relative">
 {/* Gradient Fades */}
 <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
 <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

 <div className="flex gap-3 overflow-x-auto pb-2 px-2 scrollbar-hide snap-x snap-mandatory">
 {displayImages.map((image, index) => (
 <button
 key={index}
 onClick={() => setSelectedIndex(index)}
 title={`Xem ảnh ${index + 1}`}
 className={cn(
 "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl snap-center",
 "border-2 transition-all duration-300",
 "bg-gradient-to-br from-muted/30 to-muted/50",
 selectedIndex === index
 ? "border-primary ring-4 ring-primary/20 scale-100 opacity-100"
 : "border-border/30 opacity-60 hover:opacity-90 hover:border-primary/50 hover:scale-105"
 )}
 >
 <Image
 src={image}
 alt={`${productName} - Thumbnail ${index + 1}`}
 fill
 className="object-cover object-center"
 sizes="80px"
 />

 {/* Active Indicator */}
 {selectedIndex === index && (
 <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
 )}
 </button>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Lightbox Modal */}
 {isLightboxOpen && (
 <div
 className={cn(
 "fixed inset-0 z-[100] flex items-center justify-center",
          "bg-foreground/95 dark:bg-black/95 backdrop-blur-md",
 "animate-in fade-in duration-300"
 )}
 onClick={() => setIsLightboxOpen(false)}
 >
 {/* Close Button */}
 <Button
 variant="ghost"
 size="icon"
 className={cn(
 "absolute top-4 right-4 z-10 h-12 w-12 rounded-full",
 "bg-white/10 backdrop-blur-sm text-foreground dark:text-white hover:bg-white/20",
 "transition-all duration-300 hover:scale-110"
 )}
 onClick={() => setIsLightboxOpen(false)}
 >
 <X className="w-6 h-6" />
 </Button>

 {/* Navigation Arrows */}
 {displayImages.length > 1 && (
 <>
 <Button
 variant="ghost"
 size="icon"
 className={cn(
 "absolute left-4 top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-full",
 "bg-white/10 backdrop-blur-sm text-foreground dark:text-white hover:bg-white/20",
 "transition-all duration-300 hover:scale-110"
 )}
 onClick={(e) => {
 e.stopPropagation();
 handlePrevious();
 }}
 >
 <ChevronLeft className="w-7 h-7" />
 </Button>
 <Button
 variant="ghost"
 size="icon"
 className={cn(
 "absolute right-4 top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-full",
 "bg-white/10 backdrop-blur-sm text-foreground dark:text-white hover:bg-white/20",
 "transition-all duration-300 hover:scale-110"
 )}
 onClick={(e) => {
 e.stopPropagation();
 handleNext();
 }}
 >
 <ChevronRight className="w-7 h-7" />
 </Button>
 </>
 )}

 {/* Main Image */}
 <div
 className="relative w-full h-full max-w-5xl max-h-[85vh] m-8"
 onClick={(e) => e.stopPropagation()}
 >
 <WatermarkedImage
 src={displayImages[selectedIndex]}
 alt={`${productName} - Image ${selectedIndex + 1}`}
 fill
 className="object-contain"
 sizes="100vw"
 priority
 logoSize="lg"
 />
 </div>

 {/* Image Counter */}
 <div className={cn(
 "absolute bottom-6 left-1/2 -translate-x-1/2",
 "px-4 py-2 rounded-full",
 "bg-white/10 backdrop-blur-sm text-foreground dark:text-white text-sm font-medium"
 )}>
 {selectedIndex + 1} / {displayImages.length}
 </div>

 {/* Thumbnail Row in Lightbox */}
 {displayImages.length > 1 && (
 <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-xl overflow-x-auto p-2">
 {displayImages.map((image, index) => (
 <button
 key={index}
 onClick={(e) => {
 e.stopPropagation();
 setSelectedIndex(index);
 }}
 className={cn(
 "relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg",
 "border-2 transition-all duration-200",
 selectedIndex === index
 ? "border-white ring-2 ring-white/20"
 : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/50"
 )}
 >
 <Image
 src={image}
 alt={`Thumbnail ${index + 1}`}
 fill
 className="object-cover"
 sizes="56px"
 />
 </button>
 ))}
 </div>
 )}
 </div>
 )}
 </>
 );
}
