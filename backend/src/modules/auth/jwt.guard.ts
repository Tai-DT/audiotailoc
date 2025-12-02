import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // Derive the full request path (prefer originalUrl if available)
    const fullPath =
      req.originalUrl || `${req.baseUrl || ''}${req.path || ''}` || req.route?.path || req.path;
    const path = typeof fullPath === 'string' ? fullPath : String(fullPath);

    // Allow public auth routes without authentication
    const publicRoutes = [
      '/auth/register',
      '/auth/login',
      '/auth/refresh',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/status',
      '/catalog/products',
      '/catalog/categories',
      '/services',
      '/services/types',
      '/health',
    ];

    // Allow both plain and API-prefixed public routes (tests may use global prefix /api/v1)
    if (publicRoutes.some(route => path.includes(route) || path.includes(`/api/v1${route}`))) {
      return true;
    }

    const header = req.headers['authorization'] as string | undefined;
    
    // DEBUG LOG
    this.logger.log(`[DEBUG_GUARD] Checking auth for ${path}`);
    this.logger.log(`[DEBUG_GUARD] Header present: ${!!header}`);
    
    if (!header || !header.startsWith('Bearer ')) {
      this.logger.warn(`Missing or invalid authorization header for ${path}`);
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
      
      // DEBUG LOG
      this.logger.log(`[DEBUG_GUARD] Token verified. Payload: ${JSON.stringify(payload)}`);
      
      (req as any).user = payload;
      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        this.logger.warn(`Expired token for ${path}`);
        throw new UnauthorizedException('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        this.logger.warn(`Invalid token for ${path}: ${(error as any).message}`);
        throw new UnauthorizedException('Invalid token');
      }
      this.logger.error(
        `Token verification failed for ${path}: ${(error as any)?.message || String(error)}`,
        error as any,
      );
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
