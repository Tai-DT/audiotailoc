import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsService } from '../promotions.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('PromotionsService', () => {
  let service: PromotionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionsService,
        {
          provide: PrismaService,
          useValue: {
            promotions: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PromotionsService>(PromotionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a promotion', async () => {
      const createDto = {
        code: 'PROMO20',
        description: 'Test promotion',
        type: 'PERCENTAGE',
        value: 20,
        isActive: true,
      };

      const mockPromotion = { id: '1', ...createDto };

      jest.spyOn(prisma.promotions, 'create').mockResolvedValue(mockPromotion as any);

      const result = await service.create(createDto as any);

      // Service wraps response
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(prisma.promotions.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all promotions', async () => {
      const mockPromotions = [
        { id: '1', code: 'PROMO20' },
        { id: '2', code: 'PROMO30' },
      ];

      jest.spyOn(prisma.promotions, 'findMany').mockResolvedValue(mockPromotions as any);
      jest.spyOn(prisma.promotions, 'count').mockResolvedValue(2);

      const result = await service.findAll({});

      // Service wraps response with pagination
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('promotions');
      expect(result.data).toHaveProperty('total', 2);
      expect(prisma.promotions.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a promotion by id', async () => {
      const mockPromotion = { id: '1', code: 'PROMO20' };

      jest.spyOn(prisma.promotions, 'findUnique').mockResolvedValue(mockPromotion as any);

      const result = await service.findOne('1');

      // Service wraps response
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data');
      expect(prisma.promotions.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
        }),
      );
    });
  });

  describe('findByCode', () => {
    it('should return a promotion by code', async () => {
      const mockPromotion = { id: '1', code: 'PROMO20' };

      jest.spyOn(prisma.promotions, 'findUnique').mockResolvedValue(mockPromotion as any);

      const result = await service.findByCode('PROMO20');

      // Service wraps response
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data');
    });
  });

  describe('update', () => {
    it('should update a promotion', async () => {
      const updateDto = { description: 'Updated description' };
      const mockPromotion = { id: '1', code: 'PROMO20', ...updateDto };

      // Mock finding existing promotion
      jest.spyOn(prisma.promotions, 'findUnique').mockResolvedValue(mockPromotion as any);
      jest.spyOn(prisma.promotions, 'update').mockResolvedValue(mockPromotion as any);

      const result = await service.update('1', updateDto as any);

      expect(result).toBeDefined();
      expect(prisma.promotions.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
        }),
      );
    });
  });

  describe('delete', () => {
    it('should delete a promotion', async () => {
      const mockPromotion = { id: '1', code: 'PROMO20' };

      // Mock finding existing promotion
      jest.spyOn(prisma.promotions, 'findUnique').mockResolvedValue(mockPromotion as any);
      jest.spyOn(prisma.promotions, 'delete').mockResolvedValue(mockPromotion as any);

      await service.delete('1');

      expect(prisma.promotions.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
