"use client"

import { useState, useEffect } from "react"
import { ToastProvider } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return children without providers during SSR to prevent hydration mismatch
    return <>{children}</>
  }

  return (
    <TooltipProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </TooltipProvider>
  )
}

