import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Math.floor(cents / 100));
}

// Backward-compatible alias used across components
export const formatCurrency = formatPrice;
export const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

/**
 * Get the absolute URL for a media file.
 * Handles relative paths by prepending the backend base URL.
 */
export function getMediaUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '/placeholder-product.svg';
  const trimmed = url.trim();
  if (!trimmed) return '/placeholder-product.svg';
  if (trimmed.startsWith('http') || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;
  if (trimmed.startsWith('/placeholder-') || trimmed.startsWith('/images/logo/')) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
  const backendBase = apiUrl.replace(/\/api\/v1\/?$/, '');

  // Clean up double slashes
  if (!trimmed.includes('/')) {
    return `${backendBase}/uploads/products/${trimmed}`;
  }

  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  if (path.startsWith('/images/') || path.startsWith('/uploads/')) {
    return `${backendBase}${path}`;
  }

  return `${backendBase}${path}`;
}

/**
 * Parse images from various formats (JSON string, single URL, array, null/undefined)
 * into a normalized string array of absolute URLs.
 */
export function parseImages(
  images: unknown,
  fallbackUrl?: string | null
): string[] {
  let rawImages: string[] = [];

  // Already an array
  if (Array.isArray(images)) {
    rawImages = images.filter((img): img is string => typeof img === 'string' && img.length > 0);
  }
  // JSON string → parse it
  else if (typeof images === 'string' && images.trim()) {
    if (images.startsWith('[')) {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
          rawImages = parsed.filter((img): img is string => typeof img === 'string' && img.length > 0);
        }
      } catch {
        rawImages = [images];
      }
    } else {
      rawImages = [images];
    }
  }
  // Fallback
  else if (fallbackUrl && typeof fallbackUrl === 'string' && fallbackUrl.trim()) {
    rawImages = [fallbackUrl];
  }

  // Convert all to absolute URLs
  return rawImages.map(getMediaUrl);
}

/**
 * Format date to Vietnamese locale string
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
