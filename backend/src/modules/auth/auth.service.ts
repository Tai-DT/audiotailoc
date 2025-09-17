import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SecurityService } from '../security/security.service';
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
    return this.users.create({ email: dto.email, password: dto.password, name: dto.name ?? '' });
  }

  async login(dto: { email: string; password: string; rememberMe?: boolean }) {
    console.log('🔍 Login attempt for:', dto.email);

    // Check if account is locked
    if (this.securityService.isAccountLocked(dto.email)) {
      const remainingTime = this.securityService.getRemainingLockoutTime(dto.email);
      console.log('🔒 Account is locked, remaining time:', Math.ceil(remainingTime / 60000), 'minutes');
      throw new Error(`Account is locked. Try again in ${Math.ceil(remainingTime / 60000)} minutes.`);
    }

    const user = await this.users.findByEmail(dto.email);
    console.log('👤 User lookup result:', !!user);
    if (user) {
      console.log('   User ID:', user.id);
      console.log('   User Email:', user.email);
      console.log('   User Role:', (user as any).role);
      console.log('   Password hash exists:', !!user.password);
    }

    if (!user) {
      console.log('❌ User not found in database');
      throw new Error('not found');
    }

    console.log('🔐 Comparing passwords...');
    const ok = await bcrypt.compare(dto.password, user.password);
    console.log('🔐 Password comparison result:', ok);

    // Record login attempt
    const success = ok;
    this.securityService.recordLoginAttempt(dto.email, success);

    if (!ok) {
      console.log('❌ Password mismatch');
      throw new Error('bad pass');
    }

    console.log('✅ Login successful, generating tokens...');
    const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET') || 'dev_access';
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET') || 'dev_refresh';
    const accessToken = jwt.sign({ sub: user.id, email: user.email, role: (user as any).role ?? 'USER' }, accessSecret, { expiresIn: '15m' });
    // Use longer refresh token expiry if remember me is enabled
    const refreshTokenExpiry = dto.rememberMe ? '30d' : '7d';
    const refreshToken = jwt.sign({ sub: user.id }, refreshSecret, { expiresIn: refreshTokenExpiry });

    console.log('✅ Tokens generated successfully');
    return { accessToken, refreshToken, userId: user.id };
  }

  async refresh(refreshToken: string) {
    try {
      const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET') || 'dev_refresh';
      const payload = jwt.verify(refreshToken, refreshSecret) as { sub: string };
      
      const user = await this.users.findById(payload.sub);
      if (!user) throw new Error('User not found');

      const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET') || 'dev_access';
      const newAccessToken = jwt.sign(
        { sub: user.id, email: user.email, role: (user as any).role ?? 'USER' },
        accessSecret,
        { expiresIn: '15m' }
      );
      
      return { accessToken: newAccessToken, refreshToken };
    } catch (error) {
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

