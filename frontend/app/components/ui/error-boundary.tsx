"use client"

import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Đã xảy ra lỗi</CardTitle>
          <CardDescription>
            Xin lỗi, có lỗi xảy ra khi tải nội dung này.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800 font-mono">
              {error.message}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={resetError} variant="outline">
              Thử lại
            </Button>
            <Button onClick={() => window.location.reload()}>
              Tải lại trang
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

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
