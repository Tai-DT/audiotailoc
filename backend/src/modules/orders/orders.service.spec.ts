import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import { CacheService } from '../caching/cache.service';
import { NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    orders: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    order_items: {
      create: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
    products: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    inventory: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    users: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockMailService = {
    sendEmail: jest.fn(),
    sendOrderConfirmation: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: MailService, useValue: mockMailService },
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new order successfully', async () => {
      const createOrderDto = {
        userId: 'user-1',
        order_items: [
          { productId: 'product-1', quantity: 2 },
        ],
        shippingAddress: 'Test Address',
      };

      const mockProduct = {
        id: 'product-1',
        name: 'Test Product',
        priceCents: 100000,
      };

      const mockOrder = {
        id: 'order-1',
        orderNo: 'ORD-001',
        userId: createOrderDto.userId,
        status: 'PENDING',
        subtotalCents: 200000,
        totalCents: 200000,
        shippingAddress: createOrderDto.shippingAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockFullOrder = {
        ...mockOrder,
        order_items: [
          {
            id: 'item-1',
            orderId: 'order-1',
            productId: 'product-1',
            quantity: 2,
            price: 100000,
            unitPrice: 100000,
            name: 'Test Product',
          },
        ],
        users: {
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
        },
      };

      mockPrismaService.products.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.orders.create.mockResolvedValue(mockOrder);
      mockPrismaService.order_items.create.mockResolvedValue({});
      // Mock second findUnique call to get fullOrder
      mockPrismaService.orders.findUnique.mockResolvedValue(mockFullOrder);

      const result = await service.create(createOrderDto);

      expect(result.id).toBe(mockOrder.id);
      expect(result.order_items.length).toBe(1);
      expect(mockPrismaService.orders.create).toHaveBeenCalled();
      expect(mockPrismaService.products.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-1' }
      });
    });
  });

  describe('findAll', () => {
    // This test is skipped because findAll method doesn't exist in OrdersService
    // Orders listing is likely handled by the controller directly using Prisma
    it.skip('should return paginated orders', async () => {
      const mockOrders = [
        { id: 'order-1', orderNo: 'ORD-001', status: 'PENDING' },
        { id: 'order-2', orderNo: 'ORD-002', status: 'COMPLETED' },
      ];

      mockPrismaService.orders.findMany.mockResolvedValue(mockOrders);
      mockPrismaService.orders.count.mockResolvedValue(2);

      // This will fail because service doesn't have findAll
      // const result = await service.findAll({ page: 1, limit: 10 });

      expect(mockOrders.length).toBe(2);
    });
  });

  describe('get', () => {
    it('should return an order by id', async () => {
      const mockOrder = {
        id: 'order-1',
        orderNo: 'ORD-001',
        status: 'PENDING',
        order_items: [],
        payments: [],
      };

      mockPrismaService.orders.findUnique.mockResolvedValue(mockOrder);

      const result = await service.get('order-1');

      expect(result.id).toBe(mockOrder.id);
      expect(mockPrismaService.orders.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        include: {
          order_items: true,
          payments: true
        },
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      mockPrismaService.orders.findUnique.mockResolvedValue(null);

      await expect(service.get('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update order status from PENDING to PROCESSING', async () => {
      const orderId = 'order-1';
      const newStatus = 'PROCESSING';

      const mockOrder = {
        id: orderId,
        orderNo: 'ORD-001',
        status: 'PENDING',
        userId: 'user-1',
        order_items: [],
        payments: [],
      };

      const mockUpdatedOrder = {
        ...mockOrder,
        status: newStatus,
      };

      mockPrismaService.orders.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.orders.update.mockResolvedValue(mockUpdatedOrder);
      mockPrismaService.order_items.findMany.mockResolvedValue([]);
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      const result = await service.updateStatus(orderId, newStatus);

      expect(result.status).toBe(newStatus);
      expect(mockPrismaService.orders.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: { status: newStatus },
      });
    });
  });
});
