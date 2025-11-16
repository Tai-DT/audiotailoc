import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SecurityService } from '../security/security.service';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let configService: ConfigService;
  let securityService: SecurityService;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    updatePassword: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockSecurityService = {
    isAccountLocked: jest.fn(),
    getRemainingLockoutTime: jest.fn(),
    recordLoginAttempt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: SecurityService,
          useValue: mockSecurityService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);
    securityService = module.get<SecurityService>(SecurityService);

    // Mock default config values
    mockConfigService.get.mockImplementation((key: string) => {
      const config = {
        JWT_ACCESS_SECRET: 'test-access-secret',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
      };
      return config[key];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create new user successfully', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'StrongPass123!',
        name: 'John Doe',
      };

      const createdUser = {
        id: 'new-user-id',
        email: 'newuser@example.com',
        name: 'John Doe',
        role: 'USER',
        isActive: true,
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await service.register(registerDto);

      expect(result).toEqual(createdUser);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('newuser@example.com');
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'StrongPass123!',
        name: 'John Doe',
      });
    });

    it('should throw BadRequestException for weak password', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: '123',
        name: 'John Doe',
      };

      await expect(service.register(registerDto))
        .rejects.toThrow(BadRequestException);

      expect(mockUsersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'USER',
      };

      mockSecurityService.isAccountLocked.mockReturnValue(false);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwt, 'sign').mockReturnValue('mock-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        accessToken: 'mock-token',
        refreshToken: 'mock-token',
        userId: 'user-id',
      });

      expect(mockSecurityService.recordLoginAttempt).toHaveBeenCalledWith('test@example.com', true);
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: 'user-id', email: 'test@example.com', role: 'USER' },
        'test-access-secret',
        { expiresIn: '15m' }
      );
    });

    it('should throw error for locked account', async () => {
      const loginDto = {
        email: 'locked@example.com',
        password: 'password123',
      };

      mockSecurityService.isAccountLocked.mockReturnValue(true);
      mockSecurityService.getRemainingLockoutTime.mockReturnValue(300000); // 5 minutes

      await expect(service.login(loginDto))
        .rejects.toThrow('Account is locked. Try again in 5 minutes.');
    });

    it('should throw error for invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'USER',
      };

      mockSecurityService.isAccountLocked.mockReturnValue(false);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login(loginDto))
        .rejects.toThrow('Invalid email or password');

      expect(mockSecurityService.recordLoginAttempt).toHaveBeenCalledWith('test@example.com', false);
    });

    it('should throw error for non-existent user', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockSecurityService.isAccountLocked.mockReturnValue(false);
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto))
        .rejects.toThrow('Invalid email or password');

      expect(mockSecurityService.recordLoginAttempt).toHaveBeenCalledWith('nonexistent@example.com', false);
    });

    it('should use longer refresh token expiry when rememberMe is true', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      };

      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'USER',
      };

      mockSecurityService.isAccountLocked.mockReturnValue(false);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwt, 'sign').mockReturnValue('mock-token');

      await service.login(loginDto);

      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: 'user-id' },
        'test-refresh-secret',
        { expiresIn: '30d' }
      );
    });
  });

  describe('refresh', () => {
    it('should return new access token for valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const payload = { sub: 'user-id' };
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        role: 'USER',
      };

      jest.spyOn(jwt, 'verify').mockReturnValue(payload);
      mockUsersService.findById.mockResolvedValue(mockUser);
      jest.spyOn(jwt, 'sign').mockReturnValue('new-access-token');

      const result = await service.refresh(refreshToken);

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: refreshToken,
      });

      expect(jwt.verify).toHaveBeenCalledWith(refreshToken, 'test-refresh-secret');
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: 'user-id', email: 'test@example.com', role: 'USER' },
        'test-access-secret',
        { expiresIn: '15m' }
      );
    });

    it('should throw error for invalid refresh token', async () => {
      const refreshToken = 'invalid-token';

      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refresh(refreshToken))
        .rejects.toThrow('Invalid refresh token');
    });

    it('should throw error for disabled user', async () => {
      const refreshToken = 'valid-refresh-token';
      const payload = { sub: 'user-id' };
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        role: 'DISABLED',
      };

      jest.spyOn(jwt, 'verify').mockReturnValue(payload);
      mockUsersService.findById.mockResolvedValue(mockUser);

      await expect(service.refresh(refreshToken))
        .rejects.toThrow('User account has been disabled');
    });

    it('should throw error for non-existent user', async () => {
      const refreshToken = 'valid-refresh-token';
      const payload = { sub: 'user-id' };

      jest.spyOn(jwt, 'verify').mockReturnValue(payload);
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.refresh(refreshToken))
        .rejects.toThrow('User not found');
    });
  });

  describe('forgotPassword', () => {
    it('should return success for existing user', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: 'user-id',
        email: email,
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.forgotPassword(email);

      expect(result).toEqual({ success: true });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should return success for non-existent user (security)', async () => {
      const email = 'nonexistent@example.com';

      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.forgotPassword(email);

      expect(result).toEqual({ success: true });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('resetPassword', () => {
    it('should reset password for valid token', async () => {
      const token = 'a'.repeat(64); // Valid token format
      const newPassword = 'NewStrongPass123!';

      const result = await service.resetPassword(token, newPassword);

      expect(result).toEqual({ success: true });
    });

    it('should throw error for invalid token format', async () => {
      const token = 'invalid-token';
      const newPassword = 'NewStrongPass123!';

      await expect(service.resetPassword(token, newPassword))
        .rejects.toThrow('Invalid reset token');
    });
  });

  describe('changePassword', () => {
    it('should change password for valid current password', async () => {
      const userId = 'user-id';
      const currentPassword = 'old-password';
      const newPassword = 'NewStrongPass123!';
      const mockUser = {
        id: userId,
        password: 'hashed-old-password',
      };

      mockUsersService.findById.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-new-password');
      mockUsersService.updatePassword.mockResolvedValue(undefined);

      const result = await service.changePassword(userId, currentPassword, newPassword);

      expect(result).toEqual({ success: true });
      expect(mockUsersService.findById).toHaveBeenCalledWith(userId);
      expect(bcrypt.compare).toHaveBeenCalledWith(currentPassword, 'hashed-old-password');
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 12);
      expect(mockUsersService.updatePassword).toHaveBeenCalledWith(userId, 'hashed-new-password');
    });

    it('should throw error for invalid current password', async () => {
      const userId = 'user-id';
      const currentPassword = 'wrong-password';
      const newPassword = 'NewStrongPass123!';
      const mockUser = {
        id: userId,
        password: 'hashed-old-password',
      };

      mockUsersService.findById.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.changePassword(userId, currentPassword, newPassword))
        .rejects.toThrow('Current password is incorrect');
    });

    it('should throw error for non-existent user', async () => {
      const userId = 'non-existent-user';
      const currentPassword = 'old-password';
      const newPassword = 'NewStrongPass123!';

      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.changePassword(userId, currentPassword, newPassword))
        .rejects.toThrow('User not found');
    });
  });
});