import { PromotionsService } from './promotions.service';

describe('PromotionsService - Buy X Get Y', () => {
  const mockPrisma: any = {
    promotions: {
      findUnique: jest.fn(),
    },
  };

  const service = new PromotionsService(mockPrisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should apply FREE buy X get Y discount to cheapest eligible items', async () => {
    mockPrisma.promotions.findUnique.mockResolvedValue({
      id: 'promo-1',
      code: 'B2G1',
      name: 'Buy 2 Get 1',
      type: 'BUY_X_GET_Y',
      value: 0,
      isActive: true,
      starts_at: null,
      expiresAt: null,
      min_order_amount: null,
      max_discount: null,
      metadata: {
        buyQuantity: 2,
        getQuantity: 1,
        discountType: 'FREE',
        buyProducts: ['p1'],
        getProducts: ['p1'],
      },
    });

    const cartItems = [{ productId: 'p1', categoryId: 'c1', quantity: 3, priceCents: 10000 }];

    const result = await service.applyToCart('B2G1', cartItems);

    expect(result.valid).toBe(true);
    expect(result.totalDiscount).toBe(10000); // 1 item free
    expect(result.itemDiscounts[0]).toMatchObject({
      productId: 'p1',
      quantity: 1,
      discount: 10000,
    });
  });

  it('should apply percentage discount for get items when discountType=PERCENTAGE', async () => {
    mockPrisma.promotions.findUnique.mockResolvedValue({
      id: 'promo-2',
      code: 'B1G150',
      name: 'Buy 1 Get 1 50%',
      type: 'BUY_X_GET_Y',
      value: 0,
      isActive: true,
      starts_at: null,
      expiresAt: null,
      min_order_amount: null,
      max_discount: null,
      metadata: {
        buyQuantity: 1,
        getQuantity: 1,
        discountType: 'PERCENTAGE',
        discountValue: 50,
      },
    });

    const cartItems = [{ productId: 'p1', categoryId: 'c1', quantity: 2, priceCents: 20000 }];

    const result = await service.applyToCart('B1G150', cartItems);

    expect(result.valid).toBe(true);
    expect(result.totalDiscount).toBe(20000); // 50% of two get-eligible units
    expect(result.itemDiscounts[0]).toMatchObject({
      productId: 'p1',
      discount: 20000,
    });
  });
});
