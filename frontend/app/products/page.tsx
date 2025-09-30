'use client';

import React from 'react';
import { PageBanner } from '@/components/ui/page-banner';
import { useProducts } from '@/lib/hooks/use-api';
import { ProductFilters } from '@/lib/types';
import { ProductGrid } from '@/components/products/product-grid';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';
import { useCategories } from '@/lib/hooks/use-api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ProductsPage() {
  const { addItem: addCartItem } = useCart();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<ProductFilters>({
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { data, isLoading } = useProducts(filters);
  const { data: categories } = useCategories();

  const handleFiltersChange = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev: ProductFilters) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleAddToCart = async (productId: string) => {
    const product = data?.items.find((item) => item.id === productId);

    if (!product) {
      toast.error('Không tìm thấy sản phẩm để thêm vào giỏ hàng');
      return;
    }

    try {
      addCartItem({
        id: product.id,
        name: product.name,
        price: product.priceCents / 100, // Convert cents to VND
        image: product.imageUrl || '',
        category: product.category?.name || 'Uncategorized',
        description: product.shortDescription || product.description,
      }, 1);
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFiltersChange({ q: searchQuery.trim() || undefined });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      page: 1,
      pageSize: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Banner */}
      <PageBanner
        page="products"
        title="Sản phẩm âm thanh chuyên nghiệp"
        subtitle="Thiết bị chất lượng cao"
        description="Khám phá bộ sưu tập đầy đủ thiết bị âm thanh chuyên nghiệp từ Audio Tài Lộc. Từ loa, micro, mixer đến hệ thống âm thanh hội trường, chúng tôi có mọi thứ bạn cần."
        showStats={true}
      />

      {/* Search and Filters */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="bg-background rounded-lg p-6 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="default">
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </Button>
            </form>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Lọc theo:</span>
              </div>

              <Select
                value={filters.categoryId || ''}
                onValueChange={(value) => handleFiltersChange({ categoryId: value || undefined })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả danh mục</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.brand || ''}
                onValueChange={(value) => handleFiltersChange({ brand: value || undefined })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tất cả thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả thương hiệu</SelectItem>
                  {/* Add brand options here */}
                </SelectContent>
              </Select>

              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-');
                  handleFiltersChange({ 
                    sortBy: sortBy as 'createdAt' | 'name' | 'price' | 'updatedAt' | 'viewCount', 
                    sortOrder: sortOrder as 'asc' | 'desc' 
                  });
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
                  <SelectItem value="name-asc">Tên A-Z</SelectItem>
                  <SelectItem value="name-desc">Tên Z-A</SelectItem>
                  <SelectItem value="priceCents-asc">Giá thấp đến cao</SelectItem>
                  <SelectItem value="priceCents-desc">Giá cao đến thấp</SelectItem>
                  <SelectItem value="viewCount-desc">Xem nhiều nhất</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="ml-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <ProductGrid
            products={data?.items || []}
            loading={isLoading}
            onAddToCart={handleAddToCart}
          />
        </div>
      </section>
    </div>
  );
}
