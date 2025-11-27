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
    rememberMe?: boolean;
}
declare class RefreshTokenDto {
    refreshToken: string;
}
declare class ForgotPasswordDto {
    email: string;
}
declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class AuthController {
    private readonly auth;
    private readonly users;
    constructor(auth: AuthService, users: UsersService);
    status(): Promise<{
        authenticated: boolean;
        message: string;
        timestamp: string;
    }>;
    register(dto: RegisterDto): Promise<{
        token: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: any;
            avatarUrl: any;
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    me(req: any): Promise<{
        userId: any;
        email?: undefined;
        role?: undefined;
        avatarUrl?: undefined;
        name?: undefined;
    } | {
        userId: string;
        email: string;
        role: any;
        avatarUrl: any;
        name: string;
    }>;
}
export {};
