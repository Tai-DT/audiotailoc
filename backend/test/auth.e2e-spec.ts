import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    // Clean up test data
    await prismaService.user.deleteMany({
      where: {
        email: {
          in: ['test@example.com', 'test2@example.com'],
        },
      },
    });
    await app.close();
  });

  describe('/api/v1/auth/register (POST)', () => {
    it('should register a new user successfully', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user.email).toBe('test@example.com');
          expect(res.body.user.name).toBe('Test User');
          expect(res.body.user).not.toHaveProperty('password');
        });
    });

    it('should return 400 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(422);
    });

    it('should return 400 for short password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test2@example.com',
          password: '123',
        })
        .expect(422);
    });

    it('should return 400 for duplicate email', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'password123',
        })
        .expect(201);

      // Duplicate registration
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'password123',
        })
        .expect(400);
    });
  });

  describe('/api/v1/auth/login (POST)', () => {
    beforeEach(async () => {
      // Ensure test user exists
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });
    });

    it('should login successfully with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(typeof res.body.accessToken).toBe('string');
          expect(typeof res.body.refreshToken).toBe('string');
        });
    });

    it('should return 401 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);
    });

    it('should return 401 for invalid password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('/api/v1/auth/refresh (POST)', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Login to get refresh token
      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      refreshToken = loginResponse.body.refreshToken;
    });

    it('should refresh access token successfully', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(typeof res.body.accessToken).toBe('string');
          expect(typeof res.body.refreshToken).toBe('string');
        });
    });

    it('should return 401 for invalid refresh token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: 'invalid-token',
        })
        .expect(401);
    });
  });

  describe('/api/v1/auth/me (GET)', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Login to get access token
      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      accessToken = loginResponse.body.accessToken;
    });

    it('should return user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('userId');
          expect(res.body).toHaveProperty('email');
          expect(res.body.email).toBe('test@example.com');
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('Rate Limiting', () => {
    it('should limit registration attempts', async () => {
      const requests = Array(4).fill(null).map(() =>
        request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send({
            email: `rate-limit-test-${Date.now()}@example.com`,
            password: 'password123',
          })
      );

      const responses = await Promise.all(requests);
      const successCount = responses.filter(res => res.status === 201).length;
      const rateLimitedCount = responses.filter(res => res.status === 429).length;

      expect(successCount).toBeLessThanOrEqual(3); // Max 3 registrations per minute
      expect(rateLimitedCount).toBeGreaterThan(0);
    });

    it('should limit login attempts', async () => {
      const requests = Array(6).fill(null).map(() =>
        request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword',
          })
      );

      const responses = await Promise.all(requests);
      const rateLimitedCount = responses.filter(res => res.status === 429).length;

      expect(rateLimitedCount).toBeGreaterThan(0); // Should hit rate limit after 5 attempts
    });
  });
});
