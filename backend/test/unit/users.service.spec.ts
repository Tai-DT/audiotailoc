import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/modules/users/users.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
jest.mock('bcryptjs', () => ({
  hash: jest.fn(async () => Array(61).join('h')), // 60-char pseudo-hash
  compare: jest.fn(async () => true),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: 'user_123',
        email,
        name: 'Test User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const email = 'nonexistent@example.com';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const userId = 'user_123';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: {
          orders: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: {
              orders: true
            }
          }
        }
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    it('should create user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const mockUser = {
        id: 'user_123',
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.createUser(userData);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          password: expect.any(String), // Hashed password
          name: userData.name,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should hash password correctly', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const mockUser = {
        id: 'user_123',
        email: userData.email,
        name: userData.name,
        password: 'hashed_password',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      await service.createUser(userData);

      const createCall = mockPrismaService.user.create.mock.calls[0][0];
      const hashedPassword = createCall.data.password;

      // Verify password is hashed
      expect(hashedPassword).not.toBe(userData.password);
      expect(hashedPassword).toHaveLength(60); // bcrypt hash length
    });
  });

  describe('update', () => {
    it('should update user data', async () => {
      const userId = 'user_123';
      const updateData = {
        name: 'Updated Name',
        phone: '0123456789',
      };

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        ...updateData,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.update(userId, updateData);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should delete user', async () => {
      const userId = 'user_123';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove(userId);

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual({ message: 'User deleted successfully' });
    });
  });

  describe('create', () => {
    it('should create user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const mockUser = {
        id: 'user_123',
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(userData);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          password: expect.any(String),
          name: userData.name,
          phone: undefined,
          role: 'USER',
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
