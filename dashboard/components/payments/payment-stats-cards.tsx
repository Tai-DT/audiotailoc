"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react"
import { usePayments } from "@/hooks/use-payments"

interface PaymentStatsCardsProps {
  className?: string
}

export function PaymentStatsCards({ className }: PaymentStatsCardsProps) {
  const { stats } = usePayments()

  if (!stats) {
    return (
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const successRate = stats.totalPayments > 0
    ? ((stats.totalPayments - stats.failedPayments) / stats.totalPayments) * 100
    : 0

  const pendingRate = stats.totalPayments > 0
    ? (stats.pendingPayments / stats.totalPayments) * 100
    : 0

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {/* Total Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng thanh toán</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalPayments.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Tổng số giao dịch
          </p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {(stats.totalRevenue / 100).toLocaleString()}đ
          </div>
          <p className="text-xs text-muted-foreground">
            Doanh thu thực tế
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-600">+12.5%</span>
          </div>
        </CardContent>
      </Card>

      {/* Pending Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chờ thanh toán</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pendingPayments.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Giao dịch đang xử lý
          </p>
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">
              {pendingRate.toFixed(1)}% của tổng số
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tỷ lệ thành công</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {successRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalPayments - stats.failedPayments} / {stats.totalPayments} giao dịch
          </p>
        </CardContent>
      </Card>

      {/* Failed Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Thanh toán thất bại</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {stats.failedPayments.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Cần theo dõi và xử lý
          </p>
          {stats.failedPayments > 0 && (
            <Badge variant="destructive" className="mt-2">
              Cần xử lý
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Refunded Amount */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đã hoàn tiền</CardTitle>
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {(stats.refundedAmount / 100).toLocaleString()}đ
          </div>
          <p className="text-xs text-muted-foreground">
            Tổng tiền hoàn lại
          </p>
          <div className="flex items-center mt-2">
            <TrendingDown className="h-3 w-3 text-orange-500 mr-1" />
            <span className="text-xs text-orange-600">Hoàn tiền</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
