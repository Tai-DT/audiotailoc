/**
 * Unit tests for utility functions
 */
import { sanitizeProseHtml } from '@/lib/utils/sanitize';

describe('sanitizeProseHtml', () => {
  it('should allow safe HTML tags', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    const result = sanitizeProseHtml(input);
    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
  });

  it('should remove script tags', () => {
    const input = '<p>Hello</p><script>alert("xss")</script>';
    const result = sanitizeProseHtml(input);
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should remove onclick handlers', () => {
    const input = '<p onclick="alert(1)">Click me</p>';
    const result = sanitizeProseHtml(input);
    expect(result).not.toContain('onclick');
  });

  it('should allow links with href', () => {
    const input = '<a href="https://example.com">Link</a>';
    const result = sanitizeProseHtml(input);
    expect(result).toContain('href');
    expect(result).toContain('https://example.com');
  });

  it('should handle empty input', () => {
    expect(sanitizeProseHtml('')).toBe('');
  });

  it('should handle images with src and alt', () => {
    const input = '<img src="image.jpg" alt="Test image">';
    const result = sanitizeProseHtml(input);
    expect(result).toContain('src');
    expect(result).toContain('alt');
  });
});
