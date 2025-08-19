import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly users: UsersService, private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as { sub?: string } | undefined;
    const userId = user?.sub as string | undefined;
    if (!userId) return false;
    const u = await this.users.findById(userId);
    if (!u?.email) return false;
    // Prefer role-based check when available
    if ((u as any).role === 'ADMIN') return true;
    const allow = (this.config.get<string>('ADMIN_EMAILS') || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (allow.length === 0) return false; // locked down until configured
    return allow.includes(u.email.toLowerCase());
  }
}
