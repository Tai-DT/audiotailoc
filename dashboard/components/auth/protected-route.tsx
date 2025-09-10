"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        router.push('/login')
      } else if (!requireAuth && user) {
        router.push('/dashboard')
      }
    }
  }, [user, isLoading, requireAuth, router])

  if (isLoading && requireAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-background" suppressHydrationWarning>
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
        <span className="ml-3 text-sm text-muted-foreground">Đang tải...</span>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
