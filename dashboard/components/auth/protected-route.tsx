"use client"

import { useEffect, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: string
}

function getRoleFromJwt(accessToken: string | null): string | null {
  if (!accessToken) return null
  const parts = accessToken.split('.')
  if (parts.length < 2) return null

  try {
    // base64url -> base64
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64.padEnd(Math.ceil(b64.length / 4) * 4, '=')
    const json = JSON.parse(atob(padded)) as { role?: string } | null
    return json?.role ? String(json.role) : null
  } catch {
    return null
  }
}

export function ProtectedRoute({ children, requireAuth = true, requireRole }: ProtectedRouteProps) {
  const { user, isLoading, token, logout } = useAuth()
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
        return
      } else if (!requireAuth && user) {
        router.replace('/dashboard')
        return
      }

      if (requireAuth && requireRole && user) {
        const normalizedRequiredRole = String(requireRole).trim().toUpperCase()
        const tokenRole = getRoleFromJwt(token)
        const normalizedUserRole = String(user.role || tokenRole || '').trim().toUpperCase()

        if (!normalizedUserRole || normalizedUserRole !== normalizedRequiredRole) {
          // Clear auth state and send user back to login with an explicit reason.
          const redirectParam = encodeURIComponent(redirectTarget)
          logout(`/login?redirect=${redirectParam}&error=forbidden`)
        }
      }
    }
  }, [user, isLoading, requireAuth, requireRole, router, redirectTarget, logout])

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

  if (requireAuth && requireRole && user) {
    const normalizedRequiredRole = String(requireRole).trim().toUpperCase()
    const tokenRole = getRoleFromJwt(token)
    const normalizedUserRole = String(user.role || tokenRole || '').trim().toUpperCase()
    if (!normalizedUserRole || normalizedUserRole !== normalizedRequiredRole) {
      return null // Will redirect in useEffect
    }
  }
  
  if (!requireAuth) {
    return <>{children}</>
  }

  return <>{children}</>
}
