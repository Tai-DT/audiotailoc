import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { TelegramService } from '../notifications/telegram.service';
import { CreateConversationDto, SendMessageDto } from './dto/chat.dto';
import { randomUUID } from 'crypto';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeGateway: RealtimeGateway,
    @Inject(forwardRef(() => TelegramService))
    private readonly telegramService: TelegramService,
    private readonly config: ConfigService,
  ) {}

  private getGuestSecret(): string {
    return (
      this.config.get('CHAT_GUEST_SECRET') || this.config.get('JWT_ACCESS_SECRET') || 'guest-secret'
    );
  }

  private signGuestToken(conversationId: string, guestId: string): string {
    const data = `${conversationId}.${guestId}`;
    return crypto.createHmac('sha256', this.getGuestSecret()).update(data).digest('hex');
  }

  private verifyGuestToken(conversationId: string, guestId: string, token?: string): boolean {
    if (!token) return false;
    const expected = this.signGuestToken(conversationId, guestId);
    return expected === token;
  }

  async createConversation(dto: CreateConversationDto) {
    // If not logged in, require guest info
    if (!dto.userId) {
      if (!dto.guestName || !dto.guestPhone) {
        throw new BadRequestException('guestName and guestPhone are required for guest chat');
      }
    }

    const guestId = dto.userId ? null : dto.guestId || `guest-${randomUUID()}`;

    if (!dto.userId && !guestId) {
      throw new UnauthorizedException('Missing user or guest identifier');
    }

    const conversation = await this.prisma.conversations.create({
      data: {
        id: randomUUID(),
        userId: dto.userId,
        guestId,
        guestName: dto.guestName,
        guestPhone: dto.guestPhone,
        status: 'OPEN',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: {
          create: {
            id: randomUUID(),
            content: dto.initialMessage,
            senderType: 'USER',
            // For guest messages, set senderId to null since it has foreign key constraint to users table
            // The guestId is stored in the conversation record instead
            senderId: dto.userId || null,
            createdAt: new Date(),
          },
        },
      },
      include: {
        messages: true,
        users: true,
      },
    });

    // Notify admins via realtime
    this.realtimeGateway.broadcastEvent('chat:new_conversation', conversation);

    // Notify via Telegram
    const customerName = dto.userId ? 'Khách hàng đăng nhập' : 'Khách vãng lai';
    this.telegramService.sendChatMessageNotification(
      customerName,
      dto.initialMessage,
      conversation.id,
    );

    const guestToken = guestId ? this.signGuestToken(conversation.id, guestId) : undefined;

    return {
      ...conversation,
      guestId: guestId || undefined,
      guestToken,
    };
  }

  async sendMessage(
    dto: SendMessageDto,
    ctx?: { requesterUserId?: string; requesterRole?: string },
  ) {
    const conversation = await this.prisma.conversations.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Basic guard: only allow same user/guest to post unless ADMIN/SYSTEM
    const isAdmin = ctx?.requesterRole === 'ADMIN';
    if (!isAdmin) {
      if (conversation.userId) {
        if (ctx?.requesterUserId !== conversation.userId) {
          throw new UnauthorizedException('Not allowed to send to this conversation');
        }
      } else if (conversation.guestId) {
        const tokenOk = this.verifyGuestToken(
          conversation.id,
          conversation.guestId,
          dto.guestToken,
        );
        if (!dto.senderId || dto.senderId !== conversation.guestId || !tokenOk) {
          throw new UnauthorizedException('Guest not allowed to send to this conversation');
        }
      } else {
        throw new UnauthorizedException('Unknown conversation owner');
      }
    }

    const message = await this.prisma.messages.create({
      data: {
        id: randomUUID(),
        conversationId: dto.conversationId,
        content: dto.content,
        senderType: dto.senderType || (isAdmin ? 'ADMIN' : 'USER'),
        // For guest messages, set senderId to null since it has foreign key constraint to users table
        // The guestId is stored in the conversation record instead
        senderId: conversation.userId ? (dto.senderId || ctx?.requesterUserId) : null,
        createdAt: new Date(),
      },
    });

    // Update conversation timestamp
    await this.prisma.conversations.update({
      where: { id: dto.conversationId },
      data: { updatedAt: new Date() },
    });

    // Emit realtime event to conversation room
    // Use emitChatMessage to send to subscribers in the conversation room
    this.realtimeGateway.emitChatMessage(dto.conversationId, {
      id: message.id,
      conversationId: dto.conversationId,
      content: message.content,
      senderType: message.senderType,
      senderId: message.senderId,
      createdAt: message.createdAt.toISOString(),
    });

    // Also notify admins generally for user messages
    if (dto.senderType === 'USER') {
      this.realtimeGateway.broadcastEvent('chat:message', {
        conversationId: dto.conversationId,
        message,
      });

      // Notify via Telegram
      const customerName = conversation.userId ? 'Khách hàng' : 'Khách vãng lai';
      this.telegramService.sendChatMessageNotification(
        customerName,
        dto.content,
        dto.conversationId,
      );

      // Trigger AI response if user sent message
      // AI removed
    }

    return message;
  }

  async getConversations(params: {
    status?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, userId, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [conversations, total] = await Promise.all([
      this.prisma.conversations.findMany({
        where,
        include: {
          users: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip: skip,
        take: limit,
      }),
      this.prisma.conversations.count({ where }),
    ]);

    return {
      data: conversations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMessages(
    conversationId: string,
    params: {
      page?: number;
      limit?: number;
      guestId?: string;
      guestToken?: string;
      requesterUserId?: string;
      requesterRole?: string;
    },
  ) {
    const { page = 1, limit = 50, guestId, guestToken, requesterUserId, requesterRole } = params;
    const skip = (page - 1) * limit;

    const convo = await this.prisma.conversations.findUnique({ where: { id: conversationId } });
    if (!convo) throw new NotFoundException('Conversation not found');

    // If conversation is guest-based, require matching guestId
    if (convo.guestId && convo.userId === null) {
      if (!guestId || guestId !== convo.guestId) {
        throw new UnauthorizedException('Guest token invalid for this conversation');
      }
      const tokenOk = this.verifyGuestToken(conversationId, guestId, guestToken);
      if (!tokenOk) {
        throw new UnauthorizedException('Guest token invalid');
      }
    } else if (convo.userId) {
      // Only owner user or admin can read
      const isAdmin = requesterRole === 'ADMIN';
      if (!isAdmin && requesterUserId !== convo.userId) {
        throw new ForbiddenException('Not allowed to read this conversation');
      }
    }

    const [messages, total] = await Promise.all([
      this.prisma.messages.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'desc' }, // Newest first
        skip,
        take: limit,
      }),
      this.prisma.messages.count({ where: { conversationId } }),
    ]);

    return {
      data: messages.reverse(), // Return oldest first for chat UI
      total,
      page,
      limit,
    };
  }
}
