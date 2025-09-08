"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient, CreateProductData, UpdateProductData } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { ImageUpload } from "@/components/ui/image-upload"
import { Loader2, Wand2, ChevronUp, ChevronDown } from "lucide-react"

interface Product {
  id: string
  slug?: string
  name: string
  description?: string | null
  shortDescription?: string | null
  priceCents: number
  originalPriceCents?: number | null
  imageUrl?: string | null
  images?: string[]
  categoryId?: string | null
  brand?: string | null
  model?: string | null
  sku?: string | null
  specifications?: Record<string, unknown>
  features?: string | null
  warranty?: string | null
  weight?: number | null
  dimensions?: string | null
  stockQuantity?: number
  minOrderQuantity?: number
  maxOrderQuantity?: number | null
  tags?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords?: string | null
  canonicalUrl?: string | null
  featured?: boolean
  isActive?: boolean
  isDeleted?: boolean
  viewCount?: number
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFormDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  onSuccess: () => void
}

interface ProductFormData {
  name: string
  description: string
  shortDescription: string
  priceCents: number
  originalPriceCents: number
  categoryId: string
  images: string[]
  brand: string
  model: string
  sku: string
  specifications: Record<string, unknown>
  features: string
  warranty: string
  weight: number
  dimensions: string
  stockQuantity: number
  minOrderQuantity: number
  maxOrderQuantity: number
  tags: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  canonicalUrl: string
  featured: boolean
  isActive: boolean
}

export function ProductFormDialog({ product, open, onOpenChange, categories, onSuccess }: ProductFormDialogProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    priceCents: 0,
    originalPriceCents: 0,
    categoryId: '',
    images: [],
    brand: '',
    model: '',
    sku: '',
    specifications: {} as Record<string, unknown>,
    features: '',
    warranty: '',
    weight: 0,
    dimensions: '',
    stockQuantity: 0,
    minOrderQuantity: 1,
    maxOrderQuantity: 0,
    tags: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    featured: false,
    isActive: true
  })

  // SEO state
  const [seoData, setSeoData] = useState({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    slug: ''
  })

  const [showSEOSection, setShowSEOSection] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        priceCents: product.priceCents || 0,
        originalPriceCents: product.originalPriceCents || 0,
        categoryId: product.categoryId || '',
        images: Array.isArray(product.images) ? product.images : (product.imageUrl ? [product.imageUrl] : []),
        brand: product.brand || '',
        model: product.model || '',
        sku: product.sku || '',
        specifications: product.specifications || {},
        features: product.features || '',
        warranty: product.warranty || '',
        weight: product.weight || 0,
        dimensions: product.dimensions || '',
        stockQuantity: product.stockQuantity || 0,
        minOrderQuantity: product.minOrderQuantity || 1,
        maxOrderQuantity: product.maxOrderQuantity || 0,
        tags: product.tags || '',
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        metaKeywords: product.metaKeywords || '',
        canonicalUrl: product.canonicalUrl || '',
        featured: product.featured || false,
        isActive: product.isActive !== undefined ? product.isActive : true
      })

      // Sync SEO data
      setSeoData({
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        metaKeywords: product.metaKeywords || '',
        canonicalUrl: product.canonicalUrl || '',
        slug: product.slug || ''
      })
    } else {
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        priceCents: 0,
        originalPriceCents: 0,
        categoryId: '',
        images: [],
        brand: '',
        model: '',
        sku: '',
        specifications: {},
        features: '',
        warranty: '',
        weight: 0,
        dimensions: '',
        stockQuantity: 0,
        minOrderQuantity: 1,
        maxOrderQuantity: 0,
        tags: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        canonicalUrl: '',
        featured: false,
        isActive: true
      })

      // Reset SEO data
      setSeoData({
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        canonicalUrl: '',
        slug: ''
      })
    }
  }, [product])

  // Auto-generate SEO data from product name
  const generateSEOData = () => {
    const baseSlug = formData.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const newSeoData = {
      metaTitle: formData.name ? `${formData.name} - AudioTailoc` : '',
      metaDescription: formData.shortDescription || formData.description?.substring(0, 160) || '',
      metaKeywords: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).join(', ') : '',
      canonicalUrl: formData.canonicalUrl || `/products/${baseSlug}`,
      slug: baseSlug
    }

    setSeoData(newSeoData)
    setFormData(prev => ({
      ...prev,
      metaTitle: newSeoData.metaTitle,
      metaDescription: newSeoData.metaDescription,
      metaKeywords: newSeoData.metaKeywords,
      canonicalUrl: newSeoData.canonicalUrl
    }))
  }

  // Update form data when SEO data changes
  const updateFormDataFromSEO = (newSeoData: typeof seoData) => {
    setFormData(prev => ({
      ...prev,
      metaTitle: newSeoData.metaTitle,
      metaDescription: newSeoData.metaDescription,
      metaKeywords: newSeoData.metaKeywords,
      canonicalUrl: newSeoData.canonicalUrl
    }))
  }

  // Handle SEO data changes
  const handleSEOChange = (field: keyof typeof seoData, value: string) => {
    const newSeoData = { ...seoData, [field]: value }
    setSeoData(newSeoData)
    updateFormDataFromSEO(newSeoData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) return

    try {
      setLoading(true)
      apiClient.setToken(token)

      if (product) {
        // Update product
        const updateData: UpdateProductData = {
          name: formData.name,
          description: formData.description,
          priceCents: formData.priceCents,
          originalPriceCents: formData.originalPriceCents || undefined,
          ...(formData.categoryId && formData.categoryId.trim() !== '' && { categoryId: formData.categoryId }),
          images: formData.images,
          brand: formData.brand || undefined,
          model: formData.model || undefined,
          sku: formData.sku || undefined,
          specifications: formData.specifications,
          features: formData.features || undefined,
          warranty: formData.warranty || undefined,
          weight: formData.weight || undefined,
          dimensions: formData.dimensions || undefined,
          stockQuantity: formData.stockQuantity,
          minOrderQuantity: formData.minOrderQuantity,
          maxOrderQuantity: formData.maxOrderQuantity || undefined,
          tags: formData.tags || undefined,
          metaTitle: formData.metaTitle || undefined,
          metaDescription: formData.metaDescription || undefined,
          metaKeywords: formData.metaKeywords || undefined,
          canonicalUrl: formData.canonicalUrl || undefined,
          featured: formData.featured,
          isActive: formData.isActive
        }
        await apiClient.updateProduct(product.id, updateData)
      } else {
        // Create product
        const createData = {
          name: formData.name,
          description: formData.description,
          priceCents: formData.priceCents,
          originalPriceCents: formData.originalPriceCents || undefined,
          images: formData.images,
          brand: formData.brand || undefined,
          model: formData.model || undefined,
          sku: formData.sku || undefined,
          specifications: formData.specifications,
          features: formData.features || undefined,
          warranty: formData.warranty || undefined,
          weight: formData.weight || undefined,
          dimensions: formData.dimensions || undefined,
          stockQuantity: formData.stockQuantity,
          minOrderQuantity: formData.minOrderQuantity,
          maxOrderQuantity: formData.maxOrderQuantity || undefined,
          tags: formData.tags || undefined,
          metaTitle: formData.metaTitle || undefined,
          metaDescription: formData.metaDescription || undefined,
          metaKeywords: formData.metaKeywords || undefined,
          canonicalUrl: formData.canonicalUrl || undefined,
          featured: formData.featured,
          isActive: formData.isActive
        } as Omit<CreateProductData, 'categoryId'>

        // Only add categoryId if it has a valid value
        const finalCreateData = formData.categoryId && formData.categoryId.trim() !== ''
          ? { ...createData, categoryId: formData.categoryId }
          : createData;
        await apiClient.createProduct(finalCreateData)
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save product:', error)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </DialogTitle>
          <DialogDescription>
            {product ? 'Cập nhật thông tin sản phẩm' : 'Tạo sản phẩm mới trong hệ thống'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Danh mục *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
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
              placeholder="Nhập mô tả sản phẩm"
              rows={3}
            />
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Thương hiệu</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="Nhập thương hiệu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                placeholder="Nhập model"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="Nhập SKU"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Tồn kho</Label>
              <Input
                id="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  stockQuantity: parseInt(e.target.value) || 0
                }))}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.priceCents / 100}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  priceCents: parseInt(e.target.value) * 100 || 0
                }))}
                placeholder="0"
                min="0"
                required
              />
              <p className="text-sm text-muted-foreground">
                Hiển thị: {formatCurrency(formData.priceCents)}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Giá gốc (VNĐ)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPriceCents / 100}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  originalPriceCents: parseInt(e.target.value) * 100 || 0
                }))}
                placeholder="0"
                min="0"
              />
              {formData.originalPriceCents > 0 && (
                <p className="text-sm text-muted-foreground">
                  Hiển thị: {formatCurrency(formData.originalPriceCents)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hình ảnh sản phẩm</Label>
            <ImageUpload
              label="Hình ảnh sản phẩm"
              value={Array.isArray(formData.images) ? formData.images : []}
              onChange={(urls) => {
                setFormData(prev => ({
                  ...prev,
                  images: urls
                }))
              }}
              onRemove={(index) => {
                const newImages = [...(formData.images || [])]
                newImages.splice(index, 1)
                setFormData(prev => ({
                  ...prev,
                  images: newImages
                }))
              }}
              placeholder="Kéo thả hình ảnh hoặc nhấn để chọn"
              folder="products"
              width={300}
              height={200}
              maxSize={10} // 10MB per file
              maxFiles={10} // Max 10 files
            />
            <p className="text-sm text-muted-foreground">
              Hỗ trợ: JPG, PNG, WEBP (tối đa 10MB/ảnh)
            </p>
            {formData.images?.length > 1 && (
              <div className="text-sm text-muted-foreground">
                Đã chọn {formData.images.length} hình ảnh
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Trọng lượng (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  weight: parseFloat(e.target.value) || 0
                }))}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dimensions">Kích thước</Label>
              <Input
                id="dimensions"
                value={formData.dimensions}
                onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                placeholder="Ví dụ: 10x20x5 cm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Tính năng</Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
              placeholder="Nhập các tính năng nổi bật"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specifications">Thông số kỹ thuật (JSON)</Label>
            <Textarea
              id="specifications"
              value={formData.specifications ? JSON.stringify(formData.specifications, null, 2) : ''}
              onChange={(e) => {
                try {
                  const parsed = e.target.value ? JSON.parse(e.target.value) : {};
                  setFormData(prev => ({ ...prev, specifications: parsed }));
                } catch (error) {
                  // If JSON is invalid, keep current specifications
                  console.warn('Invalid JSON format for specifications');
                }
              }}
              placeholder={`Ví dụ: {"Driver Size": "40mm", "Frequency Response": "20Hz - 20kHz"}`}
              rows={4}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Nhập thông số kỹ thuật dưới dạng JSON
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="warranty">Bảo hành</Label>
            <Input
              id="warranty"
              value={formData.warranty}
              onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
              placeholder="Ví dụ: 12 tháng"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.priceCents / 100}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  priceCents: parseInt(e.target.value) * 100 || 0
                }))}
                placeholder="0"
                min="0"
                required
              />
              <p className="text-sm text-muted-foreground">
                Hiển thị: {formatCurrency(formData.priceCents)}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Giá gốc (VNĐ)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPriceCents / 100}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  originalPriceCents: parseInt(e.target.value) * 100 || 0
                }))}
                placeholder="0"
                min="0"
              />
              {formData.originalPriceCents > 0 && (
                <p className="text-sm text-muted-foreground">
                  Hiển thị: {formatCurrency(formData.originalPriceCents)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4"
                aria-label="Sản phẩm nổi bật"
              />
              <Label htmlFor="featured">Sản phẩm nổi bật</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4"
                aria-label="Hoạt động"
              />
              <Label htmlFor="isActive">Hoạt động</Label>
            </div>
          </div>

          {/* SEO Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">SEO Optimization</h3>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateSEOData}
                  disabled={!formData.name}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Tự động tạo
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSEOSection(!showSEOSection)}
                >
                  {showSEOSection ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {showSEOSection ? 'Ẩn' : 'Hiện'} SEO
                </Button>
              </div>
            </div>

            {showSEOSection && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={seoData.metaTitle}
                      onChange={(e) => handleSEOChange('metaTitle', e.target.value)}
                      placeholder="Tiêu đề hiển thị trên Google"
                      maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground">
                      {seoData.metaTitle.length}/60 ký tự
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={seoData.slug}
                      onChange={(e) => handleSEOChange('slug', e.target.value)}
                      placeholder="duong-dan-san-pham"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={seoData.metaDescription}
                    onChange={(e) => handleSEOChange('metaDescription', e.target.value)}
                    placeholder="Mô tả ngắn gọn về sản phẩm hiển thị trên Google"
                    rows={2}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    {seoData.metaDescription.length}/160 ký tự
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={seoData.metaKeywords}
                    onChange={(e) => handleSEOChange('metaKeywords', e.target.value)}
                    placeholder="từ khóa, cách nhau bằng dấu phẩy"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonicalUrl">Canonical URL</Label>
                  <Input
                    id="canonicalUrl"
                    value={seoData.canonicalUrl}
                    onChange={(e) => handleSEOChange('canonicalUrl', e.target.value)}
                    placeholder="https://yourdomain.com/products/slug"
                  />
                </div>

                {/* SEO Preview */}
                {seoData.metaTitle && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="text-sm font-medium mb-2">Preview trên Google:</h4>
                    <div className="space-y-1">
                      <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {seoData.metaTitle}
                      </div>
                      <div className="text-green-700 text-sm">
                        {seoData.canonicalUrl || 'https://yourdomain.com/products/' + seoData.slug}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {seoData.metaDescription}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
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
              {product ? 'Cập nhật' : 'Tạo sản phẩm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
