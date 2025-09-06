import { OrdersService } from '../src/modules/orders/orders.service';

function createMockPrisma() {
  const prisma: any = {
    product: {
      findUnique: jest.fn().mockResolvedValue({ id: 'prod1', priceCents: 2500 }),
    },
    order: {
      create: jest.fn().mockImplementation(async ({ data }: any) => ({ id: 'o1', ...data, items: data.items.create })),
    },
  };
  return prisma;
}

describe('OrdersService create (smoke)', () => {
  it('computes subtotal and persists item unitPrice/name and shippingAddress string', async () => {
    const prisma = createMockPrisma();
    const mail: any = { sendOrderStatusUpdate: jest.fn() };
    const svc = new OrdersService(prisma as any, mail);

    const order = await svc.create({
      userId: 'u1',
      shippingAddress: { city: 'HCM' },
      items: [
        { productId: 'prod1', quantity: 2 },
        { productId: 'prod1', unitPrice: 1000, quantity: 1 },
      ],
    });

    expect(prisma.order.create).toHaveBeenCalled();
    // subtotal: 2*2500 + 1*1000 = 6000
    expect(order.subtotalCents).toBe(6000);
    expect(order.totalCents).toBe(6000);
    expect(typeof order.shippingAddress === 'string' || order.shippingAddress === null).toBe(true);
    const items = order.items as any[];
    expect(items[0]).toEqual(expect.objectContaining({ productId: 'prod1', unitPrice: 2500 }));
    expect(items[1]).toEqual(expect.objectContaining({ unitPrice: 1000 }));
  });
});

