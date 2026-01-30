import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
  Optional,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService, ConversationResponse, MessageResponse } from './chat.service';
import { CreateConversationDto, SendMessageDto } from './dto/chat.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { ChatGateway } from './chat.gateway';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(
    private readonly chatService: ChatService,
    @Optional()
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway?: ChatGateway,
  ) {}

  /**
   * Create a new conversation (public endpoint for guests)
   */
  @Post('conversations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new chat conversation' })
  @ApiResponse({ status: 201, description: 'Conversation created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createConversation(@Body() dto: CreateConversationDto): Promise<ConversationResponse> {
    this.logger.log('Creating new conversation');
    const conversation = await this.chatService.createConversation(dto);

    // Notify admins of new conversation via WebSocket
    if (this.chatGateway) {
      this.chatGateway.broadcastNewConversation({
        id: conversation.id,
        guestName: conversation.guestName,
        guestPhone: conversation.guestPhone,
      });
    }

    return conversation;
  }

  /**
   * Send a message in a conversation
   */
  @Post('messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a message in a conversation' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async sendMessage(@Body() dto: SendMessageDto): Promise<MessageResponse> {
    this.logger.log(`Sending message to conversation ${dto.conversationId}`);
    const message = await this.chatService.sendMessage(dto);

    // Broadcast message via WebSocket
    if (this.chatGateway) {
      this.chatGateway.broadcastMessage(dto.conversationId, message);
    }

    return message;
  }

  /**
   * Send a message to a specific conversation (alternative endpoint)
   */
  @Post('conversations/:conversationId/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a message to a specific conversation' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async sendMessageToConversation(
    @Param('conversationId') conversationId: string,
    @Body() body: { content: string; senderId?: string; senderType?: string; guestToken?: string },
  ): Promise<MessageResponse> {
    this.logger.log(`Sending message to conversation ${conversationId}`);
    return this.chatService.sendMessage({
      conversationId,
      content: body.content,
      senderId: body.senderId,
      senderType: body.senderType as any,
      guestToken: body.guestToken,
    });
  }

  /**
   * Get messages for a conversation
   */
  @Get('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'before', required: false, type: String })
  @ApiQuery({ name: 'guestId', required: false, type: String })
  @ApiQuery({ name: 'guestToken', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
    @Query('guestId') guestId?: string,
    @Query('guestToken') guestToken?: string,
  ): Promise<MessageResponse[]> {
    this.logger.log(`Getting messages for conversation ${conversationId}`);
    return this.chatService.getMessages(conversationId, {
      limit: limit ? parseInt(limit, 10) : undefined,
      before,
      guestId,
      guestToken,
    });
  }

  /**
   * Get all conversations (admin only)
   */
  @Get('conversations')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all conversations (admin only)' })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Conversations retrieved successfully' })
  async getConversations(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<{ data: ConversationResponse[]; total: number }> {
    this.logger.log('Getting all conversations');
    return this.chatService.getConversations({
      status,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  /**
   * Get a specific conversation
   */
  @Get('conversations/:conversationId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific conversation' })
  @ApiResponse({ status: 200, description: 'Conversation retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversation(
    @Param('conversationId') conversationId: string,
  ): Promise<ConversationResponse | null> {
    this.logger.log(`Getting conversation ${conversationId}`);
    return this.chatService.getConversation(conversationId);
  }

  /**
   * Close a conversation (admin only)
   */
  @Post('conversations/:conversationId/close')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Close a conversation' })
  @ApiResponse({ status: 200, description: 'Conversation closed successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async closeConversation(
    @Param('conversationId') conversationId: string,
  ): Promise<ConversationResponse> {
    this.logger.log(`Closing conversation ${conversationId}`);
    return this.chatService.closeConversation(conversationId);
  }
}
