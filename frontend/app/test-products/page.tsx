'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard, ProductCardSkeleton } from '@/components/ui/product-card';
import { ProductService, Product } from '@/lib/product-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  RefreshCw,
  Package,
  Eye,
  Star,
  AlertCircle
} from 'lucide-react';

export default function TestProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    withImages: 0,
    cloudinaryImages: 0,
    inStock: 0,
    featured: 0,
  });

  // Load products
  const loadProducts = async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = query 
        ? await ProductService.searchProducts(query, 20)
        : await ProductService.getProducts({ 
            page: 1, 
            pageSize: 20, 
            sortBy: 'createdAt',
            sortOrder: 'desc'
          });

      setProducts(response.items);
      
      // Calculate stats
      const newStats = {
        total: response.items.length,
        withImages: response.items.filter(p => 
          ProductService.getMainImage(p)
        ).length,
        cloudinaryImages: response.items.filter(p => {
          const mainImage = ProductService.getMainImage(p);
          return mainImage && ProductService.isCloudinaryUrl(mainImage);
        }).length,
        inStock: response.items.filter(p => 
          ProductService.isInStock(p)
        ).length,
        featured: response.items.filter(p => p.featured).length,
      };
      setStats(newStats);
      
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Search products
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    await loadProducts(searchQuery.trim());
  };

  // Reset search
  const handleReset = () => {
    setSearchQuery('');
    loadProducts();
  };

  // Mock handlers for product actions
  const handleAddToCart = (product: Product) => {
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleViewDetails = (product: Product) => {
    console.log('Viewing product:', product);
  };

  const handleToggleWishlist = (product: Product) => {
    alert(`Đã thêm "${product.name}" vào danh sách yêu thích!`);
  };

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Test Sản Phẩm với Cloudinary Images
          </h1>
          <p className="text-gray-600">
            Trang này để test việc hiển thị hình ảnh sản phẩm từ Cloudinary thông qua API backend.
          </p>
          <div className="mt-4">
            <a href="/products" className="text-blue-600 hover:underline">
              ← Quay về trang sản phẩm chính
            </a>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isSearching}>
                {isSearching ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  'Tìm kiếm'
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
                disabled={loading}
              >
                Đặt lại
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Tổng sản phẩm</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.withImages}</div>
              <div className="text-sm text-gray-600">Có hình ảnh</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto bg-orange-500 rounded flex items-center justify-center text-white text-sm font-bold mb-2">
                C
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.cloudinaryImages}</div>
              <div className="text-sm text-gray-600">Cloudinary</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.inStock}</div>
              <div className="text-sm text-gray-600">Còn hàng</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.featured}</div>
              <div className="text-sm text-gray-600">Nổi bật</div>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Lỗi tải dữ liệu</div>
                  <div className="text-sm">{error}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadProducts()}
                  className="ml-auto text-red-700 border-red-300"
                >
                  Thử lại
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Loading Skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : products.length > 0 ? (
            // Product Cards
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
                onToggleWishlist={handleToggleWishlist}
                isInWishlist={false}
              />
            ))
          ) : (
            // Empty State
            <div className="col-span-full">
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không tìm thấy sản phẩm nào
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery 
                      ? `Không có sản phẩm nào phù hợp với từ khóa "${searchQuery}"`
                      : 'Chưa có sản phẩm nào trong hệ thống.'
                    }
                  </p>
                  {searchQuery && (
                    <Button onClick={handleReset}>
                      Xem tất cả sản phẩm
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Debug Info */}
        {products.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Thông tin Debug</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">API Endpoint:</h4>
                  <code className="bg-gray-100 p-2 rounded block">
                    {process.env.NEXT_PUBLIC_API_URL}/catalog/products
                  </code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cloudinary Cloud:</h4>
                  <code className="bg-gray-100 p-2 rounded block">
                    {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'Not configured'}
                  </code>
                </div>
              </div>
              
              {/* Sample Product Data */}
              {products[0] && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Sample Product Data:</h4>
                  <details className="bg-gray-50 rounded p-3">
                    <summary className="cursor-pointer font-mono text-sm">
                      {products[0].name} (Click to expand)
                    </summary>
                    <pre className="mt-2 text-xs overflow-x-auto">
                      {JSON.stringify({
                        id: products[0].id,
                        name: products[0].name,
                        imageUrl: products[0].imageUrl,
                        images: products[0].images,
                        mainImage: ProductService.getMainImage(products[0]),
                        isCloudinary: ProductService.getMainImage(products[0]) 
                          ? ProductService.isCloudinaryUrl(ProductService.getMainImage(products[0])!)
                          : false,
                      }, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
