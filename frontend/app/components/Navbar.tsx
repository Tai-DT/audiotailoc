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
    { href: '/categories', label: 'Danh mục', icon: '📂' },
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
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
            : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-105 transition-transform">
                  🎵
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold text-gray-900">Audio Tài Lộc</span>
                  <div className="text-xs text-gray-500">Nâng tầm âm thanh</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation (Shadcn NavigationMenu) */}
            <div className="hidden lg:flex items-center">
              <NavigationMenu viewport={false}>
                <NavigationMenuList>
                  {navigationItems.map((item) => (
                    <NavigationMenuItem key={item.href}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? 'bg-accent text-accent-foreground'
                              : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <SearchSuggestions
                onSearch={(query) => {
                  if (typeof window !== 'undefined') {
                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                  }
                }}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full"
              />
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Language Switcher */}
              <LanguageSwitcher currentLocale="vi" className="hidden sm:block" />
              
              {/* Notifications */}
              <NotificationCenter userId="user-id-placeholder" />
              
              {/* Cart */}
              <Link href="/cart" className="relative">
                <Button variant="secondary" size="icon" className="relative">
                  <span className="text-lg">🛒</span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    0
                  </span>
                </Button>
                <span className="sr-only">Giỏ hàng</span>
              </Link>

              {/* User Menu */}
              <div className="relative hidden sm:block">
                <Link href="/login">
                  <Button className="gap-2">
                    <span>👤</span>
                    <span>Đăng nhập</span>
                  </Button>
                </Link>
              </div>

              {/* Mobile menu button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <span className="text-xl">☰</span>
                    <span className="sr-only">Mở menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="p-4 space-y-4">
                    {/* Mobile Search */}
                    <SearchSuggestions
                      onSearch={(query) => {
                        if (typeof window !== 'undefined') {
                          window.location.href = `/search?q=${encodeURIComponent(query)}`;
                        }
                      }}
                      placeholder="Tìm kiếm sản phẩm..."
                      className="w-full"
                    />

                    {/* Mobile Navigation Items */}
                    <nav className="space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? 'bg-accent text-accent-foreground'
                              : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ))}

                      {/* Mobile Login */}
                      <Link href="/login">
                        <Button className="w-full gap-2">
                          <span>👤</span>
                          <span>Đăng nhập</span>
                        </Button>
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

      </header>
    </>
  );
}
