/**
 * Unit tests for API configuration
 */
import { API_CONFIG, buildApiUrl, buildBackendUrl } from '@/lib/api-config';

describe('API_CONFIG', () => {
  it('should have a baseUrl property', () => {
    expect(API_CONFIG.baseUrl).toBeDefined();
    expect(typeof API_CONFIG.baseUrl).toBe('string');
  });

  it('should have a backendUrl property', () => {
    expect(API_CONFIG.backendUrl).toBeDefined();
    expect(typeof API_CONFIG.backendUrl).toBe('string');
  });

  it('backendUrl should not contain /api/v1', () => {
    expect(API_CONFIG.backendUrl).not.toContain('/api/v1');
  });
});

describe('buildApiUrl', () => {
  it('should build full URL from endpoint', () => {
    const result = buildApiUrl('/products');
    expect(result).toContain('/products');
    // In browser/jsdom we use a relative base path to leverage Next.js rewrites.
    expect(result).toContain('/api/v1');
  });

  it('should handle endpoints with leading slash', () => {
    const result = buildApiUrl('/auth/login');
    expect(result).toContain('/auth/login');
  });

  it('should handle endpoints without leading slash', () => {
    const result = buildApiUrl('products');
    expect(result).toContain('/products');
  });
});

describe('buildBackendUrl', () => {
  it('should build backend URL without /api/v1', () => {
    const result = buildBackendUrl('/socket.io');
    expect(result).toContain('/socket.io');
  });
});
