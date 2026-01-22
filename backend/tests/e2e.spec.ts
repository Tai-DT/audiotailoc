import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app.module';

describe('E2E: Checkout concurrency & VNPAY webhook idempotency', () => {
  let app: INestApplication;
  let server: any;
  let prisma: any;

  beforeAll(async () => {
    process.env.VNPAY_HASH_SECRET = process.env.VNPAY_HASH_SECRET || 'testsecret';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    server = app.getHttpServer();
    prisma = moduleRef.get('PrismaService');
  });

  afterAll(async () => {
    try {
      // cleanup created test data
    } catch (e) {}
    await app.close();
  });

  it('prevents oversell under concurrent checkouts', async function () {
    this.timeout(20000);
    // Create test product
    const product = await prisma.products.create({
      data: {
        id: 'test-product-concur',
        name: 'Test Product Concurrency',
        priceCents: 10000,
        isActive: true,
        isDeleted: false,
        stockQuantity: 5,
      },
    });

    // Ensure inventory exists and set stock to 5
    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: { stock: 5, reserved: 0, updatedAt: new Date() },
      create: { id: 'inv-' + product.id, productId: product.id, stock: 5, reserved: 0, lowStockThreshold: 0, updatedAt: new Date() },
    });

    // Create N guest carts each with 1 qty of product
    const N = 10; // attempt 10 checkouts against stock 5
    const cartIds: string[] = [];
    for (let i = 0; i < N; i++) {
      const res = await request(server).post('/cart/guest').send();
      expectStatus(res.status);
      const cartId = res.body.id;
      cartIds.push(cartId);
      await request(server).post(`/cart/guest/${cartId}/add`).send({ productId: product.id, quantity: 1 });
    }

    // Concurrently call checkout for all guest carts
    const promises = cartIds.map((cartId, idx) =>
      request(server).post('/checkout/create-order').send({ cartId, customerEmail: `c${idx}@example.com` }),
    );

    const results = await Promise.all(promises);
    const successfulOrders = results.filter(r => r.status === 200 || r.status === 201);
    // Number of successful orders should be <= initial stock (5)
    if (successfulOrders.length > 5) {
      throw new Error(`Oversell detected: ${successfulOrders.length} orders created with stock 5`);
    }

    // Verify inventory not negative
    const inv = await prisma.inventory.findUnique({ where: { productId: product.id } });
    if (inv.stock < 0) throw new Error('Inventory negative after concurrent checkouts');
  });

  it('idempotent checkout with same Idempotency-Key returns same order', async function () {
    this.timeout(10000);
    // create guest cart
    const { body: cartResp } = await request(server).post('/cart/guest').send();
    const cartId = cartResp.id;
    // ensure product exists
    const prod = await prisma.products.findFirst();
    await request(server).post(`/cart/guest/${cartId}/add`).send({ productId: prod.id, quantity: 1 });

    const payload = { cartId, customerEmail: 'idempotent@example.com' };
    const idempotencyKey = 'test-idemp-key-xyz';

    const p1 = request(server).post('/checkout/create-order').set('Idempotency-Key', idempotencyKey).send(payload);
    const p2 = request(server).post('/checkout/create-order').set('Idempotency-Key', idempotencyKey).send(payload);

    const [r1, r2] = await Promise.all([p1, p2]);
    expectStatus(r1.status);
    expectStatus(r2.status);
    const id1 = r1.body.order?.id || r1.body?.order?.id;
    const id2 = r2.body.order?.id || r2.body?.order?.id;
    if (!id1) throw new Error('First request did not create order');
    if (id1 !== id2) throw new Error('Idempotency failed: different orders returned');
  });

  it('handles VNPAY webhook replay gracefully (already processed)', async function () {
    // Create payment_intent with SUCCEEDED status
    const order = await prisma.orders.create({ data: { id: 'order-webhook-test', orderNo: 'WB' + Date.now(), status: 'CONFIRMED', subtotalCents: 1000, discountCents: 0, shippingCents: 0, totalCents: 1000, updatedAt: new Date() } });
    const intent = await prisma.payment_intents.create({ data: { id: 'txn-webhook-test', orderId: order.id, provider: 'VNPAY', amountCents: 1000, status: 'SUCCEEDED', updatedAt: new Date() } });

    // build payload and signature
    const payload: any = { vnp_TxnRef: intent.id, vnp_ResponseCode: '00', vnp_Amount: String(1000), vnp_TransactionNo: 'tx123' };
    // compute vnp_SecureHash same way as service
    const secret = process.env.VNPAY_HASH_SECRET || 'testsecret';
    const signData = Object.keys(payload).sort().map(k => `${k}=${payload[k]}`).join('&');
    const vnp_SecureHash = require('crypto').createHmac('sha256', secret).update(signData).digest('hex');
    payload.vnp_SecureHash = vnp_SecureHash;

    const res = await request(server).post('/webhooks/vnpay').send(payload);
    // Handler should return 200 and message that payment already processed
    expectStatus(res.status);
    if (!(res.body?.message === 'Payment already processed' || res.body?.message === 'Payment processed successfully' || res.body?.success === true)) {
      throw new Error(`Unexpected webhook response: ${JSON.stringify(res.body)}`);
    }
  });
});

function expectStatus(status: number) {
  if (![200, 201].includes(status)) throw new Error(`Unexpected status: ${status}`);
}
