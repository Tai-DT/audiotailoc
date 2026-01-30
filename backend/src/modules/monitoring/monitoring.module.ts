import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { MonitoringMiddleware } from './monitoring.middleware';
import { MonitoringInterceptor } from './monitoring.interceptor';
import { LoggingService } from './logging.service';

@Module({
  controllers: [MonitoringController],
  providers: [
    MonitoringService,
    LoggingService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MonitoringInterceptor,
    },
  ],
  exports: [MonitoringService, LoggingService],
})
export class MonitoringModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MonitoringMiddleware).forRoutes('*'); // Apply to all routes
  }
}
