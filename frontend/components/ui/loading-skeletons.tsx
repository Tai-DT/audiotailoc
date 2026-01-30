'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// ==================== SECTION SKELETON ====================
interface SectionSkeletonProps {
 className?: string;
 columns?: 2 | 3 | 4;
 rows?: number;
 showHeader?: boolean;
 headerWidth?: string;
 cardHeight?: string;
 /** Custom aria-label for screen readers */
 ariaLabel?: string;
}

export function SectionSkeleton({
 className,
 columns = 4,
 rows = 1,
 showHeader = true,
 headerWidth = 'w-48',
 cardHeight = 'h-48',
 ariaLabel = 'Đang tải nội dung',
}: SectionSkeletonProps) {
 const gridCols = {
 2: 'grid-cols-1 sm:grid-cols-2',
 3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
 4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
 };

 const totalCards = columns * rows;

 return (
 <div
 className={cn('py-12 px-4', className)}
 role="status"
 aria-label={ariaLabel}
 >
 <div className="container mx-auto">
 <div className="animate-pulse" aria-hidden="true">
 {showHeader && (
 <Skeleton className={cn('h-8 rounded mb-6', headerWidth)} />
 )}
 <div className={cn('grid gap-4', gridCols[columns])}>
 {Array.from({ length: totalCards }).map((_, i) => (
 <Skeleton key={i} className={cn('rounded', cardHeight)} />
 ))}
 </div>
 </div>
 </div>
 <span className="sr-only">{ariaLabel}...</span>
 </div>
 );
}

// ==================== PRODUCT CARD SKELETON ====================
interface ProductCardSkeletonProps {
 className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
 return (
 <div
 className={cn(
 'rounded-xl border bg-card/80 backdrop-blur-sm overflow-hidden',
 className
 )}
 role="status"
 aria-label="Đang tải sản phẩm"
 >
 <div className="animate-pulse">
 {/* Image placeholder */}
 <Skeleton className="aspect-square w-full" />
 {/* Content */}
 <div className="p-4 space-y-3">
 {/* Category */}
 <Skeleton className="h-4 w-20" />
 {/* Title */}
 <Skeleton className="h-5 w-full" />
 <Skeleton className="h-5 w-3/4" />
 {/* Price */}
 <div className="flex items-center gap-2">
 <Skeleton className="h-6 w-24" />
 <Skeleton className="h-4 w-16" />
 </div>
 {/* Rating */}
 <div className="flex items-center gap-1">
 {Array.from({ length: 5 }).map((_, i) => (
 <Skeleton key={i} className="h-4 w-4 rounded" />
 ))}
 <Skeleton className="h-4 w-8 ml-1" />
 </div>
 </div>
 </div>
 <span className="sr-only">Đang tải sản phẩm...</span>
 </div>
 );
}

// ==================== PRODUCT GRID SKELETON ====================
interface ProductGridSkeletonProps {
 count?: number;
 columns?: 2 | 3 | 4;
 className?: string;
}

export function ProductGridSkeleton({
 count = 8,
 columns = 4,
 className,
}: ProductGridSkeletonProps) {
 const gridCols = {
 2: 'grid-cols-1 sm:grid-cols-2',
 3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
 4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
 };

 return (
 <div
 className={cn('grid gap-4 md:gap-6', gridCols[columns], className)}
 role="status"
 aria-label="Đang tải danh sách sản phẩm"
 >
 {Array.from({ length: count }).map((_, i) => (
 <ProductCardSkeleton key={i} />
 ))}
 <span className="sr-only">Đang tải danh sách sản phẩm...</span>
 </div>
 );
}

// ==================== BANNER SKELETON ====================
interface BannerSkeletonProps {
 className?: string;
}

export function BannerSkeleton({ className }: BannerSkeletonProps) {
 return (
 <section
 className={cn(
 'relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5',
 className
 )}
 role="status"
 aria-label="Đang tải banner"
 >
 <div className="container mx-auto px-4 py-20 lg:py-32">
 <div className="grid lg:grid-cols-2 gap-12 items-center">
 <div className="space-y-6 animate-pulse">
 {/* Badge */}
 <Skeleton className="h-6 w-40 rounded-full" />
 {/* Title */}
 <Skeleton className="h-16 w-full max-w-xl rounded" />
 {/* Description */}
 <Skeleton className="h-12 w-full max-w-2xl rounded" />
 {/* Buttons */}
 <div className="flex gap-4">
 <Skeleton className="h-12 w-40 rounded-lg" />
 <Skeleton className="h-12 w-32 rounded-lg" />
 </div>
 {/* Stats */}
 <div className="grid grid-cols-3 gap-8 pt-8">
 {Array.from({ length: 3 }).map((_, i) => (
 <Skeleton key={i} className="h-20 rounded-xl" />
 ))}
 </div>
 </div>
 {/* Image placeholder */}
 <Skeleton className="h-[320px] lg:h-[400px] w-full rounded-2xl" />
 </div>
 </div>
 <span className="sr-only">Đang tải banner...</span>
 </section>
 );
}

// ==================== SERVICE CARD SKELETON ====================
interface ServiceCardSkeletonProps {
 className?: string;
}

export function ServiceCardSkeleton({ className }: ServiceCardSkeletonProps) {
 return (
 <div
 className={cn(
 'rounded-xl border bg-card/80 backdrop-blur-sm p-6',
 className
 )}
 role="status"
 aria-label="Đang tải dịch vụ"
 >
 <div className="animate-pulse space-y-4">
 {/* Icon */}
 <Skeleton className="h-12 w-12 rounded-lg" />
 {/* Title */}
 <Skeleton className="h-6 w-3/4" />
 {/* Description */}
 <div className="space-y-2">
 <Skeleton className="h-4 w-full" />
 <Skeleton className="h-4 w-5/6" />
 </div>
 {/* Price */}
 <Skeleton className="h-5 w-28" />
 {/* Button */}
 <Skeleton className="h-10 w-full rounded-lg" />
 </div>
 <span className="sr-only">Đang tải dịch vụ...</span>
 </div>
 );
}

// ==================== TABLE SKELETON ====================
interface TableSkeletonProps {
 rows?: number;
 columns?: number;
 className?: string;
}

export function TableSkeleton({
 rows = 5,
 columns = 5,
 className,
}: TableSkeletonProps) {
 return (
 <div
 className={cn('rounded-lg border overflow-hidden', className)}
 role="status"
 aria-label="Đang tải dữ liệu bảng"
 >
 <div className="animate-pulse">
 {/* Header */}
 <div className="flex bg-muted/50 p-4 gap-4">
 {Array.from({ length: columns }).map((_, i) => (
 <Skeleton key={i} className="h-4 flex-1" />
 ))}
 </div>
 {/* Rows */}
 {Array.from({ length: rows }).map((_, rowIndex) => (
 <div
 key={rowIndex}
 className="flex p-4 gap-4 border-t border-border"
 >
 {Array.from({ length: columns }).map((_, colIndex) => (
 <Skeleton key={colIndex} className="h-4 flex-1" />
 ))}
 </div>
 ))}
 </div>
 <span className="sr-only">Đang tải dữ liệu...</span>
 </div>
 );
}

// ==================== TEXT SKELETON ====================
interface TextSkeletonProps {
 lines?: number;
 className?: string;
 lastLineWidth?: string;
}

export function TextSkeleton({
 lines = 3,
 className,
 lastLineWidth = 'w-3/4',
}: TextSkeletonProps) {
 return (
 <div
 className={cn('space-y-2 animate-pulse', className)}
 role="status"
 aria-label="Đang tải văn bản"
 >
 {Array.from({ length: lines }).map((_, i) => (
 <Skeleton
 key={i}
 className={cn(
 'h-4',
 i === lines - 1 ? lastLineWidth : 'w-full'
 )}
 />
 ))}
 <span className="sr-only">Đang tải...</span>
 </div>
 );
}

// ==================== PROFILE SKELETON ====================
export function ProfileSkeleton() {
 return (
 <div
 className="space-y-6 animate-pulse"
 role="status"
 aria-label="Đang tải thông tin hồ sơ"
 >
 <div className="flex items-center gap-4">
 {/* Avatar */}
 <Skeleton className="h-20 w-20 rounded-full" />
 <div className="space-y-2 flex-1">
 {/* Name */}
 <Skeleton className="h-6 w-48" />
 {/* Email */}
 <Skeleton className="h-4 w-64" />
 </div>
 </div>
 {/* Details */}
 <div className="grid gap-4 md:grid-cols-2">
 {Array.from({ length: 4 }).map((_, i) => (
 <div key={i} className="space-y-2">
 <Skeleton className="h-4 w-24" />
 <Skeleton className="h-10 w-full rounded-lg" />
 </div>
 ))}
 </div>
 <span className="sr-only">Đang tải thông tin...</span>
 </div>
 );
}

const LoadingSkeletons = {
 Section: SectionSkeleton,
 ProductCard: ProductCardSkeleton,
 ProductGrid: ProductGridSkeleton,
 Banner: BannerSkeleton,
 ServiceCard: ServiceCardSkeleton,
 Table: TableSkeleton,
 Text: TextSkeleton,
 Profile: ProfileSkeleton,
};

export default LoadingSkeletons;
