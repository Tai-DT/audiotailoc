import { BookingService } from '../src/modules/booking/booking.service';
import { ServiceBookingStatus, PaymentStatus, PaymentProvider } from '../src/common/enums';

function createMockPrisma() {
  const calls: any[] = [];
  const history: any[] = [];

  const prisma: any = {
    service: {
      findUnique: jest.fn().mockResolvedValue({ id: 'svc1', basePriceCents: 1000, items: [] }),
    },
    serviceBooking: {
      findUnique: jest.fn().mockResolvedValue({ id: 'b1', status: ServiceBookingStatus.PENDING }),
      update: jest.fn().mockImplementation(async ({ data }: any) => ({ id: 'b1', ...data })),
      count: jest.fn().mockResolvedValue(0),
    },
    serviceBookingItem: {
      aggregate: jest.fn().mockResolvedValue({ _sum: { price: 5000 } }),
      create: jest.fn(),
    },
    serviceStatusHistory: {
      create: jest.fn().mockImplementation((args: any) => {
        history.push(args.data);
        return args;
      }),
    },
    servicePayment: {
      create: jest.fn().mockResolvedValue({ id: 'p1' }),
      update: jest.fn().mockResolvedValue({ id: 'p1' }),
    },
    $transaction: jest.fn().mockImplementation(async (fnOrOps: any) => {
      if (typeof fnOrOps === 'function') return fnOrOps(prisma);
      return Promise.all(fnOrOps);
    }),
  };
  return { prisma, calls, history };
}

describe('BookingService lifecycle (smoke)', () => {
  it('completes booking and computes actualCosts, logs history', async () => {
    const { prisma, history } = createMockPrisma();
    const svc = new BookingService(prisma);

    const result = await svc.updateBookingStatus('b1', ServiceBookingStatus.COMPLETED, 'done', 'tester');
    expect(prisma.serviceBookingItem.aggregate).toHaveBeenCalled();
    expect(prisma.serviceBooking.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: ServiceBookingStatus.COMPLETED, actualCosts: 5000 }) })
    );
    // history recorded
    expect(prisma.serviceStatusHistory.create).toHaveBeenCalled();
    expect(history[history.length - 1]).toEqual(
      expect.objectContaining({ bookingId: 'b1', status: ServiceBookingStatus.COMPLETED, newStatus: ServiceBookingStatus.COMPLETED, note: 'done', changedBy: 'tester' })
    );
  });

  it('creates and updates payment status', async () => {
    const { prisma } = createMockPrisma();
    const svc = new BookingService(prisma);

    prisma.serviceBooking.findUnique.mockResolvedValue({ id: 'b1' });
    await svc.createPayment('b1', { amountCents: 12000, paymentMethod: PaymentProvider.CASH });
    expect(prisma.servicePayment.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ bookingId: 'b1', amountCents: 12000 }) })
    );

    await svc.updatePaymentStatus('p1', PaymentStatus.SUCCEEDED, 'txn_1');
    expect(prisma.servicePayment.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'p1' }, data: expect.objectContaining({ status: PaymentStatus.SUCCEEDED, transactionId: 'txn_1' }) })
    );
  });
});

