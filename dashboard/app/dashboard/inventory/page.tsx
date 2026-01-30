"use client"

import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Search,
  Download,
  Upload,
  History,
  RefreshCw,
  Edit,
  Trash2
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { toast } from "sonner"
import { useInventory } from "@/hooks/use-inventory"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"



export default function InventoryPage() {
  const { token, isAuthenticated } = useAuth()
  const {
    inventory,
    movements,
    alerts,
    stats,
    loading,
    updateStock,
    editProduct,
    deleteProduct,
    exportInventory,
    importInventory,
    refreshInventory,
    syncInventoryWithProducts
  } = useInventory()

  const [searchQuery, setSearchQuery] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  // Set token when auth changes and refresh data
  useEffect(() => {
    if (token) {
      apiClient.setToken(token)
      refreshInventory() // Refresh data after token is set
    }
  }, [token, refreshInventory])

  const filteredInventory = inventory.filter(item => {
    if (searchQuery && !item.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.sku.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false
    }
    if (selectedStatus !== "all" && item.status !== selectedStatus) {
      return false
    }
    return true
  })

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredInventory.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  
  // Ensure currentPage is within valid range (use useMemo to avoid setState in effect)
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  
  const paginatedInventory = filteredInventory.slice(
    (validCurrentPage - 1) * itemsPerPage,
    validCurrentPage * itemsPerPage
  )

  // Reset to page 1 when filters change - but use callback to avoid cascading renders
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    setCurrentPage(1)
  }


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock": return <Badge className="bg-green-50 text-green-700 border-green-200">Còn hàng</Badge>
      case "low_stock": return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Sắp hết</Badge>
      case "out_of_stock": return <Badge className="bg-red-50 text-red-700 border-red-200">Hết hàng</Badge>
      default: return null
    }
  }

  const handleStockAdjustment = async (productId: string, type: "increase" | "decrease", quantity: number) => {
    try {
      await updateStock(productId, type, quantity, "Manual adjustment")
      toast.success("Đã cập nhật tồn kho")
    } catch {
      toast.error("Không thể cập nhật tồn kho")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý tồn kho</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý tồn kho sản phẩm
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refreshInventory}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline" onClick={syncInventoryWithProducts}>
            <Package className="h-4 w-4 mr-2" />
            Đồng bộ SP
          </Button>
          <Button variant="outline" onClick={exportInventory}>
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            title="Chọn file CSV để nhập dữ liệu tồn kho"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (f) await importInventory(f)
              if (fileInputRef.current) fileInputRef.current.value = ""
            }}
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Nhập dữ liệu
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <span className="text-muted-foreground">...</span>
              ) : (
                stats.totalProducts
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Đang quản lý
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Còn hàng</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? (
                <span className="text-muted-foreground">...</span>
              ) : (
                stats.inStock
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? (
                <span>Đang tính toán...</span>
              ) : (
                stats.totalProducts > 0 ? `${Math.round((stats.inStock / stats.totalProducts) * 100)}% tổng số` : '0% tổng số'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp hết hàng</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {loading ? (
                <span className="text-muted-foreground">...</span>
              ) : (
                stats.lowStock
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Cần bổ sung
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {loading ? (
                <span className="text-muted-foreground">...</span>
              ) : (
                stats.outOfStock
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Cần nhập hàng
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-4 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {loading ? (
                <span className="text-muted-foreground">...</span>
              ) : (
                new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(stats.totalValue)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng giá trị tồn kho
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
          <TabsTrigger value="movements">Biến động kho</TabsTrigger>
          <TabsTrigger value="alerts">Cảnh báo</TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Bộ lọc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm, SKU..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                  title="Lọc theo danh mục sản phẩm"
                >
                  <option value="all">Tất cả danh mục</option>
                  <option value="Loa">Loa</option>
                  <option value="Tai nghe">Tai nghe</option>
                  <option value="Dàn Karaoke">Dàn Karaoke</option>
                  <option value="Đầu Karaoke">Đầu Karaoke</option>
                  <option value="Loa & Loa Sub">Loa & Loa Sub</option>
                  <option value="Micro Phone">Micro Phone</option>
                  <option value="Mixer / Vang Số">Mixer / Vang Số</option>
                  <option value="Màn Hình Chọn Bài">Màn Hình Chọn Bài</option>
                  <option value="Thanh Lý">Thanh Lý</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                  title="Lọc theo trạng thái tồn kho"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="in_stock">Còn hàng</option>
                  <option value="low_stock">Sắp hết</option>
                  <option value="out_of_stock">Hết hàng</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách tồn kho</CardTitle>
              <CardDescription>
                {loading ? (
                  <span className="text-muted-foreground">Đang tải...</span>
                ) : (
                  <>
                    {filteredInventory.length} sản phẩm
                    {totalPages > 1 && ` • Trang ${currentPage}/${totalPages}`}
                    {filteredInventory.length > itemsPerPage && ` • Hiển thị ${startIndex + 1}-${Math.min(endIndex, filteredInventory.length)} trong ${filteredInventory.length}`}
                  </>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Đang tải dữ liệu tồn kho...</p>
                  </div>
                </div>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-background z-10">
                    <tr className="border-b">
                      <th className="text-left py-2">Sản phẩm</th>
                      <th className="text-left py-2">SKU</th>
                      <th className="text-center py-2">Tồn kho</th>
                      <th className="text-center py-2">Đã đặt</th>
                      <th className="text-center py-2">Khả dụng</th>
                      <th className="text-center py-2">Trạng thái</th>
                      <th className="text-center py-2">Cập nhật</th>
                      <th className="text-center py-2">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInventory.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-muted-foreground">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      paginatedInventory.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                                {item.productImage ? (
                                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-muted-foreground">{item.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 font-mono text-sm">{item.sku}</td>
                          <td className="py-3 text-center font-bold">{item.stock}</td>
                          <td className="py-3 text-center text-orange-600">{item.reserved}</td>
                          <td className="py-3 text-center text-green-600">{item.available}</td>
                          <td className="py-3 text-center">{getStatusBadge(item.status)}</td>
                          <td className="py-3 text-center text-sm text-muted-foreground">
                            {format(item.lastUpdated, "dd/MM HH:mm", { locale: vi })}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStockAdjustment(item.productId, "increase", 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStockAdjustment(item.productId, "decrease", 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={async () => {
                                const newSku = window.prompt('Nhập SKU mới (bỏ trống để giữ nguyên):', item.sku)
                                const newStockStr = window.prompt('Nhập tồn kho mới (bỏ trống để giữ nguyên):', String(item.stock))
                                const patch: Partial<{ name: string; sku: string; stockQuantity: number }> = {}
                                if (newSku !== null && newSku !== item.sku) patch.sku = newSku
                                if (newStockStr !== null && newStockStr !== String(item.stock)) {
                                  const val = Math.max(0, parseInt(newStockStr || '0', 10) || 0)
                                  patch.stockQuantity = val
                                }
                                if (Object.keys(patch).length > 0) {
                                  try { await editProduct(item.productId, patch); toast.success('Đã cập nhật sản phẩm') } catch { toast.error('Cập nhật thất bại') }
                                }
                              }}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={async () => {
                                if (confirm(`Xóa sản phẩm này khỏi catalog?`)) {
                                  try { await deleteProduct(item.productId); toast.success('Đã xóa sản phẩm') } catch { toast.error('Xóa thất bại') }
                                }
                              }}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              )}
              {!loading && filteredInventory.length > itemsPerPage && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {(() => {
                        const pages: (number | 'ellipsis')[] = []
                        
                        if (totalPages <= 7) {
                          // Show all pages if 7 or fewer
                          for (let i = 1; i <= totalPages; i++) {
                            pages.push(i)
                          }
                        } else {
                          // Always show first page
                          pages.push(1)
                          
                          if (currentPage <= 3) {
                            // Near the start: 1 2 3 4 ... last
                            for (let i = 2; i <= 4; i++) {
                              pages.push(i)
                            }
                            pages.push('ellipsis')
                            pages.push(totalPages)
                          } else if (currentPage >= totalPages - 2) {
                            // Near the end: 1 ... (n-3) (n-2) (n-1) n
                            pages.push('ellipsis')
                            for (let i = totalPages - 3; i <= totalPages; i++) {
                              pages.push(i)
                            }
                          } else {
                            // In the middle: 1 ... (current-1) current (current+1) ... last
                            pages.push('ellipsis')
                            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                              pages.push(i)
                            }
                            pages.push('ellipsis')
                            pages.push(totalPages)
                          }
                        }
                        
                        return pages.map((page, index) => {
                          if (page === 'ellipsis') {
                            return (
                              <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )
                          }
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        })
                      })()}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Movements Tab */}
        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                Lịch sử biến động kho
              </CardTitle>
              <CardDescription>
                Theo dõi tất cả hoạt động nhập/xuất kho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Thời gian</th>
                      <th className="text-left py-2">Sản phẩm</th>
                      <th className="text-center py-2">Loại</th>
                      <th className="text-center py-2">Số lượng</th>
                      <th className="text-left py-2">Lý do</th>
                      <th className="text-left py-2">Người thực hiện</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((movement) => (
                      <tr key={movement.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 text-sm">
                          {format(movement.createdAt, "dd/MM/yyyy HH:mm", { locale: vi })}
                        </td>
                        <td className="py-3 font-medium">{movement.productName}</td>
                        <td className="py-3 text-center">
                          {movement.type === "IN" && (
                            <Badge className="bg-green-50 text-green-700 border-green-200">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Nhập
                            </Badge>
                          )}
                          {movement.type === "OUT" && (
                            <Badge className="bg-red-50 text-red-700 border-red-200">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              Xuất
                            </Badge>
                          )}
                          {movement.type === "ADJUSTMENT" && (
                            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Điều chỉnh
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 text-center font-bold">
                          {movement.type === "OUT" ? "-" : "+"}{movement.quantity}
                        </td>
                        <td className="py-3">{movement.reason}</td>
                        <td className="py-3 text-sm text-muted-foreground">{movement.userId || "Hệ thống"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                Cảnh báo tồn kho
              </CardTitle>
              <CardDescription>
                Các sản phẩm cần chú ý
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${alert.type === "LOW_STOCK" ? "bg-yellow-500" :
                        alert.type === "OUT_OF_STOCK" ? "bg-red-500" :
                          "bg-orange-500"
                        }`} />
                      <div>
                        <p className="font-medium">{alert.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.message} • Còn: {alert.currentStock} • Ngưỡng: {alert.threshold}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${alert.type === "LOW_STOCK" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        alert.type === "OUT_OF_STOCK" ? "bg-red-50 text-red-700 border-red-200" :
                          "bg-orange-50 text-orange-700 border-orange-200"
                        }`}>
                        {alert.type === "LOW_STOCK" ? "Sắp hết" :
                          alert.type === "OUT_OF_STOCK" ? "Hết hàng" :
                            "Quá nhiều"}
                      </Badge>
                      {!alert.isResolved && (
                        <Button size="sm">
                          Nhập hàng
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}