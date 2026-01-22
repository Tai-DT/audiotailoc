import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/modules/app.module';

describe('Checkout integration (idempotency & concurrency)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not create duplicate orders when using same idempotency key', async () => {
    // Create guest cart
    const { body: cartResp } = await request(app.getHttpServer()).post('/cart/guest').send();
    const cartId = cartResp.id;

    // Add item to cart (assume product exists in seeding)
    await request(app.getHttpServer()).post(`/cart/guest/${cartId}/add`).send({ productId: 'test-product-1', quantity: 1 });

    const payload = { cartId, customerEmail: 'test+idemp@example.com' };
    const idempotencyKey = 'test-idemp-12345';

    const p1 = request(app.getHttpServer()).post('/checkout/create-order').set('Idempotency-Key', idempotencyKey).send(payload);
    const p2 = request(app.getHttpServer()).post('/checkout/create-order').set('Idempotency-Key', idempotencyKey).send(payload);

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1.status).toBe(201); // or 200 depending on controller
    expect(r2.status).toBe(200);

    expect(r1.body.order.id).toBeDefined();
    expect(r2.body.order.id).toBe(r1.body.order.id); // same order returned
  }, 20000);
});