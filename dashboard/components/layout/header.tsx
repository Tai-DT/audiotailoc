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
import { Bell, Search, Menu, LogOut, User, Settings } from "lucide-react"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
    <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm" suppressHydrationWarning>
      {/* Mobile menu button */}
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-blue-50 dark:hover:bg-gray-700">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="hidden md:block">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
            {pageTitle}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Quản lý hệ thống Audio Tài Lộc
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-lg mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 backdrop-blur-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        {mounted && (
          <ThemeSwitcher />
        )}
        
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-10 w-10 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg">
            3
          </span>
        </Button>

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
