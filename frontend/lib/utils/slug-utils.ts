/**
 * Utility functions for handling slug-based routing and ID resolution
 * Provides smart detection and fallback mechanisms for ID vs Slug patterns
 */

// Pattern matching for different ID types
export const ID_PATTERNS = {
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  CUID: /^c[a-z0-9]{15,}$/i,
  TRAILING_ID: /(c[a-z0-9]{15,})$/i,
} as const;

/**
 * Determines if a string is a UUID
 */
export function isUUID(value: string): boolean {
  return ID_PATTERNS.UUID.test(value);
}

/**
 * Determines if a string is a CUID
 */
export function isCUID(value: string): boolean {
  return ID_PATTERNS.CUID.test(value);
}

/**
 * Determines if a string is an ID (UUID or CUID)
 */
export function isId(value: string): boolean {
  return isUUID(value) || isCUID(value);
}

/**
 * Extracts trailing ID from a slug-with-id pattern like "product-name-cmg4t1xtc006vitfly0sjzja1"
 */
export function extractTrailingId(value: string): string | null {
  const match = value.match(ID_PATTERNS.TRAILING_ID);
  return match ? match[1] : null;
}

/**
 * Determines the best strategy for resolving an identifier (ID or slug)
 */
export function getResolutionStrategy(idOrSlug: string): {
  type: 'id' | 'slug';
  value: string;
  fallbackId?: string;
} {
  if (!idOrSlug) {
    throw new Error('Missing identifier');
  }

  // Check if it's a direct ID
  if (isId(idOrSlug)) {
    return { type: 'id', value: idOrSlug };
  }

  // Check for trailing ID pattern
  const trailingId = extractTrailingId(idOrSlug);
  if (trailingId) {
    return {
      type: 'slug',
      value: idOrSlug,
      fallbackId: trailingId,
    };
  }

  // Default to slug
  return { type: 'slug', value: idOrSlug };
}

/**
 * Generic resolver function for API calls with slug/ID fallback
 */
export async function resolveEntityWithFallback<T>(
  idOrSlug: string,
  detailFn: (id: string) => Promise<T>,
  slugFn: (slug: string) => Promise<T>
): Promise<T> {
  const strategy = getResolutionStrategy(idOrSlug);

  try {
    if (strategy.type === 'id') {
      return await detailFn(strategy.value);
    }

    // Try slug first
    try {
      return await slugFn(strategy.value);
    } catch (err: unknown) {
      const status = typeof err === 'object' && err !== null && 'response' in err
        ? (err as { response?: { status?: number } }).response?.status
        : undefined;

      // If 404 and we have a fallback ID, try the ID endpoint
      if (status === 404 && strategy.fallbackId) {
        return await detailFn(strategy.fallbackId);
      }

      throw err;
    }
  } catch (error) {
    // Final fallback: if we originally tried slug but have a fallback ID
    if (strategy.type === 'slug' && strategy.fallbackId) {
      try {
        return await detailFn(strategy.fallbackId);
      } catch {
        throw error; // Throw original error
      }
    }
    throw error;
  }
}

/**
 * Generates a URL-friendly slug from a name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD') // Decompose Unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validates if a slug is properly formatted
 */
export function isValidSlug(slug: string): boolean {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugPattern.test(slug) && slug.length >= 3 && slug.length <= 100;
}

/**
 * Creates a unique slug by appending a suffix if needed
 */
export function createUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
}

/**
 * Type-safe API endpoint builders
 */
export const createApiEndpoints = (basePath: string) => ({
  list: () => basePath,
  detail: (id: string) => `${basePath}/${id}`,
  detailBySlug: (slug: string) => `${basePath}/slug/${slug}`,
  create: () => basePath,
  update: (id: string) => `${basePath}/${id}`,
  delete: (id: string) => `${basePath}/${id}`,
});

/**
 * Builds query parameters for API calls
 */
export function buildQueryParams(params: Record<string, unknown>): URLSearchParams {
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'boolean') {
        query.append(key, value.toString());
      } else if (Array.isArray(value)) {
        value.forEach(item => query.append(key, item.toString()));
      } else {
        query.append(key, value.toString());
      }
    }
  });

  return query;
}

/**
 * Error helper for slug resolution
 */
export class SlugResolutionError extends Error {
  constructor(
    message: string,
    public readonly originalError?: Error,
    public readonly attemptedSlug?: string,
    public readonly attemptedId?: string
  ) {
    super(message);
    this.name = 'SlugResolutionError';
  }
}