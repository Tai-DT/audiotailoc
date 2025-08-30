'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Grid3X3, 
  List, 
  Filter, 
  Search, 
  Star, 
  ShoppingCart, 
  Heart,
  Eye,
  TrendingUp,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isNew?: boolean;
  isHot?: boolean;
  discount?: number;
}

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}

export default function ProductGrid({ 
  products, 
  onProductClick, 
  onAddToCart, 
  onAddToWishlist 
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const categories = ['Tai nghe', 'Loa', 'Ampli', 'Microphone', 'Phụ kiện'];
  const brands = ['Sony', 'Bose', 'JBL', 'Audio-Technica', 'Shure', 'Sennheiser'];

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategories, selectedBrands, priceRange, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 10000000]);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sản phẩm</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} sản phẩm được tìm thấy
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Nổi bật</SelectItem>
              <SelectItem value="price-low">Giá tăng dần</SelectItem>
              <SelectItem value="price-high">Giá giảm dần</SelectItem>
              <SelectItem value="rating">Đánh giá cao</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="popular">Phổ biến</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Bộ lọc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Range */}
              <div className="space-y-3">
                <h3 className="font-medium">Khoảng giá</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000000}
                  min={0}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h3 className="font-medium">Danh mục</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label htmlFor={category} className="text-sm">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-3">
                <h3 className="font-medium">Thương hiệu</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => handleBrandToggle(brand)}
                      />
                      <label htmlFor={brand} className="text-sm">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                Xóa bộ lọc
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={onProductClick}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  onProductClick={onProductClick}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                />
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
              <Button onClick={clearFilters} className="mt-4">
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  onProductClick, 
  onAddToCart, 
  onAddToWishlist 
}: {
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group cursor-pointer hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
      <CardContent className="p-4">
        {/* Product Image */}
        <div className="relative mb-4">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={192}
            className="w-full h-48 object-cover rounded-lg"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-blue-500">Mới</Badge>
            )}
            {product.isHot && (
              <Badge className="bg-red-500">Hot</Badge>
            )}
            {product.discount && (
              <Badge className="bg-green-500">-{product.discount}%</Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className={`absolute top-2 right-2 flex flex-col gap-1 transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist(product);
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onProductClick(product);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div onClick={() => onProductClick(product)}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm ml-1">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <Badge variant="outline">{product.brand}</Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
        </Button>
      </CardContent>
      </Card>
    </div>
  );
}

// Product List Item Component
function ProductListItem({ 
  product, 
  onProductClick, 
  onAddToCart, 
  onAddToWishlist 
}: {
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}) {
  return (
    <Card className="flex gap-4 p-4">
      <Image
        src={product.image}
        alt={product.name}
        width={128}
        height={128}
        className="w-32 h-32 object-cover rounded-lg cursor-pointer"
        onClick={() => onProductClick(product)}
      />
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="font-semibold text-lg cursor-pointer hover:text-blue-600"
            onClick={() => onProductClick(product)}
          >
            {product.name}
          </h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddToWishlist(product)}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onProductClick(product)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm ml-1">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount})
          </span>
          <Badge variant="outline">{product.brand}</Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <Button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
