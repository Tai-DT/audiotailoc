import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from '../settings.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let prisma: PrismaService;

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return settings object', async () => {
      const result = await service.findAll();
      expect(result).toHaveProperty('general');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('notifications');
      expect(result.general.siteName).toBe('Audio Tai Loc');
    });
  });

  describe('update', () => {
    it('should return success response', async () => {
      const updateData = { general: { siteName: 'New Name' } };
      const result = await service.update(updateData);

      expect(result).toEqual({
        success: true,
        message: 'Settings updated successfully',
        data: updateData,
      });
    });
  });
});
