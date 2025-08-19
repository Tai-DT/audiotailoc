import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';
import { CheckoutModule } from './checkout/checkout.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { SearchModule } from './search/search.module';
import { FilesModule } from './files/files.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AiModule } from './ai/ai.module';
import { MapsModule } from './maps/maps.module';
import { ChatModule } from './chat/chat.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LoggerModule, PrismaModule, HealthModule, AuthModule, UsersModule, CatalogModule, CartModule, CheckoutModule, OrdersModule, PaymentsModule, SearchModule, FilesModule, WebhooksModule, InventoryModule, AiModule, MapsModule, ChatModule],
  controllers: [AppController],
})
export class AppModule {}

