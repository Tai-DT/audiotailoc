"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/hooks/use-notifications"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function NotificationDropdown() {
  const router = useRouter()
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loading
  } = useNotifications()
  const [open, setOpen] = useState(false)

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const unreadCount = notifications.filter(n => !n.isRead).length
  const recentNotifications = notifications.slice(0, 5)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="h-2 w-2 rounded-full bg-green-500" />
      case 'error':
        return <div className="h-2 w-2 rounded-full bg-red-500" />
      case 'warning':
        return <div className="h-2 w-2 rounded-full bg-yellow-500" />
      default:
        return <div className="h-2 w-2 rounded-full bg-blue-500" />
    }
  }

  const handleMarkAsRead = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation()
    markAsRead(notificationId)
  }

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation()
    deleteNotification(notificationId)
  }

  const handleMarkAllRead = () => {
    markAllAsRead()
  }

  const handleViewAll = () => {
    setOpen(false)
    router.push('/dashboard/notifications')
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg hover:bg-muted/70"
        >
          <Bell className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] leading-none rounded-full flex items-center justify-center font-medium shadow-lg">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <DropdownMenuLabel className="p-0 text-base font-semibold">
              Thông báo
            </DropdownMenuLabel>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} mới
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="h-8 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Đọc tất cả
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleViewAll}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : recentNotifications.length > 0 ? (
            <div className="divide-y">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer",
                    !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/10"
                  )}
                  onClick={() => handleViewAll()}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          "text-sm font-medium leading-tight",
                          !notification.isRead && "font-semibold"
                        )}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={(e) => handleMarkAsRead(e, notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: vi
                          })}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={(e) => handleDelete(e, notification.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Không có thông báo mới</p>
              <p className="text-xs text-muted-foreground mt-1">
                Thông báo của bạn sẽ hiển thị ở đây
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {recentNotifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm"
                onClick={handleViewAll}
              >
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
