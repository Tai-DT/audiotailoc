import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';
import { UsersService } from '../users/users.service';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

class RegisterDto {
  @IsEmail() email!: string;
  @MinLength(6) @IsString() password!: string;
  @IsOptional() @IsString() name?: string;
}
class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}

class RefreshTokenDto {
  @IsString() refreshToken!: string;
}

class ForgotPasswordDto {
  @IsEmail() email!: string;
}

class ResetPasswordDto {
  @IsString() token!: string;
  @MinLength(6) @IsString() newPassword!: string;
}

class ChangePasswordDto {
  @IsString() currentPassword!: string;
  @MinLength(6) @IsString() newPassword!: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly users: UsersService) {}

  @Get('status')
  async status() {
    return {
      authenticated: false,
      message: 'Authentication status endpoint',
      timestamp: new Date().toISOString()
    };
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute for registration
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    if (!dto.email || !dto.password) throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST);
    const user = await this.auth.register(dto);
    return { user: { id: user.id, email: user.email, name: user.name } };
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute for login
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const tokens = await this.auth.login(dto).catch(() => {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    });
    return tokens;
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute for refresh
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    const tokens = await this.auth.refresh(dto.refreshToken).catch(() => {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    });
    return tokens;
  }

  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 requests per hour for forgot password
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const _result = await this.auth.forgotPassword(dto.email).catch(() => {
      throw new HttpException('Failed to process forgot password request', HttpStatus.INTERNAL_SERVER_ERROR);
    });
    return { message: 'If the email exists, a password reset link has been sent' };
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute for reset password
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const _result = await this.auth.resetPassword(dto.token, dto.newPassword).catch(() => {
      throw new HttpException('Invalid or expired reset token', HttpStatus.BAD_REQUEST);
    });
    return { message: 'Password has been reset successfully' };
  }

  @UseGuards(JwtGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute for change password
  @Put('change-password')
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    
    const _result = await this.auth.changePassword(userId, dto.currentPassword, dto.newPassword).catch(() => {
      throw new HttpException('Current password is incorrect', HttpStatus.BAD_REQUEST);
    });
    return { message: 'Password has been changed successfully' };
  }

  @UseGuards(JwtGuard)
  @SkipThrottle() // Skip rate limiting for authenticated /me requests
  @Get('me')
  async me(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) return { userId: null };
    const u = await this.users.findById(userId);
    return { userId, email: u?.email ?? null, role: (u as any)?.role ?? null };
  }
}

