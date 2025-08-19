import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger('Bootstrap');

  app.use(helmet());
  app.enableCors();
  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const config = app.get(ConfigService);
  if (config.get('NODE_ENV') !== 'production') {
    const docConfig = new DocumentBuilder()
      .setTitle('Audiotailoc API')
      .setVersion('0.1.0')
      .build();
    const document = SwaggerModule.createDocument(app, docConfig);
    SwaggerModule.setup('docs', app, document);
  }
  const port = Number(config.get('PORT') || 3001);
  await app.listen(port);
  logger.log(`Backend listening on http://localhost:${port}`);
}

bootstrap();


