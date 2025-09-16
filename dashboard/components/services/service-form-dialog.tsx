"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import Image from "next/image"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Service, ServiceType, ServiceFormData } from "@/types/service"

interface ServiceFormDialogProps {
  service?: Partial<Service> | null
  open: boolean
  onOpenChange: (open: boolean) => void
  types: ServiceType[]
  onSubmit: (data: ServiceFormData) => Promise<void>
}

export function ServiceFormDialog({ service, open, onOpenChange, types, onSubmit }: ServiceFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ServiceFormData>(() => {
    const defaultValues: ServiceFormData = {
      name: '',
      description: '',
      price: 0,
      basePriceCents: 0,
      duration: 60,
      isActive: true,
      images: [],
      categoryId: '',
      typeId: '',
      requirements: [],
      includedServices: [],
      features: [],
      isFeatured: false,
      equipmentSpecs: {
        brand: '',
        model: '',
        powerOutput: '',
        frequencyResponse: '',
        warrantyMonths: 0,
        weightKg: 0,
        dimensions: ''
      }
    }

    if (service) {
      return {
        ...defaultValues,
        ...service,
        basePriceCents: service.basePriceCents || 0,
        typeId: service.typeId || ''
      }
    }

    return {
      ...defaultValues,
      typeId: types.length > 0 ? types[0].value : ''
    }
  })

  useEffect(() => {
    if (service) {
      const defaultValues: ServiceFormData = {
        name: service?.name || "",
        description: service?.description || "",
        priceType: service?.priceType || 'FIXED',
        price: service?.price || (service?.basePriceCents ? service.basePriceCents / 100 : 0),
        basePriceCents: service?.basePriceCents || (service?.price ? service.price * 100 : 0),
        minPrice: service?.minPriceDisplay || (service?.minPrice ? service.minPrice / 100 : undefined),
        maxPrice: service?.maxPriceDisplay || (service?.maxPrice ? service.maxPrice / 100 : undefined),
        duration: service?.duration || 60,
        categoryId: service?.categoryId || "",
        typeId: service?.typeId || "",
        requirements: service?.requirements
          ? Array.isArray(service.requirements)
            ? service.requirements
            : String(service.requirements).split('\n').filter(Boolean)
          : [],
        features: service?.features
          ? Array.isArray(service.features)
            ? service.features
            : String(service.features).split('\n').filter(Boolean)
          : [],
        includedServices: service?.includedServices
          ? Array.isArray(service.includedServices)
            ? service.includedServices
            : String(service.includedServices).split('\n').filter(Boolean)
          : [],
        images: service?.images
          ? Array.isArray(service.images)
            ? service.images
            : [String(service.images)]
          : [],
        isActive: service?.isActive ?? true,
        isFeatured: service?.isFeatured ?? false,
        equipmentSpecs: service?.equipmentSpecs || {
          brand: '',
          model: '',
          powerOutput: '',
          frequencyResponse: '',
          connectivity: [],
          warrantyMonths: 0,
          weightKg: 0,
          dimensions: ''
        }
      }
      setFormData(defaultValues)
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        basePriceCents: 0,
        duration: 60,
        categoryId: '',
        typeId: types.length > 0 ? types[0].value : '',
        images: [],
        requirements: [],
        includedServices: [],
        features: [],
        isActive: true,
        isFeatured: false,
        equipmentSpecs: {
          brand: '',
          model: '',
          powerOutput: '',
          frequencyResponse: '',
          connectivity: [],
          warrantyMonths: 0,
          weightKg: 0,
          dimensions: ''
        }
      })
    }
  }, [service, types])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim()
  }

  const handleNameChange = (name: string) => {
    const slug = generateSlug(name)
    setFormData(prev => ({ ...prev, name, slug }))
  }

  const handleArrayInputChange = (field: 'requirements' | 'features' | 'includedServices', value: string, index: number) => {
    const newArray = [...(formData[field] || [])]
    newArray[index] = value
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field: 'requirements' | 'features' | 'includedServices') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }))
  }

  const removeArrayItem = (field: 'requirements' | 'features' | 'includedServices', index: number) => {
    const newArray = [...(formData[field] || [])]
    newArray.splice(index, 1)
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }



  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])]
    newImages.splice(index, 1)
    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on price type
    if (!formData.name || !formData.duration || !formData.typeId) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    if (formData.priceType === 'FIXED' && !formData.price) {
      toast.error("Vui lòng nhập giá dịch vụ")
      return
    }

    if (formData.priceType === 'RANGE' && (!formData.minPrice || !formData.maxPrice)) {
      toast.error("Vui lòng nhập khoảng giá")
      return
    }

    if (formData.priceType === 'RANGE' && formData.minPrice && formData.maxPrice && formData.minPrice > formData.maxPrice) {
      toast.error("Giá từ phải nhỏ hơn giá đến")
      return
    }

    try {
      setLoading(true)

      // Transform data to match backend expectations
      const serviceData: Partial<ServiceFormData> = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || '',
        shortDescription: formData.shortDescription,
        typeId: formData.typeId,
        priceType: formData.priceType || 'FIXED',
        duration: formData.duration,
        images: formData.images || [],
        isActive: formData.isActive ?? true,
        isFeatured: formData.isFeatured ?? false,
        requirements: formData.requirements,
        features: formData.features,
        includedServices: formData.includedServices,
      }

      // Add price fields based on type
      if (formData.priceType === 'RANGE') {
        serviceData.minPrice = Number(formData.minPrice);
        serviceData.maxPrice = Number(formData.maxPrice);
      } else if (formData.priceType === 'FIXED' || !formData.priceType) {
        serviceData.price = Number(formData.price) || Number(formData.basePriceCents / 100);
      }

      await onSubmit(serviceData as ServiceFormData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving service:", error)
      toast.error("Có lỗi xảy ra khi lưu dịch vụ")
    } finally {
      setLoading(false)
    }
  }


  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours} giờ ${mins} phút`
    }
    return `${mins} phút`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {service ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
          </DialogTitle>
          <DialogDescription>
            {service ? 'Cập nhật thông tin dịch vụ' : 'Tạo dịch vụ mới trong hệ thống'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên dịch vụ *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Nhập tên dịch vụ"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Loại dịch vụ</Label>
            <Select
              value={formData.typeId}
              onValueChange={(value) => setFormData({ ...formData, typeId: value })}
              required
            >
              <SelectTrigger className={!formData.typeId ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn loại dịch vụ *" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Nhập mô tả dịch vụ"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Loại giá</Label>
            <Select
              value={formData.priceType || 'FIXED'}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priceType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIXED">Giá cố định</SelectItem>
                <SelectItem value="RANGE">Khoảng giá</SelectItem>
                <SelectItem value="NEGOTIABLE">Giá thương lượng</SelectItem>
                <SelectItem value="CONTACT">Liên hệ báo giá</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.priceType === 'FIXED' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Giá dịch vụ (VNĐ) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || formData.basePriceCents / 100 || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setFormData(prev => ({
                      ...prev,
                      price: value,
                      basePriceCents: Math.round(value * 100)
                    }))
                  }}
                  placeholder="0"
                  min="0"
                  required={formData.priceType === 'FIXED'}
                />
                <p className="text-sm text-muted-foreground">
                  Hiển thị: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(formData.price || formData.basePriceCents / 100 || 0)}
                </p>
              </div>
            </div>
          )}

          {formData.priceType === 'RANGE' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPrice">Giá từ (VNĐ) *</Label>
                <Input
                  id="minPrice"
                  type="number"
                  value={formData.minPrice || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setFormData(prev => ({ ...prev, minPrice: value }))
                  }}
                  placeholder="0"
                  min="0"
                  required={formData.priceType === 'RANGE'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Giá đến (VNĐ) *</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  value={formData.maxPrice || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setFormData(prev => ({ ...prev, maxPrice: value }))
                  }}
                  placeholder="0"
                  min="0"
                  required={formData.priceType === 'RANGE'}
                />
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">
                  Hiển thị: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(formData.minPrice || 0)} - {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(formData.maxPrice || 0)}
                </p>
              </div>
            </div>
          )}

          {formData.priceType === 'NEGOTIABLE' && (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                Giá sẽ được thương lượng trực tiếp với khách hàng
              </p>
            </div>
          )}

          {formData.priceType === 'CONTACT' && (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                Khách hàng cần liên hệ để được báo giá chi tiết
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Thời gian (phút) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  duration: parseInt(e.target.value) || 60
                }))}
                placeholder="60"
                min="1"
                required
              />
              <p className="text-sm text-muted-foreground">
                Hiển thị: {formatDuration(formData.duration)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hình ảnh dịch vụ</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(Array.isArray(formData.images) ? formData.images : []).map((image, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={image}
                    alt={`Hình ảnh ${index + 1}`}
                    width={200}
                    height={128}
                    className="rounded-md w-full h-32 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <ImageUpload
                value={Array.isArray(formData.images) ? formData.images : []}
                onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
                onRemove={(index) => removeImage(index)}
                folder="services"
                maxFiles={5}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Tính năng nổi bật</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addArrayItem('features')}
                className="text-sm text-primary"
              >
                <Plus className="h-4 w-4 mr-1" /> Thêm tính năng
              </Button>
            </div>
            {(Array.isArray(formData.features) ? formData.features : []).map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => handleArrayInputChange('features', e.target.value, index)}
                  placeholder={`Tính năng ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('features', index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Dịch vụ đi kèm</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addArrayItem('includedServices')}
                className="text-sm text-primary"
              >
                <Plus className="h-4 w-4 mr-1" /> Thêm dịch vụ
              </Button>
            </div>
            {formData.includedServices?.map((service, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={service}
                  onChange={(e) => handleArrayInputChange('includedServices', e.target.value, index)}
                  placeholder={`Dịch vụ ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('includedServices', index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Yêu cầu kỹ thuật</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addArrayItem('requirements')}
                className="text-sm text-primary"
              >
                <Plus className="h-4 w-4 mr-1" /> Thêm yêu cầu
              </Button>
            </div>
            {(Array.isArray(formData.requirements) ? formData.requirements : []).map((requirement, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={requirement}
                  onChange={(e) => handleArrayInputChange('requirements', e.target.value, index)}
                  placeholder={`Yêu cầu ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('requirements', index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4"
              aria-label="Dịch vụ hoạt động"
            />
            <Label htmlFor="isActive">Dịch vụ hoạt động</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {service ? 'Cập nhật' : 'Tạo dịch vụ'}
            </Button>
          </DialogFooter>

          {/* SEO Section */}
          <div className="space-y-4 border-t pt-4 mt-6">
            <h3 className="text-lg font-medium">Tối ưu hóa công cụ tìm kiếm (SEO)</h3>

            <div className="space-y-2">
              <Label htmlFor="metaTitle">Tiêu đề SEO (Meta Title)</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle || ''}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="Tối đa 60 ký tự"
                maxLength={60}
              />
              <p className="text-sm text-muted-foreground">
                {formData.metaTitle ? formData.metaTitle.length : 0}/60 ký tự
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Mô tả SEO (Meta Description)</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription || ''}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="Tối đa 160 ký tự"
                maxLength={160}
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                {formData.metaDescription ? formData.metaDescription.length : 0}/160 ký tự
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Từ khóa SEO (Meta Keywords)</Label>
              <Input
                id="metaKeywords"
                value={formData.metaKeywords ? formData.metaKeywords.join(', ') : ''}
                onChange={(e) => {
                  const keywords = e.target.value
                    .split(',')
                    .map(k => k.trim())
                    .filter(Boolean);
                  setFormData({ ...formData, metaKeywords: keywords });
                }}
                placeholder="Từ khóa 1, từ khóa 2, từ khóa 3"
              />
              <p className="text-sm text-muted-foreground">
                Phân cách các từ khóa bằng dấu phẩy
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">URL chính tắc (Canonical URL)</Label>
              <Input
                id="canonicalUrl"
                value={formData.canonicalUrl || ''}
                onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                placeholder="https://example.com/duong-dan"
                type="url"
              />
              <p className="text-sm text-muted-foreground">
                Để trống nếu URL hiện tại là chính tắc
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {service ? 'Cập nhật' : 'Tạo dịch vụ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}