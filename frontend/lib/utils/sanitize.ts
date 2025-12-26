import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses DOMPurify for client-side sanitization
 * 
 * @param html - HTML string to sanitize
 * @param options - Optional DOMPurify configuration
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(
  html: string,
  options?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
  }
): string {
  if (!html) return '';

  // Default allowed tags for rich text content
  const defaultAllowedTags = [
    'p', 'br', 'strong', 'em', 'u', 's', 'strike',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'img',
    'blockquote', 'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span',
    'hr'
  ];

  // Default allowed attributes
  const defaultAllowedAttributes: Record<string, string[]> = {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'class'],
    '*': ['class', 'id']
  };

  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: options?.allowedTags || defaultAllowedTags,
      ALLOWED_ATTR: options?.allowedAttributes
        ? Object.values(options.allowedAttributes).flat()
        : Object.values(defaultAllowedAttributes).flat(),
      ALLOW_DATA_ATTR: false,
      ALLOW_ARIA_ATTR: true,
      // Prevent XSS via data URIs in images
      FORBID_ATTR: ['onerror', 'onload', 'onclick'],
      // Remove dangerous protocols
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
  }

  // Server-side fallback (Next.js SSR)
  // Basic sanitization using regex - more robust than before but still limited
  return html
    .replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, '')
    .replace(/<iframe[^>]*>([\S\s]*?)<\/iframe>/gim, '')
    .replace(/<object[^>]*>([\S\s]*?)<\/object>/gim, '')
    .replace(/<embed[^>]*>/gim, '')
    .replace(/<form[^>]*>([\S\s]*?)<\/form>/gim, '')
    .replace(/<link[^>]*>/gim, '')
    .replace(/<meta[^>]*>/gim, '')
    .replace(/<style[^>]*>([\S\s]*?)<\/style>/gim, '')
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gim, '')
    .replace(/\s*on\w+\s*=\s*[^\s>]*/gim, '')
    .replace(/javascript:/gim, '')
    .replace(/data:text\/html/gim, '')
    .replace(/data:application\/javascript/gim, '')
    .replace(/<[^>]+(src|href)\s*=\s*['"]\s*javascript:[^'"]*['"][^>]*>/gim, '');
}

/**
 * Sanitize HTML for display in prose/content areas
 * More permissive than default sanitizeHtml
 */
export function sanitizeProseHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'a', 'img',
      'blockquote', 'pre', 'code', 'kbd', 'samp',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
      'div', 'span', 'hr',
      'abbr', 'cite', 'q', 'sub', 'sup', 'time',
      'mark', 'del', 'ins'
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel', 'class'],
      img: ['src', 'alt', 'title', 'width', 'height', 'class', 'loading'],
      code: ['class'],
      pre: ['class'],
      '*': ['class', 'id']
    }
  });
}
