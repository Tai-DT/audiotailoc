import { Injectable, Logger, BadRequestException, NotFoundException, UnauthorizedException, Inject, forwardRef, Optional } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConversationDto, SendMessageDto } from './dto/chat.dto';
import { TelegramService } from '../notifications/telegram.service';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

export interface ConversationResponse {
  id: string;
  guestId: string;
  guestToken: string;
  guestName?: string;
  guestPhone?: string;
  status: string;
  createdAt: Date;
  messages?: MessageResponse[];
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  content: string;
  senderType: string;
  senderId?: string;
  createdAt: Date;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional()
    @Inject(forwardRef(() => TelegramService))
    private readonly telegramService?: TelegramService,
  ) {}

  /**
   * Generate a guest token for authentication
   */
  private generateGuestToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Validate guest token
   */
  private validateGuestToken(conversationId: string, guestId: string, guestToken: string): boolean {
    // In production, store and validate tokens properly
    // For now, we'll use a simple approach
    return guestToken && guestToken.length === 64;
  }

  /**
   * Create a new conversation (for guest users)
   */
  async createConversation(dto: CreateConversationDto): Promise<ConversationResponse> {
    try {
      const guestId = dto.guestId || `guest_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
      const guestToken = this.generateGuestToken();

      // Create conversation
      const conversation = await this.prisma.conversations.create({
        data: {
          id: uuidv4(),
          userId: dto.userId || null,
          guestId: dto.userId ? null : guestId,
          guestName: dto.guestName,
          guestPhone: dto.guestPhone,
          status: 'OPEN',
          updatedAt: new Date(),
        },
      });

      // Create initial message
      let initialMessageRecord = null;
      if (dto.initialMessage) {
        initialMessageRecord = await this.prisma.messages.create({
          data: {
            id: uuidv4(),
            conversationId: conversation.id,
            senderId: dto.userId || null,
            senderType: dto.userId ? 'USER' : 'GUEST',
            content: dto.initialMessage,
          },
        });
      }

      this.logger.log(`Created conversation ${conversation.id} for guest ${guestId}`);

      // Send Telegram notification for new conversation
      this.sendNewConversationTelegramNotification(
        conversation.id,
        dto.guestName,
        dto.guestPhone,
        dto.initialMessage,
      );

      return {
        id: conversation.id,
        guestId,
        guestToken,
        guestName: conversation.guestName,
        guestPhone: conversation.guestPhone,
        status: conversation.status,
        createdAt: conversation.createdAt,
        messages: initialMessageRecord
          ? [
              {
                id: initialMessageRecord.id,
                conversationId: initialMessageRecord.conversationId,
                content: initialMessageRecord.content,
                senderType: initialMessageRecord.senderType,
                senderId: initialMessageRecord.senderId,
                createdAt: initialMessageRecord.createdAt,
              },
            ]
          : [],
      };
    } catch (error) {
      this.logger.error('Failed to create conversation:', error);
      throw new BadRequestException('Failed to create conversation');
    }
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(dto: SendMessageDto): Promise<MessageResponse> {
    try {
      // Verify conversation exists
      const conversation = await this.prisma.conversations.findUnique({
        where: { id: dto.conversationId },
      });

      if (!conversation) {
        throw new NotFoundException('Conversation not found');
      }

      // For guest messages, validate token
      if (dto.guestToken && !dto.senderId) {
        // Guest is sending message
        if (!this.validateGuestToken(dto.conversationId, conversation.guestId || '', dto.guestToken)) {
          throw new UnauthorizedException('Invalid guest token');
        }
      }

      // Create message
      const message = await this.prisma.messages.create({
        data: {
          id: uuidv4(),
          conversationId: dto.conversationId,
          senderId: dto.senderId || null,
          senderType: dto.senderType || 'USER',
          content: dto.content,
        },
      });

      // Update conversation timestamp
      await this.prisma.conversations.update({
        where: { id: dto.conversationId },
        data: { updatedAt: new Date() },
      });

      this.logger.log(`Message sent in conversation ${dto.conversationId}`);

      return {
        id: message.id,
        conversationId: message.conversationId,
        content: message.content,
        senderType: message.senderType,
        senderId: message.senderId,
        createdAt: message.createdAt,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Failed to send message:', error);
      throw new BadRequestException('Failed to send message');
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(
    conversationId: string,
    options: {
      limit?: number;
      before?: string;
      guestId?: string;
      guestToken?: string;
    } = {},
  ): Promise<MessageResponse[]> {
    try {
      const conversation = await this.prisma.conversations.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        throw new NotFoundException('Conversation not found');
      }

      // Verify access for guest
      if (options.guestId && options.guestToken) {
        if (conversation.guestId !== options.guestId) {
          throw new UnauthorizedException('Access denied');
        }
        if (!this.validateGuestToken(conversationId, options.guestId, options.guestToken)) {
          throw new UnauthorizedException('Invalid guest token');
        }
      }

      const messages = await this.prisma.messages.findMany({
        where: {
          conversationId,
          ...(options.before
            ? {
                createdAt: {
                  lt: new Date(options.before),
                },
              }
            : {}),
        },
        orderBy: { createdAt: 'asc' },
        take: options.limit || 50,
      });

      return messages.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        content: m.content,
        senderType: m.senderType,
        senderId: m.senderId,
        createdAt: m.createdAt,
      }));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Failed to get messages:', error);
      throw new BadRequestException('Failed to get messages');
    }
  }

  /**
   * Get all conversations (for admin)
   */
  async getConversations(options: {
    status?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{
    data: ConversationResponse[];
    total: number;
  }> {
    try {
      const where = options.status ? { status: options.status } : {};

      const [conversations, total] = await Promise.all([
        this.prisma.conversations.findMany({
          where,
          orderBy: { updatedAt: 'desc' },
          take: options.limit || 20,
          skip: options.offset || 0,
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        }),
        this.prisma.conversations.count({ where }),
      ]);

      return {
        data: conversations.map((c) => ({
          id: c.id,
          guestId: c.guestId || '',
          guestToken: '', // Don't expose token
          guestName: c.guestName,
          guestPhone: c.guestPhone,
          status: c.status,
          createdAt: c.createdAt,
          messages: c.messages.map((m) => ({
            id: m.id,
            conversationId: m.conversationId,
            content: m.content,
            senderType: m.senderType,
            senderId: m.senderId,
            createdAt: m.createdAt,
          })),
        })),
        total,
      };
    } catch (error) {
      this.logger.error('Failed to get conversations:', error);
      throw new BadRequestException('Failed to get conversations');
    }
  }

  /**
   * Get a single conversation
   */
  async getConversation(conversationId: string): Promise<ConversationResponse | null> {
    try {
      const conversation = await this.prisma.conversations.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!conversation) {
        return null;
      }

      return {
        id: conversation.id,
        guestId: conversation.guestId || '',
        guestToken: '', // Don't expose token
        guestName: conversation.guestName,
        guestPhone: conversation.guestPhone,
        status: conversation.status,
        createdAt: conversation.createdAt,
        messages: conversation.messages.map((m) => ({
          id: m.id,
          conversationId: m.conversationId,
          content: m.content,
          senderType: m.senderType,
          senderId: m.senderId,
          createdAt: m.createdAt,
        })),
      };
    } catch (error) {
      this.logger.error('Failed to get conversation:', error);
      throw new BadRequestException('Failed to get conversation');
    }
  }

  /**
   * Close a conversation
   */
  async closeConversation(conversationId: string): Promise<ConversationResponse> {
    try {
      const conversation = await this.prisma.conversations.update({
        where: { id: conversationId },
        data: { status: 'CLOSED', updatedAt: new Date() },
      });

      return {
        id: conversation.id,
        guestId: conversation.guestId || '',
        guestToken: '',
        guestName: conversation.guestName,
        guestPhone: conversation.guestPhone,
        status: conversation.status,
        createdAt: conversation.createdAt,
      };
    } catch (error) {
      this.logger.error('Failed to close conversation:', error);
      throw new BadRequestException('Failed to close conversation');
    }
  }

  /**
   * Send Telegram notification for new conversation
   */
  private async sendNewConversationTelegramNotification(
    conversationId: string,
    guestName?: string,
    guestPhone?: string,
    initialMessage?: string,
  ): Promise<void> {
    if (!this.telegramService) {
      this.logger.debug('TelegramService not available, skipping notification');
      return;
    }

    try {
      const message = `💬 <b>Tin nhắn mới từ khách hàng</b>

👤 <b>Tên:</b> ${guestName || 'Không có'}
📱 <b>SĐT:</b> ${guestPhone || 'Không có'}

💭 <b>Nội dung:</b>
${initialMessage || '(Không có nội dung)'}

🔗 <a href="https://dashboard.audiotailoc.com/chat/${conversationId}">Xem chi tiết & trả lời</a>`;

      await this.telegramService.sendMessage(message);
      this.logger.log(`Sent Telegram notification for conversation ${conversationId}`);
    } catch (error) {
      this.logger.error('Failed to send Telegram notification:', error);
      // Don't throw - notification failure shouldn't break the conversation flow
    }
  }
}
