import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiVersioningController } from './api-versioning.controller';
import { ApiVersioningService } from './api-versioning.service';
import { ApiVersioningInterceptor } from './api-versioning.interceptor';
import { ApiVersioningGuard } from './api-versioning.guard';

@Global()
@Module({
  controllers: [ApiVersioningController],
  providers: [
    ApiVersioningService,
    ApiVersioningGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiVersioningInterceptor,
    },
  ],
  exports: [
    ApiVersioningService,
    ApiVersioningGuard,
  ],
})
export class ApiVersioningModule {}
