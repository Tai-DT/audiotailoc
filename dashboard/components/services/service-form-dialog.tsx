"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { ImageUpload } from "@/components/ui/image-upload"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Service, ServiceCategory, ServiceType, ServiceFormData, AudioEquipmentSpecs } from "@/types/service"

interface ServiceFormDialogProps {
  service?: Partial<Service> | null
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: ServiceCategory[]
  types: ServiceType[]
  onSubmit: (data: ServiceFormData) => Promise<void>
}

export function ServiceFormDialog({ service, open, onOpenChange, categories, types, onSubmit }: ServiceFormDialogProps) {
  const { token } = useAuth()
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
        categoryId: service.categoryId || '',
        typeId: service.typeId || ''
      }
    }

    return {
      ...defaultValues,
      categoryId: categories.length > 0 ? categories[0].value : '',
      typeId: types.length > 0 ? types[0].value : ''
    }
  })

  useEffect(() => {
    if (service) {
      const defaultValues: ServiceFormData = {
        name: service?.name || "",
        description: service?.description || "",
        price: service?.price || 0,
        basePriceCents: service?.basePriceCents || 0,
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
        categoryId: categories.length > 0 ? categories[0].value : '',
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
  }, [service])

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

  const handleEquipmentSpecsChange = (field: keyof AudioEquipmentSpecs, value: any) => {
    setFormData(prev => ({
      ...prev,
      equipmentSpecs: {
        ...prev.equipmentSpecs,
        [field]: value
      }
    }))
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
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.price || !formData.duration || !formData.categoryId || !formData.typeId) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }
    
    try {
      setLoading(true)
      
      // Transform data to match backend expectations
      const serviceData = {
        ...formData,
        basePriceCents: formData.price,
        estimatedDuration: formData.duration,
        // Use the first image URL if available
        imageUrl: formData.images?.[0] || '',
        // Map to the correct field names expected by the backend
        categoryId: formData.categoryId,
        typeId: formData.typeId,
        // Remove fields that shouldn't be sent to the backend
        price: undefined,
        images: undefined
      }
      
      await onSubmit(serviceData as any)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving service:", error)
      toast.error("Có lỗi xảy ra khi lưu dịch vụ")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount / 100)
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                required
              >
                <SelectTrigger className={!formData.categoryId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Chọn danh mục *" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Giá dịch vụ (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.basePriceCents / 100}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  basePriceCents: parseInt(e.target.value) * 100 || 0
                }))}
                placeholder="0"
                min="0"
                required
              />
              <p className="text-sm text-muted-foreground">
                Hiển thị: {formatCurrency(formData.basePriceCents)}
              </p>
            </div>
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
                  <img 
                    src={image} 
                    alt={`Hình ảnh ${index + 1}`} 
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
          
          {/* SEO Section */}
          <div className="space-y-4 border-t pt-4 mt-6">
            <h3 className="text-lg font-medium">Tối ưu hóa công cụ tìm kiếm (SEO)</h3>
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