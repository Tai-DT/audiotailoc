import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        {
          "h-4 w-4": size === "sm",
          "h-8 w-8": size === "md",
          "h-12 w-12": size === "lg",
        },
        className
      )}
    />
  )
}

interface LoadingProps {
  children?: React.ReactNode
  className?: string
}

export function Loading({ children, className }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        {children && (
          <p className="text-sm text-gray-600">{children}</p>
        )}
      </div>
    </div>
  )
}

export function LoadingButton({ 
  loading, 
  children, 
  ...props 
}: { 
  loading?: boolean 
  children: React.ReactNode 
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" />
          <span>Đang xử lý...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}
