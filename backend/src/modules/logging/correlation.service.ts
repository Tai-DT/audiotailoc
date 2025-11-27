import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';

export interface CorrelationContext {
  correlationId: string;
  userId?: string;
  sessionId?: string;
  requestId: string;
  startTime: Date;
  metadata: Map<string, any>;
}

@Injectable({ scope: Scope.REQUEST })
export class CorrelationService {
  private static readonly storage = new AsyncLocalStorage<CorrelationContext>();
  private static readonly requestStorage = new Map<string, CorrelationContext>();

  // Generate a new correlation ID
  static generateCorrelationId(): string {
    return `req_${Date.now()}_${uuidv4().split('-')[0]}`;
  }

  // Start a new correlation context
  static startContext(correlationId?: string): CorrelationContext {
    const context: CorrelationContext = {
      correlationId: correlationId || this.generateCorrelationId(),
      requestId: uuidv4(),
      startTime: new Date(),
      metadata: new Map(),
    };

    this.requestStorage.set(context.correlationId, context);
    return context;
  }

  // Run function within correlation context
  static runInContext<T>(context: CorrelationContext, callback: () => T): T {
    return this.storage.run(context, callback);
  }

  // Get current correlation context
  static getCurrentContext(): CorrelationContext | undefined {
    return this.storage.getStore();
  }

  // Get correlation ID from current context
  static getCorrelationId(): string | undefined {
    const context = this.getCurrentContext();
    return context?.correlationId;
  }

  // Get request ID from current context
  static getRequestId(): string | undefined {
    const context = this.getCurrentContext();
    return context?.requestId;
  }

  // Set user ID in current context
  static setUserId(userId: string) {
    const context = this.getCurrentContext();
    if (context) {
      context.userId = userId;
    }
  }

  // Set session ID in current context
  static setSessionId(sessionId: string) {
    const context = this.getCurrentContext();
    if (context) {
      context.sessionId = sessionId;
    }
  }

  // Add metadata to current context
  static addMetadata(key: string, value: any) {
    const context = this.getCurrentContext();
    if (context) {
      context.metadata.set(key, value);
    }
  }

  // Get metadata from current context
  static getMetadata(key: string): any {
    const context = this.getCurrentContext();
    return context?.metadata.get(key);
  }

  // Get all metadata from current context
  static getAllMetadata(): Record<string, any> {
    const context = this.getCurrentContext();
    if (!context) return {};

    const metadata: Record<string, any> = {};
    context.metadata.forEach((value, key) => {
      metadata[key] = value;
    });
    return metadata;
  }

  // Get context by correlation ID
  static getContextById(correlationId: string): CorrelationContext | undefined {
    return this.requestStorage.get(correlationId);
  }

  // End correlation context (cleanup)
  static endContext(correlationId: string) {
    this.requestStorage.delete(correlationId);
  }

  // Get request duration
  static getRequestDuration(): number {
    const context = this.getCurrentContext();
    if (!context) return 0;

    return Date.now() - context.startTime.getTime();
  }

  // Create child context (for async operations)
  static createChildContext(parentCorrelationId?: string): CorrelationContext {
    const parentId = parentCorrelationId || this.getCorrelationId();
    const childContext = this.startContext();

    if (parentId) {
      childContext.metadata.set('parentCorrelationId', parentId);
    }

    return childContext;
  }

  // Extract correlation ID from request headers
  static extractFromHeaders(headers: Record<string, any>): string | undefined {
    return (
      headers['x-correlation-id'] ||
      headers['x-request-id'] ||
      headers['correlation-id'] ||
      headers['request-id']
    );
  }

  // Add correlation headers to response
  static addToHeaders(headers: Record<string, any>) {
    const context = this.getCurrentContext();
    if (context) {
      headers['x-correlation-id'] = context.correlationId;
      headers['x-request-id'] = context.requestId;
    }
  }

  // Clean up old contexts (call periodically)
  static cleanup(maxAge: number = 3600000) {
    // 1 hour default
    const now = Date.now();
    const toDelete: string[] = [];

    this.requestStorage.forEach((context, correlationId) => {
      if (now - context.startTime.getTime() > maxAge) {
        toDelete.push(correlationId);
      }
    });

    toDelete.forEach(id => {
      this.requestStorage.delete(id);
    });

    return toDelete.length;
  }

  // Get statistics
  static getStats() {
    return {
      activeContexts: this.requestStorage.size,
      totalContexts: this.requestStorage.size,
    };
  }

  // For debugging - get all active contexts
  static getAllContexts(): Map<string, CorrelationContext> {
    return new Map(this.requestStorage);
  }
}
