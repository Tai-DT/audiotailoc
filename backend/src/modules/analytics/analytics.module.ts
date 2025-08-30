import { Module } from '@nestjs/common';
import { SimpleAnalyticsService } from './simple-analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  providers: [SimpleAnalyticsService],
  controllers: [AnalyticsController],
  exports: [SimpleAnalyticsService],
})
export class AnalyticsModule {}
