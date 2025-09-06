import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
// Using any to avoid type mismatch with socket.io types in current setup
type Server = any;
type Socket = any;
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';

interface ChatMessage {
  sessionId: string;
  text: string;
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private connectedClients = new Map<string, { socket: Socket; userId?: string }>();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Extract user ID from auth token if available
    const token = client.handshake.auth.token;
    if (token) {
      try {
        // Verify JWT token and extract user ID
        // This is a simplified version - in production, use proper JWT verification
        const userId = this.extractUserIdFromToken(token) || undefined;
        this.connectedClients.set(client.id, { socket: client, userId });
        this.logger.log(`Authenticated user connected: ${userId}`);
      } catch (error) {
        this.logger.warn(`Invalid token for client ${client.id}`);
        this.connectedClients.set(client.id, { socket: client });
      }
    } else {
      this.connectedClients.set(client.id, { socket: client });
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('join_session')
  async handleJoinSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const session = await this.chatService.getSession(data.sessionId);
      client.join(`session_${data.sessionId}`);
      
      // Send session history
      client.emit('session_history', {
        sessionId: data.sessionId,
        messages: session.messages,
        status: session.status,
      });
      
      this.logger.log(`Client ${client.id} joined session ${data.sessionId}`);
    } catch (error) {
      client.emit('error', { message: 'Session not found' });
    }
  }

  @SubscribeMessage('leave_session')
  handleLeaveSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`session_${data.sessionId}`);
    this.logger.log(`Client ${client.id} left session ${data.sessionId}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: ChatMessage,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const clientInfo = this.connectedClients.get(client.id);
      const role = clientInfo?.userId ? 'USER' : 'STAFF';
      
      // Post message to database
      const message = await this.chatService.postMessage(
        data.sessionId,
        role,
        data.text,
      );

      // Broadcast message to all clients in the session
      this.server.to(`session_${data.sessionId}`).emit('new_message', {
        sessionId: data.sessionId,
        message: {
          id: message.id,
          role: message.role,
          text: (message as any).content,
          createdAt: message.createdAt,
        },
      });

      // If it's a user message, the AI response will be handled by ChatService
      // and broadcasted automatically
    } catch (error) {
      this.logger.error('Error sending message:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { sessionId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) {
      client.to(`session_${data.sessionId}`).emit('user_typing', {
        sessionId: data.sessionId,
        userId: clientInfo.userId,
        isTyping: data.isTyping,
      });
    }
  }

  // Broadcast AI response to session
  async broadcastAIResponse(sessionId: string, response: any) {
    this.server.to(`session_${sessionId}`).emit('ai_response', {
      sessionId,
      message: {
        id: response.id,
        role: 'ASSISTANT',
        text: response.text,
        createdAt: response.createdAt,
      },
    });
  }

  // Broadcast session status update
  async broadcastSessionUpdate(sessionId: string, status: string) {
    this.server.to(`session_${sessionId}`).emit('session_update', {
      sessionId,
      status,
    });
  }

  // Get connected clients count for a session
  getSessionClientCount(sessionId: string): number {
    const room = this.server.sockets.adapter.rooms.get(`session_${sessionId}`);
    return room ? room.size : 0;
  }

  // Private helper method to extract user ID from token
  private extractUserIdFromToken(token: string): string | null {
    try {
      // In production, use proper JWT verification
      // This is a simplified version for demonstration
      const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return decoded.sub || decoded.userId || null;
    } catch (error) {
      return null;
    }
  }
}
