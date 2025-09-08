"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import CloudinaryService from "@/lib/cloudinary"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import {
  Package,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  Image as ImageIcon,
  Filter,
  Download,
  Upload,
  CheckSquare,
  Square,
  Power,
  PowerOff,
  AlertTriangle,
  TrendingUp
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProductDetailDialog } from "@/components/products/product-detail-dialog"
import { ProductFormDialog } from "@/components/products/product-form-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Product {
  id: string
  slug: string
  name: string
  description: string
  priceCents: number
  originalPriceCents?: number
  images?: string[]
  imageUrl?: string // For backward compatibility
  categoryId?: string
  brand?: string
  model?: string
  sku?: string
  stockQuantity?: number
  featured: boolean
  isActive: boolean
  isDeleted: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductsResponse {
  items: Product[]
  total: number
  page: number
  pageSize: number
}

export default function ProductsPage() {
  const { token } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [pageSize] = useState(10)
  const [categories, setCategories] = useState<Category[]>([])
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showFormDialog, setShowFormDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiClient.getCategories()
      const data = response.data as Category[]
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiClient.getProducts({
        page: currentPage,
        limit: pageSize,
        category: categoryFilter === "all" ? undefined : categoryFilter || undefined,
        search: searchTerm || undefined
      })
      const data = response.data as ProductsResponse
      setProducts(data.items)
      setTotalProducts(data.total)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, categoryFilter, searchTerm])

  useEffect(() => {
    if (token) {
      apiClient.setToken(token)
      fetchProducts()
      fetchCategories()
    }
  }, [token, currentPage, searchTerm, categoryFilter, fetchProducts, fetchCategories])

  const handleDeleteProduct = async (productId: string) => {
    try {
      await apiClient.deleteProduct(productId)
      setDeleteProductId(null)
      fetchProducts() // Refresh the list
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowDetailDialog(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowFormDialog(true)
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowFormDialog(true)
  }

  const handleFormSuccess = () => {
    setShowFormDialog(false)
    setEditingProduct(null)
    fetchProducts() // Refresh the list
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount / 100) // Convert cents to VND
  }

  const totalPages = Math.ceil(totalProducts / pageSize)

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h2>
              <p className="text-muted-foreground">
                Quản lý tất cả sản phẩm trong hệ thống
              </p>
            </div>
            <Button onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Trong hệ thống
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
                <Power className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sản phẩm hiển thị
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sản phẩm nổi bật</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {products.filter(p => p.featured).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Được spotlight
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {products.filter(p => (p.stockQuantity || 0) === 0).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cần nhập hàng
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách sản phẩm</CardTitle>
              <CardDescription>
                Tìm kiếm và quản lý sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="featured">Nổi bật</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Bộ lọc
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Xuất Excel
                </Button>
              </div>

              {/* Bulk Actions */}
              {selectedProducts.size > 0 && (
                <div className="flex items-center space-x-2 mb-4 p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">
                    Đã chọn {selectedProducts.size} sản phẩm
                  </span>
                  <Button variant="outline" size="sm">
                    <Power className="mr-2 h-4 w-4" />
                    Bật
                  </Button>
                  <Button variant="outline" size="sm">
                    <PowerOff className="mr-2 h-4 w-4" />
                    Tắt
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProducts(new Set())}
                  >
                    Hủy chọn
                  </Button>
                </div>
              )}

              {/* Products Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (selectedProducts.size === products.length) {
                              setSelectedProducts(new Set())
                            } else {
                              setSelectedProducts(new Set(products.map(p => p.id)))
                            }
                          }}
                          className="h-6 w-6 p-0"
                        >
                          {selectedProducts.size === products.length && products.length > 0 ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>Hình ảnh</TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead>Thương hiệu</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Tồn kho</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Lượt xem</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                          <TableCell><Skeleton className="h-12 w-12 rounded" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        </TableRow>
                      ))
                    ) : products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                          Không tìm thấy sản phẩm nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newSelected = new Set(selectedProducts)
                                if (newSelected.has(product.id)) {
                                  newSelected.delete(product.id)
                                } else {
                                  newSelected.add(product.id)
                                }
                                setSelectedProducts(newSelected)
                              }}
                              className="h-6 w-6 p-0"
                            >
                              {selectedProducts.has(product.id) ? (
                                <CheckSquare className="h-4 w-4" />
                              ) : (
                                <Square className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={(() => {
                                  const imgValue = product.images && product.images.length > 0 ? product.images[0] : product.imageUrl;
                                  const resolved = imgValue ? (imgValue.startsWith('http') ? imgValue : CloudinaryService.getOptimizedUrl(imgValue, { width: 48, height: 48, crop: 'fill', quality: 'auto' })) : '';
                                  // eslint-disable-next-line no-console
                                  console.log('PRODUCT_IMAGE_VALUE', product.id, imgValue);
                                  return resolved;
                                })()}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="h-12 w-12 rounded bg-muted flex items-center justify-center"><svg class="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                                  }
                                }}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {product.sku && `SKU: ${product.sku}`}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {product.brand || '-'}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>{formatCurrency(product.priceCents)}</div>
                            {product.originalPriceCents && product.originalPriceCents > product.priceCents && (
                              <div className="text-sm text-muted-foreground line-through">
                                {formatCurrency(product.originalPriceCents)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <span className={`text-sm font-medium ${
                                (product.stockQuantity || 0) > 10 ? 'text-green-600' :
                                (product.stockQuantity || 0) > 0 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {product.stockQuantity || 0}
                              </span>
                              {(product.stockQuantity || 0) <= 5 && (product.stockQuantity || 0) > 0 && (
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              )}
                              {(product.stockQuantity || 0) === 0 && (
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {categories.find(cat => cat.id === product.categoryId)?.name || product.categoryId}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    // Quick toggle active status
                                    await apiClient.updateProduct(product.id, { isActive: !product.isActive })
                                    fetchProducts()
                                  } catch (error) {
                                    console.error('Failed to toggle product status:', error)
                                  }
                                }}
                                className="h-6 w-6 p-0"
                              >
                                {product.isActive ? (
                                  <Power className="h-4 w-4 text-green-600" />
                                ) : (
                                  <PowerOff className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
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
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <span>{product.viewCount}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setDeleteProductId(product.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {products.length} trong tổng số {totalProducts} sản phẩm
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    <span className="text-sm">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteProductId && handleDeleteProduct(deleteProductId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Product Detail Dialog */}
        <ProductDetailDialog
          productId={selectedProduct?.id || null}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          categories={categories}
        />

        {/* Product Form Dialog */}
        <ProductFormDialog
          product={editingProduct}
          open={showFormDialog}
          onOpenChange={setShowFormDialog}
          categories={categories}
          onSuccess={handleFormSuccess}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
