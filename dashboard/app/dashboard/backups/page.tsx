"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Database,
  Download,
  Trash2,
  RefreshCw,
  Play,
  Clock,
  HardDrive,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { useBackups } from "@/hooks/use-backups"
import { format } from "date-fns"
import { vi } from "date-fns/locale/vi"

export default function BackupsPage() {
  const {
    backups,
    status,
    createBackup,
    restoreBackup,
    deleteBackup,
    downloadBackup,
    fetchBackups,
    fetchStatus
  } = useBackups()

  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchBackups()
    fetchStatus()
  }, [fetchBackups, fetchStatus])

  const handleCreateBackup = async (type: 'full' | 'incremental') => {
    setCreating(true)
    try {
      await createBackup(type)
    } finally {
      setCreating(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Hoàn thành</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Thất bại</Badge>
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Đang xử lý</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Sao lưu</h1>
          <p className="text-muted-foreground">
            Tạo và quản lý các bản sao lưu dữ liệu hệ thống
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => handleCreateBackup('incremental')} disabled={creating || status?.isBackupInProgress}>
            <Database className="h-4 w-4 mr-2" />
            Sao lưu tăng dần
          </Button>
          <Button onClick={() => handleCreateBackup('full')} disabled={creating || status?.isBackupInProgress}>
            <HardDrive className="h-4 w-4 mr-2" />
            Sao lưu toàn bộ
          </Button>
          <Button onClick={fetchBackups} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số backup</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status ? status.totalBackups : '...'}
            </div>
            <p className="text-xs text-muted-foreground">
              Bản sao lưu có sẵn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dung lượng</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status ? formatFileSize(status.totalSize) : '...'}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng dung lượng sử dụng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backup thất bại</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {status ? status.failedBackups : '...'}
            </div>
            <p className="text-xs text-muted-foreground">
              Cần xem xét
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backup tiếp theo</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status?.nextScheduledBackup ? format(new Date(status.nextScheduledBackup), 'HH:mm', { locale: vi }) : 'Không có'}
            </div>
            <p className="text-xs text-muted-foreground">
              {status?.nextScheduledBackup ? format(new Date(status.nextScheduledBackup), 'dd/MM/yyyy', { locale: vi }) : 'Lịch tự động'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Status */}
      {status?.isBackupInProgress && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 animate-spin text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Đang tiến hành sao lưu</p>
                <p className="text-sm text-yellow-600">Vui lòng không tắt hệ thống trong quá trình này</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Backup</CardTitle>
          <CardDescription>
            Tất cả các bản sao lưu đã tạo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên backup</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Kích thước</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="w-[100px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.length > 0 ? (
                  backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-medium">{backup.name}</TableCell>
                      <TableCell>
                        <Badge variant={backup.type === 'full' ? 'default' : 'secondary'}>
                          {backup.type === 'full' ? 'Toàn bộ' : 'Tăng dần'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(backup.size)}</TableCell>
                      <TableCell>{getStatusBadge(backup.status)}</TableCell>
                      <TableCell>
                        {format(new Date(backup.timestamp), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadBackup(backup.id)}
                            disabled={backup.status !== 'completed'}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (confirm('Bạn có chắc chắn muốn khôi phục backup này? Dữ liệu hiện tại sẽ bị thay thế.')) {
                                restoreBackup(backup.id)
                              }
                            }}
                            disabled={backup.status !== 'completed'}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (confirm('Bạn có chắc chắn muốn xóa backup này?')) {
                                deleteBackup(backup.id)
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Chưa có bản sao lưu nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
