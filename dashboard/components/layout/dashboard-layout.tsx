"use client"

import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Toaster } from "sonner"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {




  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" suppressHydrationWarning>
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col flex-shrink-0" suppressHydrationWarning>
        <Sidebar className="w-full h-full" />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden" suppressHydrationWarning>
        {/* Header */}
        <Header />

        {/* Page Content with proper scrolling and improved spacing */}
        <main className="flex-1 overflow-y-auto custom-scrollbar" suppressHydrationWarning>
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-full" suppressHydrationWarning>
            <div className="max-w-7xl mx-auto" suppressHydrationWarning>
              {children}
            </div>
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
