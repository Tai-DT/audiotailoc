import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions & { cors?: any }): any {
    const server = super.createIOServer(port, options);

    // Add custom configuration here if needed
    // For example: CORS, authentication, etc.

    return server;
  }
}