import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(cents);
}

// Backward-compatible alias used across components
export const formatCurrency = formatPrice;

/**
 * Parse images from various formats (JSON string, single URL, array, null/undefined)
 * into a normalized string array. Handles edge cases from API responses.
 */
export function parseImages(
  images: unknown,
  fallbackUrl?: string | null
): string[] {
  // Already an array
  if (Array.isArray(images)) {
    return images.filter((img): img is string => typeof img === 'string' && img.length > 0);
  }

  // JSON string → parse it
  if (typeof images === 'string' && images.trim()) {
    // Check if it looks like JSON array
    if (images.startsWith('[')) {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
          return parsed.filter((img): img is string => typeof img === 'string' && img.length > 0);
        }
      } catch {
        // Not valid JSON, treat as single URL
      }
    }
    // Single URL string
    return [images];
  }

  // Fallback to single fallbackUrl if provided
  if (fallbackUrl && typeof fallbackUrl === 'string' && fallbackUrl.trim()) {
    return [fallbackUrl];
  }

  return [];
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
