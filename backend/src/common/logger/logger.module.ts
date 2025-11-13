import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

/**
 * Global logger module that provides Winston-based structured logging
 * with daily rotation, console and file transports, and sensitive data filtering.
 */
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
