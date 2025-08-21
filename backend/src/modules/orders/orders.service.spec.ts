import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
import { MailService } from '../notifications/mail.service';
import { RealtimeGateway } from '../../websocket/websocket.gateway';
import { TestUtils } from '../../test/test-utils';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;
  let ordersGateway: OrdersGateway;
  let mailService: MailService;
  let websocketGateway: WebSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await TestUtils.createTestingModule(
      [],
      [
        OrdersService,
        {
          provide: OrdersGateway,
          useValue: {
            emitUpdate: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            send: jest.fn(),
            sendOrderStatusUpdate: jest.fn(),
          },
        },
        {
          provide: WebSocketGateway,
          useValue: {
            notifyOrderUpdate: jest.fn(),
            notifyNewOrder: jest.fn(),
          },
        },
      ]
    );

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
    ordersGateway = module.get<OrdersGateway>(OrdersGateway);
    mailService = module.get<MailService>(MailService);
    websocketGateway = module.get<WebSocketGateway>(WebSocketGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('list', () => {
    it('should return paginated orders', async () => {
      const mockOrders = [
        TestUtils.createMockOrder({ id: '1', orderNo: 'ORD-001' }),
        TestUtils.createMockOrder({ id: '2', orderNo: 'ORD-002' }),
      ];

      const mockCount = 2;

      (prismaService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
      (prismaService.order.count as jest.Mock).mockResolvedValue(mockCount);

      const result = await service.list({
        page: 1,
        pageSize: 10,
      });

      expect(result).toEqual({
        items: mockOrders,
        totalCount: mockCount,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      });

      expect(prismaService.order.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: { items: true, user: { select: { email: true } } },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter orders by user', async () => {
      const mockOrders = [TestUtils.createMockOrder()];
      const mockCount = 1;

      (prismaService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
      (prismaService.order.count as jest.Mock).mockResolvedValue(mockCount);

      await service.list({
        page: 1,
        pageSize: 10,
        userId: 'user-id',
      });

      expect(prismaService.order.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: { items: true, user: { select: { email: true } } },
        where: { userId: 'user-id' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter orders by status', async () => {
      const mockOrders = [TestUtils.createMockOrder()];
      const mockCount = 1;

      (prismaService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
      (prismaService.order.count as jest.Mock).mockResolvedValue(mockCount);

      await service.list({
        page: 1,
        pageSize: 10,
        status: 'PAID',
      });

      expect(prismaService.order.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: { items: true, user: { select: { email: true } } },
        where: { status: 'PAID' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('get', () => {
    it('should return an order by id', async () => {
      const mockOrder = TestUtils.createMockOrder();
      (prismaService.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);

      const result = await service.get('order-id');

      expect(result).toEqual(mockOrder);
      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-id' },
        include: { items: true, user: { select: { email: true } } },
      });
    });

    it('should throw error if order not found', async () => {
      (prismaService.order.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.get('non-existent')).rejects.toThrow('Order not found');
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const mockOrder = TestUtils.createMockOrder({ status: 'PENDING', userId: 'user-id' });
      const updatedOrder = { ...mockOrder, status: 'PAID' };
      const mockUser = TestUtils.createMockUser();
      const mockOrderWithItems = { ...mockOrder, items: [] };

      (prismaService.order.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockOrder) // First call in get()
        .mockResolvedValueOnce(mockUser) // User lookup
        .mockResolvedValueOnce(mockOrderWithItems); // Order with items lookup

      (prismaService.order.update as jest.Mock).mockResolvedValue(updatedOrder);

      const result = await service.updateStatus('order-id', 'PAID');

      expect(result).toEqual(updatedOrder);
      expect(prismaService.order.update).toHaveBeenCalledWith({
        where: { id: 'order-id' },
        data: { status: 'PAID' },
      });
      expect(ordersGateway.emitUpdate).toHaveBeenCalledWith({
        id: 'order-id',
        status: 'PAID',
      });
      expect(websocketGateway.notifyOrderUpdate).toHaveBeenCalled();
    });

    it('should throw error for invalid status transition', async () => {
      const mockOrder = TestUtils.createMockOrder({ status: 'DELIVERED' });
      (prismaService.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);

      await expect(service.updateStatus('order-id', 'PENDING')).rejects.toThrow(
        BadRequestException
      );
    });

    it('should allow valid status transitions', async () => {
      const mockOrder = TestUtils.createMockOrder({ status: 'PENDING' });
      const updatedOrder = { ...mockOrder, status: 'CONFIRMED' };

      (prismaService.order.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockOrder)
        .mockResolvedValueOnce(null) // No user found
        .mockResolvedValueOnce({ ...mockOrder, items: [] });

      (prismaService.order.update as jest.Mock).mockResolvedValue(updatedOrder);

      const result = await service.updateStatus('order-id', 'CONFIRMED');

      expect(result).toEqual(updatedOrder);
    });
  });

  describe('create', () => {
    it('should create a new order and send notifications', async () => {
      const orderData = {
        userId: 'user-id',
        orderNo: 'ORD-001',
        totalCents: 100000,
        status: 'PENDING',
        items: [
          {
            productId: 'product-id',
            productName: 'Test Product',
            quantity: 1,
            priceCents: 100000,
          },
        ],
      };

      const mockOrder = TestUtils.createMockOrder(orderData);
      (prismaService.order.create as jest.Mock).mockResolvedValue(mockOrder);

      const result = await service.create(orderData);

      expect(result).toEqual(mockOrder);
      expect(prismaService.order.create).toHaveBeenCalledWith({
        data: orderData,
        include: { items: true },
      });
      expect(websocketGateway.notifyNewOrder).toHaveBeenCalledWith({
        id: mockOrder.id,
        orderNo: mockOrder.orderNo,
        totalCents: mockOrder.totalCents,
        userId: mockOrder.userId,
        status: mockOrder.status,
        itemCount: mockOrder.items.length,
      });
    });
  });
});
