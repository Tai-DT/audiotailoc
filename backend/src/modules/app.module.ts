import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from '../prisma/prisma.module';

// Global modules
import { CacheModule } from './cache/cache.module';

// Authentication modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// E-commerce modules
import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';
import { PromotionsModule } from './promotions/promotions.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module';
import { InventoryModule } from './inventory/inventory.module';

// AI and ML modules
import { AiModule } from './ai/ai.module'; // Đã fix với Gemini integration

// Analytics and Reporting
import { AnalyticsModule } from './analytics/analytics.module';

// Support and integrations
import { SupportModule } from './support/support.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { NotificationsModule } from './notifications/notifications.module';

// Marketing
import { MarketingModule } from './marketing/marketing.module';

// Additional modules
import { FilesModule } from './files/files.module';
import { SearchModule } from './search/search.module';

// Service Management modules
import { ServicesModule } from './services/services.module';
import { BookingModule } from './booking/booking.module';
import { TechniciansModule } from './technicians/technicians.module';

// CMS Modules
import { PagesModule } from './pages/pages.module';
import { ProjectsModule } from './projects/projects.module';

// Internationalization and SEO
import { I18nModule } from './i18n/i18n.module';
import { SeoModule } from './seo/seo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute window
      limit: 10, // 10 requests per window per IP
    }]),
    LoggerModule,
    CacheModule, // Global cache service
    PrismaModule,
    HealthModule,
    
    // Authentication
    AuthModule,
    UsersModule,
    
    // E-commerce core
    CatalogModule,
    CartModule,
    PromotionsModule,
    CheckoutModule,
    PaymentsModule,
    OrdersModule,
    InventoryModule,
    
    // AI and Intelligence - Gemini AI Integration
    AiModule,
    
    // Analytics and Reporting
    AnalyticsModule,
    
    // Support and Integrations  
    SupportModule,
    WebhooksModule,
    NotificationsModule,
    
    // Marketing
    MarketingModule,
    
    // File Management
    FilesModule,
    
    // Search and Discovery
    SearchModule,
    
    // CMS & Portfolio
    PagesModule,
    ProjectsModule,

    // Service Management
    ServicesModule,
    BookingModule,
    TechniciansModule,

    // Internationalization and SEO
    I18nModule,
    SeoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

