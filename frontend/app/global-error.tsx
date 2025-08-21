'use client';

import './globals.css';
import { ErrorFallback } from './components/ui/error-boundary';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="container mx-auto px-4 py-8">
          <ErrorFallback error={error} resetError={reset} />
        </div>
      </body>
    </html>
  );
}


