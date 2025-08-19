/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (Vietnamese)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate Vietnamese ID card number
 */
export function isValidVietnamIdCard(idCard: string): boolean {
  const idCardRegex = /^[0-9]{9,12}$/;
  return idCardRegex.test(idCard);
}

/**
 * Validate Vietnamese tax code
 */
export function isValidVietnamTaxCode(taxCode: string): boolean {
  const taxCodeRegex = /^[0-9]{10,13}$/;
  return taxCodeRegex.test(taxCode);
}

/**
 * Validate Vietnamese postal code
 */
export function isValidVietnamPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^[0-9]{5,6}$/;
  return postalCodeRegex.test(postalCode);
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Validate and format Vietnamese phone number
 */
export function formatVietnamesePhone(phone: string): string | null {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid Vietnamese phone number
  if (!isValidPhoneNumber(cleaned)) {
    return null;
  }
  
  // Format to standard format (+84)
  if (cleaned.startsWith('84')) {
    return `+${cleaned}`;
  }
  
  if (cleaned.startsWith('0')) {
    return `+84${cleaned.substring(1)}`;
  }
  
  return `+84${cleaned}`;
}

/**
 * Validate file size
 */
export function isValidFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize;
}

/**
 * Validate file type
 */
export function isValidFileType(
  filename: string,
  allowedTypes: string[],
): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
}

/**
 * Validate image dimensions
 */
export function isValidImageDimensions(
  width: number,
  height: number,
  minWidth: number,
  minHeight: number,
  maxWidth?: number,
  maxHeight?: number,
): boolean {
  if (width < minWidth || height < minHeight) {
    return false;
  }
  
  if (maxWidth && width > maxWidth) {
    return false;
  }
  
  if (maxHeight && height > maxHeight) {
    return false;
  }
  
  return true;
}
