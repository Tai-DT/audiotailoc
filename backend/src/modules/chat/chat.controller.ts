import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ChatService } from './chat.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

class ListQueryDto {
  @IsOptional()
  @IsIn(['OPEN', 'ESCALATED', 'CLOSED'])
  status?: 'OPEN' | 'ESCALATED' | 'CLOSED';

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number;
}

class PostMessageDto {
  @IsString()
  text!: string;
}

@UseGuards(JwtGuard, AdminGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Get('sessions')
  list(@Query() q: ListQueryDto) {
    return this.chat.listSessions({ status: q.status, page: q.page, pageSize: q.pageSize });
  }

  @Get('sessions/:id')
  get(@Param('id') id: string) {
    return this.chat.getSession(id);
  }

  @Post('sessions/:id/messages')
  postMessage(@Param('id') id: string, @Body() dto: PostMessageDto) {
    return this.chat.postMessage(id, 'STAFF', dto.text);
  }

  @Patch('sessions/:id/escalate')
  escalate(@Param('id') id: string) {
    return this.chat.escalate(id);
  }

  @Patch('sessions/:id/close')
  closeSession(@Param('id') id: string) {
    return this.chat.closeSession(id);
  }

  @Get('sessions/:id/analytics')
  getSessionAnalytics(@Param('id') id: string) {
    return this.chat.getSessionAnalytics(id);
  }

  @Get('stats')
  getStats() {
    return this.chat.getChatStats();
  }
}


