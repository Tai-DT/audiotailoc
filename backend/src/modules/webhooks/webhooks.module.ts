import { Module } from '@nestjs/common';
import { ZaloWebhookController } from './zalo.controller';
import { ZaloService } from './zalo.service';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { PaymentsModule } from '../payments/payments.module';
import { OrdersModule } from '../orders/orders.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PaymentsModule, OrdersModule, NotificationsModule],
  providers: [ZaloService, WebhooksService],
  controllers: [ZaloWebhookController, WebhooksController],
  exports: [WebhooksService],
})
export class WebhooksModule {}


