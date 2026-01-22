import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app.module';

describe('Webhooks signature & idempotency', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => await app.close());

  it('rejects invalid VNPAY signature', async () => {
    const payload = { vnp_TxnRef: 'notfound', vnp_ResponseCode: '00' };
    const res = await request(app.getHttpServer()).post('/webhooks/vnpay').send(payload);
    expect(res.status).toBe(400);
  });
});