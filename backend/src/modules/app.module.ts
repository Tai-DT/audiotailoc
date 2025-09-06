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
// import { CartModule } from './cart/cart.module'; // Disabled due to schema mismatch
// import { PromotionsModule } from './promotions/promotions.module'; // Disabled due to schema mismatch
// import { CheckoutModule } from './checkout/checkout.module'; // Disabled due to dependencies
import { PaymentsModule } from './payments/payments.module';
import { CartModule } from './cart/cart.module';
import { PromotionsModule } from './promotions/promotions.module';
import { CheckoutModule } from './checkout/checkout.module';
import { OrdersModule } from './orders/orders.module';
import { InventoryModule } from './inventory/inventory.module';

// AI and ML modules
import { AiModule } from './ai/ai.module'; // Đã fix với Gemini integration

// Support and integrations - ENABLING STEP BY STEP
import { SupportModule } from './support/support.module';
// import { WebhooksModule } from './webhooks/webhooks.module'; // Disabled due to schema mismatch
import { NotificationsModule } from './notifications/notifications.module';
import { WebSocketModule } from './websocket/websocket.module';

// Additional modules - ENABLING STEP BY STEP
import { FilesModule } from './files/files.module';
// import { SearchModule } from './search/search.module'; // Disabled due to schema mismatch
// Removed ApiVersioningModule - using single v1 API

// Service Management modules - DISABLED FOR MINIMAL STARTUP
// import { ServicesModule } from './services/services.module'; // Disabled due to schema mismatch
// import { BookingModule } from './booking/booking.module'; // Disabled due to enum dependencies
// import { TechniciansModule } from './technicians/technicians.module'; // Disabled due to schema mismatch

const FEATURE_CHECKOUT = String(process.env.FEATURE_CHECKOUT || '').toLowerCase() === 'true';
const runtimeImports = [
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
    
    // Support and File Management - ENABLED
    SupportModule,
    NotificationsModule,
  WebSocketModule,
    FilesModule,
    
    // E-commerce modules - ENABLING STEP BY STEP
    CatalogModule,
    PaymentsModule,
    OrdersModule,
    InventoryModule,
];

if (FEATURE_CHECKOUT) {
  runtimeImports.push(CartModule, PromotionsModule, CheckoutModule);
}

@Module({
  imports: runtimeImports,
  controllers: [AppController],
})
export class AppModule {}
