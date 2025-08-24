import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { AiModule } from '../ai/ai.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [AiModule, CacheModule],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}


