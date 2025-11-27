import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
// Loosen socket types for compatibility
type Server = any;
type Socket = any;
import { Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';

interface NotificationData {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
}

@WebSocketGateway({
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      process.env.DASHBOARD_URL || 'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    credentials: true,
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private connectedUsers = new Map<string, Socket>();

  constructor(private readonly notificationService: NotificationService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Notification client connected: ${client.id}`);

    // Extract user ID from auth token
    const token = client.handshake.auth.token;
    if (token) {
      try {
        const userId = this.extractUserIdFromToken(token);
        if (userId) {
          this.connectedUsers.set(userId, client);
          client.join(`user_${userId}`);
          this.logger.log(`User ${userId} connected for notifications`);

          // Send pending notifications
          const pendingNotifications =
            await this.notificationService.getPendingNotifications(userId);
          if (pendingNotifications.length > 0) {
            client.emit('pending_notifications', pendingNotifications);
          }
        }
      } catch (error) {
        this.logger.warn(`Invalid token for notification client ${client.id}`);
      }
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Notification client disconnected: ${client.id}`);

    // Remove user from connected users
    for (const [userId, socket] of this.connectedUsers.entries()) {
      if (socket.id === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('mark_read')
  async handleMarkAsRead(
    @MessageBody() data: { notificationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (userId) {
        await this.notificationService.markAsRead(data.notificationId, userId);
        client.emit('notification_updated', { id: data.notificationId, read: true });
      }
    } catch (error) {
      this.logger.error('Error marking notification as read:', error);
      client.emit('error', { message: 'Failed to mark notification as read' });
    }
  }

  @SubscribeMessage('mark_all_read')
  async handleMarkAllAsRead(@ConnectedSocket() client: Socket) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (userId) {
        await this.notificationService.markAllAsRead(userId);
        client.emit('all_notifications_read');
      }
    } catch (error) {
      this.logger.error('Error marking all notifications as read:', error);
      client.emit('error', { message: 'Failed to mark all notifications as read' });
    }
  }

  // Send notification to specific user
  async sendToUser(userId: string, notification: NotificationData) {
    const client = this.connectedUsers.get(userId);
    if (client) {
      client.emit('new_notification', notification);
      this.logger.log(`Notification sent to user ${userId}: ${notification.title}`);
    }

    // Also save to database for offline users
    await this.notificationService.createNotification({
      userId,
      type: notification.type as any,
      title: notification.title,
      message: notification.message,
      data: notification.data,
    });
  }

  // Send notification to all connected users
  async broadcastToAll(notification: Omit<NotificationData, 'userId'>) {
    this.server.emit('broadcast_notification', notification);
    this.logger.log(`Broadcast notification: ${notification.title}`);
  }

  // Send notification to users in specific room
  async sendToRoom(room: string, notification: Omit<NotificationData, 'userId'>) {
    this.server.to(room).emit('room_notification', {
      room,
      ...notification,
    });
    this.logger.log(`Room notification sent to ${room}: ${notification.title}`);
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Private helper methods
  private extractUserIdFromToken(token: string): string | null {
    try {
      const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return decoded.sub || decoded.userId || null;
    } catch (error) {
      return null;
    }
  }

  private getUserIdFromSocket(client: Socket): string | null {
    for (const [userId, socket] of this.connectedUsers.entries()) {
      if (socket.id === client.id) {
        return userId;
      }
    }
    return null;
  }
}
