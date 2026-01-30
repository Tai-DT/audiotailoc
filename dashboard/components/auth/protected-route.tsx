"use client"

import { useEffect, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, isLoading, token } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const redirectTarget = useMemo(() => {
    // Avoid redirect loops on the login page
    if (!pathname || pathname === '/login') return '/dashboard'
    return pathname
  }, [pathname])

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        const redirectParam = encodeURIComponent(redirectTarget)
        router.replace(`/login?redirect=${redirectParam}`)
      } else if (!requireAuth && user) {
        router.replace('/dashboard')
      }
    }
  }, [user, isLoading, requireAuth, router, redirectTarget])

  if (isLoading && requireAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
        <span className="ml-3 text-sm text-muted-foreground">Đang tải...</span>
      </div>
    )
  }

  if (requireAuth && (!user || !token)) {
    return null // Will redirect in useEffect
  }
  
  if (!requireAuth) {
    return <>{children}</>
  }

  return <>{children}</>
}
