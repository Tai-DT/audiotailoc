import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { SharedModule } from './modules/shared/shared.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingModule } from './modules/booking/booking.module';
import { SiteModule } from './modules/site/site.module';
import { CartModule } from './modules/cart/cart.module';
import { BlogModule } from './modules/blog/blog.module';
import { PoliciesModule } from './modules/policies/policies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    HealthModule,
    ReviewsModule,
    PaymentsModule,
    AuthModule,
    BookingModule,
    SiteModule,
    CartModule,
    BlogModule,
    PoliciesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
