"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Loader2, Check, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useServices } from "@/hooks/use-services"
import { ServiceFormDialog } from "@/components/services/service-form-dialog"
import { ServiceDetailDialog } from "@/components/services/service-detail-dialog"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale/vi"

export default function ServicesManager() {
  const {
    services,
    loading,
    error,
    categories,
    types,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
    refresh: refreshServices
  } = useServices()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim()
  }

  const handleCreateService = async (data: any) => {
    try {
      // Add slug and ensure proper data structure
      const serviceData = {
        ...data,
        slug: generateSlug(data.name),
        // Ensure required fields have default values
        basePriceCents: data.basePriceCents || 0,
        estimatedDuration: data.estimatedDuration || 60, // Default to 60 minutes
        isActive: data.isActive !== false // Default to true if not specified
      }
      
      await createService(serviceData)
      toast.success('Tạo dịch vụ thành công')
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating service:', error)
      toast.error('Không thể tạo dịch vụ. Vui lòng thử lại.')
      throw error // Re-throw to allow the form to handle the error state
    }
  }

  const handleUpdateService = async (id: string, data: any) => {
    try {
      await updateService(id, data)
      setIsEditDialogOpen(false)
      setSelectedService(null)
    } catch (error) {
      console.error('Error updating service:', error)
    }
  }

  const handleDeleteService = async (id: string) => {
    try {
      setIsDeleting(id)
      await deleteService(id)
    } catch (error) {
      console.error('Error deleting service:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleServiceStatus(id, isActive)
    } catch (error) {
      console.error('Error toggling service status:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getTypeName = (typeId: string) => {
    const type = types.find(t => t.id === typeId);
    return type ? type.name : 'Unknown';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center p-8">
            <div className="space-y-4">
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-32 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Quản lý Dịch vụ</h1>
              <p className="text-muted-foreground">
                Quản lý các dịch vụ của Audio Tài Lộc
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm dịch vụ
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách dịch vụ</CardTitle>
              <CardDescription>
                Tất cả các dịch vụ đang có trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên dịch vụ</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-4">
                            {service.imageUrl && (
                              <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                <img
                                  src={service.imageUrl}
                                  alt={service.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {service.shortDescription || service.description?.substring(0, 50)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getCategoryName(service.categoryId)}</TableCell>
                        <TableCell>{getTypeName(service.typeId)}</TableCell>
                        <TableCell>{formatPrice(service.price)}</TableCell>
                        <TableCell>{service.duration} phút</TableCell>
                        <TableCell>
                          <Badge variant={service.isActive ? 'default' : 'secondary'}>
                            {service.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(service.createdAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Mở menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedService(service);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedService(service);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleToggleStatus(service.id, service.isActive)}
                                disabled={isDeleting === service.id}
                              >
                                {isDeleting === service.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : service.isActive ? (
                                  <X className="mr-2 h-4 w-4" />
                                ) : (
                                  <Check className="mr-2 h-4 w-4" />
                                )}
                                {service.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
                                    handleDeleteService(service.id);
                                  }
                                }}
                                disabled={isDeleting === service.id}
                              >
                                {isDeleting === service.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <ServiceFormDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onSubmit={handleCreateService}
            categories={categories}
            types={types}
          />

          {selectedService && (
            <>
              <ServiceDetailDialog
                serviceId={selectedService.id}
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                categories={categories}
                types={types}
              />
              <ServiceFormDialog
                service={selectedService}
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                  if (!open) setSelectedService(null);
                  setIsEditDialogOpen(open);
                }}
                onSubmit={(data: any) => handleUpdateService(selectedService.id, data)}
                categories={categories}
                types={types}
              />
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
