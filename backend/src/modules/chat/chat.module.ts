import { Module, forwardRef } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RealtimeModule } from '../realtime/realtime.module';

import { NotificationsModule } from '../notifications/notifications.module';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [RealtimeModule, forwardRef(() => NotificationsModule), ConfigModule, SharedModule],
  controllers: [ChatController],
  providers: [ChatService, PrismaService, OptionalJwtGuard],
  exports: [ChatService],
})
export class ChatModule {}
