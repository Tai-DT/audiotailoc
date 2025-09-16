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
    itemsPerPage: 20,

    // About settings
    aboutTitle: "Về Audio Tài Lộc",
    aboutSummary: "Audio Tài Lộc - Cửa hàng âm thanh chuyên nghiệp với hơn 10 năm kinh nghiệm",
    aboutContent: "",
    aboutHeroImage: "",

    // Contact settings
    contactEmail: "support@audiotailoc.com",
    contactPhone: "0123 456 789",
    contactAddress: "123 Đường ABC, Quận XYZ, TP.HCM",
    contactWorkingHours: "Thứ 2 - Thứ 7: 8:00 - 20:00",
    contactMessage: "Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh sau:",
    facebookUrl: "",
    youtubeUrl: ""
  })
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
    itemsPerPage: 20,

    // About settings
    aboutTitle: "Về Audio Tài Lộc",
    aboutSummary: "Audio Tài Lộc - Cửa hàng âm thanh chuyên nghiệp với hơn 10 năm kinh nghiệm",
    aboutContent: "",
    aboutHeroImage: "",

    // Contact settings
    contactEmail: "support@audiotailoc.com",
    contactPhone: "0123 456 789",
    contactAddress: "123 Đường ABC, Quận XYZ, TP.HCM",
    contactWorkingHours: "Thứ 2 - Thứ 7: 8:00 - 20:00",
    contactMessage: "Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh sau:",
    facebookUrl: "",
    youtubeUrl: ""
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
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="store">Cửa hàng</TabsTrigger>
          <TabsTrigger value="business">Doanh nghiệp</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="system">Hệ thống</TabsTrigger>
          <TabsTrigger value="about">Giới thiệu</TabsTrigger>
          <TabsTrigger value="contact">Liên hệ</TabsTrigger>
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
                  <Label htmlFor="storeAddress">Địa chỉ</Label>
                  <Input
                    id="storeAddress"
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({...settings, storeAddress: e.target.value})}
                  />
                </div>
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
              <CardTitle>Thông tin doanh nghiệp</CardTitle>
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
                  <Input
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Múi giờ</Label>
                  <Input
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  />
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
                Thiết lập SMTP để gửi email
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
                  <Label htmlFor="emailPort">Port</Label>
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
              </div>

              <div>
                <Label htmlFor="emailFrom">Email gửi từ</Label>
                <Input
                  id="emailFrom"
                  type="email"
                  value={settings.emailFrom}
                  onChange={(e) => setSettings({...settings, emailFrom: e.target.value})}
                />
              </div>

              <Button onClick={() => handleSave("email")}>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Thông báo
              </CardTitle>
              <CardDescription>
                Cấu hình các loại thông báo
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
                    onCheckedChange={(checked) => setSettings({...settings, orderNotification: checked})}
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
                    onCheckedChange={(checked) => setSettings({...settings, paymentNotification: checked})}
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
                    onCheckedChange={(checked) => setSettings({...settings, reviewNotification: checked})}
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
                Bảo mật
              </CardTitle>
              <CardDescription>
                Cấu hình bảo mật hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="sessionTimeout">Thời gian phiên (phút)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordExpiry">Hết hạn mật khẩu (ngày)</Label>
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

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth">Xác thực 2 yếu tố</Label>
                  <p className="text-sm text-muted-foreground">Bật xác thực 2 yếu tố cho tài khoản admin</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
                />
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
                Hệ thống
              </CardTitle>
              <CardDescription>
                Cấu hình hệ thống và bảo trì
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="theme">Giao diện</Label>
                  <Input
                    id="theme"
                    value={settings.theme}
                    onChange={(e) => setSettings({...settings, theme: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="language">Ngôn ngữ</Label>
                  <Input
                    id="language"
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dateFormat">Định dạng ngày</Label>
                  <Input
                    id="dateFormat"
                    value={settings.dateFormat}
                    onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="itemsPerPage">Số item/trang</Label>
                  <Input
                    id="itemsPerPage"
                    type="number"
                    value={settings.itemsPerPage}
                    onChange={(e) => setSettings({...settings, itemsPerPage: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance">Chế độ bảo trì</Label>
                  <p className="text-sm text-muted-foreground">Bật chế độ bảo trì website</p>
                </div>
                <Switch
                  id="maintenance"
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
                    placeholder="Thông báo hiển thị khi website đang bảo trì"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="backupEnabled">Tự động sao lưu</Label>
                  <p className="text-sm text-muted-foreground">Bật sao lưu tự động</p>
                </div>
                <Switch
                  id="backupEnabled"
                  checked={settings.backupEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, backupEnabled: checked})}
                />
              </div>

              {settings.backupEnabled && (
                <div>
                  <Label htmlFor="backupSchedule">Lịch sao lưu</Label>
                  <Input
                    id="backupSchedule"
                    value={settings.backupSchedule}
                    onChange={(e) => setSettings({...settings, backupSchedule: e.target.value})}
                    placeholder="daily, weekly, monthly"
                  />
                </div>
              )}

              <Button onClick={() => handleSave("hệ thống")}>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Settings */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Trang giới thiệu
              </CardTitle>
              <CardDescription>
                Quản lý nội dung trang giới thiệu về cửa hàng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="aboutTitle">Tiêu đề</Label>
                <Input
                  id="aboutTitle"
                  value={settings.aboutTitle}
                  onChange={(e) => setSettings({...settings, aboutTitle: e.target.value})}
                  placeholder="Tiêu đề trang giới thiệu"
                />
              </div>

              <div>
                <Label htmlFor="aboutSummary">Tóm tắt</Label>
                <Textarea
                  id="aboutSummary"
                  value={settings.aboutSummary}
                  onChange={(e) => setSettings({...settings, aboutSummary: e.target.value})}
                  placeholder="Tóm tắt ngắn gọn về cửa hàng"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="aboutContent">Nội dung chi tiết</Label>
                <Textarea
                  id="aboutContent"
                  value={settings.aboutContent}
                  onChange={(e) => setSettings({...settings, aboutContent: e.target.value})}
                  placeholder="Nội dung HTML chi tiết về cửa hàng"
                  rows={10}
                />
              </div>

              <div>
                <Label htmlFor="aboutHeroImage">Hình ảnh hero</Label>
                <Input
                  id="aboutHeroImage"
                  value={settings.aboutHeroImage}
                  onChange={(e) => setSettings({...settings, aboutHeroImage: e.target.value})}
                  placeholder="URL hình ảnh hero"
                />
              </div>

              <Button onClick={() => handleSave("giới thiệu")}>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Thông tin liên hệ
              </CardTitle>
              <CardDescription>
                Cấu hình thông tin liên hệ và hỗ trợ khách hàng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="contactEmail">Email liên hệ</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Số điện thoại</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="contactAddress">Địa chỉ</Label>
                  <Input
                    id="contactAddress"
                    value={settings.contactAddress}
                    onChange={(e) => setSettings({...settings, contactAddress: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="contactWorkingHours">Giờ làm việc</Label>
                  <Input
                    id="contactWorkingHours"
                    value={settings.contactWorkingHours}
                    onChange={(e) => setSettings({...settings, contactWorkingHours: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contactMessage">Thông điệp liên hệ</Label>
                <Textarea
                  id="contactMessage"
                  value={settings.contactMessage}
                  onChange={(e) => setSettings({...settings, contactMessage: e.target.value})}
                  placeholder="Thông điệp hiển thị trên trang liên hệ"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Mạng xã hội</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="facebookUrl">Facebook</Label>
                    <Input
                      id="facebookUrl"
                      value={settings.facebookUrl}
                      onChange={(e) => setSettings({...settings, facebookUrl: e.target.value})}
                      placeholder="https://facebook.com/audiotailoc"
                    />
                  </div>

                  <div>
                    <Label htmlFor="youtubeUrl">YouTube</Label>
                    <Input
                      id="youtubeUrl"
                      value={settings.youtubeUrl}
                      onChange={(e) => setSettings({...settings, youtubeUrl: e.target.value})}
                      placeholder="https://youtube.com/audiotailoc"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("liên hệ")}>
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
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* About Settings */}
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Trang giới thiệu
                  </CardTitle>
                  <CardDescription>
                    Quản lý nội dung trang giới thiệu về cửa hàng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="aboutTitle">Tiêu đề</Label>
                    <Input
                      id="aboutTitle"
                      value={settings.aboutTitle || "Về Audio Tài Lộc"}
                      onChange={(e) => setSettings({...settings, aboutTitle: e.target.value})}
                      placeholder="Tiêu đề trang giới thiệu"
                    />
                  </div>

                  <div>
                    <Label htmlFor="aboutSummary">Tóm tắt</Label>
                    <Textarea
                      id="aboutSummary"
                      value={settings.aboutSummary || "Audio Tài Lộc - Cửa hàng âm thanh chuyên nghiệp với hơn 10 năm kinh nghiệm"}
                      onChange={(e) => setSettings({...settings, aboutSummary: e.target.value})}
                      placeholder="Tóm tắt ngắn gọn về cửa hàng"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="aboutContent">Nội dung chi tiết</Label>
                    <Textarea
                      id="aboutContent"
                      value={settings.aboutContent || ""}
                      onChange={(e) => setSettings({...settings, aboutContent: e.target.value})}
                      placeholder="Nội dung HTML chi tiết về cửa hàng"
                      rows={10}
                    />
                  </div>

                  <div>
                    <Label htmlFor="aboutHeroImage">Hình ảnh hero</Label>
                    <Input
                      id="aboutHeroImage"
                      value={settings.aboutHeroImage || ""}
                      onChange={(e) => setSettings({...settings, aboutHeroImage: e.target.value})}
                      placeholder="URL hình ảnh hero"
                    />
                  </div>

                  <Button onClick={() => handleSave("giới thiệu")}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Settings */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Thông tin liên hệ
                  </CardTitle>
                  <CardDescription>
                    Cấu hình thông tin liên hệ và hỗ trợ khách hàng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="contactEmail">Email liên hệ</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.contactEmail || "support@audiotailoc.com"}
                        onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPhone">Số điện thoại</Label>
                      <Input
                        id="contactPhone"
                        value={settings.contactPhone || "0123 456 789"}
                        onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactAddress">Địa chỉ</Label>
                      <Input
                        id="contactAddress"
                        value={settings.contactAddress || "123 Đường ABC, Quận XYZ, TP.HCM"}
                        onChange={(e) => setSettings({...settings, contactAddress: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactWorkingHours">Giờ làm việc</Label>
                      <Input
                        id="contactWorkingHours"
                        value={settings.contactWorkingHours || "Thứ 2 - Thứ 7: 8:00 - 20:00"}
                        onChange={(e) => setSettings({...settings, contactWorkingHours: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contactMessage">Thông điệp liên hệ</Label>
                    <Textarea
                      id="contactMessage"
                      value={settings.contactMessage || "Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh sau:"}
                      onChange={(e) => setSettings({...settings, contactMessage: e.target.value})}
                      placeholder="Thông điệp hiển thị trên trang liên hệ"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Mạng xã hội</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="facebookUrl">Facebook</Label>
                        <Input
                          id="facebookUrl"
                          value={settings.facebookUrl || ""}
                          onChange={(e) => setSettings({...settings, facebookUrl: e.target.value})}
                          placeholder="https://facebook.com/audiotailoc"
                        />
                      </div>

                      <div>
                        <Label htmlFor="youtubeUrl">YouTube</Label>
                        <Input
                          id="youtubeUrl"
                          value={settings.youtubeUrl || ""}
                          onChange={(e) => setSettings({...settings, youtubeUrl: e.target.value})}
                          placeholder="https://youtube.com/audiotailoc"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSave("liên hệ")}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )
    }Audio Tài Lộc",
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
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="store">Cửa hàng</TabsTrigger>
          <TabsTrigger value="business">Doanh nghiệp</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="system">Hệ thống</TabsTrigger>
          <TabsTrigger value="about">Giới thiệu</TabsTrigger>
          <TabsTrigger value="contact">Liên hệ</TabsTrigger>
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
            </TabsContent>

            {/* About Settings */}
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Trang giới thiệu
                  </CardTitle>
                  <CardDescription>
                    Quản lý nội dung trang giới thiệu về cửa hàng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="aboutTitle">Tiêu đề</Label>
                    <Input
                      id="aboutTitle"
                      value={settings.aboutTitle || "Về Audio Tài Lộc"}
                      onChange={(e) => setSettings({...settings, aboutTitle: e.target.value})}
                      placeholder="Tiêu đề trang giới thiệu"
                    />
                  </div>

                  <div>
                    <Label htmlFor="aboutSummary">Tóm tắt</Label>
                    <Textarea
                      id="aboutSummary"
                      value={settings.aboutSummary || "Audio Tài Lộc - Cửa hàng âm thanh chuyên nghiệp với hơn 10 năm kinh nghiệm"}
                      onChange={(e) => setSettings({...settings, aboutSummary: e.target.value})}
                      placeholder="Tóm tắt ngắn gọn về cửa hàng"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="aboutContent">Nội dung chi tiết</Label>
                    <Textarea
                      id="aboutContent"
                      value={settings.aboutContent || ""}
                      onChange={(e) => setSettings({...settings, aboutContent: e.target.value})}
                      placeholder="Nội dung HTML chi tiết về cửa hàng"
                      rows={10}
                    />
                  </div>

                  <div>
                    <Label htmlFor="aboutHeroImage">Hình ảnh hero</Label>
                    <Input
                      id="aboutHeroImage"
                      value={settings.aboutHeroImage || ""}
                      onChange={(e) => setSettings({...settings, aboutHeroImage: e.target.value})}
                      placeholder="URL hình ảnh hero"
                    />
                  </div>

                  <Button onClick={() => handleSave("giới thiệu")}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Settings */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Thông tin liên hệ
                  </CardTitle>
                  <CardDescription>
                    Cấu hình thông tin liên hệ và hỗ trợ khách hàng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="contactEmail">Email liên hệ</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.contactEmail || "support@audiotailoc.com"}
                        onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPhone">Số điện thoại</Label>
                      <Input
                        id="contactPhone"
                        value={settings.contactPhone || "0123 456 789"}
                        onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactAddress">Địa chỉ</Label>
                      <Input
                        id="contactAddress"
                        value={settings.contactAddress || "123 Đường ABC, Quận XYZ, TP.HCM"}
                        onChange={(e) => setSettings({...settings, contactAddress: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactWorkingHours">Giờ làm việc</Label>
                      <Input
                        id="contactWorkingHours"
                        value={settings.contactWorkingHours || "Thứ 2 - Thứ 7: 8:00 - 20:00"}
                        onChange={(e) => setSettings({...settings, contactWorkingHours: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contactMessage">Thông điệp liên hệ</Label>
                    <Textarea
                      id="contactMessage"
                      value={settings.contactMessage || "Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh sau:"}
                      onChange={(e) => setSettings({...settings, contactMessage: e.target.value})}
                      placeholder="Thông điệp hiển thị trên trang liên hệ"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Mạng xã hội</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="facebookUrl">Facebook</Label>
                        <Input
                          id="facebookUrl"
                          value={settings.facebookUrl || ""}
                          onChange={(e) => setSettings({...settings, facebookUrl: e.target.value})}
                          placeholder="https://facebook.com/audiotailoc"
                        />
                      </div>

                      <div>
                        <Label htmlFor="youtubeUrl">YouTube</Label>
                        <Input
                          id="youtubeUrl"
                          value={settings.youtubeUrl || ""}
                          onChange={(e) => setSettings({...settings, youtubeUrl: e.target.value})}
                          placeholder="https://youtube.com/audiotailoc"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSave("liên hệ")}>
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
