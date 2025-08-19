import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const header = req.headers['authorization'] as string | undefined;
    if (!header || !header.startsWith('Bearer ')) return false;
    const token = header.slice(7);
    try {
      const secret = this.config.get<string>('JWT_ACCESS_SECRET') || 'dev_access';
      const payload = jwt.verify(token, secret);
      (req as any).user = payload;
      return true;
    } catch {
      return false;
    }
  }
}


