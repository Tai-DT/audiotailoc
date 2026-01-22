import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MailService } from './mail.service';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationsController } from './notifications.controller';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { MessagesModule } from '../messages/messages.module';
import { AnalyticsModule } from '../analytics/analytics.module';

import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [PrismaModule, MessagesModule, AnalyticsModule, LoggingModule],
  controllers: [NotificationsController, TelegramController],
  providers: [MailService, NotificationService, NotificationGateway, TelegramService],
  exports: [MailService, NotificationService, NotificationGateway, TelegramService],
})
export class NotificationsModule {}
