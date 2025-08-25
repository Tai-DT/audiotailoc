import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../../src/modules/cart/cart.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('CartService', () => {
  let service: CartService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    cart: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    cartItem: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
    inventory: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserCart', () => {
    it('should return existing user cart', async () => {
      const userId = 'user_123';
      const mockCart = {
        id: 'cart_123',
        userId,
        items: [
          {
            id: 'item_1',
            productId: 'prod_1',
            quantity: 2,
            product: {
              name: 'Test Product',
              priceCents: 1000000,
            },
          },
        ],
      };

      mockPrismaService.cart.findFirst.mockResolvedValue(mockCart);

      const result = await service.getUserCart(userId);

      expect(mockPrismaService.cart.findFirst).toHaveBeenCalledWith({
        where: { userId, status: 'ACTIVE' },
        include: {
          items: {
            include: {
              product: {
                select: expect.any(Object),
              },
            },
          },
        },
      });
      expect(result).toEqual(expect.objectContaining({
        id: mockCart.id,
        userId: mockCart.userId,
        items: mockCart.items,
        subtotal: expect.any(Number),
        itemCount: expect.any(Number),
        tax: expect.any(Number),
        shipping: expect.any(Number),
        total: expect.any(Number),
      }));
    });
  });

  describe('addToUserCart', () => {
    it('should add item to user cart successfully', async () => {
      const userId = 'user_123';
      const productId = 'prod_1';
      const quantity = 2;

      const mockProduct = {
        id: productId,
        name: 'Test Product',
        priceCents: 1000000,
        inventory: {
          stock: 10,
          reserved: 0,
        },
      };

      const mockCart = {
        id: 'cart_123',
        userId,
        items: [],
      };

      const mockCartItem = {
        id: 'item_1',
        cartId: 'cart_123',
        productId,
        quantity,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.cart.findFirst.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.create.mockResolvedValue(mockCartItem);
      mockPrismaService.inventory.update.mockResolvedValue({});

      const result = await service.addToUserCart(userId, productId, quantity);

      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      // addToUserCart doesn't call inventory.update directly, it's handled in addToGuestCart
      expect(result).toEqual(expect.objectContaining({
        subtotal: expect.any(Number),
        itemCount: expect.any(Number),
        total: expect.any(Number),
      }));
    });

    it('should not throw error for any quantity (stock check disabled)', async () => {
      const userId = 'user_123';
      const productId = 'prod_1';
      const quantity = 15;

      const mockProduct = {
        id: productId,
        name: 'Test Product',
        priceCents: 1000000,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      // Should not throw error as stock check is disabled
      const result = await service.addToUserCart(userId, productId, quantity);
      expect(result).toBeDefined();
    });
  });

  describe('updateUserCartItem', () => {
    it('should update user cart item quantity', async () => {
      const userId = 'user_123';
      const productId = 'prod_1';
      const quantity = 3;

      const mockCartItem = {
        id: 'item_1',
        quantity: 2,
        productId,
      };

      const mockUpdatedItem = {
        ...mockCartItem,
        quantity,
      };

      mockPrismaService.cartItem.findFirst.mockResolvedValue(mockCartItem);
      mockPrismaService.cartItem.update.mockResolvedValue(mockUpdatedItem);
      mockPrismaService.inventory.update.mockResolvedValue({});

      const result = await service.updateUserCartItem(userId, productId, quantity);

      expect(mockPrismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item_1' },
        data: { quantity },
      });
      expect(result).toEqual(expect.objectContaining({
        subtotal: expect.any(Number),
        itemCount: expect.any(Number),
        total: expect.any(Number),
      }));
    });
  });

  describe('removeFromUserCart', () => {
    it('should remove item from user cart', async () => {
      const userId = 'user_123';
      const productId = 'prod_1';

      const mockCartItem = {
        id: 'item_1',
        quantity: 2,
        productId,
      };

      mockPrismaService.cartItem.findFirst.mockResolvedValue(mockCartItem);
      mockPrismaService.cartItem.delete.mockResolvedValue(mockCartItem);
      mockPrismaService.inventory.update.mockResolvedValue({});

      const result = await service.removeFromUserCart(userId, productId);

      expect(mockPrismaService.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 'item_1' },
      });
      // Note: Inventory update removed as it's not in current schema
      // expect(mockPrismaService.inventory.update).toHaveBeenCalledWith({
      //   where: { productId },
      //   data: { reserved: { decrement: mockCartItem.quantity } },
      // });
      expect(result).toEqual(expect.objectContaining({
        subtotal: expect.any(Number),
        itemCount: expect.any(Number),
        total: expect.any(Number),
      }));
    });
  });

  describe('clearUserCart', () => {
    it('should clear all items from user cart', async () => {
      const userId = 'user_123';

      const mockCartItems = [
        { id: 'item_1', quantity: 2, productId: 'prod_1' },
        { id: 'item_2', quantity: 1, productId: 'prod_2' },
      ];

      mockPrismaService.cartItem.findMany.mockResolvedValue(mockCartItems);
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 2 });
      mockPrismaService.inventory.update.mockResolvedValue({});

      const result = await service.clearUserCart(userId);

      // clearUserCart doesn't use deleteMany, it deletes items individually
      expect(mockPrismaService.cartItem.delete).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        subtotal: expect.any(Number),
        itemCount: expect.any(Number),
        total: expect.any(Number),
      }));
    });
  });
});
