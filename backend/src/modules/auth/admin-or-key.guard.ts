import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminGuard } from './admin.guard';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminOrKeyGuard implements CanActivate {
  private readonly logger = new Logger(AdminOrKeyGuard.name);

  constructor(
    private readonly config: ConfigService,
    private readonly adminGuard: AdminGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const headerKey = (req.headers['x-admin-key'] || req.headers['X-Admin-Key'] || '') as string;
    const envKey = this.config.get<string>('ADMIN_API_KEY') || '';

    this.logger.debug(
      `AdminOrKeyGuard: hasHeaderKey=${Boolean(headerKey)}, hasEnvKey=${Boolean(envKey)}, path=${req.path}`,
    );

    if (envKey && headerKey && headerKey === envKey) {
      this.logger.debug('AdminOrKeyGuard: API key match, access granted');
      return true;
    }

    this.logger.debug('AdminOrKeyGuard: API key mismatch, trying role-based auth');

    // Check JWT token first
    const authHeader = req.headers['authorization'] as string | undefined;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.debug('AdminOrKeyGuard: No JWT token provided');
      return false;
    }

    const token = authHeader.slice(7);
    try {
      const secret = this.config.get<string>('JWT_ACCESS_SECRET');
      if (!secret) {
        this.logger.error('JWT_ACCESS_SECRET is not configured');
        return false;
      }
      const payload = jwt.verify(token, secret) as any;
      req.user = payload; // Set user in request for AdminGuard
      this.logger.debug(
        `AdminOrKeyGuard: JWT verified for user ${payload.email}, role: ${payload.role}`,
      );
    } catch (err) {
      this.logger.debug('AdminOrKeyGuard: Invalid JWT token', err);
      return false;
    }

    // fallback to role-based admin guard
    try {
      return await this.adminGuard.canActivate(context);
    } catch {
      this.logger.debug('AdminOrKeyGuard: Role-based auth failed');
      return false;
    }
  }
}
