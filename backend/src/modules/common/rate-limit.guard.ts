import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { CacheService } from './cache.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly cache: CacheService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const ip = (req.ip || req.headers['x-forwarded-for'] || 'unknown').toString();
    const key = `rl:${req.method}:${req.path}:${ip}`;
    const curr = ((await this.cache.get<number>(key)) || 0) + 1;
    await this.cache.set(key, curr, 10); // 10s window
    if (curr > 10) throw new BadRequestException('Too many requests');
    return true;
  }
}


