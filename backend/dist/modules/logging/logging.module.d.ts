import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggingService } from './logging.service';
export declare class LoggingModule implements NestModule {
    private readonly loggingService;
    constructor(loggingService: LoggingService);
    configure(consumer: MiddlewareConsumer): void;
    onModuleDestroy(): void;
}
