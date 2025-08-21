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
    if (!user || !user.sub) {
      return false;
    }

    try {
      // Get user details from database
      const userDetails = await this.usersService.findById(user.sub);
      
      // Check if user has admin role
      if (userDetails.role === 'ADMIN') {
        return true;
      }

      // Fallback: check against configured admin emails
      const adminEmails = this.config.get<string>('ADMIN_EMAILS', '');
      if (adminEmails) {
        const allowedEmails = adminEmails.split(',').map(email => email.trim().toLowerCase());
        return allowedEmails.includes(userDetails.email.toLowerCase());
      }

      return false;
    } catch (error) {
      // If user not found or any error, deny access
      return false;
    }
  }
}
