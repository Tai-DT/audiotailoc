import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { EmbeddingService } from './embedding.service';
import { GeminiService } from './gemini.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [AiService, EmbeddingService, GeminiService],
  controllers: [AiController],
  exports: [AiService, GeminiService],
})
export class AiModule {}

