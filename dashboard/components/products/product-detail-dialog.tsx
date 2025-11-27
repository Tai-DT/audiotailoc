"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { Star, Image as ImageIcon, Calendar, Eye, Package, Tag, Settings, Hash, Scale, Ruler, Shield } from "lucide-react"
import Image from "next/image"

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
  inventory?: {
    stock: number;
    reserved: number;
    available: number;
  }
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

interface ProductDetailDialogProps {
  productId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
}

export function ProductDetailDialog({ productId, open, onOpenChange, categories }: ProductDetailDialogProps) {
  const { token } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchProductDetail = useCallback(async () => {
    if (!productId) return

    try {
      setLoading(true)
      apiClient.setToken(token!)
      const response = await apiClient.getProduct(productId)
      setProduct(response.data as Product)
    } catch (error) {
      console.error('Failed to fetch product detail:', error)
    } finally {
      setLoading(false)
    }
  }, [productId, token])

  useEffect(() => {
    if (productId && open && token) {
      fetchProductDetail()
    }
  }, [productId, open, token, fetchProductDetail])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!product) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
            <DialogDescription>
              {loading ? 'Đang tải...' : 'Không tìm thấy sản phẩm'}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  const categoryName = categories.find(cat => cat.id === product.categoryId)?.name || product.categoryId

  // Helper to get stock quantity with backward compatibility
  const getStock = (p: Product) => p.inventory?.stock ?? p.stockQuantity ?? 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Chi tiết sản phẩm
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết của sản phẩm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Images */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Hình ảnh sản phẩm</h4>
            <div className="flex gap-2 overflow-x-auto">
              {(() => {
                // Handle different image data formats safely
                const imageUrls: string[] = []

                // Ưu tiên sử dụng images array trước
                if (Array.isArray(product.images) && product.images.length > 0) {
                  imageUrls.push(...product.images)
                } else if (product.imageUrl) {
                  // Chỉ sử dụng imageUrl khi không có images array
                  imageUrls.push(product.imageUrl)
                }

                return imageUrls.length > 0 ? (
                  imageUrls.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      width={96}
                      height={96}
                      className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
                    />
                  ))
                ) : (
                  <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )
              })()}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{product.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  ID: {product.id}
                </Badge>
                {product.slug && (
                  <Badge variant="outline" className="text-xs">
                    Slug: {product.slug}
                  </Badge>
                )}
              </div>
              {product.shortDescription && (
                <p className="text-muted-foreground mt-2">{product.shortDescription}</p>
              )}
              {product.description && (
                <p className="text-muted-foreground mt-2">{product.description}</p>
              )}
            </div>

            <Separator />

            {/* Price Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Giá hiện tại</label>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(product.priceCents)}</p>
                {product.originalPriceCents && product.originalPriceCents > product.priceCents && (
                  <div className="mt-1">
                    <p className="text-sm text-muted-foreground line-through">
                      {formatCurrency(product.originalPriceCents)}
                    </p>
                    <Badge variant="destructive" className="text-xs mt-1">
                      Giảm {Math.round(((product.originalPriceCents - product.priceCents) / product.originalPriceCents) * 100)}%
                    </Badge>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Danh mục</label>
                <p className="text-lg">{categoryName}</p>
              </div>
            </div>

            {/* Basic Product Details */}
            <div className="grid grid-cols-2 gap-4">
              {product.brand && (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Thương hiệu</label>
                    <p className="font-medium">{product.brand}</p>
                  </div>
                </div>
              )}
              {product.model && (
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Model</label>
                    <p className="font-medium">{product.model}</p>
                  </div>
                </div>
              )}
              {product.sku && (
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">SKU</label>
                    <p className="font-medium font-mono">{product.sku}</p>
                  </div>
                </div>
              )}
              {(product.inventory?.stock !== undefined || product.stockQuantity !== undefined) && (
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tồn kho</label>
                    <div className="flex items-center gap-2">
                      <p className={`font-medium ${
                        getStock(product) === 0 ? 'text-red-600' :
                        getStock(product) < 10 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getStock(product)}
                      </p>
                      {getStock(product) === 0 && (
                        <Badge variant="destructive" className="text-xs">Hết hàng</Badge>
                      )}
                      {getStock(product) > 0 && getStock(product) < 10 && (
                        <Badge variant="secondary" className="text-xs">Sắp hết</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dimensions & Weight */}
            {(product.weight || product.dimensions) && (
              <div className="grid grid-cols-2 gap-4">
                {product.weight && (
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Trọng lượng</label>
                      <p className="font-medium">{product.weight} kg</p>
                    </div>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Kích thước</label>
                      <p className="font-medium">{product.dimensions}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Warranty & Features */}
            {(product.warranty || product.features) && (
              <div className="space-y-3">
                {product.warranty && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Bảo hành</label>
                      <p className="font-medium">{product.warranty}</p>
                    </div>
                  </div>
                )}
                {product.features && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tính năng</label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <p className="whitespace-pre-line">{product.features}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order Quantities */}
            {(product.minOrderQuantity || product.maxOrderQuantity) && (
              <div className="grid grid-cols-2 gap-4">
                {product.minOrderQuantity && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Số lượng tối thiểu</label>
                      <p className="font-medium">{product.minOrderQuantity}</p>
                    </div>
                  </div>
                )}
                {product.maxOrderQuantity && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Số lượng tối đa</label>
                      <p className="font-medium">{product.maxOrderQuantity}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {product.tags && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.tags.split(',').map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={product.isActive ? "default" : "secondary"}>
                {product.isActive ? 'Hoạt động' : 'Không hoạt động'}
              </Badge>
              {product.featured && (
                <Badge variant="default">
                  <Star className="w-3 h-3 mr-1" />
                  Nổi bật
                </Badge>
              )}
              {product.isDeleted && (
                <Badge variant="destructive">
                  Đã xóa
                </Badge>
              )}
            </div>

            <Separator />

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Lượt xem:</span>
                <span className="font-medium">{product.viewCount || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Trạng thái:</span>
                <span className="font-medium">
                  {product.isDeleted ? 'Đã xóa' : product.isActive ? 'Hoạt động' : 'Tạm dừng'}
                </span>
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Ngày tạo:</span>
                <span className="font-medium">{formatDate(product.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Cập nhật:</span>
                <span className="font-medium">{formatDate(product.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-lg font-medium flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Thông số kỹ thuật
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 px-3 border rounded-md bg-muted/30">
                      <span className="font-medium text-sm">{key}:</span>
                      <span className="text-sm text-right">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SEO Information */}
          {(product.metaTitle || product.metaDescription || product.metaKeywords || product.canonicalUrl) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-lg font-medium flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Thông tin SEO
                </h4>
                <div className="space-y-3">
                  {product.metaTitle && (
                    <div className="p-3 border rounded-md bg-muted/30">
                      <label className="text-sm font-medium text-muted-foreground">Meta Title</label>
                      <p className="text-sm mt-1 font-medium">{product.metaTitle}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Độ dài: {product.metaTitle.length}/60 ký tự
                      </p>
                    </div>
                  )}
                  {product.metaDescription && (
                    <div className="p-3 border rounded-md bg-muted/30">
                      <label className="text-sm font-medium text-muted-foreground">Meta Description</label>
                      <p className="text-sm mt-1">{product.metaDescription}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Độ dài: {product.metaDescription.length}/160 ký tự
                      </p>
                    </div>
                  )}
                  {product.metaKeywords && (
                    <div className="p-3 border rounded-md bg-muted/30">
                      <label className="text-sm font-medium text-muted-foreground">Meta Keywords</label>
                      <p className="text-sm mt-1">{product.metaKeywords}</p>
                    </div>
                  )}
                  {product.canonicalUrl && (
                    <div className="p-3 border rounded-md bg-muted/30">
                      <label className="text-sm font-medium text-muted-foreground">Canonical URL</label>
                      <p className="text-sm mt-1 font-mono break-all">{product.canonicalUrl}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
