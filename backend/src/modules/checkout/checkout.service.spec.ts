import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PromotionService } from '../promotions/promotion.service';
import { MailService } from '../notifications/mail.service';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let prismaService: PrismaService;
  let cartService: CartService;
  let promotionService: PromotionService;
  let mailService: MailService;

  const mockPrismaService = {
    $transaction: jest.fn(),
    order: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    orderItem: {
      create: jest.fn(),
    },
    inventory: {
      updateMany: jest.fn(),
    },
    cart: {
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockCartService = {
    getCartWithTotals: jest.fn(),
  };

  const mockPromotionService = {
    validate: jest.fn(),
    computeDiscount: jest.fn(),
  };

  const mockMailService = {
    sendOrderConfirmation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CartService, useValue: mockCartService },
        { provide: PromotionService, useValue: mockPromotionService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<CheckoutService>(CheckoutService);
    prismaService = module.get<PrismaService>(PrismaService);
    cartService = module.get<CartService>(CartService);
    promotionService = module.get<PromotionService>(PromotionService);
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    const userId = 'user123';
    const cartItems = [
      {
        productId: 'prod1',
        quantity: 2,
        unitPrice: 10000,
        product: {
          id: 'prod1',
          name: 'Test Product',
          priceCents: 10000,
          imageUrl: 'test.jpg',
        },
      },
    ];

    const mockCart = {
      id: 'cart123',
      userId,
      status: 'ACTIVE',
    };

    const mockOrder = {
      id: 'order123',
      orderNo: 'ATL1234567890',
      userId,
      status: 'PENDING',
      subtotalCents: 20000,
      discountCents: 0,
      shippingCents: 30000,
      totalCents: 50000,
    };

    beforeEach(() => {
      mockCartService.getCartWithTotals.mockResolvedValue({
        cart: mockCart,
        items: cartItems,
        subtotalCents: 20000,
      });

      mockPromotionService.validate.mockResolvedValue(null);
      mockPromotionService.computeDiscount.mockReturnValue(0);

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return await callback(mockPrismaService);
      });

      mockPrismaService.order.create.mockResolvedValue(mockOrder);
      mockPrismaService.inventory.updateMany.mockResolvedValue({ count: 1 });
      mockPrismaService.orderItem.create.mockResolvedValue({});
      mockPrismaService.cart.update.mockResolvedValue({});
    });

    it('should create order successfully', async () => {
      const params = {
        promotionCode: undefined,
        shippingAddress: { name: 'Test User', phone: '0123456789' },
      };

      const result = await service.createOrder(userId, params);

      expect(mockCartService.getCartWithTotals).toHaveBeenCalledWith(userId);
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          orderNo: expect.stringMatching(/^ATL\d+$/),
          userId,
          status: 'PENDING',
          subtotalCents: 20000,
          discountCents: 0,
          shippingCents: 30000,
          totalCents: 50000,
          promotionCode: null,
          shippingAddress: params.shippingAddress,
        },
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw error for empty cart', async () => {
      mockCartService.getCartWithTotals.mockResolvedValue({
        cart: mockCart,
        items: [],
        subtotalCents: 0,
      });

      const params = {};

      await expect(service.createOrder(userId, params)).rejects.toThrow(
        new BadRequestException('Giỏ hàng trống')
      );
    });

    it('should apply promotion discount', async () => {
      const promotion = { code: 'SAVE10', type: 'PERCENT', value: 10 };
      mockPromotionService.validate.mockResolvedValue(promotion);
      mockPromotionService.computeDiscount.mockReturnValue(2000);

      const params = { promotionCode: 'SAVE10' };

      await service.createOrder(userId, params);

      expect(mockPromotionService.validate).toHaveBeenCalledWith('SAVE10');
      expect(mockPromotionService.computeDiscount).toHaveBeenCalledWith(promotion, 20000);
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          discountCents: 2000,
          totalCents: 48000, // 20000 - 2000 + 30000
          promotionCode: 'SAVE10',
        }),
      });
    });

    it('should check inventory before creating order', async () => {
      const params = {};

      await service.createOrder(userId, params);

      expect(mockPrismaService.inventory.updateMany).toHaveBeenCalledWith({
        where: {
          productId: 'prod1',
          stock: { gte: 2 },
          reserved: { gte: 2 },
        },
        data: {
          stock: { decrement: 2 },
          reserved: { decrement: 2 },
        },
      });
    });

    it('should throw error when insufficient inventory', async () => {
      mockPrismaService.inventory.updateMany.mockResolvedValue({ count: 0 });

      const params = {};

      await expect(service.createOrder(userId, params)).rejects.toThrow(
        new BadRequestException('Sản phẩm tạm hết hàng: Test Product')
      );
    });

    it('should handle idempotency check', async () => {
      const existingOrder = { ...mockOrder, id: 'existing_order' };
      mockPrismaService.order.findFirst.mockResolvedValue(existingOrder);

      const params = { idempotencyKey: 'key123' };

      const result = await service.createOrder(userId, params);

      expect(mockPrismaService.order.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          createdAt: expect.any(Object),
        },
      });
      expect(result).toEqual(existingOrder);
      expect(mockPrismaService.order.create).not.toHaveBeenCalled();
    });

    it('should send confirmation email when user has email', async () => {
      const user = { id: userId, email: 'test@example.com', name: 'Test User' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const params = {};

      await service.createOrder(userId, params);

      expect(mockMailService.sendOrderConfirmation).toHaveBeenCalledWith(
        'test@example.com',
        expect.objectContaining({
          orderNo: expect.stringMatching(/^ATL\d+$/),
          customerName: 'Test User',
          totalAmount: '500 VNĐ',
          items: expect.arrayContaining([
            expect.objectContaining({
              name: 'Test Product',
              quantity: 2,
              price: '100 VNĐ',
            }),
          ]),
        })
      );
    });

    it('should not send email when user has no email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const params = {};

      await service.createOrder(userId, params);

      expect(mockMailService.sendOrderConfirmation).not.toHaveBeenCalled();
    });
  });

  describe('getOrderForUserByNo', () => {
    it('should return order for valid order number', async () => {
      const orderNo = 'ATL1234567890';
      const mockOrder = {
        id: 'order123',
        orderNo,
        userId,
        items: [],
        payments: [],
      };

      mockPrismaService.order.findFirst.mockResolvedValue(mockOrder);

      const result = await service.getOrderForUserByNo(userId, orderNo);

      expect(mockPrismaService.order.findFirst).toHaveBeenCalledWith({
        where: { orderNo, userId },
        include: { items: true, payments: true },
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw error for non-existent order', async () => {
      const orderNo = 'INVALID_ORDER';
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.getOrderForUserByNo(userId, orderNo)).rejects.toThrow(
        'Không tìm thấy đơn hàng'
      );
    });
  });
});
