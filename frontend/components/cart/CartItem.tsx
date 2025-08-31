'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { CartItem as CartItemType } from '@/store/cart-store';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.productId);
    } else {
      updateQuantity(item.productId, newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={item.imageUrl || '/images/placeholder-product.jpg'}
          alt={item.name}
          fill
          className="object-cover rounded-md"
          sizes="80px"
        />
      </div>
      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
          legacyBehavior>
          {item.name}
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          Đơn giá: {formatPrice(item.price)}
        </p>
      </div>
      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <span className="w-12 text-center text-gray-900 font-medium">
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      {/* Total Price */}
      <div className="text-right min-w-0">
        <div className="text-lg font-bold text-blue-600">
          {formatPrice(item.price * item.quantity)}
        </div>
        <div className="text-sm text-gray-500">
          {item.quantity} × {formatPrice(item.price)}
        </div>
      </div>
      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.productId)}
        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
        title="Xóa sản phẩm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};
