"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tag,
  Percent,
  Gift,
  Calendar,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Eye,
  Download,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { toast } from "sonner"
import { usePromotions } from "@/hooks/use-promotions"

interface Promotion {
  id: string
  code: string
  name: string
  description?: string
  type: "percentage" | "fixed_amount" | "free_shipping" | "buy_x_get_y"
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount: number
  isActive: boolean
  startDate: Date
  endDate: Date
  categories?: string[]
  products?: string[]
  customerSegments?: string[]
  createdAt: Date
  createdBy: string
}

interface PromotionStats {
  totalPromotions: number
  activePromotions: number
  expiredPromotions: number
  totalSavings: number
  totalUsage: number
  conversionRate: number
}

export default function PromotionsPage() {
  const {
    promotions,
    stats,
    loading,
    createPromotion,
    updatePromotion,
    deletePromotion,
    duplicatePromotion,
    togglePromotion
  } = usePromotions()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [newPromotion, setNewPromotion] = useState<Partial<Promotion>>({
    type: "percentage",
    isActive: true
  })

  const filteredPromotions = promotions.filter(promo => {
    if (searchQuery && !promo.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !promo.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (selectedType !== "all" && promo.type !== selectedType) {
      return false
    }
    if (selectedStatus !== "all") {
      const now = new Date()
      if (selectedStatus === "active" && (!promo.isActive || promo.endDate < now)) return false
      if (selectedStatus === "expired" && (promo.isActive && promo.endDate >= now)) return false
      if (selectedStatus === "inactive" && promo.isActive) return false
    }
    return true
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "percentage": return "bg-blue-50 text-blue-700 border-blue-200"
      case "fixed_amount": return "bg-green-50 text-green-700 border-green-200"
      case "free_shipping": return "bg-purple-50 text-purple-700 border-purple-200"
      case "buy_x_get_y": return "bg-orange-50 text-orange-700 border-orange-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "percentage": return "Phần trăm"
      case "fixed_amount": return "Số tiền cố định"
      case "free_shipping": return "Miễn phí vận chuyển"
      case "buy_x_get_y": return "Mua X tặng Y"
      default: return type
    }
  }

  const getStatusBadge = (promotion: Promotion) => {
    const now = new Date()
    if (!promotion.isActive) {
      return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Tạm dừng</Badge>
    }
    if (promotion.endDate < now) {
      return <Badge className="bg-red-50 text-red-700 border-red-200">Hết hạn</Badge>
    }
    if (promotion.startDate > now) {
      return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Sắp bắt đầu</Badge>
    }
    return <Badge className="bg-green-50 text-green-700 border-green-200">Đang hoạt động</Badge>
  }

  const formatDiscount = (promotion: Promotion) => {
    switch (promotion.type) {
      case "percentage":
        return `${promotion.value}%`
      case "fixed_amount":
        return `${promotion.value.toLocaleString('vi-VN')}đ`
      case "free_shipping":
        return "Miễn phí ship"
      case "buy_x_get_y":
        return `Mua ${promotion.value} tặng 1`
      default:
        return promotion.value.toString()
    }
  }

  const handleCreatePromotion = async () => {
    try {
      await createPromotion(newPromotion as Promotion)
      setShowCreateDialog(false)
      setNewPromotion({ type: "percentage", isActive: true })
      toast.success("Đã tạo chương trình khuyến mãi")
    } catch (error) {
      toast.error("Không thể tạo chương trình khuyến mãi")
    }
  }

  const handleEditPromotion = async () => {
    if (!selectedPromotion) return
    try {
      await updatePromotion(selectedPromotion.id, selectedPromotion)
      setShowEditDialog(false)
      setSelectedPromotion(null)
      toast.success("Đã cập nhật chương trình khuyến mãi")
    } catch (error) {
      toast.error("Không thể cập nhật chương trình khuyến mãi")
    }
  }

  const handleDeletePromotion = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa chương trình khuyến mãi này?")) {
      try {
        await deletePromotion(id)
        toast.success("Đã xóa chương trình khuyến mãi")
      } catch (error) {
        toast.error("Không thể xóa chương trình khuyến mãi")
      }
    }
  }

  const handleDuplicate = async (promotion: Promotion) => {
    try {
      await duplicatePromotion(promotion.id)
      toast.success("Đã sao chép chương trình khuyến mãi")
    } catch (error) {
      toast.error("Không thể sao chép chương trình khuyến mãi")
    }
  }

  return (
    <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Khuyến mãi & Mã giảm giá</h1>
              <p className="text-muted-foreground">
                Quản lý chương trình khuyến mãi và mã giảm giá
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo khuyến mãi
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng chương trình</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPromotions}</div>
                <p className="text-xs text-muted-foreground">
                  Đã tạo
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activePromotions}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.activePromotions / stats.totalPromotions) * 100)}% tổng số
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lượt sử dụng</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalUsage.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Tổng lượt sử dụng
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiết kiệm cho KH</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {(stats.totalSavings / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">
                  VNĐ tiết kiệm
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">Danh sách</TabsTrigger>
              <TabsTrigger value="analytics">Thống kê</TabsTrigger>
              <TabsTrigger value="templates">Mẫu có sẵn</TabsTrigger>
            </TabsList>

            {/* List Tab */}
            <TabsContent value="list" className="space-y-4">
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
                        placeholder="Tìm kiếm tên, mã khuyến mãi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">Tất cả loại</option>
                      <option value="percentage">Phần trăm</option>
                      <option value="fixed_amount">Số tiền cố định</option>
                      <option value="free_shipping">Miễn phí ship</option>
                      <option value="buy_x_get_y">Mua X tặng Y</option>
                    </select>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="active">Đang hoạt động</option>
                      <option value="expired">Hết hạn</option>
                      <option value="inactive">Tạm dừng</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Promotions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách khuyến mãi</CardTitle>
                  <CardDescription>
                    {filteredPromotions.length} chương trình
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8">Đang tải...</div>
                    ) : filteredPromotions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Không có dữ liệu
                      </div>
                    ) : (
                      filteredPromotions.map((promotion) => (
                        <div key={promotion.id} className="border rounded-lg p-4 hover:bg-muted/50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-lg">{promotion.name}</h3>
                                <Badge className={getTypeColor(promotion.type)}>
                                  {getTypeLabel(promotion.type)}
                                </Badge>
                                {getStatusBadge(promotion)}
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                  {promotion.code}
                                </span>
                                <span className="font-bold text-lg text-primary">
                                  {formatDiscount(promotion)}
                                </span>
                                <span>
                                  {format(promotion.startDate, "dd/MM/yyyy", { locale: vi })} - {format(promotion.endDate, "dd/MM/yyyy", { locale: vi })}
                                </span>
                              </div>
                              
                              {promotion.description && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {promotion.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{promotion.usageCount}/{promotion.usageLimit || "∞"} lượt sử dụng</span>
                                </div>
                                {promotion.minOrderAmount && (
                                  <div className="flex items-center gap-1">
                                    <Tag className="h-4 w-4" />
                                    <span>Đơn tối thiểu: {promotion.minOrderAmount.toLocaleString('vi-VN')}đ</span>
                                  </div>
                                )}
                                {promotion.maxDiscount && (
                                  <div className="flex items-center gap-1">
                                    <Percent className="h-4 w-4" />
                                    <span>Giảm tối đa: {promotion.maxDiscount.toLocaleString('vi-VN')}đ</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleDuplicate(promotion)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  setSelectedPromotion(promotion)
                                  setShowEditDialog(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleDeletePromotion(promotion.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Hiệu quả khuyến mãi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Biểu đồ hiệu quả sẽ được hiển thị ở đây
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top khuyến mãi được sử dụng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {promotions
                        .sort((a, b) => b.usageCount - a.usageCount)
                        .slice(0, 5)
                        .map((promo, index) => (
                          <div key={promo.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{promo.name}</p>
                              <p className="text-sm text-muted-foreground">{promo.code}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{promo.usageCount}</p>
                              <p className="text-sm text-muted-foreground">lượt sử dụng</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { name: "Flash Sale 50%", description: "Giảm 50% cho toàn bộ sản phẩm trong 24h" },
                  { name: "Miễn phí vận chuyển", description: "Free ship cho đơn hàng trên 500k" },
                  { name: "Mua 2 tặng 1", description: "Mua 2 sản phẩm tặng 1 sản phẩm cùng loại" },
                  { name: "Khách hàng mới -20%", description: "Giảm 20% cho khách hàng đăng ký mới" },
                  { name: "Sinh nhật -30%", description: "Giảm 30% trong tháng sinh nhật" },
                  { name: "Combo Deal", description: "Mua combo sản phẩm giảm 25%" }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:border-primary">
                    <CardHeader>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm" className="w-full">
                        Sử dụng mẫu
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Create Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo chương trình khuyến mãi</DialogTitle>
                <DialogDescription>
                  Tạo chương trình khuyến mãi mới cho cửa hàng
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="promo-name">Tên chương trình</Label>
                  <Input
                    id="promo-name"
                    value={newPromotion.name || ""}
                    onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                    placeholder="VD: Flash Sale 50%"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="promo-code">Mã khuyến mãi</Label>
                  <Input
                    id="promo-code"
                    value={newPromotion.code || ""}
                    onChange={(e) => setNewPromotion({...newPromotion, code: e.target.value.toUpperCase()})}
                    placeholder="VD: FLASH50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="promo-type">Loại khuyến mãi</Label>
                    <select
                      id="promo-type"
                      value={newPromotion.type}
                      onChange={(e) => setNewPromotion({...newPromotion, type: e.target.value as any})}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="percentage">Phần trăm</option>
                      <option value="fixed_amount">Số tiền cố định</option>
                      <option value="free_shipping">Miễn phí vận chuyển</option>
                      <option value="buy_x_get_y">Mua X tặng Y</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="promo-value">Giá trị</Label>
                    <Input
                      id="promo-value"
                      type="number"
                      value={newPromotion.value || 0}
                      onChange={(e) => setNewPromotion({...newPromotion, value: parseInt(e.target.value)})}
                      placeholder="50"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="promo-description">Mô tả</Label>
                  <Textarea
                    id="promo-description"
                    value={newPromotion.description || ""}
                    onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                    placeholder="Mô tả chi tiết về chương trình khuyến mãi"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreatePromotion}>
                  Tạo khuyến mãi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          {selectedPromotion && (
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa khuyến mãi</DialogTitle>
                  <DialogDescription>
                    Cập nhật thông tin chương trình khuyến mãi
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-promo-name">Tên chương trình</Label>
                    <Input
                      id="edit-promo-name"
                      value={selectedPromotion.name}
                      onChange={(e) => setSelectedPromotion({...selectedPromotion, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-promo-code">Mã khuyến mãi</Label>
                    <Input
                      id="edit-promo-code"
                      value={selectedPromotion.code}
                      onChange={(e) => setSelectedPromotion({...selectedPromotion, code: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-promo-description">Mô tả</Label>
                    <Textarea
                      id="edit-promo-description"
                      value={selectedPromotion.description || ""}
                      onChange={(e) => setSelectedPromotion({...selectedPromotion, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleEditPromotion}>
                    Cập nhật
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
  )
}
