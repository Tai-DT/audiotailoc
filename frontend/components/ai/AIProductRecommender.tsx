'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Star, ShoppingCart, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface ProductRecommendation {
  query: string;
  recommendation: string;
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
  }>;
}

export default function AIProductRecommender() {
  const [query, setQuery] = useState('');
  const [recommendation, setRecommendation] = useState<ProductRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendations = async () => {
    if (!query.trim()) {
      toast.error('Vui lòng nhập nhu cầu của bạn');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Không thể tạo gợi ý sản phẩm');
      }

      const data = await response.json();
      setRecommendation(data);
      toast.success('Đã tạo gợi ý sản phẩm!');
    } catch (error) {
      console.error('Product recommendation error:', error);
      toast.error('Có lỗi xảy ra khi tạo gợi ý sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Search className="text-blue-500" />
          AI Product Recommender
        </h1>
        <p className="text-muted-foreground">
          Tư vấn sản phẩm thông minh cho Audio Tài Lộc
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm sản phẩm</CardTitle>
          <CardDescription>
            Mô tả nhu cầu của bạn và AI sẽ gợi ý sản phẩm phù hợp nhất
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Ví dụ: Tôi cần tai nghe bluetooth chống ồn cho công việc..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={getRecommendations} 
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tìm...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Tìm kiếm
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            💡 <strong>Gợi ý:</strong> Mô tả càng chi tiết, AI sẽ gợi ý càng chính xác
          </div>
        </CardContent>
      </Card>

      {recommendation && (
        <div className="space-y-6">
          {/* AI Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Gợi ý từ AI
              </CardTitle>
              <CardDescription>
                Dựa trên nhu cầu: &ldquo;{recommendation.query}&rdquo;
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-800 leading-relaxed">
                  {recommendation.recommendation}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Products */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm được gợi ý</CardTitle>
              <CardDescription>
                {recommendation.products.length} sản phẩm phù hợp với nhu cầu của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendation.products.map((product, index) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Product Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg line-clamp-2">
                              {product.name}
                            </h3>
                            <Badge variant="outline" className="mt-1">
                              {product.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">4.5</span>
                          </div>
                        </div>

                        {/* Product Description */}
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {product.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-green-600">
                            {formatPrice(product.price)}
                          </span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Xem
                            </Button>
                            <Button size="sm">
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Mua
                            </Button>
                          </div>
                        </div>

                        {/* Recommendation Badge */}
                        <div className="flex justify-center">
                          <Badge variant="secondary" className="text-xs">
                            Gợi ý #{index + 1}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Tìm kiếm tương tự
                </Button>
                <Button variant="outline">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Thêm tất cả vào giỏ
                </Button>
                <Button variant="outline">
                  <Star className="mr-2 h-4 w-4" />
                  Lưu gợi ý
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Popular Searches */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm phổ biến</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              'tai nghe bluetooth',
              'loa bluetooth',
              'tai nghe chống ồn',
              'microphone gaming',
              'soundbar 5.1',
              'amplifier',
              'đầu phát nhạc',
              'dây cáp âm thanh'
            ].map((searchTerm) => (
              <Button
                key={searchTerm}
                variant="outline"
                size="sm"
                onClick={() => setQuery(searchTerm)}
                className="text-xs"
              >
                {searchTerm}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
