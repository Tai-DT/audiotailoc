import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './modules/caching/cache.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
// Feature modules
import { UsersModule } from './modules/users/users.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { CompleteProductModule } from './modules/catalog/complete-product.module';
import { ServicesModule } from './modules/services/services.module';
import { ServiceTypesModule } from './modules/service-types/service-types.module';
import { BookingModule } from './modules/booking/booking.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CartModule } from './modules/cart/cart.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AiModule } from './modules/ai/ai.module';
import { SearchModule } from './modules/search/search.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FilesModule } from './modules/files/files.module';
import { ServiceReviewsModule } from './modules/service-reviews/service-reviews.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CacheModule.forRoot({ isGlobal: true, ttl: 300 }),
    HealthModule,
    AuthModule,
    AnalyticsModule,
    ReviewsModule,
    // Feature modules
    UsersModule,
    CatalogModule,
    CompleteProductModule,
    ServicesModule,
    ServiceTypesModule,
    BookingModule,
    InventoryModule,
    OrdersModule,
    CartModule,
    WishlistModule,
    CategoriesModule,
    AiModule,
    SearchModule,
    NotificationsModule,
    FilesModule,
    ServiceReviewsModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
