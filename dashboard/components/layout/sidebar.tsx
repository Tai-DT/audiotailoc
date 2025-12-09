"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  Calendar,
  Search,
  X,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useMemo } from "react"

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
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  // Filter menu items based on search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return sidebarGroups

    const query = searchQuery.toLowerCase()
    return sidebarGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item =>
          item.title.toLowerCase().includes(query) ||
          group.title.toLowerCase().includes(query)
        )
      }))
      .filter(group => group.items.length > 0)
  }, [searchQuery])

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const MenuItem = ({ item, isActive }: { item: typeof sidebarGroups[0]['items'][0], isActive: boolean }) => {
    const content = (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 h-9 relative transition-all duration-300 rounded-lg group",
          collapsed && "justify-center px-2",
          isActive
            ? "bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 text-white shadow-md shadow-slate-500/25 hover:from-slate-700 hover:to-slate-900 dark:hover:from-slate-600 dark:hover:to-slate-800"
            : "hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 hover:translate-x-1"
        )}
      >
        {/* Active indicator */}
        {isActive && !collapsed && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
        )}
        
        <item.icon className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-300",
          isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-slate-700 dark:group-hover:text-slate-200",
          isActive && "scale-110"
        )} />
        
        {!collapsed && (
          <>
            <span className="truncate flex-1 text-left text-sm font-medium transition-all duration-300">{item.title}</span>
            {item.badge && (
              <span className={cn(
                "ml-auto text-xs px-2 py-0.5 rounded-full font-medium animate-pulse",
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
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-sm animate-pulse" />
        )}
      </Button>
    )

    if (collapsed) {
      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={item.href} className="block">
                {content}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>{item.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return <Link href={item.href} className="block">{content}</Link>
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "flex flex-col h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 overflow-hidden",
        collapsed ? "w-16" : "w-64",
        className
      )} suppressHydrationWarning>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2 animate-in fade-in-0 slide-in-from-left-2 min-w-0 flex-1">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 flex items-center justify-center shadow-sm shrink-0">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent truncate">
                  Audio Tài Lộc
                </h2>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  Admin Dashboard
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 flex items-center justify-center shadow-sm mx-auto shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300 transition-transform duration-300" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300 transition-transform duration-300" />
            )}
          </Button>
        </div>

        {/* Search Bar */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-2 animate-in fade-in-0 slide-in-from-top-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-8 h-8 text-xs bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/20"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 min-h-0 px-3 overflow-y-auto custom-scrollbar">
          <nav className="py-3 space-y-4">
            {filteredGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-1.5 animate-in fade-in-0 slide-in-from-left-2" style={{ animationDelay: `${groupIndex * 50}ms` }}>
                {!collapsed && (
                  <h3 className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 flex items-center gap-1.5">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                    <span>{group.title}</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                  </h3>
                )}
                {collapsed && !searchQuery && (
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mx-2" />
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <MenuItem key={item.href} item={item} isActive={isActive} />
                    )
                  })}
                </div>
              </div>
            ))}
            
            {filteredGroups.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <Search className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Không tìm thấy kết quả
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                  Thử tìm kiếm với từ khóa khác
                </p>
              </div>
            )}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 flex items-center justify-center shadow-sm ring-2 ring-blue-500/20 shrink-0">
              <span className="text-xs font-semibold text-white">AT</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in-0 slide-in-from-left-2">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">
                  Admin User
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                  admin@audiotailoc.com
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
