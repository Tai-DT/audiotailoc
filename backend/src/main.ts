import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import helmet from 'helmet';
import compression from 'compression';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
import { json, urlencoded } from 'express';
import { Logger, ValidationPipe, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { BigIntSerializeInterceptor } from './common/interceptors/bigint-serialize.interceptor';
import { CsrfMiddleware } from './common/security/csrf.middleware';

// Guard against EPIPE/EIO when stdout/stderr is closed (e.g., cron jobs or piped output).
// This prevents Nest's ConsoleLogger from crashing the process when writes fail.
if (process && process.stdout && typeof process.stdout.on === 'function') {
  process.stdout.on('error', (err: any) => {
    if (err && (err.code === 'EPIPE' || err.code === 'EIO')) {
      // Ignore broken pipe / I/O errors on stdout
      return;
    }
    // Surface unexpected stdout errors
    console.error('Unhandled stdout error:', err);
  });

  process.stderr.on('error', (err: any) => {
    if (err && (err.code === 'EPIPE' || err.code === 'EIO')) {
      return;
    }
    console.error('Unhandled stderr error:', err);
  });
}

// Suppress DEP0190 deprecation warning from cron package
// The cron package uses child_process with shell: true, which triggers this warning
// This is a known issue in the cron package and doesn't affect functionality
process.on('warning', (warning: Error & { name?: string; code?: string }) => {
  // Suppress only DEP0190 warnings (child process shell option)
  // By handling the warning event, we prevent the default console output
  if (warning.name === 'DeprecationWarning' && warning.code === 'DEP0190') {
    return; // Suppress this specific warning - don't log it
  }
  // Other warnings will still be logged by default Node.js behavior
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger('Bootstrap');
  const config = app.get(ConfigService);

  // Enable trust proxy for Heroku/reverse proxy (fixes X-Forwarded-For warnings)
  // Use number instead of true to avoid rate limiting bypass vulnerability
  // 1 = trust first proxy (for single reverse proxy like Heroku, nginx)
  const trustProxyCount = config.get<number>('TRUST_PROXY_COUNT') ?? (process.env.NODE_ENV === 'production' ? 1 : false);
  app.getHttpAdapter().getInstance().set('trust proxy', trustProxyCount);

  // Get port early to avoid hoisting issues
  const port = Number(process.env.PORT || config.get('PORT') || 3010);

  // Prisma directUrl fallback: allow setups that only provide DATABASE_URL.
  // If DIRECT_DATABASE_URL is not explicitly set, default it to DATABASE_URL.
  const databaseUrl = config.get<string>('DATABASE_URL');
  const directDatabaseUrl = config.get<string>('DIRECT_DATABASE_URL');
  if (!directDatabaseUrl && databaseUrl) {
    process.env.DIRECT_DATABASE_URL = databaseUrl;
  }

  // Validate required environment variables
  const requiredEnvVars = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

  const missingVars = requiredEnvVars.filter(varName => !config.get(varName));
  if (missingVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  // Performance middleware
  app.use(
    compression({
      level: 6, // Good balance between compression and performance
      threshold: 1024, // Only compress responses larger than 1KB
      // Use any to avoid conflicts between different @types/express packages (e.g., multer vs express)
      filter: (req: any, res: any) => {
        // Don't compress responses with this request header
        if (req && req.headers && req.headers['x-no-compression']) {
          return false;
        }
        // Use compression filter function - cast to any to avoid incompatible Request types
        return (compression as any).filter(req, res);
      },
    }),
  );

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false, // For development/third-party image compat
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin images
      frameguard: { action: 'deny' }, // X-Frame-Options: DENY
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, // Better privacy/security
      xssFilter: true, // X-XSS-Protection
    }),
  );

  // Enhanced CORS configuration
  // Support both CORS_ORIGIN and CORS_ORIGINS to avoid env mismatch across deployments.
  const corsOrigins =
    config.get('CORS_ORIGIN') ||
    config.get('CORS_ORIGINS') ||
    'http://localhost:3000,http://localhost:3001,http://localhost:3002,https://*.vercel.app';
  const allowedOrigins = corsOrigins.split(',').map((origin: string) => origin.trim());

  app.enableCors({
    origin: (origin, callback) => {
      // SECURITY: Stricter CORS handling for production
      if (!origin) {
        // In development, allow localhost without origin (like Postman)
        if (process.env.NODE_ENV === 'development') {
          return callback(null, true);
        }
        // In production, allow requests without origin but log warning
        // Note: Some legitimate clients (mobile apps, curl) may not send Origin header
        // Consider implementing additional middleware to validate these requests
        logger.warn('CORS: Request without Origin header in production - consider stricter validation');
        return callback(null, true);
      }

      // Check exact match first
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      }
      // Check wildcard patterns for Vercel domains
      else if (
        allowedOrigins.some(allowedOrigin => {
          if (allowedOrigin.includes('*')) {
            const pattern = allowedOrigin.replace('*', '.*');
            const regex = new RegExp(pattern);
            return regex.test(origin);
          }
          return false;
        })
      ) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked request from: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // Include custom admin header to support dashboard admin requests from browser
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Idempotency-Key',
      'X-Admin-Key',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  });

  // Body parsing with optimized limits
  app.use(
    json({
      limit: '2mb',
      verify: (req: any, res, buf) => {
        // Verify request body size for security
        if (buf.length > 2 * 1024 * 1024) {
          throw new Error('Request body too large');
        }
      },
    }),
  );
  app.use(
    urlencoded({
      extended: true,
      limit: '2mb',
      parameterLimit: 10000, // Limit number of parameters
    }),
  );

  // Global pipes with enhanced validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Drop properties not defined in the DTO
      forbidNonWhitelisted: false, // Drop instead of error (safer for migration)
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: errors => {
        const messages = errors.map(
          error => `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`,
        );
        return new HttpException(
          {
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Validation failed',
            errors: messages,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    }),
  );

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new BigIntSerializeInterceptor(), // Must be first to serialize BigInt before other interceptors
    new LoggingInterceptor(),
    new ResponseTransformInterceptor(),
  );

  // Note: ApiVersioningInterceptor is registered in the ApiVersioningModule

  // CSRF Protection middleware
  // Protects against Cross-Site Request Forgery attacks
  const csrfMiddleware = new CsrfMiddleware(config);
  app.use((req: Request, res: Response, next: NextFunction) => {
    csrfMiddleware.use(req, res, next);
  });

  // Rate limiting middleware
  // Note: express-rate-limit automatically uses Express's 'trust proxy' setting
  // By setting trust proxy to a number (not true), we avoid the bypass vulnerability
  // 
  // SECURITY: Global rate limiting as baseline protection
  // - Per-endpoint rate limits are configured in controllers using @Throttle decorator
  // - Auth endpoints have stricter limits (see auth.controller.ts)
  // - This global limiter provides defense-in-depth for all endpoints
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 300 requests per windowMs (hardened baseline)
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => {
      // Skip rate limiting for health checks
      return req.url.includes('/health');
    },
  });
  app.use(limiter);

  // Global prefix - sử dụng API v1 (phiên bản duy nhất và tốt nhất)
  // Exclude health và root endpoints khỏi prefix để hỗ trợ cả /health và /api/v1/health
  app.setGlobalPrefix('api/v1', {
    exclude: ['health', ''],
  });

  // Simple documentation for single API version
  const enableDocs = (config.get('ENABLE_SWAGGER') ?? 'true') !== 'false';

  if (enableDocs) {
    // Single-version documentation
    const apiConfig = new DocumentBuilder()
      .setTitle('Audio Tài Lộc API v1')
      .setDescription('Complete API documentation for Audio Tài Lộc platform - Unified Version')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Users', 'User management endpoints')
      .addTag('Catalog', 'Product catalog endpoints')
      .addTag('Cart', 'Shopping cart endpoints')
      .addTag('Orders', 'Order management endpoints')
      .addTag('Payments', 'Payment processing endpoints')
      .addTag('Services', 'Service management endpoints')
      .addTag('Bookings', 'Booking management endpoints')
      .addTag('Search', 'Search and discovery endpoints')
      .addTag('Files', 'File management endpoints')
      .addTag('Support', 'Customer support endpoints')
      .addTag('Health', 'Health check endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, apiConfig);

    // Main documentation
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'Audio Tài Lộc API v1 - Complete Documentation',
      customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title {
          color: #667eea;
          font-size: 2.5em;
        }
        .swagger-ui .scheme-container {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
        }
        .swagger-ui .opblock.opblock-post {
          border-color: #49cc90;
        }
        .swagger-ui .opblock.opblock-get {
          border-color: #61affe;
        }
        .swagger-ui .opblock.opblock-put {
          border-color: #fca130;
        }
        .swagger-ui .opblock.opblock-delete {
          border-color: #f93e3e;
        }
        .swagger-ui .opblock.opblock-patch {
          border-color: #50e3c2;
        }
      `,
    });

    // API tooling access
    SwaggerModule.setup('api/v1/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    });

    logger.log(`📚 API v1 Documentation: http://localhost:${port}/docs`);
    logger.log(`🔧 API v1 Tooling: http://localhost:${port}/api/v1/docs`);
  }

  // Enforce JWT secrets in production
  if ((config.get('NODE_ENV') || 'development') === 'production') {
    if (!config.get('JWT_ACCESS_SECRET') || !config.get('JWT_REFRESH_SECRET')) {
      throw new Error('Missing JWT secrets in production');
    }
  }

  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Audio Tài Lộc API v1 đang chạy tại: http://localhost:${port}`);
  logger.log(`📚 API v1 Documentation: http://localhost:${port}/docs`);
  logger.log(`🔧 API v1 Tooling: http://localhost:${port}/api/v1/docs`);
  logger.log(`🏥 Health Check: http://localhost:${port}/health`);
  logger.log(`🌍 Environment: ${config.get('NODE_ENV') || 'development'}`);
  logger.log(`🎯 Current API Version: v1 (Unified Complete Edition)`);
}

bootstrap().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
