'use client';

import React from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">😞</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Đã xảy ra lỗi</h1>
        <p className="text-gray-600 mb-6">
          Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Chi tiết lỗi (Development)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-red-600 overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        <div className="space-y-3">
          <button
            onClick={resetError}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Thử lại
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

interface ErrorMessageProps {
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function ErrorMessage({ 
  title = "Có lỗi xảy ra", 
  message, 
  action 
}: ErrorMessageProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-700 mb-4">{message}</p>
        {action && (
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
