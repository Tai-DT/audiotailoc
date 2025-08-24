'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { Product } from '@/store/product-store';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showAddToCart = true 
}) => {
  const { addItem } = useCartStore();
  const { addNotification } = useUIStore();

  const handleAddToCart = async () => {
    try {
      await addItem({
        id: product.id,
        name: product.name,
        price: product.priceCents / 100, // Convert from cents to VND
        imageUrl: product.imageUrl,
        slug: product.slug,
      });

      addNotification({
        type: 'success',
        title: 'Đã thêm vào giỏ hàng',
        message: `${product.name} đã được thêm vào giỏ hàng`,
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.imageUrl || '/images/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        
        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            Nổi bật
          </div>
        )}
        
        {/* Stock Badge */}
        {product.stockQuantity <= 0 && (
          <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            Hết hàng
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <div className="text-sm text-gray-500 mb-1">
            {product.category.name}
          </div>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(product.priceCents)}
          </span>
          
          {/* Stock Status */}
          <span className={`text-sm ${
            product.stockQuantity > 0 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {product.stockQuantity > 0 
              ? `${product.stockQuantity} sản phẩm có sẵn`
              : 'Hết hàng'
            }
          </span>
        </div>

        {/* Add to Cart Button */}
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {product.stockQuantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
          </button>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
          <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Yêu thích
          </button>
          
          <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Chia sẻ
          </button>
        </div>
      </div>
    </div>
  );
};
