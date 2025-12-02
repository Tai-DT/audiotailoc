"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  FileText,
  MessageSquare,
  CreditCard,
  Archive,
  Bell,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Percent,
  PackageCheck,
  Target,
  FolderOpen,
  Settings2,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const sidebarGroups = [
  {
    title: "Tổng quan",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        title: "Phân tích",
        href: "/dashboard/analytics",
        icon: BarChart3,
        badge: null,
      },
    ]
  },
  {
    title: "Thương mại điện tử",
    items: [
      {
        title: "Đặt lịch",
        href: "/dashboard/bookings",
        icon: Calendar,
        badge: null,
      },
      {
        title: "Đơn hàng",
        href: "/dashboard/orders",
        icon: ShoppingCart,
        // badge will be populated dynamically by notifications/stat endpoint in future
        badge: null,
      },
      {
        title: "Sản phẩm",
        href: "/dashboard/products",
        icon: Package,
        badge: null,
      },
      {
        title: "Tồn kho",
        href: "/dashboard/inventory",
        icon: PackageCheck,
        badge: null,
      },
      {
        title: "Dịch vụ",
        href: "/dashboard/services",
        icon: FileText,
        badge: null,
      },
      {
        title: "Loại dịch vụ",
        href: "/dashboard/services/types",
        icon: Settings2,
        badge: null,
      },
    ]
  },
  {
    title: "Khách hàng",
    items: [
      {
        title: "Khách hàng",
        href: "/dashboard/customers",
        icon: UserCheck,
        badge: null,
      },
      {
        title: "Người dùng",
        href: "/dashboard/users",
        icon: Users,
        badge: null,
      },
    ]
  },
  {
    title: "Marketing",
    items: [
      {
        title: "Khuyến mãi",
        href: "/dashboard/promotions",
        icon: Percent,
        badge: null,
      },
      {
        title: "Chiến dịch",
        href: "/dashboard/campaigns",
        icon: Target,
        badge: null,
      },
      {
        title: "Banner",
        href: "/dashboard/banners",
        icon: FileText,
        badge: null,
      },
      {
        title: "Dự án",
        href: "/dashboard/projects",
        icon: FolderOpen,
        badge: null,
      },
    ]
  },
  {
    title: "Giao tiếp",
    items: [
      {
        title: "Đánh giá",
        href: "/dashboard/reviews",
        icon: MessageSquare,
        badge: null,
      },
      {
        title: "Thông báo",
        href: "/dashboard/notifications",
        icon: Bell,
        badge: null,
      },
    ]
  },
  {
    title: "Tài chính",
    items: [
      {
        title: "Thanh toán",
        href: "/dashboard/payments",
        icon: CreditCard,
        badge: null,
      },
      {
        title: "Báo cáo",
        href: "/dashboard/reports",
        icon: FileText,
        badge: null,
      },
    ]
  },
  {
    title: "Hệ thống",
    items: [
      {
        title: "Sao lưu",
        href: "/dashboard/backups",
        icon: Archive,
        badge: null,
      },
      {
        title: "Cài đặt",
        href: "/dashboard/settings",
        icon: Settings,
        badge: null,
      },
    ]
  }
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn("flex flex-col h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50", className)} suppressHydrationWarning>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
        {!collapsed && (
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
              Audio Tài Lộc
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Admin Dashboard
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-9 w-9 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 overflow-y-auto">
        <nav className="py-4 space-y-6">
          {sidebarGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
              {!collapsed && (
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 h-11 relative transition-all duration-200 rounded-xl",
                          collapsed && "justify-center px-2",
                          isActive
                            ? "bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 text-white shadow-lg shadow-slate-500/25 hover:from-slate-700 hover:to-slate-900 dark:hover:from-slate-600 dark:hover:to-slate-800"
                            : "hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200"
                        )}
                      >
                        <item.icon className={cn(
                          "h-5 w-5 shrink-0",
                          isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                        )} />
                        {!collapsed && (
                          <>
                            <span className="truncate flex-1 text-left font-medium">{item.title}</span>
                            {item.badge && (
                              <span className={cn(
                                "ml-auto text-xs px-2.5 py-1 rounded-full font-medium",
                                isActive 
                                  ? "bg-white/20 text-white" 
                                  : "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm"
                              )}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                        {collapsed && item.badge && (
                          <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-sm" />
                        )}
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 flex items-center justify-center shadow-sm">
            <span className="text-sm font-semibold text-white">AT</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                admin@audiotailoc.com
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
