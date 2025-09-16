"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, MoreHorizontal, Edit, Trash2, Loader2, Check, X, Search, Wrench } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useServiceTypes } from "@/hooks/use-service-types"
import { ServiceTypeFormDialog } from "@/components/services/service-type-form-dialog"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale/vi"
import { Input } from "@/components/ui/input"

// Define a type-safe error interface for API errors
interface ApiError {
  response?: {
    status: number
    data?: unknown
  }
  message?: string
}

// Define the form data type directly
type ServiceTypeFormData = {
  name: string
  description?: string
  icon?: string
  color?: string
  isActive: boolean
  sortOrder: number
}

interface ServiceType extends ServiceTypeFormData {
  id: string
  slug: string
  createdAt: string
  updatedAt: string
}

export default function ServiceTypesManager() {
  const {
    serviceTypes,
    loading,
    error,
    createServiceType,
    updateServiceType,
    deleteServiceType,
    toggleServiceTypeStatus,
    refresh: refreshServiceTypes
  } = useServiceTypes()

  console.log('ServiceTypes Debug:', {
    serviceTypes,
    loading,
    error,
    serviceTypesLength: serviceTypes?.length || 0
  })

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter service types based on search query
  const filteredServiceTypes = useMemo(() => {
    if (!serviceTypes) return []
    if (!searchQuery.trim()) return serviceTypes

    const query = searchQuery.toLowerCase()
    return serviceTypes.filter((serviceType) =>
      serviceType.name.toLowerCase().includes(query) ||
      serviceType.description?.toLowerCase().includes(query) ||
      serviceType.slug.toLowerCase().includes(query)
    )
  }, [serviceTypes, searchQuery])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim()
  }

  const handleCreateServiceType = useCallback(async (data: {
    name: string
    description?: string
    icon?: string
    color?: string
    isActive?: boolean
    sortOrder?: number
  }) => {
    try {
      // Add slug and ensure proper data structure
      const serviceTypeData = {
        ...data,
        slug: generateSlug(data.name),
        // Ensure required fields have default values
        isActive: data.isActive !== false, // Default to true if not specified
        sortOrder: data.sortOrder || 0
      }

      await createServiceType(serviceTypeData)
      toast.success('Tạo loại dịch vụ thành công', {
        description: `Loại dịch vụ "${data.name}" đã được tạo.`
      })
      setIsCreateDialogOpen(false)
      refreshServiceTypes() // Refresh the list
    } catch (error: unknown) {
      console.error('Error creating service type:', error)

      // Handle specific error types
      const axiosError = error as ApiError
      if (axiosError?.response?.status === 400) {
        toast.error('Dữ liệu không hợp lệ', {
          description: 'Vui lòng kiểm tra lại thông tin đã nhập.'
        })
      } else if (axiosError?.response?.status === 409) {
        toast.error('Trùng lặp', {
          description: 'Loại dịch vụ với tên này đã tồn tại.'
        })
      } else if (axiosError?.response?.status === 401) {
        toast.error('Không có quyền', {
          description: 'Bạn không có quyền thực hiện thao tác này.'
        })
      } else {
        toast.error('Không thể tạo loại dịch vụ', {
          description: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'
        })
      }
      throw error // Re-throw to allow the form to handle the error state
    }
  }, [createServiceType, refreshServiceTypes])

  const handleUpdateServiceType = useCallback(async (id: string, data: {
    name: string
    description?: string
    icon?: string
    color?: string
    isActive?: boolean
    sortOrder?: number
  }) => {
    try {
      await updateServiceType(id, data)
      toast.success('Cập nhật loại dịch vụ thành công', {
        description: `Loại dịch vụ đã được cập nhật.`
      })
      setIsEditDialogOpen(false)
      setSelectedServiceType(null)
      refreshServiceTypes() // Refresh the list
    } catch (error: unknown) {
      console.error('Error updating service type:', error)
      const axiosError = error as ApiError
      if (axiosError?.response?.status === 404) {
        toast.error('Không tìm thấy', {
          description: 'Loại dịch vụ không tồn tại.'
        })
      } else if (axiosError?.response?.status === 400) {
        toast.error('Dữ liệu không hợp lệ', {
          description: 'Vui lòng kiểm tra lại thông tin đã nhập.'
        })
      } else {
        toast.error('Không thể cập nhật loại dịch vụ', {
          description: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'
        })
      }
    }
  }, [updateServiceType, refreshServiceTypes])

  const handleDeleteServiceType = useCallback(async (id: string) => {
    try {
      setIsDeleting(id)
      await deleteServiceType(id)
      toast.success('Xóa loại dịch vụ thành công', {
        description: 'Loại dịch vụ đã được xóa khỏi hệ thống.'
      })
      refreshServiceTypes() // Refresh the list
    } catch (error: unknown) {
      console.error('Error deleting service type:', error)
      const axiosError = error as ApiError
      if (axiosError?.response?.status === 400) {
        toast.error('Không thể xóa', {
          description: 'Loại dịch vụ này đang được sử dụng và không thể xóa.'
        })
      } else if (axiosError?.response?.status === 404) {
        toast.error('Không tìm thấy', {
          description: 'Loại dịch vụ không tồn tại.'
        })
      } else {
        toast.error('Không thể xóa loại dịch vụ', {
          description: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'
        })
      }
    } finally {
      setIsDeleting(null)
    }
  }, [deleteServiceType, refreshServiceTypes])

  const handleToggleStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      await toggleServiceTypeStatus(id, isActive)
      toast.success(isActive ? 'Đã ngừng hoạt động' : 'Đã kích hoạt', {
        description: `Loại dịch vụ đã được ${isActive ? 'ngừng hoạt động' : 'kích hoạt'}.`
      })
      refreshServiceTypes() // Refresh the list
    } catch (error: unknown) {
      console.error('Error toggling service type status:', error)
      const axiosError = error as ApiError
      if (axiosError?.response?.status === 404) {
        toast.error('Không tìm thấy', {
          description: 'Loại dịch vụ không tồn tại.'
        })
      } else {
        toast.error('Không thể thay đổi trạng thái', {
          description: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'
        })
      }
    }
  }, [toggleServiceTypeStatus, refreshServiceTypes])

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="h-10 w-40 bg-gray-200 animate-pulse rounded"></div>
        </div>

        <div className="rounded-md border">
          <div className="p-6 space-y-4">
            {/* Table Header Skeleton */}
            <div className="flex justify-between items-center py-4 border-b">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>

            {/* Table Rows Skeleton */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-4 border-b">
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-48 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý Loại Dịch vụ</h1>
            <p className="text-muted-foreground">
              Quản lý các loại dịch vụ của Audio Tài Lộc
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm loại dịch vụ
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm loại dịch vụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách loại dịch vụ</CardTitle>
            <CardDescription>
              Tất cả các loại dịch vụ đang có trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên loại dịch vụ</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Thứ tự</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServiceTypes.map((serviceType) => (
                    <TableRow key={serviceType.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{serviceType.name}</div>
                          {serviceType.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {serviceType.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded font-mono" title={serviceType.slug}>
                          {serviceType.slug}
                        </code>
                      </TableCell>
                      <TableCell>{serviceType.sortOrder}</TableCell>
                      <TableCell>
                        <Badge variant={serviceType.isActive ? 'default' : 'secondary'}>
                          {serviceType.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                        </Badge>
                      </TableCell>
                      <TableCell suppressHydrationWarning>
                        {serviceType.createdAt ? formatDistanceToNow(new Date(serviceType.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        }) : 'Chưa có thông tin'}
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
                                setSelectedServiceType(serviceType);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              onClick={() => handleToggleStatus(serviceType.id, serviceType.isActive)}
                              disabled={isDeleting === serviceType.id}
                            >
                              {isDeleting === serviceType.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : serviceType.isActive ? (
                                <X className="mr-2 h-4 w-4" />
                              ) : (
                                <Check className="mr-2 h-4 w-4" />
                              )}
                              {serviceType.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                if (confirm('Bạn có chắc chắn muốn xóa loại dịch vụ này?')) {
                                  handleDeleteServiceType(serviceType.id);
                                }
                              }}
                              disabled={isDeleting === serviceType.id}
                            >
                              {isDeleting === serviceType.id ? (
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

                  {filteredServiceTypes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                          <Wrench className="h-12 w-12 text-gray-400" />
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {searchQuery ? 'Không tìm thấy loại dịch vụ' : 'Chưa có loại dịch vụ nào'}
                            </h3>
                            <p className="text-sm text-gray-500 max-w-md">
                              {searchQuery
                                ? `Không tìm thấy loại dịch vụ nào khớp với "${searchQuery}". Hãy thử từ khóa khác.`
                                : 'Bắt đầu bằng cách tạo loại dịch vụ đầu tiên cho hệ thống của bạn.'
                              }
                            </p>
                          </div>
                          {!searchQuery && (
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Tạo loại dịch vụ đầu tiên
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <ServiceTypeFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateServiceType}
        />

        {selectedServiceType && (
          <ServiceTypeFormDialog
            serviceType={selectedServiceType}
            open={isEditDialogOpen}
            onOpenChange={(open) => {
              if (!open) setSelectedServiceType(null);
              setIsEditDialogOpen(open);
            }}
            onSubmit={(data) => handleUpdateServiceType(selectedServiceType.id, data)}
          />
        )}
      </div>
    </>
  )
}