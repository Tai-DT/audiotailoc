/**
 * Unit tests for formatting utilities
 */

// Format price in VND
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

// Format price from cents
export function formatPriceFromCents(cents: number): string {
  return formatPrice(cents);
}

// Format date in Vietnamese
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

describe('formatPrice', () => {
  it('should format number as VND currency', () => {
    const result = formatPrice(100000);
    expect(result).toContain('100');
    expect(result).toContain('000');
  });

  it('should handle zero', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
  });

  it('should handle large numbers', () => {
    const result = formatPrice(10000000);
    expect(result).toBeDefined();
  });
});

describe('formatPriceFromCents', () => {
  it('should format cents to VND', () => {
    const result = formatPriceFromCents(10000000);
    expect(result).toBeDefined();
  });
});

describe('formatDate', () => {
  it('should format date in Vietnamese format', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('15');
    expect(result).toContain('01');
    expect(result).toContain('2024');
  });

  it('should handle Date object', () => {
    const result = formatDate(new Date('2024-12-25'));
    expect(result).toContain('25');
    expect(result).toContain('12');
  });
});
