'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { apiClient, API_ENDPOINTS, handleApiResponse } from '@/lib/api';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

// ==================== OPTIMIZED IMAGE ====================
// A wrapper around next/image with loading states and error handling

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'onLoadingComplete' | 'onError'> {
 src?: ImageProps['src'];
 /** Optional fileId to request signed URL from backend */
 fileId?: string;
 /** Fallback image when loading fails */
 fallbackSrc?: string;
 /** Show skeleton shimmer while loading */
 showSkeleton?: boolean;
 /** Aspect ratio for container */
 aspectRatio?: 'square' | 'video' | '4:3' | '3:2' | 'auto';
 /** Optional blur data URL for placeholder */
 blurDataURL?: string;
 /** Callback when image loads */
 onLoad?: () => void;
 /** Callback when image fails to load */
 onError?: () => void;
}

// SVG shimmer placeholder
const shimmerPlaceholder = `
<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
 <defs>
 <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" style="stop-color:#f0f0f0">
 <animate attributeName="offset" values="-2; 1" dur="2s" repeatCount="indefinite"/>
 </stop>
 <stop offset="50%" style="stop-color:#e0e0e0">
 <animate attributeName="offset" values="-1; 2" dur="2s" repeatCount="indefinite"/>
 </stop>
 <stop offset="100%" style="stop-color:#f0f0f0">
 <animate attributeName="offset" values="0; 3" dur="2s" repeatCount="indefinite"/>
 </stop>
 </linearGradient>
 </defs>
 <rect width="100%" height="100%" fill="url(#shimmer)"/>
</svg>
`;

const toBase64 = (str: string) =>
 typeof window === 'undefined'
 ? Buffer.from(str).toString('base64')
 : window.btoa(str);

const shimmerBase64 = `data:image/svg+xml;base64,${toBase64(shimmerPlaceholder)}`;

// Default placeholder for products
const DEFAULT_PRODUCT_FALLBACK = '/placeholder-product.svg';
const DEFAULT_SERVICE_FALLBACK = '/placeholder-service.svg';
const DEFAULT_PROJECT_FALLBACK = '/projects/placeholder-project.svg';

export function OptimizedImage({
 src,
 fileId,
 alt,
 fallbackSrc = DEFAULT_PRODUCT_FALLBACK,
 showSkeleton = true,
 aspectRatio = 'auto',
 className,
 blurDataURL,
 onLoad,
 onError,
 ...props
}: OptimizedImageProps) {
 const [isLoading, setIsLoading] = useState(true);
 const [hasError, setHasError] = useState(false);
 const [imgSrc, setImgSrc] = useState<ImageProps['src']>(src || fallbackSrc);
 const [retryCount, setRetryCount] = useState(0);

 useEffect(() => {
 let mounted = true;
 const fetchSigned = async () => {
 if (fileId) {
 try {
 const res = await apiClient.get(API_ENDPOINTS.FILES.SIGN(fileId));
 const data = handleApiResponse<{ url: string; expiresAt?: string }>(res);
 if (mounted) {
 setImgSrc(data.url || fallbackSrc);
 setHasError(false);
 }
 } catch {
 if (mounted) {
 setHasError(true);
 setImgSrc(fallbackSrc);
 }
 }
 return;
 }

 if (typeof src === 'string' && src.startsWith('/uploads/')) {
 try {
 const res = await apiClient.get(API_ENDPOINTS.FILES.SIGN_BY_URL, { params: { url: src } });
 const data = handleApiResponse<{ url: string }>(res);
 if (mounted) {
 setImgSrc(data.url || fallbackSrc);
 setHasError(false);
 }
 } catch {
 if (mounted) {
 setHasError(true);
 setImgSrc(fallbackSrc);
 }
 }
 }
 };

 fetchSigned();
 return () => {
 mounted = false;
 };
 }, [fileId, fallbackSrc, src]);

 const handleLoad = useCallback(() => {
 setIsLoading(false);
 onLoad?.();
 }, [onLoad]);

 const handleError = useCallback(async () => {
 setHasError(true);
 setIsLoading(false);
 if (fileId && retryCount < 1) {
 try {
 const res = await apiClient.get(API_ENDPOINTS.FILES.SIGN(fileId), { params: { force: 1 } });
 const data = handleApiResponse<{ url: string }>(res);
 setRetryCount(prev => prev + 1);
 setImgSrc(data.url || fallbackSrc);
 setHasError(false);
 return;
 } catch {
 // fall through to fallback
 }
 }
 if (!fileId && typeof src === 'string' && src.startsWith('/uploads/') && retryCount < 1) {
 try {
 const res = await apiClient.get(API_ENDPOINTS.FILES.SIGN_BY_URL, { params: { url: src, force: 1 } });
 const data = handleApiResponse<{ url: string }>(res);
 setRetryCount(prev => prev + 1);
 setImgSrc(data.url || fallbackSrc);
 setHasError(false);
 return;
 } catch {
 // fall through
 }
 }
 setImgSrc(fallbackSrc);
 onError?.();
 }, [fallbackSrc, onError, fileId, retryCount, src]);

 const aspectRatioClasses = {
 square: 'aspect-square',
 video: 'aspect-video',
 '4:3': 'aspect-[4/3]',
 '3:2': 'aspect-[3/2]',
 auto: '',
 };

 return (
 <div
 className={cn(
 'relative overflow-hidden',
 aspectRatioClasses[aspectRatio],
 isLoading && showSkeleton && 'bg-muted animate-pulse',
 className
 )}
 >
 <Image
 src={hasError ? fallbackSrc : (imgSrc || fallbackSrc)}
 alt={alt}
 className={cn(
 'transition-opacity duration-300',
 isLoading ? 'opacity-0' : 'opacity-100'
 )}
 placeholder={blurDataURL ? 'blur' : 'empty'}
 blurDataURL={blurDataURL || shimmerBase64}
 onLoad={handleLoad}
 onError={handleError}
 {...props}
 />
 </div>
 );
}

// ==================== PRODUCT IMAGE ====================
// Specialized image for products with proper fallback

interface ProductImageProps extends Omit<OptimizedImageProps, 'fallbackSrc'> {
 productName?: string;
}

export function ProductImage({
 alt,
 productName,
 ...props
}: ProductImageProps) {
 return (
 <OptimizedImage
 alt={productName ? `Hình ảnh sản phẩm: ${productName}` : alt}
 fallbackSrc={DEFAULT_PRODUCT_FALLBACK}
 {...props}
 />
 );
}

// ==================== SERVICE IMAGE ====================
// Specialized image for services

interface ServiceImageProps extends Omit<OptimizedImageProps, 'fallbackSrc'> {
 serviceName?: string;
}

export function ServiceImage({
 alt,
 serviceName,
 ...props
}: ServiceImageProps) {
 return (
 <OptimizedImage
 alt={serviceName ? `Hình ảnh dịch vụ: ${serviceName}` : alt}
 fallbackSrc={DEFAULT_SERVICE_FALLBACK}
 {...props}
 />
 );
}

// ==================== PROJECT IMAGE ====================
// Specialized image for projects

interface ProjectImageProps extends Omit<OptimizedImageProps, 'fallbackSrc'> {
 projectName?: string;
}

export function ProjectImage({
 alt,
 projectName,
 ...props
}: ProjectImageProps) {
 return (
 <OptimizedImage
 alt={projectName ? `Hình ảnh dự án: ${projectName}` : alt}
 fallbackSrc={DEFAULT_PROJECT_FALLBACK}
 {...props}
 />
 );
}

// ==================== AVATAR IMAGE ====================
// Specialized image for avatars with circular styling

interface AvatarImageProps extends Omit<OptimizedImageProps, 'aspectRatio'> {
 userName?: string;
 size?: 'sm' | 'md' | 'lg' | 'xl';
}

const avatarSizes = {
 sm: 'h-8 w-8',
 md: 'h-10 w-10',
 lg: 'h-16 w-16',
 xl: 'h-24 w-24',
};

export function AvatarImage({
 alt,
 userName,
 size = 'md',
 className,
 ...props
}: AvatarImageProps) {
 return (
 <div className={cn('relative rounded-full overflow-hidden', avatarSizes[size], className)}>
 <OptimizedImage
 alt={userName ? `Ảnh đại diện của ${userName}` : alt}
 fallbackSrc="/placeholder-avatar.svg"
 aspectRatio="square"
 className="rounded-full"
 {...props}
 />
 </div>
 );
}

export default OptimizedImage;
