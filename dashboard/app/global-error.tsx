'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Đã xảy ra lỗi hệ thống
              </h1>
              <p className="text-gray-600 mb-6">
                Xin lỗi, có lỗi nghiêm trọng xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => reset()}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Thử lại
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Về trang chủ
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500">
                    Chi tiết lỗi (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-32 bg-gray-50 p-2 rounded">
                    {error.message}
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}