import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app.module';
import { TestDatabaseService } from '../src/modules/testing/test-database.service';
import { TestHelpersService } from '../src/modules/testing/test-helpers.service';
import { MockServicesService } from '../src/modules/testing/mock-services.service';

describe('Auth API (e2e)', () => {
  let app: INestApplication;
  let testDatabase: TestDatabaseService;
  let testHelpers: TestHelpersService;
  let mockServices: MockServicesService;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same pipes and middleware as main app
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    await app.init();

    testDatabase = app.get(TestDatabaseService);
    testHelpers = app.get(TestHelpersService);
    mockServices = app.get(MockServicesService);

    // Enable mock services for testing
    mockServices.setMockEnabled(true);

    // Clean up any existing test data
    await testDatabase.cleanupTestData();
  });

  afterAll(async () => {
    await testDatabase.cleanupTestData();
    await app.close();
  });

  describe('/api/v1/auth/register (POST)', () => {
    it('should register a new user successfully', async () => {
      const registerData = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
        phone: '0123456789',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          user: {
            email: registerData.email,
            name: registerData.name,
            phone: registerData.phone,
            isActive: true,
            role: 'USER',
            emailVerified: false,
          },
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        },
      });

      // Store tokens for later tests
      accessToken = response.body.data.accessToken;
      refreshToken = response.body.data.refreshToken;
    });

    it('should return validation error for invalid email', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
        phone: '0123456789',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(invalidData)
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('validation'),
        },
      });
    });

    it('should return error for duplicate email', async () => {
      // First, create a user
      const userData = {
        email: `duplicate${Date.now()}@example.com`,
        password: 'hashedpassword123',
        name: 'Test User',
        phone: '0123456789',
      };

      await testDatabase.createTestUser(userData);

      // Try to register with same email
      const registerData = {
        email: userData.email,
        password: 'password123',
        name: 'Another User',
        phone: '0987654321',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(409);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: expect.stringContaining('DUPLICATE'),
          message: expect.stringContaining('already exists'),
        },
      });
    });

    it('should return validation error for weak password', async () => {
      const weakPasswordData = {
        email: `test${Date.now()}@example.com`,
        password: '123', // Too short
        name: 'Test User',
        phone: '0123456789',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(weakPasswordData)
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('validation'),
        },
      });
    });
  });

  describe('/api/v1/auth/login (POST)', () => {
    let testUser: any;

    beforeAll(async () => {
      // Create a test user for login tests
      testUser = await testDatabase.createTestUser({
        email: `login${Date.now()}@example.com`,
        password: await testHelpers.hashTestPassword('password123'),
        name: 'Login Test User',
        phone: '0123456789',
        emailVerified: true,
      });
    });

    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: testUser.email,
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          user: {
            id: testUser.id,
            email: testUser.email,
            name: testUser.name,
            role: testUser.role,
          },
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        },
      });
    });

    it('should return error for incorrect password', async () => {
      const loginData = {
        email: testUser.email,
        password: 'wrongpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: expect.stringContaining('invalid'),
        },
      });
    });

    it('should return error for non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: expect.stringContaining('invalid'),
        },
      });
    });

    it('should handle rate limiting', async () => {
      const loginData = {
        email: testUser.email,
        password: 'wrongpassword',
      };

      // Make multiple failed attempts
      for (let i = 0; i < 10; i++) {
        await request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send(loginData);
      }

      // Next attempt should be rate limited
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(429);

      expect(response.body).toMatchObject({
        success: false,
        message: expect.stringContaining('too many requests'),
      });
    });
  });

  describe('/api/v1/auth/refresh (POST)', () => {
    let refreshToken: string;

    beforeAll(async () => {
      // Get a refresh token by registering
      const registerData = {
        email: `refresh${Date.now()}@example.com`,
        password: 'password123',
        name: 'Refresh Test User',
        phone: '0123456789',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(201);

      refreshToken = response.body.data.refreshToken;
    });

    it('should refresh access token successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        },
      });
    });

    it('should return error for invalid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: expect.stringContaining('INVALID'),
          message: expect.stringContaining('invalid'),
        },
      });
    });

    it('should return error for missing refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('required'),
        },
      });
    });
  });

  describe('/api/v1/auth/me (GET)', () => {
    let accessToken: string;
    let testUser: any;

    beforeAll(async () => {
      // Create user and get access token
      testUser = await testDatabase.createTestUser({
        email: `me${Date.now()}@example.com`,
        password: await testHelpers.hashTestPassword('password123'),
        name: 'Profile Test User',
        phone: '0123456789',
        emailVerified: true,
      });

      accessToken = await testHelpers.generateTestToken(testUser.id);
    });

    it('should get current user profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          user: {
            id: testUser.id,
            email: testUser.email,
            name: testUser.name,
            phone: testUser.phone,
            role: testUser.role,
          },
        },
      });
    });

    it('should return error without authorization', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: expect.stringContaining('UNAUTHORIZED'),
        },
      });
    });

    it('should return error with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: expect.stringContaining('INVALID'),
        },
      });
    });
  });

  describe('/api/v1/auth/logout (POST)', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
      // Get tokens by registering
      const registerData = {
        email: `logout${Date.now()}@example.com`,
        password: 'password123',
        name: 'Logout Test User',
        phone: '0123456789',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(201);

      accessToken = response.body.data.accessToken;
      refreshToken = response.body.data.refreshToken;
    });

    it('should logout successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('logged out'),
      });
    });

    it('should return error without authorization', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .send({ refreshToken })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: expect.stringContaining('UNAUTHORIZED'),
        },
      });
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in responses', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/login')
        .expect(404); // Endpoint doesn't exist, but we get headers

      // Check for security headers
      expect(response.headers).toMatchObject({
        'x-frame-options': 'DENY',
        'x-content-type-options': 'nosniff',
        'x-xss-protection': '1; mode=block',
      });
    });
  });

  describe('CORS', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await request(app.getHttpServer())
        .options('/api/v1/auth/register')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should reject requests from unauthorized origins', async () => {
      // This test might be tricky to implement without mocking
      // The CORS middleware should reject unauthorized origins
      // You might need to configure test-specific allowed origins
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to auth endpoints', async () => {
      // Make multiple requests to trigger rate limiting
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Make many requests quickly
      for (let i = 0; i < 10; i++) {
        await request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send(loginData);
      }

      // Next request should be rate limited
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(429);

      expect(response.body).toMatchObject({
        success: false,
        message: expect.stringContaining('too many requests'),
      });
    });
  });

  describe('Error Handling', () => {
    it('should return structured error responses', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({}) // Missing required fields
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: expect.any(String),
          message: expect.any(String),
          timestamp: expect.any(String),
          path: '/api/v1/auth/login',
        },
      });
    });

    it('should include correlation ID in error responses', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({})
        .expect(422);

      expect(response.headers).toHaveProperty('x-correlation-id');
      expect(response.body.error).toHaveProperty('correlationId');
    });
  });
});