import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
  method: string;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const _response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: this.serializeBigInt(data),
        message: this.getSuccessMessage(request.method, request.url),
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      })),
    );
  }

  private serializeBigInt(obj: any, visited = new WeakSet()): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    // Convert Date objects to ISO strings so they serialize cleanly in JSON
    if (obj instanceof Date) {
      return obj.toISOString();
    }

    if (typeof obj === 'bigint') {
      return Number(obj);
    }

    if (typeof obj !== 'object') {
      return obj;
    }

    // Check for circular references
    if (visited.has(obj)) {
      return '[Circular Reference]';
    }

    visited.add(obj);

    if (Array.isArray(obj)) {
      const result = obj.map(item => this.serializeBigInt(item, visited));
      visited.delete(obj); // Clean up after processing array
      return result;
    }

    if (typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.serializeBigInt(value, visited);
      }
      visited.delete(obj); // Clean up after processing object
      return result;
    }

    visited.delete(obj); // Clean up for primitive values
    return obj;
  }

  private getSuccessMessage(method: string, _url: string): string {
    switch (method) {
      case 'GET':
        return 'Data retrieved successfully';
      case 'POST':
        return 'Resource created successfully';
      case 'PUT':
      case 'PATCH':
        return 'Resource updated successfully';
      case 'DELETE':
        return 'Resource deleted successfully';
      default:
        return 'Operation completed successfully';
    }
  }
}

