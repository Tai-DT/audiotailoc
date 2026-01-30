import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtOrKeyGuard implements CanActivate {
  private readonly logger = new Logger(JwtOrKeyGuard.name);

  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const headerKey = (req.headers['x-admin-key'] || req.headers['X-Admin-Key'] || '') as string;
    const envKey = this.config.get<string>('ADMIN_API_KEY') || '';

    if (envKey && headerKey && headerKey === envKey) {
      req.isAdminKey = true;
      return true;
    }

    const header = req.headers['authorization'] as string | undefined;
    if (!header || !header.startsWith('Bearer ')) {
      this.logger.warn(`Missing or invalid authorization header for ${req.path}`);
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = header.slice(7);
    try {
      const secret = this.config.get<string>('JWT_ACCESS_SECRET');
      if (!secret) {
        this.logger.error('JWT_ACCESS_SECRET is not configured');
        throw new UnauthorizedException('JWT configuration error');
      }
      const payload = jwt.verify(token, secret);
      (req as any).user = payload;
      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        this.logger.warn(`Expired token for ${req.path}`);
        throw new UnauthorizedException('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        this.logger.warn(`Invalid token for ${req.path}: ${error.message}`);
        throw new UnauthorizedException('Invalid token');
      }
      this.logger.error(`Token verification failed for ${req.path}:`, error);
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
