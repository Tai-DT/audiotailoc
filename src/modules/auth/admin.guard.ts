import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user exists in request (set by JWT guard)
    if (!user) {
      return false;
    }

    // If user has role in JWT payload, check it directly
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      return true;
    }

    // Fallback: check user ID from database if available
    if (user.sub) {
      try {
        // Get user details from database
        const userDetails = await this.usersService.findById(user.sub);
        
        // Check if user has admin role
        if (userDetails && userDetails.role === 'ADMIN') {
          return true;
        }

        // Fallback: check against configured admin emails
        const adminEmails = this.config.get<string>('ADMIN_EMAILS', '');
        if (adminEmails && userDetails) {
          const allowedEmails = adminEmails.split(',').map(email => email.trim().toLowerCase());
          return allowedEmails.includes(userDetails.email.toLowerCase());
        }

        return false;
      } catch {
        // If user not found or any error, deny access
        return false;
      }
    }

    return false;
  }
}
