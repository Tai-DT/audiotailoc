'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useProductStore } from '@/store/product-store';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { ProductCard } from '@/components/products/ProductCard';

export default function ProductDetailPage() {
  const { currentProduct, products, isLoading, error, fetchProduct, fetchProducts } = useProductStore();
  const { addItem } = useCartStore();
  const { addNotification } = useUIStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    if (slug) {
      fetchProduct(slug);
    }
  }, [slug, fetchProduct]);

  useEffect(() => {
    // Fetch related products
    if (currentProduct?.categoryId) {
      fetchProducts({ category: currentProduct.categoryId }, 1);
    }
  }, [currentProduct?.categoryId, fetchProducts]);

  const handleAddToCart = async () => {
    if (!currentProduct) return;

    try {
      await addItem({
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.priceCents / 100,
        imageUrl: currentProduct.imageUrl,
        slug: currentProduct.slug,
      }, quantity);

      addNotification({
        type: 'success',
        title: 'Đã thêm vào giỏ hàng',
        message: `${currentProduct.name} (${quantity} sản phẩm) đã được thêm vào giỏ hàng`,
        duration: 3000,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể thêm sản phẩm vào giỏ hàng',
        duration: 3000,
      });
    }
  };

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(priceCents / 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h1>
          <p className="text-gray-600 mb-4">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <a
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách sản phẩm
          </a>
        </div>
      </div>
    );
  }

  const images = currentProduct.images || [currentProduct.imageUrl].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <a href="/" className="hover:text-blue-600">Trang chủ</a>
            </li>
            <li>/</li>
            <li>
              <a href="/products" className="hover:text-blue-600">Sản phẩm</a>
            </li>
            {currentProduct.category && (
              <>
                <li>/</li>
                <li>
                  <a href={`/products?category=${currentProduct.category.slug}`} className="hover:text-blue-600">
                    {currentProduct.category.name}
                  </a>
                </li>
              </>
            )}
            <li>/</li>
            <li className="text-gray-900">{currentProduct.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <Image
                src={images[selectedImage] || '/images/placeholder-product.jpg'}
                alt={currentProduct.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image || '/images/placeholder-product.jpg'}
                      alt={`${currentProduct.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {currentProduct.category && (
              <div className="text-sm text-gray-500">
                {currentProduct.category.name}
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900">{currentProduct.name}</h1>

            {/* Price */}
            <div className="text-3xl font-bold text-blue-600">
              {formatPrice(currentProduct.priceCents)}
            </div>

            {/* Stock Status */}
            <div className={`text-sm ${
              currentProduct.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentProduct.stockQuantity > 0 
                ? `${currentProduct.stockQuantity} sản phẩm có sẵn`
                : 'Hết hàng'
              }
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
              <p className="text-gray-600 leading-relaxed">
                {currentProduct.description || 'Không có mô tả chi tiết cho sản phẩm này.'}
              </p>
            </div>

            {/* Add to Cart Section */}
            {currentProduct.stockQuantity > 0 && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Số lượng:</label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={currentProduct.stockQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(currentProduct.stockQuantity, parseInt(e.target.value) || 1)))}
                      className="w-16 text-center border-none focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(currentProduct.stockQuantity, quantity + 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <button className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Thêm vào yêu thích
              </button>
              
              <button className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Chia sẻ
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {products.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter(product => product.id !== currentProduct.id)
                .slice(0, 4)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showAddToCart={true}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
