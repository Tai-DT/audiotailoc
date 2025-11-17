import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SecurityService } from '../security/security.service';
import { PasswordValidator } from './password-validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService, 
    private readonly config: ConfigService,
    private readonly securityService: SecurityService
  ) {}

  async register(dto: { email: string; password: string; name?: string }) {
    // Validate password strength
    const passwordValidation = PasswordValidator.validate(dto.password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors
      });
    }

    try {
      return this.users.create({ email: dto.email, password: dto.password, name: dto.name ?? '' });
    } catch (error) {
      // Handle different types of errors that might contain duplicate email message
      console.log('AuthService.register error:', error);
      console.log('Error type:', typeof error);
      console.log('Error instanceof BadRequestException:', error instanceof BadRequestException);
      if (error instanceof BadRequestException) {
        const errorMessage = error.message || error.toString();
        console.log('Error message:', errorMessage);
        if (errorMessage.includes('Email already exists')) {
          console.log('Throwing BadRequestException for duplicate email');
          throw new BadRequestException('Email already exists');
        }
      }
      throw error;
    }
  }

  async login(dto: { email: string; password: string; rememberMe?: boolean }) {
    // Check if account is locked
    if (this.securityService.isAccountLocked(dto.email)) {
      const remainingTime = this.securityService.getRemainingLockoutTime(dto.email);
      throw new Error(`Account is locked. Try again in ${Math.ceil(remainingTime / 60000)} minutes.`);
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
    const accessToken = jwt.sign({ sub: user.id, email: user.email, role: (user as any).role ?? 'USER' }, accessSecret, { expiresIn: '15m' });
    // Use longer refresh token expiry if remember me is enabled
    const refreshTokenExpiry = dto.rememberMe ? '30d' : '7d';
    const refreshToken = jwt.sign({ sub: user.id }, refreshSecret, { expiresIn: refreshTokenExpiry });

    return { accessToken, refreshToken, userId: user.id };
  }

  async refresh(refreshToken: string) {
    try {
      const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET') || 'dev_refresh';
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
        { expiresIn: '15m' }
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

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const _resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in database (you might want to add a resetToken field to User model)
    // For now, we'll just return success
    // In production, you would:
    // 1. Save resetToken and resetTokenExpiry to database
    // 2. Send email with reset link
    // 3. Use email service like SendGrid, AWS SES, etc.

    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`);

    return { success: true };
  }

  async resetPassword(token: string, newPassword: string) {
    // In production, you would:
    // 1. Find user by reset token
    // 2. Check if token is expired
    // 3. Update password
    // 4. Clear reset token

    // For demo purposes, we'll just validate the token format
    if (!token || token.length !== 64) {
      throw new Error('Invalid reset token');
    }

    // Mock user ID for demo (in production, get from database)
    const mockUserId = 'demo-user-id';
    
    // Hash new password
    const _hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update user password (in production, use UsersService)
    console.log(`Password reset for user ${mockUserId} with token ${token}`);
    
    return { success: true };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.users.findById(userId);
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

