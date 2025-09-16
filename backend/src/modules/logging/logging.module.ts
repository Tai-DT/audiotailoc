import { Module, Global, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingService } from './logging.service';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggingMiddleware } from './logging.middleware';
import { CorrelationService } from './correlation.service';

@Global()
@Module({
  providers: [
    LoggingService,
    CorrelationService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [
    LoggingService,
    CorrelationService,
  ],
})
export class LoggingModule implements NestModule {
  constructor(private readonly loggingService: LoggingService) {}

  configure(consumer: MiddlewareConsumer) {
    // Apply logging middleware to all routes except health checks
    consumer
      .apply(LoggingMiddleware)
      .exclude('health', 'monitoring/health', 'api/v1/monitoring/health')
      .forRoutes('*');
  }

  // Cleanup method for graceful shutdown
  onModuleDestroy() {
    // Cleanup correlation contexts
    const cleaned = (this.constructor as any).cleanup();
    if (cleaned > 0) {
      this.loggingService.log(`Cleaned up ${cleaned} correlation contexts`, 'LoggingModule');
    }
  }
}
