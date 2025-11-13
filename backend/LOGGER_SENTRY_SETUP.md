# Logger and Sentry Services - Setup Summary

This document provides a quick setup summary for the three newly created files.

## Files Created

### 1. LoggerService
**File**: `/src/common/logger/logger.service.ts` (295 lines)

A production-ready Winston-based logging service with:
- Daily rotating file transports (error, combined, debug logs)
- Console output with color coding
- Structured JSON logging
- Context tracking (userId, requestId, module, action)
- Automatic sensitive data filtering
- Performance metrics logging
- Audit trail logging
- Implements NestJS LoggerService interface

**Key Methods**:
```typescript
// Logging
log(message, metadata?)
error(message, trace?, metadata?)
warn(message, metadata?)
debug(message, metadata?)
verbose(message, metadata?)
fatal(message, metadata?)

// Context management
setContext(context)
clearContext()
getContext()

// Special logging
logPerformance(operation, duration, metadata?)
logAudit(action, userId, target, details?)

// Utilities
getWinstonLogger() // Access raw Winston instance
```

### 2. LoggerModule
**File**: `/src/common/logger/logger.module.ts` (13 lines)

A global NestJS module that:
- Provides LoggerService to entire application
- Can be imported in AppModule for instant availability
- Marked with @Global() decorator

**Setup in AppModule**:
```typescript
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // ... other imports
  ],
})
export class AppModule {}
```

### 3. SentryService
**File**: `/src/common/sentry/sentry.service.ts` (419 lines)

A comprehensive Sentry error tracking service with:
- Dynamic initialization (graceful degradation if DSN not set)
- Exception and message capture
- Breadcrumb tracking for user actions
- Performance transaction monitoring
- User context tracking
- Custom tags and extra data
- Automatic sensitive data filtering
- Event and breadcrumb hooks for filtering

**Key Methods**:
```typescript
// Error tracking
captureException(error, context?)
captureMessage(message, level?, context?)

// Breadcrumbs
addBreadcrumb(options)

// User context
setUser(user)
clearUser()

// Custom data
setTag(key, value)
setExtra(key, value)

// Performance
startTransaction(name, op?)

// Utilities
isEnabled()
getScope()
```

## Environment Variables

### LoggerService
```env
# Optional - defaults to {cwd}/logs
LOGS_DIR=/var/log/audiotailoc

# Required for production
NODE_ENV=production
```

### SentryService
```env
# Get from Sentry project settings (https://sentry.io)
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# Optional - Environment name
SENTRY_ENVIRONMENT=production

# Optional - Sampling rate (0.0-1.0, default: 0.1)
SENTRY_TRACE_SAMPLE_RATE=0.1
```

## Quick Start

### 1. Install Dependencies (if using Sentry)
```bash
npm install @sentry/node
```

### 2. Update AppModule
```typescript
import { LoggerModule } from './common/logger/logger.module';
import { SentryModule } from './common/sentry/sentry.module';

@Module({
  imports: [
    LoggerModule,
    SentryModule, // Optional
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
```

### 3. Create SentryModule (if using Sentry)
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

### 4. Set Environment Variables
```bash
export LOGS_DIR=/var/log/audiotailoc
export NODE_ENV=production
export SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### 5. Use in Services
```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from './common/logger/logger.service';
import { SentryService } from './common/sentry/sentry.service';

@Injectable()
export class MyService {
  constructor(
    private logger: LoggerService,
    private sentry: SentryService,
  ) {}

  async doSomething() {
    this.logger.setContext({ module: 'MyService', action: 'doSomething' });
    
    try {
      // Do work
      this.logger.log('Operation successful');
    } catch (error) {
      this.logger.error('Operation failed', error.stack);
      this.sentry.captureException(error);
      throw error;
    }
  }
}
```

## Features at a Glance

### LoggerService
- ✅ Winston-based logging
- ✅ Daily log rotation with configurable retention
- ✅ Console and file transports
- ✅ Structured JSON logs
- ✅ Context tracking across requests
- ✅ Sensitive data filtering (passwords, tokens, API keys)
- ✅ Performance metrics logging
- ✅ Audit trail logging
- ✅ Production-ready

### SentryService
- ✅ Error tracking and reporting
- ✅ Breadcrumb tracking
- ✅ Performance monitoring
- ✅ User context tracking
- ✅ Custom tags and metadata
- ✅ Sensitive data filtering
- ✅ Graceful degradation
- ✅ Event and breadcrumb filtering
- ✅ Production-ready

## Log Files Structure

```
logs/
├── error-2025-11-11.log      # Size: 20MB max, Retention: 14 days
├── error-2025-11-12.log
├── combined-2025-11-11.log   # Size: 20MB max, Retention: 7 days
├── combined-2025-11-12.log
├── debug-2025-11-11.log      # Size: 20MB max, Retention: 3 days (dev only)
└── debug-2025-11-12.log
```

## Sensitive Data Filtering

Both services automatically filter:
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

And any object keys containing these patterns.

## TypeScript Support

All files are fully typed with TypeScript interfaces:
- `LogContext` - Logging context interface
- `LogMetadata` - Logging metadata interface
- `SentryEvent` - Sentry event interface
- `BreadcrumbOptions` - Breadcrumb interface

## Testing

All files compile successfully:
```bash
npm run build      # Full build including new files
npm run typecheck  # TypeScript compilation check
```

## Documentation

See `/LOGGING_AND_ERROR_TRACKING.md` for comprehensive usage guide with:
- Detailed setup instructions
- Code examples for all features
- Best practices
- Configuration recommendations
- Troubleshooting guide
- Production checklist

## Build Output

Files compile to:
- `/dist/common/logger/logger.service.js`
- `/dist/common/logger/logger.service.d.ts`
- `/dist/common/logger/logger.module.js`
- `/dist/common/logger/logger.module.d.ts`
- `/dist/common/sentry/sentry.service.js`
- `/dist/common/sentry/sentry.service.d.ts`

## Next Steps

1. Import LoggerModule in AppModule
2. (Optional) Install @sentry/node and import SentryModule
3. Set required environment variables
4. Start using LoggerService and/or SentryService in your services
5. Review `/LOGGING_AND_ERROR_TRACKING.md` for advanced usage

## Support

For issues or questions:
1. Check `/LOGGING_AND_ERROR_TRACKING.md` troubleshooting section
2. Review Winston documentation: https://github.com/winstonjs/winston
3. Review Sentry documentation: https://docs.sentry.io/platforms/node/
