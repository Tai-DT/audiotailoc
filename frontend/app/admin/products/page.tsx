'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/ui/data-table';
import { FormModal, FormField } from '@/components/ui/form-modal';
import { Plus, Search, Filter, Package, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  imageUrl?: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  featured: boolean;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [currentPage, pageSize, searchQuery, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/catalog/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(searchQuery && { q: searchQuery }),
        ...(selectedCategory && { categoryId: selectedCategory }),
      });

      const response = await fetch(`/api/catalog/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data?.items || []);
        setTotal(data.data?.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: Record<string, any>) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await fetch('/api/catalog/products', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Tạo sản phẩm thành công');
        fetchProducts();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Tạo sản phẩm thất bại');
      }
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleUpdate = async (data: Record<string, any>) => {
    if (!editingProduct) return;

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await fetch(`/api/catalog/products/${editingProduct.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        toast.success('Cập nhật sản phẩm thành công');
        fetchProducts();
        setEditingProduct(null);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Cập nhật sản phẩm thất bại');
      }
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) return;

    try {
      const response = await fetch(`/api/catalog/products/${product.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Xóa sản phẩm thành công');
        fetchProducts();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Xóa sản phẩm thất bại');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBulkDelete = async (selectedProducts: Product[]) => {
    if (!confirm(`Bạn có chắc muốn xóa ${selectedProducts.length} sản phẩm?`)) return;

    try {
      const ids = selectedProducts.map(p => p.id);
      const response = await fetch('/api/catalog/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });

      if (response.ok) {
        toast.success(`Xóa ${selectedProducts.length} sản phẩm thành công`);
        fetchProducts();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Xóa sản phẩm thất bại');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const productFormFields: FormField[] = [
    {
      name: 'name',
      label: 'Tên sản phẩm',
      type: 'text',
      required: true,
      validation: { minLength: 1, maxLength: 255 },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      validation: {
        pattern: /^[a-z0-9-]+$/,
        custom: (value) => {
          if (value && !/^[a-z0-9-]+$/.test(value)) {
            return 'Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang';
          }
          return null;
        },
      },
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      validation: { maxLength: 1000 },
    },
    {
      name: 'priceCents',
      label: 'Giá (VNĐ)',
      type: 'number',
      required: true,
      validation: {
        custom: (value) => {
          if (value && value < 0) {
            return 'Giá phải lớn hơn 0';
          }
          return null;
        },
      },
    },
    {
      name: 'categoryId',
      label: 'Danh mục',
      type: 'select',
      options: categories.map(cat => ({ label: cat.name, value: cat.id })),
    },
    {
      name: 'stockQuantity',
      label: 'Số lượng tồn kho',
      type: 'number',
      validation: {
        custom: (value) => {
          if (value && value < 0) {
            return 'Số lượng không được âm';
          }
          return null;
        },
      },
    },
    {
      name: 'imageUrl',
      label: 'Hình ảnh',
      type: 'file',
      accept: 'image/*',
    },
    {
      name: 'featured',
      label: 'Nổi bật',
      type: 'checkbox',
    },
    {
      name: 'isActive',
      label: 'Kích hoạt',
      type: 'checkbox',
    },
  ];

  const columns: Column<Product>[] = [
    {
      key: 'imageUrl',
      header: 'Hình ảnh',
      width: '80px',
      render: (value) => (
        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
          {value ? (
            <Image
              src={value}
              alt="Product"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="w-6 h-6" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Tên sản phẩm',
      sortable: true,
      render: (value, item) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{item.slug}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Danh mục',
      render: (value) => value?.name || 'Chưa phân loại',
    },
    {
      key: 'priceCents',
      header: 'Giá',
      sortable: true,
      render: (value) => formatPrice(value),
    },
    {
      key: 'stockQuantity',
      header: 'Tồn kho',
      render: (value) => (
        <Badge variant={value > 10 ? 'default' : value > 0 ? 'secondary' : 'destructive'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'isActive',
      header: 'Trạng thái',
      render: (value, item) => (
        <div className="flex flex-col gap-1">
          <Badge variant={value ? 'default' : 'secondary'}>
            {value ? 'Kích hoạt' : 'Tạm dừng'}
          </Badge>
          {item.featured && (
            <Badge variant="outline">Nổi bật</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('vi-VN'),
    },
  ];

  const stats = [
    {
      title: 'Tổng sản phẩm',
      value: total.toString(),
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Sản phẩm nổi bật',
      value: products.filter(p => p.featured).length.toString(),
      icon: Eye,
      color: 'text-green-600',
    },
    {
      title: 'Sản phẩm hết hàng',
      value: products.filter(p => p.stockQuantity === 0).length.toString(),
      icon: DollarSign,
      color: 'text-red-600',
    },
    {
      title: 'Danh mục',
      value: categories.length.toString(),
      icon: Filter,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-gray-600">Thêm, sửa, xóa và quản lý sản phẩm</p>
        </div>
        <Button onClick={() => setShowFormModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
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
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={products}
            columns={columns}
            loading={loading}
            selectable={true}
            onEdit={(product) => {
              setEditingProduct(product);
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
            emptyMessage="Không có sản phẩm nào"
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <FormModal
        title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        description={editingProduct ? 'Cập nhật thông tin sản phẩm' : 'Tạo sản phẩm mới trong hệ thống'}
        fields={productFormFields}
        data={editingProduct || {}}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
        onCancel={() => {
          setEditingProduct(null);
          setShowFormModal(false);
        }}
        open={showFormModal}
        onOpenChange={setShowFormModal}
        size="lg"
      />
    </div>
  );
}