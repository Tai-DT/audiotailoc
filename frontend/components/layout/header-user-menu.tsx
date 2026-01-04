'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { useAuth, useLogout } from '@/lib/hooks/use-auth';
import { useWishlistCount } from '@/lib/hooks/use-wishlist';

export function HeaderUserMenu() {
  const [isMounted, setIsMounted] = useState(false);
  const { data: user } = useAuth() as { data?: { id?: string; name?: string; email?: string; avatar?: string } | null };
  const logoutMutation = useLogout();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAuthenticated = isMounted && !!user;
  const { data: wishlistCount } = useWishlistCount({ enabled: isAuthenticated });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Server render / not mounted - show placeholder
  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" aria-label="Đang tải menu người dùng">
        <User className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </Button>
    );
  }

  // Authenticated user
  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Wishlist */}
        <Link href="/wishlist" className="relative group" aria-label="Danh sách yêu thích">
          <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" aria-label="Xem danh sách yêu thích">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            {wishlistCount?.count && wishlistCount.count > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-warning text-warning-foreground"
                aria-label={`${wishlistCount.count} sản phẩm yêu thích`}
              >
                {wishlistCount.count}
              </Badge>
            )}
          </Button>
        </Link>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full" aria-label="Menu tài khoản">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                <AvatarImage src={user?.avatar} alt={user?.name || 'Avatar người dùng'} />
                <AvatarFallback aria-hidden="true">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Trang cá nhân</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders" className="cursor-pointer">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>Đơn hàng</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/wishlist" className="cursor-pointer">
                <Heart className="mr-2 h-4 w-4" />
                <span>Danh sách yêu thích</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Not authenticated - show login popover
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 hover:bg-primary/10">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">Tài khoản</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="p-4 space-y-3 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          <div className="space-y-1">
            <p className="text-sm font-semibold">Chào mừng bạn!</p>
            <p className="text-xs text-muted-foreground">Đăng nhập để trải nghiệm đầy đủ</p>
          </div>
          <div className="flex flex-col gap-2">
            <ShimmerButton
              className="w-full h-9 text-sm"
              shimmerColor="oklch(0.99 0.005 45)"
              shimmerSize="0.1em"
              borderRadius="0.5rem"
              background="oklch(0.58 0.28 20)"
              onClick={() => window.location.href = '/auth/login'}
            >
              <span className="flex items-center justify-center text-white">
                <User className="h-4 w-4 mr-2" />
                Đăng nhập
              </span>
            </ShimmerButton>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/register" className="flex items-center justify-center">
                Đăng ký tài khoản
              </Link>
            </Button>
          </div>
          <div className="pt-2 border-t text-xs text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">Lợi ích khi đăng ký:</p>
            <ul className="space-y-0.5">
              <li>• Miễn phí vận chuyển từ 500k</li>
              <li>• Ưu đãi đặc biệt</li>
              <li>• Tư vấn kỹ thuật 24/7</li>
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
