import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from '../prisma/prisma.module';

// Global modules
import { CacheModule } from './cache/cache.module';
import { TestingModule } from './testing/testing.module';

// Authentication modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// E-commerce modules - ENABLING STEP BY STEP
import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module'; // ✅ Schema mismatch fixed
import { PromotionsModule } from './promotions/promotions.module'; // ✅ Schema mismatch fixed
import { CheckoutModule } from './checkout/checkout.module'; // ✅ Dependencies resolved
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module'; // ✅ Schema mismatch fixed
import { InventoryModule } from './inventory/inventory.module'; // ✅ Schema mismatch fixed

// AI and ML modules
import { AiModule } from './ai/ai.module'; // Đã fix với Gemini integration

// Support and integrations - ENABLING STEP BY STEP
import { SupportModule } from './support/support.module';
// import { WebhooksModule } from './webhooks/webhooks.module'; // Disabled due to schema mismatch
import { NotificationsModule } from './notifications/notifications.module';

// Additional modules - ENABLING STEP BY STEP
import { FilesModule } from './files/files.module';
// import { SearchModule } from './search/search.module'; // Disabled due to schema mismatch
// Removed ApiVersioningModule - using single v1 API

// Service Management modules - DISABLED FOR MINIMAL STARTUP
// import { ServicesModule } from './services/services.module'; // Disabled due to schema mismatch
// import { BookingModule } from './booking/booking.module'; // Disabled due to enum dependencies
// import { TechniciansModule } from './technicians/technicians.module'; // Disabled due to schema mismatch

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

