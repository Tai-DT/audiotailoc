import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PayOSService } from './payos.service';
import { PaymentsController } from './payments.controller';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [AuthModule, NotificationsModule, OrdersModule],
  providers: [PaymentsService, PayOSService],
  controllers: [PaymentsController],
  exports: [PaymentsService, PayOSService],
})
export class PaymentsModule {}
