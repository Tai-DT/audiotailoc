export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
  };
}

/**
 * Create paginated response
 */
export function createPaginationResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
): PaginationResponse<T> {
  return {
    data,
    meta: calculatePaginationMeta(page, limit, total),
  };
}

/**
 * Get skip value for database query
 */
export function getSkipValue(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page: number, limit: number): {
  page: number;
  limit: number;
} {
  const validPage = Math.max(1, Math.floor(page) || 1);
  const validLimit = Math.min(100, Math.max(1, Math.floor(limit) || 10));
  
  return {
    page: validPage,
    limit: validLimit,
  };
}
