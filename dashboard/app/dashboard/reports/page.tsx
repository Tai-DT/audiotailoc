"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  RefreshCw,
  FilePieChart,
  BarChart3
} from "lucide-react"
import { useReports } from "@/hooks/use-reports"
import { format } from "date-fns"
import { vi } from "date-fns/locale/vi"

function toYmdLocal(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getSalesDateRange(period: string): { startDate?: string; endDate?: string } {
  const now = new Date()
  const end = new Date(now)

  switch (period) {
    case 'today': {
      const start = new Date(now)
      return { startDate: toYmdLocal(start), endDate: toYmdLocal(end) }
    }
    case 'week': {
      // Monday as start of week
      const start = new Date(now)
      const day = start.getDay() // 0 (Sun) .. 6 (Sat)
      const diffToMonday = (day + 6) % 7
      start.setDate(start.getDate() - diffToMonday)
      return { startDate: toYmdLocal(start), endDate: toYmdLocal(end) }
    }
    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return { startDate: toYmdLocal(start), endDate: toYmdLocal(end) }
    }
    case 'quarter': {
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3
      const start = new Date(now.getFullYear(), quarterStartMonth, 1)
      return { startDate: toYmdLocal(start), endDate: toYmdLocal(end) }
    }
    case 'year': {
      const start = new Date(now.getFullYear(), 0, 1)
      return { startDate: toYmdLocal(start), endDate: toYmdLocal(end) }
    }
    default:
      return {}
  }
}

export default function ReportsPage() {
  const {
    reports,
    loading,
    generateReport,
    downloadReport,
    fetchReports,
    scheduleReport
  } = useReports()

  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv'>('csv')

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const reportTypes = [
    {
      id: 'SALES',
      title: 'Báo cáo Doanh số',
      description: 'Tổng hợp doanh số bán hàng',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-green-500'
    },
    {
      id: 'INVENTORY',
      title: 'Báo cáo Tồn kho',
      description: 'Tình trạng tồn kho sản phẩm',
      icon: <Package className="h-6 w-6" />,
      color: 'text-blue-500'
    },
    {
      id: 'CUSTOMERS',
      title: 'Báo cáo Khách hàng',
      description: 'Thống kê khách hàng',
      icon: <Users className="h-6 w-6" />,
      color: 'text-purple-500'
    },
    {
      id: 'SERVICES',
      title: 'Báo cáo Dịch vụ',
      description: 'Hiệu suất dịch vụ',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-orange-500'
    },
    {
      id: 'PRODUCTS',
      title: 'Báo cáo Tài chính',
      description: 'Tổng hợp tài chính',
      icon: <FilePieChart className="h-6 w-6" />,
      color: 'text-red-500'
    },
    {
      id: 'CUSTOM',
      title: 'Báo cáo Phân tích',
      description: 'Phân tích xu hướng',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'text-indigo-500'
    }
  ]

  const getReportIcon = (type: string) => {
    const reportType = reportTypes.find(r => r.id === type)
    return reportType ? reportType.icon : <FileText className="h-4 w-4" />
  }

  const getFormatBadge = (format: string) => {
    switch (format) {
      case 'pdf':
        return <Badge className="bg-red-100 text-red-800">PDF</Badge>
      case 'excel':
        return <Badge className="bg-green-100 text-green-800">Excel</Badge>
      case 'csv':
        return <Badge className="bg-blue-100 text-blue-800">CSV</Badge>
      default:
        return <Badge variant="secondary">{format.toUpperCase()}</Badge>
    }
  }

  const handleGenerateReport = async (type: string) => {
    // Currently supported exports: SALES, INVENTORY, CUSTOMERS
    if (!['SALES', 'INVENTORY', 'CUSTOMERS'].includes(type)) {
      return
    }

    const salesRange = type === 'SALES' ? getSalesDateRange(selectedPeriod) : {}

    await generateReport({
      type: type as any,
      period: selectedPeriod,
      format: selectedFormat,
      ...salesRange,
    })
  }

  return (
    <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Báo cáo</h1>
              <p className="text-muted-foreground">
                Tạo và quản lý các báo cáo kinh doanh
              </p>
            </div>
            <Button onClick={fetchReports} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Tạo báo cáo nhanh</CardTitle>
              <CardDescription>
                Chọn loại báo cáo và khoảng thời gian để tạo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Khoảng thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hôm nay</SelectItem>
                    <SelectItem value="week">Tuần này</SelectItem>
                    <SelectItem value="month">Tháng này</SelectItem>
                    <SelectItem value="quarter">Quý này</SelectItem>
                    <SelectItem value="year">Năm nay</SelectItem>
                    <SelectItem value="custom">Tùy chỉnh</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedFormat} onValueChange={(v) => setSelectedFormat(v as any)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Định dạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Loại báo cáo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="SALES">Doanh số</SelectItem>
                    <SelectItem value="INVENTORY">Tồn kho</SelectItem>
                    <SelectItem value="CUSTOMERS">Khách hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reportTypes.map((report) => (
                  <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={report.color}>
                          {report.icon}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleGenerateReport(report.id)}
                          disabled={loading || !['SALES', 'INVENTORY', 'CUSTOMERS'].includes(report.id)}
                        >
                          Tạo báo cáo
                        </Button>
                      </div>
                      <h3 className="font-semibold">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {report.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo gần đây</CardTitle>
              <CardDescription>
                Các báo cáo đã tạo gần đây
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-5 w-5" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-56" />
                              <Skeleton className="h-4 w-40" />
                            </div>
                          </div>
                          <Skeleton className="h-9 w-24" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : reports.length > 0 ? (
                  reports
                    .filter((r) => selectedType === 'all' || r.type === (selectedType as any))
                    .map((report) => (
                    <Card key={report.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-muted-foreground">
                              {getReportIcon(report.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold">{report.name}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(report.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                </span>
                                {getFormatBadge(report.format)}
                                <Badge variant="outline">
                                  {report.period}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadReport(report)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Tải xuống
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      Chưa có báo cáo nào
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo định kỳ</CardTitle>
              <CardDescription>
                Cấu hình báo cáo tự động
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Báo cáo doanh số hàng tuần</p>
                      <p className="text-sm text-muted-foreground">
                        Gửi mỗi thứ 2 lúc 9:00 sáng
                      </p>
                    </div>
                  </div>
                  <Badge>Đang hoạt động</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Báo cáo tồn kho hàng tháng</p>
                      <p className="text-sm text-muted-foreground">
                        Gửi vào ngày 1 hàng tháng
                      </p>
                    </div>
                  </div>
                  <Badge>Đang hoạt động</Badge>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => scheduleReport({
                    type: 'sales',
                    schedule: 'weekly',
                    recipients: ['admin@audiotailoc.com']
                  })}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Thêm báo cáo định kỳ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
  )
}
