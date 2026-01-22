import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { GuardsModule } from '../auth/guards.module';
import { CacheService } from '../caching/cache.service';

import { InventoryModule } from '../inventory/inventory.module';

import { PromotionsModule } from '../promotions/promotions.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    NotificationsModule,
    GuardsModule,
    InventoryModule,
    PromotionsModule,
    CartModule,
  ],
  providers: [OrdersService, CacheService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
