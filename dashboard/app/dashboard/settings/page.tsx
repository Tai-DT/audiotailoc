"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Store,
  Building,
  Mail,
  Bell,
  Shield,
  Save
} from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import type { UpdateSettingsDto, SiteSettingsState, SiteSettingsResponse } from "@/types/settings"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<SiteSettingsState>({
    // Store settings
    storeName: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
    storeLogo: "",

    // Business settings
    taxCode: "",
    businessLicense: "",
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",

    // Email settings
    emailHost: "",
    emailPort: "",
    emailUsername: "",
    emailPassword: "",
    emailFrom: "",

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
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getSiteSettings()
        if (response.success && response.data) {
          const data = response.data as unknown as SiteSettingsResponse
          setSettings(prev => ({
            ...prev,
            ...(data.general || {}),
            ...(data.business || {}),
            ...(data.email || {}),
            ...(data.notifications || {}),
            ...(data.security || {}),
          }))
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
        toast.error("Không thể tải cài đặt")
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async (section: string) => {
    try {
      setLoading(true)

      const updateData: UpdateSettingsDto = {}

      switch (section) {
        case 'store':
          updateData.general = {
            storeName: settings.storeName,
            storeEmail: settings.storeEmail,
            storePhone: settings.storePhone,
            storeAddress: settings.storeAddress,
            storeLogo: settings.storeLogo
          }
          break
        case 'business':
          updateData.business = {
            taxCode: settings.taxCode,
            businessLicense: settings.businessLicense,
            currency: settings.currency,
            timezone: settings.timezone
          }
          break
        case 'email':
          updateData.email = {
            emailHost: settings.emailHost,
            emailPort: settings.emailPort,
            emailUsername: settings.emailUsername,
            emailPassword: settings.emailPassword,
            emailFrom: settings.emailFrom
          }
          break
        case 'notifications':
          updateData.notifications = {
            orderNotification: settings.orderNotification,
            paymentNotification: settings.paymentNotification,
            reviewNotification: settings.reviewNotification,
            lowStockNotification: settings.lowStockNotification
          }
          break
        case 'security':
          updateData.security = {
            twoFactorAuth: settings.twoFactorAuth,
            sessionTimeout: settings.sessionTimeout,
            passwordExpiry: settings.passwordExpiry,
            maxLoginAttempts: settings.maxLoginAttempts
          }
          break
      }

      await apiClient.updateSiteSettings(updateData)
      toast.success(`Đã lưu cài đặt`)
    } catch {
      toast.error("Không thể lưu cài đặt")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các cài đặt của cửa hàng Audio Tài Lộc
        </p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        {/* Store Settings */}
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="store">Cửa hàng</TabsTrigger>
          <TabsTrigger value="business">Kinh doanh</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        {/* Store Settings Tab */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="h-5 w-5 mr-2" />
                Thông tin cửa hàng
              </CardTitle>
              <CardDescription>
                Quản lý thông tin cơ bản của cửa hàng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Tên cửa hàng</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    placeholder="Nhập tên cửa hàng"
                  />
                </div>
                <div>
                  <Label htmlFor="storeEmail">Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="storePhone">Số điện thoại</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                    placeholder="0123456789"
                  />
                </div>
                <div>
                  <Label htmlFor="storeAddress">Địa chỉ</Label>
                  <Input
                    id="storeAddress"
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                    placeholder="123 Đường ABC, Quận XYZ"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="storeLogo">Logo cửa hàng</Label>
                <Input
                  id="storeLogo"
                  value={settings.storeLogo}
                  onChange={(e) => setSettings({ ...settings, storeLogo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <Button onClick={() => handleSave("store")} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings Tab */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Thông tin kinh doanh
              </CardTitle>
              <CardDescription>
                Quản lý thông tin kinh doanh và thuế
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxCode">Mã số thuế</Label>
                  <Input
                    id="taxCode"
                    value={settings.taxCode}
                    onChange={(e) => setSettings({ ...settings, taxCode: e.target.value })}
                    placeholder="0123456789"
                  />
                </div>
                <div>
                  <Label htmlFor="businessLicense">Giấy phép kinh doanh</Label>
                  <Input
                    id="businessLicense"
                    value={settings.businessLicense}
                    onChange={(e) => setSettings({ ...settings, businessLicense: e.target.value })}
                    placeholder="GP-123456"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Tiền tệ</Label>
                  <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tiền tệ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VND">VND</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Múi giờ</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn múi giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</SelectItem>
                      <SelectItem value="Asia/Hanoi">Asia/Hanoi</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => handleSave("business")} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Cài đặt Email
              </CardTitle>
              <CardDescription>
                Cấu hình SMTP để gửi email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emailHost">SMTP Host</Label>
                  <Input
                    id="emailHost"
                    value={settings.emailHost}
                    onChange={(e) => setSettings({ ...settings, emailHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="emailPort">Port</Label>
                  <Input
                    id="emailPort"
                    value={settings.emailPort}
                    onChange={(e) => setSettings({ ...settings, emailPort: e.target.value })}
                    placeholder="587"
                  />
                </div>
                <div>
                  <Label htmlFor="emailUsername">Username</Label>
                  <Input
                    id="emailUsername"
                    value={settings.emailUsername}
                    onChange={(e) => setSettings({ ...settings, emailUsername: e.target.value })}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="emailPassword">Password</Label>
                  <Input
                    id="emailPassword"
                    type="password"
                    value={settings.emailPassword}
                    onChange={(e) => setSettings({ ...settings, emailPassword: e.target.value })}
                    placeholder="App password"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="emailFrom">From Email</Label>
                <Input
                  id="emailFrom"
                  value={settings.emailFrom}
                  onChange={(e) => setSettings({ ...settings, emailFrom: e.target.value })}
                  placeholder="noreply@example.com"
                />
              </div>

              <Button onClick={() => handleSave("email")} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings Tab */}
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
                  <div>
                    <Label htmlFor="orderNotification">Thông báo đơn hàng</Label>
                    <p className="text-sm text-muted-foreground">Nhận thông báo khi có đơn hàng mới</p>
                  </div>
                  <Switch
                    id="orderNotification"
                    checked={settings.orderNotification}
                    onCheckedChange={(checked) => setSettings({ ...settings, orderNotification: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="paymentNotification">Thông báo thanh toán</Label>
                    <p className="text-sm text-muted-foreground">Nhận thông báo về thanh toán</p>
                  </div>
                  <Switch
                    id="paymentNotification"
                    checked={settings.paymentNotification}
                    onCheckedChange={(checked) => setSettings({ ...settings, paymentNotification: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reviewNotification">Thông báo đánh giá</Label>
                    <p className="text-sm text-muted-foreground">Nhận thông báo về đánh giá sản phẩm</p>
                  </div>
                  <Switch
                    id="reviewNotification"
                    checked={settings.reviewNotification}
                    onCheckedChange={(checked) => setSettings({ ...settings, reviewNotification: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lowStockNotification">Thông báo hết hàng</Label>
                    <p className="text-sm text-muted-foreground">Nhận thông báo khi sản phẩm sắp hết</p>
                  </div>
                  <Switch
                    id="lowStockNotification"
                    checked={settings.lowStockNotification}
                    onCheckedChange={(checked) => setSettings({ ...settings, lowStockNotification: checked })}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("notifications")} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Thời gian phiên (phút)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label htmlFor="passwordExpiry">Hết hạn mật khẩu (ngày)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => setSettings({ ...settings, passwordExpiry: parseInt(e.target.value) })}
                    placeholder="90"
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Số lần đăng nhập tối đa</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth">Xác thực 2 yếu tố</Label>
                  <p className="text-sm text-muted-foreground">Bật xác thực 2 yếu tố cho tài khoản admin</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                />
              </div>

              <Button onClick={() => handleSave("security")} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}