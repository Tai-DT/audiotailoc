"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_TTL = exports.CACHE_KEY = void 0;
exports.Cached = Cached;
exports.CacheKey = CacheKey;
exports.CacheTTL = CacheTTL;
const common_1 = require("@nestjs/common");
exports.CACHE_KEY = 'cache_key';
exports.CACHE_TTL = 'cache_ttl';
function Cached(options = {}) {
    return (target, propertyKey, descriptor) => {
        (0, common_1.SetMetadata)(exports.CACHE_KEY, options.key || propertyKey)(target, propertyKey, descriptor);
        (0, common_1.SetMetadata)(exports.CACHE_TTL, options.ttl || 300)(target, propertyKey, descriptor);
        (0, common_1.SetMetadata)('cache_condition', options.condition)(target, propertyKey, descriptor);
    };
}
function CacheKey(key) {
    return (0, common_1.SetMetadata)(exports.CACHE_KEY, key);
}
function CacheTTL(ttl) {
    return (0, common_1.SetMetadata)(exports.CACHE_TTL, ttl);
}
//# sourceMappingURL=cached.decorator.js.map