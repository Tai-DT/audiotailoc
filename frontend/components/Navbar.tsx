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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SearchSuggestions from './SearchSuggestions';
import NotificationCenter from './NotificationCenter';
import LanguageSwitcher from './LanguageSwitcher';
import { User, LogOut, Settings, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check user authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!base) return;

        const response = await fetch(`${base}/users/profile`, {
          credentials: 'include'
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) return;

      await fetch(`${base}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = [
    { href: '/', label: 'Trang chủ', icon: '🏠' },
    { href: '/products', label: 'Sản phẩm', icon: '🎵' },
    { href: '/categories', label: 'Danh mục', icon: '📂' },
    { href: '/ai-tools', label: 'AI Tools', icon: '🤖' },
    { href: '/services', label: 'Dịch vụ', icon: '🔧' },
    { href: '/projects', label: 'Dự án', icon: '🏗️' },
    { href: '/booking', label: 'Đặt lịch', icon: '📅' },
    { href: '/orders', label: 'Đơn hàng', icon: '📦' },
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
              <LanguageSwitcher currentLocale="vi" />

              {/* Notifications */}
              <NotificationCenter />

              {/* Cart */}
              <Link href="/cart" className="flex items-center space-x-1">
                <Button variant="outline" size="sm">
                  <span>🛒</span>
                  <span>Giỏ hàng</span>
                </Button>
              </Link>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Tài khoản
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Đơn hàng
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=settings" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Cài đặt
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Đăng nhập</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Đăng ký</Button>
                  </Link>
                </div>
              )}
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
                      <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <span className="mr-2">🛒</span>
                          Giỏ hàng
                        </Button>
                      </Link>
                      
                      {user ? (
                        <>
                          <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              <User className="h-4 w-4 mr-2" />
                              Tài khoản
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Đăng xuất
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              Đăng nhập
                            </Button>
                          </Link>
                          <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button className="w-full justify-start">
                              Đăng ký
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Language Switcher Mobile */}
                    <div className="pt-4 border-t">
                      <LanguageSwitcher currentLocale="vi" />
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
