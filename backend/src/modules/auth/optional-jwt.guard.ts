import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT guard: allows unauthenticated requests to proceed,
 * but attaches req.user when a valid Bearer token is present.
 */
@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] as string | undefined;
    // No token -> allow through without triggering passport
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return true;
    }
    return super.canActivate(context) as any;
  }

  handleRequest(err: unknown, user: any) {
    if (err) {
      // If token invalid, treat as unauthenticated instead of throwing
      return null;
    }
    return user || null;
  }
}
