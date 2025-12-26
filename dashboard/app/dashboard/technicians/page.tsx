"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Edit, Trash2, Loader2, Check, X } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale/vi"

interface Technician {
  id: string
  name: string
  email?: string
  phone?: string
  skills?: string[]
  regions?: string[]
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const fetchTechnicians = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/technicians')
      const data: any = response.data

      // Handle different response formats:
      // 1. Wrapped format: { success: true, data: { total, page, pageSize, technicians } }
      // 2. Direct format: { technicians: [...] }
      let techniciansList: Technician[] = []

      if (data.success && data.data) {
        if (data.data.technicians && Array.isArray(data.data.technicians)) {
          techniciansList = data.data.technicians
        } else if (Array.isArray(data.data)) {
          techniciansList = data.data
        }
      } else if (data.technicians && Array.isArray(data.technicians)) {
        techniciansList = data.technicians
      } else if (Array.isArray(data)) {
        techniciansList = data
      } else if (data.data && Array.isArray(data.data)) {
        techniciansList = data.data
      } else if (data.items && Array.isArray(data.items)) {
        techniciansList = data.items
      }

      setTechnicians(techniciansList)
    } catch (error) {
      console.error('Failed to fetch technicians:', error)
      toast.error('Không thể tải danh sách kỹ thuật viên')
      setTechnicians([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTechnicians()
  }, [])

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.patch(`/technicians/${id}`, { isAvailable: !currentStatus })
      toast.success(`Đã ${!currentStatus ? 'kích hoạt' : 'tắt'} kỹ thuật viên`)
      fetchTechnicians()
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa kỹ thuật viên này?')) return

    try {
      setIsDeleting(id)
      await apiClient.delete(`/technicians/${id}`)
      toast.success('Đã xóa kỹ thuật viên')
      fetchTechnicians()
    } catch (error) {
      toast.error('Không thể xóa kỹ thuật viên')
    } finally {
      setIsDeleting(null)
    }
  }

  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.phone?.includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Kỹ thuật viên</h2>
          <p className="text-muted-foreground">
            Quản lý thông tin và trạng thái kỹ thuật viên
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm kỹ thuật viên
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách kỹ thuật viên</CardTitle>
              <CardDescription>
                Tất cả kỹ thuật viên trong hệ thống
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTechnicians.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'Không tìm thấy kỹ thuật viên' : 'Chưa có kỹ thuật viên nào'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Kỹ năng</TableHead>
                  <TableHead>Khu vực</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTechnicians.map((tech) => (
                  <TableRow key={tech.id}>
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell>{tech.email || 'N/A'}</TableCell>
                    <TableCell>{tech.phone || 'N/A'}</TableCell>
                    <TableCell>
                      {tech.skills && tech.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {tech.skills.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {tech.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{tech.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      {tech.regions && tech.regions.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {tech.regions.slice(0, 2).map((region, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {region}
                            </Badge>
                          ))}
                          {tech.regions.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{tech.regions.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={tech.isAvailable ? "default" : "secondary"}>
                        {tech.isAvailable ? "Sẵn sàng" : "Không sẵn sàng"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(tech.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAvailability(tech.id, tech.isAvailable)}
                        >
                          {tech.isAvailable ? (
                            <X className="h-4 w-4 text-red-500" />
                          ) : (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tech.id)}
                          disabled={isDeleting === tech.id}
                        >
                          {isDeleting === tech.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
