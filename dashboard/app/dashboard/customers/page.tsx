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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  UserPlus,
  Star,
  ShoppingBag,
  TrendingUp,
  Search,
  Filter,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Heart,
  Gift,
  MessageCircle,
  BarChart3,
  Award,
  Clock,
  DollarSign
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { toast } from "sonner"
import { useCustomers } from "@/hooks/use-customers"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  address?: string
  dateOfBirth?: Date
  registeredAt: Date
  lastLogin?: Date
  segment: "new" | "regular" | "vip" | "inactive"
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  loyaltyPoints: number
  preferredCategories?: string[]
  notes?: string
  isActive: boolean
}

interface CustomerStats {
  totalCustomers: number
  newCustomers: number
  vipCustomers: number
  activeCustomers: number
  totalRevenue: number
  averageOrderValue: number
  retentionRate: number
  churnRate: number
}

export default function CustomersPage() {
  const {
    customers,
    stats,
    loading,
    updateCustomer,
    deleteCustomer,
    exportCustomers,
    sendEmail,
    createLoyaltyReward
  } = useCustomers()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSegment, setSelectedSegment] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [emailContent, setEmailContent] = useState({ subject: "", message: "" })

  const filteredCustomers = customers.filter(customer => {
    if (searchQuery && !customer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !customer.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (selectedSegment !== "all" && customer.segment !== selectedSegment) {
      return false
    }
    return true
  })

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case "new": return "bg-blue-50 text-blue-700 border-blue-200"
      case "regular": return "bg-green-50 text-green-700 border-green-200"
      case "vip": return "bg-purple-50 text-purple-700 border-purple-200"
      case "inactive": return "bg-gray-50 text-gray-700 border-gray-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getSegmentLabel = (segment: string) => {
    switch (segment) {
      case "new": return "Khách mới"
      case "regular": return "Thường xuyên"
      case "vip": return "VIP"
      case "inactive": return "Không hoạt động"
      default: return segment
    }
  }

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowDetailsDialog(true)
  }

  const handleSendEmail = (customer: Customer) => {
    setSelectedCustomer(customer)
    setEmailContent({ 
      subject: `Ưu đãi đặc biệt dành cho ${customer.name}`, 
      message: "" 
    })
    setShowEmailDialog(true)
  }

  const submitEmail = async () => {
    if (!selectedCustomer) return
    try {
      await sendEmail(selectedCustomer.id, emailContent.subject, emailContent.message)
      setShowEmailDialog(false)
      setEmailContent({ subject: "", message: "" })
      toast.success("Đã gửi email")
    } catch (error) {
      toast.error("Không thể gửi email")
    }
  }

  const handleSegmentChange = async (customerId: string, newSegment: string) => {
    try {
      await updateCustomer(customerId, { segment: newSegment as any })
      toast.success("Đã cập nhật phân khúc khách hàng")
    } catch (error) {
      toast.error("Không thể cập nhật")
    }
  }

  return (
    <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h1>
              <p className="text-muted-foreground">
                CRM và phân tích khách hàng chi tiết
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={exportCustomers}>
                <Users className="h-4 w-4 mr-2" />
                Xuất danh sách
              </Button>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Thêm khách hàng
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.newCustomers} khách mới tháng này
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Khách hàng VIP</CardTitle>
                <Award className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.vipCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.vipCustomers / stats.totalCustomers) * 100)}% tổng số
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh thu trung bình</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {(stats.averageOrderValue / 1000).toFixed(0)}K
                </div>
                <p className="text-xs text-muted-foreground">
                  VNĐ mỗi đơn hàng
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ giữ chân</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.retentionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Khách hàng quay lại
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">Danh sách</TabsTrigger>
              <TabsTrigger value="segments">Phân khúc</TabsTrigger>
              <TabsTrigger value="analytics">Phân tích</TabsTrigger>
              <TabsTrigger value="loyalty">Chương trình thành viên</TabsTrigger>
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
                        placeholder="Tìm kiếm tên, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <select
                      value={selectedSegment}
                      onChange={(e) => setSelectedSegment(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">Tất cả phân khúc</option>
                      <option value="new">Khách mới</option>
                      <option value="regular">Thường xuyên</option>
                      <option value="vip">VIP</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Customers Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách khách hàng</CardTitle>
                  <CardDescription>
                    {filteredCustomers.length} khách hàng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Khách hàng</th>
                          <th className="text-left py-2">Phân khúc</th>
                          <th className="text-center py-2">Đơn hàng</th>
                          <th className="text-center py-2">Tổng chi tiêu</th>
                          <th className="text-center py-2">Điểm thành viên</th>
                          <th className="text-center py-2">Đăng nhập cuối</th>
                          <th className="text-center py-2">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={7} className="text-center py-8">Đang tải...</td>
                          </tr>
                        ) : filteredCustomers.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-muted-foreground">
                              Không có dữ liệu
                            </td>
                          </tr>
                        ) : (
                          filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="border-b hover:bg-muted/50">
                              <td className="py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={customer.avatar} />
                                    <AvatarFallback>
                                      {customer.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{customer.name}</p>
                                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                                    {customer.phone && (
                                      <p className="text-xs text-muted-foreground">{customer.phone}</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3">
                                <Badge className={getSegmentColor(customer.segment)}>
                                  {getSegmentLabel(customer.segment)}
                                </Badge>
                              </td>
                              <td className="py-3 text-center font-bold">
                                {customer.totalOrders}
                              </td>
                              <td className="py-3 text-center font-bold text-green-600">
                                {customer.totalSpent.toLocaleString('vi-VN')}đ
                              </td>
                              <td className="py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span>{customer.loyaltyPoints}</span>
                                </div>
                              </td>
                              <td className="py-3 text-center text-sm text-muted-foreground">
                                {customer.lastLogin ? 
                                  format(customer.lastLogin, "dd/MM/yyyy", { locale: vi }) : 
                                  "Chưa có"
                                }
                              </td>
                              <td className="py-3">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleViewDetails(customer)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleSendEmail(customer)}
                                  >
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <MessageCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Segments Tab */}
            <TabsContent value="segments" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { segment: "new", label: "Khách mới", icon: UserPlus, color: "blue" },
                  { segment: "regular", label: "Thường xuyên", icon: Users, color: "green" },
                  { segment: "vip", label: "VIP", icon: Award, color: "purple" },
                  { segment: "inactive", label: "Không hoạt động", icon: Clock, color: "gray" }
                ].map(({ segment, label, icon: Icon, color }) => {
                  const count = customers.filter(c => c.segment === segment).length
                  const totalSpent = customers.filter(c => c.segment === segment)
                    .reduce((sum, c) => sum + c.totalSpent, 0)
                  
                  return (
                    <Card key={segment}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className={`h-5 w-5 text-${color}-600`} />
                          {label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Số lượng:</span>
                            <span className="font-bold">{count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Tổng chi tiêu:</span>
                            <span className="font-bold text-green-600">
                              {(totalSpent / 1000000).toFixed(1)}M
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Trung bình:</span>
                            <span className="font-bold">
                              {count > 0 ? (totalSpent / count / 1000).toFixed(0) + "K" : "0"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Biểu đồ phân khúc khách hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Biểu đồ phân khúc sẽ được hiển thị ở đây
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Khách hàng tiềm năng nhất</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {customers
                        .sort((a, b) => b.totalSpent - a.totalSpent)
                        .slice(0, 5)
                        .map((customer, index) => (
                          <div key={customer.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-muted-foreground">
                                #{index + 1}
                              </span>
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={customer.avatar} />
                                <AvatarFallback className="text-xs">
                                  {customer.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{customer.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {customer.totalOrders} đơn hàng
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">
                                {(customer.totalSpent / 1000).toFixed(0)}K
                              </p>
                              <Badge className={getSegmentColor(customer.segment)}>
                                {getSegmentLabel(customer.segment)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Loyalty Tab */}
            <TabsContent value="loyalty" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="h-5 w-5 mr-2" />
                    Chương trình thành viên
                  </CardTitle>
                  <CardDescription>
                    Quản lý điểm thưởng và ưu đãi cho khách hàng thân thiết
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Thành viên Đồng</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>• Điểm thưởng 1% giá trị đơn hàng</div>
                          <div>• Miễn phí vận chuyển từ 300K</div>
                          <div>• Sinh nhật giảm 10%</div>
                          <div className="pt-2 font-bold">
                            {customers.filter(c => c.loyaltyPoints < 1000).length} thành viên
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Thành viên Bạc</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>• Điểm thưởng 2% giá trị đơn hàng</div>
                          <div>• Miễn phí vận chuyển từ 200K</div>
                          <div>• Sinh nhật giảm 15%</div>
                          <div className="pt-2 font-bold">
                            {customers.filter(c => c.loyaltyPoints >= 1000 && c.loyaltyPoints < 5000).length} thành viên
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Thành viên Vàng</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>• Điểm thưởng 3% giá trị đơn hàng</div>
                          <div>• Miễn phí vận chuyển toàn quốc</div>
                          <div>• Sinh nhật giảm 20%</div>
                          <div className="pt-2 font-bold">
                            {customers.filter(c => c.loyaltyPoints >= 5000).length} thành viên
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Customer Details Dialog */}
          {selectedCustomer && (
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedCustomer.avatar} />
                      <AvatarFallback>
                        {selectedCustomer.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                      <Badge className={getSegmentColor(selectedCustomer.segment)}>
                        {getSegmentLabel(selectedCustomer.segment)}
                      </Badge>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedCustomer.email}</span>
                      </div>
                      {selectedCustomer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCustomer.phone}</span>
                        </div>
                      )}
                      {selectedCustomer.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCustomer.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Đăng ký: {format(selectedCustomer.registeredAt, "dd/MM/yyyy", { locale: vi })}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-bold">
                          {selectedCustomer.totalOrders} đơn hàng
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-bold text-green-600">
                          {selectedCustomer.totalSpent.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-bold text-yellow-600">
                          {selectedCustomer.loyaltyPoints} điểm
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          TB: {selectedCustomer.averageOrderValue.toLocaleString('vi-VN')}đ/đơn
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedCustomer.notes && (
                    <div>
                      <Label>Ghi chú:</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedCustomer.notes}
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                    Đóng
                  </Button>
                  <Button onClick={() => handleSendEmail(selectedCustomer)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Gửi email
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Send Email Dialog */}
          <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  Gửi email cho {selectedCustomer?.name}
                </DialogTitle>
                <DialogDescription>
                  Gửi email marketing hoặc thông báo đến khách hàng
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email-subject">Tiêu đề</Label>
                  <Input
                    id="email-subject"
                    value={emailContent.subject}
                    onChange={(e) => setEmailContent({...emailContent, subject: e.target.value})}
                    placeholder="Nhập tiêu đề email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email-message">Nội dung</Label>
                  <Textarea
                    id="email-message"
                    value={emailContent.message}
                    onChange={(e) => setEmailContent({...emailContent, message: e.target.value})}
                    placeholder="Nhập nội dung email..."
                    rows={6}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={submitEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi email
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
  )
}
