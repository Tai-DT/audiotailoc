import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { EmbeddingService } from './embedding.service';
import { CacheService } from '../common/cache.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [AiService, EmbeddingService, CacheService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}

