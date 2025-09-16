"use client"

import { useState, useEffect } from "react"
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

interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: string
  createdAt: string
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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'USER' as 'USER' | 'ADMIN'
  })

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: '', // Don't populate password for edit
        name: user.name,
        phone: user.phone || '',
        role: user.role as 'USER' | 'ADMIN'
      })
      setGeneratePassword(false)
    } else {
      setFormData({
        email: '',
        password: '',
        name: '',
        phone: '',
        role: 'USER'
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
          role: formData.role
        })
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
            role: formData.role
          })
        }
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save user:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
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
                    Tự động tạo mật khẩu
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <input
                      id="generatePassword"
                      type="checkbox"
                      checked={generatePassword}
                      onChange={(e) => setGeneratePassword(e.target.checked)}
                      className="h-4 w-4"
                      aria-label="Tự động tạo mật khẩu"
                    />
                    <Label htmlFor="generatePassword" className="text-sm text-gray-600">
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
          </div>
          <DialogFooter>
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
