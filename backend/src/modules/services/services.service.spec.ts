import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceCategory, ServiceType } from '../../common/enums';

describe('ServicesService', () => {
  let service: ServicesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    service: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    serviceItem: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    serviceBooking: {
      count: jest.fn(),
    },
    serviceBookingItem: {
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    $transaction: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createService', () => {
    it('should create a service successfully', async () => {
      const createServiceDto = {
        name: 'Test Service',
        slug: 'test-service',
        description: 'Test description',
        category: ServiceCategory.INSTALLATION,
        type: ServiceType.AUDIO_EQUIPMENT,
        basePriceCents: 100000,
        estimatedDuration: 60,
      };

      const expectedResult = {
        id: 'test-id',
        ...createServiceDto,
        items: [],
      };

      mockPrismaService.service.create.mockResolvedValue(expectedResult);

      const result = await service.createService(createServiceDto);

      expect(mockPrismaService.service.create).toHaveBeenCalledWith({
        data: {
          name: createServiceDto.name,
          slug: createServiceDto.slug,
          description: createServiceDto.description,
          category: createServiceDto.category,
          type: createServiceDto.type,
          basePriceCents: createServiceDto.basePriceCents,
          price: createServiceDto.basePriceCents,
          duration: createServiceDto.estimatedDuration,
          images: undefined,
        },
        include: { items: true },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getServices', () => {
    it('should return paginated services', async () => {
      const params = {
        category: ServiceCategory.INSTALLATION,
        page: 1,
        pageSize: 10,
      };

      const mockServices = [
        {
          id: 'service-1',
          name: 'Service 1',
          category: ServiceCategory.INSTALLATION,
          items: [],
          _count: { bookings: 5 },
        },
      ];

      mockPrismaService.$transaction.mockResolvedValue([10, mockServices]);

      const result = await service.getServices(params);

      expect(result).toEqual({
        total: 10,
        page: 1,
        pageSize: 10,
        services: mockServices,
      });
    });
  });

  describe('getService', () => {
    it('should return a service by id', async () => {
      const serviceId = 'test-id';
      const mockService = {
        id: serviceId,
        name: 'Test Service',
        items: [],
        bookings: [],
      };

      mockPrismaService.service.findUnique.mockResolvedValue(mockService);

      const result = await service.getService(serviceId);

      expect(mockPrismaService.service.findUnique).toHaveBeenCalledWith({
        where: { id: serviceId },
        include: {
          items: true,
          bookings: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });
      expect(result).toEqual(mockService);
    });

    it('should throw NotFoundException if service not found', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue(null);

      await expect(service.getService('non-existent-id')).rejects.toThrow(
        'Không tìm thấy dịch vụ'
      );
    });
  });

  describe('updateService', () => {
    it('should update a service successfully', async () => {
      const serviceId = 'test-id';
      const updateData = {
        name: 'Updated Service',
        basePriceCents: 150000,
      };

      const mockService = { id: serviceId, name: 'Original Service' };
      const updatedService = { ...mockService, ...updateData, items: [] };

      mockPrismaService.service.findUnique.mockResolvedValue(mockService);
      mockPrismaService.service.update.mockResolvedValue(updatedService);

      const result = await service.updateService(serviceId, updateData);

      expect(result).toEqual(updatedService);
    });
  });

  describe('deleteService', () => {
    it('should delete a service successfully', async () => {
      const serviceId = 'test-id';
      const mockService = { id: serviceId, name: 'Test Service' };

      mockPrismaService.service.findUnique.mockResolvedValue(mockService);
      mockPrismaService.serviceBooking.count.mockResolvedValue(0);
      mockPrismaService.service.delete.mockResolvedValue(mockService);

      const result = await service.deleteService(serviceId);

      expect(result).toEqual(mockService);
    });

    it('should throw BadRequestException if service has bookings', async () => {
      const serviceId = 'test-id';
      const mockService = { id: serviceId, name: 'Test Service' };

      mockPrismaService.service.findUnique.mockResolvedValue(mockService);
      mockPrismaService.serviceBooking.count.mockResolvedValue(1);

      await expect(service.deleteService(serviceId)).rejects.toThrow(
        'Không thể xóa dịch vụ đã có booking'
      );
    });
  });

  describe('addServiceItem', () => {
    it('should add a service item successfully', async () => {
      const serviceId = 'service-id';
      const itemData = {
        name: 'Test Item',
        priceCents: 50000,
      };

      const mockService = { id: serviceId, name: 'Test Service' };
      const mockItem = {
        id: 'item-id',
        ...itemData,
        serviceId,
        quantity: 1,
      };

      mockPrismaService.service.findUnique.mockResolvedValue(mockService);
      mockPrismaService.serviceItem.create.mockResolvedValue(mockItem);

      const result = await service.addServiceItem(serviceId, itemData);

      expect(result).toEqual(mockItem);
    });
  });

  describe('getServiceCategories', () => {
    it('should return service categories', () => {
      const result = service.getServiceCategories();

      expect(result).toEqual([
        { value: ServiceCategory.INSTALLATION, label: 'Lắp đặt' },
        { value: ServiceCategory.MAINTENANCE, label: 'Bảo trì' },
        { value: ServiceCategory.REPAIR, label: 'Sửa chữa' },
        { value: ServiceCategory.LIQUIDATION, label: 'Thanh lý' },
        { value: ServiceCategory.RENTAL, label: 'Cho thuê' },
        { value: ServiceCategory.CONSULTATION, label: 'Tư vấn' },
        { value: ServiceCategory.DELIVERY, label: 'Giao hàng' },
        { value: ServiceCategory.OTHER, label: 'Khác' },
      ]);
    });
  });

  describe('getServiceStats', () => {
    it('should return service statistics', async () => {
      const mockStats = {
        totalServices: 10,
        activeServices: 8,
        totalBookings: 25,
        pendingBookings: 5,
        completedBookings: 20,
        totalRevenue: 5000000,
      };

      mockPrismaService.service.count
        .mockResolvedValueOnce(mockStats.totalServices)
        .mockResolvedValueOnce(mockStats.activeServices);

      mockPrismaService.serviceBooking.count
        .mockResolvedValueOnce(mockStats.totalBookings)
        .mockResolvedValueOnce(mockStats.pendingBookings)
        .mockResolvedValueOnce(mockStats.completedBookings);

      mockPrismaService.serviceBookingItem.aggregate.mockResolvedValue({
        _sum: { price: mockStats.totalRevenue },
      });

      const result = await service.getServiceStats();

      expect(result).toEqual(mockStats);
    });
  });
});