import { DynamicModule } from '@nestjs/common';
export interface CacheModuleOptions {
    isGlobal?: boolean;
    ttl?: number;
}
export declare class CacheModule {
    static forRoot(options?: CacheModuleOptions): DynamicModule;
    static forRootAsync(options: {
        useFactory: (...args: any[]) => Promise<CacheModuleOptions> | CacheModuleOptions;
        inject?: any[];
    }): DynamicModule;
}
