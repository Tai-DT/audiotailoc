"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

export default function ReportsPage() {
  const {
    reports,
    generateReport,
    downloadReport,
    fetchReports,
    scheduleReport
  } = useReports()

  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedType, setSelectedType] = useState("all")

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const reportTypes = [
    {
      id: 'sales',
      title: 'Báo cáo Doanh số',
      description: 'Tổng hợp doanh số bán hàng',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-green-500'
    },
    {
      id: 'inventory',
      title: 'Báo cáo Tồn kho',
      description: 'Tình trạng tồn kho sản phẩm',
      icon: <Package className="h-6 w-6" />,
      color: 'text-blue-500'
    },
    {
      id: 'customers',
      title: 'Báo cáo Khách hàng',
      description: 'Thống kê khách hàng',
      icon: <Users className="h-6 w-6" />,
      color: 'text-purple-500'
    },
    {
      id: 'services',
      title: 'Báo cáo Dịch vụ',
      description: 'Hiệu suất dịch vụ',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-orange-500'
    },
    {
      id: 'financial',
      title: 'Báo cáo Tài chính',
      description: 'Tổng hợp tài chính',
      icon: <FilePieChart className="h-6 w-6" />,
      color: 'text-red-500'
    },
    {
      id: 'analytics',
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
    await generateReport({
      type,
      period: selectedPeriod,
      format: 'pdf'
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
                <select
                  className="px-3 py-2 border rounded-md"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="today">Hôm nay</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                  <option value="quarter">Quý này</option>
                  <option value="year">Năm nay</option>
                  <option value="custom">Tùy chỉnh</option>
                </select>
                
                <select
                  className="px-3 py-2 border rounded-md"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">Tất cả loại</option>
                  <option value="sales">Doanh số</option>
                  <option value="inventory">Tồn kho</option>
                  <option value="customers">Khách hàng</option>
                  <option value="services">Dịch vụ</option>
                  <option value="financial">Tài chính</option>
                </select>
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
                {reports.length > 0 ? (
                  reports.map((report) => (
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
                              onClick={() => downloadReport(report.id)}
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
