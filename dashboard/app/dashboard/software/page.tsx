"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { ProductDetailDialog } from "@/components/products/product-detail-dialog"
import { ProductFormDialog } from "@/components/products/product-form-dialog"
import {
  Download,
  Edit,
  Eye,
  Link as LinkIcon,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Star,
} from "lucide-react"

interface Product {
  id: string
  slug: string
  name: string
  description?: string | null
  priceCents: number
  originalPriceCents?: number | null
  images?: string[]
  imageUrl?: string | null
  categoryId?: string | null
  featured: boolean
  isActive: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
  isDigital?: boolean
  downloadUrl?: string | null
  sku?: string | null
  brand?: string | null
  model?: string | null
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
  totalPages?: number
}

export default function SoftwarePage() {
  const { toast } = useToast()
  const { token } = useAuth()

  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize] = useState(50)

  const [categories, setCategories] = useState<Category[]>([])

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const [showFormDialog, setShowFormDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [deleteCheckResult, setDeleteCheckResult] = useState<{
    canDelete: boolean
    message: string
    associatedOrdersCount: number
  } | null>(null)
  const [checkingDelete, setCheckingDelete] = useState(false)

  const [stats, setStats] = useState({
    totalActive: 0,
    totalFeatured: 0,
    missingDownload: 0,
  })

  const normalizeProductImages = useCallback((images: unknown, imageUrl?: string | null): string[] => {
    if (Array.isArray(images)) {
      const urls = images
        .map((item) => {
          if (typeof item === "string") return item
          if (item && typeof item === "object" && typeof (item as { url?: string }).url === "string") {
            return (item as { url: string }).url
          }
          return ""
        })
        .filter(Boolean)
      if (urls.length > 0) return urls
    }

    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images) as unknown
        if (Array.isArray(parsed)) {
          return normalizeProductImages(parsed, imageUrl)
        }
      } catch {
        return [images]
      }
    }

    return imageUrl ? [imageUrl] : []
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount / 100)
  }

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiClient.getCategories()
      const data = response.data as Category[]
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiClient.getProducts({ page: 1, limit: 10000, isDigital: true })
      const data = response.data as ProductsResponse
      const all = data.items || []
      setStats({
        totalActive: all.filter(p => p.isActive).length,
        totalFeatured: all.filter(p => p.featured).length,
        missingDownload: all.filter(p => !p.downloadUrl || String(p.downloadUrl).trim().length === 0).length,
      })
    } catch (error) {
      console.error("Failed to fetch software stats:", error)
    }
  }, [])

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)

      const params: {
        page: number
        limit: number
        category?: string
        search?: string
        isActive?: boolean
        featured?: boolean
        isDigital?: boolean
      } = {
        page: currentPage,
        limit: pageSize,
        isDigital: true,
        category: categoryFilter === "all" ? undefined : categoryFilter || undefined,
        search: searchTerm || undefined,
      }

      if (statusFilter === "missingDownload") {
        const response = await apiClient.getProducts({
          page: 1,
          limit: 10000,
          isDigital: true,
          category: params.category,
          search: params.search,
        })
        const data = response.data as ProductsResponse

        const normalizedItems = (data.items || []).map((item) => ({
          ...item,
          images: normalizeProductImages(item.images, item.imageUrl),
        }))

        const filtered = normalizedItems.filter(
          p => !p.downloadUrl || String(p.downloadUrl).trim().length === 0,
        )

        setTotalItems(filtered.length)
        const start = (currentPage - 1) * pageSize
        setItems(filtered.slice(start, start + pageSize))
        return
      }

      if (statusFilter === "active") {
        params.isActive = true
      } else if (statusFilter === "inactive") {
        params.isActive = false
      } else if (statusFilter === "featured") {
        params.featured = true
      }

      const response = await apiClient.getProducts(params)
      const data = response.data as ProductsResponse

      const normalizedItems = (data.items || []).map((item) => ({
        ...item,
        images: normalizeProductImages(item.images, item.imageUrl),
      }))

      setItems(normalizedItems)
      setTotalItems(data.total)
    } catch (error) {
      console.error("Failed to fetch software:", error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, categoryFilter, searchTerm, statusFilter, normalizeProductImages])

  useEffect(() => {
    if (!token) return
    apiClient.setToken(token)
    fetchItems()
    fetchCategories()
    fetchStats()
  }, [token, fetchItems, fetchCategories, fetchStats])

  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize])

  const openDownload = (url?: string | null) => {
    const link = String(url || "").trim()
    if (!link) {
      toast({ title: "Thiếu link tải", description: "Vui lòng cập nhật downloadUrl cho phần mềm này", variant: "destructive" })
      return
    }
    window.open(link, "_blank", "noopener,noreferrer")
  }

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setShowDetailDialog(true)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setShowFormDialog(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowFormDialog(true)
  }

  const handleFormSuccess = () => {
    setShowFormDialog(false)
    setEditingProduct(null)
    fetchItems()
    fetchStats()
  }

  const checkProductDeletable = async (productId: string) => {
    try {
      setCheckingDelete(true)
      const result = await apiClient.checkProductDeletable(productId)
      setDeleteCheckResult(result.data as { canDelete: boolean; message: string; associatedOrdersCount: number })
    } catch (error) {
      console.error("Failed to check product deletable status:", error)
      setDeleteCheckResult({ canDelete: false, message: "Unable to check deletion status", associatedOrdersCount: 0 })
    } finally {
      setCheckingDelete(false)
    }
  }

  const handleDelete = async (productId: string) => {
    try {
      const result = await apiClient.deleteProduct(productId)
      if (result.success) {
        toast({ title: "Thành công", description: "Đã xóa phần mềm" })
        setDeleteProductId(null)
        setDeleteCheckResult(null)
        fetchItems()
        fetchStats()
        return
      }
      toast({ title: "Không thể xóa", description: result.message || "Xóa thất bại", variant: "destructive" })
    } catch (error) {
      console.error("Failed to delete software:", error)
      toast({ title: "Lỗi", description: "Có lỗi xảy ra khi xóa", variant: "destructive" })
    }
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-0 sm:p-4 md:p-8 pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Quản lý phần mềm</h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Quản lý các sản phẩm tải về (digital)
            </p>
          </div>
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Thêm phần mềm
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng phần mềm</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">Trong hệ thống</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalActive}</div>
              <p className="text-xs text-muted-foreground">Hiển thị cho khách</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nổi bật</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.totalFeatured}</div>
              <p className="text-xs text-muted-foreground">Được spotlight</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thiếu link tải</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.missingDownload}</div>
              <p className="text-xs text-muted-foreground">Cần cập nhật downloadUrl</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách phần mềm</CardTitle>
            <CardDescription>Lọc, tìm kiếm, chỉnh sửa và lấy link tải</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
              <div className="flex items-center gap-2 w-full md:max-w-lg">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên/SKU/thuơng hiệu..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={categoryFilter || "all"}
                  onValueChange={(v) => {
                    setCategoryFilter(v === "all" ? "" : v)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={statusFilter || "all"}
                  onValueChange={(v) => {
                    setStatusFilter(v === "all" ? "" : v)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Tạm ẩn</SelectItem>
                    <SelectItem value="featured">Nổi bật</SelectItem>
                    <SelectItem value="missingDownload">Thiếu link tải</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[72px]">Ảnh</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Link tải</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-12 w-12 rounded" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-56" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-44" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Không có phần mềm nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((product) => {
                      const firstImage =
                        Array.isArray(product.images) && product.images.length > 0
                          ? (product.images[0] as string)
                          : product.imageUrl || ""

                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            {firstImage ? (
                              <Image
                                src={firstImage}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                                <Download className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{product.name}</div>
                              <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest">
                                Digital
                              </Badge>
                              {!product.isActive && (
                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">
                                  Ẩn
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {product.sku ? `SKU: ${product.sku}` : ""}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(product.priceCents)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {categories.find(cat => cat.id === product.categoryId)?.name || product.categoryId || "—"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {product.downloadUrl ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => openDownload(product.downloadUrl)}
                              >
                                <LinkIcon className="h-4 w-4" />
                                Mở link
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2 text-sm text-red-600">
                                <AlertTriangle className="h-4 w-4" />
                                Thiếu link
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleView(product)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(product)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openDownload(product.downloadUrl)}
                                  disabled={!product.downloadUrl}
                                >
                                  <LinkIcon className="mr-2 h-4 w-4" />
                                  Mở link tải
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={async () => {
                                    setDeleteProductId(product.id)
                                    setDeleteCheckResult(null)
                                    await checkProductDeletable(product.id)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Trước
                </Button>
                <div className="text-sm text-muted-foreground px-2">
                  Trang {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Sau
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ProductDetailDialog
        productId={selectedProduct?.id || null}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        categories={categories}
      />

      <ProductFormDialog
        product={editingProduct}
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        categories={categories}
        onSuccess={handleFormSuccess}
        defaultIsDigital
      />

      <AlertDialog open={!!deleteProductId} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa phần mềm?</AlertDialogTitle>
            <AlertDialogDescription>
              {checkingDelete
                ? "Đang kiểm tra điều kiện xóa..."
                : deleteCheckResult && !deleteCheckResult.canDelete
                  ? "Không thể xóa phần mềm này vì đã có đơn hàng liên kết."
                  : "Hành động này không thể hoàn tác."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteCheckResult && !deleteCheckResult.canDelete && (
            <div className="text-sm text-muted-foreground">
              {deleteCheckResult.message || `Có ${deleteCheckResult.associatedOrdersCount} đơn hàng liên kết.`}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteProductId(null)}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProductId && handleDelete(deleteProductId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={checkingDelete || (deleteCheckResult !== null && !deleteCheckResult.canDelete)}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
