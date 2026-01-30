/**
 * Unit tests for slug utility functions
 */
import { generateSlug, isValidSlug, isUUID, isCUID, isId, extractTrailingId } from '@/lib/utils/slug-utils';

describe('generateSlug', () => {
  it('should convert text to slug format', () => {
    const result = generateSlug('Hello World');
    expect(result).toBe('hello-world');
  });

  it('should handle Vietnamese characters', () => {
    const result = generateSlug('Xin chào Việt Nam');
    expect(result).toBe('xin-chao-viet-nam');
  });

  it('should remove special characters', () => {
    const result = generateSlug('Hello! World? Test.');
    expect(result).not.toContain('!');
    expect(result).not.toContain('?');
    expect(result).not.toContain('.');
  });

  it('should handle multiple spaces', () => {
    const result = generateSlug('Hello   World');
    expect(result).toBe('hello-world');
  });

  it('should handle empty string', () => {
    const result = generateSlug('');
    expect(result).toBe('');
  });

  it('should trim leading and trailing spaces', () => {
    const result = generateSlug('  Hello World  ');
    expect(result).toBe('hello-world');
  });
});

describe('isValidSlug', () => {
  it('should return true for valid slugs', () => {
    expect(isValidSlug('hello-world')).toBe(true);
    expect(isValidSlug('test123')).toBe(true);
    expect(isValidSlug('product-name-123')).toBe(true);
  });

  it('should return false for invalid slugs', () => {
    expect(isValidSlug('Hello World')).toBe(false);
    expect(isValidSlug('test!')).toBe(false);
    expect(isValidSlug('ab')).toBe(false); // too short
  });
});

describe('isUUID', () => {
  it('should detect valid UUIDs', () => {
    expect(isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('should reject invalid UUIDs', () => {
    expect(isUUID('not-a-uuid')).toBe(false);
    expect(isUUID('12345')).toBe(false);
  });
});

describe('isCUID', () => {
  it('should detect valid CUIDs', () => {
    expect(isCUID('cjld2cjxh0000qzrmn831i7rn')).toBe(true);
  });

  it('should reject invalid CUIDs', () => {
    expect(isCUID('not-a-cuid')).toBe(false);
    expect(isCUID('12345')).toBe(false);
  });
});

describe('isId', () => {
  it('should detect both UUID and CUID', () => {
    expect(isId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    expect(isId('cjld2cjxh0000qzrmn831i7rn')).toBe(true);
  });

  it('should reject non-IDs', () => {
    expect(isId('hello-world')).toBe(false);
  });
});

describe('extractTrailingId', () => {
  it('should extract trailing CUID from slug', () => {
    const result = extractTrailingId('product-name-cjld2cjxh0000qzrmn831i7rn');
    expect(result).toBe('cjld2cjxh0000qzrmn831i7rn');
  });

  it('should return null for slugs without trailing ID', () => {
    expect(extractTrailingId('simple-slug')).toBeNull();
  });
});
