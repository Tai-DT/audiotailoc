import { CacheInvalidation } from './cache-invalidation';
import { EventEmitter2 } from '@nestjs/event-emitter';

class FakeCacheManager {
  keys = new Set<string>();

  constructor(initialKeys: string[]) {
    initialKeys.forEach(k => this.keys.add(k));
  }

  buildKey(key: string): string {
    return key.startsWith('cache:') ? key : `cache:${key}`;
  }

  getLocalKeys() {
    return Array.from(this.keys);
  }

  async delete(key: string) {
    const target = this.buildKey(key);
    this.keys.delete(target);
  }

  async deleteRawKey(prefixedKey: string) {
    this.keys.delete(prefixedKey);
  }

  hasRedis() {
    return false;
  }

  async *scanRedisStream(_pattern: string) {
    // No redis keys in fake manager
  }
}

describe('CacheInvalidation', () => {
  it('invalidates keys matching regex and glob patterns', async () => {
    const fakeManager = new FakeCacheManager([
      'cache:user:1',
      'cache:product:2',
      'cache:category:3',
    ]);
    const invalidation = new CacheInvalidation(fakeManager as any, new EventEmitter2());

    const regexCount = await invalidation.invalidateByPattern(/^cache:user:.*/);
    expect(regexCount).toBe(1);
    expect(fakeManager.keys.has('cache:user:1')).toBe(false);

    const globCount = await invalidation.invalidateByPattern('cache:product:*');
    expect(globCount).toBe(1);
    expect(fakeManager.keys.has('cache:product:2')).toBe(false);
  });
});
