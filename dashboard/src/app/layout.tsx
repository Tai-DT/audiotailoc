import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DashboardProvider } from '@/contexts/DashboardContext'
import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Audio Tài Lộc - Admin Dashboard',
  description: 'Comprehensive admin dashboard for Audio Tài Lộc platform',
  keywords: ['dashboard', 'admin', 'audio', 'monitoring', 'analytics'],
  authors: [{ name: 'Audio Tài Lộc Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider>
          <QueryProvider>
            <DashboardProvider>
              <DashboardLayout>
                {children}
              </DashboardLayout>
            </DashboardProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
