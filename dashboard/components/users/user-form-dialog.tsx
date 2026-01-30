"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: string
  createdAt: string
  address?: string
  dateOfBirth?: string
  gender?: string
  isActive?: boolean
  avatarUrl?: string
  emailNotifications?: boolean
  smsNotifications?: boolean
  promoNotifications?: boolean
}

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSuccess: () => void
}

export function UserFormDialog({ open, onOpenChange, user, onSuccess }: UserFormDialogProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [generatePassword, setGeneratePassword] = useState(false)
  const initialFormData = {
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'USER' as 'USER' | 'ADMIN',
    address: '',
    dateOfBirth: '',
    gender: '',
    isActive: true,
    emailNotifications: true,
    smsNotifications: false,
    promoNotifications: true
  }

  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: '', // Don't populate password for edit
        name: user.name,
        phone: user.phone || '',
        role: user.role as 'USER' | 'ADMIN',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        isActive: user.isActive ?? true,
        emailNotifications: user.emailNotifications ?? true,
        smsNotifications: user.smsNotifications ?? false,
        promoNotifications: user.promoNotifications ?? true
      })
      setGeneratePassword(false)
    } else {
      // Reset to initial values
      setFormData({
        email: '',
        password: '',
        name: '',
        phone: '',
        role: 'USER' as 'USER' | 'ADMIN',
        address: '',
        dateOfBirth: '',
        gender: '',
        isActive: true,
        emailNotifications: true,
        smsNotifications: false,
        promoNotifications: true
      })
      setGeneratePassword(false)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setLoading(true)
    try {
      apiClient.setToken(token)

      if (user) {
        // Update user
        await apiClient.updateUser(user.id, {
          name: formData.name,
          phone: formData.phone || undefined,
          role: formData.role,
          address: formData.address || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
          isActive: formData.isActive,
          emailNotifications: formData.emailNotifications,
          smsNotifications: formData.smsNotifications,
          promoNotifications: formData.promoNotifications
        } as Parameters<typeof apiClient.updateUser>[1])
        toast.success('Cập nhật người dùng thành công')
      } else {
        // Create user
        if (generatePassword) {
          await apiClient.createUser({
            email: formData.email,
            name: formData.name,
            phone: formData.phone || undefined,
            role: formData.role,
            generatePassword: true
          })
        } else {
          await apiClient.createUser({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone || undefined,
            role: formData.role,
            address: formData.address || undefined,
            dateOfBirth: formData.dateOfBirth || undefined,
            gender: formData.gender || undefined,
            isActive: formData.isActive,
            emailNotifications: formData.emailNotifications,
            smsNotifications: formData.smsNotifications,
            promoNotifications: formData.promoNotifications
          } as Parameters<typeof apiClient.createUser>[0])
        }
        toast.success('Tạo người dùng mới thành công')
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save user:', error)
      toast.error('Có lỗi xảy ra khi lưu người dùng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </DialogTitle>
          <DialogDescription>
            {user
              ? 'Cập nhật thông tin người dùng'
              : 'Tạo người dùng mới trong hệ thống'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <ScrollArea className="flex-1 px-6">
            <div className="grid gap-4 py-4 pr-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="col-span-3"
                  required={!user}
                  disabled={!!user}
                />
              </div>
              {!user && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="generatePassword" className="text-right">
                      Tự động
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Checkbox
                        id="generatePassword"
                        checked={generatePassword}
                        onCheckedChange={(checked) => setGeneratePassword(checked === true)}
                      />
                      <Label htmlFor="generatePassword" className="text-sm text-gray-600 font-normal">
                        Tạo mật khẩu ngẫu nhiên và gửi qua email
                      </Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Mật khẩu
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="col-span-3"
                      required={!generatePassword}
                      disabled={generatePassword}
                      placeholder={generatePassword ? "Mật khẩu sẽ được tạo tự động" : "Nhập mật khẩu"}
                    />
                  </div>
                </>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Vai trò
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: 'USER' | 'ADMIN') =>
                    setFormData(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gender" className="text-right">
                  Giới tính
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: string) =>
                    setFormData(prev => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Nam</SelectItem>
                    <SelectItem value="FEMALE">Nữ</SelectItem>
                    <SelectItem value="OTHER">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dateOfBirth" className="text-right">
                  Ngày sinh
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Trạng thái
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked === true }))}
                  />
                  <Label htmlFor="isActive" className="text-sm font-normal">Đang hoạt động</Label>
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4 border-t pt-4">
                <Label className="text-right mt-1">Thông báo</Label>
                <div className="col-span-3 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emailNotifications"
                      checked={formData.emailNotifications}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailNotifications: checked === true }))}
                    />
                    <Label htmlFor="emailNotifications" className="text-sm font-normal">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smsNotifications"
                      checked={formData.smsNotifications}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, smsNotifications: checked === true }))}
                    />
                    <Label htmlFor="smsNotifications" className="text-sm font-normal">SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="promoNotifications"
                      checked={formData.promoNotifications}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, promoNotifications: checked === true }))}
                    />
                    <Label htmlFor="promoNotifications" className="text-sm font-normal">Khuyến mãi</Label>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="px-6 py-4 border-t mt-auto">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : (user ? 'Cập nhật' : 'Tạo')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
