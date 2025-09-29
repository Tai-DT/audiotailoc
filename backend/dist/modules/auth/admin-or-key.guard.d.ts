import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminGuard } from './admin.guard';
export declare class AdminOrKeyGuard implements CanActivate {
    private readonly config;
    private readonly adminGuard;
    private readonly logger;
    constructor(config: ConfigService, adminGuard: AdminGuard);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
