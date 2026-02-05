import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  constructor(private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Fix: should be request.user (singular) not request.users (plural)
    const user = request.user || request.users;

    this.logger.debug(`AdminGuard: Checking user=${user?.email}, role=${user?.role}`);

    // Check if user exists in request (set by JWT guard)
    if (!user) {
      this.logger.debug('AdminGuard: No user in request');
      return false;
    }

    const normalizedRole = String(user?.role || '')
      .trim()
      .toUpperCase();

    // If user has role in JWT payload, check it directly (case-insensitive)
    if (normalizedRole === 'ADMIN') {
      this.logger.debug('AdminGuard: User has ADMIN role in JWT');
      return true;
    }

    // Fallback: check against configured admin emails
    const adminEmails = this.config.get<string>('ADMIN_EMAILS', '');
    const singleAdminEmail = this.config.get<string>('ADMIN_EMAIL', '');
    const combinedEmails = [adminEmails, singleAdminEmail].filter(Boolean).join(',');

    if (combinedEmails && user.email) {
      const allowedEmails = combinedEmails
        .split(',')
        .map(email => email.trim().toLowerCase())
        .filter(email => email.length > 0);
      const isAllowed = allowedEmails.includes(String(user.email).trim().toLowerCase());
      this.logger.debug(
        `AdminGuard: Checking email whitelist - email=${user.email}, allowed=${isAllowed}`,
      );
      return isAllowed;
    }

    this.logger.debug('AdminGuard: User is not admin');
    return false;
  }
}
