'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/ui/data-table';
import { FormModal, FormField } from '@/components/ui/form-modal';
import { Plus, Search, Users, UserCheck, UserX, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, searchQuery, selectedRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });

      const response = await fetch(`/api/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: Record<string, any>) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Tạo người dùng thành công');
        fetchUsers();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Tạo người dùng thất bại');
      }
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleUpdate = async (data: Record<string, any>) => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Cập nhật người dùng thành công');
        fetchUsers();
        setEditingUser(null);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Cập nhật người dùng thất bại');
      }
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Bạn có chắc muốn xóa người dùng "${user.name}"?`)) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Xóa người dùng thành công');
        fetchUsers();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Xóa người dùng thất bại');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBulkDelete = async (selectedUsers: User[]) => {
    if (!confirm(`Bạn có chắc muốn xóa ${selectedUsers.length} người dùng?`)) return;

    try {
      const deletePromises = selectedUsers.map(user =>
        fetch(`/api/users/${user.id}`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);
      toast.success(`Xóa ${selectedUsers.length} người dùng thành công`);
      fetchUsers();
    } catch (error: any) {
      toast.error('Có lỗi xảy ra khi xóa người dùng');
    }
  };

  const userFormFields: FormField[] = [
    {
      name: 'name',
      label: 'Họ tên',
      type: 'text',
      required: true,
      validation: { minLength: 2, maxLength: 255 },
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value) => {
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Email không đúng định dạng';
          }
          return null;
        },
      },
    },
    {
      name: 'phone',
      label: 'Số điện thoại',
      type: 'text',
      validation: {
        pattern: /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/,
        custom: (value) => {
          if (value && !/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(value)) {
            return 'Số điện thoại không đúng định dạng';
          }
          return null;
        },
      },
    },
    {
      name: 'password',
      label: 'Mật khẩu',
      type: 'password',
      required: !editingUser,
      validation: {
        minLength: 6,
        custom: (value) => {
          if (!editingUser && (!value || value.length < 6)) {
            return 'Mật khẩu phải có ít nhất 6 ký tự';
          }
          return null;
        },
      },
    },
    {
      name: 'role',
      label: 'Vai trò',
      type: 'select',
      required: true,
      options: [
        { label: 'Người dùng', value: 'USER' },
        { label: 'Quản trị viên', value: 'ADMIN' },
      ],
    },
  ];

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Họ tên',
      sortable: true,
      render: (value, item) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Số điện thoại',
      render: (value) => value || 'Chưa cập nhật',
    },
    {
      key: 'role',
      header: 'Vai trò',
      render: (value) => (
        <Badge variant={value === 'ADMIN' ? 'destructive' : 'default'}>
          {value === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('vi-VN'),
    },
    {
      key: 'updatedAt',
      header: 'Cập nhật cuối',
      render: (value) => new Date(value).toLocaleDateString('vi-VN'),
    },
  ];

  const stats = [
    {
      title: 'Tổng người dùng',
      value: total.toString(),
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Quản trị viên',
      value: users.filter(u => u.role === 'ADMIN').length.toString(),
      icon: UserCheck,
      color: 'text-red-600',
    },
    {
      title: 'Người dùng thường',
      value: users.filter(u => u.role === 'USER').length.toString(),
      icon: UserX,
      color: 'text-green-600',
    },
    {
      title: 'Tháng này',
      value: users.filter(u => {
        const userDate = new Date(u.createdAt);
        const now = new Date();
        return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
      }).length.toString(),
      icon: Calendar,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
          <p className="text-gray-600">Thêm, sửa, xóa và quản lý người dùng</p>
        </div>
        <Button onClick={() => setShowFormModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tất cả vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả vai trò</SelectItem>
                <SelectItem value="USER">Người dùng</SelectItem>
                <SelectItem value="ADMIN">Quản trị viên</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedRole('');
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={users}
            columns={columns}
            loading={loading}
            selectable={true}
            onEdit={(user) => {
              setEditingUser(user);
              setShowFormModal(true);
            }}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            bulkActions={[
              { label: 'Xóa', value: 'delete', variant: 'danger' },
            ]}
            pagination={{
              page: currentPage,
              pageSize,
              total,
              onPageChange: setCurrentPage,
              onPageSizeChange: setPageSize,
            }}
            emptyMessage="Không có người dùng nào"
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <FormModal
        title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        description={editingUser ? 'Cập nhật thông tin người dùng' : 'Tạo tài khoản người dùng mới'}
        fields={userFormFields}
        data={editingUser ? {
          ...editingUser,
          password: '', // Don't show password for editing
        } : {}}
        onSubmit={editingUser ? handleUpdate : handleCreate}
        onCancel={() => {
          setEditingUser(null);
          setShowFormModal(false);
        }}
        open={showFormModal}
        onOpenChange={setShowFormModal}
        size="md"
      />
    </div>
  );
}