import { apiFetch } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await apiFetch<Category[]>('/catalog/categories');
    return response || [];
  } catch {
    return [];
  }
}

// Server action for creating category
async function createCategory(formData: FormData) {
  'use server';
  
  const name = String(formData.get('name') || '');
  const description = String(formData.get('description') || '');
  
  if (!name.trim()) {
    throw new Error('Tên danh mục không được để trống');
  }

  try {
    await apiFetch('/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined })
    });
  } catch (error) {
    throw new Error('Không thể tạo danh mục');
  }

  const { redirect } = await import('next/navigation');
  redirect('/categories');
}

// Server action for deleting category
async function deleteCategory(formData: FormData) {
  'use server';
  
  const id = String(formData.get('id') || '');
  
  try {
    await apiFetch(`/admin/categories/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    throw new Error('Không thể xóa danh mục');
  }

  const { redirect } = await import('next/navigation');
  redirect('/categories');
}

// Type casts to satisfy current React 18 DOM types for Server Actions in forms
const createCategoryAction = createCategory as unknown as (formData: FormData) => void;
const deleteCategoryAction = deleteCategory as unknown as (formData: FormData) => void;

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
          <p className="text-gray-600">Quản lý danh mục sản phẩm</p>
        </div>
      </div>

      {/* Create Category Form */}
      <Card>
        <CardHeader>
          <CardTitle>Tạo danh mục mới</CardTitle>
          <CardDescription>Thêm danh mục sản phẩm mới</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCategory as any} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Tên danh mục *
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="VD: Tai nghe"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Mô tả
                </label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Mô tả danh mục (tùy chọn)"
                />
              </div>
            </div>
            <Button type="submit">Tạo danh mục</Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục ({categories.length})</CardTitle>
          <CardDescription>Tất cả danh mục sản phẩm hiện có</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Tên danh mục</th>
                      <th className="text-left py-2">Mô tả</th>
                      <th className="text-left py-2">Số sản phẩm</th>
                      <th className="text-left py-2">Ngày tạo</th>
                      <th className="text-left py-2">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-gray-500">ID: {category.id.slice(-8)}</p>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {category.description || 'Không có mô tả'}
                        </td>
                        <td className="py-3">
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {category._count?.products || 0} sản phẩm
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {formatDate(category.createdAt)}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Chỉnh sửa
                            </Button>
                            <form action={deleteCategory as any} className="inline">
                              <input type="hidden" name="id" value={category.id} />
                              <Button 
                                type="submit" 
                                variant="destructive" 
                                size="sm"
                                onClick={(e) => {
                                  if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                Xóa
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Chưa có danh mục nào</p>
              <p className="text-sm text-gray-400 mt-2">Tạo danh mục đầu tiên bằng form ở trên</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
