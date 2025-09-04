import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';

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
import { AppModule } from './modules/app.module';
import helmet from 'helmet';
import compression from 'compression';
import type { Request, Response } from 'express';
import { json, urlencoded } from 'express';
import { Logger, ValidationPipe, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger('Bootstrap');
  const config = app.get(ConfigService);

  // Get port early to avoid hoisting issues
  const port = Number(process.env.PORT || config.get('PORT') || 3010);

  // Validate required environment variables
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !config.get(varName));
  if (missingVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  // Performance middleware
  app.use(compression({
    level: 6, // Good balance between compression and performance
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req: Request, res: Response) => {
      // Don't compress responses with this request header
      if (req.headers['x-no-compression']) {
        return false;
      }
      // Use compression filter function
      return compression.filter(req, res);
    },
  }));

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  // Enhanced CORS configuration
  const corsOrigins = config.get('CORS_ORIGIN', 'http://localhost:3000,http://localhost:3001,http://localhost:3002');
  const allowedOrigins = corsOrigins.split(',').map((origin: string) => origin.trim());
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked request from: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Idempotency-Key'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  });

  // Body parsing with optimized limits
  app.use(json({
    limit: '2mb',
    verify: (req: any, res, buf) => {
      // Verify request body size for security
      if (buf.length > 2 * 1024 * 1024) {
        throw new Error('Request body too large');
      }
    }
  }));
  app.use(urlencoded({
    extended: true,
    limit: '2mb',
    parameterLimit: 10000 // Limit number of parameters
  }));

  // Global pipes with enhanced validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) => {
        const messages = errors.map(error => 
          `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`
        );
        return new HttpException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Validation failed',
          errors: messages,
        }, HttpStatus.UNPROCESSABLE_ENTITY);
      },
    }),
  );

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseTransformInterceptor(),
  );

  // Note: ApiVersioningInterceptor is registered in the ApiVersioningModule

  // Rate limiting middleware
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
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
  app.setGlobalPrefix('api/v1');

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
      .addTag('AI', 'AI-powered features endpoints')
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

  await app.listen(port);

  // Initialize graceful shutdown after server starts (commented out - service doesn't exist)
  // const shutdownService = app.get(GracefulShutdownService);
  // if (shutdownService) {
  //   logger.log('🛑 Graceful shutdown service initialized');
  // }

  logger.log(`🚀 Audio Tài Lộc API v1 đang chạy tại: http://localhost:${port}`);
  logger.log(`📚 API v1 Documentation: http://localhost:${port}/docs`);
  logger.log(`🔧 API v1 Tooling: http://localhost:${port}/api/v1/docs`);
  logger.log(`🏥 Health Check: http://localhost:${port}/api/v1/health`);
  logger.log(`🌍 Environment: ${config.get('NODE_ENV') || 'development'}`);
  logger.log(`🎯 Current API Version: v1 (Unified Complete Edition)`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
