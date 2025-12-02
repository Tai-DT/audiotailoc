/**
 * Logger utility for dashboard application
 * Automatically disables logging in production unless explicitly enabled
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Check if logging is explicitly enabled via environment variable
const isLoggingEnabled = 
  isDevelopment || 
  process.env.NEXT_PUBLIC_ENABLE_LOGS === 'true' ||
  (typeof window !== 'undefined' && (window as any).__ENABLE_LOGS__ === true);

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (!isLoggingEnabled) return false;
    
    // In production, only log errors and warnings unless explicitly enabled
    if (isProduction && level === 'debug') {
      return process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGS === 'true';
    }
    
    return true;
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug('[DEBUG]', ...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info('[INFO]', ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: unknown[]): void {
    // Always log errors, even in production
    console.error('[ERROR]', ...args);
  }

  log(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.log('[LOG]', ...args);
    }
  }

  // Group logging for better organization
  group(label: string, collapsed = false): void {
    if (this.shouldLog('debug')) {
      if (collapsed) {
        console.groupCollapsed(label);
      } else {
        console.group(label);
      }
    }
  }

  groupEnd(): void {
    if (this.shouldLog('debug')) {
      console.groupEnd();
    }
  }

  // API-specific logging helpers
  apiRequest(method: string, url: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      this.debug(`API ${method.toUpperCase()}`, url, data ? { data } : '');
    }
  }

  apiResponse(method: string, url: string, status: number, data?: unknown): void {
    if (this.shouldLog('debug')) {
      this.debug(`API ${method.toUpperCase()} ${status}`, url, data ? { data } : '');
    }
  }

  apiError(method: string, url: string, error: unknown): void {
    this.error(`API ${method.toUpperCase()} Error`, url, error);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export default for convenience
export default logger;
