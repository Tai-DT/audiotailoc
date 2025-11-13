# Security Module Guide

This directory contains production-ready security components for your NestJS application. Each file provides specific security functionality.

## Files Overview

### 1. `security-headers.middleware.ts` - HTTP Security Headers
Adds essential security headers to all HTTP responses to protect against common web attacks.

**Headers Added:**
- `Strict-Transport-Security` (HSTS) - Forces HTTPS connections
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection` - Additional XSS protection for legacy browsers
- `Referrer-Policy: strict-no-referrer` - Protects user privacy
- `Permissions-Policy` - Controls browser features
- `Content-Security-Policy` - Prevents inline scripts and resource loading

**Usage in `app.module.ts`:**
```typescript
import { SecurityHeadersMiddleware } from './common/security/security-headers.middleware';

@Module({
  // ... other module config
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityHeadersMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
```

**Or in `main.ts`:**
```typescript
const app = await NestFactory.create(AppModule);
app.use(new SecurityHeadersMiddleware());
```

---

### 2. `rate-limiter.config.ts` - Rate Limiting Configuration
Provides comprehensive rate limiting rules for different endpoints to prevent abuse and DoS attacks.

**Features:**
- Endpoint-specific rate limiting rules
- Different limits for authentication, file uploads, API operations
- Development vs. production configurations
- Dynamic rule matching based on path, method, and patterns

**Endpoints with Special Limits:**
- `/auth/login` - 5 requests per 15 minutes (production)
- `/auth/register` - 3 requests per hour (production)
- `/auth/forgot-password` - 3 requests per hour (production)
- `/upload|/files` - 10 uploads per hour (production)
- `/search` - 60 requests per minute (production)
- `/payments|/checkout` - 10 requests per minute (production)
- `/health` - Unlimited (internal monitoring)

**Usage:**
```typescript
import { RateLimiterConfigService } from './common/security/rate-limiter.config';

@Injectable()
export class MyService {
  constructor(private rateLimiterConfig: RateLimiterConfigService) {}

  getConfig() {
    const config = this.rateLimiterConfig.getConfig();
    const rule = this.rateLimiterConfig.getMatchingRule('/auth/login', 'POST');
    this.rateLimiterConfig.logConfiguration();
  }
}
```

**With express-rate-limit:**
```typescript
import { RateLimiterConfigService } from './common/security/rate-limiter.config';
import rateLimit from 'express-rate-limit';

const rateLimiterConfig = new RateLimiterConfigService();
const config = rateLimiterConfig.getConfig();

const limiter = rateLimit({
  windowMs: config.defaultRule.windowMs,
  max: config.defaultRule.maxRequests,
  headers: config.headers,
});

app.use(limiter);
```

---

### 3. `sanitize.interceptor.ts` - Input Sanitization
Prevents XSS, SQL injection, command injection, and other malicious attacks by sanitizing all user input.

**Sanitization Features:**
- Removes XSS payloads (script tags, event handlers, javascript: protocols)
- Removes SQL injection patterns
- Removes command injection characters
- Prevents path traversal attacks
- Validates nested objects and arrays
- Removes dangerous object keys (prototype pollution)
- Escapes control characters

**Exported Utility Functions:**
```typescript
// Sanitize a string
sanitizeInput(input: string): string

// Sanitize HTML (basic implementation)
sanitizeHtml(html: string): string

// Escape HTML special characters
escapeHtml(text: string): string

// Validate email addresses
isValidEmail(email: string): boolean

// Validate URLs
isValidUrl(url: string): boolean

// Sanitize file names
sanitizeFileName(fileName: string): string
```

**Usage in `main.ts`:**
```typescript
import { SanitizeInterceptor } from './common/security/sanitize.interceptor';

const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new SanitizeInterceptor());
```

**Usage in Modules:**
```typescript
import { SanitizeInterceptor } from './common/security/sanitize.interceptor';

@Controller('api/users')
@UseInterceptors(SanitizeInterceptor)
export class UsersController {
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // Input is automatically sanitized
    // XSS, injection attempts are removed
  }
}
```

**Usage with utility functions:**
```typescript
import { sanitizeInput, isValidEmail, sanitizeFileName } from './common/security/sanitize.interceptor';

// In services or controllers
const cleanInput = sanitizeInput(userInput);
const isValid = isValidEmail(email);
const safeName = sanitizeFileName(uploadedFileName);
```

---

### 4. `api-key.guard.ts` - API Key Authentication
Authenticates third-party integrations and services using API keys with fine-grained access control.

**Features:**
- API key validation and format checking
- Scope-based access control
- IP whitelist support (including CIDR notation)
- Request method restrictions
- Request path restrictions
- API key expiration
- Rate limiting per API key
- Security event logging

**Decorator:**
```typescript
import { RequireApiKey, ApiKeyGuard } from './common/security/api-key.guard';

@Controller('api/integrations')
@UseGuards(ApiKeyGuard)
export class IntegrationsController {
  @Post('webhook')
  @RequireApiKey(['webhooks'])
  handleWebhook(@Body() payload: any) {
    // Requires API key with 'webhooks' scope
  }

  @Get('data')
  @RequireApiKey(['read'])
  getData() {
    // Requires API key with 'read' scope
  }
}
```

**API Key Format:**
```
X-API-Key: your-api-key-here
or
?api_key=your-api-key-here
```

**Configuration (in `.env` or config):**
```env
API_KEYS='{"dev-key-12345":{"name":"Development Key","scopes":["*"],"rateLimit":1000,"active":true,"allowedHosts":["192.168.1.0/24","127.0.0.1"],"allowedMethods":["GET","POST"],"allowedPaths":["/api/public/*"]}}'

# Or require API key for all endpoints
REQUIRE_API_KEY_FOR_ALL=true
```

**Accessing API Key in Controllers:**
```typescript
import { getApiKeyFromRequest } from './common/security/api-key.guard';

@Controller('api')
export class MyController {
  @Get()
  getData(@Req() request: any) {
    const apiKeyInfo = getApiKeyFromRequest(request);
    console.log(`API Key: ${apiKeyInfo?.name}`);
    console.log(`Scopes: ${apiKeyInfo?.scopes}`);
  }
}
```

---

## Integration Example

Here's how to integrate all security components in your application:

**In `main.ts`:**
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { SecurityHeadersMiddleware } from './common/security/security-headers.middleware';
import { SanitizeInterceptor } from './common/security/sanitize.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers (HTTP header-based protection)
  app.use(new SecurityHeadersMiddleware());

  // Global input sanitization interceptor
  app.useGlobalInterceptors(new SanitizeInterceptor());

  // Helmet middleware (additional HTTP security)
  app.use(helmet({
    contentSecurityPolicy: true,
    hsts: true,
  }));

  // Rate limiting (configured in RateLimiterConfigService)
  // Apply through middleware or as shown in rate-limiter.config.ts

  await app.listen(3010);
}

bootstrap();
```

**In Module:**
```typescript
import { ApiKeyGuard } from './common/security/api-key.guard';

@Module({
  imports: [ConfigModule],
  providers: [ApiKeyGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityHeadersMiddleware)
      .forRoutes('*');
  }
}
```

---

## Security Best Practices

1. **Always use HTTPS in production** - The HSTS header enforces this
2. **Regularly rotate API keys** - Set expiration dates
3. **Use strong CSP policies** - Customize for your needs
4. **Monitor security events** - Log and alert on suspicious activity
5. **Keep dependencies updated** - Regular security patches
6. **Use environment variables** - Never hardcode secrets
7. **Enable rate limiting** - Prevent brute force and DoS attacks
8. **Sanitize all input** - Defense in depth strategy
9. **Use API key scopes** - Principle of least privilege
10. **Regular security audits** - Test your implementation

---

## Production Checklist

- [ ] Enable HSTS headers for HTTPS domains
- [ ] Configure Content-Security-Policy for your domain
- [ ] Set up rate limiting for all endpoints
- [ ] Configure API key scopes for integrations
- [ ] Enable input sanitization interceptor
- [ ] Set up security event logging
- [ ] Configure IP whitelists for API keys
- [ ] Set API key expiration dates
- [ ] Enable CORS restrictions
- [ ] Set up regular security audits
- [ ] Monitor and log security events
- [ ] Test CSP policies in development first

---

## Environment Variables

```env
# Security Configuration
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
CSP_REPORT_URI=https://yourdomain.com/csp-report

# API Key Configuration
API_KEYS='{"key1":{"name":"Service A","scopes":["read","write"]}}'
REQUIRE_API_KEY_FOR_ALL=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Testing Security

```typescript
// Test sanitization
import { SanitizeInterceptor, sanitizeInput } from './common/security/sanitize.interceptor';

describe('Input Sanitization', () => {
  it('should remove XSS payload', () => {
    const xssPayload = '<script>alert("xss")</script>';
    const result = sanitizeInput(xssPayload);
    expect(result).not.toContain('<script>');
  });
});

// Test API Key Guard
import { ApiKeyGuard } from './common/security/api-key.guard';

describe('ApiKeyGuard', () => {
  it('should reject requests without API key', async () => {
    // Test implementation
  });
});
```

---

For more information on NestJS security, see:
- [NestJS Security Documentation](https://docs.nestjs.com/techniques/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
