import { apiFetch } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  items: User[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function fetchUsers(searchParams: { q?: string; page?: string }): Promise<UsersResponse> {
  try {
    const params = new URLSearchParams();
    if (searchParams.q) params.set('q', searchParams.q);
    if (searchParams.page) params.set('page', searchParams.page);
    params.set('pageSize', '20');

    const response = await apiFetch<UsersResponse>(`/admin/users?${params.toString()}`);
    return response;
  } catch {
    return {
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0
    };
  }
}

export default async function UsersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const params = await searchParams;
  const { q = '', page = '1' } = params;
  const currentPage = parseInt(page, 10) || 1;
  
  const usersData = await fetchUsers({ q, page });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
          <p className="text-gray-600">Quản lý tài khoản người dùng và phân quyền</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex gap-4">
            <Input
              name="q"
              placeholder="Tìm kiếm theo email..."
              defaultValue={q}
              className="flex-1"
            />
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({usersData.totalCount})</CardTitle>
          <CardDescription>
            Trang {currentPage} / {usersData.totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersData.items.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Vai trò</th>
                      <th className="text-left py-2">Ngày tạo</th>
                      <th className="text-left py-2">Cập nhật</th>
                      <th className="text-left py-2">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData.items.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <div>
                            <p className="font-medium">{user.email}</p>
                            <p className="text-sm text-gray-500">ID: {user.id.slice(-8)}</p>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`inline-block px-2 py-1 text-xs rounded ${
                            user.role === 'ADMIN' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {formatDate(user.updatedAt)}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Chỉnh sửa
                            </Button>
                            {user.role !== 'ADMIN' && (
                              <Button variant="destructive" size="sm">
                                Xóa
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center space-x-4 pt-4">
                {currentPage > 1 && (
                  <Link 
                    href={`/users?${new URLSearchParams({ q, page: String(currentPage - 1) }).toString()}`}
                  >
                    <Button variant="outline">← Trang trước</Button>
                  </Link>
                )}
                
                <span className="text-sm text-gray-600">
                  Trang {currentPage} / {usersData.totalPages}
                </span>
                
                {currentPage < usersData.totalPages && (
                  <Link 
                    href={`/users?${new URLSearchParams({ q, page: String(currentPage + 1) }).toString()}`}
                  >
                    <Button variant="outline">Trang sau →</Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy người dùng nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
