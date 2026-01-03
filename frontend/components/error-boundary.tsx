'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Optional: Custom error message */
  errorMessage?: string;
  /** Optional: Show home button */
  showHomeButton?: boolean;
  /** Optional: Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional onError callback
    this.props.onError?.(error, errorInfo);

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Production error:', {
        error: error.toString(),
        errorInfo: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="min-h-screen flex items-center justify-center bg-background"
          role="alert"
          aria-live="assertive"
          aria-labelledby="error-title"
          aria-describedby="error-description"
        >
          <div className="max-w-md w-full bg-card shadow-lg rounded-lg p-6 text-center border border-border">
            <div className="mb-4">
              <div 
                className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10"
                aria-hidden="true"
              >
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            
            <h1 
              id="error-title"
              className="text-lg font-semibold text-foreground mb-2"
            >
              {this.props.errorMessage || 'Đã xảy ra lỗi'}
            </h1>
            
            <p 
              id="error-description"
              className="text-muted-foreground mb-6"
            >
              Có lỗi không mong muốn xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề tiếp tục.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-destructive/10 rounded-md text-left">
                <h3 className="text-sm font-medium text-destructive mb-2">
                  Chi tiết lỗi (Development):
                </h3>
                <pre 
                  className="text-xs text-destructive/80 whitespace-pre-wrap overflow-auto max-h-40"
                  aria-label="Error message"
                >
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre 
                    className="text-xs text-destructive/70 mt-2 whitespace-pre-wrap overflow-auto max-h-40"
                    aria-label="Error stack trace"
                  >
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                onClick={this.handleRetry}
                variant="default"
                aria-label="Thử tải lại nội dung"
              >
                <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                Thử lại
              </Button>
              <Button
                onClick={this.handleReload}
                variant="outline"
                aria-label="Tải lại toàn bộ trang"
              >
                Tải lại trang
              </Button>
              {this.props.showHomeButton && (
                <Button variant="ghost" asChild>
                  <Link href="/" aria-label="Quay về trang chủ">
                    <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                    Trang chủ
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ==================== SECTION ERROR BOUNDARY ====================
// Lighter error boundary for sections/components

interface SectionErrorProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface SectionErrorState {
  hasError: boolean;
}

export class SectionErrorBoundary extends Component<SectionErrorProps, SectionErrorState> {
  public state: SectionErrorState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): SectionErrorState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Section error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          className="py-12 px-4 text-center"
          role="alert"
          aria-live="polite"
        >
          <div className="max-w-md mx-auto">
            <AlertTriangle 
              className="h-10 w-10 text-muted-foreground mx-auto mb-4" 
              aria-hidden="true"
            />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {this.props.fallbackTitle || 'Không thể tải nội dung'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {this.props.fallbackDescription || 'Đã xảy ra lỗi khi tải phần này. Vui lòng thử lại.'}
            </p>
            <Button
              onClick={this.handleRetry}
              variant="outline"
              size="sm"
              aria-label="Thử tải lại phần này"
            >
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Thử lại
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ==================== HOC ====================
// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// ==================== HOOK ====================
// Hook for manual error handling
export function useErrorHandler() {
  return (error: Error, errorInfo?: string) => {
    console.error('Manual error:', error, errorInfo);
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Add your error reporting service
    }
  };
}
