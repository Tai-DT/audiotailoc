import {
  WebSocketGateway as WsGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@Injectable()
@WsGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
  namespace: '/',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);
  private connectedUsers = new Map<string, AuthenticatedSocket>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      
      if (token) {
        const payload = await this.jwtService.verifyAsync(token);
        client.userId = payload.sub;
        client.userRole = payload.role;
        
        this.connectedUsers.set(client.userId, client);
        
        // Join user to their personal room
        client.join(`user:${client.userId}`);
        
        // Join admin users to admin room
        if (client.userRole === 'ADMIN') {
          client.join('admin');
        }
        
        this.logger.log(`User ${client.userId} connected`);
        
        // Send connection confirmation
        client.emit('connected', {
          userId: client.userId,
          role: client.userRole,
          timestamp: new Date().toISOString(),
        });
      } else {
        // Allow anonymous connections for public features
        this.logger.log(`Anonymous user connected: ${client.id}`);
      }
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(`User ${client.userId} disconnected`);
    } else {
      this.logger.log(`Anonymous user disconnected: ${client.id}`);
    }
  }

  // Order status updates
  notifyOrderUpdate(orderId: string, userId: string, status: string, data: any) {
    // Notify the specific user
    this.server.to(`user:${userId}`).emit('order:updated', {
      orderId,
      status,
      data,
      timestamp: new Date().toISOString(),
    });

    // Notify all admins
    this.server.to('admin').emit('order:admin_update', {
      orderId,
      userId,
      status,
      data,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Order ${orderId} status updated to ${status} for user ${userId}`);
  }

  // Inventory updates
  notifyInventoryUpdate(productId: string, stockLevel: number, lowStock: boolean) {
    this.server.to('admin').emit('inventory:updated', {
      productId,
      stockLevel,
      lowStock,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Inventory updated for product ${productId}: ${stockLevel} units`);
  }

  // New order notifications
  notifyNewOrder(orderData: any) {
    this.server.to('admin').emit('order:new', {
      ...orderData,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`New order notification sent: ${orderData.id}`);
  }

  // Chat message handling
  @SubscribeMessage('chat:send_message')
  async handleChatMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { message: string; sessionId?: string }
  ) {
    if (!client.userId) {
      client.emit('error', { message: 'Authentication required for chat' });
      return;
    }

    const messageData = {
      id: `msg_${Date.now()}`,
      message: data.message,
      userId: client.userId,
      sessionId: data.sessionId || `session_${client.userId}`,
      timestamp: new Date().toISOString(),
      type: 'user',
    };

    // Send to user
    client.emit('chat:message_received', messageData);

    // Send to admins
    this.server.to('admin').emit('chat:new_message', messageData);

    this.logger.log(`Chat message from user ${client.userId}: ${data.message}`);

    return { success: true, messageId: messageData.id };
  }

  // Admin chat response
  @SubscribeMessage('chat:admin_response')
  async handleAdminResponse(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { message: string; sessionId: string; userId: string }
  ) {
    if (client.userRole !== 'ADMIN') {
      client.emit('error', { message: 'Admin access required' });
      return;
    }

    const messageData = {
      id: `msg_${Date.now()}`,
      message: data.message,
      adminId: client.userId,
      sessionId: data.sessionId,
      timestamp: new Date().toISOString(),
      type: 'admin',
    };

    // Send to specific user
    this.server.to(`user:${data.userId}`).emit('chat:message_received', messageData);

    // Send to all admins
    this.server.to('admin').emit('chat:admin_message', messageData);

    this.logger.log(`Admin response from ${client.userId} to user ${data.userId}`);

    return { success: true, messageId: messageData.id };
  }

  // Live notifications
  @SubscribeMessage('notifications:subscribe')
  async handleNotificationSubscribe(@ConnectedSocket() client: AuthenticatedSocket) {
    if (!client.userId) {
      client.emit('error', { message: 'Authentication required' });
      return;
    }

    client.join(`notifications:${client.userId}`);
    return { success: true, message: 'Subscribed to notifications' };
  }

  // Send notification to specific user
  sendNotification(userId: string, notification: any) {
    this.server.to(`notifications:${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString(),
    });
  }

  // Broadcast system announcement
  broadcastAnnouncement(message: string, type: 'info' | 'warning' | 'success' = 'info') {
    this.server.emit('announcement', {
      message,
      type,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Broadcast announcement: ${message}`);
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get connected admins
  getConnectedAdmins(): string[] {
    const admins: string[] = [];
    this.connectedUsers.forEach((socket, userId) => {
      if (socket.userRole === 'ADMIN') {
        admins.push(userId);
      }
    });
    return admins;
  }
}
