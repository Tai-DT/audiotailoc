import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let configService: ConfigService;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);

    // Default config values
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'JWT_ACCESS_SECRET') return 'test_access_secret';
      if (key === 'JWT_REFRESH_SECRET') return 'test_refresh_secret';
      return undefined;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const hashedPassword = 'hashed_password';
      const createdUser = {
        id: 'user_id',
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
      });
      expect(result).toEqual(createdUser);
    });

    it('should handle registration without name', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashed_password';
      const createdUser = {
        id: 'user_id',
        email: registerDto.email,
        name: '',
        password: hashedPassword,
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await service.register(registerDto);

      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: hashedPassword,
        name: '',
      });
      expect(result).toEqual(createdUser);
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 'user_id',
        email: loginDto.email,
        password: 'hashed_password',
        role: 'USER',
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login(loginDto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, user.password);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error for non-existent user', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow('not found');
    });

    it('should throw error for invalid password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const user = {
        id: 'user_id',
        email: loginDto.email,
        password: 'hashed_password',
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginDto)).rejects.toThrow('bad pass');
    });
  });

  describe('refresh', () => {
    it('should return new access token for valid refresh token', async () => {
      const refreshToken = 'valid_refresh_token';
      const payload = { sub: 'user_id' };
      const user = {
        id: 'user_id',
        email: 'test@example.com',
        role: 'USER',
      };

      jest.spyOn(jwt, 'verify').mockReturnValue(payload as any);
      mockUsersService.findById.mockResolvedValue(user);

      const result = await service.refresh(refreshToken);

      expect(jwt.verify).toHaveBeenCalledWith(refreshToken, 'test_refresh_secret');
      expect(mockUsersService.findById).toHaveBeenCalledWith('user_id');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.refreshToken).toBe(refreshToken);
    });

    it('should throw error for invalid refresh token', async () => {
      const refreshToken = 'invalid_refresh_token';

      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refresh(refreshToken)).rejects.toThrow('Invalid refresh token');
    });

    it('should throw error for non-existent user', async () => {
      const refreshToken = 'valid_refresh_token';
      const payload = { sub: 'user_id' };

      jest.spyOn(jwt, 'verify').mockReturnValue(payload as any);
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.refresh(refreshToken)).rejects.toThrow('Invalid refresh token');
    });
  });
});
