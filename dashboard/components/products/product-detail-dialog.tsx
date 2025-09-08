"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { Star, Image as ImageIcon, Calendar, Eye, Package } from "lucide-react"
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

                if (Array.isArray(product.images) && product.images.length > 0) {
                  imageUrls.push(...product.images)
                } else if (product.imageUrl) {
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
              {product.shortDescription && (
                <p className="text-muted-foreground mt-1">{product.shortDescription}</p>
              )}
              {product.description && (
                <p className="text-muted-foreground mt-2">{product.description}</p>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Giá</label>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(product.priceCents)}</p>
                {product.originalPriceCents && product.originalPriceCents > product.priceCents && (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product.originalPriceCents)}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Danh mục</label>
                <p className="text-lg">{categoryName}</p>
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4">
              {product.brand && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Thương hiệu</label>
                  <p>{product.brand}</p>
                </div>
              )}
              {product.model && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Model</label>
                  <p>{product.model}</p>
                </div>
              )}
              {product.sku && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">SKU</label>
                  <p>{product.sku}</p>
                </div>
              )}
              {product.stockQuantity !== undefined && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tồn kho</label>
                  <p>{product.stockQuantity}</p>
                </div>
              )}
            </div>

            {/* Dimensions & Weight */}
            {(product.weight || product.dimensions) && (
              <div className="grid grid-cols-2 gap-4">
                {product.weight && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Trọng lượng</label>
                    <p>{product.weight} kg</p>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Kích thước</label>
                    <p>{product.dimensions}</p>
                  </div>
                )}
              </div>
            )}

            {/* Warranty & Features */}
            {(product.warranty || product.features) && (
              <div className="space-y-2">
                {product.warranty && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Bảo hành</label>
                    <p>{product.warranty}</p>
                  </div>
                )}
                {product.features && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tính năng</label>
                    <p>{product.features}</p>
                  </div>
                )}
              </div>
            )}

            {/* Order Quantities */}
            {(product.minOrderQuantity || product.maxOrderQuantity) && (
              <div className="grid grid-cols-2 gap-4">
                {product.minOrderQuantity && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Số lượng tối thiểu</label>
                    <p>{product.minOrderQuantity}</p>
                  </div>
                )}
                {product.maxOrderQuantity && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Số lượng tối đa</label>
                    <p>{product.maxOrderQuantity}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {product.tags && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tags</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.tags.split(',').map((tag, index) => (
                    <Badge key={index} variant="outline">{tag.trim()}</Badge>
                  ))}
                </div>
              </div>
            )}

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
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Lượt xem:</span>
                <span className="font-medium">{product.viewCount || 0}</span>
              </div>
              {product.slug && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Slug:</span>
                  <span className="font-medium">{product.slug}</span>
                </div>
              )}
            </div>

            <Separator />

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
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Thông số kỹ thuật</h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}:</span>
                      <span>{String(value)}</span>
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
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Thông tin SEO</h4>
                <div className="space-y-2">
                  {product.metaTitle && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Meta Title</label>
                      <p className="text-sm">{product.metaTitle}</p>
                    </div>
                  )}
                  {product.metaDescription && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Meta Description</label>
                      <p className="text-sm">{product.metaDescription}</p>
                    </div>
                  )}
                  {product.metaKeywords && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Meta Keywords</label>
                      <p className="text-sm">{product.metaKeywords}</p>
                    </div>
                  )}
                  {product.canonicalUrl && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Canonical URL</label>
                      <p className="text-sm">{product.canonicalUrl}</p>
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
