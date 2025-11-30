import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [AuthModule, NotificationsModule],
  providers: [SupportService],
  controllers: [SupportController, KnowledgeBaseController],
  exports: [SupportService],
})
export class SupportModule { }
