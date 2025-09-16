import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Audio Tài Lộc API')
    .setDescription('API documentation for Audio Tài Lộc application')
    .setVersion('1.0')
    .addTag('Audio Tài Lộc')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(3010);
  console.log('🚀 Audio Tài Lộc API is running on: http://localhost:3010');
  console.log('📚 API Documentation: http://localhost:3010/api/v1/docs');
}
bootstrap();