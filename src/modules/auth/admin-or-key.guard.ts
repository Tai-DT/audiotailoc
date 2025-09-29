import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminOrKeyGuard implements CanActivate {
  private readonly logger = new Logger(AdminOrKeyGuard.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const headerKey = (req.headers['x-admin-key'] || req.headers['X-Admin-Key'] || '') as string;
    const envKey = this.config.get<string>('ADMIN_API_KEY') || '';
    
    this.logger.debug(`AdminOrKeyGuard: Checking authentication for path ${req.path}`);
    this.logger.debug(`AdminOrKeyGuard: headerKey present: ${!!headerKey}, envKey present: ${!!envKey}`);
    
    // First, try API key authentication
    if (envKey && headerKey && headerKey === envKey) {
      this.logger.debug('AdminOrKeyGuard: API key match - allowing access');
      return true;
    }
    
    // If API key fails, try JWT token authentication
    const authHeader = req.headers['authorization'] as string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const secret = this.config.get<string>('JWT_ACCESS_SECRET') || 'dev_access';
        const payload = jwt.verify(token, secret);
        req.user = payload;
        this.logger.debug('AdminOrKeyGuard: JWT token valid - allowing access');
        return true;
      } catch (error) {
        this.logger.debug('AdminOrKeyGuard: JWT token invalid:', error.message);
      }
    }
    
    this.logger.debug('AdminOrKeyGuard: Both API key and JWT token authentication failed - denying access');
    return false;
  }
}

