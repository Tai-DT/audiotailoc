// Logging System Examples for Audio Tài Lộc Backend
// This file demonstrates comprehensive logging capabilities

import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { LoggingService, LogContext } from './src/modules/logging/logging.service';
import { CorrelationService } from './src/modules/logging/correlation.service';
import { ApiVersions } from './src/modules/api-versioning/api-versioning.decorators';

// Example service showing different logging patterns
export class OrderService {
  constructor(private loggingService: LoggingService) {}

  async createOrder(orderData: any, userId: string) {
    const correlationId = CorrelationService.getCorrelationId();

    // Log business event start
    this.loggingService.logBusinessEvent('order_creation_started', {
      userId,
      productId: orderData.productId,
      quantity: orderData.quantity,
      amount: orderData.amount
    });

    try {
      // Simulate order processing
      const startTime = Date.now();

      // Process payment
      await this.processPayment(orderData);
      this.loggingService.logPayment('payment_processed', orderData.amount, 'VND', {
        orderId: 'temp_order_id',
        method: orderData.paymentMethod
      });

      // Create order in database
      const order = await this.saveOrderToDatabase(orderData);
      this.loggingService.logDatabase('order_insert', 'orders', {
        orderId: order.id,
        userId
      });

      // Calculate and log performance
      const duration = Date.now() - startTime;
      this.loggingService.logPerformance('order_creation', duration, {
        orderId: order.id,
        userId
      });

      // Log success
      this.loggingService.logBusinessEvent('order_creation_completed', {
        orderId: order.id,
        userId,
        amount: orderData.amount,
        status: 'success'
      });

      return order;

    } catch (error) {
      // Log error with full context
      this.loggingService.logError(error, {
        userId,
        operation: 'createOrder',
        orderData: {
          productId: orderData.productId,
          quantity: orderData.quantity,
          amount: orderData.amount
        },
        step: 'order_processing'
      });

      throw error;
    }
  }

  private async processPayment(orderData: any) {
    // Simulate payment processing with AI risk assessment
    this.loggingService.logAI('payment_risk_assessment', 'gemini-1.5-flash', {
      amount: orderData.amount,
      userId: orderData.userId,
      riskFactors: ['new_user', 'high_amount']
    });

    // Simulate payment call
    await new Promise(resolve => setTimeout(resolve, 100));

    return { success: true, transactionId: 'txn_123' };
  }

  private async saveOrderToDatabase(orderData: any) {
    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, 50));

    return {
      id: 'order_' + Date.now(),
      ...orderData,
      createdAt: new Date()
    };
  }
}

// Example controller showing HTTP logging
@Controller('orders')
@ApiVersions('v1', 'v2')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private loggingService: LoggingService
  ) {}

  @Post()
  async createOrder(@Body() orderData: any) {
    const userId = CorrelationService.getMetadata('userId') as string;
    const correlationId = CorrelationService.getCorrelationId();

    // Log incoming request with custom context
    this.loggingService.logWithContext('info', 'Order creation request received', {
      correlationId,
      userId,
      endpoint: '/orders',
      method: 'POST',
      orderData: {
        productId: orderData.productId,
        quantity: orderData.quantity,
        amount: orderData.amount,
        paymentMethod: orderData.paymentMethod
      },
      event: 'order_creation_request'
    });

    try {
      const order = await this.orderService.createOrder(orderData, userId);

      // Log successful response
      this.loggingService.logWithContext('info', 'Order created successfully', {
        correlationId,
        userId,
        orderId: order.id,
        amount: order.amount,
        event: 'order_creation_success'
      });

      return {
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          status: 'processing'
        },
        _correlationId: correlationId
      };

    } catch (error) {
      // Error already logged in service, but we can add controller context
      this.loggingService.logWithContext('error', 'Order creation failed at controller level', {
        correlationId,
        userId,
        orderData,
        error: {
          message: error.message,
          code: error.code
        },
        event: 'order_creation_controller_error'
      });

      throw error;
    }
  }

  @Get('search')
  async searchOrders(@Query() query: any) {
    const startTime = Date.now();

    // Log search operation
    this.loggingService.logWithContext('info', 'Order search initiated', {
      correlationId: CorrelationService.getCorrelationId(),
      userId: CorrelationService.getMetadata('userId') as string,
      searchQuery: query,
      event: 'order_search_start'
    });

    try {
      // Simulate AI-powered search
      this.loggingService.logAI('semantic_search', 'gemini-1.5-flash', {
        query: query.q,
        filters: query.filters,
        userId: CorrelationService.getMetadata('userId')
      });

      // Simulate search
      await new Promise(resolve => setTimeout(resolve, 200));

      const results = {
        orders: [],
        total: 0,
        searchType: 'ai_powered'
      };

      // Log performance
      const duration = Date.now() - startTime;
      this.loggingService.logPerformance('order_search', duration, {
        query: query.q,
        resultsCount: results.total
      });

      return {
        success: true,
        results,
        _correlationId: CorrelationService.getCorrelationId()
      };

    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'searchOrders',
        query,
        duration: Date.now() - startTime
      });
      throw error;
    }
  }
}

// Example of async operation with child contexts
export class NotificationService {
  constructor(private loggingService: LoggingService) {}

  async sendOrderConfirmation(orderId: string, userId: string) {
    const parentCorrelationId = CorrelationService.getCorrelationId();

    // Create child context for async operation
    const childContext = CorrelationService.createChildContext(parentCorrelationId);

    return CorrelationService.runInContext(childContext, async () => {
      this.loggingService.logBusinessEvent('notification_send_started', {
        orderId,
        userId,
        notificationType: 'order_confirmation',
        channel: 'email'
      });

      try {
        // Simulate notification sending
        await this.sendEmailNotification(orderId, userId);

        this.loggingService.logBusinessEvent('notification_send_completed', {
          orderId,
          userId,
          status: 'delivered'
        });

        return { success: true };

      } catch (error) {
        this.loggingService.logError(error, {
          orderId,
          userId,
          operation: 'sendOrderConfirmation',
          channel: 'email'
        });

        // Could retry or fallback to other channels
        return { success: false, error: error.message };
      }
    });
  }

  private async sendEmailNotification(orderId: string, userId: string) {
    // Simulate email service call
    await new Promise(resolve => setTimeout(resolve, 100));

    this.loggingService.logWithContext('info', 'Email notification sent', {
      orderId,
      userId,
      service: 'email_service',
      template: 'order_confirmation',
      event: 'email_sent'
    });
  }
}

// Example of security event logging
export class AuthService {
  constructor(private loggingService: LoggingService) {}

  async login(credentials: { email: string; password: string }, ip: string) {
    try {
      // Simulate authentication
      if (credentials.email === 'test@example.com') {
        // Log successful login
        this.loggingService.logSecurityEvent('authentication_success', {
          userId: 'user_123',
          ip,
          method: 'password',
          userAgent: 'Mozilla/5.0...'
        });

        return { success: true, userId: 'user_123' };
      } else {
        // Log failed login
        this.loggingService.logSecurityEvent('authentication_failed', {
          attemptedEmail: credentials.email,
          ip,
          reason: 'invalid_credentials',
          method: 'password'
        });

        throw new Error('Invalid credentials');
      }
    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'login',
        ip,
        email: credentials.email
      });
      throw error;
    }
  }

  async logout(userId: string, sessionId: string) {
    this.loggingService.logSecurityEvent('logout', {
      userId,
      sessionId,
      timestamp: new Date().toISOString()
    });

    return { success: true };
  }
}

// Example of audit logging
export class AdminService {
  constructor(private loggingService: LoggingService) {}

  async updateUserRole(adminId: string, targetUserId: string, newRole: string) {
    // Log audit event
    this.loggingService.logAudit(
      'UPDATE',
      'user_role',
      targetUserId,
      {
        adminId,
        newRole,
        previousRole: 'user', // Would fetch from database
        timestamp: new Date().toISOString()
      }
    );

    // Simulate role update
    await new Promise(resolve => setTimeout(resolve, 50));

    this.loggingService.logBusinessEvent('user_role_updated', {
      adminId,
      targetUserId,
      newRole,
      action: 'role_change'
    });

    return { success: true };
  }

  async deleteUser(adminId: string, targetUserId: string) {
    // Log audit event before deletion
    this.loggingService.logAudit(
      'DELETE',
      'user',
      targetUserId,
      {
        adminId,
        reason: 'user_request',
        timestamp: new Date().toISOString()
      }
    );

    // Simulate user deletion
    await new Promise(resolve => setTimeout(resolve, 100));

    this.loggingService.logBusinessEvent('user_deleted', {
      adminId,
      targetUserId,
      action: 'user_deletion'
    });

    return { success: true };
  }
}

// Example of health check logging
export class HealthCheckService {
  constructor(private loggingService: LoggingService) {}

  async checkDatabaseHealth() {
    try {
      // Simulate database health check
      await new Promise(resolve => setTimeout(resolve, 20));

      this.loggingService.logHealthCheck('database', 'healthy', {
        connectionPool: { used: 5, available: 20 },
        responseTime: 15,
        lastCheck: new Date().toISOString()
      });

      return { status: 'healthy', database: true };

    } catch (error) {
      this.loggingService.logHealthCheck('database', 'unhealthy', {
        error: error.message,
        lastCheck: new Date().toISOString()
      });

      return { status: 'unhealthy', database: false, error: error.message };
    }
  }

  async checkExternalServiceHealth() {
    try {
      // Simulate external API call
      await new Promise(resolve => setTimeout(resolve, 50));

      this.loggingService.logHealthCheck('payment_gateway', 'healthy', {
        endpoint: 'https://api.payment-gateway.com/health',
        responseTime: 45,
        lastCheck: new Date().toISOString()
      });

      return { status: 'healthy', paymentGateway: true };

    } catch (error) {
      this.loggingService.logHealthCheck('payment_gateway', 'unhealthy', {
        endpoint: 'https://api.payment-gateway.com/health',
        error: error.message,
        lastCheck: new Date().toISOString()
      });

      return { status: 'unhealthy', paymentGateway: false, error: error.message };
    }
  }
}

// Example of error boundary with comprehensive logging
export class ErrorBoundaryService {
  constructor(private loggingService: LoggingService) {}

  async executeWithErrorBoundary<T>(
    operation: () => Promise<T>,
    context: {
      operation: string;
      userId?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<T> {
    const startTime = Date.now();

    try {
      this.loggingService.logWithContext('info', `Operation started: ${context.operation}`, {
        ...context,
        event: 'operation_start',
        timestamp: new Date().toISOString()
      });

      const result = await operation();

      const duration = Date.now() - startTime;
      this.loggingService.logPerformance(context.operation, duration, {
        ...context,
        success: true
      });

      this.loggingService.logWithContext('info', `Operation completed: ${context.operation}`, {
        ...context,
        event: 'operation_complete',
        duration,
        success: true
      });

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;

      this.loggingService.logError(error, {
        ...context,
        duration,
        success: false,
        error: {
          message: error.message,
          stack: error.stack,
          code: error.code,
          details: error.details
        }
      });

      // Could implement retry logic here
      throw error;
    }
  }
}

// Example of how to use error boundary
export class ExampleService {
  constructor(
    private errorBoundaryService: ErrorBoundaryService,
    private orderService: OrderService
  ) {}

  async createOrderWithErrorBoundary(orderData: any, userId: string) {
    return this.errorBoundaryService.executeWithErrorBoundary(
      () => this.orderService.createOrder(orderData, userId),
      {
        operation: 'createOrder',
        userId,
        metadata: {
          productId: orderData.productId,
          quantity: orderData.quantity,
          amount: orderData.amount
        }
      }
    );
  }
}
