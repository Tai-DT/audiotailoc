"use client"

import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Toaster } from "sonner"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {




  return (
    <div
      className="flex min-h-dvh bg-background"
      suppressHydrationWarning
    >
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside className="hidden md:flex md:flex-col flex-shrink-0" suppressHydrationWarning>
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden" suppressHydrationWarning>
        {/* Header */}
        <Header />

        {/* Page Content with proper scrolling and improved spacing */}
        <main className="flex-1 overflow-y-auto custom-scrollbar" suppressHydrationWarning>
          <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 py-4 md:py-5" suppressHydrationWarning>
            {children}
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <div suppressHydrationWarning>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
      </div>
    </div>
  )
}
