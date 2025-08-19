import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersGateway } from './orders.gateway';
import { MailService } from '../notifications/mail.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [OrdersService, OrdersGateway, MailService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
