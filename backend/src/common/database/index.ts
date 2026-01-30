/**
 * Database Optimization System Exports
 */

// Temporarily disabled due to type compatibility issues with Prisma Accelerate
// export {
//   PrismaAccelerateManager,
//   AccelerateConfig,
//   prismaAccelerateManager,
//   getPrismaClient,
// } from './prisma-accelerate.config';

export {
  QueryPatterns,
  PaginationOptions,
  PaginatedResult,
  QueryOptimizeOptions,
  queryHelpers,
} from './query-patterns';

export {
  TransactionManager,
  TransactionOptions,
  TransactionResult,
  TransactionStats,
  Transactional,
} from './transaction-manager';

export {
  DatabaseHealthCheck,
  HealthCheckResult,
  HealthCheckDetails,
  ConnectionPoolMetrics,
  SlowQuery,
  ErrorMetrics,
  PerformanceMetrics,
  DatabaseMetrics,
  TableMetric,
} from './database-healthcheck';
