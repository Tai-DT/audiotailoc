import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SecurityService } from '../security/security.service';
import { PasswordValidator } from './password-validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../notifications/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly config: ConfigService,
    private readonly securityService: SecurityService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: { email: string; password: string; name?: string }) {
    // Validate password strength
    const passwordValidation = PasswordValidator.validate(dto.password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors,
      });
    }

    try {
      return await this.users.create({
        email: dto.email,
        password: dto.password,
        name: dto.name ?? '',
      });
    } catch (error) {
      // Handle different types of errors that might contain duplicate email message
      if (error instanceof BadRequestException) {
        const errorMessage = error.message || error.toString();
        if (errorMessage.includes('Email already exists')) {
          // Prevent user enumeration by returning a generic error or success
          // For now, we stick to the current behavior but remove excessive logging
          throw new BadRequestException('Email already exists');
        }
      }
      // Log only the error message, not the full object to avoid leaking sensitive info
      console.error(
        'AuthService.register failed:',
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async login(dto: { email: string; password: string; rememberMe?: boolean }) {
    // Check if account is locked
    if (this.securityService.isAccountLocked(dto.email)) {
      const remainingTime = this.securityService.getRemainingLockoutTime(dto.email);
      throw new Error(
        `Account is locked. Try again in ${Math.ceil(remainingTime / 60000)} minutes.`,
      );
    }

    const user = await this.users.findByEmail(dto.email);

    // Use generic error message to prevent user enumeration
    if (!user) {
      this.securityService.recordLoginAttempt(dto.email, false);
      throw new Error('Invalid email or password');
    }

    const ok = await bcrypt.compare(dto.password, user.password);

    // Record login attempt
    this.securityService.recordLoginAttempt(dto.email, ok);

    // Use generic error message to prevent user enumeration
    if (!ok) {
      throw new Error('Invalid email or password');
    }

    const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');

    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT secrets are not configured');
    }
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: (user as any).role ?? 'USER' },
      accessSecret,
      { expiresIn: '15m' },
    );
    // Use longer refresh token expiry if remember me is enabled
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
        throw new Error('JWT_REFRESH_SECRET is not configured');
      }
      const payload = jwt.verify(refreshToken, refreshSecret) as { sub: string };

      const user = await this.users.findById(payload.sub);
      if (!user) throw new Error('User not found');

      // Validate user is still active and not disabled
      const userRole = (user as any).role;
      if (userRole === 'DISABLED') {
        throw new Error('User account has been disabled');
      }

      const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET');
      if (!accessSecret) {
        throw new Error('JWT access secret is not configured');
      }
      const newAccessToken = jwt.sign(
        { sub: user.id, email: user.email, role: userRole ?? 'USER' },
        accessSecret,
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken, refreshToken };
    } catch (error) {
      if (error instanceof Error && error.message !== 'Invalid refresh token') {
        throw error;
      }
      throw new Error('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return { success: true };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Persist token
    await this.users.setResetToken(user.id, hashedToken, resetTokenExpiry);

    // TODO: integrate real email service; for now log token
    const resetLink = `${this.config.get('FRONTEND_URL') || 'http://localhost:3001'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    if (this.config.get('SMTP_HOST')) {
      const subject = 'Đặt lại mật khẩu Audio Tài Lộc';
      const text = `Bạn vừa yêu cầu đặt lại mật khẩu.\nMã đặt lại: ${resetToken}\nLink: ${resetLink}\nMã này sẽ hết hạn sau 60 phút.`;
      const html = `<p>Bạn vừa yêu cầu đặt lại mật khẩu.</p><p><strong>Mã đặt lại:</strong> ${resetToken}</p><p>Hoặc click link: <a href="${resetLink}">${resetLink}</a></p><p>Mã hết hạn sau 60 phút.</p>`;
      await this.mailService.send(email, subject, text, html);
    }
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: ${resetLink}`);

    return { success: true };
  }

  async resetPassword(token: string, newPassword: string) {
    if (!token || token.length !== 64) {
      throw new Error('Invalid reset token');
    }

    const passwordValidation = PasswordValidator.validate(newPassword);
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors,
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.users.findByResetToken(hashedToken);

    if (!user) {
      throw new NotFoundException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.users.completePasswordReset(user.id, hashedPassword);

    return { success: true };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.users.findByIdForAuth(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password in database
    await this.users.updatePassword(userId, hashedPassword);

    return { success: true };
  }
}
