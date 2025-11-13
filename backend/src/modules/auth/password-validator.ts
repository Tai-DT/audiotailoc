/**
 * Password Policy Validator
 * Enforces strong password requirements
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export class PasswordValidator {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 128;

  /**
   * Validate password against policy requirements
   */
  static validate(password: string): PasswordValidationResult {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    // Check minimum length
    if (password.length < this.MIN_LENGTH) {
      errors.push(`Password must be at least ${this.MIN_LENGTH} characters long`);
    }

    // Check maximum length
    if (password.length > this.MAX_LENGTH) {
      errors.push(`Password must not exceed ${this.MAX_LENGTH} characters`);
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)');
    }

    // Check for common weak passwords
    const weakPasswords = [
      'password', 'password123', '12345678', 'qwerty', 'abc123',
      'password1', '123456789', 'letmein', 'welcome', 'admin123'
    ];
    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common. Please choose a stronger password');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get password strength score (0-100)
   */
  static getStrength(password: string): number {
    if (!password) return 0;

    let score = 0;

    // Length bonus
    score += Math.min(password.length * 4, 40);

    // Character variety bonus
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/\d/.test(password)) score += 10;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;

    // Penalty for sequential characters
    if (/(.)\1{2,}/.test(password)) score -= 10;
    if (/abc|bcd|cde|123|234|345/.test(password.toLowerCase())) score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get human-readable strength description
   */
  static getStrengthLabel(password: string): string {
    const strength = this.getStrength(password);

    if (strength < 30) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 70) return 'Fair';
    if (strength < 90) return 'Strong';
    return 'Very Strong';
  }
}
