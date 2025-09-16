"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Mail,
  MessageSquare,
  Send,
  Users,
  Eye,
  MousePointer,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  BarChart3,
  Calendar,
  Target,
  Zap,
  DollarSign
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { toast } from "sonner"
import { useCampaigns } from "@/hooks/use-campaigns"

interface Campaign {
  id: string
  name: string
  description?: string
  type: "email" | "sms" | "push" | "social"
  status: "draft" | "scheduled" | "sent" | "cancelled"
  targetAudience: string
  subject?: string
  content?: string
  sentAt?: Date
  scheduledAt?: Date
  createdAt: Date
  createdBy: string
  recipients: number
  opens: number
  clicks: number
  conversions: number
  revenue: number
}

export default function CampaignsPage() {
  const {
    campaigns,
    stats,
    loading,
    createCampaign,
    updateCampaign,
    duplicateCampaign,
    sendCampaign
  } = useCampaigns()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    type: "email",
    status: "draft"
  })

  const filteredCampaigns = campaigns.filter(campaign => {
    if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (selectedType !== "all" && campaign.type !== selectedType) {
      return false
    }
    if (selectedStatus !== "all" && campaign.status !== selectedStatus) {
      return false
    }
    return true
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "email": return "bg-blue-50 text-blue-700 border-blue-200"
      case "sms": return "bg-green-50 text-green-700 border-green-200"
      case "push": return "bg-purple-50 text-purple-700 border-purple-200"
      case "social": return "bg-orange-50 text-orange-700 border-orange-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email": return Mail
      case "sms": return MessageSquare
      case "push": return Zap
      case "social": return Users
      default: return Mail
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-50 text-gray-700 border-gray-200"
      case "scheduled": return "bg-blue-50 text-blue-700 border-blue-200"
      case "sent": return "bg-green-50 text-green-700 border-green-200"
      case "cancelled": return "bg-red-50 text-red-700 border-red-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft": return "Nháp"
      case "scheduled": return "Đã lên lịch"
      case "sent": return "Đã gửi"
      case "cancelled": return "Đã hủy"
      default: return status
    }
  }

  const calculateOpenRate = (opens: number, recipients: number) => {
    return recipients > 0 ? ((opens / recipients) * 100).toFixed(1) : "0"
  }

  const calculateClickRate = (clicks: number, recipients: number) => {
    return recipients > 0 ? ((clicks / recipients) * 100).toFixed(1) : "0"
  }

  const handleCreateCampaign = async () => {
    try {
      await createCampaign(newCampaign as Campaign)
      setShowCreateDialog(false)
      setNewCampaign({ type: "email", status: "draft" })
      toast.success("Đã tạo chiến dịch marketing")
    } catch {
      toast.error("Không thể tạo chiến dịch")
    }
  }

  const handleEditCampaign = async () => {
    if (!selectedCampaign) return
    try {
      await updateCampaign(selectedCampaign.id, selectedCampaign)
      setShowEditDialog(false)
      setSelectedCampaign(null)
      toast.success("Đã cập nhật chiến dịch")
    } catch {
      toast.error("Không thể cập nhật chiến dịch")
    }
  }

  const handleSendCampaign = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn gửi chiến dịch này ngay bây giờ?")) {
      try {
        await sendCampaign(id)
        toast.success("Đã gửi chiến dịch thành công")
      } catch {
        toast.error("Không thể gửi chiến dịch")
      }
    }
  }

  const handleDuplicate = async (campaign: Campaign) => {
    try {
      await duplicateCampaign(campaign.id)
      toast.success("Đã sao chép chiến dịch")
    } catch {
      toast.error("Không thể sao chép chiến dịch")
    }
  }

  return (
    <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Chiến dịch Marketing</h1>
              <p className="text-muted-foreground">
                Quản lý chiến dịch Email, SMS và Push notifications
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo chiến dịch
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng chiến dịch</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeCampaigns} đang hoạt động
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ mở email</CardTitle>
                <Eye className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.averageOpenRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Trung bình toàn bộ chiến dịch
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ click</CardTitle>
                <MousePointer className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.averageClickRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Click-through rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh thu từ campaigns</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {(stats.totalRevenue / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">
                  VNĐ từ marketing
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="campaigns" className="space-y-4">
            <TabsList>
              <TabsTrigger value="campaigns">Chiến dịch</TabsTrigger>
              <TabsTrigger value="templates">Mẫu email</TabsTrigger>
              <TabsTrigger value="analytics">Phân tích</TabsTrigger>
              <TabsTrigger value="automation">Tự động hóa</TabsTrigger>
            </TabsList>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-4">
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
                        placeholder="Tìm kiếm chiến dịch..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                      title="Chọn loại chiến dịch"
                    >
                      <option value="all">Tất cả loại</option>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="push">Push notification</option>
                      <option value="social">Social media</option>
                    </select>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                      title="Chọn trạng thái chiến dịch"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="draft">Nháp</option>
                      <option value="scheduled">Đã lên lịch</option>
                      <option value="sent">Đã gửi</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Campaigns List */}
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách chiến dịch</CardTitle>
                  <CardDescription>
                    {filteredCampaigns.length} chiến dịch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8">Đang tải...</div>
                    ) : filteredCampaigns.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Không có dữ liệu
                      </div>
                    ) : (
                      filteredCampaigns.map((campaign) => {
                        const Icon = getTypeIcon(campaign.type)
                        return (
                          <div key={campaign.id} className="border rounded-lg p-4 hover:bg-muted/50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Icon className="h-5 w-5 text-muted-foreground" />
                                  <h3 className="font-bold text-lg">{campaign.name}</h3>
                                  <Badge className={getTypeColor(campaign.type)}>
                                    {campaign.type.toUpperCase()}
                                  </Badge>
                                  <Badge className={getStatusColor(campaign.status)}>
                                    {getStatusLabel(campaign.status)}
                                  </Badge>
                                </div>
                                
                                {campaign.description && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {campaign.description}
                                  </p>
                                )}
                                
                                <div className="flex items-center gap-6 text-sm mb-2">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{campaign.recipients.toLocaleString()} người nhận</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Target className="h-4 w-4" />
                                    <span>{campaign.targetAudience}</span>
                                  </div>
                                  {campaign.sentAt && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      <span>Gửi: {format(campaign.sentAt, "dd/MM/yyyy HH:mm", { locale: vi })}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {campaign.status === "sent" && (
                                  <div className="grid grid-cols-4 gap-4 mt-3 pt-3 border-t">
                                    <div className="text-center">
                                      <div className="text-lg font-bold text-green-600">
                                        {calculateOpenRate(campaign.opens, campaign.recipients)}%
                                      </div>
                                      <div className="text-xs text-muted-foreground">Tỷ lệ mở</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-lg font-bold text-blue-600">
                                        {calculateClickRate(campaign.clicks, campaign.recipients)}%
                                      </div>
                                      <div className="text-xs text-muted-foreground">Tỷ lệ click</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-lg font-bold text-purple-600">
                                        {campaign.conversions}
                                      </div>
                                      <div className="text-xs text-muted-foreground">Chuyển đổi</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-lg font-bold text-orange-600">
                                        {(campaign.revenue / 1000).toFixed(0)}K
                                      </div>
                                      <div className="text-xs text-muted-foreground">Doanh thu</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-1">
                                {campaign.status === "draft" && (
                                  <Button 
                                    size="sm" 
                                    variant="default"
                                    onClick={() => handleSendCampaign(campaign.id)}
                                  >
                                    <Send className="h-4 w-4 mr-1" />
                                    Gửi
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleDuplicate(campaign)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedCampaign(campaign)
                                    setShowEditDialog(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { name: "Welcome Email", description: "Chào mừng khách hàng mới", type: "email" },
                  { name: "Flash Sale", description: "Thông báo khuyến mãi đặc biệt", type: "email" },
                  { name: "Cart Abandonment", description: "Nhắc nhở giỏ hàng bỏ quên", type: "email" },
                  { name: "Birthday Offer", description: "Ưu đãi sinh nhật khách hàng", type: "sms" },
                  { name: "Order Confirmation", description: "Xác nhận đơn hàng", type: "push" },
                  { name: "Product Review", description: "Yêu cầu đánh giá sản phẩm", type: "email" }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:border-primary">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        {React.createElement(getTypeIcon(template.type), { className: "h-4 w-4" })}
                        {template.name}
                      </CardTitle>
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

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Hiệu quả chiến dịch theo tháng
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
                    <CardTitle>Top chiến dịch hiệu quả nhất</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {campaigns
                        .filter(c => c.status === "sent")
                        .sort((a, b) => b.revenue - a.revenue)
                        .slice(0, 5)
                        .map((campaign, index) => (
                          <div key={campaign.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-muted-foreground">
                                #{index + 1}
                              </span>
                              {React.createElement(getTypeIcon(campaign.type), { className: "h-4 w-4" })}
                              <div>
                                <p className="font-medium text-sm">{campaign.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {campaign.recipients.toLocaleString()} người nhận
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-purple-600">
                                {(campaign.revenue / 1000).toFixed(0)}K
                              </p>
                              <p className="text-xs text-green-600">
                                {calculateOpenRate(campaign.opens, campaign.recipients)}% mở
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Automation Tab */}
            <TabsContent value="automation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Marketing Automation
                  </CardTitle>
                  <CardDescription>
                    Thiết lập chiến dịch tự động dựa trên hành vi khách hàng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { 
                        name: "Welcome Series", 
                        description: "Chuỗi email chào mừng khách hàng mới đăng ký", 
                        trigger: "Đăng ký tài khoản",
                        status: "active"
                      },
                      { 
                        name: "Abandoned Cart", 
                        description: "Nhắc nhở khách hàng hoàn thành đơn hàng", 
                        trigger: "Bỏ quên giỏ hàng > 1h",
                        status: "active"
                      },
                      { 
                        name: "Re-engagement", 
                        description: "Kích hoạt lại khách hàng không hoạt động", 
                        trigger: "Không mua hàng > 60 ngày",
                        status: "inactive"
                      },
                      { 
                        name: "Birthday Campaign", 
                        description: "Gửi ưu đãi sinh nhật tự động", 
                        trigger: "Tháng sinh nhật",
                        status: "active"
                      }
                    ].map((automation, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{automation.name}</CardTitle>
                            <Badge className={automation.status === "active" 
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                            }>
                              {automation.status === "active" ? "Đang chạy" : "Tạm dừng"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            {automation.description}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            <strong>Trigger:</strong> {automation.trigger}
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              Chỉnh sửa
                            </Button>
                            <Button size="sm" variant={automation.status === "active" ? "secondary" : "default"}>
                              {automation.status === "active" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Create Campaign Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo chiến dịch marketing</DialogTitle>
                <DialogDescription>
                  Tạo chiến dịch email, SMS hoặc push notification mới
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="campaign-name">Tên chiến dịch</Label>
                  <Input
                    id="campaign-name"
                    value={newCampaign.name || ""}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    placeholder="VD: Flash Sale Black Friday"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="campaign-type">Loại chiến dịch</Label>
                    <select
                      id="campaign-type"
                      value={newCampaign.type}
                      onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value as Campaign["type"]})}
                      className="px-3 py-2 border rounded-md"
                      title="Chọn loại chiến dịch marketing"
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="push">Push notification</option>
                      <option value="social">Social media</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="campaign-audience">Đối tượng</Label>
                    <Input
                      id="campaign-audience"
                      value={newCampaign.targetAudience || ""}
                      onChange={(e) => setNewCampaign({...newCampaign, targetAudience: e.target.value})}
                      placeholder="VD: Khách hàng VIP"
                    />
                  </div>
                </div>
                {newCampaign.type === "email" && (
                  <div className="grid gap-2">
                    <Label htmlFor="campaign-subject">Tiêu đề email</Label>
                    <Input
                      id="campaign-subject"
                      value={newCampaign.subject || ""}
                      onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                      placeholder="VD: 🔥 Flash Sale 50% - Chỉ còn 24 giờ!"
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="campaign-content">Nội dung</Label>
                  <Textarea
                    id="campaign-content"
                    value={newCampaign.content || ""}
                    onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                    placeholder="Nhập nội dung chiến dịch..."
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="campaign-description">Mô tả (tùy chọn)</Label>
                  <Input
                    id="campaign-description"
                    value={newCampaign.description || ""}
                    onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                    placeholder="Mô tả ngắn về chiến dịch"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateCampaign}>
                  Tạo chiến dịch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Campaign Dialog */}
          {selectedCampaign && (
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa chiến dịch</DialogTitle>
                  <DialogDescription>
                    Cập nhật thông tin chiến dịch marketing
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-campaign-name">Tên chiến dịch</Label>
                    <Input
                      id="edit-campaign-name"
                      value={selectedCampaign.name}
                      onChange={(e) => setSelectedCampaign({...selectedCampaign, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-campaign-description">Mô tả</Label>
                    <Input
                      id="edit-campaign-description"
                      value={selectedCampaign.description || ""}
                      onChange={(e) => setSelectedCampaign({...selectedCampaign, description: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-campaign-content">Nội dung</Label>
                    <Textarea
                      id="edit-campaign-content"
                      value={selectedCampaign.content}
                      onChange={(e) => setSelectedCampaign({...selectedCampaign, content: e.target.value})}
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleEditCampaign}>
                    Cập nhật
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
  )
}
