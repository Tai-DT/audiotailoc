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
        id: string;
        email: string;
        password: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(dto: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
