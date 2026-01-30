"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CreditCard,
  Search,
  MoreHorizontal,
  Eye,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Clock
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { format } from "date-fns"
import { vi } from "date-fns/locale/vi"
import { usePayments, type Payment } from "@/hooks/use-payments"

export default function PaymentsManager() {
  const {
    payments,
    stats,
    loading,
    fetchPayments,
    fetchStats,
    processRefund
  } = usePayments()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [providerFilter, setProviderFilter] = useState<string>("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false)
  const [refundAmount, setRefundAmount] = useState("")
  const [refundReason, setRefundReason] = useState("")
  const [isProcessingRefund, setIsProcessingRefund] = useState(false)

  useEffect(() => {
    fetchPayments()
    fetchStats()
  }, [fetchPayments, fetchStats])

  // Filter payments - ensure payments is an array
  const paymentsArray = Array.isArray(payments) ? payments : []
  const filteredPayments = paymentsArray.filter(payment => {
    const matchesSearch = payment.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesProvider = providerFilter === "all" || payment.provider === providerFilter
    return matchesSearch && matchesStatus && matchesProvider
  })

  // Handle refund
  const handleRefund = async () => {
    if (!selectedPayment || !refundAmount) return

    try {
      setIsProcessingRefund(true)
      await processRefund({
        paymentId: selectedPayment.id,
        amountCents: Math.round(parseFloat(refundAmount) * 100),
        reason: refundReason
      })

      setIsRefundDialogOpen(false)
      setRefundAmount("")
      setRefundReason("")
      setSelectedPayment(null)
    } finally {
      setIsProcessingRefund(false)
    }
  }

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ thanh toán</Badge>
      case 'PROCESSING':
        return <Badge className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>
      case 'FAILED':
        return <Badge className="bg-red-100 text-red-800">Thất bại</Badge>
      case 'REFUNDED':
        return <Badge className="bg-blue-100 text-blue-800">Đã hoàn tiền</Badge>
      case 'CANCELLED':
      case 'CANCELED':
        return <Badge className="bg-gray-100 text-gray-800">Đã hủy</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Get provider badge
  const getProviderBadge = (provider: string) => {
    const colors = {
      'VNPAY': 'bg-blue-100 text-blue-800',
      'MOMO': 'bg-pink-100 text-pink-800',
      'PAYOS': 'bg-purple-100 text-purple-800',
      'COD': 'bg-gray-100 text-gray-800'
    }
    return <Badge className={colors[provider as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{provider}</Badge>
  }

  return (
    <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quản lý thanh toán</h1>
              <p className="text-muted-foreground">
                Theo dõi và quản lý tất cả giao dịch thanh toán
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={fetchPayments} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng thanh toán</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats ? stats.totalPayments.toLocaleString() : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tổng số giao dịch
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats ? `${(stats.totalRevenue / 100).toLocaleString()}đ` : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Doanh thu thực tế
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chờ thanh toán</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats ? stats.pendingPayments.toLocaleString() : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Giao dịch đang xử lý
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã hoàn tiền</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats ? `${(stats.refundedAmount / 100).toLocaleString()}đ` : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tổng tiền hoàn lại
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách thanh toán</CardTitle>
              <CardDescription>
                Tất cả giao dịch thanh toán trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm theo mã đơn hàng hoặc ID thanh toán..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="SUCCEEDED">Đã thanh toán</SelectItem>
                    <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                    <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                    <SelectItem value="FAILED">Thất bại</SelectItem>
                    <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={providerFilter} onValueChange={setProviderFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Nhà cung cấp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả nhà cung cấp</SelectItem>
                    <SelectItem value="VNPAY">VNPAY</SelectItem>
                    <SelectItem value="MOMO">MoMo</SelectItem>
                    <SelectItem value="PAYOS">PayOS</SelectItem>
                    <SelectItem value="COD">COD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payments Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Nhà cung cấp</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <CreditCard className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">Không tìm thấy thanh toán nào</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {payment.orderNo}
                          </TableCell>
                          <TableCell>
                            {getProviderBadge(payment.provider)}
                          </TableCell>
                          <TableCell>
                            {(payment.amountCents / 100).toLocaleString()}đ
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(payment.status)}
                          </TableCell>
                          <TableCell>
                            {format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedPayment(payment)
                                    setIsDetailDialogOpen(true)
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Chi tiết
                                </DropdownMenuItem>
                                {payment.status === 'SUCCEEDED' && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedPayment(payment)
                                      setIsRefundDialogOpen(true)
                                    }}
                                  >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Hoàn tiền
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Payment Detail Dialog */}
          <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Chi tiết thanh toán</DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết về giao dịch thanh toán
                </DialogDescription>
              </DialogHeader>
              {selectedPayment && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Mã thanh toán</label>
                      <p className="text-sm text-muted-foreground">{selectedPayment.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mã đơn hàng</label>
                      <p className="text-sm text-muted-foreground">{selectedPayment.orderNo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Nhà cung cấp</label>
                      <div className="mt-1">{getProviderBadge(selectedPayment.provider)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Trạng thái</label>
                      <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Số tiền</label>
                      <p className="text-sm text-muted-foreground">
                        {(selectedPayment.amountCents / 100).toLocaleString()}đ
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Thời gian tạo</label>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(selectedPayment.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
                      </p>
                    </div>
                    {selectedPayment.paidAt && (
                      <div>
                        <label className="text-sm font-medium">Thời gian thanh toán</label>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(selectedPayment.paidAt), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
                        </p>
                      </div>
                    )}
                    {selectedPayment.refundedAt && (
                      <div>
                        <label className="text-sm font-medium">Thời gian hoàn tiền</label>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(selectedPayment.refundedAt), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
                        </p>
                      </div>
                    )}
                    {selectedPayment.refundAmountCents && (
                      <div>
                        <label className="text-sm font-medium">Số tiền hoàn</label>
                        <p className="text-sm text-muted-foreground">
                          {(selectedPayment.refundAmountCents / 100).toLocaleString()}đ
                        </p>
                      </div>
                    )}
                    {selectedPayment.refundReason && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium">Lý do hoàn tiền</label>
                        <p className="text-sm text-muted-foreground">{selectedPayment.refundReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Refund Dialog */}
          <AlertDialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hoàn tiền</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn hoàn tiền cho giao dịch này không?
                  Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {selectedPayment && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Số tiền có thể hoàn:</span>
                      <span className="text-sm font-bold">
                        {(selectedPayment.amountCents / 100).toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Số tiền hoàn (VNĐ)</label>
                    <Input
                      type="number"
                      placeholder="Nhập số tiền cần hoàn"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lý do hoàn tiền</label>
                    <Input
                      placeholder="Nhập lý do hoàn tiền"
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRefund}
                  disabled={isProcessingRefund || !refundAmount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isProcessingRefund ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Xác nhận hoàn tiền'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
  )
}
