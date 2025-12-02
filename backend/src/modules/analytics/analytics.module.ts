import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { GuardsModule } from '../auth/guards.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { CacheModule } from '../caching/cache.module';

@Module({
  imports: [
    GuardsModule,
    PrismaModule,
    CacheModule.forRoot({ isGlobal: false, ttl: 300 }),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
