import 'dotenv/config';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

async function main() {
  const prisma = new PrismaClient();
  const base = process.env.API_BASE || 'http://localhost:3000';
  const jwtSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev_access';

  // Ensure minimal PayOS envs (for building redirect URL in service)
  process.env.PAYOS_API_URL = process.env.PAYOS_API_URL || 'https://api.payos.vn';
  process.env.PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID || 'test_client_id';
  process.env.PAYOS_API_KEY = process.env.PAYOS_API_KEY || 'test_api_key';
  process.env.PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY || 'test_checksum';
  process.env.PAYOS_RETURN_URL = process.env.PAYOS_RETURN_URL || 'http://localhost:3000/checkout/return';

  try {
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
        subtotalCents: 150000,
        shippingCents: 30000,
        totalCents: 180000,
        items: {
          create: [{
            productId: product.id,
            name: product.name,
            quantity: 1,
            unitPrice: 150000,
          }],
        },
      },
    });

    // Create JWT
    const token = jwt.sign({ sub: user.id }, jwtSecret);

    // Request PayOS intent (test with key first)
    const res = await axios.post(
      `${base}/payments/intents`,
      {
        orderId: order.id,
        provider: 'PAYOS',
        idempotencyKey: `e2e-${Date.now()}`,
        returnUrl: process.env.PAYOS_RETURN_URL,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Intent:', res.data);
    console.log('Redirect URL:', res.data.redirectUrl);
  } catch (e: any) {
    console.error('E2E PayOS intent failed:', {
      status: e.response?.status,
      data: e.response?.data,
      message: e.message,
    });
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
