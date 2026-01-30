import { Module, forwardRef } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from '../../prisma/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

/**
 * Chat Module
 * Provides chat functionality for guest and user conversations
 * Supports both REST API and WebSocket real-time messaging
 */
@Module({
  imports: [
    PrismaModule,
    JwtModule,
    ConfigModule,
    forwardRef(() => RealtimeModule),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
