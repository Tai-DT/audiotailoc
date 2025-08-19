import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly users;
    private readonly config;
    constructor(users: UsersService, config: ConfigService);
    register(dto: {
        email: string;
        password: string;
        name?: string;
    }): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
    login(dto: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
