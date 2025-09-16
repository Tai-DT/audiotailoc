import { } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

// Custom metrics decorators
export function TrackExecutionTime(operation: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: any, ...args: any[]) {
      const start = Date.now();
      const monitoringService = this.monitoringService || getMonitoringService();

      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - start;

        if (monitoringService) {
          // You could add a custom histogram for operation duration
          console.log(`Operation ${operation} took ${duration}ms`);
        }

        return result;
      } catch (error) {
        const _duration = Date.now() - start;

        if (monitoringService) {
          monitoringService.recordError('OperationError', operation);
        }

        throw error;
      }
    };

    return descriptor;
  };
}

export function TrackDatabaseOperation(operation: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: any, ...args: any[]) {
      const monitoringService = this.monitoringService || getMonitoringService();

      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        if (monitoringService) {
          monitoringService.recordError('DatabaseError', operation);
        }
        throw error;
      }
    };

    return descriptor;
  };
}

export function TrackExternalService(serviceName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: any, ...args: any[]) {
      const monitoringService = this.monitoringService || getMonitoringService();

      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        if (monitoringService) {
          monitoringService.recordError('ExternalServiceError', serviceName);
        }
        throw error;
      }
    };

    return descriptor;
  };
}

// Helper function to get monitoring service instance
function getMonitoringService(): MonitoringService | null {
  try {
    // This is a simplified approach - in real implementation you'd use NestJS DI
    return null;
  } catch {
    return null;
  }
}
