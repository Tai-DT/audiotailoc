import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './modules/caching/cache.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CacheModule.forRoot({ isGlobal: true, ttl: 300 }),
    HealthModule,
    AuthModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}