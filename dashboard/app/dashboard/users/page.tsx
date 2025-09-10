"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import {
  Users,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  X,
  Calendar
} from "lucide-react"
import { UserFormDialog } from "@/components/users/user-form-dialog"
import { UserDetailsDialog } from "@/components/users/user-details-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: string
  createdAt: string
  _count?: {
    orders: number
  }
}

export default function UsersPage() {
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [pageSize] = useState(10)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
  // Filter states
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("createdAt")
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiClient.getUsers({
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined
      })
      const data = response.data as { users: User[]; pagination: { total: number } }
      setUsers(data.users)
      setTotalUsers(data.pagination.total)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchTerm, roleFilter, statusFilter, startDate, endDate, sortBy, sortOrder])

  useEffect(() => {
    if (token) {
      apiClient.setToken(token)
      fetchUsers()
    }
  }, [token, currentPage, searchTerm, roleFilter, statusFilter, startDate, endDate, sortBy, sortOrder, fetchUsers])

  const handleDeleteUser = async (userId: string) => {
    try {
      if (!token) return
      apiClient.setToken(token)
      await apiClient.deleteUser(userId)
      setDeleteUserId(null)
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setShowCreateDialog(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowDetailsDialog(true)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setRoleFilter(undefined)
    setStatusFilter(undefined)
    setStartDate("")
    setEndDate("")
    setSortBy("createdAt")
    setSortOrder('desc')
    setCurrentPage(1)
  }

  const handleFormSuccess = () => {
    fetchUsers() // Refresh the list
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive'
      case 'MANAGER':
        return 'default'
      case 'USER':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const totalPages = Math.ceil(totalUsers / pageSize)

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h2>
              <p className="text-muted-foreground">
                Quản lý tất cả người dùng trong hệ thống
              </p>
            </div>
            <Button onClick={handleCreateUser}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm người dùng
            </Button>
          </div>

          {/* Stats Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số người dùng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Đang hoạt động
              </p>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách người dùng</CardTitle>
              <CardDescription>
                Tìm kiếm và quản lý người dùng
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search Bar */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo email hoặc tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" onClick={handleClearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Xóa bộ lọc
                </Button>
              </div>

              {/* Advanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="role-filter">Vai trò</Label>
                  <Select value={roleFilter || "all"} onValueChange={(value) => setRoleFilter(value === "all" ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả vai trò</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status-filter">Trạng thái</Label>
                  <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-date">Từ ngày</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">Đến ngày</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Label>Sắp xếp theo:</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Ngày tạo</SelectItem>
                      <SelectItem value="name">Tên</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="role">Vai trò</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Label>Thứ tự:</Label>
                  <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Giảm dần</SelectItem>
                      <SelectItem value="asc">Tăng dần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Users Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        </TableRow>
                      ))
                    ) : !users || users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Không tìm thấy người dùng nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">
                              Hoạt động
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setDeleteUserId(user.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {users.length} trong tổng số {totalUsers} người dùng
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    <span className="text-sm">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create/Edit User Dialog */}
        <UserFormDialog
          open={showCreateDialog || showEditDialog}
          onOpenChange={() => {
            setShowCreateDialog(false)
            setShowEditDialog(false)
          }}
          user={selectedUser}
          onSuccess={handleFormSuccess}
        />

        {/* User Details Dialog */}
        <UserDetailsDialog
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          user={selectedUser}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  )
}
