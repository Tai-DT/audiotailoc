import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';

export class TestUtils {
  static async createTestingModule(imports: any[], providers: any[] = []): Promise<TestingModule> {
    const module: TestingModule = await Test.createTestingModule({
      imports,
      providers: [
        ...providers,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            product: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            order: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            category: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                JWT_SECRET: 'test-secret',
                DATABASE_URL: 'file:./test.db',
                SMTP_HOST: 'localhost',
                SMTP_PORT: '1025',
                SMTP_FROM: 'test@example.com',
                API_BASE_URL: 'http://localhost:4000',
                FRONTEND_URL: 'http://localhost:3000',
              };
              return config[key as keyof typeof config];
            }),
          },
        },
      ],
    }).compile();

    return module;
  }

  static async createTestApp(module: TestingModule): Promise<INestApplication> {
    const app = module.createNestApplication();
    await app.init();
    return app;
  }

  static createMockUser(overrides: Partial<any> = {}) {
    return {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createMockProduct(overrides: Partial<any> = {}) {
    return {
      id: 'test-product-id',
      name: 'Test Product',
      description: 'Test Description',
      priceCents: 100000,
      imageUrl: 'https://example.com/image.jpg',
      slug: 'test-product',
      categoryId: 'test-category-id',
      inStock: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createMockOrder(overrides: Partial<any> = {}) {
    return {
      id: 'test-order-id',
      orderNo: 'ORD-001',
      userId: 'test-user-id',
      status: 'PENDING',
      totalCents: 100000,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createMockCategory(overrides: Partial<any> = {}) {
    return {
      id: 'test-category-id',
      name: 'Test Category',
      description: 'Test Category Description',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static async makeAuthenticatedRequest(
    app: INestApplication,
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    token: string,
    body?: any
  ) {
    const req = request(app.getHttpServer())[method](path)
      .set('Authorization', `Bearer ${token}`);
    
    if (body) {
      req.send(body);
    }
    
    return req;
  }

  static generateJwtToken(payload: any = { sub: 'test-user-id', email: 'test@example.com' }): string {
    // In a real test, you'd use the actual JWT service
    // For now, return a mock token
    return 'mock-jwt-token';
  }

  static async cleanupDatabase(prisma: PrismaService) {
    // Clean up test data
    await prisma.order_items.deleteMany();
    await prisma.orders.deleteMany();
    await prisma.products.deleteMany();
    await prisma.categories.deleteMany();
    await prisma.users.deleteMany();
  }
}
