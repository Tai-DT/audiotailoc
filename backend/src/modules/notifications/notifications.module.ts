import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { NotificationService } from './notification.service';
// import { WebSocketModule } from '../../websocket/websocket.module';

@Module({
  imports: [], // [WebSocketModule],
  providers: [MailService, NotificationService],
  exports: [MailService, NotificationService],
})
export class NotificationsModule {}
