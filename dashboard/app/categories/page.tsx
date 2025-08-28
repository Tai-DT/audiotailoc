"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories] = useState<Category[]>([
    {
      id: '1',
      name: 'Loa & Soundbar',
      slug: 'loa-soundbar',
      isActive: true,
      productCount: 8,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Tai nghe',
      slug: 'tai-nghe',
      isActive: true,
      productCount: 12,
      createdAt: '2024-01-16'
    },
    {
      id: '3',
      name: 'Microphone',
      slug: 'microphone',
      isActive: true,
      productCount: 6,
      createdAt: '2024-01-17'
    },
    {
      id: '4',
      name: 'Amply & Mixer',
      slug: 'amply-mixer',
      isActive: true,
      productCount: 4,
      createdAt: '2024-01-18'
    },
    {
      id: '5',
      name: 'Phụ kiện',
      slug: 'phu-kien',
      isActive: false,
      productCount: 0,
      createdAt: '2024-01-19'
    }
  ]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
          <p className="text-gray-600">Tổ chức và quản lý các danh mục sản phẩm</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? 'Hoạt động' : 'Tạm dừng'}
                </Badge>
              </div>
              <CardDescription>
                Slug: {category.slug}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sản phẩm:</span>
                  <span className="font-medium">{category.productCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ngày tạo:</span>
                  <span className="text-sm">{new Date(category.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Xem
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy danh mục</h3>
              <p className="text-gray-600">Không có danh mục nào khớp với từ khóa tìm kiếm.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}