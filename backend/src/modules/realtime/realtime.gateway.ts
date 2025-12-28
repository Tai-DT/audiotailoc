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
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RealtimeService } from './realtime.service';

/**
 * Real-time WebSocket Gateway
 * Handles WebSocket connections for real-time updates
 * Supports order updates, booking notifications, and live chat
 */

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  email?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
  namespace: '/api/v1/realtime',
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);
  private readonly connectedUsers = new Map<string, Set<string>>(); // userId -> Set of socketIds

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly realtimeService: RealtimeService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Initialize gateway
   */
  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
    this.realtimeService.setGateway(this);
  }

  /**
   * Handle client connection
   */
  async handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];

      if (token) {
        try {
          const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
          const payload = this.jwtService.verify(token, { secret });
          client.userId = payload.sub;
          client.email = payload.email;

          // Track user connection
          if (!this.connectedUsers.has(client.userId)) {
            this.connectedUsers.set(client.userId, new Set());
          }
          this.connectedUsers.get(client.userId)!.add(client.id);

          this.logger.log(`User ${client.userId} connected (${client.id})`);

          // Notify user is online
          this.server.emit('user:online', {
            userId: client.userId,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          this.logger.warn('Invalid token provided');
        }
      } else {
        this.logger.log(`Anonymous client connected (${client.id})`);
      }
    } catch (error) {
      this.logger.error('Connection error:', error);
    }
  }

  /**
   * Handle client disconnection
   */
  handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
    try {
      if (client.userId) {
        const userSockets = this.connectedUsers.get(client.userId);
        if (userSockets) {
          userSockets.delete(client.id);
          if (userSockets.size === 0) {
            this.connectedUsers.delete(client.userId);
            this.logger.log(`User ${client.userId} disconnected`);

            // Notify user is offline
            this.server.emit('user:offline', {
              userId: client.userId,
              timestamp: new Date().toISOString(),
            });
          }
        }
      } else {
        this.logger.log(`Anonymous client disconnected (${client.id})`);
      }
    } catch (error) {
      this.logger.error('Disconnection error:', error);
    }
  }

  /**
   * Subscribe to order updates
   */
  @SubscribeMessage('order:subscribe')
  async subscribeToOrder(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { orderId: string },
  ) {
    try {
      const room = `order:${data.orderId}`;
      client.join(room);
      this.logger.log(`Client ${client.id} subscribed to ${room}`);
      return { success: true, room };
    } catch (error) {
      this.logger.error('Subscribe order error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Unsubscribe from order updates
   */
  @SubscribeMessage('order:unsubscribe')
  async unsubscribeFromOrder(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { orderId: string },
  ) {
    try {
      const room = `order:${data.orderId}`;
      client.leave(room);
      this.logger.log(`Client ${client.id} unsubscribed from ${room}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Unsubscribe order error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Subscribe to booking updates
   */
  @SubscribeMessage('booking:subscribe')
  async subscribeToBooking(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { bookingId: string },
  ) {
    try {
      const room = `booking:${data.bookingId}`;
      client.join(room);
      this.logger.log(`Client ${client.id} subscribed to ${room}`);
      return { success: true, room };
    } catch (error) {
      this.logger.error('Subscribe booking error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Unsubscribe from booking updates
   */
  @SubscribeMessage('booking:unsubscribe')
  async unsubscribeFromBooking(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { bookingId: string },
  ) {
    try {
      const room = `booking:${data.bookingId}`;
      client.leave(room);
      this.logger.log(`Client ${client.id} unsubscribed from ${room}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Unsubscribe booking error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Subscribe to chat
   */
  @SubscribeMessage('chat:subscribe')
  async subscribeToChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    try {
      const room = `chat:${data.conversationId}`;
      client.join(room);
      this.logger.log(`Client ${client.id} subscribed to ${room}`);
      return { success: true, room };
    } catch (error) {
      this.logger.error('Subscribe chat error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Send chat message
   */
  @SubscribeMessage('chat:message')
  async handleChatMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; message: string },
  ) {
    try {
      if (!client.userId) {
        return { success: false, error: 'Not authenticated' };
      }

      const chatMessage = await this.realtimeService.createChatMessage(
        client.userId,
        data.conversationId,
        data.message,
      );

      // Broadcast to conversation subscribers
      const room = `chat:${data.conversationId}`;
      this.server.to(room).emit('chat:message', {
        id: chatMessage.id,
        conversationId: data.conversationId,
        userId: client.userId,
        email: client.email,
        message: data.message,
        timestamp: new Date().toISOString(),
      });

      return { success: true, id: chatMessage.id };
    } catch (error) {
      this.logger.error('Chat message error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Ping/Pong for connection health check
   */
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): string {
    client.emit('pong');
    return 'pong';
  }

  /**
   * Emit order update to subscribers
   */
  emitOrderUpdate(orderId: string, status: string, data: any) {
    const room = `order:${orderId}`;
    this.server.to(room).emit('order:updated', {
      orderId,
      status,
      data,
      timestamp: new Date().toISOString(),
    });
    this.logger.debug(`Order update emitted for ${orderId}: ${status}`);
  }

  /**
   * Emit booking update to subscribers
   */
  emitBookingUpdate(bookingId: string, status: string, data: any) {
    const room = `booking:${bookingId}`;
    this.server.to(room).emit('booking:updated', {
      bookingId,
      status,
      data,
      timestamp: new Date().toISOString(),
    });
    this.logger.debug(`Booking update emitted for ${bookingId}: ${status}`);
  }

  /**
   * Notify user of new message
   */
  notifyUserMessage(userId: string, message: any) {
    const sockets = this.connectedUsers.get(userId);
    if (sockets && sockets.size > 0) {
      for (const socketId of sockets) {
        this.server.to(socketId).emit('notification:message', message);
      }
      this.logger.debug(`Message notification sent to user ${userId}`);
    }
  }

  /**
   * Notify user of event
   */
  notifyUserEvent(userId: string, event: string, data: any) {
    const sockets = this.connectedUsers.get(userId);
    if (sockets && sockets.size > 0) {
      for (const socketId of sockets) {
        this.server.to(socketId).emit(`notification:${event}`, data);
      }
      this.logger.debug(`Event notification sent to user ${userId}: ${event}`);
    }
  }

  /**
   * Broadcast event to all connected clients
   */
  broadcastEvent(event: string, data: any) {
    this.server.emit(event, {
      data,
      timestamp: new Date().toISOString(),
    });
    this.logger.debug(`Broadcast event: ${event}`);
  }

  /**
   * Get connected user count
   */
  getConnectedUserCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Get connected user IDs
   */
  getConnectedUserIds(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}
