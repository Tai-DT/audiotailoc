import { Module } from '@nestjs/common';
import { CustomerInsightsController } from './customer-insights.controller';
import { CustomerInsightsService } from './customer-insights.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AiModule } from '../ai/ai.module';
import { GuardsModule } from '../auth/guards.module';

@Module({
  imports: [AiModule, GuardsModule],
  controllers: [CustomerInsightsController],
  providers: [CustomerInsightsService, PrismaService],
  exports: [CustomerInsightsService],
})
export class CustomerInsightsModule {}
