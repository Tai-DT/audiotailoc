import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateConversationDto, SendMessageDto } from './dto/chat.dto';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(OptionalJwtGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('conversations')
  @ApiOperation({ summary: 'Start a new conversation' })
  async createConversation(@Body() dto: CreateConversationDto, @Req() req: any) {
    const userId = req?.user?.sub;
    return this.chatService.createConversation({ ...dto, userId: dto.userId || userId });
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations (Admin)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getConversations(
    @Query('status') status?: string,
    @Query('userId') userId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getConversations({
      status,
      userId,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @UseGuards(OptionalJwtGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('messages')
  @ApiOperation({ summary: 'Send a message' })
  async sendMessage(@Body() dto: SendMessageDto, @Req() req: any) {
    const userId = req?.user?.sub;
    const senderType = dto.senderType || (userId ? 'USER' : dto.senderType);
    const senderId = dto.senderId || userId;
    return this.chatService.sendMessage(
      { ...dto, senderId, senderType },
      { requesterUserId: userId, requesterRole: req?.user?.role },
    );
  }

  @UseGuards(OptionalJwtGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'guestId', required: false })
  @ApiQuery({ name: 'guestToken', required: false })
  async getMessages(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('guestId') guestId?: string,
    @Query('guestToken') guestToken?: string,
    @Req() req?: any,
  ) {
    return this.chatService.getMessages(id, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      guestId,
      guestToken,
      requesterUserId: req?.user?.sub,
      requesterRole: req?.user?.role,
    });
  }
}
