/**
 * Unit tests for cn utility function
 */
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('class1', 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should handle undefined values', () => {
    const result = cn('class1', undefined, 'class2');
    expect(result).toBe('class1 class2');
  });

  it('should handle boolean conditions', () => {
    const result = cn('base', true && 'active', false && 'inactive');
    expect(result).toContain('base');
    expect(result).toContain('active');
    expect(result).not.toContain('inactive');
  });

  it('should handle empty strings', () => {
    const result = cn('class1', '', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('should merge tailwind classes correctly', () => {
    const result = cn('p-4', 'p-8');
    // tailwind-merge should resolve conflict
    expect(result).toContain('p-8');
  });

  it('should handle object syntax', () => {
    const result = cn({ 'bg-red-500': true, 'bg-blue-500': false });
    expect(result).toContain('bg-red-500');
    expect(result).not.toContain('bg-blue-500');
  });

  it('should handle arrays', () => {
    const result = cn(['class1', 'class2']);
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should return empty string for no input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle null values', () => {
    const result = cn('class1', null, 'class2');
    expect(result).toBe('class1 class2');
  });
});
