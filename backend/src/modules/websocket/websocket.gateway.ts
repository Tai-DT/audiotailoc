import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  path: '/socket.io',
  namespace: '/',
})
export class RealtimeGateway {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server!: any;

  afterInit(_server: any) {
    this.logger.log('WebSocket gateway initialized');
  }

  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any) {
    return { event: 'pong', data };
  }

  @SubscribeMessage('hello')
  handleHello(@MessageBody() name: string) {
    return { event: 'hello', message: `Hello ${name || 'world'}` };
  }
}
