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
    status(): unknown;
    register(dto: RegisterDto): unknown;
    login(dto: LoginDto): unknown;
    refresh(dto: RefreshTokenDto): unknown;
    forgotPassword(dto: ForgotPasswordDto): unknown;
    resetPassword(dto: ResetPasswordDto): unknown;
    changePassword(req: any, dto: ChangePasswordDto): unknown;
    me(req: any): unknown;
}
export {};
