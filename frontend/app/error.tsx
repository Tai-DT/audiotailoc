'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Oops! Có lỗi xảy ra</CardTitle>
          <CardDescription>
            Đã xảy ra lỗi không mong muốn. Chúng tôi đã ghi nhận và sẽ khắc phục sớm.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-medium mb-2">Chi tiết lỗi (development only):</p>
              <p className="text-xs text-muted-foreground font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground font-mono mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              variant="default"
              className="flex-1"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Thử lại
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Về trang chủ
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Nếu lỗi vẫn tiếp diễn, vui lòng{' '}
              <Link href="/contact" className="text-primary hover:underline">
                liên hệ hỗ trợ
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
