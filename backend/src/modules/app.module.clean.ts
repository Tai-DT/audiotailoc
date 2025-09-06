import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from '../prisma/prisma.module';

// Global modules
import { CacheModule } from './caching/cache.module';
import { TestingModule } from './testing/testing.module';
import { GracefulShutdownModule } from './graceful-shutdown/graceful-shutdown.module';
import { LoggingModule } from './logging/logging.module';
import { MonitoringModule } from './monitoring/monitoring.module';

// Authentication & Security modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SecurityModule } from './security/security.module';

// E-commerce modules
import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';
import { PaymentsModule } from './payments/payments.module';
import { ServicesModule } from './services/services.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
import { AnalyticsModule } from './analytics/analytics.module';

// AI and ML modules
import { AiModule } from './ai/ai.module';

// Support and integrations
import { SupportModule } from './support/support.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WebhooksModule } from './webhooks/webhooks.module';

// Additional modules
import { FilesModule } from './files/files.module';
import { SearchModule } from './search/search.module';
import { MapsModule } from './maps/maps.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    CacheModule.forRoot({
      isGlobal: true,
    }), // Global cache service
    PrismaModule,
    HealthModule,
    TestingModule, // Testing utilities
    GracefulShutdownModule,
    LoggingModule,
    MonitoringModule,

    // Authentication & Security
    AuthModule,
    UsersModule,
    SecurityModule,

    // AI and Intelligence
    AiModule,

    // E-commerce modules
    CatalogModule,
    CartModule,
    PaymentsModule,
    ServicesModule,
    InventoryModule,
    OrdersModule,
    AdminModule,
    AnalyticsModule,

    // Support and integrations
    SupportModule,
    NotificationsModule,
    WebhooksModule,
    FilesModule,
    SearchModule,
    MapsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
