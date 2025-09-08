import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceItemDto } from './dto/create-service-item.dto';
import { ServiceCategory, ServiceType } from '../../common/enums';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  const mockServicesService = {
    createService: jest.fn(),
    getServices: jest.fn(),
    getService: jest.fn(),
    updateService: jest.fn(),
    deleteService: jest.fn(),
    addServiceItem: jest.fn(),
    updateServiceItem: jest.fn(),
    deleteServiceItem: jest.fn(),
    getServiceCategories: jest.fn(),
    getServiceStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: mockServicesService,
        },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createService', () => {
    it('should create a service', async () => {
      const createServiceDto: CreateServiceDto = {
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

      mockServicesService.createService.mockResolvedValue(expectedResult);

      const result = await controller.createService(createServiceDto);

      expect(mockServicesService.createService).toHaveBeenCalledWith(createServiceDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getServices', () => {
    it('should return paginated services', async () => {
      const query = {
        category: ServiceCategory.INSTALLATION,
        page: '1',
        pageSize: '10',
      };

      const expectedResult = {
        total: 10,
        page: 1,
        pageSize: 10,
        services: [],
      };

      mockServicesService.getServices.mockResolvedValue(expectedResult);

      const result = await controller.getServices(query);

      expect(mockServicesService.getServices).toHaveBeenCalledWith({
        category: ServiceCategory.INSTALLATION,
        page: 1,
        pageSize: 10,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle default pagination values', async () => {
      const query = {};

      const expectedResult = {
        total: 5,
        page: 1,
        pageSize: 20,
        services: [],
      };

      mockServicesService.getServices.mockResolvedValue(expectedResult);

      const result = await controller.getServices(query);

      expect(mockServicesService.getServices).toHaveBeenCalledWith({
        category: undefined,
        type: undefined,
        isActive: undefined,
        page: undefined,
        pageSize: undefined,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getService', () => {
    it('should return a service by id', async () => {
      const serviceId = 'test-id';
      const expectedResult = {
        id: serviceId,
        name: 'Test Service',
        items: [],
        bookings: [],
      };

      mockServicesService.getService.mockResolvedValue(expectedResult);

      const result = await controller.getService(serviceId);

      expect(mockServicesService.getService).toHaveBeenCalledWith(serviceId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateService', () => {
    it('should update a service', async () => {
      const serviceId = 'test-id';
      const updateServiceDto: UpdateServiceDto = {
        name: 'Updated Service',
        basePriceCents: 150000,
      };

      const expectedResult = {
        id: serviceId,
        name: 'Updated Service',
        basePriceCents: 150000,
        items: [],
      };

      mockServicesService.updateService.mockResolvedValue(expectedResult);

      const result = await controller.updateService(serviceId, updateServiceDto);

      expect(mockServicesService.updateService).toHaveBeenCalledWith(serviceId, updateServiceDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteService', () => {
    it('should delete a service', async () => {
      const serviceId = 'test-id';
      const expectedResult = {
        id: serviceId,
        name: 'Deleted Service',
      };

      mockServicesService.deleteService.mockResolvedValue(expectedResult);

      const result = await controller.deleteService(serviceId);

      expect(mockServicesService.deleteService).toHaveBeenCalledWith(serviceId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('addServiceItem', () => {
    it('should add a service item', async () => {
      const serviceId = 'service-id';
      const createServiceItemDto: CreateServiceItemDto = {
        name: 'Test Item',
        priceCents: 50000,
      };

      const expectedResult = {
        id: 'item-id',
        ...createServiceItemDto,
        serviceId,
        quantity: 1,
      };

      mockServicesService.addServiceItem.mockResolvedValue(expectedResult);

      const result = await controller.addServiceItem(serviceId, createServiceItemDto);

      expect(mockServicesService.addServiceItem).toHaveBeenCalledWith(serviceId, createServiceItemDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateServiceItem', () => {
    it('should update a service item', async () => {
      const serviceId = 'service-id';
      const itemId = 'item-id';
      const updateData = {
        name: 'Updated Item',
        priceCents: 75000,
      };

      const expectedResult = {
        id: itemId,
        ...updateData,
        serviceId,
      };

      mockServicesService.updateServiceItem.mockResolvedValue(expectedResult);

      const result = await controller.updateServiceItem(itemId, updateData);

      expect(mockServicesService.updateServiceItem).toHaveBeenCalledWith(itemId, updateData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteServiceItem', () => {
    it('should delete a service item', async () => {
      const serviceId = 'service-id';
      const itemId = 'item-id';
      const expectedResult = {
        id: itemId,
        name: 'Deleted Item',
      };

      mockServicesService.deleteServiceItem.mockResolvedValue(expectedResult);

      const result = await controller.deleteServiceItem(itemId);

      expect(mockServicesService.deleteServiceItem).toHaveBeenCalledWith(itemId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getServiceCategories', () => {
    it('should return service categories', () => {
      const expectedResult = [
        { value: ServiceCategory.INSTALLATION, label: 'Lắp đặt' },
        { value: ServiceCategory.MAINTENANCE, label: 'Bảo trì' },
      ];

      mockServicesService.getServiceCategories.mockReturnValue(expectedResult);

      const result = controller.getServiceCategories();

      expect(mockServicesService.getServiceCategories).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getServiceStats', () => {
    it('should return service statistics', async () => {
      const expectedResult = {
        totalServices: 10,
        activeServices: 8,
        totalBookings: 25,
        pendingBookings: 5,
        completedBookings: 20,
        totalRevenue: 5000000,
      };

      mockServicesService.getServiceStats.mockResolvedValue(expectedResult);

      const result = await controller.getServiceStats();

      expect(mockServicesService.getServiceStats).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});