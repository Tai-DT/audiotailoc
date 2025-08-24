import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from '../../src/modules/security/security.service';
import { ConfigService } from '@nestjs/config';

describe('SecurityService', () => {
  let service: SecurityService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('recordLoginAttempt', () => {
    it('should record successful login attempt', () => {
      const email = 'test@example.com';
      const success = true;

      service.recordLoginAttempt(email, success);

      expect(service.isAccountLocked(email)).toBe(false);
    });

    it('should record failed login attempt', () => {
      const email = 'test@example.com';
      const success = false;

      service.recordLoginAttempt(email, success);

      // After 1 failed attempt, account should not be locked
      expect(service.isAccountLocked(email)).toBe(false);
    });

    it('should lock account after multiple failed attempts', () => {
      const email = 'test@example.com';

      // Record 5 failed attempts
      for (let i = 0; i < 5; i++) {
        service.recordLoginAttempt(email, false);
      }

      expect(service.isAccountLocked(email)).toBe(true);
    });

    it('should reset failed attempts after successful login', () => {
      const email = 'test@example.com';

      // Record 3 failed attempts
      for (let i = 0; i < 3; i++) {
        service.recordLoginAttempt(email, false);
      }

      // Record successful login
      service.recordLoginAttempt(email, true);

      // Account should not be locked
      expect(service.isAccountLocked(email)).toBe(false);
    });
  });

  describe('isAccountLocked', () => {
    it('should return false for new email', () => {
      const email = 'new@example.com';

      expect(service.isAccountLocked(email)).toBe(false);
    });

    it('should return true for locked account', () => {
      const email = 'locked@example.com';

      // Lock the account
      for (let i = 0; i < 5; i++) {
        service.recordLoginAttempt(email, false);
      }

      expect(service.isAccountLocked(email)).toBe(true);
    });

    it('should return false for unlocked account', () => {
      const email = 'unlocked@example.com';

      // Record some failed attempts but not enough to lock
      for (let i = 0; i < 3; i++) {
        service.recordLoginAttempt(email, false);
      }

      expect(service.isAccountLocked(email)).toBe(false);
    });
  });

  describe('getRemainingLockoutTime', () => {
    it('should return 0 for unlocked account', () => {
      const email = 'unlocked@example.com';

      const remainingTime = service.getRemainingLockoutTime(email);

      expect(remainingTime).toBe(0);
    });

    it('should return remaining time for locked account', () => {
      const email = 'locked@example.com';

      // Lock the account
      for (let i = 0; i < 5; i++) {
        service.recordLoginAttempt(email, false);
      }

      const remainingTime = service.getRemainingLockoutTime(email);

      expect(remainingTime).toBeGreaterThan(0);
      expect(remainingTime).toBeLessThanOrEqual(900000); // 15 minutes in milliseconds (default config)
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong password', () => {
      const password = 'StrongPass123!';

      const result = service.validatePasswordStrength(password);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.score).toBeGreaterThan(3);
    });

    it('should reject weak password', () => {
      const password = 'weak';

      const result = service.validatePasswordStrength(password);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      const email = 'test@example.com';

      const result = service.validateEmail(email);

      expect(result).toBe(true);
    });

    it('should reject invalid email', () => {
      const email = 'invalid-email';

      const result = service.validateEmail(email);

      expect(result).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate Vietnamese phone number', () => {
      const phone = '0987654321'; // Valid Vietnamese mobile number

      const result = service.validatePhoneNumber(phone);

      expect(result).toBe(true);
    });

    it('should reject invalid phone number', () => {
      const phone = '123';

      const result = service.validatePhoneNumber(phone);

      expect(result).toBe(false);
    });
  });
});
