import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
// import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from '../prisma/prisma.module';

// Global modules
import { CacheModule } from './caching/cache.module';
// import { TestingModule } from './testing/testing.module';

// Authentication modules
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';

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
import { WishlistModule } from './wishlist/wishlist.module';

// Complete Product API Module
import { CompleteProductModule } from './catalog/complete-product.module';

// Support and integrations - ENABLING STEP BY STEP
import { SupportModule } from './support/support.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BackupModule } from './backup/backup.module';
import { MarketingModule } from './marketing/marketing.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ReportsModule } from './reports/reports.module';

// Additional modules - ENABLING STEP BY STEP
import { FilesModule } from './files/files.module';
import { SearchModule } from './search/search.module';
// Removed ApiVersioningModule - using single v1 API
import { MapsModule } from './maps/maps.module';

// Advanced features
import { RealtimeModule } from './realtime/realtime.module';
import { AiModule } from './ai/ai.module';

// Service Management modules - DISABLED FOR MINIMAL STARTUP
import { ServicesModule } from './services/services.module';
import { ServiceTypesModule } from './service-types/service-types.module';
import { BookingModule } from './booking/booking.module';
import { TechniciansModule } from './technicians/technicians.module';

// Site Content Management
import { SiteModule } from './site/site.module';
import { ProjectsModule } from './projects/projects.module';
import { SeoModule } from './seo/seo.module';
import { BlogModule } from './blog/blog.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MessagesModule } from './messages/messages.module';

// Chat Module
import { ChatModule } from './chat/chat.module';

// Upload Module
import { UploadModule } from './upload/upload.module';

// FAQ and Policies
import { FaqModule } from './faq/faq.module';
import { PoliciesModule } from './policies/policies.module';

// Test module removed
// import { TestModule } from './test/test.module';

const FEATURE_CHECKOUT = String(process.env.FEATURE_CHECKOUT || '').toLowerCase() === 'true';
const runtimeImports = [
  ConfigModule.forRoot({ isGlobal: true }),
  // LoggerModule,
  CacheModule.forRoot({
    isGlobal: true,
  }), // Global cache service
  PrismaModule,
  HealthModule,
  // TestingModule, // Testing utilities

  // Authentication - CORE ONLY
  AuthModule,
  SharedModule,
  UsersModule,
  AdminModule,

  // Support and File Management - ENABLED
  SupportModule,
  WebhooksModule,
  NotificationsModule,
  FilesModule,
  BackupModule,
  MarketingModule,
  MapsModule,
  AnalyticsModule,
  ReportsModule,

  // Advanced Features - ENABLED
  SearchModule,
  RealtimeModule,
  AiModule,

  // E-commerce modules - ENABLING STEP BY STEP
  CatalogModule,
  PaymentsModule,
  OrdersModule,
  InventoryModule,
  WishlistModule,

  // Complete Product API Module - NEW COMPLETE SYSTEM
  CompleteProductModule,

  // Services Management
  ServicesModule,
  ServiceTypesModule,
  BookingModule,
  TechniciansModule,

  // Site Content Management
  SiteModule,
  SeoModule,
  SiteModule,
  SeoModule,
  BlogModule,
  FaqModule,
  PoliciesModule,

  // Portfolio/Projects
  ProjectsModule,

  // Reviews
  ReviewsModule,

  // Messages / Notifications support
  MessagesModule,

  // Chat
  ChatModule,

  // Image Upload
  UploadModule,
];

if (FEATURE_CHECKOUT) {
  runtimeImports.push(CartModule, PromotionsModule, CheckoutModule);
}

@Module({
  imports: runtimeImports,
  controllers: [AppController],
})
export class AppModule { }
// Trigger rebuild for module registration
