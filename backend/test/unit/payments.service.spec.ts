import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../../src/modules/payments/payments.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    payment: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    paymentIntent: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    order: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    refund: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
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

    service = module.get<PaymentsService>(PaymentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createIntent', () => {
    it('should create payment intent successfully', async () => {
      const intentParams = {
        orderId: 'order_123',
        provider: 'MOMO' as const,
        idempotencyKey: 'key_123',
        returnUrl: 'http://localhost:3000/return',
      };

      const mockOrder = {
        id: intentParams.orderId,
        totalCents: 1000000,
        orderNo: 'ORD_123',
      };

      const mockIntent = {
        id: 'intent_123',
        orderId: intentParams.orderId,
        provider: intentParams.provider,
        amountCents: mockOrder.totalCents,
        status: 'PENDING',
        idempotencyKey: intentParams.idempotencyKey,
        returnUrl: intentParams.returnUrl,
      };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.paymentIntent.findUnique.mockResolvedValue(null);
      mockPrismaService.paymentIntent.create.mockResolvedValue(mockIntent);
      mockConfigService.get.mockReturnValue('test_config');

      const result = await service.createIntent(intentParams);

      expect(mockPrismaService.paymentIntent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          orderId: mockOrder.id,
          provider: intentParams.provider,
          amountCents: mockOrder.totalCents,
          status: 'PENDING',
          idempotencyKey: intentParams.idempotencyKey,
        }),
      });
      expect(result).toEqual(expect.objectContaining({
        intentId: mockIntent.id,
        redirectUrl: expect.any(String),
      }));
    });
  });

  describe('markPaid', () => {
    it('should mark payment as paid successfully', async () => {
      const provider = 'MOMO';
      const txnRef = 'intent_123';
      const transactionId = 'trans_123';

      const mockIntent = {
        id: txnRef,
        orderId: 'order_123',
        amountCents: 1000000,
        status: 'PENDING',
      };

      const mockOrder = {
        id: 'order_123',
        orderNo: 'ORD_123',
        status: 'PENDING',
      };

      mockPrismaService.paymentIntent.findUnique.mockResolvedValue(mockIntent);
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          payment: { create: jest.fn() },
          order: { update: jest.fn() },
          paymentIntent: { update: jest.fn() },
        });
      });

      const result = await service.markPaid(provider, txnRef, transactionId);

      expect(mockPrismaService.paymentIntent.findUnique).toHaveBeenCalledWith({
        where: { id: txnRef },
      });
      expect(result).toEqual({ ok: true });
    });

    it('should throw error if intent not found', async () => {
      const provider = 'MOMO';
      const txnRef = 'nonexistent_intent';

      mockPrismaService.paymentIntent.findUnique.mockResolvedValue(null);

      await expect(service.markPaid(provider, txnRef)).rejects.toThrow(
        'Intent not found'
      );
    });
  });

  describe('handleWebhook', () => {
    it('should handle MOMO webhook successfully', async () => {
      const webhookData = {
        orderId: 'ORD_123', // orderNo, not orderId
        resultCode: 0,
        transId: 'trans_123',
      };

      const mockOrder = {
        id: 'order_123',
        orderNo: 'ORD_123',
        status: 'PENDING',
      };

      const mockIntent = {
        id: 'intent_123',
        orderId: mockOrder.id,
        provider: 'MOMO',
        status: 'PENDING',
      };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.paymentIntent.findFirst.mockResolvedValue(mockIntent);
      mockPrismaService.paymentIntent.findUnique.mockResolvedValue(mockIntent);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          payment: { create: jest.fn() },
          order: { update: jest.fn() },
          paymentIntent: { update: jest.fn() },
        });
      });

      const result = await service.handleWebhook('MOMO', webhookData);

      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
        where: { orderNo: webhookData.orderId },
      });
      expect(result).toEqual({ resultCode: 0, message: 'success' });
    });

    it('should handle PAYOS webhook successfully', async () => {
      const webhookData = {
        orderCode: 'ORD_123', // orderNo
        code: '00',
        id: 'payos_trans_123',
      };

      const mockOrder = {
        id: 'order_123',
        orderNo: 'ORD_123',
        status: 'PENDING',
      };

      const mockIntent = {
        id: 'intent_123',
        orderId: mockOrder.id,
        provider: 'PAYOS',
        status: 'PENDING',
      };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.paymentIntent.findFirst.mockResolvedValue(mockIntent);
      mockPrismaService.paymentIntent.findUnique.mockResolvedValue(mockIntent);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          payment: { create: jest.fn() },
          order: { update: jest.fn() },
          paymentIntent: { update: jest.fn() },
        });
      });

      const result = await service.handleWebhook('PAYOS', webhookData);

      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
        where: { orderNo: webhookData.orderCode },
      });
      expect(result).toEqual({ error: 0, message: 'success' });
    });

    it('should handle failed payment webhook', async () => {
      const webhookData = {
        orderId: 'ORD_123', // orderNo
        resultCode: 1, // failed
        transId: 'trans_123',
      };

      const mockOrder = {
        id: 'order_123',
        orderNo: 'ORD_123',
        status: 'PENDING',
      };

      const mockIntent = {
        id: 'intent_123',
        orderId: mockOrder.id,
        provider: 'MOMO',
        status: 'PENDING',
      };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.paymentIntent.findFirst.mockResolvedValue(mockIntent);
      mockPrismaService.paymentIntent.findUnique.mockResolvedValue(mockIntent);
      mockPrismaService.paymentIntent.update.mockResolvedValue({
        ...mockIntent,
        status: 'FAILED',
      });

      const result = await service.handleWebhook('MOMO', webhookData);

      expect(mockPrismaService.paymentIntent.update).toHaveBeenCalledWith({
        where: { id: mockIntent.id },
        data: { status: 'FAILED' },
      });
      expect(result).toEqual({ resultCode: 0, message: 'success' });
    });
  });

  // Note: getPaymentStatus method doesn't exist in actual implementation
  // Removed this test block

  describe('createRefund', () => {
    it('should create refund successfully', async () => {
      const paymentId = 'payment_123';
      const amountCents = 500000;
      const reason = 'Customer request';

      const mockPayment = {
        id: paymentId,
        amountCents: 1000000,
        status: 'SUCCEEDED',
        provider: 'MOMO',
        order: { id: 'order_123' },
      };

      const mockRefund = {
        id: 'refund_123',
        paymentId,
        amountCents,
        reason,
        status: 'PENDING',
        createdAt: new Date(),
      };

      mockPrismaService.payment.findUnique.mockResolvedValue(mockPayment);
      mockPrismaService.refund.findMany.mockResolvedValue([]);
      mockPrismaService.refund.create.mockResolvedValue(mockRefund);
      mockPrismaService.refund.update.mockResolvedValue({
        ...mockRefund,
        status: 'SUCCEEDED',
      });

      const result = await service.createRefund(paymentId, amountCents, reason);

      expect(mockPrismaService.refund.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          paymentId,
          amountCents,
          reason,
          status: 'PENDING',
        }),
      });
      expect(result).toEqual(expect.objectContaining({
        refundId: mockRefund.id,
        success: expect.any(Boolean),
      }));
    });

    it('should throw error if payment not found', async () => {
      const paymentId = 'nonexistent_payment';

      mockPrismaService.payment.findUnique.mockResolvedValue(null);

      await expect(service.createRefund(paymentId)).rejects.toThrow(
        'Payment not found'
      );
    });

    it('should throw error if refund amount exceeds payment amount', async () => {
      const paymentId = 'payment_123';
      const amountCents = 1500000;

      const mockPayment = {
        id: paymentId,
        amountCents: 1000000,
        status: 'SUCCEEDED',
      };

      mockPrismaService.payment.findUnique.mockResolvedValue(mockPayment);

      await expect(service.createRefund(paymentId, amountCents)).rejects.toThrow(
        'Refund amount cannot exceed payment amount'
      );
    });
  });
});
