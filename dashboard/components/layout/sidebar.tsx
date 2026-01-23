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
  Sparkles,
  Briefcase,
  BookOpen,
  GraduationCap,
  LifeBuoy,
  Star,
  HelpCircle,
  ShieldCheck,
  Info,
  Bot,
  LayoutList
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "next-themes"
import Image from "next/image"

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
        title: "Danh mục",
        href: "/dashboard/categories",
        icon: LayoutList,
        badge: null,
      },
      {
        title: "Tồn kho",
        href: "/dashboard/inventory",
        icon: PackageCheck,
        badge: null,
      },
      {
        title: "Khuyến mãi",
        href: "/dashboard/promotions",
        icon: Percent,
        badge: null,
      },
    ]
  },
  {
    title: "Dịch vụ & Kỹ thuật",
    items: [
      {
        title: "Đặt lịch",
        href: "/dashboard/bookings",
        icon: Calendar,
        badge: null,
      },
      {
        title: "Dịch vụ",
        href: "/dashboard/services",
        icon: Briefcase,
        badge: null,
      },
      {
        title: "Kỹ thuật viên",
        href: "/dashboard/technicians",
        icon: UserCheck,
        badge: null,
      },
    ]
  },
  {
    title: "Nội dung & Phân phối",
    items: [
      {
        title: "Blog",
        href: "/dashboard/blog",
        icon: BookOpen,
        badge: null,
      },
      {
        title: "Kiến thức",
        href: "/dashboard/knowledge",
        icon: GraduationCap,
        badge: null,
      },
      {
        title: "Dự án",
        href: "/dashboard/projects",
        icon: FolderOpen,
        badge: null,
      },
      {
        title: "Banner",
        href: "/dashboard/banners",
        icon: FileText,
        badge: null,
      },
    ]
  },
  {
    title: "Hỗ trợ & Giao tiếp",
    items: [
      {
        title: "Tin nhắn",
        href: "/dashboard/messages",
        icon: MessageSquare,
        badge: null,
      },
      {
        title: "Hỗ trợ",
        href: "/dashboard/support",
        icon: LifeBuoy,
        badge: null,
      },
      {
        title: "Đánh giá",
        href: "/dashboard/reviews",
        icon: Star,
        badge: null,
      },
      {
        title: "FAQ",
        href: "/dashboard/faq",
        icon: HelpCircle,
        badge: null,
      },
    ]
  },
  {
    title: "Người dùng & Pháp lý",
    items: [
      {
        title: "Người dùng",
        href: "/dashboard/users",
        icon: Users,
        badge: null,
      },
      {
        title: "Chính sách",
        href: "/dashboard/policies",
        icon: ShieldCheck,
        badge: null,
      },
    ]
  },
  {
    title: "Hệ thống",
    items: [
      {
        title: "AI Assistant",
        href: "/dashboard/ai",
        icon: Bot,
        badge: "New",
      },
      {
        title: "Thông tin Web",
        href: "/dashboard/contact-info",
        icon: Info,
        badge: null,
      },
      {
        title: "Thông báo",
        href: "/dashboard/notifications",
        icon: Bell,
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
  const { user } = useAuth()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch - this is the standard pattern for theme detection
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Determine which logo to use based on theme
  const logoSrc = mounted && (resolvedTheme === 'dark' || theme === 'dark')
    ? '/images/logo/logo-dark.svg'
    : '/images/logo/logo-light.svg'

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

  const MenuItem = ({ item, isActive }: { item: typeof sidebarGroups[0]['items'][0], isActive: boolean }) => {
    const buttonContent = (
      <>
        {/* Active indicator */}
        {isActive && !collapsed && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
        )}

        <item.icon className={cn(
          "h-4 w-4 shrink-0",
          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
        )} />

        {!collapsed && (
          <>
            <span className="truncate flex-1 text-left">{item.title}</span>
            {item.badge && (
              <span className={cn(
                "ml-auto text-[11px] px-2 py-0.5 rounded-full font-medium",
                isActive
                  ? "bg-foreground/10 text-foreground"
                  : "bg-destructive/10 text-destructive"
              )}>
                {item.badge}
              </span>
            )}
          </>
        )}

        {collapsed && item.badge && (
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-destructive rounded-full shadow-sm" />
        )}
      </>
    )

    const buttonElement = (
      <Button
        asChild
        type="button"
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 h-9 relative rounded-lg px-2.5 text-sm font-medium transition-colors group",
          collapsed && "justify-center px-2",
          isActive
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
        )}
      >
        <Link href={item.href} className="block w-full">
          {buttonContent}
        </Link>
      </Button>
    )

    // Wrap in tooltip when collapsed to show button information
    if (collapsed) {
      return (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            {buttonElement}
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={12}
            className="bg-popover/95 backdrop-blur-md border border-border/60 shadow-lg px-3 py-2 z-[100]"
          >
            <p className="font-medium text-sm text-popover-foreground whitespace-nowrap">
              {item.title}
            </p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return buttonElement
  };

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={0}>
      <div className={cn(
        "flex flex-col h-full bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur-md border-r border-border/60 transition-[width] duration-200 overflow-hidden",
        collapsed ? "w-16" : "w-60",
        className
      )} suppressHydrationWarning>
        {/* Header */}
        <div
          className={cn(
            "flex border-b border-border/60 shrink-0",
            collapsed
              ? "flex-col items-center gap-2 p-2"
              : "items-center justify-between px-3 py-3"
          )}
        >
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-80 transition-opacity">
              {mounted ? (
                <div className="relative h-8 w-auto shrink-0">
                  <Image
                    src={logoSrc}
                    alt="Audio Tài Lộc"
                    width={120}
                    height={33}
                    className="h-8 w-auto object-contain"
                    priority
                  />
                </div>
              ) : (
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-foreground truncate">
                  Audio Tài Lộc
                </h2>
                <p className="text-[11px] text-muted-foreground truncate">
                  Admin Dashboard
                </p>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="hover:opacity-80 transition-opacity flex items-center justify-center">
              {mounted ? (
                <div className="relative h-7 w-7 shrink-0">
                  <Image
                    src={logoSrc}
                    alt="Audio Tài Lộc"
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                    priority
                  />
                </div>
              ) : (
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              )}
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 rounded-md hover:bg-muted/70 shrink-0"
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Search Bar */}
        {!collapsed && (
          <div className="px-3 py-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-8 h-8 text-xs bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md hover:bg-muted/70"
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
              <div key={groupIndex} className="space-y-1.5">
                {!collapsed && (
                  <h3 className="px-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    {group.title}
                  </h3>
                )}
                {collapsed && !searchQuery && (
                  <div className="h-px bg-border/60 mx-2" />
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    // For root dashboard link, only match exact path
                    // For other links, match exact or sub-paths
                    const isActive = item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(`${item.href}/`)
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
        <div className="p-3 border-t border-border/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border/60 shrink-0">
              <span className="text-xs font-semibold">AT</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {user?.name || user?.email || 'Admin User'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {user?.email || 'admin@audiotailoc.com'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
