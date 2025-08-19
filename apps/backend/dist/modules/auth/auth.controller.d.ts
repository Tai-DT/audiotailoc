import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
declare class RegisterDto {
    email: string;
    password: string;
    name?: string;
}
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly auth;
    private readonly users;
    constructor(auth: AuthService, users: UsersService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    me(req: any): Promise<{
        userId: null;
        email?: undefined;
        role?: undefined;
    } | {
        userId: string;
        email: string | null;
        role: any;
    }>;
}
export {};
