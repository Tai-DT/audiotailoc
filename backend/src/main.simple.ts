import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}
  
  @Get()
  getHello(): string {
    return 'Audio Tài Lộc Backend is running!';
  }

  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'SQLite Connected'
    };
  }

  @Get('api/v1/test')
  getTest() {
    return {
      message: 'Backend API is working!',
      version: 'v1.0.0',
      features: [
        'SQLite Database',
        'Prisma ORM',
        'Basic Health Check',
        'Environment Configuration'
      ]
    };
  }

  @Get('api/v1/users')
  async getUsers() {
    try {
      const users = await this.prisma.user.findMany({
        take: 10,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });
      return {
        success: true,
        data: users,
        count: users.length
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  @Get('api/v1/products')
  async getProducts() {
    try {
      const products = await this.prisma.product.findMany({
        take: 10,
        include: {
          category: true
        }
      });
      return {
        success: true,
        data: products,
        count: products.length
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule
  ],
  controllers: [AppController],
})
export class SimpleAppModule {}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(SimpleAppModule);
    
    // Enable CORS
    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
      credentials: true,
    });

    const port = process.env.PORT || 8000;
    await app.listen(port);
    
    logger.log(`🚀 Audio Tài Lộc Backend started successfully`);
    logger.log(`📋 Server running at: http://localhost:${port}`);
    logger.log(`🔍 Health check: http://localhost:${port}/health`);
    logger.log(`🧪 Test API: http://localhost:${port}/api/v1/test`);
    logger.log(`👥 Users API: http://localhost:${port}/api/v1/users`);
    logger.log(`📦 Products API: http://localhost:${port}/api/v1/products`);
    
  } catch (error) {
    logger.error('❌ Failed to start backend:', error);
    process.exit(1);
  }
}

bootstrap();
