import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

/**
 * Optional JWT guard: allows unauthenticated requests to proceed,
 * but attaches req.user when a valid Bearer token is present.
 */
@Injectable()
export class OptionalJwtGuard implements CanActivate {
  private readonly logger = new Logger(OptionalJwtGuard.name);

  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const header = req.headers['authorization'] as string | undefined;

    // No token -> allow through.
    if (!header || !header.startsWith('Bearer ')) {
      (req as any).user = null;
      return true;
    }

    const token = header.slice(7);
    const secret = this.config.get<string>('JWT_ACCESS_SECRET');
    if (!secret) {
      // Misconfig should not block public/optional endpoints.
      this.logger.error('JWT_ACCESS_SECRET is not configured');
      (req as any).user = null;
      return true;
    }

    try {
      const payload = jwt.verify(token, secret);
      (req as any).user = payload;
    } catch (err) {
      // Invalid/expired token: treat as unauthenticated.
      (req as any).user = null;
    }

    return true;
  }
}
