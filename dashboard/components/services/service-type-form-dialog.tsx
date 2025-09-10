"use client"

import { useState, useEffect } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Palette, Wrench, Eye } from "lucide-react"
import * as LucideIcons from "lucide-react"

const serviceTypeSchema = z.object({
  name: z.string().min(1, "Tên loại dịch vụ là bắt buộc").max(100, "Tên không được vượt quá 100 ký tự"),
  description: z.string().max(500, "Mô tả không được vượt quá 500 ký tự").optional(),
  icon: z.string().max(50, "Tên icon không được vượt quá 50 ký tự").optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Màu sắc phải là mã hex hợp lệ (ví dụ: #3b82f6)").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(0, "Thứ tự phải lớn hơn hoặc bằng 0").max(999, "Thứ tự không được vượt quá 999").default(0),
})

type ServiceTypeFormData = z.infer<typeof serviceTypeSchema>

interface ServiceTypeFormDialogProps {
  serviceType?: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ServiceTypeFormData) => Promise<void>
}

export function ServiceTypeFormDialog({
  serviceType,
  open,
  onOpenChange,
  onSubmit,
}: ServiceTypeFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ServiceTypeFormData>({
    resolver: zodResolver(serviceTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      color: "",
      isActive: true,
      sortOrder: 0,
    },
  })

  const isEditing = !!serviceType

  // Get icon component dynamically
  const getIconComponent = (iconName: string) => {
    if (!iconName) return Wrench
    const IconComponent = (LucideIcons as any)[iconName]
    return IconComponent || Wrench
  }

  useEffect(() => {
    if (serviceType) {
      form.reset({
        name: serviceType.name || "",
        description: serviceType.description || "",
        icon: serviceType.icon || "",
        color: serviceType.color || "",
        isActive: serviceType.isActive ?? true,
        sortOrder: serviceType.sortOrder || 0,
      })
    } else {
      form.reset({
        name: "",
        description: "",
        icon: "",
        color: "",
        isActive: true,
        sortOrder: 0,
      })
    }
  }, [serviceType, form])

  const handleSubmit = async (data: ServiceTypeFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      if (!isEditing) {
        form.reset()
      }
    } catch (error) {
      // Error is handled by the parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa loại dịch vụ" : "Thêm loại dịch vụ mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin loại dịch vụ"
              : "Tạo loại dịch vụ mới trong hệ thống"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên loại dịch vụ *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên loại dịch vụ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả cho loại dịch vụ"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: wrench, cog" {...field} />
                    </FormControl>
                    <FormDescription>
                      Tên icon từ Lucide React
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Màu sắc</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="Ví dụ: #3b82f6" {...field} />
                        {field.value && (
                          <div
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: field.value }}
                            title={field.value}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Mã màu hex (ví dụ: #3b82f6)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Preview Section */}
            {(form.watch("icon") || form.watch("color") || form.watch("name")) && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">Xem trước</span>
                </div>
                <div className="flex items-center gap-3">
                  {form.watch("icon") && (
                    <div
                      className="p-2 rounded"
                      style={{ backgroundColor: form.watch("color") || "#3b82f6" }}
                    >
                      {React.createElement(getIconComponent(form.watch("icon")), {
                        className: "h-5 w-5 text-white"
                      })}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{form.watch("name") || "Tên loại dịch vụ"}</div>
                    {form.watch("description") && (
                      <div className="text-sm text-gray-600">{form.watch("description")}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự sắp xếp</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Trạng thái hoạt động
                      </FormLabel>
                      <FormDescription>
                        Loại dịch vụ có hiển thị không
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}