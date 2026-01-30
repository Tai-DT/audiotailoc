"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings } from "lucide-react"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { useAuth } from "@/lib/auth-context"
import { usePathname } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { useTheme } from "next-themes"

// Page titles mapping
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/analytics": "Phân tích",
  "/dashboard/bookings": "Đặt lịch",
  "/dashboard/orders": "Đơn hàng",
  "/dashboard/products": "Sản phẩm",
  "/dashboard/services": "Dịch vụ",
  "/dashboard/services/types": "Loại dịch vụ",
  "/dashboard/customers": "Khách hàng",
  "/dashboard/users": "Người dùng",
  "/dashboard/technicians": "Kỹ thuật viên",
  "/dashboard/inventory": "Tồn kho",
  "/dashboard/promotions": "Khuyến mãi",
  "/dashboard/campaigns": "Chiến dịch Marketing",
  "/dashboard/banners": "Quản lý Banner",
  "/dashboard/projects": "Dự án",
  "/dashboard/email-templates": "Email templates",
  "/dashboard/reviews": "Đánh giá",
  "/dashboard/notifications": "Thông báo",
  "/dashboard/payments": "Thanh toán",
  "/dashboard/reports": "Báo cáo",
  "/dashboard/backups": "Sao lưu",
  "/dashboard/settings": "Cài đặt",
  "/profile": "Hồ sơ cá nhân",
  "/login": "Đăng nhập",
}

export function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()
  
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])
  
  const pageTitle = useMemo(() => {
    const match = Object.entries(pageTitles)
      .filter(([key]) => pathname === key || pathname.startsWith(`${key}/`))
      .sort((a, b) => b[0].length - a[0].length)[0]

    return match?.[1] || "Dashboard"
  }, [pathname])

  return (
    <header
      className="flex h-12 md:h-14 items-center justify-between gap-2 px-3 sm:px-4 md:px-6 bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur-md border-b border-border/60"
      suppressHydrationWarning
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Title */}
        <div className="flex items-center gap-3 fade-in min-w-0">
          <h1 className="min-w-0 truncate text-base md:text-lg font-semibold text-foreground">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 fade-in shrink-0">
        {/* Theme Toggle */}
        {mounted && (
          <ThemeSwitcher />
        )}
        
        {/* Notifications */}
        <NotificationDropdown />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-lg hover:bg-muted/70">
              <Avatar className="h-7 w-7 ring-1 ring-border/60">
                <AvatarImage src="/images/logo/logo-dark.svg" alt={user?.name || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 text-white font-semibold">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'AT'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
