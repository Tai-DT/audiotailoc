# Structured Logging and Error Tracking Guide

This guide explains how to use the production-ready logging and error tracking services in the backend.

## Overview

The backend provides two main services for production-grade observability:

1. **LoggerService** - Winston-based structured logging with daily rotation
2. **SentryService** - Sentry-based error tracking and monitoring

## Installation

### Prerequisites

- Winston and winston-daily-rotate-file are already installed
- For Sentry support, install:
  ```bash
  npm install @sentry/node
  ```

## LoggerService - Structured Logging

### Features

- **Console and File Transports**: Logs to console and daily-rotated files
- **Structured Logging**: JSON formatted logs for easy parsing
- **Context Tracking**: Maintains context (userId, requestId, module, action)
- **Sensitive Data Filtering**: Automatically redacts passwords, tokens, API keys, etc.
- **Performance Metrics**: Track operation duration and log slow operations
- **Audit Trail**: Log security-relevant operations
- **Daily Log Rotation**: Automatic log rotation with configurable retention

### Setup in AppModule

```typescript
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    LoggerModule, // Add this
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ... other imports
  ],
})
export class AppModule {}
```

### Environment Variables

```env
# Optional - defaults to {cwd}/logs
LOGS_DIR=/var/log/audiotailoc

# Development or production
NODE_ENV=development
```

### Log Directory Structure

```
logs/
├── error-2025-11-11.log      # All errors (14 day retention)
├── combined-2025-11-11.log   # All levels (7 day retention)
└── debug-2025-11-11.log      # Debug only (3 day retention, dev only)
```

### Usage Examples

#### Basic Logging

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from './common/logger/logger.service';

@Injectable()
export class UserService {
  constructor(private logger: LoggerService) {}

  async createUser(userData: CreateUserDto) {
    // Set context for subsequent logs
    this.logger.setContext({
      module: 'UserService',
      action: 'createUser',
      userId: userData.id,
    });

    // Log info
    this.logger.log('User creation started', { email: userData.email });

    try {
      const user = await this.userRepository.create(userData);
      this.logger.log('User created successfully', { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error('User creation failed', error.stack, {
        email: userData.email,
        error: error.message,
      });
      throw error;
    } finally {
      // Clear context when done
      this.logger.clearContext();
    }
  }
}
```

#### Performance Logging

```typescript
async fetchAndProcessData() {
  const startTime = Date.now();

  try {
    const data = await this.fetchData();
    // ... process data
  } finally {
    const duration = Date.now() - startTime;
    // Logs as warn if > 5000ms, info otherwise
    this.logger.logPerformance('fetchAndProcessData', duration, {
      itemCount: data.length,
    });
  }
}
```

#### Audit Trail Logging

```typescript
async updateUserPermissions(userId: string, permissions: string[]) {
  const currentUser = this.getCurrentUser();

  // Make changes
  await this.userRepository.updatePermissions(userId, permissions);

  // Log audit trail
  this.logger.logAudit(
    'UPDATE_PERMISSIONS',
    currentUser.id,
    `user:${userId}`,
    {
      oldPermissions: user.permissions,
      newPermissions: permissions,
    },
  );
}
```

#### Context Management in Request Handlers

```typescript
@Controller('users')
export class UsersController {
  constructor(private logger: LoggerService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
  ) {
    // Set request context
    this.logger.setContext({
      module: 'UsersController',
      requestId: req.id,
      action: 'create',
    });

    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      this.logger.error('Failed to create user', error.stack, {
        email: createUserDto.email,
      });
      throw error;
    }
  }
}
```

### Log Levels

- **debug**: Detailed diagnostic information
- **info**: General informational messages
- **warn**: Warning messages for potentially harmful situations
- **error**: Error messages for error events
- **fatal**: Critical errors (severity: 'critical')

### Console Output Example

```
2025-11-11 10:30:45 [info] [UserService]: User creation started {"email":"user@example.com"}
2025-11-11 10:30:46 [info] [UserService]: User created successfully {"userId":"abc123"}
2025-11-11 10:35:22 [warn] [UserService]: Performance: fetchAndProcessData {"duration_ms":7500,"itemCount":1000}
2025-11-11 10:40:15 [error] [AuthService]: Authentication failed {"error":"Invalid token"}
```

### JSON Log File Example

```json
{
  "service": "audiotailoc-backend",
  "timestamp": "2025-11-11 10:30:45",
  "level": "info",
  "message": "User creation started",
  "context": {
    "module": "UserService",
    "action": "createUser",
    "userId": "123"
  },
  "email": "user@example.com",
  "ms": "1ms"
}
```

### Sensitive Data Filtering

The service automatically filters these sensitive fields:
- password, passwordHash, passwordConfirm
- token, tokens, tokenData
- secret, secrets
- apiKey, apiSecret
- authorization, authorizationToken
- creditCard, creditCardNumber
- ssn, socialSecurityNumber
- privateKey, privateSecret
- refreshToken, refreshTokenData
- accessToken, accessTokenData
- phoneNumber
- and any object containing these patterns

Example - sensitive data is automatically redacted:

```typescript
this.logger.log('Payment processed', {
  creditCard: '4111111111111111', // Will be logged as '[REDACTED]'
  password: 'secret123',          // Will be logged as '[REDACTED]'
  email: 'user@example.com',      // Will be logged normally
});
```

## SentryService - Error Tracking

### Features

- **Exception Tracking**: Automatically capture and report errors
- **Breadcrumb Tracking**: Track user actions leading to errors
- **Performance Monitoring**: Monitor transaction performance
- **Sensitive Data Filtering**: Redact sensitive data before sending to Sentry
- **User Context**: Track which user experienced the error
- **Custom Tags and Context**: Add custom metadata to errors
- **Graceful Degradation**: Service works without Sentry DSN (just logs warnings)

### Setup

#### 1. Install Sentry

```bash
npm install @sentry/node
```

#### 2. Create Sentry Module

Create `/src/common/sentry/sentry.module.ts`:

```typescript
import { Module, Global } from '@nestjs/common';
import { SentryService } from './sentry.service';

@Global()
@Module({
  providers: [SentryService],
  exports: [SentryService],
})
export class SentryModule {}
```

#### 3. Update AppModule

```typescript
import { SentryModule } from './common/sentry/sentry.module';

@Module({
  imports: [
    SentryModule, // Add this
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ... other imports
  ],
})
export class AppModule {}
```

#### 4. Environment Variables

```env
# Sentry DSN (get from your Sentry project settings)
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# Optional - Environment name
SENTRY_ENVIRONMENT=production

# Optional - Trace sample rate for performance monitoring (0.0-1.0)
# Default: 0.1 (10% of transactions)
SENTRY_TRACE_SAMPLE_RATE=0.1
```

### Usage Examples

#### In Services

```typescript
import { Injectable } from '@nestjs/common';
import { SentryService } from './common/sentry/sentry.service';

@Injectable()
export class OrderService {
  constructor(private sentry: SentryService) {}

  async processPayment(orderId: string, userId: string) {
    // Set user context
    this.sentry.setUser({
      id: userId,
      email: 'user@example.com',
    });

    try {
      // Process payment
      const result = await this.paymentProvider.process(orderId);

      // Add breadcrumb to track successful operation
      this.sentry.addBreadcrumb({
        message: 'Payment processed successfully',
        level: 'info',
        category: 'payment',
        data: { orderId },
      });

      return result;
    } catch (error) {
      // Capture exception with context
      this.sentry.captureException(error, {
        tags: {
          orderId,
          operation: 'processPayment',
        },
        contexts: {
          order: {
            id: orderId,
            amount: order.total,
          },
        },
      });

      throw error;
    }
  }
}
```

#### In Middleware/Request Handlers

```typescript
@Controller('orders')
export class OrdersController {
  constructor(private sentry: SentryService) {}

  @Post(':id/pay')
  async processPayment(@Param('id') orderId: string, @Req() req: Request) {
    // Set user context for all subsequent errors
    this.sentry.setUser({
      id: req.user.id,
      email: req.user.email,
    });

    // Set custom tags
    this.sentry.setTag('orderId', orderId);
    this.sentry.setTag('environment', process.env.NODE_ENV);

    try {
      return await this.orderService.processPayment(orderId);
    } catch (error) {
      // Error is captured by try-catch
      this.sentry.captureException(error, {
        requestId: req.id,
        userId: req.user.id,
      });
      throw error;
    }
  }
}
```

#### Performance Monitoring

```typescript
async exportData(userId: string) {
  const transaction = this.sentry.startTransaction(
    'Export User Data',
    'export',
  );

  try {
    const data = await this.fetchUserData(userId);
    // transaction.finish() is called automatically

    return data;
  } catch (error) {
    this.sentry.captureException(error, {
      userId,
      operation: 'exportData',
    });
    throw error;
  }
}
```

#### Message Capture

```typescript
async handleRateLimitExceeded(userId: string) {
  // Capture informational message
  this.sentry.captureMessage(
    `User ${userId} exceeded rate limit`,
    'warning',
    { userId, timestamp: new Date() },
  );
}
```

### Automatic Filtering

The Sentry service automatically filters:

1. **Health Check Endpoints**: /health, /ping
2. **404 Errors**: Not reported by default
3. **Sensitive Headers**: Authorization, X-API-Key, etc.
4. **Request Body Data**: Passwords, tokens, API keys

### Using Both Services Together

For comprehensive observability, use both services together:

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from './common/logger/logger.service';
import { SentryService } from './common/sentry/sentry.service';

@Injectable()
export class AuthService {
  constructor(
    private logger: LoggerService,
    private sentry: SentryService,
  ) {}

  async login(email: string, password: string) {
    this.logger.setContext({
      module: 'AuthService',
      action: 'login',
      email,
    });

    try {
      const user = await this.findUser(email);
      const isValid = await this.validatePassword(password, user.passwordHash);

      if (!isValid) {
        // Log failed attempt
        this.logger.warn('Login failed: Invalid password', { email });

        // Track in Sentry for suspicious activity
        this.sentry.addBreadcrumb({
          message: 'Login attempt with invalid password',
          level: 'warning',
          category: 'auth',
          data: { email },
        });

        throw new UnauthorizedException('Invalid credentials');
      }

      // Set user context for subsequent operations
      this.sentry.setUser({
        id: user.id,
        email: user.email,
      });

      // Log successful login
      this.logger.log('User logged in successfully', {
        userId: user.id,
        ip: this.getClientIp(),
      });

      this.logger.logAudit('LOGIN_SUCCESS', user.id, 'self');

      return { user, token: this.generateToken(user) };
    } catch (error) {
      this.logger.error('Login error', error.stack, { email });

      this.sentry.captureException(error, {
        tags: { operation: 'login' },
        extra: { email },
      });

      throw error;
    }
  }
}
```

## Configuration Best Practices

### Development Environment

```env
NODE_ENV=development
LOGS_DIR=./logs
SENTRY_ENVIRONMENT=development
SENTRY_TRACE_SAMPLE_RATE=0.5
```

### Staging Environment

```env
NODE_ENV=staging
LOGS_DIR=/var/log/audiotailoc
SENTRY_ENVIRONMENT=staging
SENTRY_TRACE_SAMPLE_RATE=0.1
```

### Production Environment

```env
NODE_ENV=production
LOGS_DIR=/var/log/audiotailoc
SENTRY_ENVIRONMENT=production
SENTRY_TRACE_SAMPLE_RATE=0.01
```

## Log Retention

Default retention periods:
- Error logs: 14 days
- Combined logs: 7 days
- Debug logs: 3 days (development only)
- Individual file size: 20MB

## Troubleshooting

### Logs not appearing

1. Check `LOGS_DIR` is writable: `ls -la /var/log/audiotailoc`
2. Verify `NODE_ENV` is set correctly
3. Check file permissions: `chmod 755 logs/`

### Sentry not capturing errors

1. Verify `SENTRY_DSN` is set: `echo $SENTRY_DSN`
2. Check internet connectivity for sending to Sentry
3. Verify service is initialized: `this.sentry.isEnabled()`
4. Check browser console for any errors

### Sensitive data still visible in logs

1. Verify sensitive field names match the filter patterns
2. Check if using custom field names (e.g., `authToken` instead of `token`)
3. Use the `filterSensitiveData` method directly for custom filters

## Production Checklist

- [ ] `LOGS_DIR` points to persistent storage
- [ ] Log directory has appropriate permissions (755)
- [ ] Sentry DSN is configured
- [ ] `SENTRY_ENVIRONMENT` matches deployment environment
- [ ] Daily log rotation is working (check dated files)
- [ ] Sample rate is appropriate for your environment
- [ ] Health check endpoints are excluded from Sentry
- [ ] Sensitive data is properly redacted in logs
- [ ] Log files are being backed up
- [ ] Log retention policy is reviewed

## Performance Considerations

- **LoggerService**: Minimal overhead, async writes
- **SentryService**: Graceful degradation if Sentry is unavailable
- **Sampling**: Use `SENTRY_TRACE_SAMPLE_RATE` to manage Sentry quota
- **Filtering**: Expensive operations filtered before transmission to Sentry

## Additional Resources

- [Winston Documentation](https://github.com/winstonjs/winston)
- [Winston Daily Rotate File](https://github.com/winstonjs/winston-daily-rotate-file)
- [Sentry Node Documentation](https://docs.sentry.io/platforms/node/)
- [Sentry Best Practices](https://docs.sentry.io/platforms/node/enriching-events/)
