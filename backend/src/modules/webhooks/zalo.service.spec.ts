import { ZaloService } from './zalo.service';
import { UnauthorizedException } from '@nestjs/common';

describe('ZaloService', () => {
  const mockConfig: any = {
    get: jest.fn((key: string) => {
      if (key === 'ZALO_OA_SECRET') return 'secret123';
      if (key === 'ZALO_OA_ACCESS_TOKEN') return 'token123';
      return null;
    }),
  };

  const mockPrisma: any = {
    customer_questions: {
      create: jest.fn().mockResolvedValue({ id: 'question-1' }),
    },
  };

  const service = new ZaloService(mockConfig as any, mockPrisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws UnauthorizedException for invalid signature when secret is set', async () => {
    const headers = { 'x-zalo-signature': 'invalid' };
    const body = { message: { text: 'hello' } };

    await expect(service.handleIncoming(headers, body)).rejects.toThrow(UnauthorizedException);
    expect(mockPrisma.customer_questions.create).not.toHaveBeenCalled();
  });

  it('accepts valid signature and creates customer question', async () => {
    const body = { message: { text: 'hi' } };
    const payload = JSON.stringify(body);
    const crypto = await import('crypto');
    const signature = crypto.createHmac('sha256', 'secret123').update(payload).digest('hex');

    const headers = { 'x-zalo-signature': signature };

    const id = await service.handleIncoming(headers, body);

    expect(id).toBe('question-1');
    expect(mockPrisma.customer_questions.create).toHaveBeenCalledTimes(1);
  });
});
