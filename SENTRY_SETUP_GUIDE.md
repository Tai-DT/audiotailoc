# Sentry Setup Guide

## 🔍 Error Tracking với Sentry

Hướng dẫn cấu hình Sentry để track lỗi trong production cho Audio Tài Lộc.

---

## 📦 1. Cài đặt Sentry

### Backend (NestJS)

```bash
cd backend
npm install --save @sentry/node @sentry/profiling-node
```

### Dashboard & Frontend (Next.js)

```bash
cd dashboard
npm install --save @sentry/nextjs

cd ../frontend
npm install --save @sentry/nextjs
```

---

## ⚙️ 2. Cấu hình Backend

### File: `backend/src/config/sentry.config.ts`

```typescript
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

export function initializeSentry() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      integrations: [
        new ProfilingIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      // Profiling
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      // Error filtering
      beforeSend(event, hint) {
        // Don't send errors in development
        if (process.env.NODE_ENV === 'development') {
          return null;
        }
        return event;
      },
    });
    
    console.log('✅ Sentry initialized');
  } else {
    console.warn('⚠️  Sentry DSN not configured');
  }
}
```

### File: `backend/src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeSentry } from './config/sentry.config';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  // Initialize Sentry FIRST
  initializeSentry();
  
  const app = await NestFactory.create(AppModule);
  
  // ... your existing config ...
  
  await app.listen(3010);
}

bootstrap().catch((err) => {
  Sentry.captureException(err);
  console.error('Failed to start server:', err);
  process.exit(1);
});
```

### File: `backend/src/filters/http-exception.filter.ts`

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Capture exception in Sentry (only 500 errors)
    if (status >= 500) {
      Sentry.captureException(exception, {
        tags: {
          endpoint: request.url,
          method: request.method,
        },
        extra: {
          body: request.body,
          query: request.query,
          params: request.params,
        },
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

### Cập nhật `backend/.env`

```env
# Sentry Configuration
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
```

---

## ⚙️ 3. Cấu hình Dashboard (Next.js)

### File: `dashboard/sentry.client.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

### File: `dashboard/sentry.server.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  debug: false,
});
```

### File: `dashboard/sentry.edge.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  debug: false,
});
```

### Cập nhật `dashboard/.env.local`

```env
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

---

## 🎯 4. Sử dụng Sentry

### Backend - Capture Exceptions

```typescript
import * as Sentry from '@sentry/node';

// In service
try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      feature: 'order-processing',
    },
    extra: {
      orderId: order.id,
      userId: user.id,
    },
  });
  throw error;
}
```

### Backend - Capture Messages

```typescript
import * as Sentry from '@sentry/node';

Sentry.captureMessage('User performed important action', {
  level: 'info',
  tags: {
    feature: 'user-activity',
  },
  extra: {
    userId: user.id,
    action: 'purchase',
  },
});
```

### Frontend - Error Boundary

```typescript
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Frontend - Manual Capture

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error);
  console.error(error);
}
```

---

## 📊 5. Sentry Dashboard Features

### What Sentry Tracks:

1. **Errors & Exceptions**
   - Unhandled exceptions
   - API errors
   - Database errors
   - Network errors

2. **Performance Monitoring**
   - API response times
   - Database query performance
   - Page load times
   - Component render times

3. **User Context**
   - User ID
   - User email
   - User IP address
   - Browser info
   - Device info

4. **Breadcrumbs**
   - User actions
   - Navigation
   - API calls
   - Console logs

5. **Session Replay** (Frontend)
   - Video replay of user session
   - See what user saw when error occurred

---

## 🚀 6. Setup Steps

1. **Create Sentry Account**
   - Go to https://sentry.io
   - Sign up for free account
   - Create new project for each: Backend, Dashboard, Frontend

2. **Get DSN**
   - Copy DSN from project settings
   - Add to environment variables

3. **Install & Configure**
   - Install Sentry packages
   - Add config files
   - Update environment variables

4. **Test**
   ```bash
   # Backend - Test error
   curl -X POST http://localhost:3010/api/v1/test-sentry
   
   # Dashboard - Trigger test error
   # Add button in dev: Sentry.captureException(new Error('Test'))
   ```

5. **Monitor**
   - Check Sentry dashboard
   - Verify errors are captured
   - Set up alerts

---

## ⚡ 7. Best Practices

### Do's ✅

- ✅ Capture 500 errors automatically
- ✅ Add context (user ID, order ID, etc.)
- ✅ Use tags for categorization
- ✅ Set proper sample rates (10% for production)
- ✅ Filter sensitive data (passwords, tokens)
- ✅ Set up alerts for critical errors
- ✅ Review errors weekly

### Don'ts ❌

- ❌ Don't capture 4xx errors (client errors)
- ❌ Don't log sensitive data
- ❌ Don't set 100% sample rate in production
- ❌ Don't ignore warnings from Sentry
- ❌ Don't capture expected errors

---

## 📝 8. Environment Variables

### Backend

```env
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=1.0.0
```

### Dashboard & Frontend

```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
SENTRY_AUTH_TOKEN=xxx  # For uploading source maps
```

---

## 🔔 9. Alerts Setup

Configure alerts in Sentry dashboard:

1. **Critical Errors** → Slack/Email immediately
2. **High Volume** → Alert when >100 errors/hour
3. **New Issues** → Daily digest email
4. **Regressions** → Alert when fixed issue reappears

---

## 📈 10. Metrics to Monitor

- Error rate
- Error frequency by endpoint
- Performance bottlenecks
- User impact (affected users)
- Error trends over time

---

## ✅ Quick Checklist

- [ ] Sentry account created
- [ ] Projects created (Backend, Dashboard, Frontend)
- [ ] DSN obtained and configured
- [ ] Packages installed
- [ ] Config files created
- [ ] Exception filter added (Backend)
- [ ] Error boundary added (Frontend)
- [ ] Environment variables set
- [ ] Test errors captured successfully
- [ ] Alerts configured
- [ ] Team notified about Sentry usage

---

## 🆘 Support

- Sentry Docs: https://docs.sentry.io
- NestJS Integration: https://docs.sentry.io/platforms/node/guides/nestjs/
- Next.js Integration: https://docs.sentry.io/platforms/javascript/guides/nextjs/

---

**Created:** 2025-11-12  
**For:** Audio Tài Lộc Project  
**By:** Development Team
