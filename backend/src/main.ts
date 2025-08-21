import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { Logger, ValidationPipe, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger('Bootstrap');
  const config = app.get(ConfigService);

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

  // Body parsing
  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true, limit: '2mb' }));

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
  // app.useGlobalInterceptors(new LoggingInterceptor()); // Temporarily disabled due to rxjs version conflict

  // Simple logging middleware
  app.use((req: any, res: any, next: any) => {
    const startTime = Date.now();
    const { method, url, ip } = req;
    const userAgent = req.headers['user-agent'] || '';
    
    logger.log(`Incoming Request: ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.log(`Outgoing Response: ${method} ${url} - ${res.statusCode} - ${duration}ms`);
    });
    
    next();
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation (enabled by env)
  const enableDocs = (config.get('ENABLE_SWAGGER') ?? 'true') !== 'false';
  const docConfig = new DocumentBuilder()
    .setTitle('Audio Tài Lộc API')
    .setDescription('API documentation for Audio Tài Lộc platform')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Products', 'Product management endpoints')
    .addTag('Orders', 'Order management endpoints')
    .addTag('Health', 'Health check endpoints')
    .build();
  
  if (enableDocs) {
    const document = SwaggerModule.createDocument(app, docConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    // Also expose Swagger under the API prefix for tooling/tests
    SwaggerModule.setup('api/v1/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  // Enforce JWT secrets in production
  if ((config.get('NODE_ENV') || 'development') === 'production') {
    if (!config.get('JWT_ACCESS_SECRET') || !config.get('JWT_REFRESH_SECRET')) {
      throw new Error('Missing JWT secrets in production');
    }
  }

  const port = Number(config.get('PORT') || 3010);
  await app.listen(port);
  
  logger.log(`🚀 Audio Tài Lộc API is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/docs`);
  logger.log(`🏥 Health Check: http://localhost:${port}/api/v1/health`);
  logger.log(`🌍 Environment: ${config.get('NODE_ENV') || 'development'}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

