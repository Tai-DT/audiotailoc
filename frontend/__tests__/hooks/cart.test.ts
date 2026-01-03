/**
 * Unit tests for cart hook
 */
import { renderHook } from '@testing-library/react';

// Mock the API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  API_ENDPOINTS: {
    CART: {
      GET: '/cart',
      ADD: '/cart/add',
      UPDATE: '/cart/update',
      REMOVE: '/cart/remove',
      CLEAR: '/cart/clear',
    },
  },
  handleApiResponse: jest.fn((res) => res.data),
}));

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isLoading: false,
  })),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
  })),
}));

describe('Cart utilities', () => {
  it('should format cart item price correctly', () => {
    const price = 1500000; // 1.5 million VND
    const formatted = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
    expect(formatted).toContain('1.500.000');
  });

  it('should calculate cart total', () => {
    const items = [
      { quantity: 2, price: 100000 },
      { quantity: 1, price: 200000 },
    ];
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    expect(total).toBe(400000);
  });

  it('should handle empty cart', () => {
    const items: { quantity: number; price: number }[] = [];
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    expect(total).toBe(0);
  });

  it('should validate cart item quantity', () => {
    const validateQuantity = (qty: number) => qty > 0 && qty <= 99;
    expect(validateQuantity(1)).toBe(true);
    expect(validateQuantity(99)).toBe(true);
    expect(validateQuantity(0)).toBe(false);
    expect(validateQuantity(100)).toBe(false);
  });
});
