import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import {
  CreateServiceCategoryDto,
  UpdateServiceCategoryDto,
  CreateServiceTypeDto,
  UpdateServiceTypeDto,
  CreateServiceDto,
  UpdateServiceDto
} from './dto/service.dto';

describe('ServicesService', () => {
  let service: ServicesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    serviceCategory: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    serviceType: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    service: {
      findMany: jest.fn(),
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
        ServicesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Service Categories', () => {
    const mockCategory = {
      id: '1',
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test description',
      icon: 'icon',
      color: '#000000',
      isActive: true,
      sortOrder: 0,
      services: [],
      types: [],
    };

    describe('findAllCategories', () => {
      it('should return all categories', async () => {
        mockPrismaService.serviceCategory.findMany.mockResolvedValue([mockCategory]);

        const result = await service.findAllCategories();

        expect(mockPrismaService.serviceCategory.findMany).toHaveBeenCalledWith({
          orderBy: { sortOrder: 'asc' },
          include: {
            services: { select: { id: true, name: true, isActive: true } },
            types: { select: { id: true, name: true, isActive: true } },
          },
        });
        expect(result).toEqual([mockCategory]);
      });
    });

    describe('findCategoryById', () => {
      it('should return category by id', async () => {
        mockPrismaService.serviceCategory.findUnique.mockResolvedValue(mockCategory);

        const result = await service.findCategoryById('1');

        expect(mockPrismaService.serviceCategory.findUnique).toHaveBeenCalledWith({
          where: { id: '1' },
          include: {
            services: { select: { id: true, name: true, isActive: true } },
            types: { select: { id: true, name: true, isActive: true } },
          },
        });
        expect(result).toEqual(mockCategory);
      });

      it('should throw NotFoundException if category not found', async () => {
        mockPrismaService.serviceCategory.findUnique.mockResolvedValue(null);

        await expect(service.findCategoryById('1')).rejects.toThrow(NotFoundException);
      });
    });

    describe('createCategory', () => {
      const createDto: CreateServiceCategoryDto = {
        name: 'New Category',
        description: 'New description',
        icon: 'new-icon',
        color: '#ffffff',
        isActive: true,
        sortOrder: 1,
      };

      it('should create category successfully', async () => {
        const createdCategory = { ...mockCategory, ...createDto, slug: 'new-category' };
        mockPrismaService.serviceCategory.findUnique.mockResolvedValue(null);
        mockPrismaService.serviceCategory.create.mockResolvedValue(createdCategory);

        const result = await service.createCategory(createDto);

        expect(mockPrismaService.serviceCategory.findUnique).toHaveBeenCalledWith({
          where: { slug: 'new-category' },
        });
        expect(mockPrismaService.serviceCategory.create).toHaveBeenCalledWith({
          data: {
            name: createDto.name,
            slug: 'new-category',
            description: createDto.description,
            icon: createDto.icon,
            color: createDto.color,
            isActive: createDto.isActive,
            sortOrder: createDto.sortOrder,
          },
        });
        expect(result).toEqual(createdCategory);
      });

      it('should throw ConflictException if slug already exists', async () => {
        mockPrismaService.serviceCategory.findUnique.mockResolvedValue(mockCategory);

        await expect(service.createCategory(createDto)).rejects.toThrow(ConflictException);
      });
    });

    describe('updateCategory', () => {
      const updateDto: UpdateServiceCategoryDto = {
        name: 'Updated Category',
        description: 'Updated description',
      };

      it('should update category successfully', async () => {
        const updatedCategory = { ...mockCategory, ...updateDto, slug: 'updated-category' };
        mockPrismaService.serviceCategory.findUnique
          .mockResolvedValueOnce(mockCategory)
          .mockResolvedValueOnce(null);
        mockPrismaService.serviceCategory.update.mockResolvedValue(updatedCategory);

        const result = await service.updateCategory('1', updateDto);

        expect(result).toEqual(updatedCategory);
      });

      it('should throw ConflictException if new slug already exists', async () => {
        const conflictingCategory = { ...mockCategory, id: '2', slug: 'updated-category' };

        // Clear all mocks first
        jest.clearAllMocks();

        // Mock findCategoryById call (with include)
        mockPrismaService.serviceCategory.findUnique.mockResolvedValueOnce({
          ...mockCategory,
          services: [],
          types: []
        });

        // Mock slug check call (without include)
        mockPrismaService.serviceCategory.findUnique.mockResolvedValueOnce(null);

        // Mock findFirst for conflict
        mockPrismaService.serviceCategory.findFirst.mockResolvedValueOnce(conflictingCategory);

        await expect(service.updateCategory('1', updateDto)).rejects.toThrow(ConflictException);
      });
    });

    describe('deleteCategory', () => {
      it('should delete category successfully', async () => {
        mockPrismaService.serviceCategory.findUnique.mockResolvedValue({
          ...mockCategory,
          services: [],
          types: [],
        });
        mockPrismaService.serviceCategory.delete.mockResolvedValue(mockCategory);

        const result = await service.deleteCategory('1');

        expect(mockPrismaService.serviceCategory.delete).toHaveBeenCalledWith({
          where: { id: '1' },
        });
        expect(result).toEqual(mockCategory);
      });

      it('should throw BadRequestException if category has related services', async () => {
        // Clear all mocks first
        jest.clearAllMocks();

        mockPrismaService.serviceCategory.findUnique.mockImplementation((args) => {
          if (args?.include) {
            // findCategoryById call
            return Promise.resolve({
              ...mockCategory,
              services: [{ id: '1', name: 'Test Service', isActive: true }],
              types: [],
            });
          }
          return Promise.resolve(null);
        });

        await expect(service.deleteCategory('1')).rejects.toThrow(BadRequestException);
      });
    });
  });

  describe('Service Types', () => {
    const mockType = {
      id: '1',
      name: 'Test Type',
      slug: 'test-type',
      description: 'Test description',
      categoryId: '1',
      icon: 'icon',
      color: '#000000',
      isActive: true,
      sortOrder: 0,
      category: { id: '1', name: 'Test Category', color: '#000000' },
      services: [],
    };

    describe('findAllTypes', () => {
      it('should return all types', async () => {
        mockPrismaService.serviceType.findMany.mockResolvedValue([mockType]);

        const result = await service.findAllTypes();

        expect(mockPrismaService.serviceType.findMany).toHaveBeenCalledWith({
          orderBy: { sortOrder: 'asc' },
          include: {
            category: { select: { id: true, name: true, color: true } },
            services: { select: { id: true, name: true, isActive: true } },
          },
        });
        expect(result).toEqual([mockType]);
      });
    });

    describe('createType', () => {
      const createDto: CreateServiceTypeDto = {
        name: 'New Type',
        description: 'New description',
        categoryId: '1',
        icon: 'new-icon',
        color: '#ffffff',
        isActive: true,
        sortOrder: 1,
      };

      it('should create type successfully', async () => {
        const createdType = { ...mockType, ...createDto, slug: 'new-type' };
        mockPrismaService.serviceCategory.findUnique.mockResolvedValue({ id: '1' });
        mockPrismaService.serviceType.findUnique.mockResolvedValue(null);
        mockPrismaService.serviceType.create.mockResolvedValue(createdType);

        const result = await service.createType(createDto);

        expect(result).toEqual(createdType);
      });

      it('should throw BadRequestException if category not found', async () => {
        mockPrismaService.serviceCategory.findUnique.mockResolvedValue(null);

        await expect(service.createType(createDto)).rejects.toThrow(BadRequestException);
      });
    });
  });

  describe('Services', () => {
    const mockService = {
      id: '1',
      name: 'Test Service',
      slug: 'test-service',
      description: 'Test description',
      shortDescription: 'Short desc',
      basePriceCents: 1000,
      price: 10.00,
      duration: 60,
      categoryId: '1',
      typeId: '1',
      images: 'image.jpg',
      isActive: true,
      isFeatured: false,
      seoTitle: 'SEO Title',
      seoDescription: 'SEO Description',
      tags: 'tag1,tag2',
      features: 'feature1,feature2',
      requirements: 'req1,req2',
      metadata: '{}',
      serviceCategory: { id: '1', name: 'Test Category', color: '#000000' },
      serviceType: { id: '1', name: 'Test Type', color: '#000000' },
      items: [],
      bookings: [],
    };

    describe('findAllServices', () => {
      it('should return all services', async () => {
        mockPrismaService.service.findMany.mockResolvedValue([mockService]);

        const result = await service.findAllServices();

        expect(mockPrismaService.service.findMany).toHaveBeenCalledWith({
          where: undefined,
          orderBy: { createdAt: 'desc' },
          include: {
            serviceCategory: { select: { id: true, name: true, color: true } },
            serviceType: { select: { id: true, name: true, color: true } },
            items: { select: { id: true, name: true } },
            bookings: {
              select: { id: true, status: true },
              where: { status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] } },
            },
          },
        });
        expect(result).toEqual([mockService]);
      });

      it('should return filtered services', async () => {
        const where = { isActive: true };
        mockPrismaService.service.findMany.mockResolvedValue([mockService]);

        const result = await service.findAllServices(where);

        expect(mockPrismaService.service.findMany).toHaveBeenCalledWith({
          where,
          orderBy: { createdAt: 'desc' },
          include: {
            serviceCategory: { select: { id: true, name: true, color: true } },
            serviceType: { select: { id: true, name: true, color: true } },
            items: { select: { id: true, name: true } },
            bookings: {
              select: { id: true, status: true },
              where: { status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] } },
            },
          },
        });
      });
    });

    describe('findServiceById', () => {
      it('should return service by id', async () => {
        mockPrismaService.service.findUnique.mockResolvedValue(mockService);

        const result = await service.findServiceById('1');

        expect(result).toEqual(mockService);
      });

      it('should throw NotFoundException if service not found', async () => {
        mockPrismaService.service.findUnique.mockResolvedValue(null);

        await expect(service.findServiceById('1')).rejects.toThrow(NotFoundException);
      });
    });

    describe('createService', () => {
      const createDto: CreateServiceDto = {
        name: 'New Service',
        description: 'New description',
        shortDescription: 'Short desc',
        basePriceCents: 2000,
        price: 20.00,
        duration: 120,
        categoryId: '1',
        typeId: '1',
        images: 'new-image.jpg',
        isActive: true,
        isFeatured: true,
        seoTitle: 'New SEO Title',
        seoDescription: 'New SEO Description',
        tags: 'tag1,tag2',
        features: 'feature1,feature2',
        requirements: 'req1,req2',
        metadata: '{}',
      };

      it('should create service successfully', async () => {
        const createdService = { ...mockService, ...createDto, slug: 'new-service' };
        mockPrismaService.serviceCategory.findUnique.mockResolvedValue({ id: '1' });
        mockPrismaService.serviceType.findUnique.mockResolvedValue({ id: '1' });
        mockPrismaService.service.findUnique.mockResolvedValue(null);
        mockPrismaService.service.create.mockResolvedValue(createdService);

        const result = await service.createService(createDto);

        expect(result).toEqual(createdService);
      });

      it('should throw BadRequestException if category not found', async () => {
        mockPrismaService.serviceCategory.findUnique.mockResolvedValue(null);

        await expect(service.createService(createDto)).rejects.toThrow(BadRequestException);
      });

      it('should throw ConflictException if slug already exists', async () => {
        mockPrismaService.serviceCategory.findUnique.mockResolvedValue({ id: '1' });
        mockPrismaService.serviceType.findUnique.mockResolvedValue({ id: '1' });
        mockPrismaService.service.findUnique.mockResolvedValue(mockService);

        await expect(service.createService(createDto)).rejects.toThrow(ConflictException);
      });
    });

    describe('updateService', () => {
      const updateDto: UpdateServiceDto = {
        name: 'Updated Service',
        description: 'Updated description',
      };

      it('should update service successfully', async () => {
        const updatedService = { ...mockService, ...updateDto, slug: 'updated-service' };
        mockPrismaService.service.findUnique
          .mockResolvedValueOnce(mockService)
          .mockResolvedValueOnce(null);
        mockPrismaService.service.update.mockResolvedValue(updatedService);

        const result = await service.updateService('1', updateDto);

        expect(result).toEqual(updatedService);
      });
    });

    describe('deleteService', () => {
      it('should delete service successfully', async () => {
        // Clear all mocks first
        jest.clearAllMocks();

        // Mock findServiceById call (with include)
        mockPrismaService.service.findUnique.mockResolvedValueOnce({
          ...mockService,
          bookings: [],
          items: [],
          serviceCategory: { id: '1', name: 'Test Category', color: '#000000' },
          serviceType: { id: '1', name: 'Test Type', color: '#000000' },
        });

        // Mock delete
        mockPrismaService.service.delete.mockResolvedValue(mockService);

        const result = await service.deleteService('1');

        expect(result).toEqual(mockService);
      });

      it('should throw BadRequestException if service has active bookings', async () => {
        // Clear all mocks first
        jest.clearAllMocks();

        // Mock findServiceById
        mockPrismaService.service.findUnique.mockImplementation((args) => {
          if (args?.include) {
            return Promise.resolve({
              ...mockService,
              bookings: [{ id: '1', status: 'PENDING', user: { id: '1', name: 'Test User', email: 'test@example.com' } }],
              items: [],
              serviceCategory: { id: '1', name: 'Test Category', color: '#000000' },
              serviceType: { id: '1', name: 'Test Type', color: '#000000' },
            });
          }
          return Promise.resolve(null);
        });

        await expect(service.deleteService('1')).rejects.toThrow(BadRequestException);
      });
    });
  });
});
