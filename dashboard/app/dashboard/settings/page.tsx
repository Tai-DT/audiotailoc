"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Store,
  Globe,
  Mail,
  Bell,
  Shield,
  Database,
  Save,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Store settings
    storeName: "Audio Tài Lộc",
    storeEmail: "contact@audiotailoc.com",
    storePhone: "0123456789",
    storeAddress: "123 Đường ABC, Quận XYZ, TP.HCM",
    storeLogo: "/logo.png",
    
    // Business settings
    taxCode: "0123456789",
    businessLicense: "GP-123456",
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",
    
    // Email settings
    emailHost: "smtp.gmail.com",
    emailPort: "587",
    emailUsername: "",
    emailPassword: "",
    emailFrom: "noreply@audiotailoc.com",
    
    // Notification settings
    orderNotification: true,
    paymentNotification: true,
    reviewNotification: true,
    lowStockNotification: true,
    
    // Security settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    
    // System settings
    maintenance: false,
    maintenanceMessage: "",
    backupEnabled: true,
    backupSchedule: "daily",
    
    // Display settings
    theme: "light",
    language: "vi",
    dateFormat: "DD/MM/YYYY",
    itemsPerPage: 20
  })

  const handleSave = async (section: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`Đã lưu cài đặt ${section}`)
    } catch {
      toast.error("Không thể lưu cài đặt")
    }
  }

  const handleResetSettings = () => {
    if (confirm("Bạn có chắc chắn muốn khôi phục cài đặt mặc định?")) {
      // Reset to defaults
      toast.success("Đã khôi phục cài đặt mặc định")
    }
  }

  return (
    <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
              <p className="text-muted-foreground">
                Quản lý cấu hình hệ thống
              </p>
            </div>
            <Button onClick={handleResetSettings} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Khôi phục mặc định
            </Button>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="store" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="store">Cửa hàng</TabsTrigger>
              <TabsTrigger value="business">Doanh nghiệp</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="notifications">Thông báo</TabsTrigger>
              <TabsTrigger value="security">Bảo mật</TabsTrigger>
              <TabsTrigger value="system">Hệ thống</TabsTrigger>
            </TabsList>

            {/* Store Settings */}
            <TabsContent value="store">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="h-5 w-5 mr-2" />
                    Thông tin cửa hàng
                  </CardTitle>
                  <CardDescription>
                    Cấu hình thông tin cơ bản của cửa hàng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="storeName">Tên cửa hàng</Label>
                      <Input
                        id="storeName"
                        value={settings.storeName}
                        onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="storeEmail">Email</Label>
                      <Input
                        id="storeEmail"
                        type="email"
                        value={settings.storeEmail}
                        onChange={(e) => setSettings({...settings, storeEmail: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="storePhone">Số điện thoại</Label>
                      <Input
                        id="storePhone"
                        value={settings.storePhone}
                        onChange={(e) => setSettings({...settings, storePhone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="storeLogo">URL Logo</Label>
                      <Input
                        id="storeLogo"
                        value={settings.storeLogo}
                        onChange={(e) => setSettings({...settings, storeLogo: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="storeAddress">Địa chỉ</Label>
                    <Textarea
                      id="storeAddress"
                      value={settings.storeAddress}
                      onChange={(e) => setSettings({...settings, storeAddress: e.target.value})}
                      rows={2}
                    />
                  </div>
                  <Button onClick={() => handleSave("cửa hàng")}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business Settings */}
            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Thông tin doanh nghiệp
                  </CardTitle>
                  <CardDescription>
                    Cấu hình thông tin pháp lý và kinh doanh
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="taxCode">Mã số thuế</Label>
                      <Input
                        id="taxCode"
                        value={settings.taxCode}
                        onChange={(e) => setSettings({...settings, taxCode: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessLicense">Giấy phép kinh doanh</Label>
                      <Input
                        id="businessLicense"
                        value={settings.businessLicense}
                        onChange={(e) => setSettings({...settings, businessLicense: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Đơn vị tiền tệ</Label>
                      <select
                        id="currency"
                        className="w-full px-3 py-2 border rounded-md"
                        value={settings.currency}
                        onChange={(e) => setSettings({...settings, currency: e.target.value})}
                      >
                        <option value="VND">VND - Việt Nam Đồng</option>
                        <option value="USD">USD - US Dollar</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Múi giờ</Label>
                      <select
                        id="timezone"
                        className="w-full px-3 py-2 border rounded-md"
                        value={settings.timezone}
                        onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                      >
                        <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                        <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                      </select>
                    </div>
                  </div>
                  <Button onClick={() => handleSave("doanh nghiệp")}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Settings */}
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Cấu hình Email
                  </CardTitle>
                  <CardDescription>
                    Thiết lập máy chủ gửi email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="emailHost">SMTP Host</Label>
                      <Input
                        id="emailHost"
                        value={settings.emailHost}
                        onChange={(e) => setSettings({...settings, emailHost: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailPort">SMTP Port</Label>
                      <Input
                        id="emailPort"
                        value={settings.emailPort}
                        onChange={(e) => setSettings({...settings, emailPort: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailUsername">Username</Label>
                      <Input
                        id="emailUsername"
                        value={settings.emailUsername}
                        onChange={(e) => setSettings({...settings, emailUsername: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailPassword">Password</Label>
                      <Input
                        id="emailPassword"
                        type="password"
                        value={settings.emailPassword}
                        onChange={(e) => setSettings({...settings, emailPassword: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="emailFrom">Email gửi từ</Label>
                      <Input
                        id="emailFrom"
                        type="email"
                        value={settings.emailFrom}
                        onChange={(e) => setSettings({...settings, emailFrom: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleSave("email")}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Cài đặt thông báo
                  </CardTitle>
                  <CardDescription>
                    Quản lý thông báo hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Thông báo đơn hàng mới</Label>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo khi có đơn hàng mới
                        </p>
                      </div>
                      <Switch
                        checked={settings.orderNotification}
                        onCheckedChange={(checked) => setSettings({...settings, orderNotification: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Thông báo thanh toán</Label>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo về thanh toán
                        </p>
                      </div>
                      <Switch
                        checked={settings.paymentNotification}
                        onCheckedChange={(checked) => setSettings({...settings, paymentNotification: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Thông báo đánh giá</Label>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo khi có đánh giá mới
                        </p>
                      </div>
                      <Switch
                        checked={settings.reviewNotification}
                        onCheckedChange={(checked) => setSettings({...settings, reviewNotification: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Cảnh báo tồn kho thấp</Label>
                        <p className="text-sm text-muted-foreground">
                          Nhận cảnh báo khi tồn kho thấp
                        </p>
                      </div>
                      <Switch
                        checked={settings.lowStockNotification}
                        onCheckedChange={(checked) => setSettings({...settings, lowStockNotification: checked})}
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleSave("thông báo")}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Cài đặt bảo mật
                  </CardTitle>
                  <CardDescription>
                    Quản lý bảo mật hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Xác thực hai yếu tố</Label>
                        <p className="text-sm text-muted-foreground">
                          Bật xác thực hai yếu tố cho tài khoản admin
                        </p>
                      </div>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="sessionTimeout">Thời gian hết phiên (phút)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="passwordExpiry">Hạn mật khẩu (ngày)</Label>
                      <Input
                        id="passwordExpiry"
                        type="number"
                        value={settings.passwordExpiry}
                        onChange={(e) => setSettings({...settings, passwordExpiry: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxLoginAttempts">Số lần đăng nhập tối đa</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleSave("bảo mật")}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Cài đặt hệ thống
                  </CardTitle>
                  <CardDescription>
                    Cấu hình hệ thống và sao lưu
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Chế độ bảo trì</Label>
                        <p className="text-sm text-muted-foreground">
                          Bật chế độ bảo trì hệ thống
                        </p>
                      </div>
                      <Switch
                        checked={settings.maintenance}
                        onCheckedChange={(checked) => setSettings({...settings, maintenance: checked})}
                      />
                    </div>
                    {settings.maintenance && (
                      <div>
                        <Label htmlFor="maintenanceMessage">Thông báo bảo trì</Label>
                        <Textarea
                          id="maintenanceMessage"
                          value={settings.maintenanceMessage}
                          onChange={(e) => setSettings({...settings, maintenanceMessage: e.target.value})}
                          placeholder="Hệ thống đang bảo trì, vui lòng quay lại sau..."
                          rows={3}
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sao lưu tự động</Label>
                        <p className="text-sm text-muted-foreground">
                          Bật sao lưu dữ liệu tự động
                        </p>
                      </div>
                      <Switch
                        checked={settings.backupEnabled}
                        onCheckedChange={(checked) => setSettings({...settings, backupEnabled: checked})}
                      />
                    </div>
                    {settings.backupEnabled && (
                      <div>
                        <Label htmlFor="backupSchedule">Lịch sao lưu</Label>
                        <select
                          id="backupSchedule"
                          className="w-full px-3 py-2 border rounded-md"
                          value={settings.backupSchedule}
                          onChange={(e) => setSettings({...settings, backupSchedule: e.target.value})}
                        >
                          <option value="hourly">Mỗi giờ</option>
                          <option value="daily">Hàng ngày</option>
                          <option value="weekly">Hàng tuần</option>
                          <option value="monthly">Hàng tháng</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="theme">Giao diện</Label>
                      <select
                        id="theme"
                        className="w-full px-3 py-2 border rounded-md"
                        value={settings.theme}
                        onChange={(e) => setSettings({...settings, theme: e.target.value})}
                      >
                        <option value="light">Sáng</option>
                        <option value="dark">Tối</option>
                        <option value="system">Theo hệ thống</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="language">Ngôn ngữ</Label>
                      <select
                        id="language"
                        className="w-full px-3 py-2 border rounded-md"
                        value={settings.language}
                        onChange={(e) => setSettings({...settings, language: e.target.value})}
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="dateFormat">Định dạng ngày</Label>
                      <select
                        id="dateFormat"
                        className="w-full px-3 py-2 border rounded-md"
                        value={settings.dateFormat}
                        onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="itemsPerPage">Số mục mỗi trang</Label>
                      <Input
                        id="itemsPerPage"
                        type="number"
                        value={settings.itemsPerPage}
                        onChange={(e) => setSettings({...settings, itemsPerPage: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleSave("hệ thống")}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
  )
}
