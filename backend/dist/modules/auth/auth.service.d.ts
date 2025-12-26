import { UsersService } from '../users/users.service';
import { SecurityService } from '../security/security.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly users;
    private readonly config;
    private readonly securityService;
    private readonly logger;
    constructor(users: UsersService, config: ConfigService, securityService: SecurityService);
    register(dto: {
        email: string;
        password: string;
        name?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        role: string;
        createdAt: Date;
    }>;
    login(dto: {
        email: string;
        password: string;
        rememberMe?: boolean;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
    }>;
}
