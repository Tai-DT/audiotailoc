import { Module } from '@nestjs/common';
import { CustomerInsightsController } from './customer-insights.controller';
import { CustomerInsightsService } from './customer-insights.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GuardsModule } from '../auth/guards.module';

@Module({
  imports: [GuardsModule],
  controllers: [CustomerInsightsController],
  providers: [CustomerInsightsService],
  exports: [CustomerInsightsService],
})
export class CustomerInsightsModule {}
