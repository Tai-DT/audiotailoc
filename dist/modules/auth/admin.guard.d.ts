import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
export declare class AdminGuard implements CanActivate {
    private readonly usersService;
    private readonly config;
    constructor(usersService: UsersService, config: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
