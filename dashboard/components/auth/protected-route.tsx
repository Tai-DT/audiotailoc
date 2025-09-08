"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

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
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Đang tải...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (requireAuth && !user) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
