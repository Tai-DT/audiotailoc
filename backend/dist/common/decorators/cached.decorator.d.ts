export declare const CACHE_KEY = "cache_key";
export declare const CACHE_TTL = "cache_ttl";
export interface CacheOptions {
    key?: string;
    ttl?: number;
    condition?: (args: any[]) => boolean;
}
export declare function Cached(options?: CacheOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function CacheKey(key: string): any;
export declare function CacheTTL(ttl: number): any;
