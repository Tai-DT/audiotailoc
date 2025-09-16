"use client"

import { useState, useEffect } from "react"
import { Banner, CreateBannerDto, UpdateBannerDto } from "@/types/banner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/ui/image-upload"
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

interface BannerFormProps {
  banner: Banner | null
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateBannerDto | UpdateBannerDto) => void
}

const pages = [
  { value: "home", label: "Trang chủ" },
  { value: "about", label: "Giới thiệu" },
  { value: "services", label: "Dịch vụ" },
  { value: "products", label: "Sản phẩm" },
  { value: "contact", label: "Liên hệ" },
]

export function BannerForm({ banner, open, onClose, onSubmit }: BannerFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    mobileImageUrl: "",
    images: [] as string[], // Array for desktop images
    mobileImages: [] as string[], // Array for mobile images
    linkUrl: "",
    buttonLabel: "",
    page: "home",
    position: 0,
    isActive: true,
  })

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || "",
        subtitle: banner.subtitle || "",
        description: banner.description || "",
        imageUrl: banner.imageUrl || "",
        mobileImageUrl: banner.mobileImageUrl || "",
        images: banner.imageUrl ? [banner.imageUrl] : [],
        mobileImages: banner.mobileImageUrl ? [banner.mobileImageUrl] : [],
        linkUrl: banner.linkUrl || "",
        buttonLabel: banner.buttonLabel || "",
        page: banner.page || "home",
        position: banner.position || 0,
        isActive: banner.isActive ?? true,
      })
    } else {
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        imageUrl: "",
        mobileImageUrl: "",
        images: [],
        mobileImages: [],
        linkUrl: "",
        buttonLabel: "",
        page: "home",
        position: 0,
        isActive: true,
      })
    }
  }, [banner])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Convert arrays back to single URLs for backend compatibility
    const submitData = {
      ...formData,
      imageUrl: formData.images.length > 0 ? formData.images[0] : formData.imageUrl,
      mobileImageUrl: formData.mobileImages.length > 0 ? formData.mobileImages[0] : formData.mobileImageUrl,
    }
    onSubmit(submitData)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{banner ? "Chỉnh sửa Banner" : "Thêm Banner mới"}</DialogTitle>
          <DialogDescription>
            {banner ? "Cập nhật thông tin banner" : "Tạo banner mới cho website"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Tiêu đề *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subtitle" className="text-right">
                Phụ đề
              </Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Hình ảnh desktop *
              </Label>
              <div className="col-span-3">
                <ImageUpload
                  value={formData.images}
                  onChange={(urls) => {
                    setFormData(prev => ({ ...prev, images: urls }))
                    if (urls.length > 0) {
                      setFormData(prev => ({ ...prev, imageUrl: urls[0] }))
                    }
                  }}
                  folder="banners/desktop"
                  maxFiles={1}
                  label=""
                  placeholder="Chọn hình ảnh desktop cho banner"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Hình ảnh mobile
              </Label>
              <div className="col-span-3">
                <ImageUpload
                  value={formData.mobileImages}
                  onChange={(urls) => {
                    setFormData(prev => ({ ...prev, mobileImages: urls }))
                    if (urls.length > 0) {
                      setFormData(prev => ({ ...prev, mobileImageUrl: urls[0] }))
                    }
                  }}
                  folder="banners/mobile"
                  maxFiles={1}
                  label=""
                  placeholder="Chọn hình ảnh mobile cho banner"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="linkUrl" className="text-right">
                Link URL
              </Label>
              <Input
                id="linkUrl"
                type="url"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="buttonLabel" className="text-right">
                Nhãn nút
              </Label>
              <Input
                id="buttonLabel"
                value={formData.buttonLabel}
                onChange={(e) => setFormData({ ...formData, buttonLabel: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="page" className="text-right">
                Trang hiển thị
              </Label>
              <Select
                value={formData.page}
                onValueChange={(value) => setFormData({ ...formData, page: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pages.map((page) => (
                    <SelectItem key={page.value} value={page.value}>
                      {page.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Vị trí
              </Label>
              <Input
                id="position"
                type="number"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Kích hoạt
              </Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {banner ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
