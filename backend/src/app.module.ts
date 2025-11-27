import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './modules/caching/cache.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { OrdersModule } from './modules/orders/orders.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ChatModule } from './modules/chat/chat.module';
import { SupportModule } from './modules/support/support.module';
import { TechniciansModule } from './modules/technicians/technicians.module';
import { ServicesModule } from './modules/services/services.module';
import { ServiceTypesModule } from './modules/service-types/service-types.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { BackupModule } from './modules/backup/backup.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SiteModule } from './modules/site/site.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CacheModule.forRoot({ isGlobal: true, ttl: 300 }),
    HealthModule,
    FilesModule,
    CatalogModule,
    AuthModule,
    AnalyticsModule,
    CheckoutModule,
    OrdersModule,
    BookingsModule,
    PaymentsModule,
    ChatModule,
    SupportModule,
    TechniciansModule,
    ServicesModule,
    ServiceTypesModule,
    // Dashboard Modules
    PromotionsModule,
    ProjectsModule,
    MarketingModule, // Handles campaigns
    ReviewsModule,
    NotificationsModule,
    ReportsModule,
    BackupModule, // Use existing BackupModule
    SettingsModule,
    SiteModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: false,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        errorHttpStatusCode: 400,
      }),
    },
  ],
})
export class AppModule {}
