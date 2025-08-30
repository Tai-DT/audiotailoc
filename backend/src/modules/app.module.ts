import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from '../prisma/prisma.module';

// Global modules
import { CacheModule } from './caching/cache.module';
import { TestingModule } from './testing/testing.module';

// Authentication modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// E-commerce modules - ENABLING STEP BY STEP
import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';
// import { PromotionsModule } from './promotions/promotions.module'; // Fixing schema issues
// import { CheckoutModule } from './checkout/checkout.module'; // Fixing schema issues
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module';
// import { InventoryModule } from './inventory/inventory.module'; // Fixing schema issues

// AI and ML modules
import { AiModule } from './ai/ai.module'; // Đã fix với Gemini integration
import { AnalyticsModule } from './analytics/analytics.module';

// Support and integrations - ENABLING STEP BY STEP
import { SupportModule } from './support/support.module';
// import { WebhooksModule } from './webhooks/webhooks.module'; // Disabled due to schema mismatch
import { NotificationsModule } from './notifications/notifications.module';

// Additional modules - ENABLING STEP BY STEP
import { FilesModule } from './files/files.module';
// import { SearchModule } from './search/search.module'; // Will enable after fixing
// import { WebhooksModule } from './webhooks/webhooks.module'; // Fixing schema issues

// Service Management modules - FIXING SCHEMA ISSUES
// import { ServicesModule } from './services/services.module'; // Fixing schema issues
// import { BookingModule } from './booking/booking.module'; // Fixing schema issues
// import { TechniciansModule } from './technicians/technicians.module'; // Fixing schema issues

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
    
    // Authentication - CORE ONLY
    AuthModule,
    UsersModule,
    
    // AI and Intelligence - Minimal working version
    AiModule,
    AnalyticsModule,
    
    // Support and File Management - ENABLED
    SupportModule,
    NotificationsModule,
    FilesModule,
    
    // E-commerce modules - CORE ENABLED
    CatalogModule,
    CartModule,
    PaymentsModule,
    OrdersModule,
    // PromotionsModule, CheckoutModule, InventoryModule (fixing schema)
    
    // Additional modules - CORE ENABLED  
    // SearchModule, WebhooksModule (will enable after fixing)
    
    // Service Management modules - WILL ENABLE AFTER FIXING
    // ServicesModule, BookingModule, TechniciansModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

