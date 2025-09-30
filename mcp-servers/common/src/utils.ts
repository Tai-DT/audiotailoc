import { MCPServerConfig, MCPTool, MCPResource, ProjectInfo, ServiceInfo } from './types';

export class Logger {
  static info(message: string, data?: any) {
    console.log(`[${new Date().toISOString()}] INFO: ${message}`, data || '');
  }

  static error(message: string, error?: any) {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error || '');
  }

  static warn(message: string, data?: any) {
    console.warn(`[${new Date().toISOString()}] WARN: ${message}`, data || '');
  }
}

export class ErrorHandler {
  static handle(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  static createError(message: string, code?: string): Error {
    const error = new Error(message);
    if (code) {
      (error as any).code = code;
    }
    return error;
  }
}

export class ProjectUtils {
  static getProjectInfo(): ProjectInfo {
    return {
      name: 'AudioTailoc',
      description: 'Ứng dụng thương mại điện tử cho thiết bị âm thanh',
      technologies: ['Next.js', 'NestJS', 'TypeScript', 'Prisma', 'PostgreSQL'],
      lastUpdated: new Date().toISOString()
    };
  }

  static getServiceInfo(): ServiceInfo[] {
    return [
      {
        name: 'Backend API',
        status: 'active',
        url: process.env.BACKEND_URL || 'http://localhost:3001',
        healthCheck: '/api/health'
      },
      {
        name: 'Frontend',
        status: 'active',
        url: process.env.FRONTEND_URL || 'http://localhost:3000'
      },
      {
        name: 'Dashboard',
        status: 'active',
        url: process.env.DASHBOARD_URL || 'http://localhost:3002'
      }
    ];
  }
}

export class ValidationUtils {
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
}