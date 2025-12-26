import {
Body,
Controller,
Get,
HttpException,
HttpStatus,
Post,
Put,
Req,
UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';
import { UsersService } from '../users/users.service';
import { IsEmail, IsOptional, IsString, MinLength, IsBoolean, Matches } from 'class-validator';

const PASSWORD_REGEX = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
const PASSWORD_MESSAGE = 'Password is too weak. It must contain at least one uppercase letter, one lowercase letter, one number or special character.';

class RegisterDto {
  @IsEmail() email!: string;
  @MinLength(8) @IsString()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
  password!: string;
  @IsOptional() @IsString() name?: string;
}
class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
  @IsOptional() @IsBoolean() rememberMe?: boolean;
}

class RefreshTokenDto {
  @IsString() refreshToken!: string;
}

class ForgotPasswordDto {
  @IsEmail() email!: string;
}

class ResetPasswordDto {
  @IsString() token!: string;
  @MinLength(8) @IsString()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
  newPassword!: string;
}

class ChangePasswordDto {
  @IsString() currentPassword!: string;
  @MinLength(8) @IsString()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
  newPassword!: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) { }

  @Get('status')
  async status() {
    return {
      authenticated: false,
      message: 'Authentication status endpoint',
      timestamp: new Date().toISOString(),
    };
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute for registration
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    if (!dto.email || !dto.password)
      throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST);
    const user = await this.auth.register(dto);
    // Auto-login after successful registration
    const tokens = await this.auth.login({ email: dto.email, password: dto.password });
    // Access token expires in 15 minutes (15 * 60 * 1000 ms)
    const expiresInMs = 15 * 60 * 1000;
    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresInMs,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute for login (increased for development)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      const tokens = await this.auth.login(dto);
      const user = await this.users.findById(tokens.userId);
      // Access token expires in 15 minutes (15 * 60 * 1000 ms)
      const expiresInMs = 15 * 60 * 1000;
      return {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresInMs,
        user: {
          id: user?.id,
          email: user?.email,
          name: user?.name,
          role: (user as any)?.role ?? 'USER',
        },
      };
    } catch (error) {
      // Preserve account lockout messages, but use generic message for invalid credentials
      if (error instanceof Error && error.message.includes('Account is locked')) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
      // For security, use generic message for invalid credentials to prevent user enumeration
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute for refresh
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    const tokens = await this.auth.refresh(dto.refreshToken).catch(() => {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    });
    // Access token expires in 15 minutes (15 * 60 * 1000 ms)
    const expiresInMs = 15 * 60 * 1000;
    return {
      ...tokens,
      expiresInMs,
    };
  }

  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 requests per hour for forgot password
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const _result = await this.auth.forgotPassword(dto.email).catch(() => {
      throw new HttpException(
        'Failed to process forgot password request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

    const _result = await this.auth
      .changePassword(userId, dto.currentPassword, dto.newPassword)
      .catch(() => {
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

  @UseGuards(JwtGuard)
  @SkipThrottle() // Skip rate limiting for authenticated /profile requests
  @Get('profile')
  async getProfile(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.users.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: (user as any)?.role ?? 'USER',
      phone: (user as any)?.phone ?? null,
      avatar: (user as any)?.avatar ?? null,
      address: (user as any)?.address ?? null,
      isActive: (user as any)?.isActive ?? true,
      createdAt: (user as any)?.createdAt ?? null,
    };
  }

  @UseGuards(JwtGuard)
  @SkipThrottle() // Skip rate limiting for authenticated /profile requests
  @Put('profile')
  async updateProfile(@Req() req: any, @Body() updateData: any) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    const updatedUser = await this.users.update(userId, updateData, req.user);
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: (updatedUser as any)?.role ?? 'USER',
      phone: (updatedUser as any)?.phone ?? null,
      avatar: (updatedUser as any)?.avatar ?? null,
      address: (updatedUser as any)?.address ?? null,
      isActive: (updatedUser as any)?.isActive ?? true,
      createdAt: (updatedUser as any)?.createdAt ?? null,
    };
  }
}
