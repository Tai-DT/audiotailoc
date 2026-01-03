import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService, MessageResponse } from './chat.service';

export interface ChatSocket extends Socket {
  userId?: string;
  guestId?: string;
  guestToken?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
  namespace: '/api/v1/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  private readonly conversationSubscribers = new Map<string, Set<string>>(); // conversationId -> Set of socketIds

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {}

  afterInit() {
    this.logger.log('Chat WebSocket Gateway initialized');
  }

  async handleConnection(@ConnectedSocket() client: ChatSocket) {
    try {
      const token =
        client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      const guestToken = client.handshake.auth.guestToken as string | undefined;
      const guestId = client.handshake.auth.guestId as string | undefined;

      if (token) {
        try {
          const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
          const payload = this.jwtService.verify(token, { secret });
          client.userId = payload.sub;
          this.logger.log(`User ${client.userId} connected to chat (${client.id})`);
        } catch {
          this.logger.warn('Invalid token for chat connection');
        }
      } else if (guestToken && guestId) {
        client.guestId = guestId;
        client.guestToken = guestToken;
        this.logger.log(`Guest ${guestId} connected to chat (${client.id})`);
      } else {
        this.logger.log(`Anonymous client connected to chat (${client.id})`);
      }
    } catch (error) {
      this.logger.error('Chat connection error:', error);
    }
  }

  handleDisconnect(@ConnectedSocket() client: ChatSocket) {
    // Remove from all conversation subscriptions
    for (const [convId, subscribers] of this.conversationSubscribers.entries()) {
      if (subscribers.has(client.id)) {
        subscribers.delete(client.id);
        if (subscribers.size === 0) {
          this.conversationSubscribers.delete(convId);
        }
      }
    }
    this.logger.log(`Client disconnected from chat (${client.id})`);
  }

  /**
   * Join a conversation room
   */
  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    try {
      const room = `conversation:${data.conversationId}`;
      client.join(room);

      // Track subscription
      if (!this.conversationSubscribers.has(data.conversationId)) {
        this.conversationSubscribers.set(data.conversationId, new Set());
      }
      this.conversationSubscribers.get(data.conversationId)!.add(client.id);

      this.logger.log(`Client ${client.id} joined ${room}`);
      return { success: true, room };
    } catch (error) {
      this.logger.error('Join conversation error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Leave a conversation room
   */
  @SubscribeMessage('leave_conversation')
  async handleLeaveConversation(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    try {
      const room = `conversation:${data.conversationId}`;
      client.leave(room);

      const subscribers = this.conversationSubscribers.get(data.conversationId);
      if (subscribers) {
        subscribers.delete(client.id);
        if (subscribers.size === 0) {
          this.conversationSubscribers.delete(data.conversationId);
        }
      }

      this.logger.log(`Client ${client.id} left ${room}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Leave conversation error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Send message via WebSocket
   */
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    try {
      const senderId = client.userId || client.guestId;
      const senderType = client.userId ? 'USER' : 'GUEST';

      const message = await this.chatService.sendMessage({
        conversationId: data.conversationId,
        content: data.content,
        senderId,
        senderType: senderType as any,
        guestToken: client.guestToken,
      });

      // Broadcast to conversation room
      this.broadcastMessage(data.conversationId, message);

      return { success: true, message };
    } catch (error) {
      this.logger.error('Send message error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Broadcast a new message to all subscribers
   */
  broadcastMessage(conversationId: string, message: MessageResponse) {
    const room = `conversation:${conversationId}`;
    this.server.to(room).emit('new_message', {
      ...message,
      timestamp: new Date().toISOString(),
    });
    this.logger.debug(`Message broadcasted to ${room}`);
  }

  /**
   * Notify new conversation to admins
   */
  broadcastNewConversation(conversation: { id: string; guestName?: string; guestPhone?: string }) {
    this.server.emit('new_conversation', {
      ...conversation,
      timestamp: new Date().toISOString(),
    });
    this.logger.debug(`New conversation notification broadcasted`);
  }

  /**
   * Ping/Pong health check
   */
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): string {
    client.emit('pong');
    return 'pong';
  }
}
