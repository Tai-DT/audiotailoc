import {
  Injectable,
  BadRequestException,
  Logger,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SecurityService } from '../security/security.service';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly users: UsersService,
    private readonly config: ConfigService,
    private readonly securityService: SecurityService,
  ) {}

  async register(dto: { email: string; password: string; name?: string }) {
    // Validate password strength using SecurityService
    const passwordValidation = this.securityService.validatePasswordStrength(dto.password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors,
      });
    }

    return this.users.create({ email: dto.email, password: dto.password, name: dto.name ?? '' });
  }

  async login(dto: { email: string; password: string; rememberMe?: boolean }) {
    // Check if account is locked
    if (this.securityService.isAccountLocked(dto.email)) {
      const remainingTime = this.securityService.getRemainingLockoutTime(dto.email);
      throw new ForbiddenException(
        `Tài khoản bị khóa. Vui lòng thử lại sau ${Math.ceil(remainingTime / 60000)} phút.`,
      );
    }

    const user = await this.users.findByEmail(dto.email);

    // Use generic error message to prevent user enumeration
    if (!user) {
      this.securityService.recordLoginAttempt(dto.email, false);
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // DEBUG: Log password verification details
    this.logger.debug(`[LOGIN DEBUG] User found: ${user.email}, has password: ${!!user.password}`);
    this.logger.debug(`[LOGIN DEBUG] Password hash prefix: ${user.password?.substring(0, 20)}`);

    const ok = await this.securityService.verifyPassword(dto.password, user.password);

    this.logger.debug(`[LOGIN DEBUG] Password verification result: ${ok}`);

    // Record login attempt
    this.securityService.recordLoginAttempt(dto.email, ok);

    // Use generic error message to prevent user enumeration
    if (!ok) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');

    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT secrets are not configured');
    }
    const normalizedRole = String((user as { role?: string }).role ?? 'USER')
      .trim()
      .toUpperCase();
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: normalizedRole },
      accessSecret,
      { expiresIn: '30m' }, // Extended to 30 minutes for better admin UX
    );
    // SECURITY: Refresh token expiry
    // - Default: 7 days (reasonable balance between security and UX)
    // - Remember me: 30 days (longer but still manageable)
    // Consider implementing refresh token rotation and revocation for better security
    const refreshTokenExpiry = dto.rememberMe ? '30d' : '7d';
    const refreshToken = jwt.sign({ sub: user.id }, refreshSecret, {
      expiresIn: refreshTokenExpiry,
    });

    return { accessToken, refreshToken, userId: user.id };
  }

  async refresh(refreshToken: string) {
    try {
      const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');
      if (!refreshSecret) {
        throw new Error('JWT refresh secret is not configured');
      }
      const payload = jwt.verify(refreshToken, refreshSecret) as { sub: string };

      const user = await this.users.findById(payload.sub);
      if (!user) throw new UnauthorizedException('Người dùng không tồn tại');

      // Validate user is still active and not disabled
      const rawUserRole = (user as { role?: string }).role;
      const normalizedRole = String(rawUserRole ?? 'USER')
        .trim()
        .toUpperCase();
      if (normalizedRole === 'DISABLED') {
        throw new ForbiddenException('Tài khoản đã bị vô hiệu hóa');
      }

      const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET');
      if (!accessSecret) {
        throw new Error('JWT access secret is not configured');
      }

      const newAccessToken = jwt.sign(
        { sub: user.id, email: user.email, role: normalizedRole },
        accessSecret,
        { expiresIn: '30m' },
      );

      // Refresh token rotation
      const newRefreshToken = jwt.sign({ sub: user.id }, refreshSecret, {
        expiresIn: '7d',
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException)
        throw error;
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return { success: true };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in database
    await this.users.setResetToken(user.id, resetToken, resetTokenExpiry);

    // SECURITY: Only log in development mode, never log tokens in production
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(`[DEV ONLY] Password reset token for ${email}: ${resetToken}`);
      this.logger.debug(
        `[DEV ONLY] Reset link: http://localhost:3000/reset-password?token=${resetToken}`,
      );
    } else {
      // In production, only log that a reset was requested (without token)
      this.logger.log(`Password reset requested for ${email}`);
    }

    // In a real app, send email here
    // await this.mailService.sendPasswordReset(email, resetToken);

    return { success: true };
  }

  async resetPassword(token: string, newPassword: string) {
    // Validate password strength first
    const passwordValidation = this.securityService.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        message: 'New password does not meet security requirements',
        errors: passwordValidation.errors,
      });
    }

    // SECURITY: Verify token properly using UsersService
    const user = await this.users.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('Mã xác thực không hợp lệ hoặc đã hết hạn');
    }

    // Hash new password using SecurityService
    const hashedPassword = await this.securityService.hashPassword(newPassword);

    // Update user password and clear reset token
    await this.users.updatePasswordAndClearResetToken(user.id, hashedPassword);

    this.logger.log(`Password reset completed for user ${user.id}`);

    return { success: true };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password using SecurityService
    const isCurrentPasswordValid = await this.securityService.verifyPassword(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password strength
    const passwordValidation = this.securityService.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        message: 'New password does not meet security requirements',
        errors: passwordValidation.errors,
      });
    }

    // Hash new password using SecurityService
    const hashedPassword = await this.securityService.hashPassword(newPassword);

    // Update password in database
    await this.users.updatePassword(userId, hashedPassword);

    return { success: true };
  }
}
