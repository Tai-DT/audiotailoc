import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { EmbeddingService } from './embedding.service';

@Module({
  providers: [AiService, EmbeddingService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}

