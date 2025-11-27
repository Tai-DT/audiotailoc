import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private client: Redis | null = null;
  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('REDIS_URL') || 'redis://localhost:6379';
    try {
      this.client = new IORedis(url, { maxRetriesPerRequest: 1 });
    } catch {
      this.client = null;
    }
  }
  async onModuleDestroy() {
    await this.client?.quit();
  }
  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    try {
      const v = await this.client.get(key);
      return v ? (JSON.parse(v) as T) : null;
    } catch {
      return null;
    }
  }
  async set(key: string, value: unknown, ttlSec = 60): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSec);
    } catch {}
  }
  async del(pattern: string): Promise<void> {
    if (!this.client) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length) await this.client.del(keys);
    } catch {}
  }
}
