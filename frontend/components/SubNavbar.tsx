"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export default function SubNavbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const pathname = usePathname();

  // Categories data
  const categories: Category[] = [
    { id: 'mic', name: 'Mic', slug: 'micro', icon: '🎤', description: 'Micro Phone' },
    { id: 'loa', name: 'Loa', slug: 'loa', icon: '🔊', description: 'Loa & Loa Sub' },
    { id: 'mixer', name: 'Mixer / Vang số', slug: 'mixer-vang-so', icon: '🎚️', description: 'Mixer / Vang Số' },
    { id: 'thanh-ly', name: 'Thanh lý', slug: 'thanh-ly', icon: '🏷️', description: 'Sản phẩm thanh lý' },
  ];

  // Show subnavbar when on products page or category pages
  useEffect(() => {
    const shouldShow = pathname.startsWith('/products') || 
                      pathname.startsWith('/categories') ||
                      pathname === '/';
    setIsVisible(shouldShow);
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div className="bg-gray-50 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Categories */}
          <div className="flex items-center space-x-6 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 hover:bg-white hover:shadow-sm ${
                  activeCategory === category.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <span className="text-base">{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-4">
            {/* Featured Products */}
            <Link
              href="/products?featured=true"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <span>⭐</span>
              <span className="hidden sm:inline">Sản phẩm nổi bật</span>
            </Link>

            {/* New Arrivals */}
            <Link
              href="/products?new=true"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
            >
              <span>🆕</span>
              <span className="hidden sm:inline">Hàng mới</span>
            </Link>

            {/* Sale */}
            <Link
              href="/products?sale=true"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span>🏷️</span>
              <span className="hidden sm:inline">Khuyến mãi</span>
            </Link>
          </div>
        </div>

        {/* Category Dropdown (Desktop) */}
        {activeCategory && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <span className="text-xl">{category.icon}</span>
                      <span>{category.name}</span>
                    </h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                    <div className="flex space-x-2">
                      <Link
                        href={`/products?category=${category.slug}`}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Xem tất cả →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

