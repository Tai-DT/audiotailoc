import { UsersService } from '../users/users.service';
import { SecurityService } from '../security/security.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly users;
    private readonly config;
    private readonly securityService;
    constructor(users: UsersService, config: ConfigService, securityService: SecurityService);
    register(dto: {
        email: string;
        password: string;
        name?: string;
    }): unknown;
    login(dto: {
        email: string;
        password: string;
        rememberMe?: boolean;
    }): unknown;
    refresh(refreshToken: string): unknown;
    forgotPassword(email: string): unknown;
    resetPassword(token: string, newPassword: string): unknown;
    changePassword(userId: string, currentPassword: string, newPassword: string): unknown;
}
