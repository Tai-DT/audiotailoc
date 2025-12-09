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
import { Menu, LogOut, User, Settings } from "lucide-react"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"
import { useAuth } from "@/lib/auth-context"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

// Page titles mapping
const pageTitles: Record<string, string> = {
  "/dashboard": "Tổng quan",
  "/dashboard/analytics": "Phân tích",
  "/dashboard/orders": "Đơn hàng",
  "/dashboard/products": "Sản phẩm",
  "/dashboard/services": "Dịch vụ",
  "/dashboard/customers": "Khách hàng",
  "/dashboard/users": "Người dùng",
  "/dashboard/inventory": "Tồn kho",
  "/dashboard/promotions": "Khuyến mãi",
  "/dashboard/campaigns": "Chiến dịch Marketing",
  "/dashboard/banners": "Quản lý Banner",
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
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const pageTitle = pageTitles[pathname] || "Dashboard"

  return (
    <header className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 md:py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-all duration-200" suppressHydrationWarning>
      {/* Mobile menu button */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Mobile title */}
        <div className="md:hidden fade-in min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Desktop title */}
        <div className="hidden md:block fade-in">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
            {pageTitle}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Quản lý hệ thống Audio Tài Lộc
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 fade-in shrink-0">
        {/* Theme Toggle */}
        {mounted && (
          <ThemeSwitcher />
        )}
        
        {/* Notifications */}
        <NotificationDropdown />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200">
              <Avatar className="h-8 w-8 ring-2 ring-blue-200 dark:ring-gray-600">
                <AvatarImage src="/avatars/admin.jpg" alt={user?.name || "User"} />
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
