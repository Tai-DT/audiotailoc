import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PayOSService } from './payos.service';
import { PaymentsController } from './payments.controller';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [AuthModule, NotificationsModule],
  providers: [PaymentsService, PayOSService],
  controllers: [PaymentsController],
  exports: [PaymentsService, PayOSService],
})
export class PaymentsModule {}
