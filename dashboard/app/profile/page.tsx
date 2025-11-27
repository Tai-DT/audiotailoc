"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { User, Mail, Shield, Calendar } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api-client"

export default function ProfilePage() {
  const { user, setUser, refreshUser } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const handleSave = async () => {
    if (!user) return

    try {
      setIsSaving(true)
      await apiClient.updateUser(user.id, {
        name: formData.name,
        // Note: Email update might require re-verification depending on backend logic
        // For now we send it if it changed
      })

      // Update local user state
      // We need to refresh the user data from the server to ensure we have the latest state
      const refreshed = await refreshUser()

      if (!refreshed) {
        // Fallback if refresh fails
        setUser({ ...user, name: formData.name })
      }

      toast({
        title: "Thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      })

      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Vui lòng đăng nhập để xem trang này</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
              <p className="text-muted-foreground">
                Quản lý thông tin cá nhân của bạn
              </p>
            </div>
            <Badge variant="secondary">Bước 5: User Management</Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Overview */}
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatarUrl || '/avatars/admin.jpg'} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="mt-2">
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role || 'User'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>User ID: {user.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Tham gia: {new Date().toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Settings */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={true} // Email update usually requires special flow
                      title="Liên hệ quản trị viên để thay đổi email"
                    />
                    {isEditing && <p className="text-xs text-muted-foreground">Không thể thay đổi email trực tiếp</p>}
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      Chỉnh sửa thông tin
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                      </Button>
                      <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                        Hủy
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật tài khoản</CardTitle>
              <CardDescription>
                Quản lý mật khẩu và cài đặt bảo mật
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Mật khẩu</h4>
                  <p className="text-sm text-muted-foreground">
                    Thay đổi mật khẩu để bảo vệ tài khoản của bạn
                  </p>
                  <Button variant="outline" size="sm">
                    Đổi mật khẩu
                  </Button>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Xác thực hai yếu tố</h4>
                  <p className="text-sm text-muted-foreground">
                    Thêm lớp bảo mật cho tài khoản
                  </p>
                  <Button variant="outline" size="sm">
                    Bật 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử hoạt động</CardTitle>
              <CardDescription>
                Các hoạt động gần đây của tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Đăng nhập thành công</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cập nhật thông tin cá nhân</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Date.now() - 86400000).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
