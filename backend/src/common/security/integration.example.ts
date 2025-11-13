/**
 * Integration Example
 * Shows how to integrate all security components into your NestJS application
 *
 * This file is for reference only - copy relevant parts to your actual files
 */

// ============================================================================
// main.ts - Application Bootstrap
// ============================================================================

/*
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { SecurityHeadersMiddleware } from './common/security/security-headers.middleware';
import { SanitizeInterceptor } from './common/security/sanitize.interceptor';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { RateLimiterConfigService } from './common/security/rate-limiter.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // === Security Middleware & Interceptors ===

  // 1. Security Headers Middleware
  app.use(new SecurityHeadersMiddleware());

  // 2. Helmet for additional HTTP security
  app.use(helmet({
    contentSecurityPolicy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    frameGuard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-no-referrer' },
  }));

  // 3. Global Input Sanitization Interceptor
  app.useGlobalInterceptors(new SanitizeInterceptor());

  // 4. Rate Limiting Middleware
  const rateLimiterConfig = new RateLimiterConfigService();
  const defaultRule = rateLimiterConfig.getConfig().defaultRule;

  const limiter = rateLimit({
    windowMs: defaultRule.windowMs,
    max: defaultRule.maxRequests,
    message: defaultRule.message || 'Too many requests',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: any) => {
      // Skip rate limiting for health checks
      return req.path.includes('/health');
    },
  });

  app.use(limiter);

  // 5. Global CORS Configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Requested-With'],
  });

  // === Application Setup ===
  const port = process.env.PORT || 3010;
  await app.listen(port, '0.0.0.0');

  console.log(`Application running on http://localhost:${port}`);
}

bootstrap().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
*/

// ============================================================================
// app.module.ts - Module Configuration
// ============================================================================

/*
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SecurityHeadersMiddleware } from './common/security/security-headers.middleware';
import { ApiKeyGuard } from './common/security/api-key.guard';
import { RateLimiterConfigService } from './common/security/rate-limiter.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Other modules
  ],
  providers: [
    RateLimiterConfigService,
    ApiKeyGuard,
    // Other services
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply security headers middleware to all routes
    consumer
      .apply(SecurityHeadersMiddleware)
      .forRoutes('*');
  }
}
*/

// ============================================================================
// Example Controller with API Key Protection
// ============================================================================

/*
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiKeyGuard, RequireApiKey, getApiKeyFromRequest } from './common/security/api-key.guard';
import { SanitizeInterceptor, sanitizeInput, isValidEmail } from './common/security/sanitize.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { Request } from 'express';

@Controller('api/integrations')
@UseGuards(ApiKeyGuard)
@UseInterceptors(SanitizeInterceptor)
export class IntegrationsController {
  // Public endpoint (no API key required)
  @Get('public')
  getPublicData() {
    return { message: 'This is public data' };
  }

  // Protected endpoint requiring API key with 'read' scope
  @Get('data')
  @RequireApiKey(['read'])
  getData(@Req() request: Request) {
    const apiKey = getApiKeyFromRequest(request);
    return {
      message: 'This is private data',
      accessedBy: apiKey?.name,
      scopes: apiKey?.scopes,
    };
  }

  // Protected endpoint requiring API key with 'write' scope
  @Post('data')
  @RequireApiKey(['write'])
  createData(@Body() body: any, @Req() request: Request) {
    // Input is automatically sanitized by SanitizeInterceptor
    const apiKey = getApiKeyFromRequest(request);

    return {
      message: 'Data created successfully',
      createdBy: apiKey?.name,
      data: body,
    };
  }

  // Endpoint with multiple required scopes
  @Post('admin')
  @RequireApiKey(['admin', 'write'])
  adminOperation(@Body() body: any) {
    return { message: 'Admin operation completed', data: body };
  }
}
*/

// ============================================================================
// Example Service with Sanitization
// ============================================================================

/*
import { Injectable } from '@nestjs/common';
import {
  sanitizeInput,
  sanitizeHtml,
  isValidEmail,
  isValidUrl,
  escapeHtml,
} from './common/security/sanitize.interceptor';

@Injectable()
export class UserService {
  createUser(userData: any) {
    // Sanitize user input
    const cleanName = sanitizeInput(userData.name);
    const cleanEmail = userData.email;

    // Validate email
    if (!isValidEmail(cleanEmail)) {
      throw new Error('Invalid email address');
    }

    // Sanitize bio if it contains HTML
    const cleanBio = sanitizeHtml(userData.bio);

    // Escape before storing to prevent XSS on display
    const escapedBio = escapeHtml(cleanBio);

    return {
      name: cleanName,
      email: cleanEmail,
      bio: escapedBio,
    };
  }

  updateUserProfile(userId: string, profileData: any) {
    // All input is automatically sanitized by the interceptor
    // But you can add additional validation

    if (profileData.website) {
      if (!isValidUrl(profileData.website)) {
        throw new Error('Invalid website URL');
      }
    }

    return { message: 'Profile updated', data: profileData };
  }
}
*/

// ============================================================================
// Environment Configuration (.env)
// ============================================================================

/*
# Security Configuration
NODE_ENV=production
PORT=3010

# CORS
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com

# Content Security Policy Report URI (optional)
CSP_REPORT_URI=https://yourdomain.com/security/csp-report

# API Keys Configuration (JSON format)
API_KEYS='{
  "prod-key-12345": {
    "name": "Production API Key",
    "scopes": ["read", "write"],
    "rateLimit": 100,
    "active": true,
    "allowedHosts": ["192.168.1.0/24", "203.0.113.0/24"],
    "allowedMethods": ["GET", "POST"],
    "allowedPaths": ["/api/public/*", "/api/webhooks/*"]
  },
  "dev-key-67890": {
    "name": "Development API Key",
    "scopes": ["*"],
    "rateLimit": 1000,
    "active": true,
    "expiresAt": "2025-12-31T23:59:59Z"
  }
}'

# Require API key for all endpoints (optional)
REQUIRE_API_KEY_FOR_ALL=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Database and other configs
DATABASE_URL=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
*/

// ============================================================================
// Unit Test Examples
// ============================================================================

/*
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SanitizeInterceptor, sanitizeInput, isValidEmail } from './common/security/sanitize.interceptor';
import { ApiKeyGuard } from './common/security/api-key.guard';

describe('Security Features', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // ... module setup
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Input Sanitization', () => {
    it('should remove XSS payload from input', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('<script>');
    });

    it('should remove SQL injection patterns', () => {
      const sqlInjection = "'; DROP TABLE users; --";
      const result = sanitizeInput(sqlInjection);
      expect(result).not.toContain('DROP');
    });

    it('should validate emails correctly', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@example')).toBe(false);
    });
  });

  describe('API Key Authentication', () => {
    it('should reject requests without API key', () => {
      return request(app.getHttpServer())
        .get('/api/protected')
        .expect(401);
    });

    it('should accept requests with valid API key', () => {
      return request(app.getHttpServer())
        .get('/api/protected')
        .set('X-API-Key', 'dev-key-12345')
        .expect(200);
    });

    it('should reject requests with invalid API key', () => {
      return request(app.getHttpServer())
        .get('/api/protected')
        .set('X-API-Key', 'invalid-key')
        .expect(401);
    });

    it('should check API key scopes', () => {
      return request(app.getHttpServer())
        .post('/api/admin')
        .set('X-API-Key', 'dev-key-12345')
        .send({ data: 'test' })
        .expect(403); // Insufficient scopes
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in response', () => {
      return request(app.getHttpServer())
        .get('/api/test')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect('X-Frame-Options', 'DENY');
    });

    it('should include CSP header', () => {
      return request(app.getHttpServer())
        .get('/api/test')
        .expect((res) => {
          expect(res.headers['content-security-policy']).toBeDefined();
        });
    });
  });
});
*/

// ============================================================================
// Docker Configuration Example
// ============================================================================

/*
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Set security environment variables
ENV NODE_ENV=production
ENV ENABLE_SWAGGER=false

# Expose port
EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3010/api/v1/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Run application
CMD ["npm", "start"]
*/

// ============================================================================
// nginx Configuration Example (Reverse Proxy with Security)
// ============================================================================

/*
upstream api {
  server localhost:3010;
}

server {
  listen 443 ssl http2;
  server_name api.yourdomain.com;

  # SSL Configuration
  ssl_certificate /etc/ssl/certs/cert.pem;
  ssl_certificate_key /etc/ssl/private/key.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  # Security Headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-no-referrer" always;

  # Rate Limiting
  limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
  limit_req zone=api burst=20 nodelay;

  # Proxy Configuration
  location / {
    proxy_pass http://api;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;

    # Client body size limit
    client_max_body_size 10m;
  }
}

# Redirect HTTP to HTTPS
server {
  listen 80;
  server_name api.yourdomain.com;
  return 301 https://$server_name$request_uri;
}
*/

// ============================================================================
// GitHub Actions Security Scanning Workflow
// ============================================================================

/*
name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run security checks
        run: npm run lint

      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          path: '.'
          format: 'JSON'

      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: dependency-check-results
          path: reports/

      - name: Run tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
*/

export {};
