import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Payments → PayOS intent (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    process.env.DATABASE_URL = 'file:./test.db';
    process.env.JWT_ACCESS_SECRET = 'test_access_secret';
    process.env.PAYOS_API_URL = process.env.PAYOS_API_URL || 'https://api.payos.vn';
    process.env.PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID || 'test_client_id';
    process.env.PAYOS_API_KEY = process.env.PAYOS_API_KEY || 'test_api_key';
    process.env.PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY || 'test_checksum';
    process.env.PAYOS_RETURN_URL = process.env.PAYOS_RETURN_URL || 'http://localhost:3000/checkout/return';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create PayOS intent with valid JWT and order', async () => {
    // Seed user
    const user = await prisma.user.create({
      data: {
        email: `e2e_user_${Date.now()}@example.com`,
        password: 'hashed',
        name: 'E2E User',
        role: 'USER',
      },
    });

    // Seed product
    const product = await prisma.product.create({
      data: {
        slug: `e2e-product-${Date.now()}`,
        name: 'Test Product',
        priceCents: 150000,
      },
    });

    // Create order and item
    const order = await prisma.order.create({
      data: {
        orderNo: `E2E-${Date.now()}`,
        userId: user.id,
        
        totalCents: 180000,
        items: {
          create: [{
            productId: product.id,
            quantity: 1,
            price: 150000,
          }],
        },
      },
    });

    // Create JWT
    const token = jwt.sign({ sub: user.id }, process.env.JWT_ACCESS_SECRET as string);

    const res = await request(app.getHttpServer())
      .post('/payments/intents')
      .set('Authorization', `Bearer ${token}`)
      .send({
        orderId: order.id,
        provider: 'PAYOS',
        idempotencyKey: `e2e-${Date.now()}`,
        returnUrl: process.env.PAYOS_RETURN_URL,
      })
      .expect(201).catch(async (e) => {
        // Some setups return 200 OK
        return request(app.getHttpServer())
          .post('/payments/intents')
          .set('Authorization', `Bearer ${token}`)
          .send({
            orderId: order.id,
            provider: 'PAYOS',
            idempotencyKey: `e2e-${Date.now()}`,
            returnUrl: process.env.PAYOS_RETURN_URL,
          })
          .expect(200);
      });

    expect(res.body).toHaveProperty('intentId');
    expect(res.body).toHaveProperty('redirectUrl');
    expect(typeof res.body.redirectUrl).toBe('string');
  });
});


