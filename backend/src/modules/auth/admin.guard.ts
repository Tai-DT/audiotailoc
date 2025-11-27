import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  constructor(private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Fix: should be request.user (singular) not request.users (plural)
    const user = request.user;

    this.logger.debug(`AdminGuard: Checking user=${user?.email}, role=${user?.role}`);

    // Check if user exists in request (set by JWT guard)
    if (!user) {
      this.logger.debug('AdminGuard: No user in request');
      return false;
    }

    // If user has role in JWT payload, check it directly
    if (user.role === 'ADMIN') {
      this.logger.debug('AdminGuard: User has ADMIN role in JWT');
      return true;
    }

    // Fallback: check against configured admin emails
    const adminEmails = this.config.get<string>('ADMIN_EMAILS', '');
    if (adminEmails && user.email) {
      const allowedEmails = adminEmails.split(',').map(email => email.trim().toLowerCase());
      const isAllowed = allowedEmails.includes(user.email.toLowerCase());
      this.logger.debug(
        `AdminGuard: Checking email whitelist - email=${user.email}, allowed=${isAllowed}`,
      );
      return isAllowed;
    }

    this.logger.debug('AdminGuard: User is not admin');
    return false;
  }
}
