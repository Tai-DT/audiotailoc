import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

/**
 * AI Module
 * Provides AI-powered features: product recommendations, search suggestions, and chatbot
 * Integrates with Google Gemini API for advanced NLP capabilities
 */
@Module({
  imports: [PrismaModule, ConfigModule, AuthModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
