"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Bell,
  BellOff,
  Send,
  Mail,
  MessageSquare,
  Smartphone,
  Users,
  Check,
  X,
  RefreshCw,
  Filter,
  Plus,
  Settings,
  Clock,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { format } from "date-fns"
import { vi } from "date-fns/locale/vi"

export default function NotificationsPage() {
  const {
    notifications,
    settings,
    loading,
    fetchNotifications,
    sendNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings
  } = useNotifications()

  const [activeTab, setActiveTab] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "info",
    target: "all",
    channels: ["app"]
  })

  useEffect(() => {
    fetchNotifications()
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4 text-blue-500" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-3 w-3" />
      case 'sms': return <Smartphone className="h-3 w-3" />
      case 'push': return <Bell className="h-3 w-3" />
      default: return <MessageSquare className="h-3 w-3" />
    }
  }

  const handleSendNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) {
      return
    }

    await sendNotification(notificationForm)
    setShowCreateDialog(false)
    setNotificationForm({
      title: "",
      message: "",
      type: "info",
      target: "all",
      channels: ["app"]
    })
  }

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !n.isRead
    return n.type === activeTab
  })

  return (
    <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quản lý Thông báo</h1>
              <p className="text-muted-foreground">
                Gửi và quản lý thông báo đến người dùng
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo thông báo
              </Button>
              <Button onClick={fetchNotifications} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng thông báo</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.length}</div>
                <p className="text-xs text-muted-foreground">
                  Đã gửi hôm nay
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chưa đọc</CardTitle>
                <BellOff className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {notifications.filter(n => !n.isRead).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cần xem xét
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ đọc</CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications.length > 0 
                    ? `${Math.round((notifications.filter(n => n.isRead).length / notifications.length) * 100)}%`
                    : '0%'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Đã xem
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kênh hoạt động</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant={settings?.emailEnabled ? "default" : "secondary"}>
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Badge>
                  <Badge variant={settings?.smsEnabled ? "default" : "secondary"}>
                    <Smartphone className="h-3 w-3 mr-1" />
                    SMS
                  </Badge>
                  <Badge variant={settings?.pushEnabled ? "default" : "secondary"}>
                    <Bell className="h-3 w-3 mr-1" />
                    Push
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Cài đặt thông báo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Gửi thông báo qua email
                    </p>
                  </div>
                  <Switch
                    checked={settings?.emailEnabled}
                    onCheckedChange={(checked) => updateSettings({ emailEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Gửi thông báo qua SMS
                    </p>
                  </div>
                  <Switch
                    checked={settings?.smsEnabled}
                    onCheckedChange={(checked) => updateSettings({ smsEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notification</Label>
                    <p className="text-sm text-muted-foreground">
                      Thông báo đẩy
                    </p>
                  </div>
                  <Switch
                    checked={settings?.pushEnabled}
                    onCheckedChange={(checked) => updateSettings({ pushEnabled: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lịch sử thông báo</CardTitle>
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <Button size="sm" variant="outline" onClick={markAllAsRead}>
                    <Check className="h-3 w-3 mr-1" />
                    Đánh dấu tất cả đã đọc
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
                  <TabsTrigger value="info">Thông tin</TabsTrigger>
                  <TabsTrigger value="warning">Cảnh báo</TabsTrigger>
                  <TabsTrigger value="error">Lỗi</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <Card key={notification.id} className={!notification.isRead ? "border-primary/50 bg-primary/5" : ""}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold">{notification.title}</h4>
                                  {!notification.isRead && (
                                    <Badge variant="secondary" className="text-xs">Mới</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <div className="flex items-center space-x-1">
                                    {notification.channels.map((channel) => (
                                      <Badge key={channel} variant="outline" className="text-xs">
                                        {getChannelIcon(channel)}
                                        <span className="ml-1">{channel}</span>
                                      </Badge>
                                    ))}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 inline mr-1" />
                                    {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {!notification.isRead && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        Không có thông báo nào
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Create Notification Dialog */}
          {showCreateDialog && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
              <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold">Tạo thông báo mới</h2>
                    <p className="text-sm text-muted-foreground">
                      Gửi thông báo đến người dùng
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Tiêu đề</Label>
                      <Input
                        value={notificationForm.title}
                        onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                        placeholder="Nhập tiêu đề thông báo"
                      />
                    </div>
                    
                    <div>
                      <Label>Nội dung</Label>
                      <Textarea
                        value={notificationForm.message}
                        onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                        placeholder="Nhập nội dung thông báo"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label>Loại thông báo</Label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={notificationForm.type}
                        onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value})}
                      >
                        <option value="info">Thông tin</option>
                        <option value="success">Thành công</option>
                        <option value="warning">Cảnh báo</option>
                        <option value="error">Lỗi</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label>Đối tượng</Label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={notificationForm.target}
                        onChange={(e) => setNotificationForm({...notificationForm, target: e.target.value})}
                      >
                        <option value="all">Tất cả người dùng</option>
                        <option value="customers">Khách hàng</option>
                        <option value="staff">Nhân viên</option>
                        <option value="specific">Người dùng cụ thể</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label>Kênh gửi</Label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={notificationForm.channels.includes("app")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNotificationForm({
                                  ...notificationForm, 
                                  channels: [...notificationForm.channels, "app"]
                                })
                              } else {
                                setNotificationForm({
                                  ...notificationForm,
                                  channels: notificationForm.channels.filter(c => c !== "app")
                                })
                              }
                            }}
                          />
                          App
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={notificationForm.channels.includes("email")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNotificationForm({
                                  ...notificationForm, 
                                  channels: [...notificationForm.channels, "email"]
                                })
                              } else {
                                setNotificationForm({
                                  ...notificationForm,
                                  channels: notificationForm.channels.filter(c => c !== "email")
                                })
                              }
                            }}
                          />
                          Email
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={notificationForm.channels.includes("sms")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNotificationForm({
                                  ...notificationForm, 
                                  channels: [...notificationForm.channels, "sms"]
                                })
                              } else {
                                setNotificationForm({
                                  ...notificationForm,
                                  channels: notificationForm.channels.filter(c => c !== "sms")
                                })
                              }
                            }}
                          />
                          SMS
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Hủy
                    </Button>
                    <Button onClick={handleSendNotification}>
                      <Send className="h-4 w-4 mr-2" />
                      Gửi thông báo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
  )
}
