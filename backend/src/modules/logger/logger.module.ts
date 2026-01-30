import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [
    PinoModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
      },
    }),
  ],
})
export class LoggerModule {}
