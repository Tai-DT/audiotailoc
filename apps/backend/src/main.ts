import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { Logger, ValidationPipe } from '@nestjs/common';
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

  // CORS configuration
  const corsOrigins = config.get('CORS_ORIGIN', 'http://localhost:3000,http://localhost:3001');
  app.enableCors({
    origin: corsOrigins.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Body parsing
  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true, limit: '2mb' }));

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
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

  // Swagger documentation
  if (config.get('NODE_ENV') !== 'production') {
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
    
    const document = SwaggerModule.createDocument(app, docConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
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


