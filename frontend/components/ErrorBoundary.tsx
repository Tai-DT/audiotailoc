'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto p-6">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Có lỗi xảy ra
              </h2>
              <p className="text-gray-600">
                Đã có lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left text-sm text-gray-500 bg-gray-100 p-3 rounded mt-2">
                  <summary className="cursor-pointer font-medium">
                    Chi tiết lỗi (Development)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap text-xs">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={this.handleRetry} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Thử lại
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Tải lại trang
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

