import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth.service';
import { UsersService } from '../../src/modules/users/users.service';
import { SecurityService } from '../../src/modules/security/security.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
jest.mock('bcryptjs', () => ({
  hash: jest.fn(async () => 'hashed_pw'),
  compare: jest.fn(async (p: string) => p === 'password123'),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'signed_token'),
  verify: jest.fn(() => { throw new Error('Invalid refresh token'); }),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let securityService: SecurityService;
  let configService: ConfigService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockSecurityService = {
    isAccountLocked: jest.fn(),
    getRemainingLockoutTime: jest.fn(),
    recordLoginAttempt: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
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
          provide: SecurityService,
          useValue: mockSecurityService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    securityService = module.get<SecurityService>(SecurityService);
    configService = module.get<ConfigService>(ConfigService);

    // Setup default config values
    mockConfigService.get.mockImplementation((key: string) => {
      const config: Record<string, string> = {
        JWT_ACCESS_SECRET: 'test_access_secret',
        JWT_REFRESH_SECRET: 'test_refresh_secret',
        JWT_ACCESS_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return config[key];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const hashedPassword = await bcrypt.hash(registerDto.password, 12);
      const mockUser = {
        id: 'user_123',
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: registerDto.password,
        name: registerDto.name,
      });
      expect(result).toEqual(mockUser);
    });

    it('should handle user creation error', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockUsersService.create.mockRejectedValue(new Error('User creation failed'));

      await expect(service.register(registerDto)).rejects.toThrow('User creation failed');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash('password123', 12);
      const mockUser = {
        id: 'user_123',
        email: loginDto.email,
        password: hashedPassword,
      };

      mockSecurityService.isAccountLocked.mockReturnValue(false);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(mockSecurityService.isAccountLocked).toHaveBeenCalledWith(loginDto.email);
      expect(mockSecurityService.recordLoginAttempt).toHaveBeenCalledWith(loginDto.email, true);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error if account is locked', async () => {
      const loginDto = {
        email: 'locked@example.com',
        password: 'password123',
      };

      mockSecurityService.isAccountLocked.mockReturnValue(true);
      mockSecurityService.getRemainingLockoutTime.mockReturnValue(300000); // 5 minutes

      await expect(service.login(loginDto)).rejects.toThrow('Account is locked');
      expect(mockUsersService.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockSecurityService.isAccountLocked.mockReturnValue(false);
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow('not found');
      expect(mockSecurityService.recordLoginAttempt).not.toHaveBeenCalled();
    });

    it('should throw error if password is incorrect', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const hashedPassword = await bcrypt.hash('correctpassword', 12);
      const mockUser = {
        id: 'user_123',
        email: loginDto.email,
        password: hashedPassword,
      };

      mockSecurityService.isAccountLocked.mockReturnValue(false);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow('bad pass');
      expect(mockSecurityService.recordLoginAttempt).toHaveBeenCalledWith(loginDto.email, false);
    });
  });

  describe('refresh', () => {
    it('should throw error for invalid refresh token', async () => {
      const refreshToken = 'invalid_refresh_token';

      // The AuthService.refresh method uses jwt.verify which will throw for invalid tokens
      // Since we can't easily mock jwt module, we test the error case
      await expect(service.refresh(refreshToken)).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('login', () => {
    it('should return tokens with correct structure', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash('password123', 12);
      const mockUser = {
        id: 'user_123',
        email: loginDto.email,
        password: hashedPassword,
      };

      mockSecurityService.isAccountLocked.mockReturnValue(false);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
    });
  });
});
