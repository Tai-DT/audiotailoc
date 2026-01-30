import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { resolveBackendImageUrl } from "@/lib/utils/image-url"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '/images/logo/logo-dark.svg';

  const trimmed = url.trim();
  if (!trimmed) return '/images/logo/logo-dark.svg';

  // If stored as JSON string (array/object), extract the first URL.
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        const first = parsed[0] as unknown;
        if (typeof first === 'string') return resolveBackendImageUrl(first);
        if (first && typeof first === 'object' && typeof (first as { url?: string }).url === 'string') {
          return resolveBackendImageUrl((first as { url: string }).url);
        }
      }
      if (parsed && typeof parsed === 'object' && typeof (parsed as { url?: string }).url === 'string') {
        return resolveBackendImageUrl((parsed as { url: string }).url);
      }
    } catch {
      // fall through to regular handling
    }
  }

  if (trimmed.startsWith('http') || trimmed.startsWith('data:') || trimmed.startsWith('/images/')) {
    return trimmed;
  }

  return resolveBackendImageUrl(trimmed);
}
