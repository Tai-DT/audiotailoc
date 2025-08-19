import { Module } from '@nestjs/common';
import { ZaloWebhookController } from './zalo.controller';
import { ZaloService } from './zalo.service';

@Module({
  controllers: [ZaloWebhookController],
  providers: [ZaloService],
})
export class WebhooksModule {}


