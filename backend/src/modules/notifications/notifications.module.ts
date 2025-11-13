 import { Module } from '@nestjs/common';
 import { PrismaModule } from '../../prisma/prisma.module';
 import { MailService } from './mail.service';
 import { NotificationService } from './notification.service';
 import { NotificationGateway } from './notification.gateway';

 @Module({
   imports: [PrismaModule],
   providers: [MailService, NotificationService, NotificationGateway],
   exports: [MailService, NotificationService, NotificationGateway],
 })
 export class NotificationsModule {}