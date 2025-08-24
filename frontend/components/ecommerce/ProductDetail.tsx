'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isNew?: boolean;
  isHot?: boolean;
  discount?: number;
  specifications: Record<string, string>;
  features: string[];
  warranty: string;
  shipping: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
}

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onAddToWishlist: (product: Product) => void;
  onShare: (product: Product) => void;
}

export default function ProductDetail({
  product,
  reviews,
  relatedProducts,
  onAddToCart,
  onAddToWishlist,
  onShare
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(product.stock, quantity + value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product);
    toast.success('Đã thêm vào danh sách yêu thích');
  };

  const handleShare = () => {
    onShare(product);
    toast.success('Đã sao chép link sản phẩm');
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : product.rating;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            
            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSelectedImage(prev => 
                    prev === 0 ? product.images.length - 1 : prev - 1
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSelectedImage(prev => 
                    prev === product.images.length - 1 ? 0 : prev + 1
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

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
          </div>

          {/* Thumbnail images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.brand}</Badge>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {renderStars(averageRating)}
                <span className="ml-2 text-sm">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({reviews.length} đánh giá)
              </span>
            </div>

            <p className="text-gray-600 mb-4">{product.description}</p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {product.discount && (
              <Badge className="bg-green-500">
                Tiết kiệm {formatPrice(product.originalPrice! - product.price)}
              </Badge>
            )}
          </div>

          {/* Stock Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm">
                {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
              </span>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Số lượng</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20 text-center"
                min="1"
                max={product.stock}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                +
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleAddToWishlist}
            >
              <Heart className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-blue-500" />
              <span>Miễn phí vận chuyển</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Bảo hành chính hãng</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-4 w-4 text-orange-500" />
              <span>Đổi trả 30 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Mô tả</TabsTrigger>
          <TabsTrigger value="specifications">Thông số</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá ({reviews.length})</TabsTrigger>
          <TabsTrigger value="related">Sản phẩm liên quan</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mô tả chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{product.longDescription}</p>
                
                <h3 className="text-lg font-semibold mt-6 mb-3">Tính năng nổi bật</h3>
                <ul className="list-disc list-inside space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông số kỹ thuật</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium">{key}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Đánh giá sản phẩm</CardTitle>
                <Button onClick={() => setShowReviewForm(true)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Viết đánh giá
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Chưa có đánh giá nào cho sản phẩm này
                </p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{review.userName}</h4>
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <h5 className="font-medium mb-1">{review.title}</h5>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review ${index + 1}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="related" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm liên quan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="border rounded-lg p-4">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <h4 className="font-medium text-sm mb-1">{relatedProduct.name}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(relatedProduct.rating)}
                      <span className="text-xs">({relatedProduct.reviewCount})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-600">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      <Button size="sm">
                        <ShoppingCart className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Viết đánh giá</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Đánh giá</label>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 cursor-pointer ${
                        i < reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: i + 1 }))}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tiêu đề</label>
                <Input
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Tóm tắt đánh giá của bạn"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Nhận xét</label>
                <Textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    // Handle submit review
                    setShowReviewForm(false);
                    toast.success('Đánh giá đã được gửi');
                  }}
                >
                  Gửi đánh giá
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
