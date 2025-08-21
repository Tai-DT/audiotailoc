import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  const mockPrismaService = {
    order: {
      findUnique: jest.fn(),
    },
    paymentIntent: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    payment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);

    // Default config values
    mockConfigService.get.mockImplementation((key: string) => {
      const configs = {
        'VNPAY_TMN_CODE': 'TEST',
        'VNPAY_HASH_SECRET': 'test_secret',
        'VNPAY_PAY_URL': 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
        'PAYOS_API_URL': 'https://api.payos.vn',
        'PAYOS_CLIENT_ID': 'test_client_id',
        'PAYOS_API_KEY': 'test_api_key',
        'PAYOS_CHECKSUM_KEY': 'test_checksum_key',
        'PAYOS_PARTNER_CODE': 'test_partner_code',
        'MOMO_ACCESS_KEY': 'test_access_key',
        'MOMO_SECRET_KEY': 'test_secret_key',
        'MOMO_PARTNER_CODE': 'test_partner_code',
        'PAYMENT_RETURN_URL': 'http://localhost:3000/return',
      };
      return configs[key] || '';
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createIntent', () => {
    const mockOrder = {
      id: 'order123',
      orderNo: 'ATL1234567890',
      totalCents: 50000,
    };

    const mockIntent = {
      id: 'intent123',
      orderId: 'order123',
      provider: 'VNPAY',
      amountCents: 50000,
      status: 'PENDING',
      idempotencyKey: 'key123',
      returnUrl: 'http://localhost:3000/return',
    };

    it('should create payment intent successfully', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.paymentIntent.findUnique.mockResolvedValue(null);
      mockPrismaService.paymentIntent.create.mockResolvedValue(mockIntent);

      const result = await service.createIntent({
        orderId: 'order123',
        provider: 'VNPAY',
        idempotencyKey: 'key123',
      });

      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order123' },
      });
      expect(mockPrismaService.paymentIntent.create).toHaveBeenCalledWith({
        data: {
          orderId: 'order123',
          provider: 'VNPAY',
          amountCents: 50000,
          status: 'PENDING',
          idempotencyKey: 'key123',
          returnUrl: null,
        },
      });
      expect(result).toHaveProperty('intentId');
      expect(result).toHaveProperty('redirectUrl');
    });

    it('should return existing intent for duplicate idempotency key', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.paymentIntent.findUnique.mockResolvedValue(mockIntent);

      const result = await service.createIntent({
        orderId: 'order123',
        provider: 'VNPAY',
        idempotencyKey: 'key123',
      });

      expect(mockPrismaService.paymentIntent.findUnique).toHaveBeenCalledWith({
        where: { idempotencyKey: 'key123' },
      });
      expect(mockPrismaService.paymentIntent.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        intentId: 'intent123',
        redirectUrl: 'http://localhost:3000/return',
      });
    });

    it('should throw error for non-existent order', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(
        service.createIntent({
          orderId: 'nonexistent',
          provider: 'VNPAY',
          idempotencyKey: 'key123',
        })
      ).rejects.toThrow('Order not found');
    });
  });

  describe('handleWebhook', () => {
    const mockIntent = {
      id: 'intent123',
      orderId: 'order123',
      provider: 'VNPAY',
      amountCents: 50000,
      status: 'PENDING',
    };

    it('should handle VNPAY webhook successfully', async () => {
      mockPrismaService.paymentIntent.findUnique.mockResolvedValue(mockIntent);
      mockPrismaService.paymentIntent.update.mockResolvedValue({
        ...mockIntent,
        status: 'COMPLETED',
      });
      mockPrismaService.payment.create.mockResolvedValue({});

      const webhookData = {
        vnp_TxnRef: 'intent123',
        vnp_ResponseCode: '00',
        vnp_Amount: '50000',
        vnp_SecureHash: 'valid_hash',
      };

      const result = await service.handleWebhook('VNPAY', webhookData);

      expect(mockPrismaService.paymentIntent.findUnique).toHaveBeenCalledWith({
        where: { id: 'intent123' },
      });
      expect(mockPrismaService.paymentIntent.update).toHaveBeenCalledWith({
        where: { id: 'intent123' },
        data: { status: 'COMPLETED' },
      });
      expect(result).toBe(true);
    });

    it('should handle failed payment webhook', async () => {
      mockPrismaService.paymentIntent.findUnique.mockResolvedValue(mockIntent);
      mockPrismaService.paymentIntent.update.mockResolvedValue({
        ...mockIntent,
        status: 'FAILED',
      });

      const webhookData = {
        vnp_TxnRef: 'intent123',
        vnp_ResponseCode: '99',
        vnp_Amount: '50000',
        vnp_SecureHash: 'valid_hash',
      };

      const result = await service.handleWebhook('VNPAY', webhookData);

      expect(mockPrismaService.paymentIntent.update).toHaveBeenCalledWith({
        where: { id: 'intent123' },
        data: { status: 'FAILED' },
      });
      expect(result).toBe(false);
    });

    it('should throw error for invalid webhook signature', async () => {
      const webhookData = {
        vnp_TxnRef: 'intent123',
        vnp_ResponseCode: '00',
        vnp_Amount: '50000',
        vnp_SecureHash: 'invalid_hash',
      };

      await expect(
        service.handleWebhook('VNPAY', webhookData)
      ).rejects.toThrow('Invalid webhook signature');
    });
  });

  describe('getPaymentHistory', () => {
    it('should return payment history for user', async () => {
      const mockPayments = [
        {
          id: 'payment1',
          orderId: 'order1',
          amountCents: 50000,
          status: 'COMPLETED',
          provider: 'VNPAY',
          createdAt: new Date(),
        },
      ];

      mockPrismaService.payment.findMany.mockResolvedValue(mockPayments);

      const result = await service.getPaymentHistory('user123', {
        page: 1,
        limit: 10,
      });

      expect(mockPrismaService.payment.findMany).toHaveBeenCalledWith({
        where: { order: { userId: 'user123' } },
        include: { order: true },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
      expect(result).toHaveProperty('payments');
      expect(result).toHaveProperty('pagination');
    });
  });

  describe('refundPayment', () => {
    it('should process refund successfully', async () => {
      const mockPayment = {
        id: 'payment123',
        orderId: 'order123',
        amountCents: 50000,
        status: 'COMPLETED',
        provider: 'VNPAY',
      };

      mockPrismaService.payment.findUnique.mockResolvedValue(mockPayment);
      mockPrismaService.payment.update.mockResolvedValue({
        ...mockPayment,
        status: 'REFUNDED',
      });

      const result = await service.refundPayment('payment123', 25000);

      expect(mockPrismaService.payment.findUnique).toHaveBeenCalledWith({
        where: { id: 'payment123' },
      });
      expect(mockPrismaService.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment123' },
        data: {
          status: 'REFUNDED',
          refundAmountCents: 25000,
          refundedAt: expect.any(Date),
        },
      });
      expect(result).toHaveProperty('refundId');
      expect(result).toHaveProperty('amount');
    });

    it('should throw error for non-existent payment', async () => {
      mockPrismaService.payment.findUnique.mockResolvedValue(null);

      await expect(
        service.refundPayment('nonexistent', 25000)
      ).rejects.toThrow('Payment not found');
    });

    it('should throw error for invalid refund amount', async () => {
      const mockPayment = {
        id: 'payment123',
        amountCents: 50000,
        status: 'COMPLETED',
      };

      mockPrismaService.payment.findUnique.mockResolvedValue(mockPayment);

      await expect(
        service.refundPayment('payment123', 60000)
      ).rejects.toThrow('Refund amount cannot exceed payment amount');
    });
  });
});
