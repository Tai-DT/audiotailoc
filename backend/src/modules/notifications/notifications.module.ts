import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MailService } from './mail.service';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationsController } from './notifications.controller';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { BackupModule } from '../backup/backup.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { MessagesModule } from '../messages/messages.module';
import { ChatModule } from '../chat/chat.module';
import { CacheModule } from '../caching/cache.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => BackupModule),
    forwardRef(() => AnalyticsModule),
    forwardRef(() => MessagesModule),
    forwardRef(() => ChatModule),
    CacheModule,
  ],
  controllers: [NotificationsController, TelegramController],
  providers: [MailService, NotificationService, NotificationGateway, TelegramService],
  exports: [MailService, NotificationService, NotificationGateway, TelegramService],
})
export class NotificationsModule {}
