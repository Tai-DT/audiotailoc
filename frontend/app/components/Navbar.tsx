"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import SearchSuggestions from './SearchSuggestions';
import NotificationCenter from './NotificationCenter';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { href: '/', label: 'Trang chủ', icon: '🏠' },
    { href: '/products', label: 'Sản phẩm', icon: '🎵' },
    { href: '/categories', label: 'Danh mục', icon: '��' },
    { href: '/services', label: 'Dịch vụ', icon: '🔧' },
    { href: '/projects', label: 'Dự án', icon: '🏗️' },
    { href: '/booking', label: 'Đặt lịch', icon: '📅' },
    { href: '/about', label: 'Giới thiệu', icon: 'ℹ️' },
    { href: '/support', label: 'Hỗ trợ', icon: '💬' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl">🎵</div>
              <span className="text-xl font-bold text-gray-900">Audio Tài Lộc</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavigationMenu>
                <NavigationMenuList>
                  {navigationItems.map((item) => (
                    <NavigationMenuItem key={item.href}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? 'text-blue-600 bg-blue-50'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          }`}
                        >
                          <span className="mr-1">{item.icon}</span>
                          {item.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search */}
              <div className="w-64">
                <SearchSuggestions
                  onSearch={(query) => {
                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                  }}
                  placeholder="Tìm kiếm sản phẩm..."
                />
              </div>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Notifications */}
              <NotificationCenter />

              {/* Cart */}
              <Button asChild variant="outline" size="sm">
                <Link href="/cart" className="flex items-center space-x-1">
                  <span>🛒</span>
                  <span>Giỏ hàng</span>
                </Link>
              </Button>

              {/* Login/Register */}
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <span className="text-xl">☰</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {/* Mobile Search */}
                    <div className="mb-6">
                      <SearchSuggestions
                        onSearch={(query) => {
                          setIsMobileMenuOpen(false);
                          window.location.href = `/search?q=${encodeURIComponent(query)}`;
                        }}
                        placeholder="Tìm kiếm..."
                      />
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? 'text-blue-600 bg-blue-50'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </nav>

                    {/* Mobile Actions */}
                    <div className="pt-4 border-t space-y-2">
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                          <span className="mr-2">🛒</span>
                          Giỏ hàng
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="w-full justify-start">
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          Đăng nhập
                        </Link>
                      </Button>
                      <Button asChild className="w-full justify-start">
                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                          Đăng ký
                        </Link>
                      </Button>
                    </div>

                    {/* Language Switcher Mobile */}
                    <div className="pt-4 border-t">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
