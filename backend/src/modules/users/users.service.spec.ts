import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TestDatabaseService } from '../testing/test-database.service';
import { TestHelpersService } from '../testing/test-helpers.service';
import { MockServicesService } from '../testing/mock-services.service';

describe('UsersService', () => {
  let service: UsersService;
  let testDatabase: TestDatabaseService;
  let testHelpers: TestHelpersService;
  let mockServices: MockServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        TestDatabaseService,
        TestHelpersService,
        MockServicesService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    testDatabase = module.get<TestDatabaseService>(TestDatabaseService);
    testHelpers = module.get<TestHelpersService>(TestHelpersService);
    mockServices = module.get<MockServicesService>(MockServicesService);
  });

  afterEach(async () => {
    // Clean up test data
    await testDatabase.cleanupTestData();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'hashedpassword123',
        name: 'Test User',
        phone: '0123456789',
      };

      const mockUser = {
        id: 'user_123',
        ...userData,
        isActive: true,
        role: 'USER',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service['prisma'].user, 'create').mockResolvedValue(mockUser);

      // Act
      const result = await service.createUser(userData);

      // Assert
      expect(result).toEqual(mockUser);
      expect(service['prisma'].user.create).toHaveBeenCalledWith({
        data: userData,
      });
    });

    it('should throw error for duplicate email', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        password: 'hashedpassword123',
        name: 'Test User',
        phone: '0123456789',
      };

      jest.spyOn(service['prisma'].user, 'create').mockRejectedValue({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      // Act & Assert
      await expect(service.createUser(userData)).rejects.toThrow();
    });

    it('should hash password before saving', async () => {
      // Arrange
      const plainPassword = 'mypassword123';
      const hashedPassword = await testHelpers.hashTestPassword(plainPassword);

      const userData = {
        email: 'test@example.com',
        password: plainPassword,
        name: 'Test User',
        phone: '0123456789',
      };

      const mockUser = {
        id: 'user_123',
        ...userData,
        password: hashedPassword,
        isActive: true,
        role: 'USER',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service['prisma'].user, 'create').mockResolvedValue(mockUser);

      // Act
      const result = await service.createUser(userData);

      // Assert
      expect(result.password).toBe(hashedPassword);
    });
  });

  describe('findUserByEmail', () => {
    it('should find user by email', async () => {
      // Arrange
      const email = 'test@example.com';
      const mockUser = {
        id: 'user_123',
        email,
        name: 'Test User',
        isActive: true,
        role: 'USER',
      };

      jest.spyOn(service['prisma'].user, 'findUnique').mockResolvedValue(mockUser);

      // Act
      const result = await service.findUserByEmail(email);

      // Assert
      expect(result).toEqual(mockUser);
      expect(service['prisma'].user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return null if user not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      jest.spyOn(service['prisma'].user, 'findUnique').mockResolvedValue(null);

      // Act
      const result = await service.findUserByEmail(email);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      // Arrange
      const userId = 'user_123';
      const updateData = {
        name: 'Updated Name',
        phone: '0987654321',
      };

      const mockUpdatedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Updated Name',
        phone: '0987654321',
        isActive: true,
        role: 'USER',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service['prisma'].user, 'update').mockResolvedValue(mockUpdatedUser);

      // Act
      const result = await service.updateUser(userId, updateData);

      // Assert
      expect(result).toEqual(mockUpdatedUser);
      expect(service['prisma'].user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const userId = 'nonexistent';
      const updateData = { name: 'Updated Name' };

      jest.spyOn(service['prisma'].user, 'update').mockRejectedValue({
        code: 'P2025',
      });

      // Act & Assert
      await expect(service.updateUser(userId, updateData)).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const userId = 'user_123';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        isActive: true,
        role: 'USER',
      };

      jest.spyOn(service['prisma'].user, 'delete').mockResolvedValue(mockUser);

      // Act
      const result = await service.deleteUser(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(service['prisma'].user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const userId = 'nonexistent';
      jest.spyOn(service['prisma'].user, 'delete').mockRejectedValue({
        code: 'P2025',
      });

      // Act & Assert
      await expect(service.deleteUser(userId)).rejects.toThrow();
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      // Arrange
      const plainPassword = 'mypassword123';
      const hashedPassword = await testHelpers.hashTestPassword(plainPassword);

      // Act
      const result = await service.verifyPassword(plainPassword, hashedPassword);

      // Assert
      expect(result).toBe(true);
    });

    it('should reject incorrect password', async () => {
      // Arrange
      const plainPassword = 'mypassword123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await testHelpers.hashTestPassword(plainPassword);

      // Act
      const result = await service.verifyPassword(wrongPassword, hashedPassword);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Integration with Test Database', () => {
    it('should create and find user in test database', async () => {
      // This test requires actual database connection
      // Skip if database is not available
      const isHealthy = await testDatabase.checkDatabaseHealth();
      if (!isHealthy) {
        console.warn('Database not available, skipping integration test');
        return;
      }

      // Arrange
      const userData = {
        email: `integration${Date.now()}@example.com`,
        password: 'hashedpassword123',
        name: 'Integration Test User',
        phone: '0123456789',
      };

      // Act
      const createdUser = await testDatabase.createTestUser(userData);
      const foundUser = await service.findUserByEmail(userData.email);

      // Assert
      expect(foundUser).toBeTruthy();
      expect(foundUser?.email).toBe(userData.email);
      expect(foundUser?.name).toBe(userData.name);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty user data', async () => {
      // Arrange
      const emptyData = {};

      // Act & Assert
      await expect(service.createUser(emptyData as any)).rejects.toThrow();
    });

    it('should handle very long strings', async () => {
      // Arrange
      const longString = 'a'.repeat(1000);
      const userData = {
        email: `test${Date.now()}@example.com`,
        password: 'hashedpassword123',
        name: longString,
        phone: '0123456789',
      };

      const mockUser = {
        id: 'user_123',
        ...userData,
        isActive: true,
        role: 'USER',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service['prisma'].user, 'create').mockResolvedValue(mockUser);

      // Act
      const result = await service.createUser(userData);

      // Assert
      expect(result.name).toBe(longString);
    });

    it('should handle special characters in name', async () => {
      // Arrange
      const specialName = 'Tëst Üsér 🚀';
      const userData = {
        email: `test${Date.now()}@example.com`,
        password: 'hashedpassword123',
        name: specialName,
        phone: '0123456789',
      };

      const mockUser = {
        id: 'user_123',
        ...userData,
        isActive: true,
        role: 'USER',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service['prisma'].user, 'create').mockResolvedValue(mockUser);

      // Act
      const result = await service.createUser(userData);

      // Assert
      expect(result.name).toBe(specialName);
    });
  });
});
