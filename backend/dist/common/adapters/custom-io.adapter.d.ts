import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
export declare class CustomIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: ServerOptions & {
        cors?: any;
    }): any;
}
