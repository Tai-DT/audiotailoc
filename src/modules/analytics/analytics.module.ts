import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { PublicAnalyticsController } from './public-analytics.controller';
import { GuardsModule } from '../auth/guards.module';

@Module({
  imports: [GuardsModule],
  providers: [AnalyticsService],
  controllers: [AnalyticsController, PublicAnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
