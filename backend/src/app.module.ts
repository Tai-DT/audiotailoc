import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { AppController } from './modules/app.controller';
import { LoggerModule } from './modules/logger/logger.module';
import { PrismaModule } from './prisma/prisma.module';

// Global modules
import { CacheModule } from './modules/cache/cache.module';
import { TestingModule } from './modules/testing/testing.module';

// Authentication modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

// E-commerce modules - ENABLING STEP BY STEP
import { CatalogModule } from './modules/catalog/catalog.module';
import { CartModule } from './modules/cart/cart.module'; // ✅ Schema mismatch fixed
import { PromotionsModule } from './modules/promotions/promotions.module'; // ✅ Schema mismatch fixed
import { CheckoutModule } from './modules/checkout/checkout.module'; // ✅ Dependencies resolved
import { PaymentsModule } from './modules/payments/payments.module';
import { OrdersModule } from './modules/orders/orders.module'; // ✅ Schema mismatch fixed
import { InventoryModule } from './modules/inventory/inventory.module'; // ✅ Schema mismatch fixed

// AI and ML modules
import { AiModule } from './modules/ai/ai.module'; // Đã fix với Gemini integration

// Support and integrations - ENABLING STEP BY STEP
import { SupportModule } from './modules/support/support.module';
// import { WebhooksModule } from './modules/webhooks/webhooks.module'; // Disabled due to schema mismatch
import { NotificationsModule } from './modules/notifications/notifications.module';

// Additional modules - ENABLING STEP BY STEP
import { FilesModule } from './modules/files/files.module';
// import { SearchModule } from './modules/search/search.module'; // Disabled due to schema mismatch
// Removed ApiVersioningModule - using single v1 API

// Service Management modules - DISABLED FOR MINIMAL STARTUP
// import { ServicesModule } from './modules/services/services.module'; // Disabled due to schema mismatch
// import { BookingModule } from './modules/booking/booking.module'; // Disabled due to enum dependencies
// import { TechniciansModule } from './modules/technicians/technicians.module'; // Disabled due to schema mismatch

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    CacheModule, // Global cache service
    PrismaModule,
    HealthModule,
    TestingModule, // Testing utilities

    // Authentication - CORE ONLY
    AuthModule,
    UsersModule,

    // AI and Intelligence - Minimal working version
    AiModule,

    // Support and File Management - ENABLED
    SupportModule,
    NotificationsModule,
    FilesModule,

    // E-commerce modules - ENABLING STEP BY STEP
    CatalogModule,
    CartModule, // ✅ Enabled
    PromotionsModule, // ✅ Enabled
    CheckoutModule, // ✅ Enabled
    OrdersModule, // ✅ Enabled
    InventoryModule, // ✅ Enabled
    PaymentsModule,
    // WebhooksModule, SearchModule, ServicesModule, TechniciansModule
  ],
  controllers: [AppController],
})
export class AppModule {}